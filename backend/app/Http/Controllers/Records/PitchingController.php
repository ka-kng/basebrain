<?php

namespace App\Http\Controllers\Records;

use App\Http\Controllers\Controller;
use App\Models\PitchingRecord;
use App\Models\User;
use Illuminate\Http\Request;

class PitchingController extends Controller
{

    public function users()
    {
        $users = User::where('role', 'player')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
        return response()->json($users);
    }

    public function registeredPitchers(Request $request)
    {
        $request->validate(['game_id' => 'required|integer|exists:games,id']);

        $registeredUserIds = PitchingRecord::where('game_id', $request->game_id)
            ->pluck('user_id');

            return response()->json($registeredUserIds);
    }

    public function index()
    {
        //
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'game_id' => 'required|integer|exists:games,id',
            'user_id' => 'required|exists:users,id',
            'result' => 'required|string|max:10',
            'pitching_innings_outs' => 'required|integer|min:0',
            'pitches' => 'required|integer|min:0',
            'strikeouts' => 'required|integer|min:0',
            'hits_allowed' => 'required|integer|min:0',
            'hr_allowed' => 'required|integer|min:0',
            'walks_given' => 'required|integer|min:0',
            'runs_allowed' => 'required|integer|min:0',
            'earned_runs' => 'required|integer|min:0',
        ]);

        $exists = PitchingRecord::where('game_id', $validated['game_id'])
            ->where('user_id', $validated['user_id'])
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'この選手は既に登録されています'], 422);
        }

        $record = PitchingRecord::create($validated);

        return response()->json($record, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
