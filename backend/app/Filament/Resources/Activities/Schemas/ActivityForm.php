<?php

namespace App\Filament\Resources\Activities\Schemas;

use App\Enums\ActivitySectionType;
use App\Enums\ActivityStatus;
use App\Models\ActivityTranslation;
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
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Unique;

class ActivityForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Activiteit')->tabs([
                Tab::make('Algemeen')->schema([
                    ActivityContent::upload('hero_image')->label('Hero afbeelding'),
                    Select::make('status')->options(ActivityStatus::class)->default(ActivityStatus::Draft)->required(),
                    Toggle::make('is_featured')->label('Tonen op homepage')->default(false),
                    TextInput::make('sort_order')->label('Volgorde')->integer()->minValue(0)->maxValue(4294967295)->default(0)->required(),
                ])->columns(2),
                Tab::make('Nederlands')->schema([self::translation('dutchTranslation', 'nl')]),
                Tab::make('English')->schema([self::translation('englishTranslation', 'en')]),
                Tab::make('Pagina inhoud')->schema([self::sections()]),
                Tab::make('SEO')->schema([
                    Group::make()->relationship('dutchTranslation')->schema(self::seo('Nederlands')),
                    Group::make()->relationship('englishTranslation')->schema(self::seo('English')),
                ]),
            ])->columnSpanFull(),
        ]);
    }

    private static function translation(string $relationship, string $locale): Group
    {
        return Group::make()->relationship($relationship)->schema([
            TextInput::make('title')->label('Titel')->required()->maxLength(255)->live(onBlur: true)
                ->afterStateUpdated(function (Get $get, Set $set, ?string $old, ?string $state): void {
                    if (blank($get('slug')) || $get('slug') === Str::slug($old ?? '')) {
                        $set('slug', Str::slug($state ?? ''));
                    }
                }),
            TextInput::make('slug')->required()->maxLength(255)->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                ->unique(table: ActivityTranslation::class, column: 'slug', ignoreRecord: true,
                    modifyRuleUsing: fn (Unique $rule): Unique => $rule->where('locale', $locale)),
            Textarea::make('description')->label('Korte beschrijving')->rows(3)->maxLength(500),
        ]);
    }

    private static function seo(string $label): array
    {
        return [
            TextInput::make('seo_title')->label($label.' SEO title')->maxLength(255),
            Textarea::make('seo_description')->label($label.' SEO description')->rows(3)->maxLength(500),
        ];
    }

    private static function sections(): Repeater
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
