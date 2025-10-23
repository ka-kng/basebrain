<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\AuthService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;

class AuthServiceTest extends TestCase
{
    use RefreshDatabase;

    // コーチがユーザー登録を行い、新しいチームを作成できるかのテスト
    public function test_coach_can_register_and_create_team()
    {
        Notification::fake();

        // テスト対象のサービスを生成
        $service = new AuthService();

        $data = [
            'name' => 'Coach A',
            'email' => 'coach@example.com',
            'password' => 'password',
            'role' => 'coach',
            'team_name' => 'Team A',
        ];

        // register メソッドを実行し、ユーザーを作成
        $user = $service->register($data);

        // データベースにチームが作成されていることを確認
        $this->assertDatabaseHas('teams', ['name' => 'Team A']);

         // データベースにユーザーが作成されていることを確認
        $this->assertDatabaseHas('users', ['email' => 'coach@example.com']);

        // 入力したパスワードがハッシュ化されて正しく保存されていることを確認
        $this->assertTrue(Hash::check('password', $user->password));
    }

    
    // 無効な招待コードでプレイヤー登録を行った場合に例外が投げられるかのテスト
    public function test_player_registration_with_invalid_invite_code_throws_exception()
    {
        // このテストでは ValidationException が投げられることを期待
        $this->expectException(ValidationException::class);

        $service = new AuthService();

        $data = [
            'name' => 'Player A',
            'email' => 'player@example.com',
            'password' => 'password',
            'role' => 'player',
            'invite_code' => 'INVALIDCODE',
        ];

        // register メソッドを実行 → 招待コードが無効なので例外が発生する
        $service->register($data);
    }
}
