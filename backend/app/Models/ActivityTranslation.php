<?php

namespace App\Models;

use App\Enums\ContentLocale;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityTranslation extends Model
{
    use HasFactory;

    protected $fillable = ['locale', 'title', 'slug', 'description', 'seo_title', 'seo_description'];

    protected $touches = ['activity'];

    protected function casts(): array
    {
        return ['locale' => ContentLocale::class];
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }
}
