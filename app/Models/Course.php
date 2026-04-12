<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'grade',
        'section',
        'description',
        'teacher_id',
        'is_active',
        'school_year'
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'course_student')
            ->withTimestamps();
    }

    // Nombre automático del curso
    public function getNameAttribute()
    {
        return ucfirst($this->grade) . ' ' . $this->section;
    }

    public function studentsCount()
    {
        return $this->students()->count();
    }

  public function ovas()
{
    return $this->belongsToMany(Ova::class, 'course_ova')
                ->withPivot('order', 'is_required', 'assigned_at')
                ->withTimestamps();
}
}