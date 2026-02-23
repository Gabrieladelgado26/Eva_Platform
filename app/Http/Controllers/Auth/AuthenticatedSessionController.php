<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Mostrar vista login
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Manejar autenticación (estudiante o staff)
     */
    public function store(Request $request): RedirectResponse
    {
        /* Login estudiante (username + pin) */
        if ($request->filled('username') && $request->filled('pin')) {

            $request->validate([
                'username' => ['required', 'string'],
                'pin' => ['required', 'digits:4'], // opcional: forzar 4 dígitos
            ]);

            $user = User::where('username', $request->username)
                ->whereHas('role', function ($q) {
                    $q->where('slug', 'student');
                })
                ->first();

            if (!$user || !$user->pin || !Hash::check($request->pin, $user->pin)) {
                return back()->withErrors([
                    'username' => 'Credenciales incorrectas.',
                ]);
            }

            if (!$user->is_active) {
                return back()->withErrors([
                    'username' => 'Su cuenta está inactiva.',
                ]);
            }

            Auth::login($user);
        }

        /* Login docente / admin (email + password) */ else {

            $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            if (!Auth::attempt(
                $request->only('email', 'password'),
                $request->boolean('remember')
            )) {
                return back()->withErrors([
                    'email' => 'Credenciales incorrectas.',
                ]);
            }

            $user = Auth::user();

            if (!$user->is_active) {
                Auth::logout();

                return back()->withErrors([
                    'email' => 'Su cuenta está inactiva.',
                ]);
            }
        }

        $request->session()->regenerate();

        /** @var \App\Models\User $user */
        $user = Auth::user();

        return redirect()->route($user->redirectRoute());
    }

    /**
     * Cerrar sesión
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->session()->put('manual_logout', true);

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
