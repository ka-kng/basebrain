<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Pages\DashboardController;
use App\Http\Controllers\Pages\PlayerRankingController;
use App\Http\Controllers\Pages\ScheduleController;
use App\Http\Controllers\Pages\UserController;
use App\Http\Controllers\Records\BattingController;
use App\Http\Controllers\Records\GameController;
use App\Http\Controllers\Records\PitchingController;
use App\Http\Controllers\Records\SummaryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/forget-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);
Route::post('/email/resend', [VerifyEmailController::class, 'resend']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {

    Route::prefix('mypage')->group(function () {
        Route::get('/', [UserController::class, 'show']);
        Route::put('/', [UserController::class, 'update']);
        Route::delete('/', [UserController::class, 'destroy']);
    });

    // ダッシュボード
    Route::prefix('dashboard')->group(function () {
        Route::get('/manager', [DashboardController::class, 'index']);
        Route::get('/player', [DashboardController::class, 'playerDashboard']);
    });

    Route::get('/player/ranking', [PlayerRankingController::class, 'index']);

    Route::apiResource('games', GameController::class);

    Route::get('/records/batting/registered-users', [BattingController::class, 'registeredBatters']);

    Route::apiResource('records/batting', BattingController::class);

    // ピッチング記録
    Route::prefix('records/pitching')->group(function () {
        Route::get('registered-users', [PitchingController::class, 'registeredPitchers']);
    });
    Route::apiResource('records/pitching', PitchingController::class);

    Route::get('/records/summary', [SummaryController::class, 'summaryResult']);

    // 選手管理
    Route::prefix('users')->group(function () {
        Route::get('batter', [BattingController::class, 'users']);
        Route::delete('batter/{id}', [BattingController::class, 'destroy']);

        Route::get('pitcher', [PitchingController::class, 'users']);
        Route::delete('pitcher/{id}', [PitchingController::class, 'destroy']);
    });

    // スケジュール
    Route::apiResource('schedules', ScheduleController::class);
});
