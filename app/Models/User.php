<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @method string redirectRoute()
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'pin',
        'is_active',
        'role_id',
        'force_logout',
    ];

    protected $hidden = [
        'password',
        'pin',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'pin' => 'hashed',
            'is_active' => 'boolean',
            'force_logout' => 'boolean',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function redirectRoute(): string
    {
        $slug = $this->role?->slug;

        return match ($slug) {
            'admin'   => 'admin.dashboard',
            'teacher' => 'teacher.dashboard',
            'student' => 'student.dashboard',
            default   => 'dashboard',
        };
    }

    // cursos creados por el docente
    public function courses()
    {
        return $this->hasMany(Course::class, 'teacher_id');
    }

    // cursos donde el usuario está inscrito como estudiante
    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'course_student')
            ->withTimestamps();
    }
}