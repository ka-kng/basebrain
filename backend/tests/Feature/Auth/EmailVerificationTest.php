<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    // 【テスト内容】
    // 正しいハッシュ付きURLでアクセスした場合、
    // メールが正常に認証され、Verifiedイベントが発火し、
    // 正しいURLにリダイレクトされることを確認。
    public function test_email_can_be_verified(): void
    {
        // 未認証ユーザーを作成
        $user = User::factory()->unverified()->create();

        // イベント発火を監視（実際には実行されない）
        Event::fake();

        // 有効な署名付きメール認証URLを生成
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        // 認証リクエストを実行
        $response = $this->actingAs($user)->get($verificationUrl);

        // メール認証イベントが発火したことを確認
        Event::assertDispatched(Verified::class);

        // ユーザーのメール認証状態が「認証済み」になっていることを確認
        $this->assertTrue($user->fresh()->hasVerifiedEmail());

        // フロントエンド側のリダイレクトURLが正しいことを確認
        $response->assertRedirect(config('app.frontend_url').'/login?verified=1');
    }

    //【テスト内容】
    // 不正なハッシュでアクセスした場合、
    // メールが認証されず、email_verified_atが更新されないことを確認。
    public function test_email_is_not_verified_with_invalid_hash(): void
    {
        // 未認証ユーザーを作成
        $user = User::factory()->unverified()->create();

        // 無効なハッシュを使用して署名付きURLを生成
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1('wrong-email')]
        );

        // 認証リクエストを実行
        $this->actingAs($user)->get($verificationUrl);

        // メールが認証されていない（email_verified_atがnullのまま）ことを確認
        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }
}
