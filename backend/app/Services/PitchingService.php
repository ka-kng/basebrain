<?php

namespace App\Services;

use App\Models\PitchingRecord;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class PitchingService
{
    // チームの全選手を取得
    public function getUsers()
    {
        $user = Auth::user();
        return User::where('role', 'player')
            ->where('team_id', $user->team_id)
            ->select('id', 'name', 'team_id')
            ->orderBy('name')
            ->get();
    }

    // 指定ゲームの登録済み投手ID
    public function getRegisteredPitchers(int $gameId)
    {
        return PitchingRecord::where('game_id', $gameId)
            ->pluck('user_id');
    }

    // 新規作成
    public function create(array $data)
    {
        // 重複チェック
        $exists = PitchingRecord::where('game_id', $data['game_id'])
            ->where('user_id', $data['user_id'])
            ->exists();

        if ($exists) {
            throw new \Exception('この選手は既に登録されています');
        }

        return PitchingRecord::create($data);
    }

    // 編集用取得
    public function get(int $id)
    {
        return PitchingRecord::findOrFail($id);
    }

    // 更新
    public function update(int $id, array $data)
    {
        $record = PitchingRecord::findOrFail($id);

        // 重複チェック（自分以外）
        $exists = PitchingRecord::where('game_id', $data['game_id'])
            ->where('user_id', $data['user_id'])
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            throw new \Exception('この選手は既に登録されています');
        }

        $record->update($data);
        return $record;
    }

    // 削除
    public function delete(int $id)
    {
        $record = PitchingRecord::findOrFail($id);
        $record->delete();
    }
}
