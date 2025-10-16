<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BattingRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();;
    }

    // store / update 共通のバリデーションルール POST時のみ重複登録チェックを追加
    public function rules(): array
    {
        $rules = [
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
        ];

        // store（POST）の場合だけ重複禁止チェックを追加
        if ($this->isMethod('post')) {
            $rules['user_id'] .= '|unique:batting_records,user_id,NULL,id,game_id,' . $this->game_id;
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'user_id.unique' => 'この選手は既にこの試合に登録されています。',
        ];
    }
}
