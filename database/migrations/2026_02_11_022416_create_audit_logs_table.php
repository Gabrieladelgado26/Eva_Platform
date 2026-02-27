<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // Usuario que realizó la acción
            $table->foreignId('performed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->index();

            // Modelo afectado (morph)
            $table->nullableMorphs('auditable');
            // Esto ya crea índice compuesto automáticamente

            // Acción realizada
            $table->string('action')->index();

            // Cambios
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();

            // Metadata
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();

            $table->timestamps();

            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
