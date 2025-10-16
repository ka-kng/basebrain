<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Auth\Events\Verified;

class EmailVerificationService
{
  // メール認証処理
  public function verify(User $user, string $hash): bool
  {
    if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
      return false;
    }

    if (! $user->hasVerifiedEmail()) {
      $user->markEmailAsVerified();
      event(new Verified($user));
    }

    return true;
  }

  // 再送処理
  public function resend(User $user): void
  {
    if (! $user->hasVerifiedEmail()) {
      $user->sendEmailVerificationNotification();
    }
  }
}
