<?php
// app/Http/Controllers/Teacher/CourseController.php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\User;
use App\Models\Ova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    public function index()
    {
        return $this->dashboard();
    }

    public function dashboard()
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->role->slug === 'teacher', 403);

        $courses = $user->courses()
            ->withCount('students')
            ->withCount('ovas')
            ->latest()
            ->get();

        return Inertia::render('Teacher/Dashboard', [
            'courses' => $courses,
            'teacher' => $user
        ]);
    }

    public function create()
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->role->slug === 'teacher', 403);

        return Inertia::render('Teacher/Courses/Create');
    }

    public function store(Request $request)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->role->slug === 'teacher', 403);

        $schoolYear = date('Y');

        $validated = $request->validate([
            'grade' => ['required', 'in:primero,segundo,tercero,cuarto,quinto'],
            'section' => ['required', 'string', 'max:10'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $exists = Course::where('teacher_id', $user->id)
            ->where('grade', $validated['grade'])
            ->where('section', $validated['section'])
            ->where('school_year', $schoolYear)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'grade' => 'Este curso ya está registrado para este año escolar.'
            ]);
        }

        $user->courses()->create([
            'grade' => $validated['grade'],
            'section' => $validated['section'],
            'description' => $validated['description'] ?? null,
            'school_year' => $schoolYear,
            'is_active' => true
        ]);

        return redirect()
            ->route('teacher.dashboard')
            ->with('success', 'Curso creado correctamente.');
    }

    public function show(Course $course)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->role->slug === 'teacher', 403);
        abort_unless($user->id === $course->teacher_id, 403);

        // Cargar estudiantes del curso
        $students = $course->students()
            ->select('users.id', 'users.name', 'users.username', 'users.email')
            ->get();

        // Cargar OVAs del curso con la relación correcta (SIN studentProgress)
        $courseOvas = $course->ovas()
            ->orderByPivot('order')
            ->get();

        // Obtener todas las OVAs disponibles para asignar
        $assignedOvaIds = $course->ovas()->pluck('ovas.id')->toArray();
        $availableOvas = Ova::active()
            ->whereNotIn('id', $assignedOvaIds)
            ->orderBy('area')
            ->get();

        return Inertia::render('Teacher/Courses/Index', [
            'course' => $course,
            'students' => $students,
            'courseOvas' => $courseOvas,
            'availableOvas' => $availableOvas
        ]);
    }

    public function edit(Course $course)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->id === $course->teacher_id, 403);

        return Inertia::render('Teacher/Courses/Edit', [
            'course' => $course
        ]);
    }

    public function update(Request $request, Course $course)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->id === $course->teacher_id, 403);

        $validated = $request->validate([
            'grade' => ['required', 'in:primero,segundo,tercero,cuarto,quinto'],
            'section' => ['required', 'string', 'max:10'],
            'description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean']
        ]);

        $course->update($validated);

        return redirect()
            ->route('teacher.dashboard')
            ->with('success', 'Curso actualizado correctamente.');
    }

    public function destroy(Course $course)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->id === $course->teacher_id, 403);

        DB::beginTransaction();
        try {
            // Eliminar relaciones primero
            $course->ovas()->detach();
            $course->students()->detach();
            $course->delete();

            DB::commit();
            return redirect()
                ->route('teacher.dashboard')
                ->with('success', 'Curso eliminado correctamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error al eliminar el curso: ' . $e->getMessage());
        }
    }

    public function toggleStatus(Course $course)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->id === $course->teacher_id, 403);

        $course->update([
            'is_active' => !$course->is_active
        ]);

        return back()->with('success', 'Estado del curso actualizado.');
    }

    /**
     * Asignar una OVA al curso
     */
    public function assignOva(Request $request, Course $course)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->id === $course->teacher_id, 403);

        $validated = $request->validate([
            'ova_id' => ['required', 'exists:ovas,id'],
            'is_required' => ['boolean'],
            'order' => ['nullable', 'integer']
        ]);

        // Verificar si ya está asignada
        if ($course->ovas()->where('ova_id', $validated['ova_id'])->exists()) {
            return back()->with('error', 'Esta OVA ya está asignada al curso.');
        }

        // Obtener el último orden si no se especifica
        if (!isset($validated['order'])) {
            $lastOrder = $course->ovas()->max('order') ?? -1;
            $validated['order'] = $lastOrder + 1;
        }

        // Asignar la OVA al curso
        $course->ovas()->attach($validated['ova_id'], [
            'order' => $validated['order'],
            'is_required' => $validated['is_required'] ?? true,
            'assigned_at' => now()
        ]);

        return back()->with('success', 'OVA asignada correctamente.');
    }

    /**
     * Asignar múltiples OVAs al curso
     */
    public function assignMultipleOvas(Request $request, Course $course)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->id === $course->teacher_id, 403);

        $validated = $request->validate([
            'ova_ids' => ['required', 'array'],
            'ova_ids.*' => ['exists:ovas,id']
        ]);

        $lastOrder = $course->ovas()->max('order') ?? -1;
        $assignedCount = 0;

        foreach ($validated['ova_ids'] as $ovaId) {
            // Verificar si ya está asignada
            if (!$course->ovas()->where('ova_id', $ovaId)->exists()) {
                $lastOrder++;
                $course->ovas()->attach($ovaId, [
                    'order' => $lastOrder,
                    'is_required' => true,
                    'assigned_at' => now()
                ]);
                $assignedCount++;
            }
        }

        return back()->with('success', "{$assignedCount} OVA(s) asignada(s) correctamente.");
    }

    /**
     * Remover una OVA del curso
     */
    public function removeOva(Course $course, Ova $ova)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->id === $course->teacher_id, 403);

        $course->ovas()->detach($ova->id);

        // Reordenar las OVAs restantes
        $remainingOvas = $course->ovas()->orderBy('order')->get();
        $order = 0;
        foreach ($remainingOvas as $remainingOva) {
            $course->ovas()->updateExistingPivot($remainingOva->id, ['order' => $order]);
            $order++;
        }

        return back()->with('success', 'OVA removida correctamente.');
    }

    /**
     * Actualizar el orden de las OVAs
     */
    public function updateOvaOrder(Request $request, Course $course)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->id === $course->teacher_id, 403);

        $validated = $request->validate([
            'ovas' => ['required', 'array'],
            'ovas.*.id' => ['required', 'exists:ovas,id'],
            'ovas.*.order' => ['required', 'integer']
        ]);

        try {
            foreach ($validated['ovas'] as $ovaData) {
                $course->ovas()->updateExistingPivot($ovaData['id'], [
                    'order' => $ovaData['order']
                ]);
            }
            return back()->with('success', 'Orden actualizado correctamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al actualizar el orden: ' . $e->getMessage());
        }
    }

    /**
     * Actualizar configuración de una OVA en el curso
     */
    public function updateOvaConfig(Request $request, Course $course, Ova $ova)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->id === $course->teacher_id, 403);

        $validated = $request->validate([
            'is_required' => ['boolean'],
            'order' => ['nullable', 'integer']
        ]);

        $updateData = [];
        if (isset($validated['is_required'])) {
            $updateData['is_required'] = $validated['is_required'];
        }
        if (isset($validated['order'])) {
            $updateData['order'] = $validated['order'];
        }

        if (!empty($updateData)) {
            $course->ovas()->updateExistingPivot($ova->id, $updateData);
        }

        return back()->with('success', 'Configuración de OVA actualizada.');
    }

    /**
     * Obtener estadísticas de progreso de OVAs para un curso
     */
    public function getOvaStats(Course $course)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->role->slug === 'teacher', 403);
        abort_unless($user->id === $course->teacher_id, 403);

        $stats = [
            'total_ovas' => $course->ovas()->count(),
            'total_students' => $course->students()->count(),
            'ovas_by_student' => [],
            'most_viewed_ovas' => [],
            'completion_rate' => 0
        ];

        // Progreso por estudiante
        $students = $course->students()->with(['ovaProgress' => function ($query) use ($course) {
            $query->whereIn('ova_id', $course->ovas()->pluck('ovas.id'));
        }])->get();

        foreach ($students as $student) {
            $stats['ovas_by_student'][$student->name] = [
                'completed' => $student->ovaProgress->where('completed', true)->count(),
                'total' => $stats['total_ovas'],
                'percentage' => $stats['total_ovas'] > 0
                    ? round(($student->ovaProgress->where('completed', true)->count() / $stats['total_ovas']) * 100)
                    : 0
            ];
        }

        // Calcular tasa de completación general
        $totalCompletions = 0;
        foreach ($students as $student) {
            $totalCompletions += $student->ovaProgress->where('completed', true)->count();
        }
        $stats['completion_rate'] = ($stats['total_ovas'] * $stats['total_students']) > 0
            ? round(($totalCompletions / ($stats['total_ovas'] * $stats['total_students'])) * 100)
            : 0;

        return response()->json($stats);
    }

    /**
     * Obtener OVAs disponibles (API endpoint)
     */
    public function getAvailableOvas(Course $course)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->id === $course->teacher_id, 403);

        $assignedOvaIds = $course->ovas()->pluck('ovas.id')->toArray();
        $availableOvas = Ova::active()
            ->whereNotIn('id', $assignedOvaIds)
            ->orderBy('area')
            ->get();

        return response()->json($availableOvas);
    }

    /**
     * Teacher analytics dashboard
     */
    public function analytics()
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->role->slug === 'teacher', 403);

        Log::info('=== TEACHER ANALYTICS DEBUG ===');
        Log::info('User ID: ' . $user->id);
        Log::info('User Name: ' . $user->name);

        try {
            // Obtener el curso seleccionado del request
            $selectedCourse = request('course', '');

            // Obtener cursos disponibles para el filtro
            $availableCourses = $user->courses()
                ->select('id', 'grade', 'section')
                ->orderBy('grade')
                ->orderBy('section')
                ->get()
                ->map(function ($course) {
                    $gradeNames = [
                        'primero' => 'Primero',
                        'segundo' => 'Segundo',
                        'tercero' => 'Tercero',
                        'cuarto' => 'Cuarto',
                        'quinto' => 'Quinto',
                    ];
                    return [
                        'id' => $course->id,
                        'name' => ($gradeNames[$course->grade] ?? $course->grade) . ' ' . $course->section,
                    ];
                });

            // Obtener IDs de cursos según el filtro
            if ($selectedCourse && is_numeric($selectedCourse)) {
                // Verificar que el curso pertenezca al profesor
                $course = $user->courses()->where('id', $selectedCourse)->first();
                if ($course) {
                    $courseIds = [$course->id];
                } else {
                    $courseIds = $user->courses()->pluck('id')->toArray();
                }
            } else {
                $courseIds = $user->courses()->pluck('id')->toArray();
            }

            Log::info('Teacher Course IDs: ', $courseIds);
            Log::info('Number of courses: ' . count($courseIds));

            if (empty($courseIds)) {
                Log::info('No courses found for teacher');
                return Inertia::render('Teacher/Analytics', [
                    'auth' => ['user' => $user],
                    'stats' => [
                        'totalCourses' => 0,
                        'activeCourses' => 0,
                        'totalStudents' => 0,
                        'totalOVAs' => 0,
                        'completedActivities' => 0,
                        'startedActivities' => 0,
                        'avgScore' => 0,
                        'avgProgress' => 0,
                    ],
                    'monthlyActivity' => [],
                    'peakHours' => [],
                    'ovaPerformanceByArea' => [],
                    'allAreas' => ['Matemáticas', 'Español', 'Ciencias Naturales', 'Ciencias Sociales', 'Inglés'],
                    'availableCourses' => $availableCourses,
                    'selectedCourse' => $selectedCourse,
                ]);
            }

            $totalCourses = count($courseIds);
            $activeCourses = $user->courses()->where('is_active', true)->count();

            $totalStudents = DB::table('course_student')
                ->whereIn('course_id', $courseIds)
                ->distinct('user_id')
                ->count('user_id');

            $totalOVAs = DB::table('course_ova')
                ->whereIn('course_id', $courseIds)
                ->distinct('ova_id')
                ->count('ova_id');

            // Evaluaciones completadas (todos los intentos)
            $completedActivities = DB::table('evaluations')
                ->whereIn('course_id', $courseIds)
                ->count();

            // OVAs iniciadas: estudiantes que al menos han hecho 1 intento en algún OVA
            $startedActivities = DB::table('evaluations')
                ->whereIn('course_id', $courseIds)
                ->distinct('user_id')
                ->count('user_id');

            // Average score
            $avgScoreResult = DB::table('evaluations')
                ->whereIn('course_id', $courseIds)
                ->selectRaw('AVG(CASE WHEN total > 0 THEN (score/total)*100 ELSE 0 END) as avg_score')
                ->first();
            $avgScore = $avgScoreResult ? (int)round($avgScoreResult->avg_score ?? 0) : 0;

            // CORREGIDO: Progreso = (estudiantes que han hecho al menos 1 evaluación) / (total estudiantes) × 100
            $avgProgress = $totalStudents > 0
                ? (int)round(($startedActivities / $totalStudents) * 100)
                : 0;

            Log::info('Total Students: ' . $totalStudents);
            Log::info('Started Activities (unique students): ' . $startedActivities);
            Log::info('Completed Activities: ' . $completedActivities);
            Log::info('Average Score: ' . $avgScore);
            Log::info('Average Progress: ' . $avgProgress . '%');

            // Monthly activity: 4 meses atrás, mes actual, 1 mes adelante
            $isSqlite = DB::connection()->getDriverName() === 'sqlite';
            $yearExpr  = $isSqlite ? "CAST(strftime('%Y', created_at) AS INTEGER)" : 'YEAR(created_at)';
            $monthExpr = $isSqlite ? "CAST(strftime('%m', created_at) AS INTEGER)" : 'MONTH(created_at)';

            // Evaluaciones completadas por mes
            $evaluationsByMonth = DB::table('evaluations')
                ->whereIn('course_id', $courseIds)
                ->selectRaw("{$yearExpr} as year, {$monthExpr} as month, COUNT(*) as count")
                ->groupByRaw("{$yearExpr}, {$monthExpr}")
                ->get()
                ->keyBy(function ($row) {
                    return $row->year . '-' . str_pad($row->month, 2, '0', STR_PAD_LEFT);
                });

            // Generar rango: 4 meses atrás, mes actual, 1 mes adelante
            $monthNames = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            $monthlyActivity = [];
            $now = now();

            for ($i = -4; $i <= 1; $i++) {
                $date = $now->copy()->addMonths($i);
                $year = (int)$date->format('Y');
                $month = (int)$date->format('m');
                $key = $year . '-' . str_pad($month, 2, '0', STR_PAD_LEFT);

                $evaluation = $evaluationsByMonth->get($key);

                $monthlyActivity[] = [
                    'month' => $monthNames[$month] . ' ' . $date->format('y'),
                    'count' => $evaluation ? (int)$evaluation->count : 0,
                ];
            }

            Log::info('Monthly Activity (4 back, current, 1 forward): ', $monthlyActivity);

            // OVA performance by area (solo attempt = 1)
            $ovaPerformanceRaw = DB::table('evaluations')
                ->join('ovas', 'evaluations.ova_id', '=', 'ovas.id')
                ->whereIn('evaluations.course_id', $courseIds)
                ->where('evaluations.attempt', 1)
                ->selectRaw("ovas.area, AVG(CASE WHEN evaluations.total > 0 THEN (evaluations.score/evaluations.total)*100 ELSE 0 END) as avg, COUNT(*) as count")
                ->groupBy('ovas.area')
                ->get()
                ->keyBy('area');

            // COMPLETAR LAS 5 ÁREAS (aunque no tengan datos)
            $allAreas = ['Matemáticas', 'Español', 'Ciencias Naturales', 'Ciencias Sociales', 'Inglés'];
            $ovaPerformanceByArea = [];
            foreach ($allAreas as $area) {
                $data = $ovaPerformanceRaw->get($area);
                $ovaPerformanceByArea[] = [
                    'area' => $area,
                    'avg' => $data ? (int)round($data->avg ?? 0) : 0,
                    'count' => $data ? (int)$data->count : 0,
                ];
            }

            Log::info('OVA Performance by Area: ', $ovaPerformanceByArea);

            // Peak hours
            $hourExpr = $isSqlite
                ? "CAST(strftime('%H', created_at) AS INTEGER)"
                : 'HOUR(created_at)';
            $peakHoursRaw = DB::table('evaluations')
                ->whereIn('course_id', $courseIds)
                ->selectRaw("{$hourExpr} as hour, COUNT(*) as count")
                ->groupByRaw($hourExpr)
                ->get();

            $peakHoursMap = [];
            foreach ($peakHoursRaw as $row) {
                $hourInt = $row->hour ?? 0;
                if ($hourInt >= 0 && $hourInt < 6) {
                    $block = 'Madrugada';
                } elseif ($hourInt >= 6 && $hourInt < 12) {
                    $block = 'Mañana';
                } elseif ($hourInt >= 12 && $hourInt < 18) {
                    $block = 'Tarde';
                } else {
                    $block = 'Noche';
                }

                if (!isset($peakHoursMap[$block])) {
                    $peakHoursMap[$block] = 0;
                }
                $peakHoursMap[$block] += $row->count;
            }

            $peakHours = [];
            foreach ($peakHoursMap as $label => $count) {
                $peakHours[] = ['label' => $label, 'count' => $count];
            }

            $totalEvals = array_sum(array_column($peakHours, 'count'));
            $peakHours = array_map(function ($item) use ($totalEvals) {
                return [
                    'label' => $item['label'],
                    'count' => $item['count'],
                    'pct' => $totalEvals > 0 ? (int)round(($item['count'] / $totalEvals) * 100) : 0
                ];
            }, $peakHours);

            $peakOrder = ['Madrugada', 'Mañana', 'Tarde', 'Noche'];
            usort($peakHours, function ($a, $b) use ($peakOrder) {
                return array_search($a['label'], $peakOrder) - array_search($b['label'], $peakOrder);
            });

            $stats = [
                'totalCourses' => $totalCourses,
                'activeCourses' => $activeCourses,
                'totalStudents' => $totalStudents,
                'totalOVAs' => $totalOVAs,
                'completedActivities' => $completedActivities,
                'startedActivities' => $startedActivities,
                'avgScore' => $avgScore,
                'avgProgress' => $avgProgress,
            ];

            Log::info('Final Stats: ', $stats);

            return Inertia::render('Teacher/Analytics', [
                'auth' => ['user' => $user],
                'stats' => $stats,
                'monthlyActivity' => $monthlyActivity,
                'peakHours' => $peakHours,
                'ovaPerformanceByArea' => $ovaPerformanceByArea,
                'allAreas' => $allAreas,
                'availableCourses' => $availableCourses,
                'selectedCourse' => $selectedCourse,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in teacher analytics: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            // Obtener cursos disponibles incluso en caso de error
            $availableCourses = $user->courses()
                ->select('id', 'grade', 'section')
                ->orderBy('grade')
                ->orderBy('section')
                ->get()
                ->map(function ($course) {
                    $gradeNames = [
                        'primero' => '1°',
                        'segundo' => '2°',
                        'tercero' => '3°',
                        'cuarto' => '4°',
                        'quinto' => '5°',
                    ];
                    return [
                        'id' => $course->id,
                        'name' => ($gradeNames[$course->grade] ?? $course->grade) . ' - ' . $course->section,
                    ];
                });

            return Inertia::render('Teacher/Analytics', [
                'auth' => ['user' => $user],
                'stats' => [
                    'totalCourses' => $user->courses()->count(),
                    'activeCourses' => $user->courses()->where('is_active', true)->count(),
                    'totalStudents' => 0,
                    'totalOVAs' => 0,
                    'completedActivities' => 0,
                    'startedActivities' => 0,
                    'avgScore' => 0,
                    'avgProgress' => 0,
                ],
                'monthlyActivity' => [],
                'peakHours' => [],
                'ovaPerformanceByArea' => [],
                'allAreas' => ['Matemáticas', 'Español', 'Ciencias Naturales', 'Ciencias Sociales', 'Inglés'],
                'availableCourses' => $availableCourses,
                'selectedCourse' => request('course', ''),
            ]);
        }
    }
}
