<?php

namespace App\Models;

use App\Enums\ActivitySectionType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ActivitySection extends Model
{
    use HasFactory;

    protected $fillable = ['type', 'sort_order', 'is_enabled', 'image', 'settings'];

    protected $touches = ['activity'];

    protected function casts(): array
    {
        return ['type' => ActivitySectionType::class, 'is_enabled' => 'boolean', 'settings' => 'array', 'sort_order' => 'integer'];
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(ActivitySectionTranslation::class);
    }

    public function dutchTranslation(): HasOne
    {
        return $this->hasOne(ActivitySectionTranslation::class)->withAttributes(['locale' => 'nl']);
    }

    public function englishTranslation(): HasOne
    {
        return $this->hasOne(ActivitySectionTranslation::class)->withAttributes(['locale' => 'en']);
    }

    public function scopeEnabled(Builder $query): Builder
    {
        return $query->where('is_enabled', true);
    }
}
