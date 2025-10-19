<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Game;
use App\Models\BattingRecord;
use App\Models\PitchingRecord;
use App\Services\PlayerRankingService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PlayerRankingServiceTest extends TestCase
{
    use RefreshDatabase;

    protected PlayerRankingService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PlayerRankingService();
    }

    // 打者ランキングが指標ごとに正しく計算・ソートされることを確認
    public function test_batting_ranking_returns_correct_values()
    {
        // ユーザーと試合作成
        $user1 = User::factory()->create(['name' => 'Alice']);
        $user2 = User::factory()->create(['name' => 'Bob']);
        $user3 = User::factory()->create(['name' => 'Charlie']);
        $game = Game::factory()->create();

        // 打者成績を作成
        BattingRecord::factory()->create([
            'user_id' => $user1->id,
            'game_id' => $game->id,
            'hits' => 2,
            'doubles' => 1,
            'triples' => 0,
            'home_runs' => 1,
            'at_bats' => 4,
            'walks' => 1,
            'rbis' => 3,
            'caught_stealing' => 0,
        ]);

        BattingRecord::factory()->create([
            'user_id' => $user2->id,
            'game_id' => $game->id,
            'hits' => 1,
            'doubles' => 0,
            'triples' => 0,
            'home_runs' => 0,
            'at_bats' => 3,
            'walks' => 0,
            'rbis' => 1,
            'caught_stealing' => 1,
        ]);

        BattingRecord::factory()->create([
            'user_id' => $user3->id,
            'game_id' => $game->id,
            'hits' => 0,
            'doubles' => 0,
            'triples' => 0,
            'home_runs' => 0,
            'at_bats' => 2,
            'walks' => 1,
            'rbis' => 0,
            'caught_stealing' => 0,
        ]);

        // サービス呼び出し
        $ranking = $this->service->getBattingRanking();

        // 打者ランキングの確認

        // 打率ランキング：最も打率が高いユーザーがトップ
        $this->assertEquals('Alice', $ranking['avg'][0]['name']);

        // 出塁率ランキング：最も出塁率が高いユーザーがトップ
        $this->assertEquals('Alice', $ranking['obp'][0]['name']);

        // 安打数ランキング：最もヒットが多いユーザーがトップ
        $this->assertEquals('Alice', $ranking['hits'][0]['name']);

        // ホームランランキング：最も本塁打が多いユーザーがトップ
        $this->assertEquals('Alice', $ranking['home_runs'][0]['name']);

        // 打点ランキング：最も打点が多いユーザーがトップ
        $this->assertEquals('Alice', $ranking['rbis'][0]['name']);

        // 盗塁死ランキング：最も盗塁死が多いユーザーがトップ
        $this->assertEquals('Bob', $ranking['caught_stealing'][0]['name']);
    }

    //投手ランキングが指標ごとに正しく計算・ソートされることを確認
    public function test_pitching_ranking_returns_correct_values()
    {
        // 準備: ユーザーと試合作成
        $user1 = User::factory()->create(['name' => 'Alice']);
        $user2 = User::factory()->create(['name' => 'Bob']);
        $user3 = User::factory()->create(['name' => 'Charlie']);
        $game = Game::factory()->create();

        // 投手成績を作成
        PitchingRecord::factory()->create([
            'user_id' => $user1->id,
            'game_id' => $game->id,
            'pitching_innings_outs' => 9, // 3回
            'earned_runs' => 1,
            'strikeouts' => 5,
            'result' => '勝利',
        ]);

        PitchingRecord::factory()->create([
            'user_id' => $user2->id,
            'game_id' => $game->id,
            'pitching_innings_outs' => 12, // 4回
            'earned_runs' => 2,
            'strikeouts' => 3,
            'result' => '敗北',
        ]);

        PitchingRecord::factory()->create([
            'user_id' => $user3->id,
            'game_id' => $game->id,
            'pitching_innings_outs' => 6, // 2回
            'earned_runs' => 0,
            'strikeouts' => 1,
            'result' => '勝利',
        ]);

        // サービス呼び出し
        $ranking = $this->service->getPitchingRanking();

        // 投手ランキングの確認
        // 防御率ランキング（ERAが小さい順）：最もERAが低いユーザーがトップ
        $this->assertEquals('Charlie', $ranking['era'][0]['name']);

        // 勝利数ランキング：勝利数が最も多いユーザーが上位
        $this->assertEquals(1, $ranking['wins'][0]['wins']);

        // 奪三振ランキング：最も奪三振が多いユーザーがトップ
        $this->assertEquals('Alice', $ranking['strikeouts'][0]['name']);
    }
}
