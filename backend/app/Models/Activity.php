<?php

namespace App\Models;

use App\Enums\ActivityStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = ['hero_image', 'status', 'is_featured', 'sort_order'];

    protected function casts(): array
    {
        return ['status' => ActivityStatus::class, 'is_featured' => 'boolean', 'sort_order' => 'integer'];
    }

    public function translations(): HasMany
    {
        return $this->hasMany(ActivityTranslation::class);
    }

    public function dutchTranslation(): HasOne
    {
        return $this->hasOne(ActivityTranslation::class)->withAttributes(['locale' => 'nl']);
    }

    public function englishTranslation(): HasOne
    {
        return $this->hasOne(ActivityTranslation::class)->withAttributes(['locale' => 'en']);
    }

    public function sections(): HasMany
    {
        return $this->hasMany(ActivitySection::class)->orderBy('sort_order')->orderBy('id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', ActivityStatus::Published);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
