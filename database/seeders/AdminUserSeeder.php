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

        if (!$adminRole) {
            $this->command->error("No existe el rol admin, ejecute RoleSeeder primero.");
            return;
        }

        User::updateOrCreate(
            ['email' => 'admin@eva.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin123'),
                'role_id' => $adminRole->id,
                'is_active' => true,
            ]
        );

        $this->command->info("Usuario administrador creado: admin@eva.com / admin123");
    }
}
