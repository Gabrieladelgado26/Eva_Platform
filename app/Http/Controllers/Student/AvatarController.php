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
     * Esta vista debe estar siempre accesible para cambiar el avatar
     */
    public function index()
    {
        $user = Auth::user();

        // No redirigir - permitir cambiar avatar incluso si ya tiene uno
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
        $user->update(['avatar' => $request->avatar]);

        // Obtener el nombre del avatar seleccionado
        $avatarNames = [
            'avatar1' => 'Pili',
            'avatar2' => 'Willy',
            'avatar3' => 'Pipe',
            'avatar4' => 'Beto',
            'avatar5' => 'Ivy',
            'avatar6' => 'Juli',
        ];

        $avatarName = $avatarNames[$request->avatar] ?? 'tu nuevo avatar';

        // Redirigir de vuelta a la misma página (avatar.index) con mensaje de éxito
        return redirect()
            ->route('student.avatar.index')
            ->with('success', '¡Fantástico! Ahora ' . $avatarName . ' te acompañará en tu aventura');
    }
}
