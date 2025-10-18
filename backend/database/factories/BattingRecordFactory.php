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
        return [
            'game_id' => Game::factory(),   // ここでGameも同時に作れる
            'user_id' => User::factory(),   // ここでUserも同時に作れる
            'order_no' => $this->faker->numberBetween(1, 9),
            'position' => $this->faker->randomElement(['投手','捕手','一塁','二塁','三塁','遊撃','左翼','中堅','右翼']),
            'at_bats' => $this->faker->numberBetween(0, 5),
            'hits' => $this->faker->numberBetween(0, 5),
            'doubles' => $this->faker->numberBetween(0, 2),
            'triples' => $this->faker->numberBetween(0, 1),
            'home_runs' => $this->faker->numberBetween(0, 2),
            'rbis' => $this->faker->numberBetween(0, 5),
            'runs' => $this->faker->numberBetween(0, 5),
            'walks' => $this->faker->numberBetween(0, 3),
            'strikeouts' => $this->faker->numberBetween(0, 5),
            'steals' => $this->faker->numberBetween(0, 2),
            'caught_stealing' => $this->faker->numberBetween(0, 1),
            'errors' => $this->faker->numberBetween(0, 2),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
