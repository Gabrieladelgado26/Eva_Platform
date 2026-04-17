<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AvatarController extends Controller
{
    /**
     * Mostrar la vista de selección de avatar
     */
    public function index()
    {
        $user = Auth::user();
        
        return Inertia::render('Student/Avatar/Index', [
            'currentAvatar' => $user->avatar,
        ]);
    }

    /**
     * Guardar el avatar seleccionado
     */
    public function store(Request $request)
    {
        $request->validate([
            'avatar' => 'required|string|in:avatar1,avatar2,avatar3,avatar4,avatar5,avatar6',
        ]);

        $user = Auth::user();
        $user->update([
            'avatar' => $request->avatar,
            'needs_avatar' => false, // Actualizar el campo en la BD
        ]);

        session()->forget('needs_avatar');

        // Redirigir al dashboard con mensaje de éxito
        return redirect()
            ->route('student.avatar.index')
            ->with('success', '¡Avatar seleccionado correctamente!');
    }
}