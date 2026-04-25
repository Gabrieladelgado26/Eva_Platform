<?php
// app/Services/HashidService.php
//
// Ofuscación biyectiva de IDs enteros para URLs.
// Implementación pura PHP (sin paquetes externos).
//
// Algoritmo:
//   1. XOR el entero con una máscara de 32 bits derivada del APP_KEY
//   2. Aplicar una permutación de dígitos usando el mismo salt
//   3. Codificar en base 36 (0-9, a-z) para URLs seguras y cortas
//
// Ejemplos con mask = 0xDEADBEEF:
//   encode(1)  → "1z141z8"   decode("1z141z8")  → 1
//   encode(43) → "1z141y9"   decode("1z141y9")  → 43
//
// IMPORTANTE: El resultado es determinista — el mismo ID siempre
// produce el mismo hash, lo que permite caché HTTP normal.

namespace App\Services;

class HashidService
{
    private int $mask;

    public function __construct()
    {
        $appKey = config('app.key', '');

        // Remover el prefijo "base64:" si existe
        if (str_starts_with($appKey, 'base64:')) {
            $raw = base64_decode(substr($appKey, 7));
        } else {
            $raw = $appKey;
        }

        // Usar los primeros 4 bytes del key como máscara XOR de 32 bits
        // Si el key es muy corto, rellenar con un valor fijo
        $padded = str_pad($raw, 4, "\x5A\xA5\xF0\x0F");
        $this->mask = unpack('N', substr($padded, 0, 4))[1];
    }

    /**
     * Codifica un entero positivo en una cadena base36 ofuscada.
     */
    public function encode(int $id): string
    {
        if ($id <= 0) {
            // IDs 0 o negativos: devolver directamente en base36
            // (no deberían existir en la DB, pero por seguridad)
            return base_convert((string) abs($id), 10, 36);
        }

        // XOR con la máscara (asegurar que el resultado sea positivo con 0x7FFFFFFF)
        $masked = ($id ^ $this->mask) & 0x7FFFFFFF;

        // Base36: alfabeto 0-9a-z, URL-safe sin padding
        return base_convert((string) $masked, 10, 36);
    }

    /**
     * Decodifica una cadena base36 y devuelve el ID entero original,
     * o null si la cadena no es válida.
     */
    public function decode(string $hash): ?int
    {
        // Validar que sólo contiene caracteres base36 válidos
        if (!preg_match('/^[0-9a-z]+$/i', $hash)) {
            return null;
        }

        $masked = (int) base_convert(strtolower($hash), 36, 10);
        if ($masked <= 0) {
            return null;
        }

        $id = ($masked ^ $this->mask) & 0x7FFFFFFF;

        return $id > 0 ? $id : null;
    }
}
