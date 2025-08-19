<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teamId = Auth::user()->team_id;
        $schedules = Schedule::where('team_id', $teamId)->get();
        return response()->json($schedules);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'coach') {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|string|max:255',
            'time' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ]);

        $schedules = Schedule::create(array_merge($validated, ['team_id' => $user->team_id]));

        return response()->json($schedules, 201);

    }

}
