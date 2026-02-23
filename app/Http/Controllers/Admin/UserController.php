<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use App\Models\AuditLog;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $section = $request->get('section', 'users');

        $users = User::with('role')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($user) {
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

        return Inertia::render('Admin/Index', [
            'users' => $users,
            'section' => $section,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    public function create()
    {
        $roles = Role::all();

        return Inertia::render('Admin/Users/Create', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $role = Role::findOrFail($request->role_id);

        if ($role->slug === 'student') {

            $request->validate([
                'name' => ['required', 'string', 'max:255'],
            ]);

            // Generar username automático
            $baseUsername = Str::slug($request->name);
            $username = $baseUsername;
            $counter = 1;

            while (User::where('username', $username)->exists()) {
                $username = $baseUsername . $counter;
                $counter++;
            }

            // Generar PIN aleatorio de 4 dígitos
            $generatedPin = random_int(1000, 9999);

            $user = User::create([
                'name' => $request->name,
                'username' => $username,
                'pin' => Hash::make($generatedPin),
                'role_id' => $role->id,
                'is_active' => true,
            ]);

            return redirect()
                ->route('admin.index', ['section' => 'users'])
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

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        return redirect()->route('admin.index', ['section' => 'users'])
            ->with('success', 'Usuario creado correctamente.');
    }

    public function edit(User $user)
    {
        $roles = Role::all();

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => $roles
        ]);
    }

    public function update(Request $request, User $user)
    {
        $role = Role::findOrFail($request->role_id);

        // Validación base
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Si es estudiante
        if ($role->slug === 'student') {

            $user->update([
                'name' => $request->name,
                'role_id' => $role->id,
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
            ];

            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            $user->update($data);
        }

        return redirect()
            ->route('admin.index', ['section' => 'users'])
            ->with('success', 'Usuario actualizado correctamente');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.index', ['section' => 'users'])->with('success', 'Usuario eliminado correctamente.');
    }

    public function toggleStatus(User $user)
    {
        $oldStatus = $user->is_active;

        if ($user->id === Auth::id() && $user->is_active) {

            $activeAdmins = User::whereHas('role', function ($q) {
                $q->where('slug', 'admin');
            })->where('is_active', true)->count();

            if ($activeAdmins <= 1) {
                return back()->with('error', 'No puedes desactivar el único administrador activo del sistema.');
            }
        }

        if ($oldStatus == true) {
            $user->update(['force_logout' => true]);
        }

        $user->update([
            'is_active' => !$user->is_active
        ]);

        AuditLog::create([
            'user_id' => $user->id,
            'performed_by' => Auth::id(),
            'action' => $oldStatus ? 'user_deactivated' : 'user_activated',
            'description' => $oldStatus
                ? "Usuario desactivado: {$user->email}"
                : "Usuario activado: {$user->email}",
        ]);

        return back()->with('success', 'Estado del usuario actualizado correctamente');
    }

    public function regeneratePin(User $user)
    {
        $generatedPin = random_int(1000, 9999);

        $user->update([
            'pin' => Hash::make($generatedPin)
        ]);

        AuditLog::create([
            'user_id' => $user->id,
            'performed_by' => Auth::id(),
            'action' => 'pin_regenerated',
            'description' => "PIN regenerado para el usuario {$user->username}",
        ]);

        return redirect()
            ->route('admin.index', ['section' => 'users'])
            ->with('credentials', [
                'username' => $user->username,
                'pin' => $generatedPin,
            ]);
    }
}
