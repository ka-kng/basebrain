<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\BattingRecord;
use App\Models\Game;
use App\Models\User;

class BattingRecordFactory extends Factory
{
    protected $model = BattingRecord::class;

    public function definition()
    {
        $atBats = $this->faker->numberBetween(1, 5);      // 打数
        $hits = $this->faker->numberBetween(0, $atBats);   // ヒットは打数以下
        $doubles = $this->faker->numberBetween(0, $hits);
        $triples = $this->faker->numberBetween(0, $hits - $doubles);
        $homeRuns = $this->faker->numberBetween(0, $hits - $doubles - $triples);
        $steals = $this->faker->numberBetween(0, 2);
        $caughtStealing = $this->faker->numberBetween(0, $steals);

        return [
            'game_id' => Game::factory(),
            'user_id' => User::factory(),
            'order_no' => $this->faker->numberBetween(1, 9),
            'position' => $this->faker->randomElement(['投手', '捕手', '一塁', '二塁', '三塁', '遊撃', '左翼', '中堅', '右翼']),
            'at_bats' => $atBats,
            'hits' => $hits,
            'doubles' => $doubles,
            'triples' => $triples,
            'home_runs' => $homeRuns,
            'rbis' => $this->faker->numberBetween(0, 5),
            'runs' => $this->faker->numberBetween(0, 5),
            'walks' => $this->faker->numberBetween(0, 2),
            'strikeouts' => $this->faker->numberBetween(0, 5),
            'steals' => $steals,
            'caught_stealing' => $caughtStealing,
            'errors' => $this->faker->numberBetween(0, 2),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
