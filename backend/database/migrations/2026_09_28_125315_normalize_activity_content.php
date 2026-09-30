<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // The original resource never defined a section format. Do not guess or discard existing content.
        DB::table('activities')->orderBy('id')->each(function (object $activity): void {
            foreach (['title', 'description', 'seo_title', 'seo_description'] as $field) {
                $values = json_decode($activity->{$field} ?? '{}', true, flags: JSON_THROW_ON_ERROR);
                if (! is_array($values)) {
                    throw new RuntimeException("Activity {$activity->id}: {$field} must contain localized values.");
                }
                foreach (['nl', 'en'] as $locale) {
                    $value = $values[$locale] ?? null;
                    if ($value !== null && (! is_string($value) || (in_array($field, ['title', 'seo_title'], true) && mb_strlen($value) > 255))) {
                        throw new RuntimeException("Activity {$activity->id}: invalid {$field} for {$locale}.");
                    }
                }
            }
            if (! empty(json_decode($activity->sections ?? 'null', true, flags: JSON_THROW_ON_ERROR))) {
                throw new RuntimeException("Activity {$activity->id} contains legacy sections. Map this content before running this migration.");
            }
        });

        Schema::create('activity_translations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('activity_id')->constrained()->cascadeOnDelete();
            $table->enum('locale', ['nl', 'en']);
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->timestamps();
            $table->unique(['activity_id', 'locale']);
            $table->unique(['locale', 'slug']);
        });
        Schema::create('activity_sections', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('activity_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['title_text', 'image_text', 'rich_text', 'bullet_list', 'gallery', 'cta']);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_enabled')->default(true);
            $table->string('image')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->index(['activity_id', 'is_enabled', 'sort_order']);
        });
        Schema::create('activity_section_translations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('activity_section_id')->constrained()->cascadeOnDelete();
            $table->enum('locale', ['nl', 'en']);
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->longText('content')->nullable();
            $table->string('button_text')->nullable();
            $table->string('button_url', 2048)->nullable();
            $table->json('items')->nullable();
            $table->text('caption')->nullable();
            $table->timestamps();
            $table->unique(['activity_section_id', 'locale'], 'section_locale_unique');
        });
        Schema::table('activities', function (Blueprint $table): void {
            // Retain the legacy columns as a data archive, but stop requiring them for new records.
            $table->renameColumn('sections', 'legacy_sections');
            $table->string('slug')->nullable()->change();
            $table->json('title')->nullable()->change();
            $table->index(['status', 'sort_order']);
            $table->index(['is_featured', 'sort_order']);
        });
        DB::transaction(function (): void {
            DB::table('activities')->orderBy('id')->each(function (object $activity): void {
                $titles = json_decode($activity->title ?? '{}', true, flags: JSON_THROW_ON_ERROR);
                foreach (['nl', 'en'] as $locale) {
                    if (empty($titles[$locale])) {
                        continue;
                    }
                    $base = $locale === 'nl' && filled($activity->slug)
                        ? $activity->slug : (Str::slug($titles[$locale]) ?: 'activity-'.$activity->id);
                    $slug = $base;
                    $suffix = 1;
                    while (DB::table('activity_translations')->where('locale', $locale)->where('slug', $slug)->exists()) {
                        $ending = '-'.$activity->id.'-'.$suffix++;
                        $slug = Str::substr($base, 0, 255 - strlen($ending)).$ending;
                    }
                    $data = ['activity_id' => $activity->id, 'locale' => $locale, 'title' => $titles[$locale], 'slug' => $slug,
                        'created_at' => $activity->created_at, 'updated_at' => $activity->updated_at];
                    foreach (['description', 'seo_title', 'seo_description'] as $field) {
                        $data[$field] = (json_decode($activity->{$field} ?? '{}', true, flags: JSON_THROW_ON_ERROR))[$locale] ?? null;
                    }
                    DB::table('activity_translations')->insert($data);
                }
            });
        });
    }

    public function down(): void
    {
        throw new RuntimeException('This data-preserving normalization cannot be rolled back automatically. Restore from a verified backup if required.');
    }
};
