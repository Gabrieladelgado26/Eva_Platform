<?php
// app/Models/OvaProgress.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OvaProgress extends Model
{
    use HasFactory;

    protected $table = 'ova_progress';

    protected $fillable = [
        'user_id',
        'ova_id',
        'course_id',
        'completed',
        'progress_percentage',
        'completed_at',
        'last_viewed_at',
        'view_count'
    ];

    protected $casts = [
        'completed' => 'boolean',
        'completed_at' => 'datetime',
        'last_viewed_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ova()
    {
        return $this->belongsTo(Ova::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}