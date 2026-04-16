<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'No autenticado.');
        }

        if (!$user->relationLoaded('role')) {
            $user->load('role');
        }

        if (!$user->role || !in_array($user->role->slug, $roles)) {
            abort(403, 'Permisos insuficientes.');
        }

        return $next($request);
    }
}