<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Ova;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Iteración 5 – Asignación y Uso Didáctico de OVAs en Cursos
 *
 * Cubre las historias de usuario HU-031 a HU-033:
 *   HU-031  Agregar OVA a un curso
 *   HU-032  Visualizar OVA asignados a un curso y retirarlos
 *   HU-033  Acceder a los OVA asignados como apoyo pedagógico
 */
class CourseOvaAssignmentTest extends TestCase
{
    use RefreshDatabase;

    private const URL_MAT = '/ovas/matematicas/adicion-sustraccion/inicio';
    private const URL_ESP = '/ovas/espanol/cuento/inicio';

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

    private function makeTeacher(string $email = 'teacher@test.test'): User
    {
        return $this->makeUser('teacher', [
            'email'    => $email,
            'password' => Hash::make('pass'),
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

    private function makeOva(array $overrides = []): Ova
    {
        static $counter = 0;
        $counter++;
        return Ova::create(array_merge([
            'area'      => 'Matemáticas',
            'tematica'  => "OVA Test {$counter}",
            'url'       => null,
            'is_active' => true,
        ], $overrides));
    }

    private function attachOva(Course $course, Ova $ova, array $pivot = []): void
    {
        $course->ovas()->attach($ova->id, array_merge([
            'order'       => 0,
            'is_required' => true,
            'assigned_at' => now(),
        ], $pivot));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-031 — Agregar OVA a un curso
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * CA-1: El catálogo devuelve OVAs activos no asignados al curso.
     */
    public function test_catalogo_muestra_ovas_activos_disponibles(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva(['is_active' => true]);

        $response = $this->actingAs($teacher)
            ->get(route('teacher.courses.available-ovas', $course));

        $response->assertStatus(200);
        $ids = collect($response->json())->pluck('id')->toArray();
        $this->assertContains($ova->id, $ids);
    }

    /**
     * CA-1: OVAs inactivos NO aparecen en el catálogo disponible.
     */
    public function test_ova_inactivo_no_aparece_en_catalogo_disponible(): void
    {
        $teacher    = $this->makeTeacher();
        $course     = $this->makeCourse($teacher);
        $ovaActivo  = $this->makeOva(['is_active' => true]);
        $ovaInactivo = $this->makeOva(['is_active' => false]);

        $response = $this->actingAs($teacher)
            ->get(route('teacher.courses.available-ovas', $course));

        $ids = collect($response->json())->pluck('id')->toArray();
        $this->assertContains($ovaActivo->id, $ids);
        $this->assertNotContains($ovaInactivo->id, $ids);
    }

    /**
     * CA-2: El docente puede asignar un OVA a su curso.
     */
    public function test_docente_puede_asignar_ova_al_curso(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva();

        $response = $this->actingAs($teacher)
            ->post(route('teacher.courses.assign-ova', $course), [
                'ova_id' => $ova->id,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('course_ova', [
            'course_id' => $course->id,
            'ova_id'    => $ova->id,
        ]);
    }

    /**
     * CA-3: OVA ya asignado no aparece en el catálogo disponible.
     */
    public function test_ova_ya_asignado_no_aparece_en_catalogo_disponible(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva(['is_active' => true]);
        $this->attachOva($course, $ova);

        $response = $this->actingAs($teacher)
            ->get(route('teacher.courses.available-ovas', $course));

        $ids = collect($response->json())->pluck('id')->toArray();
        $this->assertNotContains($ova->id, $ids);
    }

    /**
     * CA-3: Intentar asignar un OVA duplicado devuelve error en sesión.
     */
    public function test_asignar_ova_duplicado_retorna_error(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);

        // Segunda asignación del mismo OVA
        $response = $this->actingAs($teacher)
            ->post(route('teacher.courses.assign-ova', $course), [
                'ova_id' => $ova->id,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('error');

        // Solo existe un registro en el pivot
        $this->assertEquals(
            1,
            $course->ovas()->where('ovas.id', $ova->id)->count()
        );
    }

    /**
     * CA-4: Sin OVAs activos el catálogo devuelve colección vacía.
     */
    public function test_catalogo_vacio_cuando_no_hay_ovas_activos(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        // Sin OVAs en la BD

        $response = $this->actingAs($teacher)
            ->get(route('teacher.courses.available-ovas', $course));

        $response->assertStatus(200);
        $this->assertEmpty($response->json());
    }

    /**
     * Un docente no puede asignar un OVA a un curso que no le pertenece.
     */
    public function test_docente_no_puede_asignar_ova_a_curso_ajeno(): void
    {
        $owner   = $this->makeTeacher('owner@test.test');
        $intruder = $this->makeTeacher('intruder@test.test');
        $course  = $this->makeCourse($owner);
        $ova     = $this->makeOva();

        $response = $this->actingAs($intruder)
            ->post(route('teacher.courses.assign-ova', $course), [
                'ova_id' => $ova->id,
            ]);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('course_ova', [
            'course_id' => $course->id,
            'ova_id'    => $ova->id,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-032 — Visualizar OVA asignados a un curso y retirarlos
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * CA-1: La vista del curso expone la lista de OVAs asignados.
     */
    public function test_docente_puede_ver_ovas_asignados_al_curso(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva(['tematica' => 'OVA Asignado']);
        $this->attachOva($course, $ova);

        $response = $this->actingAs($teacher)
            ->get(route('teacher.courses.show', $course));

        $response->assertStatus(200);
        $props = $response->original->getData()['page']['props'];
        $courseOvaIds = collect($props['courseOvas'])->pluck('id')->toArray();
        $this->assertContains($ova->id, $courseOvaIds);
    }

    /**
     * CA-4: Sin OVAs asignados la prop courseOvas llega vacía.
     */
    public function test_curso_sin_ovas_asignados_muestra_lista_vacia(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($teacher)
            ->get(route('teacher.courses.show', $course));

        $response->assertStatus(200);
        $props = $response->original->getData()['page']['props'];
        $this->assertEmpty($props['courseOvas']);
    }

    /**
     * CA-2: El docente puede retirar un OVA de su curso.
     */
    public function test_docente_puede_retirar_ova_del_curso(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);

        $response = $this->actingAs($teacher)
            ->delete(route('teacher.courses.remove-ova', [$course, $ova]));

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('course_ova', [
            'course_id' => $course->id,
            'ova_id'    => $ova->id,
        ]);
    }

    /**
     * CA-2/3: Retirar un OVA NO lo elimina del catálogo global.
     */
    public function test_retirar_ova_no_elimina_del_catalogo_global(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);

        $this->actingAs($teacher)
            ->delete(route('teacher.courses.remove-ova', [$course, $ova]));

        // El OVA sigue en la tabla ovas
        $this->assertDatabaseHas('ovas', ['id' => $ova->id]);
        $this->assertEquals(1, Ova::count());
    }

    /**
     * CA-3: Retirar un OVA no elimina las evaluaciones existentes del mismo.
     */
    public function test_retirar_ova_no_elimina_evaluaciones_existentes(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva();
        $student = $this->makeUser('student', [
            'username' => 'est-ova-eval',
            'pin'      => Hash::make(1234),
            'email'    => null,
            'password' => null,
        ]);
        $this->attachOva($course, $ova);

        // Registrar evaluación previa del estudiante en este OVA/curso
        \DB::table('evaluations')->insert([
            'user_id'        => $student->id,
            'course_id'      => $course->id,
            'ova_id'         => $ova->id,
            'evaluation_key' => 'adicion',
            'score'          => 4,
            'total'          => 5,
            'attempt'        => 1,
            'created_at'     => now(),
            'updated_at'     => now(),
        ]);

        // Retirar el OVA del curso
        $this->actingAs($teacher)
            ->delete(route('teacher.courses.remove-ova', [$course, $ova]));

        // La evaluación sigue existiendo
        $this->assertDatabaseHas('evaluations', [
            'user_id'  => $student->id,
            'ova_id'   => $ova->id,
            'course_id' => $course->id,
        ]);
    }

    /**
     * Un docente no puede retirar un OVA de un curso ajeno.
     */
    public function test_docente_no_puede_retirar_ova_de_curso_ajeno(): void
    {
        $owner    = $this->makeTeacher('owner2@test.test');
        $intruder = $this->makeTeacher('intruder2@test.test');
        $course   = $this->makeCourse($owner);
        $ova      = $this->makeOva();
        $this->attachOva($course, $ova);

        $response = $this->actingAs($intruder)
            ->delete(route('teacher.courses.remove-ova', [$course, $ova]));

        $response->assertStatus(403);
        $this->assertDatabaseHas('course_ova', [
            'course_id' => $course->id,
            'ova_id'    => $ova->id,
        ]);
    }

    /**
     * Retirar un OVA de un curso no afecta su asignación a otros cursos.
     */
    public function test_retirar_ova_de_un_curso_no_afecta_otros_cursos(): void
    {
        $teacher  = $this->makeTeacher();
        $course1  = $this->makeCourse($teacher, ['section' => 'A']);
        $course2  = $this->makeCourse($teacher, ['section' => 'B']);
        $ova      = $this->makeOva();

        $this->attachOva($course1, $ova);
        $this->attachOva($course2, $ova, ['order' => 0]);

        // Retirar solo de course1
        $this->actingAs($teacher)
            ->delete(route('teacher.courses.remove-ova', [$course1, $ova]));

        // Sigue asignado a course2
        $this->assertDatabaseMissing('course_ova', [
            'course_id' => $course1->id,
            'ova_id'    => $ova->id,
        ]);
        $this->assertDatabaseHas('course_ova', [
            'course_id' => $course2->id,
            'ova_id'    => $ova->id,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-033 — Acceder a los OVA asignados como apoyo pedagógico
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * CA-1: El docente puede acceder al OVA MAT03 desde la plataforma (status 200).
     */
    public function test_docente_puede_acceder_al_ova_mat03_en_vista_previa(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva(['url' => self::URL_MAT]);
        $this->attachOva($course, $ova);

        $response = $this->actingAs($teacher)->get(self::URL_MAT);

        $response->assertStatus(200);
    }

    /**
     * CA-1: El docente puede acceder al OVA de Español en vista previa.
     */
    public function test_docente_puede_acceder_al_ova_espanol_en_vista_previa(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva(['url' => self::URL_ESP, 'area' => 'Español']);
        $this->attachOva($course, $ova);

        $response = $this->actingAs($teacher)->get(self::URL_ESP);

        $response->assertStatus(200);
    }

    /**
     * CA-2: El acceso del docente al OVA en vista previa NO registra evaluaciones.
     */
    public function test_acceso_docente_al_ova_no_registra_evaluacion(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva(['url' => self::URL_MAT]);
        $this->attachOva($course, $ova);

        $this->actingAs($teacher)->get(self::URL_MAT);

        $this->assertDatabaseEmpty('evaluations');
    }

    /**
     * CA-2: El acceso del docente al OVA no registra progreso de ningún tipo.
     */
    public function test_acceso_docente_al_ova_no_crea_registros_de_progreso(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva(['url' => self::URL_MAT]);
        $this->attachOva($course, $ova);

        // Múltiples visitas al OVA
        $this->actingAs($teacher)->get(self::URL_MAT);
        $this->actingAs($teacher)->get(self::URL_MAT);

        $this->assertEquals(0, \DB::table('evaluations')->count());
    }

    /**
     * Un invitado es redirigido al login al intentar acceder a un OVA.
     */
    public function test_invitado_no_puede_acceder_al_ova_sin_autenticacion(): void
    {
        $response = $this->get(self::URL_MAT);

        $response->assertRedirect(route('login'));
    }
}
