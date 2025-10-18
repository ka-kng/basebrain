<?php

namespace App\Http\Controllers\Records;

use App\Http\Controllers\Controller;
use App\Http\Requests\PitchingRequest;
use App\Models\User;
use App\Services\PitchingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PitchingController extends Controller
{
    protected $service;

    public function __construct(PitchingService $service)
    {
        $this->service = $service;
    }

    // 同じチームの選手一覧を取得
    public function users()
    {
        $user = Auth::user();

        $users = User::where('role', 'player')
            ->where('team_id', $user->team_id)
            ->select('id', 'name', 'team_id')
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }

    // 既に登録済みの投手ID一覧を取得
    public function registeredPitchers(Request $request)
    {
        $request->validate(['game_id' => 'required|integer|exists:games,id']);
        return response()->json($this->service->getRegisteredPitchers($request->game_id));
    }

    // 新しい投手記録を登録
    public function store(PitchingRequest $request)
    {
        try {
            $record = $this->service->store($request->validated());
            return response()->json($record, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    // 特定の投手記録を取得
    public function show($id)
    {
        return response()->json($this->service->get($id));
    }

    // 投手記録を更新
    public function update(PitchingRequest $request, $id)
    {
        try {
            $record = $this->service->update($id, $request->validated());
            return response()->json($record);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    // 投手記録を削除
    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->noContent();
    }
}
