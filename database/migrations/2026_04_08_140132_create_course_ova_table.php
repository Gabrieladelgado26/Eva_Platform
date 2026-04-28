<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('course_ova', function (Blueprint $table) {
            $table->id();

            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ova_id')->constrained()->cascadeOnDelete();

            $table->integer('order')->default(0);
            $table->boolean('is_required')->default(true);
            $table->timestamp('assigned_at')->nullable();
            $table->timestamps();

            $table->unique(['course_id', 'ova_id']);
            $table->index(['course_id', 'order']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('course_ova');
    }
};