<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Evaluation;
use App\Models\Ova;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Iteración 6 – Evaluación y Seguimiento Académico
 *
 * Cubre las historias de usuario HU-034 a HU-040:
 *   HU-034  Consultar progreso y desempeño de estudiantes por curso (docente)
 *   HU-035  Seleccionar avatar personalizado (estudiante)
 *   HU-036  Navegar en curso, actividades y OVA asignados (estudiante)
 *   HU-037  Interactuar con los OVA asociados al curso (estudiante)
 *   HU-038  Participar en evaluaciones y recibir retroalimentación automática
 *   HU-039  Consultar historial de evaluaciones propias (estudiante)
 *   HU-040  Consultar resultados de evaluaciones de los estudiantes (docente)
 */
class StudentAcademicExperienceTest extends TestCase
{
    use RefreshDatabase;

    private const URL_MAT = '/ovas/matematicas/adicion-sustraccion/inicio';
    private const MAX_ATTEMPTS = 3;

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

    private function makeTeacher(string $email = 'teacher@eval.test'): User
    {
        return $this->makeUser('teacher', [
            'email'    => $email,
            'password' => Hash::make('pass'),
        ]);
    }

    private static int $studentSeq = 0;

    private function makeStudent(array $overrides = []): User
    {
        self::$studentSeq++;
        return $this->makeUser('student', array_merge([
            'username' => 'est' . self::$studentSeq,
            'pin'      => Hash::make(1234),
            'email'    => null,
            'password' => null,
            'avatar'   => null,
        ], $overrides));
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

    private static int $ovaSeq = 0;

    private function makeOva(array $overrides = []): Ova
    {
        self::$ovaSeq++;
        return Ova::create(array_merge([
            'area'      => 'Matemáticas',
            'tematica'  => 'OVA ' . self::$ovaSeq,
            'url'       => self::URL_MAT,
            'is_active' => true,
        ], $overrides));
    }

    private function attachOva(Course $course, Ova $ova, int $order = 0): void
    {
        $course->ovas()->attach($ova->id, [
            'order'       => $order,
            'is_required' => true,
            'assigned_at' => now(),
        ]);
    }

    private function enrollStudent(Course $course, User $student): void
    {
        $course->students()->attach($student->id);
    }

    private function storeEvaluation(User $student, Course $course, Ova $ova, string $key = 'eval1', int $score = 4, int $total = 5): \Illuminate\Testing\TestResponse
    {
        return $this->actingAs($student)->post(route('student.evaluations.store'), [
            'evaluation_key' => $key,
            'score'          => $score,
            'total'          => $total,
            'ova_id'         => $ova->id,
            'course_id'      => $course->id,
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-035 — Seleccionar avatar personalizado
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * CA-1: Dashboard indica needsAvatar=true cuando el estudiante no tiene avatar.
     */
    public function test_dashboard_indica_needs_avatar_cuando_no_tiene_avatar(): void
    {
        $student = $this->makeStudent(['avatar' => null]);
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $this->enrollStudent($course, $student);

        $response = $this->actingAs($student)->get(route('student.dashboard'));

        $response->assertStatus(200);
        $props = $response->original->getData()['page']['props'];
        $this->assertTrue($props['needsAvatar']);
    }

    /**
     * CA-1: Dashboard indica needsAvatar=false cuando el estudiante ya tiene avatar.
     */
    public function test_dashboard_no_indica_needs_avatar_cuando_ya_tiene_avatar(): void
    {
        $student = $this->makeStudent(['avatar' => 'avatar1']);
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $this->enrollStudent($course, $student);

        $response = $this->actingAs($student)->get(route('student.dashboard'));

        $props = $response->original->getData()['page']['props'];
        $this->assertFalse($props['needsAvatar']);
    }

    /**
     * CA-2: El estudiante puede seleccionar un avatar válido.
     */
    public function test_estudiante_puede_seleccionar_avatar(): void
    {
        $student = $this->makeStudent();

        $response = $this->actingAs($student)->post(route('student.avatar.store'), [
            'avatar' => 'avatar1',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('users', ['id' => $student->id, 'avatar' => 'avatar1']);
    }

    /**
     * CA-2/3: El estudiante puede cambiar su avatar (actualizar).
     */
    public function test_estudiante_puede_cambiar_avatar_en_sesiones_posteriores(): void
    {
        $student = $this->makeStudent(['avatar' => 'avatar1']);

        $this->actingAs($student)->post(route('student.avatar.store'), ['avatar' => 'avatar3']);

        $this->assertDatabaseHas('users', ['id' => $student->id, 'avatar' => 'avatar3']);
    }

    /**
     * Avatar fuera del listado válido es rechazado.
     */
    public function test_avatar_invalido_falla_validacion(): void
    {
        $student = $this->makeStudent();

        $response = $this->actingAs($student)->post(route('student.avatar.store'), [
            'avatar' => 'avatar99',
        ]);

        $response->assertSessionHasErrors('avatar');
        $this->assertDatabaseHas('users', ['id' => $student->id, 'avatar' => null]);
    }

    /**
     * La página de selección de avatar es accesible para estudiantes.
     */
    public function test_pagina_de_avatar_es_accesible_para_estudiante(): void
    {
        $student = $this->makeStudent();

        $response = $this->actingAs($student)->get(route('student.avatar.index'));

        $response->assertStatus(200);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-036 — Navegar en curso, actividades y OVA asignados
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * CA-1: El dashboard muestra los cursos en que está inscrito el estudiante.
     */
    public function test_dashboard_muestra_cursos_del_estudiante(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $this->enrollStudent($course, $student);

        $response = $this->actingAs($student)->get(route('student.dashboard'));

        $response->assertStatus(200);
        $props    = $response->original->getData()['page']['props'];
        $courseIds = collect($props['courses'])->pluck('id')->toArray();
        $this->assertContains($course->id, $courseIds);
    }

    /**
     * CA-2/3: Las OVAs con URL asignadas al curso aparecen en el dashboard.
     */
    public function test_ovas_con_url_aparecen_en_el_dashboard_del_estudiante(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova     = $this->makeOva(['url' => self::URL_MAT]);
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);

        $response = $this->actingAs($student)->get(route('student.dashboard'));

        $props = $response->original->getData()['page']['props'];
        $courseData = collect($props['courses'])->firstWhere('id', $course->id);
        $ovaIds = collect($courseData['ovas'])->pluck('id')->toArray();
        $this->assertContains($ova->id, $ovaIds);
    }

    /**
     * OVAs sin URL no aparecen en el dashboard (están excluidas explícitamente).
     */
    public function test_ovas_sin_url_no_aparecen_en_el_dashboard(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ovaSinUrl = $this->makeOva(['url' => null]);
        $this->attachOva($course, $ovaSinUrl);
        $this->enrollStudent($course, $student);

        $response = $this->actingAs($student)->get(route('student.dashboard'));

        $props = $response->original->getData()['page']['props'];
        $courseData = collect($props['courses'])->firstWhere('id', $course->id);
        $ovaIds = collect($courseData['ovas'])->pluck('id')->toArray();
        $this->assertNotContains($ovaSinUrl->id, $ovaIds);
    }

    /**
     * CA-1: El estudiante puede ver el detalle de su curso.
     */
    public function test_estudiante_puede_ver_detalle_de_su_curso(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $this->enrollStudent($course, $student);

        $response = $this->actingAs($student)->get(route('student.courses.show', $course));

        $response->assertStatus(200);
    }

    /**
     * El estudiante no puede ver un curso al que no pertenece.
     */
    public function test_estudiante_no_puede_ver_curso_ajeno(): void
    {
        $teacher  = $this->makeTeacher();
        $course   = $this->makeCourse($teacher);
        $student  = $this->makeStudent();
        // No enrollado

        $response = $this->actingAs($student)->get(route('student.courses.show', $course));

        $response->assertStatus(403);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-037 — Interactuar con los OVA asociados al curso
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * CA-1: El estudiante puede acceder a un OVA asignado a su curso.
     */
    public function test_estudiante_puede_acceder_a_ova_de_su_curso(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);

        $response = $this->actingAs($student)->get(route('student.ovas.show', $ova));

        $response->assertStatus(200);
    }

    /**
     * El estudiante no puede acceder a un OVA de un curso al que no pertenece.
     */
    public function test_estudiante_no_puede_acceder_a_ova_de_curso_ajeno(): void
    {
        $teacher  = $this->makeTeacher();
        $course   = $this->makeCourse($teacher);
        $student  = $this->makeStudent();
        $ova      = $this->makeOva();
        $this->attachOva($course, $ova);
        // El estudiante NO está inscrito en el curso

        $response = $this->actingAs($student)->get(route('student.ovas.show', $ova));

        $response->assertStatus(403);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-038 — Participar en evaluaciones con control de intentos
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * CA-1: El primer intento se guarda en BD y la respuesta indica éxito.
     */
    public function test_primer_intento_de_evaluacion_se_guarda_en_bd(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);

        $response = $this->storeEvaluation($student, $course, $ova, 'adicion', 4, 5);

        $response->assertOk();
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('evaluation.attempt', 1);
        $this->assertDatabaseHas('evaluations', [
            'user_id'        => $student->id,
            'course_id'      => $course->id,
            'ova_id'         => $ova->id,
            'evaluation_key' => 'adicion',
            'attempt'        => 1,
            'score'          => 4,
        ]);
    }

    /**
     * CA-2: El segundo intento se registra con attempt=2.
     */
    public function test_segundo_intento_se_registra_con_attempt_2(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);

        $this->storeEvaluation($student, $course, $ova);
        $response = $this->storeEvaluation($student, $course, $ova, 'eval1', 3, 5);

        $response->assertJsonPath('evaluation.attempt', 2);
        $this->assertEquals(2, Evaluation::where('user_id', $student->id)->count());
    }

    /**
     * CA-2: El tercer intento es el último permitido (is_last_attempt = true).
     */
    public function test_tercer_intento_es_el_ultimo_registrado(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);

        $this->storeEvaluation($student, $course, $ova);
        $this->storeEvaluation($student, $course, $ova);
        $response = $this->storeEvaluation($student, $course, $ova);

        $response->assertJsonPath('is_last_attempt', true);
        $response->assertJsonPath('attempts_left', 0);
        $response->assertJsonPath('evaluation.attempt', 3);
    }

    /**
     * CA-3: El cuarto intento es bloqueado (HTTP 403).
     */
    public function test_cuarto_intento_es_bloqueado(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);

        $this->storeEvaluation($student, $course, $ova);
        $this->storeEvaluation($student, $course, $ova);
        $this->storeEvaluation($student, $course, $ova);
        $response = $this->storeEvaluation($student, $course, $ova);

        $response->assertStatus(403);
        $response->assertJsonPath('limit_reached', true);
    }

    /**
     * CA-3: El cuarto intento NO genera un registro en la BD.
     */
    public function test_cuarto_intento_no_se_guarda_en_bd(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);

        $this->storeEvaluation($student, $course, $ova);
        $this->storeEvaluation($student, $course, $ova);
        $this->storeEvaluation($student, $course, $ova);
        $this->storeEvaluation($student, $course, $ova); // bloqueado

        $this->assertEquals(
            self::MAX_ATTEMPTS,
            Evaluation::where('user_id', $student->id)->count()
        );
    }

    /**
     * Misma evaluation_key en OVA diferente tiene contador independiente.
     */
    public function test_mismo_key_en_ova_diferente_es_independiente(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova1    = $this->makeOva();
        $ova2    = $this->makeOva(['url' => null]);
        $this->attachOva($course, $ova1, 0);
        $this->attachOva($course, $ova2, 1);
        $this->enrollStudent($course, $student);

        // Agotar intentos en ova1
        $this->storeEvaluation($student, $course, $ova1, 'adicion');
        $this->storeEvaluation($student, $course, $ova1, 'adicion');
        $this->storeEvaluation($student, $course, $ova1, 'adicion');

        // En ova2 con el mismo key, el primer intento debe funcionar
        $response = $this->actingAs($student)->post(route('student.evaluations.store'), [
            'evaluation_key' => 'adicion',
            'score'          => 5,
            'total'          => 5,
            'ova_id'         => $ova2->id,
            'course_id'      => $course->id,
        ]);

        $response->assertOk();
        $response->assertJsonPath('evaluation.attempt', 1);
    }

    /**
     * Docente/admin: la evaluación NO se guarda (vista previa).
     */
    public function test_docente_en_vista_previa_no_guarda_evaluacion(): void
    {
        $teacher = $this->makeTeacher();

        $response = $this->actingAs($teacher)->post(route('api.evaluations.store'), [
            'evaluation_key' => 'adicion',
            'score'          => 5,
            'total'          => 5,
        ]);

        $response->assertOk();
        $response->assertJsonPath('preview', true);
        $this->assertDatabaseEmpty('evaluations');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-039 — Consultar historial de evaluaciones propias (estudiante)
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * CA-1: El módulo de evaluaciones renderiza la vista con el historial.
     */
    public function test_estudiante_puede_ver_su_historial_de_evaluaciones(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);
        $this->storeEvaluation($student, $course, $ova);

        $response = $this->actingAs($student)->get(route('student.evaluations.index'));

        $response->assertStatus(200);
        $props = $response->original->getData()['page']['props'];
        $this->assertNotEmpty($props['evaluations']);
        $this->assertEquals(1, count($props['evaluations']));
    }

    /**
     * CA-3: Sin evaluaciones el historial llega vacío.
     */
    public function test_historial_vacio_cuando_no_hay_evaluaciones(): void
    {
        $student = $this->makeStudent();

        $response = $this->actingAs($student)->get(route('student.evaluations.index'));

        $response->assertStatus(200);
        $props = $response->original->getData()['page']['props'];
        $this->assertEmpty($props['evaluations']);
    }

    /**
     * El historial del estudiante solo muestra SUS evaluaciones.
     */
    public function test_historial_solo_muestra_evaluaciones_del_propio_estudiante(): void
    {
        $teacher  = $this->makeTeacher();
        $course   = $this->makeCourse($teacher);
        $studentA = $this->makeStudent();
        $studentB = $this->makeStudent();
        $ova      = $this->makeOva();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $studentA);
        $this->enrollStudent($course, $studentB);

        // Ambos hacen una evaluación
        $this->storeEvaluation($studentA, $course, $ova, 'evalA');
        $this->storeEvaluation($studentB, $course, $ova, 'evalB');

        // A solo ve la suya
        $response = $this->actingAs($studentA)->get(route('student.evaluations.index'));
        $props    = $response->original->getData()['page']['props'];
        $this->assertCount(1, $props['evaluations']);
        $this->assertEquals('evalA', $props['evaluations'][0]['evaluation_key']);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-034 / HU-040 — Docente consulta evaluaciones y desempeño
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * CA-2: El docente puede acceder al módulo de evaluaciones (Inertia).
     */
    public function test_docente_puede_acceder_al_modulo_de_evaluaciones(): void
    {
        $teacher = $this->makeTeacher();

        $response = $this->actingAs($teacher)->get(route('teacher.evaluations.index'));

        $response->assertStatus(200);
    }

    /**
     * CA-2: El módulo incluye los datos de evaluaciones de los cursos del docente.
     */
    public function test_docente_ve_evaluaciones_de_sus_cursos(): void
    {
        $teacher  = $this->makeTeacher();
        $course   = $this->makeCourse($teacher);
        $student  = $this->makeStudent();
        $ova      = $this->makeOva();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);
        $this->storeEvaluation($student, $course, $ova);

        $response = $this->actingAs($teacher)->get(route('teacher.evaluations.index'));

        $props = $response->original->getData()['page']['props'];
        $this->assertEquals(1, $props['evaluations']['total']);
    }

    /**
     * CA-2: El docente NO ve evaluaciones de cursos ajenos.
     */
    public function test_docente_no_ve_evaluaciones_de_cursos_ajenos(): void
    {
        $teacherA = $this->makeTeacher('ta@test.test');
        $teacherB = $this->makeTeacher('tb@test.test');
        $courseA  = $this->makeCourse($teacherA, ['section' => 'A']);
        $courseB  = $this->makeCourse($teacherB, ['section' => 'B']);
        $student  = $this->makeStudent();
        $ova      = $this->makeOva();
        $this->attachOva($courseA, $ova);
        $this->attachOva($courseB, $ova);
        $this->enrollStudent($courseA, $student);
        $this->enrollStudent($courseB, $student);

        // Evaluación en el curso del teacherB
        $this->storeEvaluation($student, $courseB, $ova);

        // teacherA no debe verla
        $response = $this->actingAs($teacherA)->get(route('teacher.evaluations.index'));
        $props    = $response->original->getData()['page']['props'];
        $this->assertEquals(0, $props['evaluations']['total']);
    }

    /**
     * CA-3: Filtrar evaluaciones por course_id devuelve solo ese curso.
     */
    public function test_docente_puede_filtrar_evaluaciones_por_curso(): void
    {
        $teacher  = $this->makeTeacher();
        $courseA  = $this->makeCourse($teacher, ['section' => 'A']);
        $courseB  = $this->makeCourse($teacher, ['section' => 'B']);
        $student  = $this->makeStudent();
        $ova      = $this->makeOva();
        $this->attachOva($courseA, $ova);
        $this->attachOva($courseB, $ova);
        $this->enrollStudent($courseA, $student);
        $this->enrollStudent($courseB, $student);

        $this->storeEvaluation($student, $courseA, $ova, 'e1');
        $this->storeEvaluation($student, $courseB, $ova, 'e2');

        $response = $this->actingAs($teacher)->get(
            route('teacher.evaluations.index', ['course_id' => $courseA->id])
        );

        $props = $response->original->getData()['page']['props'];
        // Solo la evaluación de courseA
        $this->assertEquals(1, $props['evaluations']['total']);
    }

    /**
     * CA-1: El endpoint de desempeño general devuelve JSON con top3 y ranking.
     */
    public function test_docente_puede_ver_desempeno_general_del_curso(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);
        $this->storeEvaluation($student, $course, $ova);

        $response = $this->actingAs($teacher)->get(
            route('teacher.courses.evaluations', $course)
        );

        $response->assertOk();
        $response->assertJsonPath('success', true);
        $data = $response->json('data');
        $this->assertArrayHasKey('top3', $data);
        $this->assertArrayHasKey('ranking', $data);
        $this->assertEquals(1, $data['total_evaluations']);
        $this->assertEquals(1, $data['total_students']);
    }

    /**
     * CA-1: Curso sin evaluaciones devuelve datos vacíos (sin error).
     */
    public function test_curso_sin_evaluaciones_devuelve_datos_vacios(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $response = $this->actingAs($teacher)->get(
            route('teacher.courses.evaluations', $course)
        );

        $response->assertOk();
        $response->assertJsonPath('success', true);
        $this->assertEmpty($response->json('data.top3'));
        $this->assertEquals(0, $response->json('data.total_evaluations'));
    }

    /**
     * Un docente no puede consultar las evaluaciones de un curso ajeno.
     */
    public function test_docente_no_puede_ver_desempeno_de_curso_ajeno(): void
    {
        $owner    = $this->makeTeacher('owner@test.test');
        $intruder = $this->makeTeacher('intruder@test.test');
        $course   = $this->makeCourse($owner);

        $response = $this->actingAs($intruder)->get(
            route('teacher.courses.evaluations', $course)
        );

        $response->assertStatus(403);
    }
}
