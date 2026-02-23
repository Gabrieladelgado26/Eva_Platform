<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Panel principal
        Route::get('/', [UserController::class, 'index'])
            ->name('index');

        // Users
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

Route::middleware(['auth'])->group(function () {

    Route::get('/student', function () {
        return Inertia::render('Student/Index');
    })->name('student.index');

});

Route::post('/admin/users/{user}/regenerate-pin', 
    [UserController::class, 'regeneratePin']
)->name('admin.users.regeneratePin');

Route::get('/dashboard', function () {

    /** @var \App\Models\User|null $user */
    $user = Auth::user();

    if ($user && $user->role?->slug === 'admin') {
        return redirect()->route('admin.index');
    }

    return Inertia::render('Dashboard');

})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
