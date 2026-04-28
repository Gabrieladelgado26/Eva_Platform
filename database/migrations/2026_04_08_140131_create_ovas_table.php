<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('ovas', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->string('tematica');

            $table->text('description')->nullable();
            $table->string('url')->nullable();
            $table->string('thumbnail')->nullable();
            $table->integer('duration')->nullable()->comment('Duración en minutos');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Índices
            $table->index('is_active');
            $table->index('created_at');

            $table->unique('tematica');
            $table->unique('url');
        });
    }

    public function down()
    {
        Schema::dropIfExists('ovas');
    }
};