<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BattingRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'user_id',
        'order_no',
        'position',
        'at_bats',
        'hits',
        'doubles',
        'triples',
        'home_runs',
        'rbis',
        'runs',
        'walks',
        'strikeouts',
        'steals',
        'caught_stealing',
        'errors',
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
