<?php

namespace App\Filament\Schemas;

use App\Enums\ActivitySectionType;
use App\Support\ActivityContent;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Get;

class ContentSectionForm
{
    public static function make(): Repeater
    {
        return Repeater::make('sections')->label('Secties')->relationship()->orderColumn('sort_order')
            ->defaultItems(0)->addActionLabel('Sectie toevoegen')->collapsible()->collapsed()
            ->itemLabel(fn (array $state): string => ActivitySectionType::tryFrom(($state['type'] ?? null) instanceof ActivitySectionType ? $state['type']->value : ($state['type'] ?? ''))?->getLabel() ?? 'Nieuwe sectie')
            ->schema([
                Select::make('type')->label('Sectietype')->options(ActivitySectionType::class)
                    ->default(ActivitySectionType::TitleText)->required()->live(),
                Toggle::make('is_enabled')->label('Zichtbaar')->default(true),
                ActivityContent::upload('image')->label('Afbeelding')
                    ->visible(fn (Get $get): bool => in_array($get('type'), ['image_text', ActivitySectionType::ImageText], true))->required(),
                Select::make('settings.image_position')->label('Positie afbeelding')
                    ->options(['left' => 'Links', 'right' => 'Rechts'])->default('left')
                    ->visible(fn (Get $get): bool => in_array($get('type'), ['image_text', ActivitySectionType::ImageText], true))->required(),
                ActivityContent::upload('settings.images')->label('Galerij afbeeldingen')->multiple()->reorderable()->maxFiles(30)
                    ->visible(fn (Get $get): bool => in_array($get('type'), ['gallery', ActivitySectionType::Gallery], true))->required(),
                Tabs::make('Vertalingen')->tabs(fn (Get $get): array => [
                    Tab::make('Nederlands')->schema([
                        Group::make()->relationship('dutchTranslation')->schema(self::sectionFields($get('type'))),
                    ]),
                    Tab::make('English')->schema([
                        Group::make()->relationship('englishTranslation')->schema(self::sectionFields($get('type'))),
                    ]),
                ])->columnSpanFull(),
            ])->columns(2);
    }

    private static function sectionFields(string|ActivitySectionType|null $type): array
    {
        $type = $type instanceof ActivitySectionType ? $type->value : $type;
        $fields = [];
        if ($type !== 'rich_text') {
            $fields[] = TextInput::make('title')->label('Titel')->maxLength(255)
                ->required(in_array($type, ['title_text', 'image_text', 'cta'], true));
        }
        if ($type !== 'gallery') {
            $fields[] = ActivityContent::editor()->required(in_array($type, ['title_text', 'image_text', 'rich_text', 'cta'], true));
        }
        if ($type === 'bullet_list') {
            $fields[] = Repeater::make('items')->label('Opsomming')->simple(TextInput::make('text')->required()->maxLength(500))
                ->defaultItems(0)->minItems(1)->required()->addActionLabel('Bullet toevoegen');
        }
        if ($type === 'gallery') {
            $fields[] = Textarea::make('caption')->label('Bijschrift bij galerij')->maxLength(1000);
        }
        if ($type === 'cta') {
            $fields[] = TextInput::make('button_text')->label('Knoptekst')->required()->maxLength(255);
            $fields[] = TextInput::make('button_url')->label('Link')->required()->maxLength(2048)
                ->rules(['regex:~^(?:https?://[^\s]+|/(?!/)[^\s]*)$~'])
                ->helperText('Een https:// of http:// URL, of een intern pad zoals /nl/contact.');
        }

        return $fields;
    }
}
