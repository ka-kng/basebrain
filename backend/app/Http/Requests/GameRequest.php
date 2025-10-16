<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GameRequest extends FormRequest
{
    public function authorize(): bool
    {
        // ログインユーザーであればOK
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'game_type' => 'required|string|max:255',
            'tournament' => 'required|string|max:255',
            'opponent' => 'required|string|max:255',
            'date' => 'required|date',
            'team_score' => 'required|integer',
            'result' => 'required|string',
            'opponent_score' => 'required|integer',
            'memo' => 'nullable|string',
        ];
    }
}
