<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Game;
use App\Models\PitchingRecord;
use App\Services\PitchingService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PitchingServiceTest extends TestCase
{
    use RefreshDatabase;

    protected PitchingService $service;
    protected User $user;
    protected Game $game;

    protected function setUp(): void
    {
        parent::setUp();

        // PitchingService のインスタンス作成
        $this->service = new PitchingService();

        // テスト用のユーザーと試合を作成
        $this->user = User::factory()->create();
        $this->game = Game::factory()->create();
    }

    // 【テスト内容】新しい投手記録が正しくDBに作成されること
    public function test_store_creates_a_new_pitching_record()
    {
        $data = [
            'game_id' => $this->game->id,
            'user_id' => $this->user->id,
            'result' => '勝利',
            'pitching_innings_outs' => 15, // 5回
            'pitches' => 80,
            'strikeouts' => 6,
            'hits_allowed' => 4,
            'hr_allowed' => 1,
            'walks_given' => 2,
            'runs_allowed' => 3,
            'earned_runs' => 3,
        ];

        $record = $this->service->store($data);

        // DBに保存されていることを確認
        $this->assertDatabaseHas('pitching_records', [
            'id' => $record->id,
            'game_id' => $this->game->id,
            'user_id' => $this->user->id,
            'result' => '勝利',
        ]);
    }

    // 【テスト内容】既存の投手記録が update により正しく更新されること
    public function test_update_modifies_existing_pitching_record()
    {
        $record = PitchingRecord::factory()->create([
            'game_id' => $this->game->id,
            'user_id' => $this->user->id,
            'runs_allowed' => 3,
        ]);

        $updatedData = [
            'runs_allowed' => 1,
            'strikeouts' => 8,
        ];

        $updated = $this->service->update($record->id, $updatedData);

        // 値が正しく更新されているか確認
        $this->assertEquals(1, $updated->runs_allowed);
        $this->assertEquals(8, $updated->strikeouts);

        // DBに反映されていることを確認
        $this->assertDatabaseHas('pitching_records', [
            'id' => $record->id,
            'runs_allowed' => 1,
            'strikeouts' => 8,
        ]);
    }

    // 【テスト内容】投手記録が delete により削除されること
    public function test_delete_removes_pitching_record()
    {
        $record = PitchingRecord::factory()->create([
            'game_id' => $this->game->id,
            'user_id' => $this->user->id,
        ]);

        $this->service->delete($record->id);

        // DBからレコードが消えていることを確認
        $this->assertDatabaseMissing('pitching_records', [
            'id' => $record->id,
        ]);
    }
}
