<?php
// database/seeders/OvaSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Ova;

class OvaSeeder extends Seeder
{
    public function run()
    {
        // Limpiar la tabla antes de insertar (opcional)
        // Ova::truncate();

        $ovas = [
            [
                'title' => 'Introducción a la Programación',
                'description' => 'Aprende los fundamentos de la programación con ejemplos prácticos',
                'url' => 'https://www.youtube.com/embed/ejemplo1',
                'thumbnail' => 'https://via.placeholder.com/300x200?text=Programacion',
                'duration' => 45,
                'is_active' => true,
            ],
            [
                'title' => 'Matemáticas Básicas',
                'description' => 'Curso de matemáticas para nivel primario y secundario',
                'url' => 'https://www.youtube.com/embed/ejemplo2',
                'thumbnail' => 'https://via.placeholder.com/300x200?text=Matematicas',
                'duration' => 60,
                'is_active' => true,
            ],
            [
                'title' => 'Historia del Perú',
                'description' => 'Conoce la historia del Perú desde sus inicios hasta la actualidad',
                'url' => 'https://www.youtube.com/embed/ejemplo3',
                'thumbnail' => 'https://via.placeholder.com/300x200?text=Historia',
                'duration' => 50,
                'is_active' => true,
            ],
            [
                'title' => 'Educación Ambiental',
                'description' => 'Importancia del cuidado del medio ambiente y desarrollo sostenible',
                'url' => 'https://www.youtube.com/embed/ejemplo4',
                'thumbnail' => 'https://via.placeholder.com/300x200?text=Ambiente',
                'duration' => 40,
                'is_active' => true,
            ],
            [
                'title' => 'Comunicación Efectiva',
                'description' => 'Mejora tus habilidades de comunicación oral y escrita',
                'url' => 'https://www.youtube.com/embed/ejemplo5',
                'thumbnail' => 'https://via.placeholder.com/300x200?text=Comunicacion',
                'duration' => 55,
                'is_active' => true,
            ],
            [
                'title' => 'Ciencias Naturales',
                'description' => 'Explora el mundo de la biología, química y física',
                'url' => 'https://www.youtube.com/embed/ejemplo6',
                'thumbnail' => 'https://via.placeholder.com/300x200?text=Ciencias',
                'duration' => 65,
                'is_active' => true,
            ],
            [
                'title' => 'Inglés Básico',
                'description' => 'Aprende vocabulario y frases útiles en inglés',
                'url' => 'https://www.youtube.com/embed/ejemplo7',
                'thumbnail' => 'https://via.placeholder.com/300x200?text=Ingles',
                'duration' => 70,
                'is_active' => true,
            ],
            [
                'title' => 'Arte y Creatividad',
                'description' => 'Desarrolla tu lado artístico con técnicas de dibujo y pintura',
                'url' => 'https://www.youtube.com/embed/ejemplo8',
                'thumbnail' => 'https://via.placeholder.com/300x200?text=Arte',
                'duration' => 35,
                'is_active' => true,
            ],
            [
                'title' => 'Educación Física',
                'description' => 'Importancia del deporte y hábitos saludables',
                'url' => 'https://www.youtube.com/embed/ejemplo9',
                'thumbnail' => 'https://via.placeholder.com/300x200?text=Deporte',
                'duration' => 30,
                'is_active' => true,
            ],
            [
                'title' => 'Valores y Ética',
                'description' => 'Formación en valores para una mejor convivencia social',
                'url' => 'https://www.youtube.com/embed/ejemplo10',
                'thumbnail' => 'https://via.placeholder.com/300x200?text=Valores',
                'duration' => 45,
                'is_active' => true,
            ],
        ];

        foreach ($ovas as $ova) {
            Ova::create($ova);
        }

        $this->command->info('OVAs creadas exitosamente: ' . count($ovas));
    }
}