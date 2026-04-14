<?php
// database/migrations/2026_04_11_234144_update_ovas_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('ovas', function (Blueprint $table) {
            // Eliminar columna duration
            $table->dropColumn('duration');

            // Renombrar title -> area
            $table->renameColumn('title', 'area');

            // Agregar columna tematica después de area
            $table->string('tematica')->nullable()->after('area');
        });
    }

    public function down()
    {
        Schema::table('ovas', function (Blueprint $table) {
            $table->dropColumn('tematica');
            $table->renameColumn('area', 'title');
            $table->integer('duration')->nullable()->comment('Duración en minutos');
        });
    }
};