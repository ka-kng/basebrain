<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    // ユーザーがログインでき、トークンを受け取れるかテスト
    public function test_users_can_login_and_receive_token(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'), // パスワードを固定
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'user' => ['id', 'name', 'email'],
            ]);
    }

    // 間違ったパスワードでログインできないことをテスト
    public function test_users_cannot_login_with_invalid_password(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('emailPass'); // バリデーションキー
    }

    // ログアウトできることをテスト
    public function test_users_can_logout_with_token(): void
    {
        $user = User::factory()->create();

        // Sanctumトークンを作成
        $token = $user->createToken('auth_token')->plainTextToken;

        // Authorization ヘッダーでリクエスト
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'ログアウトしました',
            ]);
    }
}
