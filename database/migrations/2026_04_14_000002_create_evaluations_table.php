<?php
// database/migrations/2026_04_14_000002_create_evaluations_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('ova_id')->constrained('ovas')->onDelete('cascade');
            $table->string('evaluation_key');        // ej: adicionysuspropiedades
            $table->integer('score')->default(0);    // puntaje obtenido
            $table->integer('total')->default(5);    // puntaje máximo
            $table->integer('attempt')->default(1);  // número de intento
            $table->timestamps();

            // Índices
            $table->index(['user_id', 'ova_id', 'course_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};