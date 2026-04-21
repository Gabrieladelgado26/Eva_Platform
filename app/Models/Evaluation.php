<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'ova_id',
        'evaluation_key',
        'score',
        'total',
        'attempt',
    ];

    protected $casts = [
        'score'   => 'integer',
        'total'   => 'integer',
        'attempt' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function ova(): BelongsTo
    {
        return $this->belongsTo(Ova::class);
    }

    // Porcentaje de acierto
    public function getPercentageAttribute(): int
    {
        return $this->total > 0
            ? (int) round(($this->score / $this->total) * 100)
            : 0;
    }
}