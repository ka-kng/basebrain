<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\Team;
use App\Models\User;
use App\Models\BattingRecord;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BattingTest extends TestCase
{
    use RefreshDatabase;

    protected User $player;
    protected Game $game;
    protected Team $team;

    protected function setUp(): void
    {
        parent::setUp();

        // テスト用チーム
        $this->team = Team::factory()->create();

        // プレイヤー作成
        $this->player = User::factory()->create([
            'team_id' => $this->team->id,
            'role' => 'player',
        ]);

        // ゲーム作成（チームIDが必要）
        $this->game = Game::factory()->create([
            'team_id' => $this->team->id,
        ]);
    }

    // 打撃記録を作成
    public function test_store_creates_a_new_batting_record(): void
    {
        $payload = [
            'game_id' => $this->game->id,
            'user_id' => $this->player->id,
            'order_no' => 1,
            'position' => '投手',
            'at_bats' => 3,
            'hits' => 2,
            'doubles' => 1,
            'triples' => 0,
            'home_runs' => 0,
            'rbis' => 1,
            'runs' => 1,
            'walks' => 0,
            'strikeouts' => 1,
            'steals' => 0,
            'caught_stealing' => 0,
            'errors' => 0,
        ];

        $response = $this->actingAs($this->player, 'sanctum')
            ->postJson('/api/records/batting', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'user_id' => $this->player->id,
                'game_id' => $this->game->id,
            ]);

        $this->assertDatabaseHas('batting_records', [
            'user_id' => $this->player->id,
            'game_id' => $this->game->id,
            'order_no' => 1,
        ]);
    }

    // 打撃記録を更新
    public function test_update_modifies_existing_batting_record(): void
    {
        $record = BattingRecord::factory()->create([
            'game_id' => $this->game->id,
            'user_id' => $this->player->id,
            'order_no' => 1,
            'position' => '投手',
        ]);

        $payload = [
            'game_id' => $this->game->id,
            'user_id' => $this->player->id,
            'order_no' => 2,
            'position' => '投手',
            'at_bats' => 4,
            'hits' => 3,
            'doubles' => 0,
            'triples' => 0,
            'home_runs' => 1,
            'rbis' => 2,
            'runs' => 1,
            'walks' => 1,
            'strikeouts' => 0,
            'steals' => 1,
            'caught_stealing' => 0,
            'errors' => 0,
        ];

        $response = $this->actingAs($this->player, 'sanctum')
            ->putJson("/api/records/batting/{$record->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'order_no' => 2,
                'position' => '投手',
                'home_runs' => 1,
            ]);

        $this->assertDatabaseHas('batting_records', [
            'id' => $record->id,
            'order_no' => 2,
            'position' => '投手',
        ]);
    }

    // 打撃記録を削除
    public function test_destroy_removes_batting_record(): void
    {
        $record = BattingRecord::factory()->create([
            'game_id' => $this->game->id,
            'user_id' => $this->player->id,
        ]);

        $response = $this->actingAs($this->player, 'sanctum')
            ->deleteJson("/api/records/batting/{$record->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('batting_records', [
            'id' => $record->id,
        ]);
    }
}
