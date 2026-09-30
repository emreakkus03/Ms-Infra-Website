<?php

namespace App\Filament\Resources\Activities\Tables;

use App\Enums\ActivityStatus;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ActivitiesTable
{
    public static function configure(Table $table): Table
    {
        return $table->modifyQueryUsing(fn (Builder $query) => $query->with('dutchTranslation'))
            ->columns([
                TextColumn::make('dutchTranslation.title')->label('Nederlandse titel')->searchable()->sortable(),
                TextColumn::make('dutchTranslation.slug')->label('Nederlandse slug')->searchable(),
                TextColumn::make('status')->badge(),
                IconColumn::make('is_featured')->label('Homepage')->boolean(),
                TextColumn::make('sort_order')->label('Volgorde')->sortable(),
                TextColumn::make('updated_at')->label('Bijgewerkt')->dateTime('d-m-Y H:i')->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->options(ActivityStatus::class),
                TernaryFilter::make('is_featured')->label('Homepage'),
            ])->defaultSort('sort_order')->reorderable('sort_order')->recordActions([EditAction::make()]);
    }
}
