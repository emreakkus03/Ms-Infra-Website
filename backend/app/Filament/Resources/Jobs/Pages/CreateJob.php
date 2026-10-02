<?php

namespace App\Filament\Resources\Jobs\Pages;

use App\Filament\Resources\Jobs\JobResource;
use Filament\Resources\Pages\CreateRecord;

class CreateJob extends CreateRecord
{
    protected ?bool $hasDatabaseTransactions = true;

    protected static string $resource = JobResource::class;
}
