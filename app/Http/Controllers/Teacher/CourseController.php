<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    public function index()
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->role->slug === 'teacher', 403);

        $courses = $user->courses()
            ->withCount('students')
            ->latest()
            ->get();

        return Inertia::render('Teacher/Index', [
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
            'grade' => [
                'required',
                'in:primero,segundo,tercero,cuarto,quinto'
            ],
            'section' => [
                'required',
                'string',
                'max:10'
            ],
            'description' => [
                'nullable',
                'string',
                'max:500'
            ],
        ]);

        // Validación de curso único por profesor, grado, sección y año
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
            ->route('teacher.index')
            ->with('success', 'Curso creado correctamente.');
    }

    public function show(Course $course)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->id === $course->teacher_id, 403);

        $course->loadCount('students');

        $students = $course->students()
            ->select('users.id', 'users.name', 'users.username')
            ->get();

        return Inertia::render('Teacher/Courses/Index', [
            'course' => $course,
            'students' => $students
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
            ->route('teacher.index')
            ->with('success', 'Curso actualizado correctamente.');
    }

    public function destroy(Course $course)
    {
        /** @var User|null $user */
        $user = Auth::user();

        abort_if(!$user, 403);
        abort_unless($user->id === $course->teacher_id, 403);

        $course->delete();

        return redirect()
            ->route('teacher.index')
            ->with('success', 'Curso eliminado correctamente.');
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

        return redirect()->back()
            ->with('success', 'Estado del curso actualizado.');
    }
}
