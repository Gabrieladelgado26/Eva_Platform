<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Teacher\CourseController;
use App\Http\Controllers\Teacher\CourseStudentController;
use App\Http\Controllers\Teacher\CourseOvaController;

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
| OVA Routes
|--------------------------------------------------------------------------
*/

Route::prefix('ova')->name('ova.')->group(function () {

    // Pantalla inicial (con animación)
    Route::get('/index', function () {
        return Inertia::render('OVAs/Matematicas/Adicion-Sustraccion/Index')
            ->rootView('ova');
    })->name('index');

    // Contenido principal (después de saltar la animación)
    Route::get('/menu', function () {
        return Inertia::render('OVAs/Matematicas/Adicion-Sustraccion/Menu')
            ->rootView('ova');
    })->name('menu');

    // Layout del OVA
    Route::get('/layout', function () {
        return Inertia::render('OVAs/Matematicas/Adicion-Sustraccion/Layouts/Ova')
            ->rootView('ova');
    })->name('layout');

    // Slider — se carga dentro de un <iframe>, también necesita la vista sin Tailwind
    Route::get('/slider', function () {
        return Inertia::render('OVAs/Components/Slider')
            ->rootView('ova');
    })->name('slider');

    Route::get('/adicion', function () {
        return Inertia::render('OVAs/Matematicas/Adicion-Sustraccion/Adicion/Adicion_Propiedades')
            ->rootView('ova');
    })->name('adicion');
});

// Ruta para inicio (cuando da clic en ver introducción)
Route::get('/inicio', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Welcome');
})->name('inicio');


/*
|--------------------------------------------------------------------------
| Dashboard redirect by role
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    /** @var \App\Models\User|null $user */
    $user = Auth::user();

    if ($user?->role?->slug === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    if ($user?->role?->slug === 'teacher') {
        return redirect()->route('teacher.dashboard');
    }

    if ($user?->role?->slug === 'student') {
        return redirect()->route('student.dashboard');
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
        // Dashboard principal
        Route::get('/', [UserController::class, 'dashboard'])->name('dashboard');

        // Redirección a sección de usuarios dentro del dashboard
        Route::get('/users', function () {
            return redirect()->route('admin.dashboard', ['section' => 'users']);
        })->name('users.index');

        // CRUD usuarios
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggleStatus');
        Route::patch('/users/{user}/regenerate-pin', [UserController::class, 'regeneratePin'])->name('users.regeneratePin');
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
        // Dashboard docente
        Route::get('/', [CourseController::class, 'dashboard'])->name('dashboard');

        /*
        |--------------------------------------------------------------------------
        | Courses
        |--------------------------------------------------------------------------
        */
        Route::resource('courses', CourseController::class)->except(['index']);
        Route::patch('courses/{course}/toggle-status', [CourseController::class, 'toggleStatus'])->name('courses.toggleStatus');

        // Rutas para asignar y gestionar OVAs en cursos
        Route::post('courses/{course}/assign-ova', [CourseController::class, 'assignOva'])->name('courses.assign-ova');
        Route::post('courses/{course}/assign-multiple-ovas', [CourseController::class, 'assignMultipleOvas'])->name('courses.assign-multiple-ovas');
        Route::delete('courses/{course}/remove-ova/{ova}', [CourseController::class, 'removeOva'])->name('courses.remove-ova');
        Route::put('courses/{course}/update-ova-order', [CourseController::class, 'updateOvaOrder'])->name('courses.update-ova-order');
        Route::put('courses/{course}/update-ova-config/{ova}', [CourseController::class, 'updateOvaConfig'])->name('courses.update-ova-config');
        Route::get('courses/{course}/ova-stats', [CourseController::class, 'getOvaStats'])->name('courses.ova-stats');
        Route::get('courses/{course}/available-ovas', [CourseController::class, 'getAvailableOvas'])->name('courses.available-ovas');

        /*
        |--------------------------------------------------------------------------
        | Students (Course management)
        |--------------------------------------------------------------------------
        */
        Route::get('courses/{course}/students/search', [CourseStudentController::class, 'search'])->name('courses.students.search');
        Route::get('courses/{course}/students', [CourseStudentController::class, 'index'])->name('courses.students.index');
        Route::post('courses/{course}/students', [CourseStudentController::class, 'store'])->name('courses.students.store');
        Route::post('courses/{course}/students/bulk', [CourseStudentController::class, 'storeBulk'])->name('courses.students.bulk');
        Route::delete('courses/{course}/students/{student}', [CourseStudentController::class, 'destroy'])->name('courses.students.destroy');
        Route::get('courses/{course}/students/export-pdf', [CourseStudentController::class, 'exportPdf'])->name('courses.students.export-pdf');
    });

/*
|--------------------------------------------------------------------------
| Course OVA Routes (Alternativa con controlador separado)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:teacher'])
    ->prefix('teacher/courses/{course}/ovas')
    ->name('teacher.courses.ovas.')
    ->group(function () {
        Route::get('/', [CourseOvaController::class, 'index'])->name('index');
        Route::get('/available', [CourseOvaController::class, 'available'])->name('available');
        Route::post('/assign', [CourseOvaController::class, 'assign'])->name('assign');
        Route::post('/assign-multiple', [CourseOvaController::class, 'assignMultiple'])->name('assign-multiple');
        Route::delete('/{ova}', [CourseOvaController::class, 'remove'])->name('remove');
        Route::put('/order', [CourseOvaController::class, 'updateOrder'])->name('update-order');
        Route::put('/{ova}/config', [CourseOvaController::class, 'updateConfig'])->name('update-config');
        Route::get('/stats', [CourseOvaController::class, 'stats'])->name('stats');
    });

/*
|--------------------------------------------------------------------------
| Student Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('/', function () {
            return Inertia::render('Student/Dashboard');
        })->name('dashboard');
    });

/*
|--------------------------------------------------------------------------
| Profile Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';

/*
|--------------------------------------------------------------------------
| OVA — rutas adicionales (alias y futuras OVAs)
|--------------------------------------------------------------------------
*/

// Alias /ova/contenido → menú principal (para compatibilidad con Index.jsx)
Route::get('/ova/contenido', function () {
    return Inertia::render('OVAs/Matematicas/Adicion-Sustraccion/Menu')
        ->rootView('ova');
})->name('ova.contenido');

