<?php

namespace Tests\Feature\Auth;

use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

     // 【テスト内容】
     // 新規ユーザー登録API（/api/register）が正常に動作することを確認する。
    public function test_new_users_can_register(): void
    {
        // 事前にチーム作成
        $team = Team::factory()->create([
            'invite_code' => 'somecode',
        ]);

        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'player',
            'invite_code' => $team->invite_code,
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                 ]);

        // DBにユーザーが作成されているか確認
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'team_id' => $team->id,
        ]);
    }
}
