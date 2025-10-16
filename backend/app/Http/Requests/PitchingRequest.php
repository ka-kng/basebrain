<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PitchingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check(); // ログインユーザーであればOK
    }

    public function rules(): array
    {
        return [
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
        ];
    }
}
