<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class EvaluationController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        abort_if(!$user, 403);

        $isAdmin = $user->role->slug === 'admin';
        $isTeacher = $user->role->slug === 'teacher';
        
        abort_unless($isAdmin || $isTeacher, 403);

        // Base query con relaciones necesarias
        // NOTA: En Course la relación con el profesor es 'teacher', no 'user'
        $query = Evaluation::with(['user', 'ova', 'course.teacher']);

        // Filtro por cursos según el rol
        if ($isTeacher) {
            // Teacher: solo sus cursos (teacher_id es la clave foránea)
            $courseIds = $user->courses()->pluck('id');
            $query->whereIn('course_id', $courseIds);
        }
        // Admin: ve todos, sin filtro adicional

        // Filtros comunes
        $query->when($request->filled('course_id'), fn($q) =>
            $q->where('course_id', $request->course_id)
        );

        // Filtro por profesor (solo para admin)
        if ($isAdmin && $request->filled('teacher_id')) {
            $query->whereHas('course', fn($q) =>
                $q->where('teacher_id', $request->teacher_id)
            );
        }

        // Búsqueda por estudiante
        $query->when($request->filled('search'), fn($q) =>
            $q->whereHas('user', fn($u) =>
                $u->where('name', 'like', "%{$request->search}%")
                  ->orWhere('username', 'like', "%{$request->search}%")
            )
        );

        // Orden y paginación
        $evaluations = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->through(fn($e) => [
                'id'             => $e->id,
                'score'          => $e->score,
                'total'          => $e->total,
                'percentage'     => $e->percentage,
                'attempt'        => $e->attempt,
                'evaluation_key' => $e->evaluation_key,
                'created_at'     => $e->created_at->format('d/m/Y H:i'),
                'student' => [
                    'id'       => $e->user?->id,
                    'name'     => $e->user?->name,
                    'username' => $e->user?->username,
                    'avatar'   => $e->user?->avatar,
                ],
                'ova' => [
                    'id'      => $e->ova?->id,
                    'area'    => $e->ova?->area,
                    'tematica'=> $e->ova?->tematica,
                ],
                'course' => [
                    'id'      => $e->course?->id,
                    'grade'   => $e->course?->grade,
                    'section' => $e->course?->section,
                    'teacher' => $e->course?->teacher?->name ?? 'N/A',
                ],
            ]);

        // Datos para filtros según el rol
        if ($isTeacher) {
            // Teacher: solo sus cursos
            $courses = $user->courses()
                ->select('id', 'grade', 'section', 'school_year')
                ->get();
            $teachers = null;
        } else {
            // Admin: todos los cursos con sus profesores
            $courses = Course::with('teacher')
                ->select('id', 'grade', 'section', 'school_year', 'teacher_id')
                ->get()
                ->map(fn($c) => [
                    'id'      => $c->id,
                    'grade'   => $c->grade,
                    'section' => $c->section,
                    'teacher' => $c->teacher?->name ?? 'N/A',
                ]);
            
            $teachers = \App\Models\User::whereHas('role', fn($q) => 
                $q->where('slug', 'teacher')
            )->select('id', 'name')->get();
        }

        // Stats según el rol
        if ($isTeacher) {
            $courseIds = $user->courses()->pluck('id');
            $stats = [
                'total_evaluations' => Evaluation::whereIn('course_id', $courseIds)->count(),
                'avg_score'         => round(
                    Evaluation::whereIn('course_id', $courseIds)->avg(
                        DB::raw('(score / total) * 100')
                    ) ?? 0
                ),
                'total_students'    => \App\Models\User::whereHas('enrolledCourses', fn($q) =>
                    $q->whereIn('courses.id', $courseIds)
                )->count(),
                'total_courses'     => $courseIds->count(),
            ];
        } else {
            $stats = [
                'total_evaluations' => Evaluation::count(),
                'avg_score'         => round(
                    Evaluation::avg(DB::raw('(score / total) * 100')) ?? 0
                ),
                'total_students'    => \App\Models\User::whereHas('role', fn($q) => 
                    $q->where('slug', 'student')
                )->count(),
                'total_teachers'    => $teachers->count(),
                'total_courses'     => Course::count(),
            ];
        }

        // Usar la vista compartida (está en Teacher/Evaluations/Index.jsx)
        return Inertia::render('Teacher/Evaluations/Index', [
            'evaluations' => $evaluations,
            'courses'     => $courses,
            'teachers'    => $teachers,
            'stats'       => $stats,
            'filters'     => [
                'search'     => $request->search,
                'course_id'  => $request->course_id,
                'teacher_id' => $request->teacher_id,
            ],
            'userRole'    => $user->role->slug,
        ]);
    }
}