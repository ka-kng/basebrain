<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Services\ManagerDashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected $service;

    // コンストラクタでサービスを依存性注入
    public function __construct(ManagerDashboardService $service)
    {
        $this->service = $service;
    }

    // ダッシュボードページのデータ取得
    public function index(Request $request)
    {
        $teamId = $request->user()->team_id;

        return response()->json(
            $this->service->getDashboardData($teamId)
        );
    }
}
