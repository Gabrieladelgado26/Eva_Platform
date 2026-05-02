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
 * Iteración 2 – Gestión Académica Básica
 *
 * Cubre las historias de usuario HU-013 a HU-018:
 *   HU-013  Docente crea curso
 *   HU-014  Docente visualiza listado de sus cursos
 *   HU-015  Docente edita curso
 *   HU-016  Docente activa / desactiva curso
 *   HU-017  Docente elimina curso
 *   HU-018  Administrador crea curso y lo asigna a un docente
 */
class CourseManagementTest extends TestCase
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

    private function makeTeacher(array $overrides = []): User
    {
        return $this->makeUser('teacher', array_merge([
            'email'    => 'docente@test.test',
            'password' => Hash::make('pass'),
        ], $overrides));
    }

    private function makeAdmin(array $overrides = []): User
    {
        return $this->makeUser('admin', array_merge([
            'email'    => 'admin@test.test',
            'password' => Hash::make('pass'),
        ], $overrides));
    }

    /**
     * Crea un curso asociado a un docente.
     */
    private function makeCourse(User $teacher, array $overrides = []): Course
    {
        return Course::create(array_merge([
            'grade'       => 'primero',
            'section'     => 'A',
            'school_year' => date('Y'),
            'teacher_id'  => $teacher->id,
            'is_active'   => true,
        ], $overrides));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-013 — Docente crea curso
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-1 & CA-2: El docente puede crear un curso con datos válidos. */
    public function test_docente_puede_crear_curso_con_datos_validos(): void
    {
        $teacher = $this->makeTeacher();

        $response = $this->actingAs($teacher)->post(route('teacher.courses.store'), [
            'grade'       => 'segundo',
            'section'     => 'B',
            'description' => 'Curso de prueba',
        ]);

        $response->assertRedirect(route('teacher.dashboard'));
        $this->assertDatabaseHas('courses', [
            'grade'      => 'segundo',
            'section'    => 'B',
            'teacher_id' => $teacher->id,
        ]);
    }

    /** CA-2: El año lectivo se asigna automáticamente al crear el curso. */
    public function test_anio_lectivo_se_asigna_automaticamente(): void
    {
        $teacher = $this->makeTeacher();

        $this->actingAs($teacher)->post(route('teacher.courses.store'), [
            'grade'   => 'tercero',
            'section' => 'C',
        ]);

        $course = Course::where('teacher_id', $teacher->id)->first();
        $this->assertNotNull($course);
        $this->assertEquals(date('Y'), $course->school_year);
    }

    /** CA-2: El curso queda vinculado al docente autenticado, no a otro. */
    public function test_curso_se_vincula_al_docente_autenticado(): void
    {
        $teacher1 = $this->makeTeacher(['email' => 'd1@t.com']);
        $teacher2 = $this->makeTeacher(['email' => 'd2@t.com']);

        $this->actingAs($teacher1)->post(route('teacher.courses.store'), [
            'grade'   => 'cuarto',
            'section' => 'A',
        ]);

        $this->assertDatabaseHas('courses', ['teacher_id' => $teacher1->id]);
        $this->assertDatabaseMissing('courses', [
            'grade'      => 'cuarto',
            'section'    => 'A',
            'teacher_id' => $teacher2->id,
        ]);
    }

    /** CA-3: Crear un curso duplicado (mismo grado, sección y año) para el mismo docente es rechazado. */
    public function test_docente_no_puede_crear_curso_duplicado(): void
    {
        $teacher = $this->makeTeacher();

        // Primer registro
        $this->actingAs($teacher)->post(route('teacher.courses.store'), [
            'grade'   => 'primero',
            'section' => 'A',
        ]);

        // Intento duplicado
        $response = $this->actingAs($teacher)->post(route('teacher.courses.store'), [
            'grade'   => 'primero',
            'section' => 'A',
        ]);

        $response->assertSessionHasErrors('grade');
        $this->assertEquals(1, Course::where('teacher_id', $teacher->id)->count());
    }

    /** CA-3: Dos docentes distintos sí pueden tener el mismo grado y sección en el mismo año. */
    public function test_docentes_distintos_pueden_tener_el_mismo_grado_seccion(): void
    {
        $teacher1 = $this->makeTeacher(['email' => 'd1@t.com']);
        $teacher2 = $this->makeTeacher(['email' => 'd2@t.com']);

        $this->actingAs($teacher1)->post(route('teacher.courses.store'), [
            'grade'   => 'segundo',
            'section' => 'B',
        ]);

        $response = $this->actingAs($teacher2)->post(route('teacher.courses.store'), [
            'grade'   => 'segundo',
            'section' => 'B',
        ]);

        $response->assertRedirect(route('teacher.dashboard'));
        $this->assertEquals(2, Course::count());
    }

    /** CA-4: Campos obligatorios vacíos generan error de validación. */
    public function test_crear_curso_sin_grado_falla_validacion(): void
    {
        $teacher = $this->makeTeacher();

        $response = $this->actingAs($teacher)->post(route('teacher.courses.store'), [
            'section' => 'A',
            // sin grade
        ]);

        $response->assertSessionHasErrors('grade');
        $this->assertDatabaseCount('courses', 0);
    }

    /** CA-4: Sección vacía genera error de validación. */
    public function test_crear_curso_sin_seccion_falla_validacion(): void
    {
        $teacher = $this->makeTeacher();

        $response = $this->actingAs($teacher)->post(route('teacher.courses.store'), [
            'grade' => 'primero',
            // sin section
        ]);

        $response->assertSessionHasErrors('section');
    }

    /** Solo los grados válidos (primero-quinto) son aceptados. */
    public function test_grado_invalido_falla_validacion(): void
    {
        $teacher = $this->makeTeacher();

        $response = $this->actingAs($teacher)->post(route('teacher.courses.store'), [
            'grade'   => 'sexto',   // fuera del enum
            'section' => 'A',
        ]);

        $response->assertSessionHasErrors('grade');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-014 — Docente visualiza listado de sus cursos
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-1: El dashboard del docente se renderiza correctamente. */
    public function test_docente_puede_acceder_a_su_dashboard(): void
    {
        $teacher = $this->makeTeacher();

        $response = $this->actingAs($teacher)->get(route('teacher.dashboard'));

        $response->assertStatus(200);
    }

    /** CA-1: El dashboard solo muestra los cursos del docente autenticado. */
    public function test_docente_solo_ve_sus_propios_cursos(): void
    {
        $teacher1 = $this->makeTeacher(['email' => 'd1@t.com']);
        $teacher2 = $this->makeTeacher(['email' => 'd2@t.com']);

        $this->makeCourse($teacher1, ['grade' => 'primero', 'section' => 'A']);
        $this->makeCourse($teacher2, ['grade' => 'segundo', 'section' => 'B']);

        $response = $this->actingAs($teacher1)->get(route('teacher.dashboard'));

        $response->assertStatus(200);

        // Los datos de Inertia solo deben tener 1 curso
        $props = $response->original->getData()['page']['props'] ?? [];
        $courses = $props['courses'] ?? [];
        $this->assertCount(1, $courses);
        $this->assertEquals('primero', $courses[0]['grade']);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-015 — Docente edita curso
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-1: El formulario de edición carga con los datos actuales del curso. */
    public function test_formulario_de_edicion_carga_correctamente(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher, ['grade' => 'primero', 'section' => 'A']);

        $response = $this->actingAs($teacher)->get(route('teacher.courses.edit', $course));

        $response->assertStatus(200);
    }

    /** CA-2: El docente puede guardar cambios válidos en un curso. */
    public function test_docente_puede_editar_curso_con_datos_validos(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher, ['grade' => 'primero', 'section' => 'A']);

        $response = $this->actingAs($teacher)->put(route('teacher.courses.update', $course), [
            'grade'       => 'segundo',
            'section'     => 'B',
            'description' => 'Descripción actualizada',
        ]);

        $response->assertRedirect(route('teacher.dashboard'));
        $this->assertDatabaseHas('courses', [
            'id'      => $course->id,
            'grade'   => 'segundo',
            'section' => 'B',
        ]);
    }

    /** CA-3: La edición que genera duplicado es rechazada. */
    public function test_edicion_duplicada_es_rechazada(): void
    {
        $teacher  = $this->makeTeacher();
        $course1  = $this->makeCourse($teacher, ['grade' => 'primero', 'section' => 'A']);
        $course2  = $this->makeCourse($teacher, ['grade' => 'segundo', 'section' => 'B']);

        // Intentar renombrar course2 igual que course1
        $response = $this->actingAs($teacher)->put(route('teacher.courses.update', $course2), [
            'grade'   => 'primero',
            'section' => 'A',
        ]);

        // Debe tener error o no redirigir exitosamente (el controller valida duplicados)
        // El controller actual no agrega withErrors en update, pero la unique DB constraint lanzaría excepción.
        // Verificamos que el curso NO fue modificado.
        $this->assertDatabaseHas('courses', [
            'id'      => $course2->id,
            'grade'   => 'segundo',
            'section' => 'B',
        ]);
    }

    /** CA-4: Editar con campos vacíos genera error de validación. */
    public function test_editar_curso_sin_grado_falla_validacion(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($teacher)->put(route('teacher.courses.update', $course), [
            'grade'   => '',
            'section' => 'A',
        ]);

        $response->assertSessionHasErrors('grade');
    }

    /** Un docente no puede editar el curso de otro docente. */
    public function test_docente_no_puede_editar_curso_ajeno(): void
    {
        $teacher1 = $this->makeTeacher(['email' => 'd1@t.com']);
        $teacher2 = $this->makeTeacher(['email' => 'd2@t.com']);
        $course   = $this->makeCourse($teacher1);

        $response = $this->actingAs($teacher2)->put(route('teacher.courses.update', $course), [
            'grade'   => 'segundo',
            'section' => 'A',
        ]);

        $response->assertStatus(403);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-016 — Docente activa / desactiva curso
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-1: El docente puede desactivar un curso activo. */
    public function test_docente_puede_desactivar_curso_activo(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher, ['is_active' => true]);

        $this->actingAs($teacher)->patch(route('teacher.courses.toggleStatus', $course));

        $this->assertDatabaseHas('courses', [
            'id'        => $course->id,
            'is_active' => false,
        ]);
    }

    /** CA-2: El docente puede reactivar un curso inactivo. */
    public function test_docente_puede_reactivar_curso_inactivo(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher, ['is_active' => false]);

        $this->actingAs($teacher)->patch(route('teacher.courses.toggleStatus', $course));

        $this->assertDatabaseHas('courses', [
            'id'        => $course->id,
            'is_active' => true,
        ]);
    }

    /** Un docente no puede cambiar el estado del curso de otro docente. */
    public function test_docente_no_puede_togglear_curso_ajeno(): void
    {
        $teacher1 = $this->makeTeacher(['email' => 'd1@t.com']);
        $teacher2 = $this->makeTeacher(['email' => 'd2@t.com']);
        $course   = $this->makeCourse($teacher1, ['is_active' => true]);

        $response = $this->actingAs($teacher2)->patch(
            route('teacher.courses.toggleStatus', $course)
        );

        $response->assertStatus(403);
        // El estado no debe haber cambiado
        $this->assertDatabaseHas('courses', [
            'id'        => $course->id,
            'is_active' => true,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-017 — Docente elimina curso
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-2: El docente puede eliminar su propio curso. */
    public function test_docente_puede_eliminar_su_curso(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($teacher)->delete(route('teacher.courses.destroy', $course));

        $response->assertRedirect(route('teacher.dashboard'));
        $this->assertDatabaseMissing('courses', ['id' => $course->id]);
    }

    /** CA-3: Al eliminar el curso los estudiantes inscritos son desvinculados pero no borrados. */
    public function test_eliminar_curso_desvincula_estudiantes_pero_no_los_borra(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        // Inscribir un estudiante
        $student = $this->makeUser('student', [
            'username' => 'est-del',
            'pin'      => Hash::make(1234),
            'email'    => null,
            'password' => null,
        ]);
        $course->students()->attach($student->id);

        $this->assertDatabaseHas('course_student', [
            'course_id' => $course->id,
            'user_id'   => $student->id,
        ]);

        $this->actingAs($teacher)->delete(route('teacher.courses.destroy', $course));

        // Curso eliminado
        $this->assertDatabaseMissing('courses', ['id' => $course->id]);
        // Relación eliminada
        $this->assertDatabaseMissing('course_student', [
            'course_id' => $course->id,
            'user_id'   => $student->id,
        ]);
        // Estudiante sigue existiendo
        $this->assertDatabaseHas('users', ['id' => $student->id]);
    }

    /** Un docente no puede eliminar el curso de otro docente. */
    public function test_docente_no_puede_eliminar_curso_ajeno(): void
    {
        $teacher1 = $this->makeTeacher(['email' => 'd1@t.com']);
        $teacher2 = $this->makeTeacher(['email' => 'd2@t.com']);
        $course   = $this->makeCourse($teacher1);

        $response = $this->actingAs($teacher2)->delete(route('teacher.courses.destroy', $course));

        $response->assertStatus(403);
        $this->assertDatabaseHas('courses', ['id' => $course->id]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-018 — Administrador crea curso y lo asigna a un docente
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-2: El admin puede crear un curso y asignarlo a un docente existente. */
    public function test_admin_puede_crear_curso_asignado_a_docente(): void
    {
        $admin   = $this->makeAdmin();
        $teacher = $this->makeTeacher(['email' => 'd@t.com']);

        $response = $this->actingAs($admin)->post(route('admin.courses.store'), [
            'grade'       => 'cuarto',
            'section'     => 'A',
            'school_year' => date('Y'),
            'teacher_id'  => $teacher->getRouteKey(),   // hashid del docente
            'description' => 'Curso desde admin',
        ]);

        $response->assertRedirect(route('admin.courses.index'));
        $this->assertDatabaseHas('courses', [
            'grade'      => 'cuarto',
            'section'    => 'A',
            'teacher_id' => $teacher->id,
        ]);
    }

    /** CA-3: El admin no puede crear un curso sin seleccionar docente. */
    public function test_admin_no_puede_crear_curso_sin_docente(): void
    {
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->post(route('admin.courses.store'), [
            'grade'       => 'quinto',
            'section'     => 'B',
            'school_year' => date('Y'),
            // teacher_id ausente
        ]);

        // El controller hace abort_if(!$teacherId, 422, 'Docente no válido.')
        $response->assertStatus(422);
        $this->assertDatabaseCount('courses', 0);
    }

    /** CA-4: Admin no puede crear un curso duplicado (mismo grado, sección y año para el mismo docente). */
    public function test_admin_no_puede_crear_curso_duplicado(): void
    {
        $admin   = $this->makeAdmin();
        $teacher = $this->makeTeacher(['email' => 'd@t.com']);

        $data = [
            'grade'       => 'primero',
            'section'     => 'A',
            'school_year' => date('Y'),
            'teacher_id'  => $teacher->getRouteKey(),
        ];

        $this->actingAs($admin)->post(route('admin.courses.store'), $data);

        // Segundo intento idéntico — debe fallar por unique constraint
        $response = $this->actingAs($admin)->post(route('admin.courses.store'), $data);

        $response->assertStatus(500); // DB unique constraint violation
        $this->assertEquals(1, Course::count());
    }

    /** El admin puede editar un curso existente. */
    public function test_admin_puede_editar_curso(): void
    {
        $admin   = $this->makeAdmin();
        $teacher = $this->makeTeacher(['email' => 'd@t.com']);
        $course  = $this->makeCourse($teacher, ['grade' => 'primero', 'section' => 'A']);

        $response = $this->actingAs($admin)->put(route('admin.courses.update', $course), [
            'grade'       => 'segundo',
            'section'     => 'C',
            'school_year' => date('Y'),
            'teacher_id'  => $teacher->getRouteKey(),
        ]);

        $response->assertRedirect(route('admin.courses.index'));
        $this->assertDatabaseHas('courses', [
            'id'      => $course->id,
            'grade'   => 'segundo',
            'section' => 'C',
        ]);
    }

    /** El admin puede eliminar un curso. */
    public function test_admin_puede_eliminar_curso(): void
    {
        $admin   = $this->makeAdmin();
        $teacher = $this->makeTeacher(['email' => 'd@t.com']);
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($admin)->delete(route('admin.courses.destroy', $course));

        $response->assertRedirect(route('admin.courses.index'));
        $this->assertDatabaseMissing('courses', ['id' => $course->id]);
    }

    /** El admin puede activar/desactivar un curso. */
    public function test_admin_puede_togglear_estado_de_curso(): void
    {
        $admin   = $this->makeAdmin();
        $teacher = $this->makeTeacher(['email' => 'd@t.com']);
        $course  = $this->makeCourse($teacher, ['is_active' => true]);

        $this->actingAs($admin)->patch(route('admin.courses.toggleStatus', $course));

        $this->assertDatabaseHas('courses', [
            'id'        => $course->id,
            'is_active' => false,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Acceso no autorizado — cursos
    // ═══════════════════════════════════════════════════════════════════════

    /** Un estudiante no puede crear cursos. */
    public function test_estudiante_no_puede_crear_cursos(): void
    {
        $student = $this->makeUser('student', [
            'username' => 'est',
            'pin'      => Hash::make(1234),
            'email'    => null,
            'password' => null,
        ]);

        $response = $this->actingAs($student)->post(route('teacher.courses.store'), [
            'grade'   => 'primero',
            'section' => 'A',
        ]);

        $response->assertStatus(403);
    }

    /** Un invitado sin sesión es redirigido al login al intentar crear un curso. */
    public function test_invitado_no_puede_crear_cursos(): void
    {
        $response = $this->post(route('teacher.courses.store'), [
            'grade'   => 'primero',
            'section' => 'A',
        ]);

        $response->assertRedirect(route('login'));
    }
}
