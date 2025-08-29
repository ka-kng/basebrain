<?php

// app/Http/Controllers/Auth/VerifyEmailController.php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request, $id, $hash)
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // ここに有効期限チェック
        if ($user->email_verification_sent_at && $user->email_verification_sent_at->diffInMinutes(now()) > 60) {
            return response()->json(['error' => 'Link expired'], 403);
        }

        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return response()->json(['error' => 'Invalid verification link'], 403);
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new \Illuminate\Auth\Events\Verified($user));
        }

        return response()->json([
            'verified' => true,
            'redirect_url' => config('app.frontend_url') . '/login?verified=1',
        ]);
    }

    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'すでに認証済みです']);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => '確認メールを再送信しました']);

    }

}
