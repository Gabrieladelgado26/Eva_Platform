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
        $students = $course->students()->with(['ovaProgress' => function($query) use ($course) {
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
}