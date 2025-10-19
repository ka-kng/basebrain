<?php

namespace Tests\Feature;

use App\Models\Schedule;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScheduleTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Team $team;

    protected function setUp(): void
    {
        parent::setUp();

        // テスト用チームを作成
        $this->team = Team::factory()->create();

        // チームに所属するユーザーを作成
        $this->user = User::factory()->create([
            'team_id' => $this->team->id,
            'role' => 'coach',
        ]);
    }

    // 【テスト】スケジュール作成
    public function test_store_creates_a_new_schedule()
    {
        $data = [
            'date' => '2025-10-20',
            'type' => '練習試合',
            'time' => '10:00:00',
            'location' => '球場A',
            'note' => 'テスト用',
        ];

        $response = $this->actingAs($this->user)->postJson('/api/schedules', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['type' => '練習試合']);

        $this->assertDatabaseHas('schedules', [
            'team_id' => $this->team->id,
            'type' => '練習試合',
        ]);
    }

    // 【テスト】スケジュール更新
    public function test_update_modifies_schedule()
    {
        $schedule = Schedule::factory()->create([
            'team_id' => $this->team->id,
            'type' => '旧タイプ',
        ]);

        $data = ['type' => '新タイプ'];

        $response = $this->actingAs($this->user)
                         ->putJson("/api/schedules/{$schedule->id}", $data);

        $response->assertStatus(200)
                 ->assertJsonFragment(['type' => '新タイプ']);

        $this->assertDatabaseHas('schedules', [
            'id' => $schedule->id,
            'type' => '新タイプ',
        ]);
    }

    // 【テスト】スケジュール削除
    public function test_destroy_removes_schedule()
    {
        $schedule = Schedule::factory()->create(['team_id' => $this->team->id]);

        $response = $this->actingAs($this->user)
                         ->deleteJson("/api/schedules/{$schedule->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Deleted successfully']);

        $this->assertDatabaseMissing('schedules', ['id' => $schedule->id]);
    }
}
