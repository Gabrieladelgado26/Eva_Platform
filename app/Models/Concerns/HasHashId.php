<?php
// app/Models/Concerns/HasHashId.php
//
// Trait que ofusca el ID entero en todas las URL del sistema.
//
// Lo que cambia:
//   • getRouteKey()        → devuelve el hash (usado por Inertia routes / Ziggy)
//   • resolveRouteBinding()→ decodifica el hash para encontrar el modelo
//   • toArray()            → reemplaza 'id' por el hash en la serialización JSON
//     (así los props de Inertia y los JSON responses tienen el hash como 'id')
//
// Lo que NO cambia:
//   • $model->id           → sigue devolviendo el entero (acceso directo al atributo)
//   • Queries internas     → usan el entero sin problema

namespace App\Models\Concerns;

use App\Services\HashidService;

trait HasHashId
{
    // ── Route model binding ───────────────────────────────────────────────────

    /**
     * Devuelve el hash del ID para usarlo en las URLs generadas por Ziggy / route().
     */
    public function getRouteKey(): mixed
    {
        return app(HashidService::class)->encode($this->id);
    }

    /**
     * Resuelve el modelo a partir del hash en la URL.
     */
    public function resolveRouteBinding(mixed $value, $field = null): ?static
    {
        $id = app(HashidService::class)->decode((string) $value);

        if ($id === null) {
            abort(404);
        }

        return static::where($field ?? 'id', $id)->firstOrFail();
    }

    // ── Serialización JSON (Inertia props) ────────────────────────────────────

    /**
     * Sustituye el campo 'id' entero por el hash en toArray() / toJson().
     * Esto garantiza que cuando el controlador pasa el modelo directamente a
     * Inertia::render(), el frontend recibe el hash como `id`.
     *
     * $model->id sigue siendo el entero (acceso al atributo de Eloquent).
     */
    public function toArray(): array
    {
        $array = parent::toArray();

        if (array_key_exists('id', $array)) {
            $array['id'] = $this->getRouteKey();
        }

        return $array;
    }
}
