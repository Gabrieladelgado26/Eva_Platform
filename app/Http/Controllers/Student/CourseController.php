<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Dashboard del estudiante: muestra sus cursos con las OVAs asignadas
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $courses = $user->enrolledCourses()
            ->with([
                'ovas' => function ($query) {
                    $query->where('is_active', true)
                          ->whereNotNull('url')
                          ->where('url', '!=', '')
                          ->orderByPivot('order');
                }
            ])
            ->withCount('ovas')
            ->where('is_active', true)
            ->get()
            ->map(function ($course) {
                return [
                    'id'          => $course->id,
                    'grade'       => $course->grade,
                    'section'     => $course->section,
                    'school_year' => $course->school_year,
                    'description' => $course->description,
                    'is_active'   => $course->is_active,
                    'ovas_count'  => $course->ovas_count,
                    'ovas'        => $course->ovas->map(fn($ova) => [
                        'id'          => $ova->id,
                        'area'        => $ova->area,
                        'tematica'    => $ova->tematica,
                        'description' => $ova->description,
                        'url'         => $ova->url,
                        'thumbnail'   => $ova->thumbnail,
                        'is_active'   => $ova->is_active,
                        'order'       => $ova->pivot->order,
                    ]),
                ];
            });

        // Verificar si el usuario necesita seleccionar avatar (SOLO para mostrar el modal la primera vez)
        $needsAvatar = is_null($user->avatar);

        return Inertia::render('Student/Dashboard', [
            'courses'      => $courses,
            'needsAvatar'  => $needsAvatar,  // Solo true si NO tiene avatar
        ]);
    }

    /**
     * Ver un curso específico con todas sus OVAs
     */
    public function show(Course $course)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Verificar que el estudiante pertenece al curso
        abort_unless(
            $course->students()->where('users.id', $user->id)->exists(),
            403,
            'No tienes acceso a este curso.'
        );

        $ovas = $course->ovas()
            ->where('is_active', true)
            ->whereNotNull('url')
            ->where('url', '!=', '')
            ->orderByPivot('order')
            ->get()
            ->map(fn($ova) => [
                'id'          => $ova->id,
                'area'        => $ova->area,
                'tematica'    => $ova->tematica,
                'description' => $ova->description,
                'url'         => $ova->url,
                'thumbnail'   => $ova->thumbnail,
                'order'       => $ova->pivot->order,
            ]);

        return Inertia::render('Student/CourseShow', [
            'course' => [
                'id'          => $course->id,
                'grade'       => $course->grade,
                'section'     => $course->section,
                'school_year' => $course->school_year,
                'description' => $course->description,
            ],
            'ovas' => $ovas,
        ]);
    }
}