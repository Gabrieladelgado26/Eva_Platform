<?php

namespace Tests\Feature;

use App\Models\LoginLog;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Iteración 1 – Autenticación
 *
 * Cubre los flujos de inicio y cierre de sesión del sistema EVA,
 * que soporta dos mecanismos de login:
 *   - Estudiantes  → username + PIN de 4 dígitos
 *   - Admin/Docente → email + contraseña
 */
class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    // ─── Helpers ────────────────────────────────────────────────────────────

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    /** Crea un usuario con el rol indicado por su slug. */
    private function makeUser(string $roleSlug, array $overrides = []): User
    {
        $role = Role::where('slug', $roleSlug)->firstOrFail();

        return User::factory()->create(array_merge([
            'role_id'   => $role->id,
            'is_active' => true,
        ], $overrides));
    }

    /** Crea un estudiante con username y PIN hasheado. */
    private function makeStudent(string $username = 'juan-perez', int $pin = 1234, bool $active = true): User
    {
        $role = Role::where('slug', 'student')->firstOrFail();

        return User::factory()->create([
            'role_id'   => $role->id,
            'username'  => $username,
            'pin'       => Hash::make($pin),
            'is_active' => $active,
            'email'     => null,
            'password'  => null,
        ]);
    }

    // ─── Pantalla de login ───────────────────────────────────────────────────

    /** La página de login devuelve HTTP 200. */
    public function test_la_pagina_de_login_se_renderiza(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    // ─── Login de estudiante (username + PIN) ────────────────────────────────

    /** Un estudiante activo puede iniciar sesión con username y PIN correctos. */
    public function test_estudiante_puede_iniciar_sesion_con_username_y_pin(): void
    {
        $student = $this->makeStudent('ana-garcia', 5678);

        $response = $this->post('/login', [
            'username' => 'ana-garcia',
            'pin'      => '5678',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('student.dashboard'));
    }

    /** Un PIN incorrecto no autentica al estudiante. */
    public function test_estudiante_no_puede_iniciar_sesion_con_pin_incorrecto(): void
    {
        $this->makeStudent('pedro-lopez', 1111);

        $this->post('/login', [
            'username' => 'pedro-lopez',
            'pin'      => '9999',
        ]);

        $this->assertGuest();
    }

    /** Un username que no existe no autentica. */
    public function test_estudiante_no_puede_iniciar_sesion_con_username_inexistente(): void
    {
        $this->post('/login', [
            'username' => 'no-existe',
            'pin'      => '1234',
        ]);

        $this->assertGuest();
    }

    /** Un estudiante inactivo no puede iniciar sesión aunque las credenciales sean correctas. */
    public function test_estudiante_inactivo_no_puede_iniciar_sesion(): void
    {
        $this->makeStudent('maria-ruiz', 4321, active: false);

        $response = $this->post('/login', [
            'username' => 'maria-ruiz',
            'pin'      => '4321',
        ]);

        $this->assertGuest();
        $response->assertRedirect(); // devuelve back con error
    }

    // ─── Login de Admin (email + contraseña) ────────────────────────────────

    /** Un administrador activo puede iniciar sesión con email y contraseña. */
    public function test_admin_puede_iniciar_sesion_con_email_y_contrasena(): void
    {
        $admin = $this->makeUser('admin', [
            'email'    => 'admin@eva.test',
            'password' => Hash::make('secret123'),
        ]);

        $response = $this->post('/login', [
            'email'    => 'admin@eva.test',
            'password' => 'secret123',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('admin.dashboard'));
    }

    /** Una contraseña incorrecta no autentica al admin. */
    public function test_admin_no_puede_iniciar_sesion_con_contrasena_incorrecta(): void
    {
        $this->makeUser('admin', [
            'email'    => 'admin2@eva.test',
            'password' => Hash::make('correcta'),
        ]);

        $this->post('/login', [
            'email'    => 'admin2@eva.test',
            'password' => 'incorrecta',
        ]);

        $this->assertGuest();
    }

    // ─── Login de Docente (email + contraseña) ───────────────────────────────

    /** Un docente activo puede iniciar sesión y es redirigido a su dashboard. */
    public function test_docente_puede_iniciar_sesion_y_es_redirigido_a_su_dashboard(): void
    {
        $teacher = $this->makeUser('teacher', [
            'email'    => 'docente@eva.test',
            'password' => Hash::make('clave456'),
        ]);

        $response = $this->post('/login', [
            'email'    => 'docente@eva.test',
            'password' => 'clave456',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('teacher.dashboard'));
    }

    /** Un docente inactivo no puede iniciar sesión. */
    public function test_docente_inactivo_no_puede_iniciar_sesion(): void
    {
        $this->makeUser('teacher', [
            'email'     => 'docente2@eva.test',
            'password'  => Hash::make('clave456'),
            'is_active' => false,
        ]);

        $this->post('/login', [
            'email'    => 'docente2@eva.test',
            'password' => 'clave456',
        ]);

        $this->assertGuest();
    }

    // ─── Redirecciones por rol ───────────────────────────────────────────────

    /** Un admin aterriza en admin.dashboard al iniciar sesión. */
    public function test_admin_redirigido_a_su_dashboard_al_iniciar_sesion(): void
    {
        $this->makeUser('admin', [
            'email'    => 'admin.redirect@eva.test',
            'password' => Hash::make('pass'),
        ]);

        $response = $this->post('/login', [
            'email'    => 'admin.redirect@eva.test',
            'password' => 'pass',
        ]);

        $response->assertRedirect(route('admin.dashboard'));
    }

    /** Un docente aterriza en teacher.dashboard al iniciar sesión. */
    public function test_docente_redirigido_a_su_dashboard_al_iniciar_sesion(): void
    {
        $this->makeUser('teacher', [
            'email'    => 'teacher.redirect@eva.test',
            'password' => Hash::make('pass'),
        ]);

        $response = $this->post('/login', [
            'email'    => 'teacher.redirect@eva.test',
            'password' => 'pass',
        ]);

        $response->assertRedirect(route('teacher.dashboard'));
    }

    // ─── Registro de log de login ─────────────────────────────────────────────

    /** Al iniciar sesión se crea un registro en login_logs. */
    public function test_se_registra_log_al_iniciar_sesion(): void
    {
        $admin = $this->makeUser('admin', [
            'email'    => 'log@eva.test',
            'password' => Hash::make('logpass'),
        ]);

        $this->post('/login', [
            'email'    => 'log@eva.test',
            'password' => 'logpass',
        ]);

        $this->assertDatabaseHas('login_logs', [
            'user_id' => $admin->id,
        ]);
    }

    // ─── Cierre de sesión ────────────────────────────────────────────────────

    /** Un usuario autenticado puede cerrar sesión y queda como invitado. */
    public function test_usuario_puede_cerrar_sesion(): void
    {
        $admin = $this->makeUser('admin', [
            'email'    => 'logout@eva.test',
            'password' => Hash::make('pass'),
        ]);

        $response = $this->actingAs($admin)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/login');
    }

    /** Al cerrar sesión se registra logout_at en login_logs. */
    public function test_se_registra_logout_at_al_cerrar_sesion(): void
    {
        $admin = $this->makeUser('admin', [
            'email'    => 'logout2@eva.test',
            'password' => Hash::make('pass'),
        ]);

        // Crear el log de login previo
        LoginLog::create([
            'user_id'    => $admin->id,
            'login_at'   => now(),
            'ip_address' => '127.0.0.1',
            'user_agent' => 'phpunit',
        ]);

        $this->actingAs($admin)->post('/logout');

        $this->assertDatabaseMissing('login_logs', [
            'user_id'   => $admin->id,
            'logout_at' => null,
        ]);
    }

    // ─── Validación de campos ────────────────────────────────────────────────

    /** El campo PIN debe tener exactamente 4 dígitos. */
    public function test_pin_debe_tener_4_digitos(): void
    {
        $response = $this->post('/login', [
            'username' => 'alguien',
            'pin'      => '12',      // menos de 4 dígitos
        ]);

        $response->assertSessionHasErrors('pin');
        $this->assertGuest();
    }

    /** El campo email debe ser un correo válido en el flujo de admin/docente. */
    public function test_email_invalido_no_pasa_validacion(): void
    {
        $response = $this->post('/login', [
            'email'    => 'no-es-un-email',
            'password' => 'algo',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    // ─── Bloqueo por intentos fallidos ──────────────────────────────────────

    /** Después de 5 intentos fallidos el usuario queda bloqueado temporalmente. */
    public function test_bloqueo_tras_5_intentos_fallidos(): void
    {
        $this->makeUser('admin', [
            'email'    => 'block@eva.test',
            'password' => Hash::make('correcta'),
        ]);

        // 5 intentos fallidos
        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', [
                'email'    => 'block@eva.test',
                'password' => 'incorrecta',
            ]);
        }

        // El 6.º intento (correcto) también debe fallar por rate limit
        $response = $this->post('/login', [
            'email'    => 'block@eva.test',
            'password' => 'correcta',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }
}
