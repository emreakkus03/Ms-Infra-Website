<?php

namespace App\Filament\Resources\Jobs\Schemas;

use App\Enums\ActivityStatus;
use App\Enums\EmploymentType;
use App\Filament\Schemas\ContentSectionForm;
use App\Filament\Schemas\LocalizedContentForm;
use App\Models\JobTranslation;
use App\Support\ActivityContent;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

class JobForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Vacature')->tabs([
                Tab::make('Algemeen')->schema([
                    ActivityContent::upload('hero_image')->label('Hero afbeelding'),
                    Select::make('status')->options(ActivityStatus::class)->default(ActivityStatus::Draft)->required(),
                    Select::make('employment_type')->label('Dienstverband')->options(EmploymentType::class)->nullable(),
                    TextInput::make('location')->label('Locatie / regio')->maxLength(255),
                    Toggle::make('is_featured')->label('Uitgelicht')->default(false),
                    TextInput::make('sort_order')->label('Volgorde')->integer()->minValue(0)->maxValue(4294967295)->default(0)->required(),
                ])->columns(2),
                Tab::make('Nederlands')->schema([LocalizedContentForm::translation('dutchTranslation', 'nl', JobTranslation::class, 'short_description')]),
                Tab::make('English')->schema([LocalizedContentForm::translation('englishTranslation', 'en', JobTranslation::class, 'short_description')]),
                Tab::make('Pagina inhoud')->schema([ContentSectionForm::make()]),
                Tab::make('SEO')->schema([
                    Group::make()->relationship('dutchTranslation')->schema(LocalizedContentForm::seo('Nederlands')),
                    Group::make()->relationship('englishTranslation')->schema(LocalizedContentForm::seo('English')),
                ]),
            ])->columnSpanFull(),
        ]);
    }
}
