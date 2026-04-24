<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Role;
use App\Models\User;
use App\Models\Evaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class CourseStudentController extends Controller
{
    public function search(Request $request, Course $course)
    {
        abort_if($course->teacher_id !== Auth::id(), 403);

        $q = $request->get('q', '');

        $students = User::whereHas('role', fn($r) => $r->where('slug', 'student'))
            ->where('is_active', true)
            ->whereNotIn('id', $course->students()->pluck('users.id'))
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('username', 'like', "%{$q}%");
            })
            ->limit(8)
            ->get(['id', 'name', 'username']);

        return response()->json($students);
    }

    public function store(Request $request, Course $course)
    {
        abort_if($course->teacher_id !== Auth::id(), 403);

        // Vincular existente
        if ($request->filled('student_id')) {
            $student = User::whereHas('role', fn($r) => $r->where('slug', 'student'))
                ->where('is_active', true)
                ->findOrFail($request->student_id);

            $course->students()->syncWithoutDetaching([$student->id]);

            // Si se solicita quedarse en la página, redirigir back
            if ($request->boolean('stay_on_page')) {
                return back()->with('success', 'Estudiante agregado al curso.');
            }

            return redirect()
                ->route('teacher.students.index')
                ->with('success', 'Estudiante agregado al curso.');
        }

        // Crear nuevo
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
        $role = Role::where('slug', 'student')->firstOrFail();

        $student = User::create([
            'name'      => $request->name,
            'username'  => $username,
            'pin'       => Hash::make($generatedPin),
            'role_id'   => $role->id,
            'is_active' => true,
        ]);

        $course->students()->attach($student->id);

        // Si se solicita quedarse en la página, redirigir back
        if ($request->boolean('stay_on_page')) {
            return back()
                ->with('credentials', [
                    'username' => $username,
                    'pin'      => $generatedPin,
                ])
                ->with('success', 'Estudiante registrado correctamente.');
        }

        return redirect()
            ->route('teacher.students.index')
            ->with('credentials', [
                'username' => $username,
                'pin'      => $generatedPin,
            ])
            ->with('success', 'Estudiante registrado correctamente.');
    }

    /**
     * Mostrar formulario para crear un nuevo estudiante
     */
    public function create()
    {
        $teacher = Auth::user();
        abort_if(!$teacher, 403);
        abort_unless($teacher->role->slug === 'teacher', 403);

        $courses = $teacher->courses()
            ->where('is_active', true)
            ->select('id', 'grade', 'section', 'school_year')
            ->orderBy('grade')
            ->orderBy('section')
            ->get();

        return Inertia::render('Teacher/Students/Create', [
            'courses' => $courses,
        ]);
    }

    /**
     * Mostrar formulario para editar un estudiante
     */
    public function edit(User $user)
    {
        $teacher = Auth::user();
        abort_if(!$teacher, 403);
        abort_unless($teacher->role->slug === 'teacher', 403);

        // Verificar que el estudiante está en al menos un curso del teacher
        $courseIds = $teacher->courses()->pluck('id');
        $enrolled = $user->enrolledCourses()->whereIn('courses.id', $courseIds)->exists();
        abort_unless($enrolled, 403);

        // Obtener los cursos en los que está inscrito este estudiante
        $studentCourses = $user->enrolledCourses()
            ->whereIn('courses.id', $courseIds)
            ->select('courses.id', 'courses.grade', 'courses.section', 'courses.school_year')
            ->get();

        return Inertia::render('Teacher/Students/Edit', [
            'student' => [
                'id'            => $user->id,
                'name'          => $user->name,
                'username'      => $user->username,
                'is_active'     => $user->is_active,
                'avatar'        => $user->avatar,
                'created_at'    => $user->created_at,
                'courses_count' => $studentCourses->count(),
            ],
            'courses' => $studentCourses,
        ]);
    }

    public function destroy(Course $course, User $student)
    {
        abort_if($course->teacher_id !== Auth::id(), 403);

        $course->students()->detach($student->id);

        return back()->with('success', 'Estudiante retirado del curso.');
    }

    public function storeBulk(Request $request, Course $course)
    {
        abort_if($course->teacher_id !== Auth::id(), 403);

        // Modo descarga PDF (llamado desde fetch, no desde Inertia)
        if ($request->input('generate_pdf')) {
            $students = collect($request->input('students'))->map(function ($s) {
                return [
                    'name' => mb_convert_encoding($s['name'], 'UTF-8', 'UTF-8'),
                    'username' => $s['username'],
                    'pin' => $s['pin'],
                ];
            })->toArray();

            $pdf = Pdf::loadView('pdf.credentials', [
                'students' => $students,
                'course'   => $course,
                'date'     => now()->format('d/m/Y'),
            ])->setOptions([
                'defaultFont' => 'DejaVu Sans'
            ]);

            return $pdf->download('credenciales.pdf');
        }

        // Modo creación de estudiantes
        $request->validate([
            'students'       => ['required', 'array'],
            'students.*.name' => ['required', 'string', 'max:255'],
        ]);

        $role = Role::where('slug', 'student')->firstOrFail();
        $createdStudents = [];

        foreach ($request->students as $studentData) {
            $baseUsername = Str::slug($studentData['name']);
            $username     = $baseUsername;
            $counter      = 1;

            while (User::where('username', $username)->exists()) {
                $username = $baseUsername . $counter++;
            }

            $pin  = random_int(1000, 9999);

            $user = User::create([
                'name'      => $studentData['name'],
                'username'  => $username,
                'pin'       => Hash::make($pin),
                'role_id'   => $role->id,
                'is_active' => true,
            ]);

            $course->students()->attach($user->id);

            $createdStudents[] = [
                'name'     => $user->name,
                'username' => $username,
                'pin'      => $pin,
            ];
        }

        // Si se solicita quedarse en la página, redirigir back
        if ($request->boolean('stay_on_page')) {
            return back()
                ->with('bulk_credentials', json_decode(
                    json_encode($createdStudents, JSON_UNESCAPED_UNICODE),
                    true
                ));
        }

        return redirect()
            ->back()
            ->with('bulk_credentials', json_decode(
                json_encode($createdStudents, JSON_UNESCAPED_UNICODE),
                true
            ));
    }

    public function indexAll(Request $request)
    {
        $user = Auth::user();
        abort_if(!$user, 403);
        abort_unless($user->role->slug === 'teacher', 403);

        // Get all student IDs enrolled in this teacher's courses
        $courseIds = $user->courses()->pluck('id');

        $query = User::whereHas('enrolledCourses', fn($q) => $q->whereIn('courses.id', $courseIds))
            ->with([
                'role',
                'enrolledCourses' => fn($q) => $q->whereIn('courses.id', $courseIds)->select('courses.id', 'courses.grade', 'courses.section')
            ])
            ->withCount(['enrolledCourses as courses_count' => fn($q) => $q->whereIn('courses.id', $courseIds)]);

        // Search
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('name', 'like', "%$s%")->orWhere('username', 'like', "%$s%")->orWhere('email', 'like', "%$s%"));
        }

        $students = $query->orderBy('name')->paginate(20)->withQueryString()->through(function ($student) {
            return [
                'id'            => $student->id,
                'name'          => $student->name,
                'username'      => $student->username,
                'email'         => $student->email,
                'avatar'        => $student->avatar,
                'is_active'     => $student->is_active,
                'courses_count' => $student->courses_count,
                'courses_names' => $student->enrolledCourses->map(fn($c) => ucfirst($c->grade) . ' ' . $c->section)->join(', '),
                'created_at'    => $student->created_at,
            ];
        });

        return Inertia::render('Teacher/Students/Index', [
            'students' => $students,
            'filters'  => ['search' => $request->search],
            'courses'  => $user->courses()->select('id', 'grade', 'section')->get(),
        ]);
    }

    public function show(User $user, Request $request)
    {
        $teacher = Auth::user();
        abort_if(!$teacher, 403);
        abort_unless($teacher->role->slug === 'teacher', 403);

        // Verify this student is in one of the teacher's courses
        $courseIds = $teacher->courses()->pluck('id');
        $enrolled = $user->enrolledCourses()->whereIn('courses.id', $courseIds)->exists();
        abort_unless($enrolled, 403);

        $courses = $user->enrolledCourses()->whereIn('courses.id', $courseIds)->get();

        // Evaluations for this student in teacher's courses
        $evaluations = Evaluation::where('user_id', $user->id)
            ->whereIn('course_id', $courseIds)
            ->with(['ova', 'course'])
            ->orderByDesc('created_at')
            ->limit(20)
            ->get()
            ->map(fn($e) => [
                'id'         => $e->id,
                'score'      => $e->score,
                'total'      => $e->total,
                'percentage' => $e->percentage,
                'attempt'    => $e->attempt,
                'created_at' => $e->created_at->format('d/m/Y H:i'),
                'ova'        => ['area' => $e->ova?->area, 'tematica' => $e->ova?->tematica],
                'course'     => ['grade' => $e->course?->grade, 'section' => $e->course?->section],
            ]);

        return Inertia::render('Teacher/Students/Show', [
            'student'     => $user->only(['id', 'name', 'username', 'email', 'is_active', 'pin', 'avatar', 'created_at']),
            'courses'     => $courses,
            'evaluations' => $evaluations,
        ]);
    }

    public function regeneratePinForStudent(User $user, Request $request)
    {
        $teacher = Auth::user();
        abort_if(!$teacher, 403);
        abort_unless($teacher->role->slug === 'teacher', 403);

        $courseIds = $teacher->courses()->pluck('id');
        $enrolled = $user->enrolledCourses()->whereIn('courses.id', $courseIds)->exists();
        abort_unless($enrolled, 403);

        // Generate new 4-digit PIN
        $generatedPin = random_int(1000, 9999);
        $user->update(['pin' => Hash::make($generatedPin)]);

        return redirect()
            ->route('teacher.students.edit', $user->id)
            ->with('credentials', [
                'username' => $user->username,
                'pin'      => $generatedPin,
            ])
            ->with('success', 'PIN regenerado correctamente.');
    }

    public function toggleStatus(User $user, Request $request)
    {
        $teacher = Auth::user();
        abort_if(!$teacher, 403);
        abort_unless($teacher->role->slug === 'teacher', 403);

        $courseIds = $teacher->courses()->pluck('id');
        $enrolled = $user->enrolledCourses()->whereIn('courses.id', $courseIds)->exists();
        abort_unless($enrolled, 403);

        $user->update(['is_active' => !$user->is_active]);
        $status = $user->is_active ? 'activado' : 'desactivado';

        return redirect()
            ->route('teacher.students.index')
            ->with('success', "Estudiante {$status} correctamente.");
    }

    public function updateStudent(User $user, Request $request)
    {
        $teacher = Auth::user();
        abort_if(!$teacher, 403);
        abort_unless($teacher->role->slug === 'teacher', 403);

        $courseIds = $teacher->courses()->pluck('id');
        $enrolled = $user->enrolledCourses()->whereIn('courses.id', $courseIds)->exists();
        abort_unless($enrolled, 403);

        $request->validate(['name' => 'required|string|max:255']);
        $user->update(['name' => $request->name]);

        return redirect()
            ->route('teacher.students.index')
            ->with('success', 'Estudiante actualizado correctamente.');
    }
}
