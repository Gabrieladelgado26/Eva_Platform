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
 * Iteración 3 – Gestión de Estudiantes en Cursos
 *
 * Cubre las historias de usuario HU-019 a HU-023:
 *   HU-019  Inscribir estudiantes en un curso (individual: existente y nuevo)
 *   HU-020  Cargar estudiantes de manera masiva
 *   HU-021  Retirar estudiante de un curso
 *   HU-022  Visualizar estudiantes inscritos en un curso
 *   HU-023  Restablecer PIN y gestión avanzada de estudiantes
 */
class StudentEnrollmentTest extends TestCase
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

    private function makeTeacher(string $email = 'docente@test.test'): User
    {
        return $this->makeUser('teacher', [
            'email'    => $email,
            'password' => Hash::make('pass'),
        ]);
    }

    private function makeStudent(string $username = 'est-test', int $pin = 1234): User
    {
        static $counter = 0;
        $counter++;
        return $this->makeUser('student', [
            'username' => $username . $counter,
            'pin'      => Hash::make($pin),
            'email'    => null,
            'password' => null,
        ]);
    }

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
    // HU-019 — Inscribir estudiantes (individual)
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-2: El docente vincula un estudiante existente a su curso mediante su hashid. */
    public function test_docente_puede_inscribir_estudiante_existente(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();

        $response = $this->actingAs($teacher)->post(
            route('teacher.courses.students.store', $course),
            [
                'student_id'   => $student->getRouteKey(),
                'stay_on_page' => true,
            ]
        );

        $response->assertRedirect();
        $this->assertDatabaseHas('course_student', [
            'course_id' => $course->id,
            'user_id'   => $student->id,
        ]);
    }

    /** CA-3: El docente crea un nuevo estudiante desde el flujo de inscripción (solo con nombre). */
    public function test_docente_puede_crear_nuevo_estudiante_en_inscripcion(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($teacher)->post(
            route('teacher.courses.students.store', $course),
            [
                'name'         => 'Laura Martínez',
                'stay_on_page' => true,
            ]
        );

        $response->assertRedirect();
        // El estudiante fue creado
        $student = User::where('name', 'Laura Martínez')->first();
        $this->assertNotNull($student);
        // Tiene username auto-generado
        $this->assertNotNull($student->username);
        $this->assertEquals('laura-martinez', $student->username);
        // Tiene PIN hasheado
        $this->assertNotNull($student->pin);
        // Está inscrito en el curso
        $this->assertDatabaseHas('course_student', [
            'course_id' => $course->id,
            'user_id'   => $student->id,
        ]);
    }

    /** CA-3: Si el username ya existe, se agrega sufijo numérico para garantizar unicidad. */
    public function test_username_con_sufijo_numerico_cuando_ya_existe(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        // Crear estudiante con nombre base
        User::factory()->create([
            'role_id'  => Role::where('slug', 'student')->first()->id,
            'username' => 'carlos-garcia',
            'email'    => null,
            'password' => null,
        ]);

        $this->actingAs($teacher)->post(
            route('teacher.courses.students.store', $course),
            ['name' => 'Carlos García', 'stay_on_page' => true]
        );

        // El segundo debe quedar como 'carlos-garcia1'
        $this->assertDatabaseHas('users', ['username' => 'carlos-garcia1']);
    }

    /** CA-3: Las credenciales (username y PIN) son devueltas en sesión para mostrar al docente. */
    public function test_credenciales_devueltas_en_sesion_al_crear_estudiante(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($teacher)->post(
            route('teacher.courses.students.store', $course),
            ['name' => 'Ana Pérez', 'stay_on_page' => true]
        );

        $response->assertSessionHas('credentials');
        $credentials = session('credentials');
        $this->assertArrayHasKey('username', $credentials);
        $this->assertArrayHasKey('pin', $credentials);
        $this->assertIsInt($credentials['pin']);
        // PIN debe ser de 4 dígitos
        $this->assertGreaterThanOrEqual(1000, $credentials['pin']);
        $this->assertLessThanOrEqual(9999, $credentials['pin']);
    }

    /** CA-4: Un estudiante ya inscrito no debe poder duplicarse en el mismo curso. */
    public function test_estudiante_ya_inscrito_no_puede_duplicarse(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();

        // Primera inscripción
        $course->students()->attach($student->id);

        // Intentar inscribir de nuevo
        $this->actingAs($teacher)->post(
            route('teacher.courses.students.store', $course),
            ['student_id' => $student->getRouteKey(), 'stay_on_page' => true]
        );

        // Solo debe haber un registro
        $this->assertEquals(1, $course->students()->count());
    }

    /** CA-5: Nombre vacío al crear nuevo estudiante genera error de validación. */
    public function test_nombre_vacio_al_crear_estudiante_falla_validacion(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($teacher)->post(
            route('teacher.courses.students.store', $course),
            ['name' => '', 'stay_on_page' => true]
        );

        $response->assertSessionHasErrors('name');
        $this->assertDatabaseCount('course_student', 0);
    }

    /** El docente no puede inscribir estudiantes en un curso que no le pertenece. */
    public function test_docente_no_puede_inscribir_en_curso_ajeno(): void
    {
        $teacher1 = $this->makeTeacher('d1@t.com');
        $teacher2 = $this->makeTeacher('d2@t.com');
        $course   = $this->makeCourse($teacher1);
        $student  = $this->makeStudent();

        $response = $this->actingAs($teacher2)->post(
            route('teacher.courses.students.store', $course),
            ['student_id' => $student->getRouteKey()]
        );

        $response->assertStatus(403);
        $this->assertDatabaseCount('course_student', 0);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-019 — Búsqueda de estudiantes existentes
    // ═══════════════════════════════════════════════════════════════════════

    /** La búsqueda devuelve estudiantes que coinciden con el query y NO están inscritos. */
    public function test_busqueda_retorna_estudiantes_no_inscritos(): void
    {
        $teacher  = $this->makeTeacher();
        $course   = $this->makeCourse($teacher);
        $studentA = $this->makeStudent('sofia-lopez', 1111);
        $studentB = $this->makeStudent('sofia-ruiz', 2222);

        // studentA ya está inscrito
        $course->students()->attach($studentA->id);

        $response = $this->actingAs($teacher)->getJson(
            route('teacher.courses.students.search', $course) . '?q=sofia'
        );

        $response->assertStatus(200);
        $data = $response->json();

        // Solo debe aparecer studentB (id viene como hashid por HasHashId)
        $this->assertCount(1, $data);
        $this->assertEquals($studentB->getRouteKey(), $data[0]['id']);
    }

    /** La búsqueda retorna JSON vacío cuando no hay coincidencias. */
    public function test_busqueda_sin_coincidencias_retorna_array_vacio(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($teacher)->getJson(
            route('teacher.courses.students.search', $course) . '?q=xyznoexiste'
        );

        $response->assertStatus(200);
        $response->assertJson([]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-020 — Carga masiva de estudiantes
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-3: La carga masiva crea múltiples estudiantes con username y PIN automáticos. */
    public function test_carga_masiva_crea_multiples_estudiantes(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($teacher)->post(
            route('teacher.courses.students.bulk', $course),
            [
                'students' => [
                    ['name' => 'María Torres'],
                    ['name' => 'José Rodríguez'],
                    ['name' => 'Diana Castillo'],
                ],
            ]
        );

        $response->assertRedirect();

        // Los tres estudiantes creados y vinculados al curso
        $this->assertEquals(3, $course->fresh()->students()->count());
        $this->assertDatabaseHas('users', ['name' => 'María Torres']);
        $this->assertDatabaseHas('users', ['name' => 'José Rodríguez']);
        $this->assertDatabaseHas('users', ['name' => 'Diana Castillo']);
    }

    /** CA-3 & CA-4: Se devuelven en sesión las credenciales de todos los estudiantes creados. */
    public function test_carga_masiva_retorna_credenciales_en_sesion(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($teacher)->post(
            route('teacher.courses.students.bulk', $course),
            [
                'students' => [
                    ['name' => 'Estudiante Uno'],
                    ['name' => 'Estudiante Dos'],
                ],
                'stay_on_page' => true,
            ]
        );

        $response->assertSessionHas('bulk_credentials');
        $creds = session('bulk_credentials');
        $this->assertCount(2, $creds);

        foreach ($creds as $cred) {
            $this->assertArrayHasKey('name', $cred);
            $this->assertArrayHasKey('username', $cred);
            $this->assertArrayHasKey('pin', $cred);
            // PIN de 4 dígitos
            $this->assertGreaterThanOrEqual(1000, (int) $cred['pin']);
            $this->assertLessThanOrEqual(9999, (int) $cred['pin']);
        }
    }

    /** La carga masiva falla si el array de estudiantes está vacío. */
    public function test_carga_masiva_falla_sin_estudiantes(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($teacher)->post(
            route('teacher.courses.students.bulk', $course),
            ['students' => []]
        );

        $response->assertSessionHasErrors('students');
    }

    /** El nombre es obligatorio en cada entrada de la carga masiva. */
    public function test_carga_masiva_falla_si_algun_nombre_esta_vacio(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($teacher)->post(
            route('teacher.courses.students.bulk', $course),
            ['students' => [['name' => 'Válido'], ['name' => '']]]
        );

        $response->assertSessionHasErrors();
    }

    /** Un docente no puede hacer carga masiva en un curso ajeno. */
    public function test_docente_no_puede_hacer_carga_masiva_en_curso_ajeno(): void
    {
        $teacher1 = $this->makeTeacher('d1@t.com');
        $teacher2 = $this->makeTeacher('d2@t.com');
        $course   = $this->makeCourse($teacher1);

        $response = $this->actingAs($teacher2)->post(
            route('teacher.courses.students.bulk', $course),
            ['students' => [['name' => 'Intruso']]]
        );

        $response->assertStatus(403);
        $this->assertDatabaseCount('course_student', 0);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-021 — Retirar estudiante de un curso
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-2: El docente retira a un estudiante y el vínculo se elimina. */
    public function test_docente_puede_retirar_estudiante_del_curso(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();

        $course->students()->attach($student->id);

        $response = $this->actingAs($teacher)->delete(
            route('teacher.courses.students.destroy', [$course, $student])
        );

        $response->assertRedirect();
        $this->assertDatabaseMissing('course_student', [
            'course_id' => $course->id,
            'user_id'   => $student->id,
        ]);
    }

    /** CA-2: Al retirar, el usuario del estudiante permanece en la base de datos. */
    public function test_retirar_estudiante_no_elimina_su_cuenta(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();

        $course->students()->attach($student->id);

        $this->actingAs($teacher)->delete(
            route('teacher.courses.students.destroy', [$course, $student])
        );

        $this->assertDatabaseHas('users', ['id' => $student->id]);
    }

    /** CA-3: El docente no puede retirar estudiantes de un curso ajeno. */
    public function test_docente_no_puede_retirar_estudiante_de_curso_ajeno(): void
    {
        $teacher1 = $this->makeTeacher('d1@t.com');
        $teacher2 = $this->makeTeacher('d2@t.com');
        $course   = $this->makeCourse($teacher1);
        $student  = $this->makeStudent();

        $course->students()->attach($student->id);

        $response = $this->actingAs($teacher2)->delete(
            route('teacher.courses.students.destroy', [$course, $student])
        );

        $response->assertStatus(403);
        $this->assertDatabaseHas('course_student', [
            'course_id' => $course->id,
            'user_id'   => $student->id,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-022 — Visualizar estudiantes inscritos en un curso
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-1: El docente puede acceder al módulo global de sus estudiantes. */
    public function test_docente_puede_ver_listado_global_de_sus_estudiantes(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();

        $course->students()->attach($student->id);

        $response = $this->actingAs($teacher)->get(route('teacher.students.index'));

        $response->assertStatus(200);
    }

    /** CA-1: El módulo de estudiantes solo muestra los del docente autenticado. */
    public function test_modulo_estudiantes_solo_muestra_propios(): void
    {
        $teacher1 = $this->makeTeacher('d1@t.com');
        $teacher2 = $this->makeTeacher('d2@t.com');

        $course1 = $this->makeCourse($teacher1, ['section' => 'A']);
        $course2 = $this->makeCourse($teacher2, ['section' => 'B']);

        $student1 = $this->makeStudent('est-a');
        $student2 = $this->makeStudent('est-b');

        $course1->students()->attach($student1->id);
        $course2->students()->attach($student2->id);

        $response = $this->actingAs($teacher1)->get(route('teacher.students.index'));

        $response->assertStatus(200);
        $props = $response->original->getData()['page']['props'] ?? [];
        $studentIds = collect($props['students']['data'] ?? [])->pluck('id')->toArray();

        $this->assertContains($student1->getRouteKey(), $studentIds);
        $this->assertNotContains($student2->getRouteKey(), $studentIds);
    }

    /** CA-3: Con 0 estudiantes inscritos, el listado debe estar vacío. */
    public function test_listado_sin_estudiantes_esta_vacio(): void
    {
        $teacher = $this->makeTeacher();

        $response = $this->actingAs($teacher)->get(route('teacher.students.index'));

        $response->assertStatus(200);
        $props      = $response->original->getData()['page']['props'] ?? [];
        $totalItems = $props['students']['total'] ?? 0;
        $this->assertEquals(0, $totalItems);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-023 — Restablecer PIN y gestión avanzada de estudiantes
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-1 & CA-2: El docente puede regenerar el PIN de un estudiante de su curso. */
    public function test_docente_puede_regenerar_pin_de_estudiante(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();

        $course->students()->attach($student->id);

        $pinOriginal = $student->pin;

        $this->actingAs($teacher)->post(
            route('teacher.students.regeneratePin', $student->getRouteKey())
        );

        // El hash del PIN debe haber cambiado
        $this->assertNotEquals($pinOriginal, $student->fresh()->pin);
    }

    /** CA-1: Las nuevas credenciales se devuelven en sesión para mostrarse al docente. */
    public function test_regenerar_pin_devuelve_credenciales_en_sesion(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();

        $course->students()->attach($student->id);

        $response = $this->actingAs($teacher)->post(
            route('teacher.students.regeneratePin', $student->getRouteKey())
        );

        $response->assertSessionHas('credentials');
        $credentials = session('credentials');
        $this->assertArrayHasKey('username', $credentials);
        $this->assertArrayHasKey('pin', $credentials);
        $this->assertGreaterThanOrEqual(1000, $credentials['pin']);
        $this->assertLessThanOrEqual(9999, $credentials['pin']);
    }

    /** CA-3: El docente puede editar el nombre de un estudiante. */
    public function test_docente_puede_editar_nombre_de_estudiante(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();

        $course->students()->attach($student->id);

        $this->actingAs($teacher)->put(
            route('teacher.students.update', $student->getRouteKey()),
            ['name' => 'Nombre Actualizado']
        );

        $this->assertDatabaseHas('users', [
            'id'   => $student->id,
            'name' => 'Nombre Actualizado',
        ]);
    }

    /** CA-3: El username NO puede modificarse (no hay campo en el endpoint de update). */
    public function test_username_no_cambia_al_editar_estudiante(): void
    {
        $teacher  = $this->makeTeacher();
        $course   = $this->makeCourse($teacher);
        $student  = $this->makeStudent('username-fijo');
        $username = $student->username;

        $course->students()->attach($student->id);

        $this->actingAs($teacher)->put(
            route('teacher.students.update', $student->getRouteKey()),
            ['name' => 'Otro Nombre']
        );

        $this->assertDatabaseHas('users', [
            'id'       => $student->id,
            'username' => $username,   // sin cambio
        ]);
    }

    /** El docente puede ver el detalle de un estudiante (show). */
    public function test_docente_puede_ver_detalle_de_estudiante(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();

        $course->students()->attach($student->id);

        $response = $this->actingAs($teacher)->get(
            route('teacher.students.show', $student->getRouteKey())
        );

        $response->assertStatus(200);
    }

    /** El docente NO puede regenerar el PIN de un estudiante que no es suyo. */
    public function test_docente_no_puede_regenerar_pin_de_estudiante_ajeno(): void
    {
        $teacher1 = $this->makeTeacher('d1@t.com');
        $teacher2 = $this->makeTeacher('d2@t.com');

        $course1 = $this->makeCourse($teacher1, ['section' => 'A']);
        $course2 = $this->makeCourse($teacher2, ['section' => 'B']);

        $student = $this->makeStudent();
        $course2->students()->attach($student->id); // pertenece solo a teacher2

        $pinOriginal = $student->pin;

        $response = $this->actingAs($teacher1)->post(
            route('teacher.students.regeneratePin', $student->getRouteKey())
        );

        $response->assertStatus(403);
        $this->assertEquals($pinOriginal, $student->fresh()->pin);
    }

    /** El docente NO puede editar el nombre de un estudiante de otro docente. */
    public function test_docente_no_puede_editar_estudiante_ajeno(): void
    {
        $teacher1 = $this->makeTeacher('d1@t.com');
        $teacher2 = $this->makeTeacher('d2@t.com');

        $course2 = $this->makeCourse($teacher2, ['section' => 'B']);
        $student = $this->makeStudent();
        $course2->students()->attach($student->id);

        $nombreOriginal = $student->name;

        $response = $this->actingAs($teacher1)->put(
            route('teacher.students.update', $student->getRouteKey()),
            ['name' => 'Nombre Intruso']
        );

        $response->assertStatus(403);
        $this->assertDatabaseHas('users', [
            'id'   => $student->id,
            'name' => $nombreOriginal,
        ]);
    }

    /** Un invitado no puede inscribir estudiantes. */
    public function test_invitado_no_puede_inscribir_estudiantes(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->post(
            route('teacher.courses.students.store', $course),
            ['name' => 'Intruso']
        );

        $response->assertRedirect(route('login'));
    }

    /** Un admin no puede inscribir estudiantes por las rutas de docente. */
    public function test_admin_no_puede_usar_rutas_de_inscripcion_de_docente(): void
    {
        $admin   = $this->makeUser('admin', ['email' => 'a@t.com', 'password' => Hash::make('p')]);
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($admin)->post(
            route('teacher.courses.students.store', $course),
            ['name' => 'Intruso']
        );

        $response->assertStatus(403);
    }
}
