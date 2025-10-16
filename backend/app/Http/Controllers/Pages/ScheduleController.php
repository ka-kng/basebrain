<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Http\Requests\ScheduleRequest;
use App\Models\Schedule;
use App\Services\ScheduleService;
use Illuminate\Support\Facades\Auth;

class ScheduleController extends Controller
{
    protected ScheduleService $service;

    // ScheduleService を注入
    public function __construct(ScheduleService $service)
    {
        $this->service = $service;
    }

    // チームのスケジュール一覧を返す
    public function index()
    {
        $teamId = Auth::user()->team_id;
        $schedules = $this->service->getTeamSchedules($teamId);
        return response()->json($schedules);
    }

    // 新しいスケジュールを作成
    public function store(ScheduleRequest $request)
    {
        $user = Auth::user();

        $schedule = $this->service->createSchedule($request->validated(), $user->team_id);

        return response()->json($schedule, 201);
    }

    // スケジュールの更新
    public function update(ScheduleRequest $request, $id)
    {
        $schedule = Schedule::findOrFail($id);

        $updated = $this->service->updateSchedule($schedule, $request->validated());

        return response()->json($updated);
    }

    // スケジュール削除
    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $this->service->deleteSchedule($schedule);

        return response()->json(['message' => 'Deleted successfully']);
    }
}
