<?php

namespace App\Support;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\RichEditor\RichContentRenderer;
use Filament\Forms\Components\RichEditor\TextColor;
use Illuminate\Support\Facades\Storage;

class ActivityContent
{
    public static function colors(): array
    {
        return [
            'brand' => TextColor::make('MS Infra rood', '#B81C31'),
            'dark' => TextColor::make('Donker', '#1E293B'),
            'gray' => TextColor::make('Grijs', '#64748B'),
            'white' => TextColor::make('Wit', '#FFFFFF'),
        ];
    }

    public static function editor(string $name = 'content'): RichEditor
    {
        return RichEditor::make($name)->label('Tekst')->textColors(self::colors())->customTextColors(false)
            ->fileAttachmentsDisk(config('activities.disk'))->fileAttachmentsDirectory('activities/content')->fileAttachmentsVisibility('public')
            ->toolbarButtons([
                ['h2', 'h3', 'h4'], ['bold', 'italic', 'underline', 'strike', 'textColor'],
                ['bulletList', 'orderedList', 'link', 'blockquote'],
                ['alignStart', 'alignCenter', 'alignEnd', 'alignJustify'], ['undo', 'redo'],
            ])->columnSpanFull();
    }

    public static function upload(string $name): FileUpload
    {
        return FileUpload::make($name)->image()->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->maxSize(10240)->disk(config('activities.disk'))->visibility('public')->directory('activities');
    }

    public static function imageUrl(?string $path): ?string
    {
        return filled($path) ? Storage::disk(config('activities.disk'))->url($path) : null;
    }

    public static function html(?string $content): ?string
    {
        return filled($content) ? RichContentRenderer::make($content)->textColors(self::colors())
            ->fileAttachmentsDisk(config('activities.disk'))->fileAttachmentsVisibility('public')->toHtml() : null;
    }
}
