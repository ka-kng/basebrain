<?php

namespace App\Http\Controllers\Records;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;

class SummaryController extends Controller
{
    // 試合の概要と出場選手の名前一覧を取得
    public function summaryResult(Request $request)
    {
        // Reactから送られたgame_idを取得
        $game_id = $request->query('game_id');

        // Gameモデルを取得
        $game = Game::find($game_id);

        if (!$game) {
            return response()->json(['error' => '試合が見つかりません'], 404);
        }

         // JSONでレスポンスを返す
        $batters = $game->battingRecords()->with('user')->get()->map(fn($r) => $r->user->name);
        $pitchers = $game->pitchingRecords()->with('user')->get()->map(fn($r) => $r->user->name);

        return response()->json([
            'game' => [
                'date' => $game->date->format('Y-m-d'),
                'game_type' => $game->game_type,
                'tournament' => $game->tournament,
                'opponent' => $game->opponent,
                'team_score' => $game->team_score,
                'opponent_score' => $game->opponent_score,
                'result' => $game->result,
                'memo' => $game->memo,
            ],
            'batters' => $batters,
            'pitchers' => $pitchers,
        ]);
    }
}
