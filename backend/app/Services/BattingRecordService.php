<?php

namespace App\Services;

use App\Models\BattingRecord;

class BattingRecordService
{
    // 試合に登録済みの打者ID一覧を取得
    public function getRegisteredBatters(int $gameId)
    {
        return BattingRecord::where('game_id', $gameId)->pluck('user_id');
    }

    // 新規打撃記録を登録
    public function store(array $data)
    {
        // 同一試合・選手の重複チェック
        $exists = BattingRecord::where('game_id', $data['game_id'])
            ->where('user_id', $data['user_id'])
            ->exists();

        if ($exists) {
            abort(422, 'この選手は既に登録されています');
        }

        return BattingRecord::create($data);
    }

    // ID指定で打撃記録を取得
    public function show(int $id)
    {
        return BattingRecord::findOrFail($id);
    }

    // 打撃記録を更新
    public function update(int $id, array $data)
    {
        $record = BattingRecord::findOrFail($id);
        $record->update($data);
        return $record;
    }

    // 打撃記録を削除
    public function destroy(int $id)
    {
        $record = BattingRecord::findOrFail($id);
        $record->delete();
    }
}
