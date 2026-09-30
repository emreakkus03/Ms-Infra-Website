<?php

namespace App\Filament\Resources\Activities\Pages;

use App\Filament\Resources\Activities\ActivityResource;
use Filament\Resources\Pages\CreateRecord;

class CreateActivity extends CreateRecord
{
    protected ?bool $hasDatabaseTransactions = true;

    protected static string $resource = ActivityResource::class;
}
