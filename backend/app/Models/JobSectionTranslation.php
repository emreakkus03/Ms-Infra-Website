<?php

namespace App\Models;

use App\Enums\ContentLocale;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobSectionTranslation extends Model
{
    use HasFactory;

    protected $fillable = ['locale', 'title', 'subtitle', 'content', 'button_text', 'button_url', 'items', 'caption'];

    protected $touches = ['section'];

    protected function casts(): array
    {
        return ['locale' => ContentLocale::class, 'items' => 'array'];
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(JobSection::class, 'job_section_id');
    }
}
