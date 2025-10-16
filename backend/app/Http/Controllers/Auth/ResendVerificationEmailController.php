<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\EmailVerificationService;
use Illuminate\Http\Request;

class ResendVerificationEmailController extends Controller
{
    public function __construct(private EmailVerificationService $service) {}

    // メール再送
    public function __invoke(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->hasVerifiedEmail()) {
            return redirect(config('app.frontend_url') . '/login?verified=1&message=already_verified');
        }

        $this->service->resend($user);

        return redirect(config('app.frontend_url') . '/login?resent=1');
    }
}
