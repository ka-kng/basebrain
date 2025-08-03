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
        Schema::create('pitching_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('result', 20)->nullable();
            $table->unsignedInteger('pitching_innings_outs')->default(0);
            $table->unsignedSmallInteger('pitches')->default(0);
            $table->unsignedInteger('strikeouts')->default(0);
            $table->unsignedInteger('hits_allowed')->default(0);
            $table->unsignedInteger('hr_allowed')->default(0);
            $table->unsignedInteger('walks_given')->default(0);
            $table->unsignedInteger('runs_allowed')->default(0);
            $table->unsignedInteger('earned_runs')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pitching_records');
    }
};
