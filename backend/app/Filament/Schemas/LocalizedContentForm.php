<?php

namespace App\Filament\Schemas;

use App\Models\ActivityTranslation;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Unique;

class LocalizedContentForm
{
    public static function translation(string $relationship, string $locale, string $translationModel = ActivityTranslation::class, string $descriptionField = 'description'): Group
    {
        return Group::make()->relationship($relationship)->schema([
            TextInput::make('title')->label('Titel')->required()->maxLength(255)->live(onBlur: true)
                ->afterStateUpdated(function (Get $get, Set $set, ?string $old, ?string $state): void {
                    if (blank($get('slug')) || $get('slug') === Str::slug($old ?? '')) {
                        $set('slug', Str::slug($state ?? ''));
                    }
                }),
            TextInput::make('slug')->required()->maxLength(255)->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                ->unique(table: $translationModel, column: 'slug', ignoreRecord: true,
                    modifyRuleUsing: fn (Unique $rule): Unique => $rule->where('locale', $locale)),
            Textarea::make($descriptionField)->label('Korte beschrijving')->rows(3)->maxLength(500),
        ]);
    }

    public static function seo(string $label): array
    {
        return [
            TextInput::make('seo_title')->label($label.' SEO title')->maxLength(255),
            Textarea::make('seo_description')->label($label.' SEO description')->rows(3)->maxLength(500),
        ];
    }
}
