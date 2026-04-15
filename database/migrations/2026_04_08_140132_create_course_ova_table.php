<?php
// database/migrations/2026_04_08_140132_create_course_ova_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('course_ova')) {
            Schema::create('course_ova', function (Blueprint $table) {
                $table->id();
                $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
                $table->foreignId('ova_id')->constrained('ovas')->onDelete('cascade');
                $table->integer('order')->default(0)->comment('Orden de visualización');
                $table->boolean('is_required')->default(true)->comment('Si es obligatorio ver la OVA');
                $table->timestamp('assigned_at')->nullable()->comment('Fecha de asignación');
                $table->timestamps();
                
                // Para evitar duplicados
                $table->unique(['course_id', 'ova_id'], 'course_ova_unique');
                
                // Índices para mejor rendimiento
                $table->index(['course_id', 'order'], 'course_ova_order_index');
                $table->index('ova_id');
                
                // Foreign keys explícitas para MySQL
                $table->foreign('course_id', 'fk_course_ova_course')
                    ->references('id')
                    ->on('courses')
                    ->onDelete('cascade');
                    
                $table->foreign('ova_id', 'fk_course_ova_ova')
                    ->references('id')
                    ->on('ovas')
                    ->onDelete('cascade');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('course_ova');
    }
};