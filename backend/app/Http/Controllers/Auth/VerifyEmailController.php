<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\EmailVerificationService;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    public function __construct(private EmailVerificationService $service) {}

    // メール認証
    public function __invoke(Request $request, $id, $hash)
    {
        $user = User::find($id);

        if (! $user) {
            return redirect(config('app.frontend_url') . '/login?verified=0&error=user_not_found');
        }

        $verified = $this->service->verify($user, $hash);

        $status = $verified ? 1 : 0;
        $error = $verified ? '' : 'invalid';

        return redirect(config('app.frontend_url') . "/login?verified={$status}&error={$error}");
    }
}
