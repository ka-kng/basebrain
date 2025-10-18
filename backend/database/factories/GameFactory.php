<?php

namespace Database\Factories;

use App\Models\Game;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Game>
 */
class GameFactory extends Factory
{
    protected $model = Game::class;

    public function definition(): array
    {
        return [
            'team_id' => Team::factory(), // 新しいチームを自動生成
            'game_type' => $this->faker->randomElement(['公式戦', '練習試合']),
            'tournament' => $this->faker->sentence(2),
            'opponent' => $this->faker->company,
            'date' => $this->faker->date(),
            'team_score' => $this->faker->numberBetween(0, 10),
            'opponent_score' => $this->faker->numberBetween(0, 10),
            'result' => $this->faker->randomElement(['勝利', '敗北', '引き分け']),
            'memo' => $this->faker->optional()->text(50),
        ];
    }
}
