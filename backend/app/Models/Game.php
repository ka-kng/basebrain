<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'game_type',
        'tournament',
        'opponent',
        'date',
        'team_score',
        'opponent_score',
        'memo',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    protected $appends = ['formatted_date'];

    public function getFormattedDateAttribute()
    {
        $weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        $weekday = $weekdays[$this->date->dayOfWeek];
        return $this->date->format('Y-m-d') . "({$weekday})";
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function battingRecords()
    {
        return $this->hasMany(BattingRecord::class);
    }

    public function pitchingRecords()
    {
        return $this->hasMany(PitchingRecord::class);
    }
}
