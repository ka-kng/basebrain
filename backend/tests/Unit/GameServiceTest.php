<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\GameService;
use App\Models\User;
use App\Models\Team;
use App\Models\Game;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;

class GameServiceTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Team $team;
    protected GameService $service;

    protected function setUp(): void
    {
        parent::setUp();

        // チームとユーザー作成
        $this->team = Team::factory()->create();
        $this->user = User::factory()->create([
            'team_id' => $this->team->id,
        ]);

        // ログインユーザーとしてセット
        Auth::login($this->user);

        $this->service = new GameService();
    }

    // 【テスト内容】
    // ログイン中のユーザーの team_id が自動セットされること
    // 必須カラムを渡すことでゲームが作成されることを確認

    /** @test */
    public function test_create_game()
    {
        $data = [
            'game_type' => '公式戦',
            'tournament' => '練習試合',
            'opponent' => '○○高等学校',
            'date' => '2025-10-17',
            'team_score' => 1,
            'opponent_score' => 3,
            'result' => '敗北',
            'memo' => null,
        ];

        $game = $this->service->createGame($data);

        $this->assertDatabaseHas('games', [
            'id' => $game->id,
            'team_id' => $this->team->id,
            'game_type' => '公式戦',
            'opponent' => '○○高等学校',
        ]);
    }

    // 【テスト内容】
    // ログインユーザーのチームに紐づくゲームだけが更新できることを確認
    // 更新後の値が正しく反映されていることをDBで検証

    /** @test */
    public function test_update_game()
    {
        $game = Game::factory()->create([
            'team_id' => $this->team->id,
        ]);

        $updatedData = [
            'game_type' => '練習試合',
            'opponent' => '別チーム',
            'team_score' => 5,
            'opponent_score' => 2,
            'result' => '勝利',
        ];

        $updatedGame = $this->service->updateGame($game->id, $updatedData);

        $this->assertEquals('練習試合', $updatedGame->game_type);
        $this->assertEquals('別チーム', $updatedGame->opponent);
        $this->assertDatabaseHas('games', [
            'id' => $game->id,
            'opponent' => '別チーム',
        ]);
    }

    // 【テスト内容】
    // 他チームのゲームを更新しようとすると ModelNotFoundException が投げられることを確認

    /** @test */
    public function test_update_game_not_belonging_to_team_fails()
    {
        $otherTeam = Team::factory()->create();

        $game = Game::factory()->create([
            'team_id' => $otherTeam->id,
        ]);

        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);

        $this->service->updateGame($game->id, [
            'game_type' => '練習試合',
            'opponent' => 'Fail Team',
            'team_score' => 0,
            'opponent_score' => 0,
            'result' => '敗北',
        ]);
    }

    // 【テスト内容】
    // ログインユーザーのチームに紐づくゲームが削除できることを確認
    // 削除後にDBに存在しないことを検証

    /** @test */
    public function test_delete_game()
    {
        $game = Game::factory()->create([
            'team_id' => $this->team->id,
        ]);

        $result = $this->service->deleteGame($game->id);

        $this->assertDatabaseMissing('games', [
            'id' => $game->id,
        ]);

        $this->assertNull($result);
    }

    // 【テスト内容】
    // 他チームのゲームを削除しようとすると ModelNotFoundException が投げられることを確認

    /** @test */
    public function test_delete_game_not_belonging_to_team_fails()
    {
        $otherTeam = Team::factory()->create();

        $game = Game::factory()->create([
            'team_id' => $otherTeam->id,
        ]);

        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);

        $this->service->deleteGame($game->id);
    }

}
