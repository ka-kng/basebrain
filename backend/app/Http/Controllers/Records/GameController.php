<?php

namespace App\Http\Controllers\Records;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    // 一覧取得(GET /api/games)
    public function index()
    {
        $games = Game::with('team')->orderBy('id', 'desc')->get();
        return response()->json($games);
    }

    // 新規登録(POST /api/games)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'game_type' => 'required|string|max:255',
            'tournament' => 'required|string|max:255',
            'opponent' => 'required|string|max:255',
            'date' => 'required|date',
            'team_score' => 'required|integer',
            'opponent_score' => 'required|integer',
            'memo' => 'nullable|string',
        ]);

        $validated['team_id'] = Auth::user()->team_id;

        $game = Game::create($validated);

        return response()->json($game, 201);
    }

    // 詳細取得(GET /api/games/{id})
    public function show(string $id)
    {
        $game = Game::with('team')->findOrFail($id);
        return response()->json($game);
    }

    // 更新(PUT /api/games/{id})
    public function update(Request $request, string $id)
    {
        $teamId = Auth::user()->team_id;

        $game = Game::where('id', $id)->where('team_id', $teamId)->firstOrFail();

        $validated = $request->validate([
            'game_type' => 'required|string|max:255',
            'tournament' => 'required|string|max:255',
            'opponent' => 'required|string|max:255',
            'date' => 'required|date',
            'team_score' => 'required|integer',
            'opponent_score' => 'required|integer',
            'memo' => 'nullable|string',
        ]);

        $game->update($validated);

        return response()->json($game);
    }

    // 削除 (DELETE /api/games/{id})
    public function destroy(string $id)
    {
        $teamId = Auth::user()->team_id;

        $game = Game::where('id', $id)->where('team_id', $teamId)->firstOrFail();

        $game->delete();

        return response()->json(null, 204);
    }
}
