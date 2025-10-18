<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\GameStatsService;
use App\Models\Game;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;

class GameStatsServiceTest extends TestCase
{
    use RefreshDatabase;

    protected GameStatsService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new GameStatsService();
    }

    // 【テスト内容】
    // formatBatting() が打率・出塁率・長打率・OPSなどを正しく計算するかを検証

    /** @test */
    public function format_batting_calculates_correctly()
    {
        $batters = collect([
            (object)[
                'id' => 1,
                'user' => (object)['name' => 'Player1'],
                'order_no' => 1,
                'position' => 'CF',
                'at_bats' => 4,
                'hits' => 2,
                'doubles' => 1,
                'triples' => 0,
                'home_runs' => 1,
                'rbis' => 3,
                'runs' => 2,
                'walks' => 1,
                'strikeouts' => 1,
                'steals' => 1,
                'caught_stealing' => 0,
                'errors' => 0,
            ],
        ]);

        $formatted = $this->service->formatBatting($batters)->first();

        $this->assertEquals('1.000', $formatted['batting_average']);       // 打率
        $this->assertEquals('1.000', $formatted['on_base_percentage']);    // 出塁率
        $this->assertEquals('0.000', $formatted['steal_success_rate']);    // 盗塁成功率
        $this->assertEquals('2.000', $formatted['slugging']);              // 長打率
        $this->assertEquals('3.000', $formatted['ops']);                   // OPS
    }

    // 【テスト内容】
    // formatPitching() が防御率・奪三振率・与四死球率などを正しく計算するかを検証

    /** @test */
    public function format_pitching_calculates_correctly()
    {
        $pitchers = collect([
            (object)[
                'id' => 1,
                'user' => (object)['name' => 'Pitcher1'],
                'result' => '勝利',
                'pitching_innings_outs' => 15, // 5回
                'pitches' => 80,
                'strikeouts' => 6,
                'hits_allowed' => 4,
                'hr_allowed' => 1,
                'walks_given' => 2,
                'runs_allowed' => 3,
                'earned_runs' => 3,
            ],
        ]);

        $formatted = $this->service->formatPitching($pitchers)->first();

        $this->assertEquals('5', $formatted['formatted_innings']);  // 投球回表示
        $this->assertEquals('5.40', $formatted['era']);             // 防御率
        $this->assertEquals('10.80', $formatted['k9']);             // 奪三振率
        $this->assertEquals('3.60', $formatted['bb9']);             // 与四死球率
    }

    // 【テスト内容】
    // formatGame() がゲーム情報と野手・投手成績をまとめた構造を正しく返すかを検証

    /** @test */
    public function format_game_returns_correct_structure()
    {
        $game = Game::factory()->create();

        // ダミー成績を関連付け
        $game->setRelation('battingRecords', collect());
        $game->setRelation('pitchingRecords', collect());
        $game->setRelation('team', (object)['name' => 'Test Team']);

        $formatted = $this->service->formatGame($game);

        $this->assertArrayHasKey('batting_records', $formatted);   // 野手成績がある
        $this->assertArrayHasKey('pitching_records', $formatted);  // 投手成績がある
        $this->assertEquals('Test Team', $formatted['team']['name']); // チーム名が正しい
    }
}
