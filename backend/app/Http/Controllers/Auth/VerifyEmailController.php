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
            return redirect(config('app.frontend_url') . '/login?verified=0&error=user_not_found');
        }

        // 有効期限チェック
        if ($user->email_verification_sent_at && $user->email_verification_sent_at->diffInMinutes(now()) > 60) {
            return redirect(config('app.frontend_url') . '/login?verified=0&error=expired');
        }

        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return redirect(config('app.frontend_url') . '/login?verified=0&error=invalid');
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new \Illuminate\Auth\Events\Verified($user));
        }

        // 成功時はログインページに飛ばす
        return redirect(config('app.frontend_url') . '/login?verified=1');
    }

    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->hasVerifiedEmail()) {
            return redirect(config('app.frontend_url') . '/login?verified=1&message=already_verified');
        }

        $user->sendEmailVerificationNotification();

        return redirect(config('app.frontend_url') . '/login?resent=1');
    }
}
