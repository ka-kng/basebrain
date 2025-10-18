<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Services\PlayerDashboardService;
use Illuminate\Http\Request;

class PlayerDashboardController extends Controller
{
    protected $service;

    // コンストラクタでサービスを依存性注入
    public function __construct(PlayerDashboardService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        // ログイン中ユーザーのIDを取得
        $userId = $request->user()->id;

        // Serviceを使って個人成績データを取得
        $stats = $this->service->getPlayerDashboardData($userId);

        return response()->json($stats);
    }
}
