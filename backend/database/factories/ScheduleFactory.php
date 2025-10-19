<?php

namespace Database\Factories;

use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduleFactory extends Factory
{
    protected $model = Schedule::class;

    public function definition()
    {
        return [
            'team_id' => 1,
            'date' => $this->faker->date(),
            'type' => $this->faker->word(),
            'time' => $this->faker->time(),
            'location' => $this->faker->city(),
            'note' => $this->faker->sentence(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
