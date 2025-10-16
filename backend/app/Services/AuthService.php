<?php

namespace App\Services;

use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
  // ユーザー新規登録
  public function register(array $data): User
  {
    // チーム作成・参加
    if ($data['role'] === 'coach') {
      $team = Team::create([
        'name' => $data['team_name'],
        'invite_code' => Str::random(10),
      ]);
    } else {
      $team = Team::where('invite_code', $data['invite_code'])->first();

      if (!$team) {
        throw ValidationException::withMessages([
          'invite_code' => ['有効な招待コードが見つかりません。'],
        ]);
      }
    }

    $user = User::create([
      'name' => $data['name'],
      'email' => $data['email'],
      'password' => Hash::make($data['password']),
      'role' => $data['role'],
      'team_id' => $team->id,
    ]);

    // メール送信
    $user->sendEmailVerificationNotification();

    return $user;
  }

  // ログイン処理
  public function login(string $email, string $password): array
  {
    $user = User::where('email', $email)->first();

    if (! $user || ! Hash::check($password, $user->password)) {
      throw ValidationException::withMessages([
        'emailPass' => ['メールアドレスまたはパスワードが正しくありません'],
      ]);
    }

    if (! $user->hasVerifiedEmail()) {
      throw ValidationException::withMessages([
        'message' => 'メール認証を完了してください',
        'emailVerified' => false,
      ], 403);
    }

    return [
      'user' => $user,
      'access_token' => $user->createToken('auth_token')->plainTextToken,
      'token_type' => 'Bearer',
    ];
  }

  // ログアウト処理
  public function logout(User $user): void
  {
    $user->currentAccessToken()->delete();
  }
}
