<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SessionExpired
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->session()->get('manual_logout')) {
            return $next($request);
        }

        if (!Auth::check() && $request->hasSession()) {

            $lifetime = config('session.lifetime') * 60;
            $lastActivity = $request->session()->get('last_activity');

            if ($lastActivity && (time() - $lastActivity) > $lifetime) {
                $request->session()->flash('message', 'Sesión cerrada por inactividad.');
            }
        }

        return $next($request);
    }
}