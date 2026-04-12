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
use Barryvdh\DomPDF\Facade\Pdf;

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

            return back()->with('success', 'Estudiante agregado al curso.');
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

        return back()->with('credentials', [
            'username' => $username,
            'pin'      => $generatedPin,
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

        // Modo creación de estudiantes (llamado desde Inertia)
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

        // Devuelve flash para que Inertia lo maneje
        return redirect()
            ->back()
            ->with('bulk_credentials', json_decode(
                json_encode($createdStudents, JSON_UNESCAPED_UNICODE),
                true
            ));
    }
}
