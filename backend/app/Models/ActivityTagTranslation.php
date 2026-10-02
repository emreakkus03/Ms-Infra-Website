<?php

namespace App\Models;

use App\Enums\ContentLocale;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityTagTranslation extends Model
{
    use HasFactory;

    protected $fillable = ['locale', 'label'];

    protected $touches = ['tag'];

    protected function casts(): array
    {
        return ['locale' => ContentLocale::class];
    }

    public function tag(): BelongsTo
    {
        return $this->belongsTo(ActivityTag::class, 'activity_tag_id');
    }
}
