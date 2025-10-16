<?php

namespace App\Http\Controllers\Records;

use App\Http\Controllers\Controller;
use App\Http\Requests\BattingRecordRequest;
use App\Services\BattingRecordService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class BattingController extends Controller
{
    protected $service;

    public function __construct(BattingRecordService $service)
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

    // 既に登録済みの打者ID一覧を取得
    public function registeredBatters(Request $request)
    {
        $request->validate(['game_id' => 'required|integer|exists:games,id']);
        $registered = $this->service->getRegisteredBatters($request->game_id);
        return response()->json($registered);
    }

    // 新しい打撃記録を登録
    public function store(BattingRecordRequest $request)
    {
        $record = $this->service->store($request->validated());
        return response()->json($record, 201);
    }

    // 特定の打撃記録を取得
    public function show($id)
    {
        $record = $this->service->show($id);
        return response()->json($record);
    }

    // 打撃記録を更新
    public function update(BattingRecordRequest $request, $id)
    {
        $record = $this->service->update($id, $request->validated());
        return response()->json($record);
    }

    // 打撃記録を削除
    public function destroy($id)
    {
        $this->service->destroy($id);
        return response()->noContent();
    }
}
