<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('slug', 'admin')->first();
        $teacherRole = Role::where('slug', 'teacher')->first();

        if (!$adminRole) {
            $this->command->error("No existe el rol admin, ejecute RoleSeeder primero.");
            return;
        }

        if (!$teacherRole) {
            $this->command->error("No existe el rol teacher, ejecute RoleSeeder primero.");
            return;
        }

        // Usuario administrador
        User::updateOrCreate(
            ['email' => 'admin@eva.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin123'),
                'role_id' => $adminRole->id,
                'is_active' => true,
            ]
        );

        // Usuario docente
        User::updateOrCreate(
            ['email' => 'fparra@gmail.com'],
            [
                'name' => 'Fabian Parra',
                'password' => Hash::make('admin123'),
                'role_id' => $teacherRole->id,
                'is_active' => true,
            ]
        );

        $this->command->info("Usuario administrador creado: admin@eva.com / admin123");
        $this->command->info("Usuario docente creado: fparra@gmail.com / admin123");
    }
}
