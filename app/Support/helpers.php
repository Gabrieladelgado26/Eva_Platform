<?php

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

if (!function_exists('audit')) {

    function audit(
        string $action,
        ?Model $model = null,
        ?array $old = null,
        ?array $new = null
    ): void {

        AuditLog::create([
            'user_id' => Auth::id(),
            'performed_by' => Auth::id(),
            'action' => $action,
            'auditable_type' => $model ? get_class($model) : null,
            'auditable_id' => $model?->getKey(),
            'old_values' => $old,
            'new_values' => $new,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}