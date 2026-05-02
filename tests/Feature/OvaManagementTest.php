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
 * Iteración 4 – Gestión de OVAs y Contenido Educativo
 *
 * Cubre las historias de usuario HU-024 a HU-030:
 *   HU-024  OVA MAT03 integrado y accesible (rutas de contenido)
 *   HU-025  Admin agrega nuevos OVAs al catálogo
 *   HU-026  Admin visualiza listado de OVAs
 *   HU-027  Admin edita información de un OVA
 *   HU-028  Admin activa / desactiva OVA
 *   HU-029  Admin elimina OVA (protegido si está en uso)
 *   HU-030  OVA de Español integrado (replicabilidad del flujo)
 */
class OvaManagementTest extends TestCase
{
    use RefreshDatabase;

    // Valores válidos según OvaController::AREAS_VALIDAS y OVA_PATHS_VALIDOS
    private const AREA_MATEMATICAS   = 'Matemáticas';
    private const AREA_ESPANOL       = 'Español';
    private const AREA_CIENCIAS_NAT  = 'Ciencias Naturales';

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

    private function makeAdmin(): User
    {
        return $this->makeUser('admin', [
            'email'    => 'admin@ova.test',
            'password' => Hash::make('pass'),
        ]);
    }

    private function makeTeacher(): User
    {
        return $this->makeUser('teacher', [
            'email'    => 'teacher@ova.test',
            'password' => Hash::make('pass'),
        ]);
    }

    private function makeOva(array $overrides = []): Ova
    {
        return Ova::create(array_merge([
            'area'      => self::AREA_MATEMATICAS,
            'tematica'  => 'Adición y Sustracción',
            'url'       => self::URL_MAT,
            'is_active' => true,
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

    // ═══════════════════════════════════════════════════════════════════════
    // HU-024 — OVA MAT03 integrado y accesible
    // ═══════════════════════════════════════════════════════════════════════

    /** El OVA de Matemáticas (MAT03) es accesible por usuarios autenticados. */
    public function test_ova_mat03_es_accesible_por_usuario_autenticado(): void
    {
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->get('/ovas/matematicas/adicion-sustraccion/inicio');

        $response->assertStatus(200);
    }

    /** El OVA de Matemáticas no es accesible sin sesión activa. */
    public function test_ova_mat03_requiere_autenticacion(): void
    {
        $response = $this->get('/ovas/matematicas/adicion-sustraccion/inicio');

        $response->assertRedirect(route('login'));
    }

    /** Un estudiante también puede acceder al OVA de Matemáticas (rol no restringido). */
    public function test_estudiante_puede_acceder_al_ova_mat03(): void
    {
        $student = $this->makeUser('student', [
            'username' => 'est-ova',
            'pin'      => Hash::make(1234),
            'email'    => null,
            'password' => null,
        ]);

        $response = $this->actingAs($student)->get('/ovas/matematicas/adicion-sustraccion/inicio');

        $response->assertStatus(200);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-025 — Admin agrega nuevos OVAs al catálogo
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-1: El formulario de creación de OVA se renderiza. */
    public function test_admin_puede_acceder_al_formulario_de_crear_ova(): void
    {
        $response = $this->actingAs($this->makeAdmin())->get(route('admin.ovas.create'));

        $response->assertStatus(200);
    }

    /** CA-2: El admin puede crear un OVA con datos válidos y URL única. */
    public function test_admin_puede_crear_ova_con_datos_validos(): void
    {
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->post(route('admin.ovas.store'), [
            'area'      => self::AREA_MATEMATICAS,
            'tematica'  => 'Adición y Sustracción',
            'url'       => self::URL_MAT,
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.ovas.index'));
        $this->assertDatabaseHas('ovas', [
            'area'     => self::AREA_MATEMATICAS,
            'tematica' => 'Adición y Sustracción',
        ]);
    }

    /** CA-2: El OVA puede crearse sin URL (campo nullable). */
    public function test_admin_puede_crear_ova_sin_url(): void
    {
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->post(route('admin.ovas.store'), [
            'area'      => self::AREA_CIENCIAS_NAT,
            'tematica'  => 'El ecosistema',
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.ovas.index'));
        $this->assertDatabaseHas('ovas', ['tematica' => 'El ecosistema']);
    }

    /** CA-3: URL duplicada es rechazada. */
    public function test_url_duplicada_falla_validacion(): void
    {
        $admin = $this->makeAdmin();
        $this->makeOva(['url' => self::URL_MAT, 'tematica' => 'Primera OVA']);

        $response = $this->actingAs($admin)->post(route('admin.ovas.store'), [
            'area'     => self::AREA_MATEMATICAS,
            'tematica' => 'Segunda OVA',
            'url'      => self::URL_MAT,   // misma URL
        ]);

        $response->assertSessionHasErrors('url');
        $this->assertEquals(1, Ova::count());
    }

    /** CA-3: Temática duplicada también es rechazada. */
    public function test_tematica_duplicada_falla_validacion(): void
    {
        $admin = $this->makeAdmin();
        $this->makeOva(['tematica' => 'Nombre Repetido', 'url' => self::URL_MAT]);

        $response = $this->actingAs($admin)->post(route('admin.ovas.store'), [
            'area'     => self::AREA_ESPANOL,
            'tematica' => 'Nombre Repetido',   // duplicado
            'url'      => self::URL_ESP,
        ]);

        $response->assertSessionHasErrors('tematica');
    }

    /** CA-4: Campo área vacío falla validación. */
    public function test_area_vacia_falla_validacion(): void
    {
        $response = $this->actingAs($this->makeAdmin())->post(route('admin.ovas.store'), [
            'tematica' => 'Sin área',
            'url'      => self::URL_MAT,
        ]);

        $response->assertSessionHasErrors('area');
    }

    /** CA-4: Área fuera del listado válido falla validación. */
    public function test_area_invalida_falla_validacion(): void
    {
        $response = $this->actingAs($this->makeAdmin())->post(route('admin.ovas.store'), [
            'area'     => 'Arte',      // no está en AREAS_VALIDAS
            'tematica' => 'Dibujo',
        ]);

        $response->assertSessionHasErrors('area');
    }

    /** CA-4: Temática vacía falla validación. */
    public function test_tematica_vacia_falla_validacion(): void
    {
        $response = $this->actingAs($this->makeAdmin())->post(route('admin.ovas.store'), [
            'area' => self::AREA_MATEMATICAS,
            // sin tematica
        ]);

        $response->assertSessionHasErrors('tematica');
    }

    /** URL fuera de los paths válidos del sistema falla validación. */
    public function test_url_fuera_de_paths_validos_falla(): void
    {
        $response = $this->actingAs($this->makeAdmin())->post(route('admin.ovas.store'), [
            'area'     => self::AREA_MATEMATICAS,
            'tematica' => 'Fracciones',
            'url'      => '/ovas/matematicas/fracciones/inicio',  // no registrado
        ]);

        $response->assertSessionHasErrors('url');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-026 — Admin visualiza listado de OVAs
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-1: El admin puede acceder al catálogo de OVAs. */
    public function test_admin_puede_ver_catalogo_de_ovas(): void
    {
        $this->makeOva();

        $response = $this->actingAs($this->makeAdmin())->get(route('admin.ovas.index'));

        $response->assertStatus(200);
    }

    /** CA-2: El admin puede acceder al detalle de un OVA. */
    public function test_admin_puede_ver_detalle_de_ova(): void
    {
        $ova = $this->makeOva();

        $response = $this->actingAs($this->makeAdmin())->get(route('admin.ovas.show', $ova));

        $response->assertStatus(200);
    }

    /** Un docente no puede acceder al panel de administración de OVAs. */
    public function test_docente_no_puede_acceder_al_catalogo_admin(): void
    {
        $response = $this->actingAs($this->makeTeacher())->get(route('admin.ovas.index'));

        $response->assertStatus(403);
    }

    /** Un invitado es redirigido al login al intentar ver OVAs. */
    public function test_invitado_redirigido_al_login_en_ovas(): void
    {
        $response = $this->get(route('admin.ovas.index'));

        $response->assertRedirect(route('login'));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-027 — Admin edita información de un OVA
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-1: El formulario de edición carga con los datos actuales. */
    public function test_formulario_edicion_ova_carga_correctamente(): void
    {
        $ova = $this->makeOva();

        $response = $this->actingAs($this->makeAdmin())->get(route('admin.ovas.edit', $ova));

        $response->assertStatus(200);
    }

    /** CA-2: El admin puede guardar cambios válidos en un OVA. */
    public function test_admin_puede_editar_ova_con_datos_validos(): void
    {
        $ova   = $this->makeOva(['tematica' => 'Original', 'url' => self::URL_MAT]);
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->put(route('admin.ovas.update', $ova), [
            'area'      => self::AREA_ESPANOL,
            'tematica'  => 'Actualizada',
            'url'       => self::URL_ESP,
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.ovas.index'));
        $this->assertDatabaseHas('ovas', [
            'id'       => $ova->id,
            'tematica' => 'Actualizada',
            'area'     => self::AREA_ESPANOL,
        ]);
    }

    /** CA-2: El admin puede guardar el OVA con la misma URL que ya tenía (no es duplicado propio). */
    public function test_editar_ova_conservando_su_propia_url_es_valido(): void
    {
        $ova   = $this->makeOva(['tematica' => 'Original', 'url' => self::URL_MAT]);
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->put(route('admin.ovas.update', $ova), [
            'area'      => self::AREA_MATEMATICAS,
            'tematica'  => 'Nombre Nuevo',
            'url'       => self::URL_MAT,   // misma URL del OVA
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.ovas.index'));
        $this->assertDatabaseHas('ovas', ['id' => $ova->id, 'tematica' => 'Nombre Nuevo']);
    }

    /** CA-3: URL que ya usa otro OVA es rechazada al editar. */
    public function test_editar_ova_con_url_de_otro_ova_falla(): void
    {
        $ova1  = $this->makeOva(['tematica' => 'OVA 1', 'url' => self::URL_MAT]);
        $ova2  = $this->makeOva(['tematica' => 'OVA 2', 'url' => self::URL_ESP]);
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->put(route('admin.ovas.update', $ova2), [
            'area'      => self::AREA_MATEMATICAS,
            'tematica'  => 'OVA 2 Editada',
            'url'       => self::URL_MAT,   // URL de ova1
            'is_active' => true,
        ]);

        $response->assertSessionHasErrors('url');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-028 — Admin activa / desactiva OVA
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-1: El admin puede desactivar un OVA activo. */
    public function test_admin_puede_desactivar_ova(): void
    {
        $ova = $this->makeOva(['is_active' => true]);

        $this->actingAs($this->makeAdmin())->patch(route('admin.ovas.toggle-status', $ova));

        $this->assertDatabaseHas('ovas', ['id' => $ova->id, 'is_active' => false]);
    }

    /** CA-3: El admin puede reactivar un OVA inactivo. */
    public function test_admin_puede_reactivar_ova(): void
    {
        $ova = $this->makeOva(['is_active' => false]);

        $this->actingAs($this->makeAdmin())->patch(route('admin.ovas.toggle-status', $ova));

        $this->assertDatabaseHas('ovas', ['id' => $ova->id, 'is_active' => true]);
    }

    /** CA-2: Un OVA desactivado NO aparece en el catálogo disponible para docentes. */
    public function test_ova_desactivado_no_aparece_en_catalogo_del_docente(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $ovaActivo   = $this->makeOva(['tematica' => 'Activo',   'is_active' => true,  'url' => self::URL_MAT]);
        $ovaInactivo = $this->makeOva(['tematica' => 'Inactivo', 'is_active' => false, 'url' => self::URL_ESP]);

        // El endpoint devuelve solo OVAs activas no asignadas
        $response = $this->actingAs($teacher)->get(
            route('teacher.courses.available-ovas', $course)
        );

        $response->assertStatus(200);
        $data = $response->json();

        $ids = collect($data)->pluck('id')->toArray();
        $this->assertContains($ovaActivo->id, $ids);
        $this->assertNotContains($ovaInactivo->id, $ids);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-029 — Admin elimina OVA definitivamente
    // ═══════════════════════════════════════════════════════════════════════

    /** CA-2: El admin puede eliminar un OVA que no está asignado a ningún curso. */
    public function test_admin_puede_eliminar_ova_sin_cursos(): void
    {
        $ova   = $this->makeOva();
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->delete(route('admin.ovas.destroy', $ova));

        $response->assertRedirect(route('admin.ovas.index'));
        $this->assertDatabaseMissing('ovas', ['id' => $ova->id]);
    }

    /** CA-3: El admin NO puede eliminar un OVA asignado a uno o más cursos. */
    public function test_admin_no_puede_eliminar_ova_en_uso(): void
    {
        $admin   = $this->makeAdmin();
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva();

        // Asignar OVA al curso
        $course->ovas()->attach($ova->id, [
            'order'       => 0,
            'is_required' => true,
            'assigned_at' => now(),
        ]);

        $response = $this->actingAs($admin)->delete(route('admin.ovas.destroy', $ova));

        // Redirige con error, el OVA no fue eliminado
        $response->assertRedirect(route('admin.ovas.index'));
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('ovas', ['id' => $ova->id]);
    }

    /** CA-3: OVA bloqueado sigue disponible en el catálogo del docente. */
    public function test_ova_bloqueado_permanece_en_catalogo(): void
    {
        $admin   = $this->makeAdmin();
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);
        $ova     = $this->makeOva();

        $course->ovas()->attach($ova->id, [
            'order'       => 0,
            'is_required' => true,
            'assigned_at' => now(),
        ]);

        // Intento de eliminación
        $this->actingAs($admin)->delete(route('admin.ovas.destroy', $ova));

        // El OVA sigue existiendo
        $this->assertEquals(1, Ova::count());
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HU-030 — OVA de Español integrado (replicabilidad)
    // ═══════════════════════════════════════════════════════════════════════

    /** El OVA de Español (El Cuento) es accesible por usuarios autenticados. */
    public function test_ova_espanol_es_accesible_por_usuario_autenticado(): void
    {
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->get('/ovas/espanol/cuento/inicio');

        $response->assertStatus(200);
    }

    /** El OVA de Español requiere autenticación. */
    public function test_ova_espanol_requiere_autenticacion(): void
    {
        $response = $this->get('/ovas/espanol/cuento/inicio');

        $response->assertRedirect(route('login'));
    }

    /** Ambos OVAs (MAT03 y Español) pueden registrarse en el catálogo sin conflicto. */
    public function test_ambos_ovas_pueden_coexistir_en_el_catalogo(): void
    {
        $admin = $this->makeAdmin();

        $this->actingAs($admin)->post(route('admin.ovas.store'), [
            'area'      => self::AREA_MATEMATICAS,
            'tematica'  => 'Adición y Sustracción',
            'url'       => self::URL_MAT,
            'is_active' => true,
        ]);

        $this->actingAs($admin)->post(route('admin.ovas.store'), [
            'area'      => self::AREA_ESPANOL,
            'tematica'  => 'El Cuento',
            'url'       => self::URL_ESP,
            'is_active' => true,
        ]);

        $this->assertEquals(2, Ova::count());
        $this->assertDatabaseHas('ovas', ['tematica' => 'Adición y Sustracción']);
        $this->assertDatabaseHas('ovas', ['tematica' => 'El Cuento']);
    }
}
