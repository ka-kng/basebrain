<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PitchingRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'user_id',
        'result',
        'pitching_innings_outs',
        'pitches',
        'strikeouts',
        'hits_allowed',
        'hr_allowed',
        'walks_given',
        'runs_allowed',
        'earned_runs',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
