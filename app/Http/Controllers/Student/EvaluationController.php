<?php
// app/Http/Controllers/Student/EvaluationController.php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\Ova;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EvaluationController extends Controller
{
    /**
     * Guardar resultado de una evaluación HTML
     * Llamado por fetch() desde el HTML del OVA
     */
    public function store(Request $request)
    {
        $request->validate([
            'evaluation_key' => 'required|string|max:255',
            'score'          => 'required|integer|min:0',
            'total'          => 'required|integer|min:1',
            'ova_id'         => 'nullable|integer|exists:ovas,id',
            'course_id'      => 'nullable|integer|exists:courses,id',
        ]);

        $user = Auth::user();

        // Si no viene course_id, buscar el curso activo del estudiante
        $courseId = $request->course_id;
        if (!$courseId) {
            $course = $user->enrolledCourses()
                ->where('is_active', true)
                ->first();
            $courseId = $course?->id;
        }

        // Si no viene ova_id, buscar por evaluation_key en el nombre del campo url
        $ovaId = $request->ova_id;
        if (!$ovaId && $courseId) {
            $ova = Ova::whereHas('courses', fn($q) => $q->where('courses.id', $courseId))
                ->where('is_active', true)
                ->first();
            $ovaId = $ova?->id;
        }

        if (!$courseId || !$ovaId) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudo identificar el curso u OVA.',
            ], 422);
        }

        // Contar intentos anteriores
        $attempt = Evaluation::where('user_id', $user->id)
            ->where('ova_id', $ovaId)
            ->where('course_id', $courseId)
            ->where('evaluation_key', $request->evaluation_key)
            ->count() + 1;

        $evaluation = Evaluation::create([
            'user_id'        => $user->id,
            'course_id'      => $courseId,
            'ova_id'         => $ovaId,
            'evaluation_key' => $request->evaluation_key,
            'score'          => $request->score,
            'total'          => $request->total,
            'attempt'        => $attempt,
        ]);

        return response()->json([
            'success'    => true,
            'message'    => 'Evaluación guardada correctamente.',
            'evaluation' => [
                'id'             => $evaluation->id,
                'score'          => $evaluation->score,
                'total'          => $evaluation->total,
                'percentage'     => $evaluation->percentage,
                'attempt'        => $evaluation->attempt,
                'evaluation_key' => $evaluation->evaluation_key,
            ],
        ]);
    }

    /**
     * Obtener historial de evaluaciones del estudiante
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $evaluations = Evaluation::with(['ova', 'course'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($e) => [
                'id'             => $e->id,
                'evaluation_key' => $e->evaluation_key,
                'score'          => $e->score,
                'total'          => $e->total,
                'percentage'     => $e->percentage,
                'attempt'        => $e->attempt,
                'ova'            => $e->ova ? ['area' => $e->ova->area, 'tematica' => $e->ova->tematica] : null,
                'course'         => $e->course ? ['grade' => $e->course->grade, 'section' => $e->course->section] : null,
                'created_at'     => $e->created_at->format('d/m/Y H:i'),
            ]);

        return response()->json(['success' => true, 'data' => $evaluations]);
    }
}