<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Team;
use App\Models\Game;
use App\Models\PitchingRecord;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PitchingTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $game;
    protected $team;

    protected function setUp(): void
    {
        parent::setUp();

        // チームを作成（外部キー制約対応）
        $this->team = Team::factory()->create();

        // ログインユーザー（選手）を作成
        $this->user = User::factory()->create([
            'role' => 'player',
            'team_id' => $this->team->id,
        ]);

        // ゲームを作成
        $this->game = Game::factory()->create();
    }

    // 投手記録の新規作成テスト
    public function test_store_creates_new_pitching_record()
    {
        $this->actingAs($this->user);

        $payload = [
            'game_id' => $this->game->id,
            'user_id' => $this->user->id,
            'result' => 'win',
            'pitching_innings_outs' => 9,
            'pitches' => 120,
            'strikeouts' => 10,
            'hits_allowed' => 5,
            'hr_allowed' => 1,
            'walks_given' => 2,
            'runs_allowed' => 3,
            'earned_runs' => 2,
        ];

        // POST /api/records/pitching
        $response = $this->postJson('/api/records/pitching', $payload);

        $response->assertStatus(201);

        // DBに登録されているか確認
        $this->assertDatabaseHas('pitching_records', [
            'user_id' => $this->user->id,
            'game_id' => $this->game->id,
        ]);
    }

    // 投手記録の更新テスト
    public function test_update_modifies_existing_pitching_record()
    {
        $this->actingAs($this->user);

        // 既存の投手記録を作成
        $record = PitchingRecord::factory()->create([
            'game_id' => $this->game->id,
            'user_id' => $this->user->id,
            'strikeouts' => 5,
        ]);

        $payload = [
            'game_id' => $this->game->id,
            'user_id' => $this->user->id,
            'result' => 'loss',
            'pitching_innings_outs' => 7,
            'pitches' => 100,
            'strikeouts' => 8, // 更新値
            'hits_allowed' => 6,
            'hr_allowed' => 1,
            'walks_given' => 3,
            'runs_allowed' => 4,
            'earned_runs' => 3,
        ];

        // PUT /api/records/pitching/{id}
        $response = $this->putJson("/api/records/pitching/{$record->id}", $payload);

        $response->assertStatus(200);

        // DBに反映されているか確認
        $this->assertDatabaseHas('pitching_records', [
            'id' => $record->id,
            'strikeouts' => 8,
        ]);
    }

    // 投手記録の削除テスト
    public function test_destroy_deletes_pitching_record()
    {
        $this->actingAs($this->user);

        // 投手記録作成
        $record = PitchingRecord::factory()->create([
            'game_id' => $this->game->id,
            'user_id' => $this->user->id,
        ]);

        // DELETE /api/records/pitching/{id}
        $response = $this->deleteJson("/api/records/pitching/{$record->id}");

        $response->assertNoContent();

        // DBから削除されているか確認
        $this->assertDatabaseMissing('pitching_records', [
            'id' => $record->id,
        ]);
    }
}
