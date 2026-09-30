<?php

namespace App\Http\Resources;

use App\Enums\ContentLocale;
use App\Support\ActivityContent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = ContentLocale::from($request->input('locale', 'nl'));
        $translation = $this->translations->firstWhere('locale', $locale);
        $alternateSlugs = $this->translations->mapWithKeys(fn ($translation): array => [$translation->locale->value => $translation->slug]);

        return [
            'id' => $this->id, 'locale' => $locale->value,
            'title' => $translation->title, 'slug' => $translation->slug,
            'description' => $translation->description, 'hero_image' => ActivityContent::imageUrl($this->hero_image),
            'is_featured' => $this->is_featured, 'sort_order' => $this->sort_order,
            'alternate_slugs' => (object) $alternateSlugs->all(),
            $this->mergeWhen($this->relationLoaded('sections'), fn (): array => [
                'seo_title' => $translation->seo_title, 'seo_description' => $translation->seo_description,
                'sections' => ActivitySectionResource::collection($this->sections),
                'updated_at' => $this->updated_at?->toIso8601String(),
            ]),
        ];
    }
}
