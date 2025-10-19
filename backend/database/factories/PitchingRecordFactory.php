<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\PitchingRecord;
use App\Models\Game;
use App\Models\User;

class PitchingRecordFactory extends Factory
{
    // このファクトリが作るモデル
    protected $model = PitchingRecord::class;

    public function definition()
    {
        $outs = $this->faker->numberBetween(3, 27); // 投球アウト数（1回=3アウト）
        $strikeouts = $this->faker->numberBetween(0, $outs);
        $hitsAllowed = $this->faker->numberBetween(0, $outs);
        $walksGiven = $this->faker->numberBetween(0, 5);
        $earnedRuns = $this->faker->numberBetween(0, 10);

        return [
            'game_id' => Game::factory(),
            'user_id' => User::factory(),
            'result' => $this->faker->randomElement(['勝利', '敗北', '引き分け']),
            'pitching_innings_outs' => $outs,
            'pitches' => $this->faker->numberBetween(30, 150),
            'strikeouts' => $strikeouts,
            'hits_allowed' => $hitsAllowed,
            'hr_allowed' => $this->faker->numberBetween(0, 5),
            'walks_given' => $walksGiven,
            'runs_allowed' => $this->faker->numberBetween(0, 10),
            'earned_runs' => $earnedRuns,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
