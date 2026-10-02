<?php

namespace App\Models;

use App\Enums\ActivitySectionType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class JobSection extends Model
{
    use HasFactory;

    protected $fillable = ['type', 'sort_order', 'is_enabled', 'image', 'settings'];

    protected $touches = ['job'];

    protected function casts(): array
    {
        return ['type' => ActivitySectionType::class, 'is_enabled' => 'boolean', 'settings' => 'array', 'sort_order' => 'integer'];
    }

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(JobSectionTranslation::class);
    }

    public function dutchTranslation(): HasOne
    {
        return $this->hasOne(JobSectionTranslation::class)->withAttributes(['locale' => 'nl']);
    }

    public function englishTranslation(): HasOne
    {
        return $this->hasOne(JobSectionTranslation::class)->withAttributes(['locale' => 'en']);
    }

    public function scopeEnabled(Builder $query): Builder
    {
        return $query->where('is_enabled', true);
    }
}
