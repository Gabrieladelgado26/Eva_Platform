<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CourseStudentController extends Controller
{
    /**
     * Buscar estudiantes existentes (autocomplete)
     * GET /teacher/courses/{course}/students/search?q=...
     */
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

    /**
     * Inscribir estudiante existente o crear uno nuevo
     * POST /teacher/courses/{course}/students
     */
    public function store(Request $request, Course $course)
    {
        abort_if($course->teacher_id !== Auth::id(), 403);

        // Caso 1: estudiante ya existe, solo vincular
        if ($request->filled('student_id')) {
            $student = User::whereHas('role', fn($r) => $r->where('slug', 'student'))
                ->where('is_active', true)
                ->findOrFail($request->student_id);

            $course->students()->syncWithoutDetaching([$student->id]);

            return back()->with('success', 'Estudiante agregado al curso.');
        }

        // Caso 2: crear estudiante nuevo y vincularlo
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        // Generar username único a partir del nombre
        $baseUsername = Str::slug($request->name);
        $username = $baseUsername;
        $counter = 1;

        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $counter++;
        }

        // Generar PIN aleatorio
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

        return back()->with('credentials', [
            'username' => $username,
            'pin'      => $generatedPin,
        ]);
    }

    /**
     * Retirar estudiante del curso (no lo elimina del sistema)
     * DELETE /teacher/courses/{course}/students/{student}
     */
    public function destroy(Course $course, User $student)
    {
        abort_if($course->teacher_id !== Auth::id(), 403);

        $course->students()->detach($student->id);

        return back()->with('success', 'Estudiante retirado del curso.');
    }
}