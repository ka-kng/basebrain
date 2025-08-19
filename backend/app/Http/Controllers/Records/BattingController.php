<?php

namespace App\Http\Controllers\Records;

use App\Http\Controllers\Controller;
use App\Models\BattingRecord;
use App\Models\User;
use Illuminate\Http\Request;

class BattingController extends Controller
{
    public function users()
    {
        $users = User::where('role', 'player')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
        return response()->json($users);
    }

    public function registeredBatters(Request $request)
    {
        $request->validate(['game_id' => 'required|integer|exists:games,id']);

        $registeredUserIds = BattingRecord::where('game_id', $request->game_id)
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
            'order_no' => 'required|integer|min:1|max:9',
            'position' => 'required|string|max:20',
            'at_bats' => 'required|integer|min:0',
            'hits' => 'required|integer|min:0',
            'doubles' => 'required|integer|min:0',
            'triples' => 'required|integer|min:0',
            'home_runs' => 'required|integer|min:0',
            'rbis' => 'required|integer|min:0',
            'runs' => 'required|integer|min:0',
            'walks' => 'required|integer|min:0',
            'strikeouts' => 'required|integer|min:0',
            'steals' => 'required|integer|min:0',
            'caught_stealing' => 'required|integer|min:0',
            'errors' => 'required|integer|min:0',
        ]);

        $exists = BattingRecord::where('game_id', $validated['game_id'])
            ->where('user_id', $validated['user_id'])
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'この選手は既に登録されています'], 422);
        }

        $record = BattingRecord::create($validated);

        return response()->json($record, 201);
    }

    public function show($id)
    {
        $record = BattingRecord::find($id);

        if (!$record) {
            return response()->json(['error' => 'データが見つかりません'], 404);
        }

        return response()->json($record);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $record = BattingRecord::findOrFail($id);

        $validated = $request->validate([
            'game_id' => 'required|integer|exists:games,id',
            'user_id' => 'required|exists:users,id',
            'order_no' => 'required|integer|min:1|max:9',
            'position' => 'required|string|max:20',
            'at_bats' => 'required|integer|min:0',
            'hits' => 'required|integer|min:0',
            'doubles' => 'required|integer|min:0',
            'triples' => 'required|integer|min:0',
            'home_runs' => 'required|integer|min:0',
            'rbis' => 'required|integer|min:0',
            'runs' => 'required|integer|min:0',
            'walks' => 'required|integer|min:0',
            'strikeouts' => 'required|integer|min:0',
            'steals' => 'required|integer|min:0',
            'caught_stealing' => 'required|integer|min:0',
            'errors' => 'required|integer|min:0',
        ]);

        $record->update($validated);

        return response()->json($record);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
