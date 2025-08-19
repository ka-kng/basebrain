<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PlayerRankingController extends Controller
{
    public function index(Request $request)
{
    $user = $request->user(); // ログイン中のユーザー

    // 打者成績（自チームの全選手）
    $battingRecords = \DB::table('batting_records')
        ->join('games', 'batting_records.game_id', '=', 'games.id')
        ->where('games.team_id', $user->team_id)
        ->select('batting_records.*', 'users.name') // 名前も取得
        ->join('users', 'batting_records.user_id', '=', 'users.id')
        ->get();

    // 投手成績（自チームの全選手）
    $pitchingRecords = \DB::table('pitching_records')
        ->join('games', 'pitching_records.game_id', '=', 'games.id')
        ->where('games.team_id', $user->team_id)
        ->select('pitching_records.*', 'users.name')
        ->join('users', 'pitching_records.user_id', '=', 'users.id')
        ->get();

    return response()->json([
        'battingRecords' => $battingRecords,
        'pitchingRecords' => $pitchingRecords,
    ]);
}

}
