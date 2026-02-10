<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::create([
            'name' => 'Administrador',
            'slug' => 'admin',
            'description' => 'Usuario con control total del sistema'
        ]);

        Role::create([
            'name' => 'Docente',
            'slug' => 'teacher',
            'description' => 'Docente encargado de un curso'
        ]);

        Role::create([
            'name' => 'Estudiante',
            'slug' => 'student',
            'description' => 'Usuario estudiante que accede a OVA asignados'
        ]);
    }
}