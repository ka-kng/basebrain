<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\EmailVerificationService;
use Illuminate\Http\Request;

class ResendVerificationEmailController extends Controller
{
    public function __construct(private EmailVerificationService $service) {}

    // メール再送 API
    public function __invoke(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'resent' => false,
                'message' => 'already_verified'
            ]);
        }

        $this->service->resend($user);

        return response()->json([
            'resent' => true,
            'message' => 'verification_email_sent'
        ]);
    }
}
