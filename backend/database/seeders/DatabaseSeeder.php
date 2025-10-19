<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Team;
use App\Models\User;
use App\Models\Game;
use App\Models\BattingRecord;
use App\Models\PitchingRecord;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ---------------------------
        // 1. チーム作成
        // ---------------------------
        $team = Team::factory()->create([
            'name' => 'サンプルチーム',
        ]);

        // ---------------------------
        // 2. コーチ作成
        // ---------------------------
        $coach = User::factory()->create([
            'name' => 'テストコーチ',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'role' => 'coach',
            'team_id' => $team->id,
        ]);

        // ---------------------------
        // 3. プレイヤー20人作成
        // ---------------------------
        $players = User::factory(20)->create([
            'role' => 'player',
            'team_id' => $team->id,
        ]);

        // ---------------------------
        // 4. ゲーム5試合作成
        // ---------------------------
        $games = Game::factory(5)->create([
            'team_id' => $team->id,
        ]);

        // ---------------------------
        // 5. 各ゲームに対して成績作成
        // ---------------------------
        foreach ($games as $game) {
            foreach ($players as $player) {
                // 野手成績
                BattingRecord::factory()->create([
                    'game_id' => $game->id,
                    'user_id' => $player->id,
                ]);

                // 投手成績
                PitchingRecord::factory()->create([
                    'game_id' => $game->id,
                    'user_id' => $player->id,
                ]);
            }
        }
    }
}
