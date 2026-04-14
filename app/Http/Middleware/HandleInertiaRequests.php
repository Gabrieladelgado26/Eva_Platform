<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => fn() => $request->user()
                    ? [
                        'id' => $request->user()->id,
                        'name' => $request->user()->name,
                        'username' => $request->user()->username,
                        'role' => $request->user()->role,
                    ]
                    : null,
            ],

            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'credentials' => fn() => $request->session()->get('credentials'),
                'bulk_credentials' => fn() => $request->session()->get('bulk_credentials'),
                'unique_admin_error' => fn () => $request->session()->get('unique_admin_error'),
                'unique_admin_name' => fn () => $request->session()->get('unique_admin_name'),
                'unique_admin_action' => fn () => $request->session()->get('unique_admin_action'),
            ],
        ];
    }
}
