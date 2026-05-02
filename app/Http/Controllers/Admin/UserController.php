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
use App\Models\Evaluation;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
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

        // Area filter from query params
        $areaFilter = $request->query('area');

        // OvaProgress solo existe si la tabla ya fue migrada
        $hasProgressTable  = Schema::hasTable('ova_progress');
        $hasEvalTable      = Schema::hasTable('evaluations');

        // OVAs completadas = combinaciones únicas (estudiante, OVA) con al menos una evaluación
        $completedActs     = $this->getCompletedActivitiesCount($hasEvalTable, $areaFilter);

        // Progreso promedio: (distinct student-OVA pairs with at least one evaluation) / (totalStudents × totalOVAs) × 100
        $avgProgress       = $this->getAverageProgress($hasEvalTable, $totalStudents, $totalOVAs, $areaFilter);

        // Completadas OVAs count
        $completedOvasCount = $completedActs;

        $userGrowth    = $this->getUserGrowthData();
        $monthlyActivity = $this->getMonthlyActivityData($areaFilter);
        $peakHours     = $this->getPeakHoursData($hasEvalTable, $areaFilter);
        $ovaPerformanceByArea = $this->getOvaPerformanceByArea($hasEvalTable);
        $availableAreas = $this->getAvailableAreas();
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
                'completedOvasCount'  => $completedOvasCount,
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
            'peakHours' => $peakHours,
            'ovaPerformanceByArea' => $ovaPerformanceByArea,
            'availableAreas' => $availableAreas,
            'selectedArea' => $areaFilter,
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
                    'id' => $user->getRouteKey(),
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

// app/Http/Controllers/Admin/UserController.php

/**
 * Vista de estudiantes con avatar incluido
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
                'id' => $user->getRouteKey(),
                'name' => $user->name,
                'username' => $user->username,
                'avatar' => $user->avatar,
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
        $monthExpr = DB::connection()->getDriverName() === 'sqlite'
            ? "CAST(strftime('%m', created_at) AS INTEGER) as month"
            : "MONTH(created_at) as month";

        $byMonth = User::selectRaw("{$monthExpr}, COUNT(*) as total")
            ->whereYear('created_at', $year)
            ->groupBy('month')
            ->pluck('total', 'month')
            ->toArray();

        $activeByMonth = User::selectRaw("{$monthExpr}, COUNT(*) as total")
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
     *
     * "OVAs completadas" = combinaciones únicas (user_id, ova_id) cuya PRIMERA
     *  evaluación ocurrió en ese mes. Un segundo intento NO cuenta como un OVA nuevo.
     *
     * "OVAs iniciadas"   = registros de ova_progress creados ese mes (si existe la tabla).
     */
    private function getMonthlyActivityData($areaFilter = null): array
    {
        $monthLabels      = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        $months           = collect(range(5, 0))->map(fn($i) => Carbon::now()->subMonths($i));
        $hasProgressTable = Schema::hasTable('ova_progress');
        $hasEvalTable     = Schema::hasTable('evaluations');

        // Primera evaluación por par (user_id, ova_id) → determina en qué mes "completó" el OVA
        $completionsByYearMonth = [];
        if ($hasEvalTable) {
            $query = DB::table('evaluations')
                ->selectRaw('user_id, ova_id, MIN(created_at) AS first_eval')
                ->groupBy('user_id', 'ova_id');

            // Apply area filter if provided
            if ($areaFilter) {
                $query->whereIn('ova_id', function ($subquery) use ($areaFilter) {
                    $subquery->select('id')
                        ->from('ovas')
                        ->where('area', $areaFilter);
                });
            }

            $rows = $query->get();

            foreach ($rows as $row) {
                $date = Carbon::parse($row->first_eval);
                $completionsByYearMonth[$date->year][$date->month]
                    = ($completionsByYearMonth[$date->year][$date->month] ?? 0) + 1;
            }
        }

        return $months->map(function (Carbon $date) use (
            $monthLabels, $hasProgressTable, $hasEvalTable, $completionsByYearMonth, $areaFilter
        ) {
            $y = $date->year;
            $m = $date->month;

            $completed = $completionsByYearMonth[$y][$m] ?? 0;

            $started = 0;
            if ($hasProgressTable) {
                $progressQuery = OvaProgress::whereYear('created_at', $y)
                    ->whereMonth('created_at', $m);

                if ($areaFilter) {
                    $progressQuery->whereIn('ova_id', function ($subquery) use ($areaFilter) {
                        $subquery->select('id')
                            ->from('ovas')
                            ->where('area', $areaFilter);
                    });
                }

                $started = $progressQuery->count();
            }

            return [
                'month'     => $monthLabels[$m - 1],
                'ovas'      => $completed,
                'iniciadas' => $started,
            ];
        })->values()->toArray();
    }

    /**
     * Últimas 10 entradas del audit log con usuario real y nombre del afectado.
     */
    private function getRecentActivities(): array
    {
        // Etiquetas en español para cada tipo de acción registrada
        $actionLabels = [
            'created_user'     => 'Creó usuario',
            'updated_user'     => 'Actualizó usuario',
            'deleted_user'     => 'Eliminó usuario',
            'user_activated'   => 'Activó usuario',
            'user_deactivated' => 'Desactivó usuario',
            'pin_regenerated'  => 'Regeneró PIN',
            'created'          => 'Creó',
            'updated'          => 'Actualizó',
            'deleted'          => 'Eliminó',
            'login'            => 'Inició sesión',
            'toggle_status'    => 'Cambió estado',
            'regenerate_pin'   => 'Regeneró PIN',
        ];

        $logs = AuditLog::with(['performedBy', 'auditable'])
            ->latest()
            ->take(10)
            ->get();

        if ($logs->isEmpty()) {
            return [];
        }

        return $logs->map(function ($log) use ($actionLabels) {
            $performer   = $log->performedBy?->name ?? 'Sistema';
            $actionLabel = $actionLabels[$log->action]
                ?? ucfirst(str_replace('_', ' ', $log->action));
            $diff        = Carbon::parse($log->created_at)->diffForHumans();

            // Nombre del usuario afectado por la acción
            $affectedName = null;
            if ($log->auditable instanceof User) {
                // Modelo todavía existe en BD
                $affectedName = $log->auditable->name;
            } elseif (!empty($log->new_values['name'])) {
                // Guardado en new_values (p.ej. al crear)
                $affectedName = $log->new_values['name'];
            } elseif (!empty($log->old_values['name'])) {
                // Guardado en old_values (p.ej. al eliminar)
                $affectedName = $log->old_values['name'];
            }

            return [
                'id'            => $log->id,
                'user'          => $performer,              // quien realizó la acción
                'action'        => $actionLabel,            // qué hizo
                'target'        => $affectedName ?? '—',   // nombre del usuario afectado
                'time'          => $diff,
                'created_at'    => $log->created_at,
            ];
        })->toArray();
    }

    /**
     * Completed activities count: distinct (user_id, ova_id) pairs with at least one evaluation
     */
    private function getCompletedActivitiesCount($hasEvalTable, $areaFilter = null): int
    {
        if (!$hasEvalTable) {
            return 0;
        }

        // Contar pares (user_id, ova_id) únicos — usando subquery para compatibilidad SQLite/MySQL
        $pairsQuery = DB::table('evaluations')
            ->select('user_id', 'ova_id')
            ->distinct();

        if ($areaFilter) {
            $pairsQuery->whereIn('ova_id', function ($subquery) use ($areaFilter) {
                $subquery->select('id')
                    ->from('ovas')
                    ->where('area', $areaFilter);
            });
        }

        $query = DB::table($pairsQuery, 'pairs')
            ->selectRaw('COUNT(*) as count');

        return (int) ($query->first()?->count ?? 0);
    }

    /**
     * Average progress: (distinct student-OVA pairs with at least one evaluation) / (totalStudents × totalOVAs) × 100
     * If totalStudents or totalOVAs is 0, return 0
     */
    private function getAverageProgress($hasEvalTable, $totalStudents, $totalOVAs, $areaFilter = null): int
    {
        if (!$hasEvalTable || $totalStudents === 0 || $totalOVAs === 0) {
            return 0;
        }

        // Count of distinct (student, OVA) pairs with at least one evaluation
        $completedCount = $this->getCompletedActivitiesCount($hasEvalTable, $areaFilter);

        // If filtering by area, adjust totalOVAs to only count OVAs in that area
        $ovasForCalculation = $totalOVAs;
        if ($areaFilter) {
            $ovasForCalculation = Ova::where('area', $areaFilter)->count();
        }

        if ($ovasForCalculation === 0) {
            return 0;
        }

        $denominator = $totalStudents * $ovasForCalculation;

        if ($denominator === 0) {
            return 0;
        }

        return (int) round(($completedCount / $denominator) * 100);
    }

    /**
     * Peak hours: group evaluations by hour (0-23), return 4 time blocks with top hours
     * Hours grouped into: Madrugada (0-5), Mañana (6-11), Tarde (12-17), Noche (18-23)
     */
    private function getPeakHoursData($hasEvalTable, $areaFilter = null): array
    {
        if (!$hasEvalTable) {
            return [];
        }

        // Define time blocks
        $timeBlocks = [
            'Madrugada' => [0, 1, 2, 3, 4, 5],
            'Mañana'    => [6, 7, 8, 9, 10, 11],
            'Tarde'     => [12, 13, 14, 15, 16, 17],
            'Noche'     => [18, 19, 20, 21, 22, 23],
        ];

        $hoursData = [];

        // Get evaluations grouped by hour
        $hourExpr = DB::connection()->getDriverName() === 'sqlite'
            ? "CAST(strftime('%H', created_at) AS INTEGER) as hour"
            : "HOUR(created_at) as hour";

        $query = DB::table('evaluations')
            ->selectRaw("{$hourExpr}, COUNT(*) as count")
            ->groupBy('hour');

        if ($areaFilter) {
            $query->whereIn('ova_id', function ($subquery) use ($areaFilter) {
                $subquery->select('id')
                    ->from('ovas')
                    ->where('area', $areaFilter);
            });
        }

        $hourCounts = $query->pluck('count', 'hour')->toArray();

        // Aggregate by time block
        foreach ($timeBlocks as $blockName => $hours) {
            $blockCount = 0;
            foreach ($hours as $hour) {
                $blockCount += $hourCounts[$hour] ?? 0;
            }

            if ($blockCount > 0) {
                $hoursData[] = [
                    'hour' => $blockName,
                    'label' => $blockName,
                    'count' => $blockCount,
                ];
            }
        }

        if (empty($hoursData)) {
            return [];
        }

        // Find max count for percentage calculation
        $maxCount = max(array_column($hoursData, 'count'));

        // Calculate percentages
        foreach ($hoursData as &$item) {
            $item['pct'] = (int) round(($item['count'] / $maxCount) * 100);
        }

        // Return all 4 blocks (ordered)
        $orderedBlockNames = ['Madrugada', 'Mañana', 'Tarde', 'Noche'];
        $result = [];
        foreach ($orderedBlockNames as $blockName) {
            foreach ($hoursData as $item) {
                if ($item['hour'] === $blockName) {
                    $result[] = $item;
                    break;
                }
            }
        }

        return $result;
    }

    /**
     * OVA performance by area: average percentage for first attempts only
     */
    private function getOvaPerformanceByArea($hasEvalTable): array
    {
        if (!$hasEvalTable) {
            return [];
        }

        // Get average score/total ratio for first attempts grouped by area
        $results = DB::table('evaluations')
            ->selectRaw('ovas.area, COUNT(*) as count, AVG(CAST(evaluations.score AS FLOAT) / CAST(evaluations.total AS FLOAT) * 100) as avg')
            ->join('ovas', 'evaluations.ova_id', '=', 'ovas.id')
            ->where('evaluations.attempt', 1)
            ->groupBy('ovas.area')
            ->orderByDesc('avg')
            ->get();

        return $results->map(function ($row) {
            return [
                'area' => $row->area,
                'avg' => (int) round($row->avg),
                'count' => (int) $row->count,
            ];
        })->toArray();
    }

    /**
     * Available areas: distinct list of OVA areas
     */
    private function getAvailableAreas(): array
    {
        return Ova::distinct()
            ->pluck('area')
            ->filter(fn($area) => !empty($area))
            ->values()
            ->toArray();
    }
}