<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('ovas', function (Blueprint $table) {
            $table->unique('tematica');
            $table->unique('url')->whereNotNull('url');
        });
    }

    public function down()
    {
        Schema::table('ovas', function (Blueprint $table) {
            $table->dropUnique(['tematica']);
            $table->dropUnique(['url']);
        });
    }
};