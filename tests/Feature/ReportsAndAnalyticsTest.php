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
 * Iteración 7 – Reportes y Analítica
 *
 * Cubre las historias de usuario HU-041 y HU-042:
 *   HU-041  Reportes generales de uso de OVA por área temática (administrador)
 *   HU-042  Reportes de uso y desempeño de OVA en los cursos del docente
 */
class ReportsAndAnalyticsTest extends TestCase
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
            'email'    => 'admin@reports.test',
            'password' => Hash::make('pass'),
        ]);
    }

    private static int $teacherSeq = 0;

    private function makeTeacher(): User
    {
        self::$teacherSeq++;
        return $this->makeUser('teacher', [
            'email'    => 'teacher' . self::$teacherSeq . '@reports.test',
            'password' => Hash::make('pass'),
        ]);
    }

    private static int $studentSeq = 0;

    private function makeStudent(): User
    {
        self::$studentSeq++;
        return $this->makeUser('student', [
            'username' => 'est' . self::$studentSeq,
            'pin'      => Hash::make(1234),
            'email'    => null,
            'password' => null,
        ]);
    }

    private static int $ovaSeq = 0;

    private function makeOva(string $area = 'Matemáticas', ?string $url = '/ovas/matematicas/adicion-sustraccion/inicio'): Ova
    {
        self::$ovaSeq++;
        return Ova::create([
            'area'      => $area,
            'tematica'  => "OVA {$area} " . self::$ovaSeq,
            'url'       => $url,
            'is_active' => true,
        ]);
    }

    private function makeCourse(User $teacher, string $section = 'A'): Course
    {
        return Course::create([
            'grade'       => 'primero',
            'section'     => $section,
            'school_year' => date('Y'),
            'teacher_id'  => $teacher->id,
            'is_active'   => true,
        ]);
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

    private function insertEvaluation(User $student, Course $course, Ova $ova, int $score = 4, int $total = 5, int $attempt = 1): void
    {
        DB::table('evaluations')->insert([
            'user_id'        => $student->id,
            'course_id'      => $course->id,
            'ova_id'         => $ova->id,
            'evaluation_key' => 'adicion',
            'score'          => $score,
            'total'          => $total,
            'attempt'        => $attempt,
            'created_at'     => now(),
            'updated_at'     => now(),
        ]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-041 — Reportes generales de uso de OVA (Administrador)
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * CA-1: El admin puede acceder a su dashboard (renderiza sin error).
     */
    public function test_admin_puede_acceder_al_dashboard(): void
    {
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertStatus(200);
    }

    /**
     * CA-1: El dashboard del admin incluye las estadísticas generales del sistema.
     */
    public function test_dashboard_admin_incluye_estadisticas_generales(): void
    {
        $admin   = $this->makeAdmin();
        $teacher = $this->makeTeacher();
        $student = $this->makeStudent();

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertStatus(200);
        $props = $response->original->getData()['page']['props'];
        $stats = $props['stats'];

        // Métricas clave presentes
        $this->assertArrayHasKey('totalUsers', $stats);
        $this->assertArrayHasKey('activeUsers', $stats);
        $this->assertArrayHasKey('totalTeachers', $stats);
        $this->assertArrayHasKey('totalStudents', $stats);
        $this->assertArrayHasKey('totalOVAs', $stats);
        $this->assertArrayHasKey('activeCourses', $stats);
        $this->assertArrayHasKey('completedActivities', $stats);
        $this->assertArrayHasKey('avgProgress', $stats);
    }

    /**
     * CA-1: Los contadores reflejan el estado real de la base de datos.
     */
    public function test_estadisticas_del_admin_reflejan_datos_reales(): void
    {
        $admin   = $this->makeAdmin();
        $teacher = $this->makeTeacher();
        $student = $this->makeStudent();
        $this->makeOva();
        $this->makeCourse($teacher);

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $props = $response->original->getData()['page']['props'];
        $stats = $props['stats'];

        // 3 users: admin + teacher + student
        $this->assertEquals(3, $stats['totalUsers']);
        $this->assertEquals(1, $stats['totalTeachers']);
        $this->assertEquals(1, $stats['totalStudents']);
        $this->assertEquals(1, $stats['totalOVAs']);
        $this->assertEquals(1, $stats['activeCourses']);
    }

    /**
     * CA-2: El filtro por área expone las áreas de los OVAs registrados en el catálogo.
     * (availableAreas proviene de Ova::distinct()->pluck('area'), no de una lista estática)
     */
    public function test_dashboard_admin_expone_areas_disponibles_para_filtro(): void
    {
        $admin = $this->makeAdmin();

        // Crear OVAs con cada área para que getAvailableAreas() las devuelva
        $areas = ['Matemáticas', 'Español', 'Ciencias Naturales', 'Ciencias Sociales', 'Inglés'];
        foreach ($areas as $i => $area) {
            Ova::create([
                'area'      => $area,
                'tematica'  => "OVA {$area}",
                'url'       => null,
                'is_active' => true,
            ]);
        }

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $props          = $response->original->getData()['page']['props'];
        $availableAreas = $props['availableAreas'];

        foreach ($areas as $area) {
            $this->assertContains($area, $availableAreas);
        }
    }

    /**
     * CA-2: Filtrar por área devuelve la misma vista (no rompe la respuesta).
     */
    public function test_filtro_por_area_responde_correctamente(): void
    {
        $admin   = $this->makeAdmin();
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva('Matemáticas');
        $student = $this->makeStudent();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);
        $this->insertEvaluation($student, $course, $ova);

        $response = $this->actingAs($admin)
            ->get(route('admin.dashboard', ['area' => 'Matemáticas']));

        $response->assertStatus(200);
        $props = $response->original->getData()['page']['props'];
        $this->assertEquals('Matemáticas', $props['selectedArea']);
    }

    /**
     * CA-2: Filtrar por un área diferente no rompe el dashboard.
     */
    public function test_filtro_por_area_diferente_no_rompe_el_dashboard(): void
    {
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)
            ->get(route('admin.dashboard', ['area' => 'Español']));

        $response->assertStatus(200);
        $props = $response->original->getData()['page']['props'];
        $this->assertEquals('Español', $props['selectedArea']);
    }

    /**
     * CA-1: Las actividades completadas se cuentan correctamente con filtro.
     */
    public function test_completedActivities_refleja_evaluaciones_en_bd(): void
    {
        $admin   = $this->makeAdmin();
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva('Matemáticas');
        $student = $this->makeStudent();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);
        $this->insertEvaluation($student, $course, $ova, 4, 5, 1);
        $this->insertEvaluation($student, $course, $ova, 3, 5, 2);

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $props = $response->original->getData()['page']['props'];
        // completedActivities cuenta pares únicos (estudiante, OVA) con evaluación
        $this->assertGreaterThan(0, $props['stats']['completedActivities']);
    }

    /**
     * CA-3: La distribución de roles está presente en los props.
     */
    public function test_dashboard_admin_incluye_distribucion_de_roles(): void
    {
        $admin = $this->makeAdmin();
        $this->makeTeacher();
        $this->makeStudent();

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $props = $response->original->getData()['page']['props'];
        $this->assertArrayHasKey('roleDistribution', $props);

        $roleNames = collect($props['roleDistribution'])->pluck('name')->toArray();
        $this->assertContains('Estudiantes', $roleNames);
        $this->assertContains('Docentes', $roleNames);
        $this->assertContains('Administradores', $roleNames);
    }

    /**
     * Un docente no puede acceder al dashboard de administrador.
     */
    public function test_docente_no_puede_acceder_al_dashboard_admin(): void
    {
        $teacher = $this->makeTeacher();

        $response = $this->actingAs($teacher)->get(route('admin.dashboard'));

        $response->assertStatus(403);
    }

    /**
     * Un invitado es redirigido al login.
     */
    public function test_invitado_redirigido_al_acceder_al_dashboard_admin(): void
    {
        $response = $this->get(route('admin.dashboard'));

        $response->assertRedirect(route('login'));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-042 — Reportes de uso y desempeño en los cursos del docente
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * CA-1: El docente puede acceder a su dashboard de analítica.
     */
    public function test_docente_puede_acceder_al_dashboard_de_analitica(): void
    {
        $teacher = $this->makeTeacher();

        $response = $this->actingAs($teacher)->get(route('teacher.analytics'));

        $response->assertStatus(200);
    }

    /**
     * CA-1: El dashboard incluye las métricas de sus cursos.
     */
    public function test_dashboard_docente_incluye_estadisticas_de_sus_cursos(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $this->enrollStudent($course, $student);

        $response = $this->actingAs($teacher)->get(route('teacher.analytics'));

        $response->assertStatus(200);
        $props = $response->original->getData()['page']['props'];
        $stats = $props['stats'];

        $this->assertArrayHasKey('totalCourses', $stats);
        $this->assertArrayHasKey('activeCourses', $stats);
        $this->assertArrayHasKey('totalStudents', $stats);
        $this->assertArrayHasKey('totalOVAs', $stats);
        $this->assertArrayHasKey('completedActivities', $stats);
        $this->assertArrayHasKey('avgScore', $stats);
        $this->assertArrayHasKey('avgProgress', $stats);
    }

    /**
     * CA-1: Las métricas del docente reflejan únicamente sus propios cursos.
     */
    public function test_estadisticas_docente_reflejan_solo_sus_cursos(): void
    {
        $teacher  = $this->makeTeacher();
        $course1  = $this->makeCourse($teacher, 'A');
        $course2  = $this->makeCourse($teacher, 'B');
        $studentA = $this->makeStudent();
        $studentB = $this->makeStudent();
        $this->enrollStudent($course1, $studentA);
        $this->enrollStudent($course2, $studentB);

        $response = $this->actingAs($teacher)->get(route('teacher.analytics'));

        $props = $response->original->getData()['page']['props'];
        $this->assertEquals(2, $props['stats']['totalCourses']);
        $this->assertEquals(2, $props['stats']['activeCourses']);
        $this->assertEquals(2, $props['stats']['totalStudents']);
    }

    /**
     * CA-1: El docente sin cursos ve estadísticas en cero.
     */
    public function test_docente_sin_cursos_ve_estadisticas_en_cero(): void
    {
        $teacher = $this->makeTeacher();

        $response = $this->actingAs($teacher)->get(route('teacher.analytics'));

        $props = $response->original->getData()['page']['props'];
        $stats = $props['stats'];
        $this->assertEquals(0, $stats['totalCourses']);
        $this->assertEquals(0, $stats['totalStudents']);
        $this->assertEquals(0, $stats['completedActivities']);
    }

    /**
     * CA-1: completedActivities cuenta las evaluaciones de los cursos del docente.
     */
    public function test_completedActivities_docente_cuenta_evaluaciones_de_sus_cursos(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);
        $this->insertEvaluation($student, $course, $ova, 4, 5, 1);
        $this->insertEvaluation($student, $course, $ova, 5, 5, 2);

        $response = $this->actingAs($teacher)->get(route('teacher.analytics'));

        $props = $response->original->getData()['page']['props'];
        $this->assertEquals(2, $props['stats']['completedActivities']);
    }

    /**
     * CA-1: avgScore refleja el promedio calculado de las evaluaciones.
     */
    public function test_avgScore_docente_refleja_promedio_correcto(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);
        // score=5/5=100% y score=0/5=0% → promedio 50%
        $this->insertEvaluation($student, $course, $ova, 5, 5, 1);
        $this->insertEvaluation($student, $course, $ova, 0, 5, 2);

        $response = $this->actingAs($teacher)->get(route('teacher.analytics'));

        $props = $response->original->getData()['page']['props'];
        $this->assertEquals(50, $props['stats']['avgScore']);
    }

    /**
     * CA-1: El dashboard incluye la sección de actividad mensual.
     */
    public function test_dashboard_docente_incluye_actividad_mensual(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova     = $this->makeOva();
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);
        $this->insertEvaluation($student, $course, $ova);

        $response = $this->actingAs($teacher)->get(route('teacher.analytics'));

        $props = $response->original->getData()['page']['props'];
        $this->assertArrayHasKey('monthlyActivity', $props);
        // Con al menos una evaluación debe haber al menos un registro mensual
        $this->assertNotEmpty($props['monthlyActivity']);
    }

    /**
     * CA-1: El dashboard incluye el rendimiento por área.
     */
    public function test_dashboard_docente_incluye_rendimiento_por_area(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $student = $this->makeStudent();
        $ova     = $this->makeOva('Matemáticas');
        $this->attachOva($course, $ova);
        $this->enrollStudent($course, $student);
        $this->insertEvaluation($student, $course, $ova);

        $response = $this->actingAs($teacher)->get(route('teacher.analytics'));

        $props = $response->original->getData()['page']['props'];
        $this->assertArrayHasKey('ovaPerformanceByArea', $props);
        $areas = collect($props['ovaPerformanceByArea'])->pluck('area')->toArray();
        $this->assertContains('Matemáticas', $areas);
    }

    /**
     * CA-2: El docente no ve datos de cursos ajenos en su analítica.
     */
    public function test_docente_no_ve_datos_de_cursos_ajenos(): void
    {
        $teacherA = $this->makeTeacher();
        $teacherB = $this->makeTeacher();
        $courseB  = $this->makeCourse($teacherB);
        $student  = $this->makeStudent();
        $ova      = $this->makeOva();
        $this->attachOva($courseB, $ova);
        $this->enrollStudent($courseB, $student);
        $this->insertEvaluation($student, $courseB, $ova);

        // teacherA no tiene cursos ni evaluaciones → todo en cero
        $response = $this->actingAs($teacherA)->get(route('teacher.analytics'));

        $props = $response->original->getData()['page']['props'];
        $this->assertEquals(0, $props['stats']['totalCourses']);
        $this->assertEquals(0, $props['stats']['completedActivities']);
    }

    /**
     * El totalOVAs del docente cuenta solo OVAs asignados a sus cursos.
     */
    public function test_totalOVAs_docente_cuenta_solo_ovas_de_sus_cursos(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova1    = $this->makeOva('Matemáticas');
        $ova2    = $this->makeOva('Español', '/ovas/espanol/cuento/inicio');
        $ova3    = $this->makeOva('Inglés', null); // OVA en catálogo pero NO asignado
        $this->attachOva($course, $ova1, 0);
        $this->attachOva($course, $ova2, 1);

        $response = $this->actingAs($teacher)->get(route('teacher.analytics'));

        $props = $response->original->getData()['page']['props'];
        // Solo ova1 y ova2 están asignados al curso del docente
        $this->assertEquals(2, $props['stats']['totalOVAs']);
    }

    /**
     * Un admin no puede acceder al dashboard de analítica del docente.
     */
    public function test_admin_no_puede_acceder_al_analytics_del_docente(): void
    {
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->get(route('teacher.analytics'));

        $response->assertStatus(403);
    }

    /**
     * Un invitado es redirigido al login al intentar acceder al analytics.
     */
    public function test_invitado_redirigido_al_acceder_al_analytics_docente(): void
    {
        $response = $this->get(route('teacher.analytics'));

        $response->assertRedirect(route('login'));
    }
}
