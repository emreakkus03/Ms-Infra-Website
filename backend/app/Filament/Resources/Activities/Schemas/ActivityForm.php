<?php

namespace App\Filament\Resources\Activities\Schemas;

use App\Enums\ActivityStatus;
use App\Filament\Schemas\ContentSectionForm;
use App\Filament\Schemas\LocalizedContentForm;
use App\Support\ActivityContent;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

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
                Tab::make('Nederlands')->schema([LocalizedContentForm::translation('dutchTranslation', 'nl')]),
                Tab::make('English')->schema([LocalizedContentForm::translation('englishTranslation', 'en')]),
                Tab::make('Pagina inhoud')->schema([ContentSectionForm::make()]),
                Tab::make('SEO')->schema([
                    Group::make()->relationship('dutchTranslation')->schema(LocalizedContentForm::seo('Nederlands')),
                    Group::make()->relationship('englishTranslation')->schema(LocalizedContentForm::seo('English')),
                ]),
            ])->columnSpanFull(),
        ]);
    }
}
