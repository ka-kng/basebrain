<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // チーム用
    public function index(Request $request)
    {
        $user = $request->user();

        $games = DB::table('games')
            ->where('team_id', $user->team_id)
            ->get();

        $battingRecords = DB::table('batting_records')
            ->join('games', 'batting_records.game_id', '=', 'games.id')
            ->where('games.team_id', $user->team_id)
            ->select('batting_records.*')
            ->get();

        $pitchingRecords = DB::table('pitching_records')
            ->join('games', 'pitching_records.game_id', '=', 'games.id')
            ->where('games.team_id', $user->team_id)
            ->select('pitching_records.*')
            ->get();

        return response()->json([
            'games' => $games,
            'battingRecords' => $battingRecords,
            'pitchingRecords' => $pitchingRecords,
        ]);
    }

    // プレイヤー用
    public function playerDashboard(Request $request)
    {
        $user = $request->user();

        // ログイン中の自分のゲーム（参加しているゲームだけ）
        $games = DB::table('games')
            ->join('batting_records', 'games.id', '=', 'batting_records.game_id')
            ->where('batting_records.user_id', $user->id) // ← player_id → user_id に変更
            ->select('games.*')
            ->get();

        // 自分の打者成績
        $battingRecords = DB::table('batting_records')
            ->where('user_id', $user->id)
            ->get();

        // 自分の投手成績
        $pitchingRecords = DB::table('pitching_records')
            ->where('user_id', $user->id)
            ->get();

        return response()->json([
            'games' => $games,
            'battingRecords' => $battingRecords,
            'pitchingRecords' => $pitchingRecords,
        ]);
    }
}
