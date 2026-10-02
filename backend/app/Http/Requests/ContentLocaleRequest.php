<?php

namespace App\Http\Requests;

use App\Enums\ContentLocale;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContentLocaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->has('locale')) {
            $this->merge(['locale' => 'nl']);
        }
    }

    public function rules(): array
    {
        return ['locale' => ['required', Rule::enum(ContentLocale::class)]];
    }

    public function locale(): string
    {
        return $this->validated('locale');
    }
}
