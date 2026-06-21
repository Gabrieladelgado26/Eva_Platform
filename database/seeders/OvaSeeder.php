<?php

namespace Database\Seeders;

use App\Models\Ova;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OvaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Deshabilitar temporalmente las restricciones de clave foránea
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        Ova::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $ovas = [
            [
                'id' => 1,
                'area' => 'Ciencias Naturales',
                'tematica' => 'Seres Vivos y Objetos Inertes',
                'description' => null,
                'url' => '/ovas/ciencias-naturales/seres-vivos/inicio',
                'is_active' => true,
                'created_at' => '2026-05-02 17:20:01',
                'updated_at' => '2026-05-02 17:43:05'
            ],
            [
                'id' => 2,
                'area' => 'Matemáticas',
                'tematica' => 'Adición y Sustracción',
                'description' => null,
                'url' => '/ovas/matematicas/adicion-sustraccion/inicio',
                'is_active' => true,
                'created_at' => '2026-05-02 17:31:47',
                'updated_at' => '2026-05-02 17:31:47'
            ],
            [
                'id' => 3,
                'area' => 'Español',
                'tematica' => 'El Cuento',
                'description' => null,
                'url' => '/ovas/espanol/cuento/inicio',
                'is_active' => true,
                'created_at' => '2026-05-02 17:45:25',
                'updated_at' => '2026-05-02 17:45:25'
            ],
            [
                'id' => 4,
                'area' => 'Ciencias Sociales',
                'tematica' => 'Patrimonio Cultural',
                'description' => 'Reconocer la importancia del patrimonio cultural de Nariño',
                'url' => '/ovas/ciencias-sociales/patrimonio-cultural/inicio',
                'is_active' => true,
                'created_at' => '2026-05-02 17:50:47',
                'updated_at' => '2026-05-02 17:50:47'
            ]
        ];

        foreach ($ovas as $ovaData) {
            Ova::create($ovaData);
        }

        $this->command->info('OVAs insertados exitosamente: ' . count($ovas) . ' registros');
    }
}