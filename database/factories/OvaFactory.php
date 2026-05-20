<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class OvaFactory extends Factory
{
    public function definition(): array
    {
        $paths = [
            '/ovas/mat03/index.html',
            '/ovas/espanol/index.html',
        ];

        return [
            'area'      => $this->faker->randomElement(['Matemáticas', 'Español', 'Inglés', 'Ciencias']),
            'tematica'  => $this->faker->unique()->sentence(3),
            'url'       => $this->faker->randomElement($paths) . '?t=' . $this->faker->unique()->numberBetween(1, 9999),
            'is_active' => true,
        ];
    }
}
