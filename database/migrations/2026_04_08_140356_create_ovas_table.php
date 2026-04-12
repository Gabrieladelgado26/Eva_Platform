<?php
// database/migrations/2024_01_01_000001_create_ovas_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Tabla de OVAs
        if (!Schema::hasTable('ovas')) {
            Schema::create('ovas', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('description')->nullable();
                $table->string('url')->nullable();
                $table->string('thumbnail')->nullable();
                $table->integer('duration')->nullable()->comment('Duración en minutos');
                $table->boolean('is_active')->default(true);
                $table->timestamps();
                
                // Índices para mejorar rendimiento
                $table->index('is_active');
                $table->index('created_at');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('ovas');
    }
};