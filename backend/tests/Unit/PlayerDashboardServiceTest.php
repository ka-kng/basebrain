<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Game;
use App\Models\BattingRecord;
use App\Models\PitchingRecord;
use App\Services\PlayerDashboardService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PlayerDashboardServiceTest extends TestCase
{
    use RefreshDatabase;

    protected PlayerDashboardService $service;
    protected User $user;
    protected Game $game;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = new PlayerDashboardService();

        // テスト用ユーザーと試合を作成
        $this->user = User::factory()->create();
        $this->game = Game::factory()->create();
    }

    // 【テスト内容】ユーザーのダッシュボードデータが正しい構造で返ることを確認
    public function test_get_player_dashboard_data_returns_correct_structure()
    {
        // 打者成績を作成
        BattingRecord::factory()->create([
            'user_id' => $this->user->id,
            'game_id' => $this->game->id,
            'at_bats' => 4,
            'hits' => 2,
            'doubles' => 1,
            'triples' => 0,
            'home_runs' => 1,
            'runs' => 2,
            'rbis' => 3,
            'walks' => 1,
            'strikeouts' => 1,
            'steals' => 1,
            'caught_stealing' => 0,
            'errors' => 0,
        ]);

        // 投手成績を作成
        PitchingRecord::factory()->create([
            'user_id' => $this->user->id,
            'game_id' => $this->game->id,
            'pitching_innings_outs' => 12, // 4回
            'earned_runs' => 2,
            'strikeouts' => 5,
            'hits_allowed' => 4,
            'hr_allowed' => 1,
            'walks_given' => 2,
            'runs_allowed' => 3,
        ]);

        $data = $this->service->getPlayerDashboardData($this->user->id);

        // JSON形式の構造確認
        $this->assertArrayHasKey('games', $data);   // 試合数
        $this->assertArrayHasKey('batting', $data); // 打者成績
        $this->assertArrayHasKey('pitching', $data); // 投手成績

        // 打者成績のキー確認
        $this->assertArrayHasKey('batting_average', $data['batting']);
        $this->assertArrayHasKey('on_base_percentage', $data['batting']);
        $this->assertArrayHasKey('slugging_percentage', $data['batting']);
        $this->assertArrayHasKey('steal_success_rate', $data['batting']);
        $this->assertArrayHasKey('at_bats', $data['batting']);
        $this->assertArrayHasKey('singles', $data['batting']);
        $this->assertArrayHasKey('doubles', $data['batting']);
        $this->assertArrayHasKey('triples', $data['batting']);
        $this->assertArrayHasKey('home_runs', $data['batting']);
        $this->assertArrayHasKey('runs', $data['batting']);
        $this->assertArrayHasKey('rbis', $data['batting']);
        $this->assertArrayHasKey('walks', $data['batting']);
        $this->assertArrayHasKey('steals', $data['batting']);
        $this->assertArrayHasKey('caught_stealing', $data['batting']);
        $this->assertArrayHasKey('strikeouts', $data['batting']);
        $this->assertArrayHasKey('errors', $data['batting']);

        // 投手成績のキー確認
        $this->assertArrayHasKey('era', $data['pitching']);
        $this->assertArrayHasKey('strikeouts', $data['pitching']);
        $this->assertArrayHasKey('hits_allowed', $data['pitching']);
        $this->assertArrayHasKey('hr_allowed', $data['pitching']);
        $this->assertArrayHasKey('walks_given', $data['pitching']);
        $this->assertArrayHasKey('runs_allowed', $data['pitching']);
        $this->assertArrayHasKey('earned_runs', $data['pitching']);

        // 打者成績の計算値確認
        $this->assertEquals('1.000', $data['batting']['batting_average']);
        $this->assertEquals('1.000', $data['batting']['on_base_percentage']);
        $this->assertEquals('2.000', $data['batting']['slugging_percentage']);
        $this->assertEquals('0.000', $data['batting']['steal_success_rate']);

        // 投手成績の計算値確認
        $this->assertEquals('0.50', $data['pitching']['era']);
        $this->assertEquals(5, $data['pitching']['strikeouts']);
        $this->assertEquals(4, $data['pitching']['hits_allowed']);
    }
}
