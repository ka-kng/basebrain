<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Pages\DashboardController;
use App\Http\Controllers\Pages\PlayerRankingController;
use App\Http\Controllers\Pages\ScheduleController;
use App\Http\Controllers\Records\BattingController;
use App\Http\Controllers\Records\GameController;
use App\Http\Controllers\Records\PitchingController;
use App\Http\Controllers\Records\SummaryController;
use App\Models\PitchingRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/dashboard/manager', [DashboardController::class, 'index']);
    Route::get('/dashboard/player', [DashboardController::class, 'playerDashboard']);

    Route::get('/player/ranking', [PlayerRankingController::class, 'index']);

    Route::get('/games/list', [GameController::class, 'index']);
    Route::post('/records/games', [GameController::class, 'store']);
    Route::get('/games/{id}', [GameController::class, 'show']);
    Route::delete('/games/{id}', [GameController::class, 'destroy']);
    Route::put('/records/games/{id}', [GameController::class, 'update']);
    Route::delete('/records/games/{id}', [GameController::class, 'destroy']);

    Route::get('/users/batter', [BattingController::class, 'users']);
    Route::get('/records/batting/registered-users', [BattingController::class, 'registeredBatters']);

    Route::get('/records/batting', [BattingController::class, 'index']);
    Route::post('/records/batting', [BattingController::class, 'store']);
    Route::get('/records/batting/{id}', [BattingController::class, 'show']);
    Route::put('/records/batting/{id}', [BattingController::class, 'update']);

    Route::get('/users/pitcher', [PitchingController::class, 'users']);
    Route::get('/records/pitching/registered-users', [PitchingController::class, 'registeredPitchers']);

    Route::get('/records/pitching', [PitchingController::class, 'index']);
    Route::post('/records/pitching', [PitchingController::class, 'store']);
    Route::get('/records/pitching/{id}', [PitchingController::class, 'show']);
    Route::put('/records/pitching/{id}', [PitchingController::class, 'update']);

    Route::get('/records/summary', [SummaryController::class, 'summaryResult']);

    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::post('/schedules', [ScheduleController::class, 'store']);
    Route::put('/schedules/{id}', [ScheduleController::class, 'update']);
    Route::delete('/schedules/{id}', [ScheduleController::class, 'destroy']);
});
