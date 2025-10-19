<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GameTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Team $team;

    protected function setUp(): void
    {
        parent::setUp();

        // テスト用チーム
        $this->team = Team::factory()->create();

        // ログインユーザー（コーチ）
        $this->user = User::factory()->create([
            'team_id' => $this->team->id,
            'role' => 'coach',
        ]);
    }

    // 登録テスト
    public function test_store_creates_a_new_game(): void
    {
        $payload = [
            'game_type' => '練習試合',
            'tournament' => '秋季大会',
            'opponent' => '相手チーム',
            'date' => '2025-10-20',
            'team_score' => 3,
            'opponent_score' => 2,
            'result' => 'win',
            'memo' => 'テストメモ',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/games', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'team_id' => $this->team->id,
                'opponent' => '相手チーム',
            ]);

        $this->assertDatabaseHas('games', [
            'team_id' => $this->team->id,
            'opponent' => '相手チーム',
        ]);
    }

    // 更新テスト
    public function test_update_modifies_existing_game(): void
    {
        $game = Game::factory()->create([
            'team_id' => $this->team->id,
            'opponent' => '旧チーム',
            'game_type' => '練習試合',
        ]);

        $payload = [
            'game_type' => '公式戦',
            'tournament' => '秋季大会',
            'opponent' => '新チーム',
            'date' => '2025-10-20',
            'team_score' => 3,
            'opponent_score' => 2,
            'result' => '勝利',
            'memo' => 'テストメモ',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/games/{$game->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'opponent' => '新チーム',
                'game_type' => '公式戦',
            ]);

        $this->assertDatabaseHas('games', [
            'id' => $game->id,
            'opponent' => '新チーム',
            'game_type' => '公式戦',
        ]);
    }

    // 削除テスト
    public function test_destroy_removes_game(): void
    {
        $game = Game::factory()->create([
            'team_id' => $this->team->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/games/{$game->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('games', [
            'id' => $game->id,
        ]);
    }
}
