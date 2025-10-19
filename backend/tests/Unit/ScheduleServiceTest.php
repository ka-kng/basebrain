<?php

namespace Tests\Unit;

use App\Models\Schedule;
use App\Models\Team;
use App\Services\ScheduleService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScheduleServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ScheduleService $service;
    protected Team $team;

    protected function setUp(): void
    {
        parent::setUp();

        // ScheduleService インスタンスを生成
        $this->service = new ScheduleService();

        // テスト用のチームを作成
        $this->team = Team::factory()->create();
    }

    // 新しいスケジュールを正しく作成できることを確認
    public function test_create_schedule_creates_a_new_schedule()
    {
        $data = [
            'date' => '2025-10-20',
            'type' => '練習試合',
            'time' => '10:00:00',
            'location' => '球場A',
            'note' => 'テスト用',
        ];

        // サービスメソッドで作成
        $schedule = $this->service->createSchedule($data, $this->team->id);

        // DB に正しく保存されているか確認
        $this->assertDatabaseHas('schedules', [
            'id' => $schedule->id,
            'team_id' => $this->team->id,
            'type' => '練習試合',
        ]);
    }

    // スケジュールの情報を正しく更新できることを確認
    public function test_update_schedule_modifies_existing_schedule()
    {
        // 元のスケジュールを作成
        $schedule = Schedule::factory()->create([
            'team_id' => $this->team->id,
            'type' => '旧タイプ',
        ]);

        // サービスメソッドで更新
        $updated = $this->service->updateSchedule($schedule, ['type' => '新タイプ']);

        // 値が更新されているか確認
        $this->assertEquals('新タイプ', $updated->type);
        $this->assertDatabaseHas('schedules', [
            'id' => $schedule->id,
            'type' => '新タイプ',
        ]);
    }

    // スケジュールを正しく削除できることを確認
    public function test_delete_schedule_removes_schedule()
    {
        $schedule = Schedule::factory()->create(['team_id' => $this->team->id]);

        // サービスメソッドで削除
        $result = $this->service->deleteSchedule($schedule);

        // メソッドの返り値と DB 削除を確認
        $this->assertTrue($result);
        $this->assertDatabaseMissing('schedules', ['id' => $schedule->id]);
    }
}
