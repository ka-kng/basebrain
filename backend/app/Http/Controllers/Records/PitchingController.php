<?php

namespace App\Http\Controllers\Records;

use App\Http\Controllers\Controller;
use App\Http\Requests\PitchingRequest;
use App\Services\PitchingService;
use Illuminate\Http\Request;

class PitchingController extends Controller
{
    protected $service;

    public function __construct(PitchingService $service)
    {
        $this->service = $service;
    }

    // チームの選手一覧
    public function users()
    {
        return response()->json($this->service->getUsers());
    }

    // 登録済み投手ID取得
    public function registeredPitchers(Request $request)
    {
        $request->validate(['game_id' => 'required|integer|exists:games,id']);
        return response()->json($this->service->getRegisteredPitchers($request->game_id));
    }

    // 一覧（未実装）
    public function index()
    {
        //
    }

    // 新規作成
    public function store(PitchingRequest $request)
    {
        try {
            $record = $this->service->create($request->validated());
            return response()->json($record, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    // 編集用取得
    public function show($id)
    {
        return response()->json($this->service->get($id));
    }

    // 更新
    public function update(PitchingRequest $request, $id)
    {
        try {
            $record = $this->service->update($id, $request->validated());
            return response()->json($record);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    // 削除
    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->noContent();
    }
}
