<?php

namespace Database\Seeders;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ovas', function (Blueprint $table) {
            $table->id();
            $table->string('area');
            $table->string('tematica');
            $table->text('description')->nullable();
            $table->string('url');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ovas');
    }
};