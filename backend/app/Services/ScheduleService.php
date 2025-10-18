<?php

namespace App\Services;

use App\Models\Schedule;

class ScheduleService
{
    // チームのスケジュール一覧取得
    public function getTeamSchedules(int $teamId)
    {
        // team_idが一致するスケジュールを全件取得
        return Schedule::where('team_id', $teamId)->get();
    }

    // 新しいスケジュール作成
    public function createSchedule(array $data, int $teamId)
    {
        // 渡されたデータにteam_idをマージして作成
        return Schedule::create(array_merge($data, ['team_id' => $teamId]));
    }

    // スケジュールの更新
    public function updateSchedule(Schedule $schedule, array $data)
    {
        $schedule->update($data);
        return $schedule;
    }

    // スケジュール削除
    public function deleteSchedule(Schedule $schedule)
    {
        $schedule->delete();
        return true;
    }
}
