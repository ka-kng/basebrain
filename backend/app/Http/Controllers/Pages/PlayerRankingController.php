<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\BattingRecord;
use App\Models\PitchingRecord;
use Illuminate\Http\Request;

class PlayerRankingController extends Controller
{

    // プレイヤーランキング表示
    public function index(Request $request)
    {
        $userTeamId = $request->user()->team_id;

        // 自チーム全選手の打者成績を取得
        $battingRecords = BattingRecord::with('user')
            ->whereHas('game', fn($q) => $q->where('team_id', $userTeamId))
            ->get();

        // 自チーム全選手の投手成績を取得
        $pitchingRecords = PitchingRecord::with('user')
            ->whereHas('game', fn($q) => $q->where('team_id', $userTeamId))
            ->get();

        // JSON形式で返却
        return response()->json([
            'battingRecords' => $battingRecords,
            'pitchingRecords' => $pitchingRecords,
        ]);
    }
}
