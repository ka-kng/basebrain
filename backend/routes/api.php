<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Records\BattingController;
use App\Http\Controllers\Records\GameController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/records/games', [GameController::class, 'index']);
    Route::post('/records/games', [GameController::class, 'store']);
    Route::get('/records/games/{id}', [GameController::class, 'show']);
    Route::put('/records/games/{id}', [GameController::class, 'update']);
    Route::delete('/records/games/{id}', [GameController::class, 'destroy']);

    Route::get('/users', [BattingController::class, 'users']);
    Route::get('/records/batting/registered-users', [BattingController::class, 'registeredUsers']);

    Route::get('/records/batting', [BattingController::class, 'index']);
    Route::post('/records/batting', [BattingController::class, 'store']);
});
