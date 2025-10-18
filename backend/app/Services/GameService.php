<?php

namespace App\Services;

use App\Models\Game;
use Illuminate\Support\Facades\Auth;

class GameService
{
    // チームIDに紐づく試合一覧取得
    public function listGames()
    {
        $teamId = Auth::user()->team_id;

        // team_id が一致する試合を取得し、チーム情報も同時にロード
        return Game::with('team')
            ->where('team_id', $teamId)
            ->orderBy('id', 'desc')
            ->get();
    }

    // 試合新規作成
    public function createGame(array $data)
    {
        // 作成時にログインユーザーの team_id をセット
        $data['team_id'] = Auth::user()->team_id;
        return Game::create($data);
    }

    // 詳細取得
    public function getGame(string $id)
    {
        // 試合情報とチーム、打撃・投球記録のユーザー情報もロード
        return Game::with([
            'team',
            'battingRecords.user',
            'pitchingRecords.user'
        ])->findOrFail($id);
    }

    // 試合更新
    public function updateGame(string $id, array $data)
    {
        $teamId = Auth::user()->team_id;

        // 該当チームの試合のみ更新可能
        $game = Game::where('id', $id)->where('team_id', $teamId)->firstOrFail();

        $game->update($data);
        return $game;
    }

    // 削除
    public function deleteGame(string $id)
    {
        $teamId = Auth::user()->team_id;

        // 該当チームの試合のみ削除可能
        $game = Game::where('id', $id)->where('team_id', $teamId)->firstOrFail();

        $game->delete();
        return null;
    }
}
