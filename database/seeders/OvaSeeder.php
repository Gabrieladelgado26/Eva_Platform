<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ova;

class OvaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ovas = [
            [
                'area' => 'Matemáticas',
                'tematica' => 'Adición y sustracción',
                'description' => 'OVA interactivo para aprender y practicar operaciones básicas de suma y resta mediante actividades dinámicas.',
                'url' => '/ovas/matematicas/adicion-sustraccion/inicio',
                'thumbnail' => '',
                'is_active' => true
            ],
            [
                'area' => 'Español',
                'tematica' => 'Comprensión lectora',
                'description' => 'OVA diseñado para fortalecer la comprensión lectora a través de cuentos, preguntas y actividades interactivas.',
                'url' => '/ovas/espanol/cuento/inicio',
                'thumbnail' => '',
                'is_active' => true
            ],
            [
                'area' => 'Ciencias Naturales',
                'tematica' => 'Seres vivos y objetos inertes',
                'description' => 'OVA interactivo que permite identificar y diferenciar los seres vivos de los objetos inertes mediante ejemplos y ejercicios.',
                'url' => '/ovas/ciencias-naturales/seres-vivos/inicio',
                'thumbnail' => '',
                'is_active' => true
            ],
        ];

        foreach ($ovas as $ova) {
            Ova::create($ova);
        }
    }
}