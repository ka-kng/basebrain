<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // ユーザー登録（コーチはチーム新規作成、選手は招待コードで既存チーム参加）
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed|min:6',
            'role' => 'required|in:player,coach',
            'invite_code' => 'nullable|string',
            'team_name' => 'nullable|string|max:100',
        ]);

        if ($request->role === 'coach') {
            //　チーム作成
            $request->validate([
                'team_name' => 'required|string|max:100',
            ]);

            $team = Team::create([
                'name' => $request->team_name,
                'invite_code' => Str::random(10),
            ]);
            $team_id = $team->id;
        } else {
            // 既存チームに参加
            $request->validate([
                'invite_code' => 'required|exists:teams,invite_code',
            ]);
            $team = Team::where('invite_code', $request->invite_code)->first();
            $team_id = $team->id;
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'team_id' => $team_id,
        ]);

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user,
        ]);
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
