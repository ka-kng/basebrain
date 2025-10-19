<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    // パスワードリセットリンクをリクエストできるか
    public function test_reset_password_link_can_be_requested(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        // API ルートにリクエスト
        $response = $this->postJson('/api/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertStatus(200);

        // カスタム通知が送信されたか確認
        Notification::assertSentTo($user, ResetPasswordNotification::class);
    }

    // 有効なトークンでパスワードをリセットできるか
    public function test_password_can_be_reset_with_valid_token(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        // リセットリンク送信
        $this->postJson('/api/forgot-password', ['email' => $user->email]);

        // トークンを取得してパスワードリセット
        Notification::assertSentTo($user, ResetPasswordNotification::class, function ($notification) use ($user) {
            $response = $this->postJson('/api/reset-password', [
                'token' => $notification->token,
                'email' => $user->email,
                'password' => 'newpassword',
                'password_confirmation' => 'newpassword',
            ]);

            $response->assertStatus(200)
                     ->assertJson([
                         'status' => 'パスワードが再設定されました。',
                     ]);

            // パスワードが更新されているか確認
            $this->assertTrue(Hash::check('newpassword', $user->fresh()->password));

            return true;
        });
    }
}
