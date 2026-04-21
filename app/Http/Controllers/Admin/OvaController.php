<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class OvaController extends Controller
{
    /**
     * Áreas (materias) fijas del sistema.
     * Deben coincidir con las opciones del select en Create.jsx / Edit.jsx.
     */
    private const AREAS_VALIDAS = [
        'Ciencias Naturales',
        'Ciencias Sociales',
        'Español',
        'Matemáticas',
        'Inglés',
    ];

    /**
     * Rutas internas de OVA disponibles (Pages/OVA/).
     * Deben coincidir con OVA_RECURSOS en Create.jsx / Edit.jsx.
     */
    private const OVA_PATHS_VALIDOS = [
        // Matemáticas — Adición y Sustracción
        '/ovas/matematicas/adicion-sustraccion/inicio',
    ];

    public function index(Request $request)
    {
        $query = Ova::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('area', 'like', "%{$search}%")
                  ->orWhere('tematica', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('area')) {
            $query->where('area', $request->area);
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $sortField     = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $ovas  = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Ovas/Index', [
            'ovas'    => $ovas,
            'filters' => [
                'search'    => $request->search,
                'area'      => $request->area,
                'status'    => $request->status,
                'sort'      => $sortField,
                'direction' => $sortDirection,
            ],
            // Se pasan las áreas fijas para que el Index también pueda filtrar
            'areas' => self::AREAS_VALIDAS,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Ovas/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'area'      => ['required', 'string', 'in:' . implode(',', self::AREAS_VALIDAS)],
            'tematica'  => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            // url ahora es un path interno (ej: /ova/matematicas) o null
            'url'       => ['nullable', 'string', 'in:' . implode(',', self::OVA_PATHS_VALIDOS)],
            'thumbnail' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_active' => ['boolean'],
        ]);

        try {
            if ($request->hasFile('thumbnail')) {
                $path = $request->file('thumbnail')->store('ovas/thumbnails', 'public');
                $validated['thumbnail'] = $path;
            } else {
                $validated['thumbnail'] = null;
            }

            $validated['url']       = $request->filled('url') ? $validated['url'] : null;
            $validated['is_active'] = $request->boolean('is_active');

            Ova::create($validated);

            return redirect()->route('admin.ovas.index')
                ->with('success', 'OVA creada exitosamente.');

        } catch (\Exception $e) {
            \Log::error('Error al crear OVA: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Error al crear la OVA: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function show(Ova $ova)
    {
        $ova->load('courses');

        return Inertia::render('Admin/Ovas/Show', [
            'ova' => $ova,
        ]);
    }

    public function edit(Ova $ova)
    {
        return Inertia::render('Admin/Ovas/Edit', [
            'ova' => $ova,
        ]);
    }

    public function update(Request $request, Ova $ova)
    {
        $validated = $request->validate([
            'area'        => ['required', 'string', 'in:' . implode(',', self::AREAS_VALIDAS)],
            'tematica'    => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'url'         => ['nullable', 'string', 'in:' . implode(',', self::OVA_PATHS_VALIDOS)],
            'thumbnail'   => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_active'   => ['boolean'],
        ]);

        try {
            if ($request->hasFile('thumbnail')) {
                if ($ova->thumbnail) {
                    Storage::disk('public')->delete($ova->thumbnail);
                }
                $path = $request->file('thumbnail')->store('ovas/thumbnails', 'public');
                $validated['thumbnail'] = $path;
            } else {
                $validated['thumbnail'] = $ova->thumbnail;
            }

            $validated['url']       = $request->filled('url') ? $validated['url'] : null;
            $validated['is_active'] = $request->boolean('is_active');

            $ova->update($validated);

            return redirect()->route('admin.ovas.index')
                ->with('success', 'OVA actualizada exitosamente.');

        } catch (\Exception $e) {
            \Log::error('Error al actualizar OVA: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Error al actualizar la OVA: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function destroy(Ova $ova)
    {
        if ($ova->courses()->count() > 0) {
            return redirect()->route('admin.ovas.index')
                ->with('error', 'No se puede eliminar la OVA porque está siendo utilizada en uno o más cursos.');
        }

        if ($ova->thumbnail) {
            Storage::disk('public')->delete($ova->thumbnail);
        }

        $ova->delete();

        return redirect()->route('admin.ovas.index')
            ->with('success', 'OVA eliminada exitosamente.');
    }

    public function toggleStatus(Ova $ova)
    {
        $ova->update(['is_active' => !$ova->is_active]);

        $status = $ova->is_active ? 'activada' : 'desactivada';

        return redirect()->route('admin.ovas.index')
            ->with('success', "OVA {$status} exitosamente.");
    }

    /**
     * Renderiza la página interna de la OVA (Pages/OVA/Recurso).
     * Se abre vía window.open desde el frontend.
     *
     * Ruta sugerida en web.php:
     *   Route::get('/ova/{ova}/recurso', [OvaController::class, 'recurso'])
     *       ->name('admin.ovas.recurso');
     */
    public function recurso(Ova $ova)
    {
        return Inertia::render('OVA/Recurso', [
            'ova' => [
                'id'          => $ova->id,
                'area'        => $ova->area,
                'tematica'    => $ova->tematica,
                'description' => $ova->description,
                'url'         => $ova->url,
                'thumbnail'   => $ova->thumbnail,
                'is_active'   => $ova->is_active,
            ],
        ]);
    }
}