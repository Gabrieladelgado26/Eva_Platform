<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\User;
use App\Models\Role; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    /**
     * Listado de cursos con filtros y paginación
     */
    public function index(Request $request)
    {
        $query = Course::with('teacher')
            ->withCount('students');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('grade', 'like', "%{$request->search}%")
                    ->orWhere('section', 'like', "%{$request->search}%")
                    ->orWhere('school_year', 'like', "%{$request->search}%")
                    ->orWhereHas('teacher', fn($t) => $t->where('name', 'like', "%{$request->search}%"));
            });
        }

        if ($request->filled('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $courses = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->through(fn($c) => [
                'id'             => $c->id,
                'grade'          => $c->grade,
                'section'        => $c->section,
                'school_year'    => $c->school_year,
                'description'    => $c->description,
                'is_active'      => (bool)$c->is_active,
                'students_count' => $c->students_count,
                'teacher'        => [
                    'id'   => $c->teacher?->id,
                    'name' => $c->teacher?->name ?? 'Sin docente',
                ],
                'created_at'     => $c->created_at->format('d/m/Y'),
            ]);

        $teachers = User::whereHas('role', fn($q) => $q->where('slug', 'teacher'))
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        $stats = [
            'total'    => Course::count(),
            'active'   => Course::where('is_active', true)->count(),
            'inactive' => Course::where('is_active', false)->count(),
            'students' => User::whereHas('role', fn($q) => $q->where('slug', 'student'))->count(),
        ];

        return Inertia::render('Admin/Courses/Index', [
            'courses'  => $courses,
            'teachers' => $teachers,
            'stats'    => $stats,
            'filters'  => [
                'search'     => $request->search,
                'teacher_id' => $request->teacher_id,
                'status'     => $request->status,
            ],
        ]);
    }

    /**
     * Vista para crear un nuevo curso
     */
    public function create()
    {
        $teachers = User::whereHas('role', fn($q) => $q->where('slug', 'teacher'))
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Courses/Create', [
            'teachers' => $teachers,
        ]);
    }

    /**
     * Guardar un nuevo curso
     */
    public function store(Request $request)
    {
        $request->validate([
            'grade'       => 'required|string|max:100',
            'section'     => 'required|string|max:100',
            'school_year' => 'required|string|max:20',
            'teacher_id'  => 'required|exists:users,id',
            'description' => 'nullable|string|max:500',
        ]);

        Course::create([
            'grade'       => $request->grade,
            'section'     => $request->section,
            'school_year' => $request->school_year,
            'teacher_id'  => $request->teacher_id,
            'description' => $request->description,
            'is_active'   => true,
        ]);

        return redirect()->route('admin.courses.index')
            ->with('success', 'Curso creado correctamente.');
    }

    /**
     * Vista para editar un curso
     */
    public function edit(Course $course)
    {
        $course->load('teacher');

        $teachers = User::whereHas('role', fn($q) => $q->where('slug', 'teacher'))
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Courses/Edit', [
            'course'   => [
                'id'             => $course->id,
                'grade'          => $course->grade,
                'section'        => $course->section,
                'school_year'    => $course->school_year,
                'description'    => $course->description,
                'is_active'      => (bool)$course->is_active,
                'students_count' => $course->students()->count(),
                'teacher'        => [
                    'id'   => $course->teacher?->id,
                    'name' => $course->teacher?->name ?? 'Sin docente',
                ],
            ],
            'teachers' => $teachers,
        ]);
    }

    /**
     * Actualizar un curso existente
     */
    public function update(Request $request, Course $course)
    {
        $request->validate([
            'grade'       => 'required|string|max:100',
            'section'     => 'required|string|max:100',
            'school_year' => 'required|string|max:20',
            'teacher_id'  => 'required|exists:users,id',
            'description' => 'nullable|string|max:500',
        ]);

        $course->update([
            'grade'       => $request->grade,
            'section'     => $request->section,
            'school_year' => $request->school_year,
            'teacher_id'  => $request->teacher_id,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.courses.index')
            ->with('success', 'Curso actualizado correctamente.');
    }

    /**
     * Eliminar un curso
     */
    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()->route('admin.courses.index')
            ->with('success', 'Curso eliminado correctamente.');
    }

    /**
     * Activar/Desactivar un curso
     */
    public function toggleStatus(Course $course)
    {
        $course->update(['is_active' => !$course->is_active]);
        $status = $course->is_active ? 'activado' : 'desactivado';

        return back()->with('success', "Curso {$status} correctamente.");
    }

    public function students(Course $course)
    {
        $students = $course->students()->get();
        return Inertia::render('Admin/Courses/Students', [
            'course' => $course,
            'students' => $students,
        ]);
    }

    /**
     * Buscar estudiantes existentes para agregar al curso
     */
    public function searchStudents(Request $request, Course $course)
    {
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

    /**
     * Agregar estudiante existente o crear nuevo
     */
    public function storeStudent(Request $request, Course $course)
    {
        // Si es estudiante existente
        if ($request->filled('student_id')) {
            $student = User::whereHas('role', fn($r) => $r->where('slug', 'student'))
                ->where('is_active', true)
                ->findOrFail($request->student_id);

            $course->students()->syncWithoutDetaching([$student->id]);

            return redirect()->back()->with('success', 'Estudiante agregado al curso.');
        }

        // Crear nuevo estudiante
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

        return redirect()->back()->with('credentials', [
            'username' => $username,
            'pin'      => $generatedPin,
        ])->with('success', 'Estudiante registrado correctamente.');
    }

    /**
     * Crear múltiples estudiantes en lote
     */
    public function bulkStoreStudents(Request $request, Course $course)
    {
        // Si es solicitud de PDF
        if ($request->input('generate_pdf')) {
            $students = collect($request->input('students'))->map(function ($s) {
                return [
                    'name' => mb_convert_encoding($s['name'], 'UTF-8', 'UTF-8'),
                    'username' => $s['username'],
                    'pin' => $s['pin'],
                ];
            })->toArray();

            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.credentials', [
                'students' => $students,
                'course'   => $course,
                'date'     => now()->format('d/m/Y'),
            ])->setOptions(['defaultFont' => 'DejaVu Sans']);

            return $pdf->download('credenciales.pdf');
        }

        // Creación de estudiantes
        $request->validate([
            'students'       => ['required', 'array'],
            'students.*.name' => ['required', 'string', 'max:255'],
        ]);

        $role = Role::where('slug', 'student')->firstOrFail();
        $createdStudents = [];

        foreach ($request->students as $studentData) {
            $baseUsername = Str::slug($studentData['name']);
            $username = $baseUsername;
            $counter = 1;

            while (User::where('username', $username)->exists()) {
                $username = $baseUsername . $counter++;
            }

            $pin = random_int(1000, 9999);

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

        return redirect()->back()->with('bulk_credentials', $createdStudents);
    }

    /**
     * Retirar estudiante del curso
     */
    public function destroyStudent(Course $course, User $student)
    {
        $course->students()->detach($student->id);

        return redirect()->back()->with('success', 'Estudiante retirado del curso.');
    }
}
