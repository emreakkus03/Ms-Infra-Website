<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ActivityTag extends Model
{
    use HasFactory;

    protected $fillable = ['sort_order'];

    protected $touches = ['activity'];

    protected function casts(): array
    {
        return ['sort_order' => 'integer'];
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(ActivityTagTranslation::class);
    }

    public function dutchTranslation(): HasOne
    {
        return $this->hasOne(ActivityTagTranslation::class)->withAttributes(['locale' => 'nl']);
    }

    public function englishTranslation(): HasOne
    {
        return $this->hasOne(ActivityTagTranslation::class)->withAttributes(['locale' => 'en']);
    }
}
