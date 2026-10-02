<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum EmploymentType: string implements HasLabel
{
    case FullTime = 'full_time';
    case PartTime = 'part_time';
    case Temporary = 'temporary';
    case Internship = 'internship';

    public function getLabel(): string
    {
        return match ($this) {
            self::FullTime => 'Voltijds', self::PartTime => 'Deeltijds',
            self::Temporary => 'Tijdelijk', self::Internship => 'Stage',
        };
    }
}
