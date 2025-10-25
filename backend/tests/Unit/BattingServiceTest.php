<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Game;
use App\Models\BattingRecord;
use App\Services\BattingService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BattingServiceTest extends TestCase
{
    use RefreshDatabase;

    protected BattingService $service;
    protected User $user;
    protected Game $game;

    protected function setUp(): void
    {
        parent::setUp();

        // BattingService インスタンス作成
        $this->service = new BattingService();

        // テスト用のユーザーと試合を作成
        $this->user = User::factory()->create();
        $this->game = Game::factory()->create();
    }

    // 【テスト内容】新しい打撃記録が正しくDBに作成されること
    public function test_store_creates_a_new_batting_record()
    {
        $data = [
            'game_id' => $this->game->id,
            'user_id' => $this->user->id,
            'order_no' => 1,
            'position' => '一塁',
            'at_bats' => 3,
            'hits' => 1,
            'doubles' => 0,
            'triples' => 0,
            'home_runs' => 0,
            'rbis' => 1,
            'runs' => 0,
            'walks' => 0,
            'strikeouts' => 1,
            'steals' => 0,
            'caught_stealing' => 0,
            'errors' => 0,
        ];

        $record = $this->service->store($data);

        // DBに保存されていることを確認
        $this->assertDatabaseHas('batting_records', [
            'id' => $record->id,
            'game_id' => $this->game->id,
            'user_id' => $this->user->id,
            'position' => '一塁',
        ]);
    }

    // 【テスト内容】既存の打撃記録が update により正しく更新されること
    public function test_update_modifies_existing_batting_record()
    {
        $record = BattingRecord::factory()->create([
            'game_id' => $this->game->id,
            'user_id' => $this->user->id,
            'hits' => 1,
        ]);

        $updatedData = [
            'hits' => 3,
            'home_runs' => 1,
        ];

        $updated = $this->service->update($record->id, $updatedData);

        // 値が正しく更新されているか確認
        $this->assertEquals(3, $updated->hits);
        $this->assertEquals(1, $updated->home_runs);

        // DBに反映されていることを確認
        $this->assertDatabaseHas('batting_records', [
            'id' => $record->id,
            'hits' => 3,
            'home_runs' => 1,
        ]);
    }

    // 【テスト内容】打撃記録が destroy により削除されること
    public function test_destroy_deletes_batting_record()
    {
        $record = BattingRecord::factory()->create([
            'game_id' => $this->game->id,
            'user_id' => $this->user->id,
        ]);

        $this->service->destroy($record->id);

        // DBからレコードが消えていることを確認
        $this->assertDatabaseMissing('batting_records', [
            'id' => $record->id,
        ]);
    }
}
