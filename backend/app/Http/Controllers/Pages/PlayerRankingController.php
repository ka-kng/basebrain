<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Services\PlayerRankingService;

class PlayerRankingController extends Controller
{
    protected $service;

    public function __construct(PlayerRankingService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        // PlayerRankingServiceから打者ランキングと投手ランキングを取得して JSON で返す
        return response()->json([
            'battingRecords' => $this->service->getBattingRanking(),
            'pitchingRecords' => $this->service->getPitchingRanking(),
        ]);
    }
}
