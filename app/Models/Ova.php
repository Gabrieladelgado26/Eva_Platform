<?php
// app/Models/Ova.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ova extends Model
{
    use HasFactory;

    protected $table = 'ovas';

    protected $fillable = [
        'area',
        'tematica',
        'description',
        'url',
        'thumbnail',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_ova')
                    ->withPivot('order', 'is_required', 'assigned_at')
                    ->withTimestamps()
                    ->orderBy('pivot_order');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}