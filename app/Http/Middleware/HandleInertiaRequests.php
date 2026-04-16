<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => fn() => $request->user()
                    ? [
                        'id'       => $request->user()->id,
                        'name'     => $request->user()->name,
                        'email'    => $request->user()->email,
                        'username' => $request->user()->username,
                        'avatar'   => $request->user()->avatar,  // <-- nuevo
                        'role'     => $request->user()->role,
                    ]
                    : null,
            ],

            // ── Flag para mostrar el modal de avatar al primer login ──
            'needs_avatar' => fn() => $request->session()->get('needs_avatar', false),

            'flash' => [
                'success'            => fn() => $request->session()->get('success'),
                'error'              => fn() => $request->session()->get('error'),
                'credentials'        => fn() => $request->session()->get('credentials'),
                'bulk_credentials'   => fn() => $request->session()->get('bulk_credentials'),
                'unique_admin_error' => fn() => $request->session()->get('unique_admin_error'),
                'unique_admin_name'  => fn() => $request->session()->get('unique_admin_name'),
                'unique_admin_action'=> fn() => $request->session()->get('unique_admin_action'),
            ],
        ];
    }
}