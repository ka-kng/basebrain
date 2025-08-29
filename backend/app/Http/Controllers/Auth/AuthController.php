<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Registered;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed|min:6',
            'role' => 'required|in:player,coach',
            'invite_code' => 'nullable|string',
            'team_name' => 'nullable|string|max:100',
        ]);

        // チーム作成・参加
        if ($request->role === 'coach') {
            $team = Team::create([
                'name' => $request->team_name,
                'invite_code' => Str::random(10),
            ]);
            $team_id = $team->id;
        } else {
            $team = Team::where('invite_code', $request->invite_code)->firstOrFail();
            $team_id = $team->id;
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'team_id' => $team_id,
        ]);

        // メール送信
        $user->sendEmailVerificationNotification(); // ここで標準メール送信

        return response()->json(['message' => '登録完了。確認メールを送信しました']);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'emailPass' => ['メールアドレスまたはパスワードが正しくありません'],
            ]);
        }

        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'メール認証を完了してください',
                'emailVerified' => false
            ], 403);
        }

        return response()->json([
            'access_token' => $user->createToken('auth_token')->plainTextToken,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'ログアウトしました']);
    }
}
