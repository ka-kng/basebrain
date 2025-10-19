<?php

namespace Tests\Feature;

use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MypageTest extends TestCase
{
    use RefreshDatabase;

    // プレイヤーが自分の名前・メールアドレスを更新できることを確認
    public function test_user_can_update_mypage_info(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create([
            'team_id' => $team->id,
            'role' => 'player',
        ]);

        $payload = [
            'name' => '新しい名前',
            'email' => 'new@example.com',
        ];

        $response = $this->actingAs($user)->putJson('/api/mypage', $payload);

        $response->assertStatus(200)
                 ->assertJson([
                     'name' => '新しい名前',
                     'email' => 'new@example.com',
                 ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => '新しい名前',
            'email' => 'new@example.com',
        ]);
    }

    // コーチがチーム名を変更できることを確認
    public function test_coach_can_update_team_name(): void
    {
        $team = Team::factory()->create(['name' => '旧チーム']);
        $coach = User::factory()->create([
            'team_id' => $team->id,
            'role' => 'coach',
        ]);

        $payload = [
            'name' => 'コーチ太郎',
            'email' => 'coach@example.com',
            'team_name' => '新チーム名',
        ];

        $response = $this->actingAs($coach)->putJson('/api/mypage', $payload);

        $response->assertStatus(200)
                 ->assertJson([
                     'team_name' => '新チーム名',
                 ]);

        $this->assertDatabaseHas('teams', [
            'id' => $team->id,
            'name' => '新チーム名',
        ]);
    }

    // コーチはアカウントを削除できないことを確認
    public function test_coach_cannot_delete_account(): void
    {
        $coach = User::factory()->create(['role' => 'coach']);

        $response = $this->actingAs($coach)->deleteJson('/api/mypage');

        $response->assertStatus(403)
                 ->assertJson([
                     'error' => 'コーチアカウントは削除できません',
                 ]);
    }

    // プレイヤーはアカウントを削除できることを確認
    public function test_player_can_delete_account(): void
    {
        $player = User::factory()->create(['role' => 'player']);

        $response = $this->actingAs($player)->deleteJson('/api/mypage');

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'User deleted',
                 ]);

        $this->assertDatabaseMissing('users', [
            'id' => $player->id,
        ]);
    }
}
