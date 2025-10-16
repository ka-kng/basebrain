<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class ScheduleRequest extends FormRequest
{
    // コーチのみ作成・更新可能
    public function authorize(): bool
    {
        return Auth::user()->role === 'coach';
    }

    // バリデーション
    public function rules(): array
    {
        return [
            'date' => $this->isMethod('post') ? 'required|date' : 'nullable|date',
            'type' => 'required|string|max:255',
            'time' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ];
    }

}
