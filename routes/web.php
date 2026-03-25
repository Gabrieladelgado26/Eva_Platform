<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Teacher\CourseController;
use App\Http\Controllers\Teacher\CourseStudentController;

/*
|--------------------------------------------------------------------------
| Welcome
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


/*
|--------------------------------------------------------------------------
| Dashboard redirect by role
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {

    /** @var \App\Models\User|null $user */
    $user = Auth::user();

    if ($user && $user->role?->slug === 'admin') {
        return redirect()->route('admin.index');
    }

    if ($user && $user->role?->slug === 'teacher') {
        return redirect()->route('teacher.index');
    }

    if ($user && $user->role?->slug === 'student') {
        return redirect()->route('student.index');
    }

    return Inertia::render('Dashboard');

})->middleware(['auth', 'verified'])->name('dashboard');


/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/', [UserController::class, 'index'])
            ->name('index');

        Route::get('/users/create', [UserController::class, 'create'])
            ->name('users.create');

        Route::post('/users', [UserController::class, 'store'])
            ->name('users.store');

        Route::get('/users/{user}/edit', [UserController::class, 'edit'])
            ->name('users.edit');

        Route::put('/users/{user}', [UserController::class, 'update'])
            ->name('users.update');

        Route::delete('/users/{user}', [UserController::class, 'destroy'])
            ->name('users.destroy');

        Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])
            ->name('users.toggleStatus');

        Route::patch('/users/{user}/regenerate-pin', [UserController::class, 'regeneratePin'])
            ->name('users.regeneratePin');
    });


/*
|--------------------------------------------------------------------------
| Teacher Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:teacher'])
    ->prefix('teacher')
    ->name('teacher.')
    ->group(function () {

        // Dashboard del docente (lista de cursos)
        Route::get('/', [CourseController::class, 'index'])
            ->name('index');

        // CRUD cursos
        Route::resource('courses', CourseController::class)
            ->except(['index']);

        // Activar / desactivar curso
        Route::patch('courses/{course}/toggle-status', [CourseController::class, 'toggleStatus'])
            ->name('courses.toggleStatus');

        /* Gestión de estudiantes */

        Route::get(
            'courses/{course}/students/search',
            [CourseStudentController::class, 'search']
        )->name('courses.students.search');

        Route::get(
            'courses/{course}/students',
            [CourseStudentController::class, 'index']
        )->name('courses.students.index');

        Route::post(
            'courses/{course}/students',
            [CourseStudentController::class, 'store']
        )->name('courses.students.store');

        Route::delete(
            'courses/{course}/students/{student}',
            [CourseStudentController::class, 'destroy']
        )->name('courses.students.destroy');

    });


/*
|--------------------------------------------------------------------------
| Student Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:student'])
    ->group(function () {

        Route::get('/student', function () {
            return Inertia::render('Student/Index');
        })->name('student.index');

    });


/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

});


require __DIR__ . '/auth.php';