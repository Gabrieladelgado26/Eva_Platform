<?php

namespace App\Http\Controllers\Admin;

use App\Mail\UserCreatedMail;
use App\Mail\UserEmailUpdatedMail;
use App\Mail\UserActivatedMail;
use App\Mail\UserDeactivatedMail;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Dashboard (listado de usuarios)
     */
    public function dashboard(Request $request)
    {
        $users = User::with('role')
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'username' => $user->username,
                    'role' => $user->role ? [
                        'name' => $user->role->name,
                        'slug' => $user->role->slug,
                    ] : null,
                    'role_id' => $user->role_id,
                    'is_active' => $user->is_active,
                    'created_at' => $user->created_at->format('Y-m-d'),
                ];
            });

        // Obtener estadísticas globales (sin paginación)
        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)->count();

        // Contar roles únicos que tienen al menos un usuario
        $uniqueRoles = User::whereHas('role')
            ->distinct('role_id')
            ->count('role_id');

        return Inertia::render('Admin/Dashboard', [
            'users' => $users,
            'stats' => [
                'total' => $totalUsers,
                'active' => $activeUsers,
                'unique_roles' => $uniqueRoles,
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => Role::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'role_id' => ['required', 'exists:roles,id'],
        ]);

        $role = Role::findOrFail($request->role_id);

        if ($role->slug === 'student') {

            $request->validate([
                'name' => ['required', 'string', 'max:255'],
            ]);

            $baseUsername = Str::slug($request->name);
            $username = $baseUsername;
            $counter = 1;

            while (User::where('username', $username)->exists()) {
                $username = $baseUsername . $counter++;
            }

            $generatedPin = random_int(1000, 9999);

            $user = User::create([
                'name' => $request->name,
                'username' => $username,
                'pin' => Hash::make($generatedPin),
                'role_id' => $role->id,
                'is_active' => true,
            ]);

            audit('created_user', $user, null, $user->toArray());

            return redirect()
                ->route('admin.dashboard', ['section' => 'users'])
                ->with('credentials', [
                    'username' => $username,
                    'pin' => $generatedPin,
                ]);
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $password = $request->password;

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($password),
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        audit('created_user', $user, null, $user->toArray());

        if (in_array($role->slug, ['admin', 'teacher'])) {
            Mail::to($user->email)->queue(
                new UserCreatedMail($user, $password)
            );
        }

        return redirect()
            ->route('admin.dashboard', ['section' => 'users'])
            ->with('success', 'Usuario creado correctamente.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => Role::all()
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'role_id' => ['required', 'exists:roles,id'],
            'name' => 'required|string|max:255',
        ]);

        $old = $user->getOriginal();
        $oldEmail = $user->email;
        $oldStatus = $user->is_active;

        $role = Role::findOrFail($request->role_id);

        $isAdmin = $user->role?->slug === 'admin';
        $isDeactivating = $request->has('is_active') && !$request->boolean('is_active');

        if ($isAdmin && $isDeactivating) {
            $activeAdmins = User::whereHas('role', fn($q) => $q->where('slug', 'admin'))
                ->where('is_active', true)
                ->count();

            if ($activeAdmins <= 1) {
                return back()->with([
                    'unique_admin_error' => true,
                    'unique_admin_name' => $user->name,
                    'unique_admin_action' => 'desactivar'
                ]);
            }
        }

        if ($role->slug === 'student') {

            $user->update([
                'name' => $request->name,
                'role_id' => $role->id,
                'is_active' => $request->has('is_active')
                    ? $request->boolean('is_active')
                    : $user->is_active,
            ]);
        } else {

            $request->validate([
                'email' => 'required|email|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:6',
            ]);

            $data = [
                'name' => $request->name,
                'email' => $request->email,
                'role_id' => $role->id,
                'is_active' => $request->boolean('is_active', $user->is_active),
            ];

            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            $user->update($data);
        }

        if ($user->wasChanged('email')) {
            Mail::to($user->email)->queue(
                new UserEmailUpdatedMail($user, $oldEmail)
            );
        }

        if ($oldStatus && !$user->is_active) {
            Mail::to($user->email)->queue(new UserDeactivatedMail($user));
        }

        if (!$oldStatus && $user->is_active) {
            Mail::to($user->email)->queue(new UserActivatedMail($user));
        }

        audit('updated_user', $user, $old, $user->getChanges());

        return redirect()
            ->route('admin.dashboard', ['section' => 'users'])
            ->with('success', 'Usuario actualizado correctamente');
    }

    public function destroy(User $user)
    {
        $isAdmin = $user->role?->slug === 'admin';

        if ($isAdmin && $user->is_active) {

            $activeAdmins = User::whereHas('role', fn($q) => $q->where('slug', 'admin'))
                ->where('is_active', true)
                ->count();

            if ($activeAdmins <= 1) {
                return back()->with([
                    'unique_admin_error' => true,
                    'unique_admin_name' => $user->name,
                    'unique_admin_action' => 'eliminar'
                ]);
            }
        }

        audit('deleted_user', $user, $user->toArray(), null);

        $user->delete();

        return redirect()
            ->route('admin.dashboard', ['section' => 'users'])
            ->with('success', 'Usuario eliminado correctamente.');
    }

    public function toggleStatus(User $user)
    {
        $oldStatus = $user->is_active;

        $isAdmin = $user->role?->slug === 'admin';

        if ($isAdmin && $oldStatus) {

            $activeAdmins = User::whereHas('role', fn($q) => $q->where('slug', 'admin'))
                ->where('is_active', true)
                ->count();

            if ($activeAdmins <= 1) {
                return back()->with([
                    'unique_admin_error' => true,
                    'unique_admin_name' => $user->name,
                    'unique_admin_action' => 'desactivar'
                ]);
            }
        }

        if ($oldStatus) {
            $user->update(['force_logout' => true]);
        }

        $user->update([
            'is_active' => !$oldStatus
        ]);

        Mail::to($user->email)->queue(
            $oldStatus
                ? new UserDeactivatedMail($user)
                : new UserActivatedMail($user)
        );

        audit(
            $oldStatus ? 'user_deactivated' : 'user_activated',
            $user,
            ['is_active' => $oldStatus],
            ['is_active' => $user->is_active]
        );

        return back()->with('success', 'Estado del usuario actualizado correctamente');
    }

    public function regeneratePin(User $user)
    {
        $generatedPin = random_int(1000, 9999);

        $user->update([
            'pin' => Hash::make($generatedPin)
        ]);

        audit('pin_regenerated', $user, null, ['pin_regenerated' => true]);

        return back()->with('credentials', [
            'username' => $user->username,
            'pin' => $generatedPin,
        ]);
    }
}
