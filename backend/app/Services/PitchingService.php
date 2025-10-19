<?php

namespace App\Services;

use App\Models\PitchingRecord;

class PitchingService
{
    // 指定ゲームの登録済み投手ID
    public function getRegisteredPitchers(int $gameId)
    {
        return PitchingRecord::where('game_id', $gameId)
            ->pluck('user_id');
    }

    // 新規作成
    public function store(array $data)
    {
        // 同じ試合・選手の組み合わせがすでに存在するかチェック
        $exists = PitchingRecord::where('game_id', $data['game_id'])
            ->where('user_id', $data['user_id'])
            ->exists();

        if ($exists) {
            throw new \Exception('この選手は既に登録されています');
        }

        return PitchingRecord::create($data);
    }

    // ID指定で投手記録を取得
    public function get(int $id)
    {
        return PitchingRecord::findOrFail($id);
    }

    // 投手記録を更新
    public function update(int $id, array $data)
    {
        $record = PitchingRecord::findOrFail($id);
        $record->update($data);
        return $record;
    }

    // 投手記録を削除
    public function delete(int $id)
    {
        $record = PitchingRecord::findOrFail($id);
        $record->delete();
    }
}
