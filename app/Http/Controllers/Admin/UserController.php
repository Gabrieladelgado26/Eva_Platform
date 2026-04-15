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
use App\Models\Ova;
use App\Models\Course;
use App\Models\OvaProgress;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class UserController extends Controller
{
    /**
     * Dashboard principal con gráficas y estadísticas
     */
    public function dashboard(Request $request)
    {
        // Estadísticas completas para el dashboard
        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)->count();
        $inactiveUsers = $totalUsers - $activeUsers;
        
        $totalStudents = User::whereHas('role', fn($q) => $q->where('slug', 'student'))->count();
        $totalTeachers = User::whereHas('role', fn($q) => $q->where('slug', 'teacher'))->count();
        $totalAdmins = User::whereHas('role', fn($q) => $q->where('slug', 'admin'))->count();
        
        // Datos reales para gráficas y estadísticas
        $totalOVAs     = Ova::count();
        $activeCourses = Course::where('is_active', true)->count();

        // OvaProgress solo existe si la tabla ya fue migrada
        $hasProgressTable = Schema::hasTable('ova_progress');
        $completedActs    = $hasProgressTable ? OvaProgress::where('completed', true)->count() : 0;
        $avgProgress      = $hasProgressTable ? (int) round(OvaProgress::avg('progress_percentage') ?? 0) : 0;

        $userGrowth    = $this->getUserGrowthData();
        $monthlyActivity = $this->getMonthlyActivityData();
        $activityLogs  = $this->getRecentActivities();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers'          => $totalUsers,
                'activeUsers'         => $activeUsers,
                'inactiveUsers'       => $inactiveUsers,
                'totalStudents'       => $totalStudents,
                'totalTeachers'       => $totalTeachers,
                'totalAdmins'         => $totalAdmins,
                'totalOVAs'           => $totalOVAs,
                'completedActivities' => $completedActs,
                'avgProgress'         => $avgProgress,
                'activeCourses'       => $activeCourses,
            ],
            'activityLogs' => $activityLogs,
            'userGrowth'   => $userGrowth,
            'roleDistribution' => [
                ['name' => 'Estudiantes',     'value' => $totalStudents, 'color' => '#540D6E'],
                ['name' => 'Docentes',        'value' => $totalTeachers, 'color' => '#EE4266'],
                ['name' => 'Administradores', 'value' => $totalAdmins,   'color' => '#FFD23F'],
            ],
            'monthlyActivity' => $monthlyActivity,
        ]);
    }

    /**
     * Lista de Personal (Administradores y Docentes)
     */
    public function staff(Request $request)
    {
        $users = User::with('role')
            ->whereHas('role', function($query) {
                $query->whereIn('slug', ['admin', 'teacher']);
            })
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ? [
                        'name' => $user->role->name,
                        'slug' => $user->role->slug,
                    ] : null,
                    'role_id' => $user->role_id,
                    'is_active' => $user->is_active,
                    'created_at' => $user->created_at->format('Y-m-d'),
                ];
            });

        // Estadísticas para personal
        $totalStaff = User::whereHas('role', function($q) {
            $q->whereIn('slug', ['admin', 'teacher']);
        })->count();
        
        $activeStaff = User::whereHas('role', function($q) {
            $q->whereIn('slug', ['admin', 'teacher']);
        })->where('is_active', true)->count();
        
        $totalAdmins = User::whereHas('role', function($q) {
            $q->where('slug', 'admin');
        })->count();
        
        $totalTeachers = User::whereHas('role', function($q) {
            $q->where('slug', 'teacher');
        })->count();

        return Inertia::render('Admin/Users/Staff', [
            'users' => $users,
            'stats' => [
                'total' => $totalStaff,
                'active' => $activeStaff,
                'admins' => $totalAdmins,
                'teachers' => $totalTeachers,
            ]
        ]);
    }

    /**
     * Vista de estudiantes
     */
    public function students(Request $request)
    {
        $users = User::with('role')
            ->whereHas('role', function($query) {
                $query->where('slug', 'student');
            })
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
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

        // Estadísticas para estudiantes
        $totalStudents = User::whereHas('role', function($q) {
            $q->where('slug', 'student');
        })->count();
        
        $activeStudents = User::whereHas('role', function($q) {
            $q->where('slug', 'student');
        })->where('is_active', true)->count();

        return Inertia::render('Admin/Users/Students', [
            'users' => $users,
            'stats' => [
                'total' => $totalStudents,
                'active' => $activeStudents,
                'avg_per_group' => 0,
            ]
        ]);
    }

    public function create(Request $request)
    {
        $preselectedRole = $request->query('role');
        
        return Inertia::render('Admin/Users/Create', [
            'roles' => Role::all(),
            'preselectedRole' => $preselectedRole
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
                ->route('admin.students')
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

        // Redirigir según el rol
        if ($role->slug === 'student') {
            return redirect()->route('admin.students')->with('success', 'Estudiante creado correctamente.');
        }
        
        return redirect()->route('admin.staff')->with('success', 'Personal creado correctamente.');
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

        // Redirigir según el nuevo rol
        if ($role->slug === 'student') {
            return redirect()->route('admin.students')->with('success', 'Estudiante actualizado correctamente');
        }
        
        return redirect()->route('admin.staff')->with('success', 'Personal actualizado correctamente');
    }

    public function destroy(User $user)
    {
        $isAdmin = $user->role?->slug === 'admin';
        $isStudent = $user->role?->slug === 'student';

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

        // Redirigir según el rol del usuario eliminado
        if ($isStudent) {
            return redirect()->route('admin.students')->with('success', 'Estudiante eliminado correctamente.');
        }
        
        return redirect()->route('admin.staff')->with('success', 'Personal eliminado correctamente.');
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

        // Determinar la ruta de redirección basada en el rol del usuario
        $isStudent = $user->role?->slug === 'student';
        $route = $isStudent ? 'admin.students' : 'admin.staff';
        
        return redirect()->route($route)->with('success', 'Estado del usuario actualizado correctamente');
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

    // ─── Métodos auxiliares con datos reales ────────────────────────────────

    /**
     * Crecimiento de usuarios: acumulado por mes en el año actual.
     */
    private function getUserGrowthData(): array
    {
        $monthLabels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        $year = Carbon::now()->year;

        // Usuarios registrados por mes (año actual)
        $byMonth = User::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereYear('created_at', $year)
            ->groupBy('month')
            ->pluck('total', 'month')
            ->toArray();

        $activeByMonth = User::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereYear('created_at', $year)
            ->where('is_active', true)
            ->groupBy('month')
            ->pluck('total', 'month')
            ->toArray();

        $result = [];
        $cumUsers  = 0;
        $cumActive = 0;
        // Base: usuarios creados antes del año actual
        $baseTotal  = User::whereYear('created_at', '<', $year)->count();
        $baseActive = User::whereYear('created_at', '<', $year)->where('is_active', true)->count();
        $cumUsers  = $baseTotal;
        $cumActive = $baseActive;

        foreach (range(1, 12) as $m) {
            $cumUsers  += $byMonth[$m]  ?? 0;
            $cumActive += $activeByMonth[$m] ?? 0;
            $result[] = [
                'month'  => $monthLabels[$m - 1],
                'users'  => $cumUsers,
                'active' => $cumActive,
            ];
        }

        return $result;
    }

    /**
     * Actividad mensual: OVAs completadas e iniciadas por mes (últimos 6 meses).
     * Si la tabla ova_progress no existe aún, devuelve ceros.
     */
    private function getMonthlyActivityData(): array
    {
        $monthLabels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        $months = collect(range(5, 0))->map(fn($i) => Carbon::now()->subMonths($i));
        $hasTable = Schema::hasTable('ova_progress');

        return $months->map(function (Carbon $date) use ($monthLabels, $hasTable) {
            $y = $date->year;
            $m = $date->month;

            $completed = $hasTable
                ? OvaProgress::whereYear('updated_at', $y)->whereMonth('updated_at', $m)->where('completed', true)->count()
                : 0;

            $started = $hasTable
                ? OvaProgress::whereYear('created_at', $y)->whereMonth('created_at', $m)->count()
                : 0;

            return [
                'month'     => $monthLabels[$m - 1],
                'ovas'      => $completed,
                'iniciadas' => $started,
            ];
        })->values()->toArray();
    }

    /**
     * Últimas 5 entradas del audit log con usuario real.
     */
    private function getRecentActivities(): array
    {
        $actionIcons = [
            'created'         => '➕',
            'updated'         => '✏️',
            'deleted'         => '🗑️',
            'login'           => '🔑',
            'toggle_status'   => '🔄',
            'regenerate_pin'  => '🔐',
        ];

        $logs = AuditLog::with('performedBy')
            ->latest()
            ->take(5)
            ->get();

        if ($logs->isEmpty()) {
            return [];
        }

        return $logs->map(function ($log) use ($actionIcons) {
            $userName = $log->performedBy?->name ?? 'Sistema';
            $icon     = $actionIcons[$log->action] ?? '📋';
            $diff     = Carbon::parse($log->created_at)->diffForHumans();

            // Construir etiqueta legible de la acción
            $actionLabels = [
                'created'        => 'Registró',
                'updated'        => 'Actualizó',
                'deleted'        => 'Eliminó',
                'login'          => 'Inició sesión',
                'toggle_status'  => 'Cambió estado',
                'regenerate_pin' => 'Regeneró PIN',
            ];
            $actionLabel = $actionLabels[$log->action] ?? ucfirst($log->action);

            $target = $log->auditable_type
                ? class_basename($log->auditable_type) . ' #' . ($log->auditable_id ?? '')
                : '—';

            return [
                'id'     => $log->id,
                'user'   => $userName,
                'action' => $actionLabel,
                'target' => $target,
                'time'   => $diff,
                'icon'   => $icon,
            ];
        })->toArray();
    }
}