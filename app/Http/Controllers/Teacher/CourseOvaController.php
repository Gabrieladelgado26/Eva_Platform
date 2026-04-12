<?php
// app/Http/Controllers/Teacher/CourseOvaController.php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Ova;
use App\Models\OvaProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CourseOvaController extends Controller
{
    /**
     * Obtener los OVAs ya asignados a un curso
     */
    public function index(Course $course)
    {
        $this->authorizeTeacher($course);
        
        $ovas = $course->ovas()
            ->orderByPivot('order')
            ->get()
            ->map(function ($ova) use ($course) {
                $totalStudents = $course->students()->count();
                $completedCount = OvaProgress::where('ova_id', $ova->id)
                    ->where('course_id', $course->id)
                    ->where('completed', true)
                    ->count();
                
                $ova->completion_percentage = $totalStudents > 0 
                    ? round(($completedCount / $totalStudents) * 100) 
                    : 0;
                $ova->completed_count = $completedCount;
                $ova->total_students = $totalStudents;
                
                return $ova;
            });
        
        return response()->json([
            'success' => true,
            'data' => $ovas
        ]);
    }

    /**
     * Obtener todos los OVAs disponibles (catálogo) que NO están asignados al curso
     */
    public function available(Course $course)
    {
        $this->authorizeTeacher($course);
        
        $assignedIds = $course->ovas()->pluck('ovas.id')->toArray();
        $available = Ova::whereNotIn('id', $assignedIds)
            ->where('is_active', true)
            ->orderBy('title')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $available
        ]);
    }

    /**
     * Asignar uno o varios OVAs al curso
     */
    public function assign(Request $request, Course $course)
    {
        $this->authorizeTeacher($course);
        
        $request->validate([
            'ova_ids' => 'required|array',
            'ova_ids.*' => 'exists:ovas,id',
        ]);

        $now = now();
        $lastOrder = $course->ovas()->max('order') ?? -1;
        $attachData = [];
        $assignedCount = 0;
        
        foreach ($request->ova_ids as $ovaId) {
            if (!$course->ovas()->where('ova_id', $ovaId)->exists()) {
                $lastOrder++;
                $attachData[$ovaId] = [
                    'order' => $lastOrder,
                    'is_required' => true,
                    'assigned_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
                $assignedCount++;
            }
        }
        
        if (!empty($attachData)) {
            $course->ovas()->attach($attachData);
        }
        
        // Devolver JSON para fetch
        return response()->json([
            'success' => true,
            'message' => $assignedCount . ' OVA(s) asignado(s) correctamente',
            'data' => $course->ovas()->orderByPivot('order')->get()
        ]);
    }

    /**
     * Remover un OVA del curso
     */
    public function remove(Course $course, Ova $ova)
    {
        $this->authorizeTeacher($course);
        
        DB::beginTransaction();
        try {
            // Eliminar progreso de los estudiantes
        if (Schema::hasTable('ova_progress')) {
    OvaProgress::where('ova_id', $ova->id)
        ->where('course_id', $course->id)
        ->delete();
}
            // Eliminar la relación
            $course->ovas()->detach($ova->id);
            
            // Reordenar las OVAs restantes
            $remainingOvas = $course->ovas()->orderBy('order')->get();
            $order = 0;
            foreach ($remainingOvas as $remainingOva) {
                $course->ovas()->updateExistingPivot($remainingOva->id, ['order' => $order]);
                $order++;
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'OVA removido del curso correctamente',
                'data' => $course->ovas()->orderByPivot('order')->get()
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al remover la OVA: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar el orden de los OVAs en el curso
     */
    public function updateOrder(Request $request, Course $course)
    {
        $this->authorizeTeacher($course);
        
        $request->validate([
            'ovas' => 'required|array',
            'ovas.*.id' => 'required|exists:ovas,id',
            'ovas.*.order' => 'required|integer|min:0'
        ]);

        DB::beginTransaction();
        try {
            foreach ($request->ovas as $ovaData) {
                $course->ovas()->updateExistingPivot($ovaData['id'], [
                    'order' => $ovaData['order']
                ]);
            }
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Orden actualizado correctamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el orden: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar configuración de un OVA específico en el curso
     */
    public function updateConfig(Request $request, Course $course, Ova $ova)
    {
        $this->authorizeTeacher($course);
        
        $request->validate([
            'is_required' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0'
        ]);

        $updateData = [];
        if ($request->has('is_required')) {
            $updateData['is_required'] = $request->is_required;
        }
        if ($request->has('order')) {
            $updateData['order'] = $request->order;
        }

        if (!empty($updateData)) {
            $course->ovas()->updateExistingPivot($ova->id, $updateData);
        }

        return response()->json([
            'success' => true,
            'message' => 'Configuración actualizada correctamente'
        ]);
    }

    /**
     * Obtener estadísticas de progreso de OVAs para el curso
     */
    public function stats(Course $course)
    {
        $this->authorizeTeacher($course);
        
        $totalOvas = $course->ovas()->count();
        $totalStudents = $course->students()->count();
        
        $stats = [
            'total_ovas' => $totalOvas,
            'total_students' => $totalStudents,
            'completed_ovas_count' => OvaProgress::where('course_id', $course->id)
                ->where('completed', true)
                ->count(),
            'average_progress' => 0,
            'ovas_by_student' => [],
            'most_viewed_ovas' => []
        ];
        
        $totalProgress = OvaProgress::where('course_id', $course->id)->sum('progress_percentage');
        $totalRecords = OvaProgress::where('course_id', $course->id)->count();
        $stats['average_progress'] = $totalRecords > 0 ? round($totalProgress / $totalRecords) : 0;
        
        $students = $course->students()->with(['ovaProgress' => function($query) use ($course) {
            $query->where('course_id', $course->id);
        }])->get();
        
        foreach ($students as $student) {
            $completedCount = $student->ovaProgress->where('completed', true)->count();
            $stats['ovas_by_student'][] = [
                'student_id' => $student->id,
                'student_name' => $student->name,
                'completed' => $completedCount,
                'total' => $totalOvas,
                'percentage' => $totalOvas > 0 ? round(($completedCount / $totalOvas) * 100) : 0
            ];
        }
        
        $stats['most_viewed_ovas'] = OvaProgress::where('course_id', $course->id)
            ->select('ova_id', DB::raw('COUNT(*) as view_count'))
            ->groupBy('ova_id')
            ->orderBy('view_count', 'desc')
            ->with('ova')
            ->limit(5)
            ->get()
            ->map(function($item) {
                return [
                    'ova_id' => $item->ova_id,
                    'ova_title' => $item->ova->title ?? 'N/A',
                    'view_count' => $item->view_count
                ];
            });
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Obtener progreso detallado de un OVA específico
     */
    public function ovaProgress(Course $course, Ova $ova)
    {
        $this->authorizeTeacher($course);
        
        $totalStudents = $course->students()->count();
        $completedCount = OvaProgress::where('ova_id', $ova->id)
            ->where('course_id', $course->id)
            ->where('completed', true)
            ->count();
        
        $studentsProgress = $course->students()
            ->select('users.id', 'users.name', 'users.username')
            ->with(['ovaProgress' => function($query) use ($ova, $course) {
                $query->where('ova_id', $ova->id)
                    ->where('course_id', $course->id);
            }])
            ->get()
            ->map(function($student) {
                $progress = $student->ovaProgress->first();
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'username' => $student->username,
                    'completed' => $progress ? $progress->completed : false,
                    'progress_percentage' => $progress ? $progress->progress_percentage : 0,
                    'completed_at' => $progress ? $progress->completed_at : null,
                    'last_viewed_at' => $progress ? $progress->last_viewed_at : null,
                    'view_count' => $progress ? $progress->view_count : 0
                ];
            });
        
        return response()->json([
            'success' => true,
            'data' => [
                'ova' => $ova,
                'total_students' => $totalStudents,
                'completed_count' => $completedCount,
                'completion_percentage' => $totalStudents > 0 ? round(($completedCount / $totalStudents) * 100) : 0,
                'students_progress' => $studentsProgress
            ]
        ]);
    }

    /**
     * Sincronizar OVAs (reemplazar todas las asignaciones actuales)
     */
    public function sync(Request $request, Course $course)
    {
        $this->authorizeTeacher($course);
        
        $request->validate([
            'ova_ids' => 'required|array',
            'ova_ids.*' => 'exists:ovas,id'
        ]);

        DB::beginTransaction();
        try {
            $currentOvaIds = $course->ovas()->pluck('ovas.id')->toArray();
            $removedOvaIds = array_diff($currentOvaIds, $request->ova_ids);
            
            if (!empty($removedOvaIds)) {
                OvaProgress::where('course_id', $course->id)
                    ->whereIn('ova_id', $removedOvaIds)
                    ->delete();
            }
            
            $now = now();
            $syncData = [];
            $order = 0;
            
            foreach ($request->ova_ids as $ovaId) {
                $syncData[$ovaId] = [
                    'order' => $order,
                    'is_required' => true,
                    'assigned_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
                $order++;
            }
            
            $course->ovas()->sync($syncData);
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'OVAs sincronizados correctamente',
                'data' => $course->ovas()->orderByPivot('order')->get()
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al sincronizar: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Autorizar que el usuario es el profesor del curso
     */
    protected function authorizeTeacher(Course $course)
    {
        $user = Auth::user();
        abort_if(!$user || $user->id !== $course->teacher_id, 403, 'No autorizado');
    }
}