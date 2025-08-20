<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load('team'); // team をまとめて取得

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'team_name' => $user->team->name ?? null,       // ここで直接アクセス
            'invite_code' => $user->team->invite_code ?? null,
        ]);
    }


    public function update(Request $request, $id)
    {
        $user = $request->user();

        if ($user->id != $id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        if ($user->role === 'coach' && $user->team_id && $request->team_name) {
            $team = Team::find($user->team_id);
            if ($team) {
                $team->name = $request->team_name;
                $team->save();
            }
        }

        return $this->show($request);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if ($user->id != $id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($user->role === 'coach') {
            return response()->json(['error' => 'コーチアカウントは削除できません'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
