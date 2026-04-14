<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::updateOrCreate(
            ['slug' => 'admin'],
            [
                'name' => 'Administrador',
                'description' => 'Usuario con control total del sistema'
            ]
        );

        Role::updateOrCreate(
            ['slug' => 'teacher'],
            [
                'name' => 'Docente',
                'description' => 'Docente encargado de un curso'
            ]
        );

        Role::updateOrCreate(
            ['slug' => 'student'],
            [
                'name' => 'Estudiante',
                'description' => 'Usuario estudiante que accede a OVA asignados'
            ]
        );
    }
}