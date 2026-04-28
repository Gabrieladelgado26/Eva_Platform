<?php

namespace App\Providers;

use App\Services\HashidService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Registrar HashidService como singleton para que la máscara XOR
        // se calcule una sola vez por request (no en cada encode/decode).
        $this->app->singleton(HashidService::class, fn() => new HashidService());
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
