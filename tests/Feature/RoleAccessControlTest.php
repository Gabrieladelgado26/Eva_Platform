<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Iteración 1 – Control de Acceso por Rol
 *
 * Verifica que el middleware `role` protege correctamente cada sección
 * de la plataforma EVA:
 *   - /admin/*   → solo accesible por administradores
 *   - /teacher/* → solo accesible por docentes
 *   - /student/* → solo accesible por estudiantes
 *
 * Un rol incorrecto recibe HTTP 403.
 * Un invitado (sin sesión) es redirigido a /login (HTTP 302).
 */
class RoleAccessControlTest extends TestCase
{
    use RefreshDatabase;

    // ─── Helpers ────────────────────────────────────────────────────────────

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    private function makeUser(string $roleSlug, array $overrides = []): User
    {
        $role = Role::where('slug', $roleSlug)->firstOrFail();

        return User::factory()->create(array_merge([
            'role_id'   => $role->id,
            'is_active' => true,
        ], $overrides));
    }

    private function makeAdmin(): User
    {
        return $this->makeUser('admin', [
            'email'    => 'admin@ctrl.test',
            'password' => Hash::make('pass'),
        ]);
    }

    private function makeTeacher(): User
    {
        return $this->makeUser('teacher', [
            'email'    => 'teacher@ctrl.test',
            'password' => Hash::make('pass'),
        ]);
    }

    private function makeStudent(): User
    {
        return $this->makeUser('student', [
            'username' => 'est-ctrl',
            'pin'      => Hash::make(1234),
            'email'    => null,
            'password' => null,
        ]);
    }

    // ─── Invitados (sin sesión) ──────────────────────────────────────────────

    /** Sin sesión, /admin/dashboard redirige a /login. */
    public function test_invitado_redirigido_a_login_en_ruta_admin(): void
    {
        $response = $this->get(route('admin.dashboard'));
        $response->assertRedirect(route('login'));
    }

    /** Sin sesión, /teacher/ redirige a /login. */
    public function test_invitado_redirigido_a_login_en_ruta_teacher(): void
    {
        $response = $this->get(route('teacher.dashboard'));
        $response->assertRedirect(route('login'));
    }

    /** Sin sesión, /student/ redirige a /login. */
    public function test_invitado_redirigido_a_login_en_ruta_student(): void
    {
        $response = $this->get(route('student.dashboard'));
        $response->assertRedirect(route('login'));
    }

    // ─── Admin: acceso permitido ─────────────────────────────────────────────

    /** El admin puede acceder a su dashboard. */
    public function test_admin_puede_acceder_a_admin_dashboard(): void
    {
        $response = $this->actingAs($this->makeAdmin())->get(route('admin.dashboard'));
        $response->assertStatus(200);
    }

    /** El admin puede acceder a la lista de cursos. */
    public function test_admin_puede_acceder_a_cursos(): void
    {
        $response = $this->actingAs($this->makeAdmin())->get(route('admin.courses.index'));
        $response->assertStatus(200);
    }

    // ─── Admin: acceso denegado a otras secciones ────────────────────────────

    /** El admin recibe 403 si intenta acceder a rutas de docente. */
    public function test_admin_no_puede_acceder_a_rutas_de_docente(): void
    {
        $response = $this->actingAs($this->makeAdmin())->get(route('teacher.dashboard'));
        $response->assertStatus(403);
    }

    /** El admin recibe 403 si intenta acceder a rutas de estudiante. */
    public function test_admin_no_puede_acceder_a_rutas_de_estudiante(): void
    {
        $response = $this->actingAs($this->makeAdmin())->get(route('student.dashboard'));
        $response->assertStatus(403);
    }

    // ─── Docente: acceso permitido ───────────────────────────────────────────

    /** El docente puede acceder a su dashboard. */
    public function test_docente_puede_acceder_a_teacher_dashboard(): void
    {
        $response = $this->actingAs($this->makeTeacher())->get(route('teacher.dashboard'));
        $response->assertStatus(200);
    }

    /** El docente puede acceder a la lista de sus estudiantes. */
    public function test_docente_puede_acceder_a_su_lista_de_estudiantes(): void
    {
        $response = $this->actingAs($this->makeTeacher())->get(route('teacher.students.index'));
        $response->assertStatus(200);
    }

    // ─── Docente: acceso denegado a otras secciones ──────────────────────────

    /** El docente recibe 403 si intenta acceder a rutas de admin. */
    public function test_docente_no_puede_acceder_a_rutas_de_admin(): void
    {
        $response = $this->actingAs($this->makeTeacher())->get(route('admin.dashboard'));
        $response->assertStatus(403);
    }

    /** El docente recibe 403 si intenta acceder a rutas de estudiante. */
    public function test_docente_no_puede_acceder_a_rutas_de_estudiante(): void
    {
        $response = $this->actingAs($this->makeTeacher())->get(route('student.dashboard'));
        $response->assertStatus(403);
    }

    // ─── Estudiante: acceso permitido ────────────────────────────────────────

    /** El estudiante puede acceder a su dashboard (lista de cursos). */
    public function test_estudiante_puede_acceder_a_student_dashboard(): void
    {
        $response = $this->actingAs($this->makeStudent())->get(route('student.dashboard'));
        $response->assertStatus(200);
    }

    // ─── Estudiante: acceso denegado a otras secciones ──────────────────────

    /** El estudiante recibe 403 si intenta acceder a rutas de admin. */
    public function test_estudiante_no_puede_acceder_a_rutas_de_admin(): void
    {
        $response = $this->actingAs($this->makeStudent())->get(route('admin.dashboard'));
        $response->assertStatus(403);
    }

    /** El estudiante recibe 403 si intenta acceder a rutas de docente. */
    public function test_estudiante_no_puede_acceder_a_rutas_de_docente(): void
    {
        $response = $this->actingAs($this->makeStudent())->get(route('teacher.dashboard'));
        $response->assertStatus(403);
    }

    // ─── Rutas específicas con parámetro ─────────────────────────────────────

    /** El docente recibe 403 al intentar acceder a rutas de admin con parámetros. */
    public function test_docente_no_puede_acceder_a_rutas_admin_con_parametros(): void
    {
        $teacher = $this->makeTeacher();
        $admin   = $this->makeAdmin();

        // Crear un curso directamente (sin factory)
        $course = Course::create([
            'grade'       => 'tercero',   // ENUM lowercase
            'section'     => 'A',
            'school_year' => '2026',
            'teacher_id'  => $admin->id,
            'is_active'   => true,
        ]);

        $response = $this->actingAs($teacher)->get(
            route('admin.courses.students', $course)
        );

        $response->assertStatus(403);
    }

    /** El admin recibe 403 al intentar acceder a rutas de docente con parámetros. */
    public function test_admin_no_puede_acceder_a_rutas_teacher_con_parametros(): void
    {
        $admin   = $this->makeAdmin();
        $teacher = $this->makeTeacher();

        $course = Course::create([
            'grade'       => 'cuarto',    // ENUM lowercase
            'section'     => 'B',
            'school_year' => '2026',
            'teacher_id'  => $teacher->id,
            'is_active'   => true,
        ]);

        $response = $this->actingAs($admin)->get(
            route('teacher.courses.students.index', $course)
        );

        $response->assertStatus(403);
    }

    // ─── Dashboard general ───────────────────────────────────────────────────

    /** /dashboard redirige al admin a su panel. */
    public function test_dashboard_redirige_a_admin_a_su_panel(): void
    {
        $response = $this->actingAs($this->makeAdmin())->get('/dashboard');
        $response->assertRedirect(route('admin.dashboard'));
    }

    /** /dashboard redirige al docente a su panel. */
    public function test_dashboard_redirige_a_docente_a_su_panel(): void
    {
        $response = $this->actingAs($this->makeTeacher())->get('/dashboard');
        $response->assertRedirect(route('teacher.dashboard'));
    }

    /** /dashboard redirige al estudiante a su panel. */
    public function test_dashboard_redirige_a_estudiante_a_su_panel(): void
    {
        $response = $this->actingAs($this->makeStudent())->get('/dashboard');
        $response->assertRedirect(route('student.dashboard'));
    }
}
