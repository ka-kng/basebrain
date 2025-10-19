<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Team;
use App\Models\Game;
use App\Models\BattingRecord;
use App\Models\PitchingRecord;
use App\Services\ManagerDashboardService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ManagerDashboardServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ManagerDashboardService $service;
    protected Team $team;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ManagerDashboardService();

        // テスト用チーム作成
        $this->team = Team::factory()->create();
    }

    // 【テスト内容】getDashboardData が正しい構造を返すこと
    // games, teamInfo, battingTotals, pitchingTotals が含まれているか確認
    public function test_getDashboardData_returns_correct_structure()
    {
        $game = Game::factory()->create([
            'team_id' => $this->team->id,
            'result' => '勝利',
            'team_score' => 5,
            'opponent_score' => 3,
        ]);

        $batting = BattingRecord::factory()->create([
            'game_id' => $game->id,
            'at_bats' => 4,
            'hits' => 2,
            'doubles' => 1,
            'triples' => 0,
            'home_runs' => 1,
            'walks' => 1,
        ]);

        $pitching = PitchingRecord::factory()->create([
            'game_id' => $game->id,
            'pitching_innings_outs' => 15,
            'earned_runs' => 3,
            'strikeouts' => 5,
            'walks_given' => 2,
        ]);

        $dashboard = $this->service->getDashboardData($this->team->id);

        // 配列構造が正しいことを確認
        $this->assertArrayHasKey('games', $dashboard);
        $this->assertArrayHasKey('teamInfo', $dashboard);
        $this->assertArrayHasKey('battingTotals', $dashboard);
        $this->assertArrayHasKey('pitchingTotals', $dashboard);
    }

    // 【テスト内容】打撃成績が正しく集計されているか確認
    public function test_batting_totals_are_calculated_correctly()
    {

        $game = Game::factory()->create(['team_id' => $this->team->id]);

        BattingRecord::factory()->create([
            'game_id' => $game->id,
            'at_bats' => 4,
            'hits' => 2,
            'doubles' => 1,
            'triples' => 0,
            'home_runs' => 1,
            'walks' => 1,
        ]);

        $totals = $this->service->getDashboardData($this->team->id)['battingTotals'];

        // 合計値や計算指標の確認
        $this->assertEquals(4, $totals['at_bats']);
        $this->assertEquals(2, $totals['hits']);
        $this->assertEquals(1, $totals['doubles']);
        $this->assertEquals(1.0, $totals['average']); // 打率計算
        $this->assertEquals(1.0, $totals['obp']);     // 出塁率計算
    }

    // 【テスト内容】投手成績が正しく集計されているか確認
    public function test_pitching_totals_are_calculated_correctly()
    {

        $game = Game::factory()->create(['team_id' => $this->team->id]);

        PitchingRecord::factory()->create([
            'game_id' => $game->id,
            'pitching_innings_outs' => 15,
            'earned_runs' => 3,
            'strikeouts' => 5,
            'walks_given' => 2,
        ]);

        $totals = $this->service->getDashboardData($this->team->id)['pitchingTotals'];

        // 投球回と防御率の確認
        $this->assertEquals(15, $totals['pitching_innings_outs']);
        $this->assertEquals('5.40', $totals['era']); // 防御率計算
    }

    // 【テスト内容】試合の勝敗集計が正しく計算されているか確認
    public function test_team_info_counts_are_correct()
    {

        Game::factory()->create([
            'team_id' => $this->team->id,
            'result' => '勝利',
        ]);
        Game::factory()->create([
            'team_id' => $this->team->id,
            'result' => '敗北',
        ]);
        Game::factory()->create([
            'team_id' => $this->team->id,
            'result' => '引き分け',
        ]);

        $teamInfo = $this->service->getDashboardData($this->team->id)['teamInfo'];

        $this->assertEquals(3, $teamInfo['totalGames']);
        $this->assertEquals(1, $teamInfo['wins']);
        $this->assertEquals(1, $teamInfo['loses']);
        $this->assertEquals(1, $teamInfo['draws']);
        $this->assertEquals('33.3%', $teamInfo['winRatePercent']); // 勝率計算
    }
}
