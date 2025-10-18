<?php

namespace App\Http\Controllers\Records;

use App\Http\Controllers\Controller;
use App\Http\Requests\GameRequest;
use App\Models\Game;
use App\Services\GameService;
use App\Services\GameStatsService;

class GameController extends Controller
{
    protected $service;

    public function __construct(GameService $service)
    {
        $this->service = $service;
    }

    // 一覧取得
    public function index()
    {
        $games = $this->service->listGames();
        return response()->json($games);
    }

    // 試合新規登録
    public function store(GameRequest $request)
    {
        $game = $this->service->createGame($request->validated());
        return response()->json($game, 201);
    }

    // 詳細取得
    public function show($id, GameService $gameService, GameStatsService $statsService)
    {
        $game = $gameService->getGame($id);           // DBから取得
        $formatted = $statsService->formatGame($game); // 計算済みJSONに整形
        return response()->json($formatted);
    }

    // 試合更新
    public function update(GameRequest $request, string $id)
    {
        $game = $this->service->updateGame($id, $request->validated());
        return response()->json($game);
    }

    // 削除
    public function destroy(string $id)
    {
        $this->service->deleteGame($id);
        return response()->json(null, 204);
    }
}
