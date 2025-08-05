<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'invite_code',
    ];

    // リレーション：チームには複数のユーザーが所属できる
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
