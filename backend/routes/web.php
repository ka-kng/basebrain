<?php

use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::get('/email/verify/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
    ->middleware(['signed'])
    ->name('verification.verify');


// Route::post('/email/resend', function (Request $request) {
//     $request->user()->sendEmailVerificationNotification();
//     return response()->json(['message' => '確認メール再送信しました']);
// })->name('verification.send');
