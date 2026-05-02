<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Iteración 1 – Gestión de Usuarios
 *
 * Verifica que el administrador puede gestionar el ciclo de vida completo
 * de los usuarios (admin, docente y estudiante): creación, edición,
 * activación/desactivación, regeneración de PIN y eliminación.
 * También verifica que usuarios con otros roles no pueden acceder a
 * estas operaciones.
 */
class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    // ─── Helpers ────────────────────────────────────────────────────────────

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    /** Crea un usuario con el rol indicado y lo devuelve autenticado si se indica. */
    private function makeUser(string $roleSlug, array $overrides = []): User
    {
        $role = Role::where('slug', $roleSlug)->firstOrFail();

        return User::factory()->create(array_merge([
            'role_id'   => $role->id,
            'is_active' => true,
        ], $overrides));
    }

    // ─── Acceso a listados ───────────────────────────────────────────────────

    /** El admin puede acceder a la vista de personal (admin + docentes). */
    public function test_admin_puede_ver_listado_de_personal(): void
    {
        $admin = $this->makeUser('admin', [
            'email'    => 'admin@eva.test',
            'password' => Hash::make('pass'),
        ]);

        $response = $this->actingAs($admin)->get(route('admin.staff'));

        $response->assertStatus(200);
    }

    /** El admin puede acceder a la vista de estudiantes. */
    public function test_admin_puede_ver_listado_de_estudiantes(): void
    {
        $admin = $this->makeUser('admin', [
            'email'    => 'admin2@eva.test',
            'password' => Hash::make('pass'),
        ]);

        $response = $this->actingAs($admin)->get(route('admin.students'));

        $response->assertStatus(200);
    }

    // ─── Creación de usuarios ────────────────────────────────────────────────

    /** El admin puede crear un docente enviando los campos correctos. */
    public function test_admin_puede_crear_un_docente(): void
    {
        $admin       = $this->makeUser('admin', ['email' => 'a@t.com', 'password' => Hash::make('p')]);
        $teacherRole = Role::where('slug', 'teacher')->first();

        $response = $this->actingAs($admin)->post(route('admin.users.store'), [
            'name'     => 'Docente Nuevo',
            'email'    => 'docente@eva.test',
            'password' => 'segura123',
            'role_id'  => $teacherRole->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'email'   => 'docente@eva.test',
            'role_id' => $teacherRole->id,
        ]);
    }

    /** El admin puede crear un administrador. */
    public function test_admin_puede_crear_otro_administrador(): void
    {
        $admin     = $this->makeUser('admin', ['email' => 'a@t.com', 'password' => Hash::make('p')]);
        $adminRole = Role::where('slug', 'admin')->first();

        $response = $this->actingAs($admin)->post(route('admin.users.store'), [
            'name'     => 'Admin Nuevo',
            'email'    => 'admin2@eva.test',
            'password' => 'admin456',
            'role_id'  => $adminRole->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'email'   => 'admin2@eva.test',
            'role_id' => $adminRole->id,
        ]);
    }

    /** Al crear un estudiante se genera username y PIN automáticamente. */
    public function test_admin_puede_crear_un_estudiante_con_credenciales_auto(): void
    {
        $admin       = $this->makeUser('admin', ['email' => 'a@t.com', 'password' => Hash::make('p')]);
        $studentRole = Role::where('slug', 'student')->first();

        $response = $this->actingAs($admin)->post(route('admin.users.store'), [
            'name'    => 'Valentina Torres',
            'role_id' => $studentRole->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'name'    => 'Valentina Torres',
            'role_id' => $studentRole->id,
        ]);

        // El username debe derivarse del nombre
        $created = User::where('name', 'Valentina Torres')->first();
        $this->assertNotNull($created);
        $this->assertNotNull($created->username);
        $this->assertNotNull($created->pin);
    }

    /** La creación falla si falta el email para un docente. */
    public function test_creacion_de_docente_falla_sin_email(): void
    {
        $admin       = $this->makeUser('admin', ['email' => 'a@t.com', 'password' => Hash::make('p')]);
        $teacherRole = Role::where('slug', 'teacher')->first();

        $response = $this->actingAs($admin)->post(route('admin.users.store'), [
            'name'    => 'Sin Email',
            'role_id' => $teacherRole->id,
            // sin email
        ]);

        $response->assertSessionHasErrors('email');
    }

    /** No se puede registrar dos usuarios con el mismo email. */
    public function test_email_duplicado_falla_validacion(): void
    {
        $admin       = $this->makeUser('admin', ['email' => 'a@t.com', 'password' => Hash::make('p')]);
        $teacherRole = Role::where('slug', 'teacher')->first();

        // Primer docente (password válido: mínimo 6 chars)
        $this->actingAs($admin)->post(route('admin.users.store'), [
            'name'     => 'Docente Uno',
            'email'    => 'repetido@eva.test',
            'password' => 'secret123',
            'role_id'  => $teacherRole->id,
        ]);

        // Segundo docente con el mismo email
        $response = $this->actingAs($admin)->post(route('admin.users.store'), [
            'name'     => 'Docente Dos',
            'email'    => 'repetido@eva.test',
            'password' => 'secret123',
            'role_id'  => $teacherRole->id,
        ]);

        $response->assertSessionHasErrors('email');
    }

    // ─── Edición de usuarios ─────────────────────────────────────────────────

    /** El admin puede actualizar el nombre de un docente. */
    public function test_admin_puede_editar_nombre_de_docente(): void
    {
        $admin   = $this->makeUser('admin', ['email' => 'a@t.com', 'password' => Hash::make('p')]);
        $teacher = $this->makeUser('teacher', ['email' => 'teacher@t.com', 'name' => 'Nombre Original']);
        $role    = Role::where('slug', 'teacher')->first();

        $response = $this->actingAs($admin)->put(
            route('admin.users.update', $teacher->getRouteKey()),
            [
                'name'      => 'Nombre Actualizado',
                'email'     => 'teacher@t.com',
                'role_id'   => $role->id,
                'is_active' => true,
            ]
        );

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id'   => $teacher->id,
            'name' => 'Nombre Actualizado',
        ]);
    }

    // ─── Eliminación de usuarios ─────────────────────────────────────────────

    /** El admin puede eliminar un docente. */
    public function test_admin_puede_eliminar_un_docente(): void
    {
        $admin   = $this->makeUser('admin', ['email' => 'a@t.com', 'password' => Hash::make('p')]);
        $teacher = $this->makeUser('teacher', ['email' => 'to-delete@t.com']);

        $response = $this->actingAs($admin)->delete(
            route('admin.users.destroy', $teacher->getRouteKey())
        );

        $response->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $teacher->id]);
    }

    /** El admin NO puede eliminarse a sí mismo si es el único admin activo. */
    public function test_admin_no_puede_eliminar_ultimo_admin_activo(): void
    {
        $admin = $this->makeUser('admin', ['email' => 'a@t.com', 'password' => Hash::make('p')]);

        // Intenta eliminarse a sí mismo
        $response = $this->actingAs($admin)->delete(
            route('admin.users.destroy', $admin->getRouteKey())
        );

        // Debe redirigir con error, no eliminar
        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    // ─── Activación / Desactivación ──────────────────────────────────────────

    /** El admin puede desactivar a un docente. */
    public function test_admin_puede_desactivar_un_docente(): void
    {
        $admin   = $this->makeUser('admin', ['email' => 'a@t.com', 'password' => Hash::make('p')]);
        $teacher = $this->makeUser('teacher', ['email' => 'active-teacher@t.com', 'is_active' => true]);

        $this->actingAs($admin)->patch(
            route('admin.users.toggleStatus', $teacher->getRouteKey())
        );

        $this->assertDatabaseHas('users', [
            'id'        => $teacher->id,
            'is_active' => false,
        ]);
    }

    /** El admin puede volver a activar a un docente desactivado. */
    public function test_admin_puede_reactivar_un_docente(): void
    {
        $admin   = $this->makeUser('admin', ['email' => 'a@t.com', 'password' => Hash::make('p')]);
        $teacher = $this->makeUser('teacher', ['email' => 'inactive@t.com', 'is_active' => false]);

        $this->actingAs($admin)->patch(
            route('admin.users.toggleStatus', $teacher->getRouteKey())
        );

        $this->assertDatabaseHas('users', [
            'id'        => $teacher->id,
            'is_active' => true,
        ]);
    }

    /** El admin NO puede desactivar al único admin activo. */
    public function test_admin_no_puede_desactivar_ultimo_admin_activo(): void
    {
        $admin = $this->makeUser('admin', ['email' => 'a@t.com', 'password' => Hash::make('p')]);

        $this->actingAs($admin)->patch(
            route('admin.users.toggleStatus', $admin->getRouteKey())
        );

        // Debe seguir activo
        $this->assertDatabaseHas('users', [
            'id'        => $admin->id,
            'is_active' => true,
        ]);
    }

    // ─── Regeneración de PIN ─────────────────────────────────────────────────

    /** El admin puede regenerar el PIN de un estudiante. */
    public function test_admin_puede_regenerar_pin_de_estudiante(): void
    {
        $admin   = $this->makeUser('admin', ['email' => 'a@t.com', 'password' => Hash::make('p')]);
        $student = $this->makeUser('student', [
            'username' => 'carlos-lopez',
            'pin'      => Hash::make(1234),
            'email'    => null,
            'password' => null,
        ]);

        $pinAntes = $student->fresh()->pin;

        $this->actingAs($admin)->post(
            route('admin.users.regeneratePin', $student->getRouteKey())
        );

        // El hash del PIN debe haber cambiado
        $this->assertNotEquals($pinAntes, $student->fresh()->pin);
    }

    // ─── Acceso no autorizado ────────────────────────────────────────────────

    /** Un docente no puede acceder a rutas de administración de usuarios. */
    public function test_docente_no_puede_acceder_a_gestion_de_usuarios(): void
    {
        $teacher = $this->makeUser('teacher', ['email' => 't@t.com', 'password' => Hash::make('p')]);

        $response = $this->actingAs($teacher)->get(route('admin.staff'));
        $response->assertStatus(403);
    }

    /** Un estudiante no puede acceder a rutas de administración de usuarios. */
    public function test_estudiante_no_puede_acceder_a_gestion_de_usuarios(): void
    {
        $student = $this->makeUser('student', [
            'username' => 'est-test',
            'pin'      => Hash::make(9999),
            'email'    => null,
            'password' => null,
        ]);

        $response = $this->actingAs($student)->get(route('admin.staff'));
        $response->assertStatus(403);
    }

    /** Un invitado (sin sesión) es redirigido al login al intentar gestionar usuarios. */
    public function test_invitado_es_redirigido_al_login(): void
    {
        $response = $this->get(route('admin.staff'));
        $response->assertRedirect(route('login'));
    }
}
