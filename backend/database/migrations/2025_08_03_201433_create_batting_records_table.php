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
        Schema::create('batting_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedTinyInteger('order_no')->default(0);
            $table->string('position', 20)->nullable();
            $table->unsignedTinyInteger('at_bats')->default(0);
            $table->unsignedTinyInteger('hits')->default(0);
            $table->unsignedTinyInteger('rbis')->default(0);
            $table->unsignedTinyInteger('runs')->default(0);
            $table->unsignedTinyInteger('walks')->default(0);
            $table->unsignedTinyInteger('strikeouts')->default(0);
            $table->unsignedTinyInteger('steals')->default(0);
            $table->unsignedTinyInteger('caught_stealing')->default(0);
            $table->unsignedTinyInteger('errors')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batting_records');
    }
};
