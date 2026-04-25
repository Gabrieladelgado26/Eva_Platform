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
     * Máximo de intentos permitidos por evaluación / estudiante
     */
    const MAX_ATTEMPTS = 3;

    /**
     * Guardar resultado de una evaluación HTML
     * Llamado por fetch() desde el HTML del OVA (eva-session.js)
     *
     * Estudiante → guarda en BD, devuelve card con intento/restantes
     * Docente / Admin → devuelve card de vista previa sin guardar en BD
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
        $user->load('role');
        $roleSlug = $user->role?->slug ?? 'student';

        // ── Docente / Admin: vista previa, sin guardar ────────────────────────
        if (in_array($roleSlug, ['teacher', 'admin'])) {
            $score = (int) $request->score;
            $total = (int) $request->total;
            $pct   = $total > 0 ? (int) round(($score / $total) * 100) : 0;

            return response()->json([
                'success'          => true,
                'preview'          => true,
                'message'          => 'Vista previa — el resultado no se guarda.',
                'is_last_attempt'  => false,
                'attempts_left'    => self::MAX_ATTEMPTS,
                'max_attempts'     => self::MAX_ATTEMPTS,
                'evaluation'       => [
                    'id'             => null,
                    'score'          => $score,
                    'total'          => $total,
                    'percentage'     => $pct,
                    'attempt'        => 1,
                    'evaluation_key' => $request->evaluation_key,
                ],
            ]);
        }

        // ── Estudiante: flujo normal ──────────────────────────────────────────

        // Si no viene course_id, buscar el curso activo del estudiante
        $courseId = $request->course_id;
        if (!$courseId) {
            $course = $user->enrolledCourses()
                ->where('is_active', true)
                ->first();
            $courseId = $course?->id;
        }

        // Si no viene ova_id, buscar el OVA activo del curso
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

        // ── Contar intentos anteriores ────────────────────────────────────────
        $attemptCount = Evaluation::where('user_id', $user->id)
            ->where('ova_id', $ovaId)
            ->where('course_id', $courseId)
            ->where('evaluation_key', $request->evaluation_key)
            ->count();

        // ── Bloquear si ya alcanzó el límite ──────────────────────────────────
        if ($attemptCount >= self::MAX_ATTEMPTS) {
            return response()->json([
                'success'       => false,
                'limit_reached' => true,
                'message'       => 'Has alcanzado el límite de ' . self::MAX_ATTEMPTS . ' intentos para esta evaluación.',
                'attempts'      => $attemptCount,
                'max_attempts'  => self::MAX_ATTEMPTS,
            ], 403);
        }

        $attempt = $attemptCount + 1;

        $evaluation = Evaluation::create([
            'user_id'        => $user->id,
            'course_id'      => $courseId,
            'ova_id'         => $ovaId,
            'evaluation_key' => $request->evaluation_key,
            'score'          => $request->score,
            'total'          => $request->total,
            'attempt'        => $attempt,
        ]);

        // ── Indicar si este fue el último intento permitido ───────────────────
        $isLastAttempt = $attempt >= self::MAX_ATTEMPTS;

        return response()->json([
            'success'         => true,
            'message'         => 'Evaluación guardada correctamente.',
            'is_last_attempt' => $isLastAttempt,
            'attempts_left'   => self::MAX_ATTEMPTS - $attempt,
            'max_attempts'    => self::MAX_ATTEMPTS,
            'evaluation'      => [
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
     * Historial de evaluaciones del estudiante — renderiza vista Inertia
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

        return \Inertia\Inertia::render('Student/Evaluations/Index', [
            'evaluations' => $evaluations,
        ]);
    }
}
