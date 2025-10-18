<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthenticatedSessionController extends Controller
{
    public function __construct(private AuthService $authService) {}

    // 新規登録（ユーザー登録）
    public function register(RegisterRequest $request)
    {
        $this->authService->register($request->validated());

        return response()->json(['message' => '登録完了。確認メールを送信しました']);
    }

    // ログイン処理
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $data = $this->authService->login($request->email, $request->password);

        return response()->json($data);
    }

    // ログアウト処理
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return response()->json(['message' => 'ログアウトしました']);
    }
}
