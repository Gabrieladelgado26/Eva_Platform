<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ova;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OvaController extends Controller
{
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

        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $ovas = $query->paginate(10)->withQueryString();
        $areas = Ova::select('area')->distinct()->pluck('area');

        return Inertia::render('Admin/Ovas/Index', [
            'ovas' => $ovas,
            'filters' => [
                'search' => $request->search,
                'area' => $request->area,
                'status' => $request->status,
                'sort' => $sortField,
                'direction' => $sortDirection,
            ],
            'areas' => $areas,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Ovas/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'area' => 'required|string|max:255',
            'tematica' => 'required|string|max:255',
            'description' => 'nullable|string',
            'url' => 'nullable|url|max:500',  // URL opcional
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',  // Thumbnail opcional
            'is_active' => 'boolean',
        ]);

        try {
            // Subir thumbnail solo si existe
            if ($request->hasFile('thumbnail')) {
                $path = $request->file('thumbnail')->store('ovas/thumbnails', 'public');
                $validated['thumbnail'] = $path;
            } else {
                $validated['thumbnail'] = null; // Asegurar que sea null si no hay archivo
            }

            // Asegurar que url sea null si está vacío
            $validated['url'] = $request->filled('url') ? $validated['url'] : null;
            
            // Asegurar que is_active sea booleano
            $validated['is_active'] = $request->boolean('is_active');

            $ova = Ova::create($validated);

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
            'area' => 'required|string|max:255',
            'tematica' => 'required|string|max:255',
            'description' => 'nullable|string',
            'url' => 'nullable|url|max:500',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active' => 'boolean',
        ]);

        try {
            // Subir thumbnail solo si se proporciona uno nuevo
            if ($request->hasFile('thumbnail')) {
                // Eliminar thumbnail anterior si existe
                if ($ova->thumbnail) {
                    Storage::disk('public')->delete($ova->thumbnail);
                }
                $path = $request->file('thumbnail')->store('ovas/thumbnails', 'public');
                $validated['thumbnail'] = $path;
            } else {
                // Mantener el thumbnail existente o null
                $validated['thumbnail'] = $ova->thumbnail;
            }

            // Asegurar que url sea null si está vacío
            $validated['url'] = $request->filled('url') ? $validated['url'] : null;
            
            // Asegurar que is_active sea booleano
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
}