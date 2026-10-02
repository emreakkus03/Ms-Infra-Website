<?php

namespace App\Models;

use App\Enums\ContentLocale;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobTranslation extends Model
{
    use HasFactory;

    protected $fillable = ['locale', 'title', 'slug', 'short_description', 'seo_title', 'seo_description'];

    protected $touches = ['job'];

    protected function casts(): array
    {
        return ['locale' => ContentLocale::class];
    }

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }
}
