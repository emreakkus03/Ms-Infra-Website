<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum ActivitySectionType: string implements HasLabel
{
    case TitleText = 'title_text';
    case ImageText = 'image_text';
    case RichText = 'rich_text';
    case BulletList = 'bullet_list';
    case Gallery = 'gallery';
    case Cta = 'cta';

    public function getLabel(): string
    {
        return match ($this) {
            self::TitleText => 'Titel en tekst', self::ImageText => 'Afbeelding en tekst',
            self::RichText => 'Tekst', self::BulletList => 'Opsomming',
            self::Gallery => 'Fotogalerij', self::Cta => 'Call to action',
        };
    }
}
