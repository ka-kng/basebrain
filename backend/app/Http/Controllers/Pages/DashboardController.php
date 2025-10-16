<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // 管理者用　チームの情報を取得
    public function index(Request $request)
    {
        $user = $request->user();

        // チームの全試合を取得
        $games = DB::table('games')
            ->where('team_id', $user->team_id)
            ->get();

        // チームの全打者成績を取得
        $battingRecords = DB::table('batting_records')
            ->join('games', 'batting_records.game_id', '=', 'games.id')
            ->where('games.team_id', $user->team_id)
            ->select('batting_records.*')
            ->get();

        // チームの全投手成績を取得
        $pitchingRecords = DB::table('pitching_records')
            ->join('games', 'pitching_records.game_id', '=', 'games.id')
            ->where('games.team_id', $user->team_id)
            ->select('pitching_records.*')
            ->get();

        // JSON形式で返却
        return response()->json([
            'games' => $games,
            'battingRecords' => $battingRecords,
            'pitchingRecords' => $pitchingRecords,
        ]);
    }

    // プレイヤー用　プレイヤー個人の情報を取得
    public function playerDashboard(Request $request)
    {
        $user = $request->user();

        // 自分が参加した試合のみ取得
        $games = DB::table('games')
            ->join('batting_records', 'games.id', '=', 'batting_records.game_id')
            ->where('batting_records.user_id', $user->id)
            ->select('games.*')
            ->get();

        // 自分の打者成績を取得
        $battingRecords = DB::table('batting_records')
            ->where('user_id', $user->id)
            ->get();

        // 自分の投手成績を取得
        $pitchingRecords = DB::table('pitching_records')
            ->where('user_id', $user->id)
            ->get();

        // JSON形式で返却
        return response()->json([
            'games' => $games,
            'battingRecords' => $battingRecords,
            'pitchingRecords' => $pitchingRecords,
        ]);
    }
}
