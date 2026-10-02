<?php

namespace App\Models;

use App\Enums\ActivityStatus;
use App\Enums\EmploymentType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Job extends Model
{
    use HasFactory;

    protected $table = 'vacancies';

    protected $fillable = ['employment_type', 'location', 'hero_image', 'status', 'is_featured', 'sort_order'];

    protected function casts(): array
    {
        return ['employment_type' => EmploymentType::class, 'status' => ActivityStatus::class, 'is_featured' => 'boolean', 'sort_order' => 'integer'];
    }

    public function translations(): HasMany
    {
        return $this->hasMany(JobTranslation::class);
    }

    public function dutchTranslation(): HasOne
    {
        return $this->hasOne(JobTranslation::class)->withAttributes(['locale' => 'nl']);
    }

    public function englishTranslation(): HasOne
    {
        return $this->hasOne(JobTranslation::class)->withAttributes(['locale' => 'en']);
    }

    public function sections(): HasMany
    {
        return $this->hasMany(JobSection::class)->orderBy('sort_order')->orderBy('id');
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
