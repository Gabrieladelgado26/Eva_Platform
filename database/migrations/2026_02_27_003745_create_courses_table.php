<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();

            // grado en palabras
            $table->enum('grade', [
                'primero',
                'segundo',
                'tercero',
                'cuarto',
                'quinto'
            ]);

            // sección: letra o número
            $table->string('section', 10);

            $table->text('description')->nullable();

            // docente del curso
            $table->foreignId('teacher_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // estado del curso
            $table->boolean('is_active')->default(true);

            // año escolar
            $table->year('school_year');

            $table->timestamps();

            // evita duplicar cursos del mismo docente en el mismo año
            $table->unique(
                ['teacher_id', 'grade', 'section', 'school_year'],
                'unique_teacher_course'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};