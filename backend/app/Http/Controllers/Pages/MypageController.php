<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;

class MypageController extends Controller
{
    // マイページ情報の取得
    public function show(Request $request)
    {
        // ログイン中のユーザー情報を取得し、teamリレーションを同時にロード
        $user = $request->user()->load('team');

        // 必要な情報のみJSONで返す
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'team_name' => $user->team->name ?? null,
            'invite_code' => $user->team->invite_code ?? null,
        ]);
    }

    // マイページ情報の更新
    public function update(Request $request)
    {
        $user = $request->user();

        // リクエストから送られてきた値で更新
        $user->name = $request->name;
        $user->email = $request->email;

        $user->save();

        // チーム名の更新（コーチの場合のみ）
        if ($user->role === 'coach' && $user->team_id && $request->team_name) {
            $team = Team::find($user->team_id); // 自分のチームを取得
            if ($team) {
                $team->name = $request->team_name;
                $team->save();
            }
        }

        // 更新後の最新データをshow()で再取得して返す
        return $this->show($request);
    }

    // アカウント削除処理
    public function destroy(Request $request)
    {
        $user = $request->user();

        // コーチは削除不可
        if ($user->role === 'coach') {
            return response()->json(['error' => 'コーチアカウントは削除できません'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
