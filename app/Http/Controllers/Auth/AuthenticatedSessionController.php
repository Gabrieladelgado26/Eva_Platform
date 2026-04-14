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
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use App\Models\LoginLog;

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
        $isStudentLogin = $request->filled('username') && $request->filled('pin');
        $field = $isStudentLogin ? 'username' : 'email';

        // Construir clave única (usuario + IP)
        $key = Str::lower($request->input($field)) . '|' . $request->ip();

        // Verificar bloqueo previo
        if (RateLimiter::tooManyAttempts($key, 5)) {

            $seconds = RateLimiter::availableIn($key);
            $minutes = floor($seconds / 60);
            $remainingSeconds = $seconds % 60;

            $message = "Demasiados intentos! Intente nuevamente en ";

            if ($minutes > 0) {
                $message .= "{$minutes} minuto(s)";
                if ($remainingSeconds > 0) {
                    $message .= " y {$remainingSeconds} segundo(s)";
                }
            } else {
                $message .= "{$remainingSeconds} segundo(s)";
            }

            throw ValidationException::withMessages([
                $field => $message
            ]);
        }

        // Validaciones según tipo de login
        if ($isStudentLogin) {

            $request->validate([
                'username' => ['required', 'string'],
                'pin' => ['required', 'digits:4'],
            ]);

            $user = User::where('username', $request->username)
                ->whereHas('role', fn($q) => $q->where('slug', 'student'))
                ->first();

            $credentialsValid = $user
                && $user->pin
                && Hash::check($request->pin, $user->pin);
        } else {

            $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            $credentialsValid = Auth::attempt(
                $request->only('email', 'password'),
                $request->boolean('remember')
            );

            $user = $credentialsValid ? Auth::user() : null;
        }

        // Si credenciales incorrectas
        if (!$credentialsValid) {

            RateLimiter::hit($key, 300);

            $attempts = RateLimiter::attempts($key);
            $remainingAttempts = 5 - $attempts;

            if ($remainingAttempts <= 0) {

                $seconds = RateLimiter::availableIn($key);
                $minutes = ceil($seconds / 60);

                return back()->withErrors([
                    $field => "Demasiados intentos! Intente nuevamente en {$minutes} minuto(s)."
                ]);
            }

            return back()->withErrors([
                $field => "Credenciales incorrectas. Le quedan {$remainingAttempts} intento(s)."
            ]);
        }

        // Usuario inactivo
        if (!$user->is_active) {

            Auth::logout();

            return back()->withErrors([
                $field => 'Su cuenta está inactiva.',
            ]);
        }

        // Login exitoso
        if ($isStudentLogin) {
            Auth::login($user);
        }

        RateLimiter::clear($key);
        $request->session()->regenerate();

        LoginLog::create([
            'user_id'    => $user->id,
            'login_at'   => now(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->route($user->redirectRoute());
    }

    /**
     * Cerrar sesión
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user) {
            LoginLog::where('user_id', $user->id)
                ->whereNull('logout_at')
                ->latest('login_at')
                ->first()
                ?->update([
                    'logout_at' => now(),
                ]);
        }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
