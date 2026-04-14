<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Ova;
use App\Models\Course;
use App\Models\OvaProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OvaController extends Controller
{
    /**
     * Ver una OVA específica — verifica que el estudiante
     * esté inscrito en un curso activo que tenga esta OVA asignada
     */
    public function show(Ova $ova)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $hasAccess = $user->enrolledCourses()
            ->whereHas('ovas', fn($q) => $q->where('ovas.id', $ova->id))
            ->where('is_active', true)
            ->exists();

        abort_unless($hasAccess, 403, 'No tienes acceso a este recurso.');

        // Obtener el curso al que pertenece esta OVA para el estudiante
        $course = $user->enrolledCourses()
            ->whereHas('ovas', fn($q) => $q->where('ovas.id', $ova->id))
            ->where('is_active', true)
            ->first();

        return Inertia::render('Student/OvaViewer', [
            'ova' => [
                'id'          => $ova->id,
                'area'        => $ova->area,
                'tematica'    => $ova->tematica,
                'description' => $ova->description,
                'url'         => $ova->url,
                'thumbnail'   => $ova->thumbnail,
            ],
            'course' => [
                'id'      => $course->id,
                'grade'   => $course->grade,
                'section' => $course->section,
            ],
        ]);
    }

    /**
     * Actualizar progreso del estudiante en una OVA
     */
    public function updateProgress(Request $request, Ova $ova)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $request->validate([
            'course_id'           => 'required|exists:courses,id',
            'progress_percentage' => 'required|integer|min:0|max:100',
            'completed'           => 'boolean',
        ]);

        // Verificar que el estudiante pertenece al curso
        $course = Course::findOrFail($request->course_id);
        abort_unless(
            $course->students()->where('users.id', $user->id)->exists(),
            403
        );

        // Upsert del progreso
        OvaProgress::updateOrCreate(
            [
                'user_id'   => $user->id,
                'ova_id'    => $ova->id,
                'course_id' => $request->course_id,
            ],
            [
                'progress_percentage' => $request->progress_percentage,
                'completed'           => $request->boolean('completed'),
                'completed_at'        => $request->boolean('completed') ? now() : null,
                'last_viewed_at'      => now(),
                'view_count'          => DB::raw('view_count + 1'),
            ]
        );

        return response()->json(['success' => true]);
    }
}