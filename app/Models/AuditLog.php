<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = [
        'performed_by',
        'action',
        'auditable_type',
        'auditable_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    public function performer()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }

    public function auditable()
    {
        return $this->morphTo();
    }

    public function performedBy()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
