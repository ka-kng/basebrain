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
          return response()->json([
              'verified' => false,
              'error' => 'user_not_found',
          ], 404);
    }

      $verified = $this->service->verify($user, $hash);

      return response()->json([
          'verified' => $verified,
          'error' => $verified ? null : 'invalid',
      ]);
    }

}
