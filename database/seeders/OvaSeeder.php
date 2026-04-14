<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ova;

class OvaSeeder extends Seeder
{
    public function run()
    {
        // Limpiar tabla antes de insertar
        Ova::truncate();

        $ovas = [
            // ── CIENCIAS NATURALES ──────────────────────────────────────────
            [
                'area'        => 'Ciencias Naturales',
                'tematica'    => 'El Sistema Solar',
                'description' => 'Explora los planetas, estrellas y fenómenos del universo',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],
            [
                'area'        => 'Ciencias Naturales',
                'tematica'    => 'El Cuerpo Humano',
                'description' => 'Conoce los sistemas y órganos del cuerpo humano',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],
            [
                'area'        => 'Ciencias Naturales',
                'tematica'    => 'Ecosistemas y Biodiversidad',
                'description' => 'Importancia del cuidado del medio ambiente y los ecosistemas',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],

            // ── CIENCIAS SOCIALES ────────────────────────────────────────────
            [
                'area'        => 'Ciencias Sociales',
                'tematica'    => 'Historia de Colombia',
                'description' => 'Conoce la historia de Colombia desde sus inicios hasta hoy',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],
            [
                'area'        => 'Ciencias Sociales',
                'tematica'    => 'Geografía Mundial',
                'description' => 'Aprende sobre los continentes, países y culturas del mundo',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],
            [
                'area'        => 'Ciencias Sociales',
                'tematica'    => 'Educación Ciudadana',
                'description' => 'Formación en valores, derechos y deberes del ciudadano',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],

            // ── ESPAÑOL ──────────────────────────────────────────────────────
            [
                'area'        => 'Español',
                'tematica'    => 'Comprensión Lectora',
                'description' => 'Desarrolla habilidades de lectura y análisis de textos',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],
            [
                'area'        => 'Español',
                'tematica'    => 'Producción de Textos',
                'description' => 'Aprende a redactar textos narrativos, descriptivos y argumentativos',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],
            [
                'area'        => 'Español',
                'tematica'    => 'Gramática y Ortografía',
                'description' => 'Reglas gramaticales y ortográficas del español',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],

            // ── MATEMÁTICAS ──────────────────────────────────────────────────
            [
                'area'        => 'Matemáticas',
                'tematica'    => 'Aritmética Básica',
                'description' => 'Operaciones con números naturales, decimales y fracciones',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],
            [
                'area'        => 'Matemáticas',
                'tematica'    => 'Álgebra Elemental',
                'description' => 'Introducción a expresiones algebraicas y ecuaciones',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],
            [
                'area'        => 'Matemáticas',
                'tematica'    => 'Geometría y Medición',
                'description' => 'Figuras geométricas, áreas, perímetros y volúmenes',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],

            // ── INGLÉS ───────────────────────────────────────────────────────
            [
                'area'        => 'Inglés',
                'tematica'    => 'Vocabulario Básico',
                'description' => 'Aprende las palabras y expresiones más usadas en inglés',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],
            [
                'area'        => 'Inglés',
                'tematica'    => 'Gramática Inglesa',
                'description' => 'Tiempos verbales, sustantivos y estructuras básicas',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],
            [
                'area'        => 'Inglés',
                'tematica'    => 'Conversación y Pronunciación',
                'description' => 'Practica el inglés hablado con situaciones cotidianas',
                'url'         => null,
                'thumbnail'   => null,
                'is_active'   => true,
            ],
        ];

        foreach ($ovas as $ova) {
            Ova::create($ova);
        }

        $this->command->info('OVAs creadas exitosamente: ' . count($ovas));
    }
}