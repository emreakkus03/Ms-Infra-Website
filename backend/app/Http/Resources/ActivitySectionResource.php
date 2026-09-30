<?php

namespace App\Http\Resources;

use App\Enums\ActivitySectionType;
use App\Enums\ContentLocale;
use App\Support\ActivityContent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivitySectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $translation = $this->translations->firstWhere('locale', ContentLocale::from($request->input('locale', 'nl')));
        $text = ['title' => $translation->title, 'content' => ActivityContent::html($translation->content)];

        return ['id' => $this->id, 'type' => $this->type->value, 'sort_order' => $this->sort_order] + match ($this->type) {
            ActivitySectionType::TitleText => $text,
            ActivitySectionType::ImageText => $text + ['image' => ActivityContent::imageUrl($this->image), 'image_position' => $this->settings['image_position'] ?? 'left'],
            ActivitySectionType::RichText => ['content' => $text['content']],
            ActivitySectionType::BulletList => $text + ['items' => $translation->items ?? []],
            ActivitySectionType::Gallery => ['title' => $translation->title, 'caption' => $translation->caption,
                'images' => array_map(fn (string $path): array => ['url' => ActivityContent::imageUrl($path)], $this->settings['images'] ?? [])],
            ActivitySectionType::Cta => $text + ['button_text' => $translation->button_text, 'button_url' => $translation->button_url],
        };
    }
}
