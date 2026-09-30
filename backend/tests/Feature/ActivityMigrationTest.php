<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\ActivitySection;
use App\Models\ActivitySectionTranslation;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ActivityMigrationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        if (config('database.default') !== 'sqlite' || config('database.connections.sqlite.database') !== ':memory:') {
            throw new \RuntimeException('Activity tests require SQLite :memory:.');
        }
        (require database_path('migrations/2026_09_28_124356_create_activities_table.php'))->up();
    }

    private function normalize(): void
    {
        (require database_path('migrations/2026_09_28_125315_normalize_activity_content.php'))->up();
    }

    public function test_existing_content_is_preserved_and_localized_with_collision_safe_slugs(): void
    {
        foreach (['bestaande-slug', 'andere-slug'] as $slug) {
            DB::table('activities')->insert(['slug' => $slug, 'title' => json_encode(['nl' => 'Nutsleidingen', 'en' => 'Utilities']),
                'description' => json_encode(['nl' => 'NL tekst', 'en' => 'EN text']), 'sections' => '[]',
                'seo_title' => json_encode(['nl' => 'NL SEO', 'en' => 'EN SEO'])]);
        }
        $this->normalize();
        $this->assertDatabaseHas('activity_translations', ['activity_id' => 1, 'locale' => 'nl', 'slug' => 'bestaande-slug', 'description' => 'NL tekst']);
        $this->assertDatabaseHas('activity_translations', ['activity_id' => 1, 'locale' => 'en', 'slug' => 'utilities', 'seo_title' => 'EN SEO']);
        $this->assertDatabaseHas('activity_translations', ['activity_id' => 2, 'locale' => 'en', 'slug' => 'utilities-2-1']);
        $this->assertDatabaseHas('activities', ['slug' => 'bestaande-slug', 'legacy_sections' => '[]']);
        $this->assertDatabaseCount('activity_translations', 4);
    }

    public function test_unknown_legacy_sections_stop_before_any_schema_changes(): void
    {
        DB::table('activities')->insert(['slug' => 'legacy', 'title' => '{"nl":"Legacy"}', 'sections' => '[{"custom":"content"}]']);
        try {
            $this->normalize();
            $this->fail('Expected legacy section guard.');
        } catch (\RuntimeException $exception) {
            $this->assertStringContainsString('legacy sections', $exception->getMessage());
        }
        $this->assertFalse(Schema::hasTable('activity_translations'));
        $this->assertDatabaseHas('activities', ['sections' => '[{"custom":"content"}]']);
    }

    public function test_locale_and_slug_constraints_and_cascading_deletes(): void
    {
        $this->normalize();
        $activity = Activity::factory()->translated()->create();
        $section = ActivitySection::factory()->for($activity)->create();
        ActivitySectionTranslation::factory()->create(['activity_section_id' => $section->id]);
        $activity->delete();
        $this->assertDatabaseCount('activity_translations', 0);
        $this->assertDatabaseCount('activity_sections', 0);
        $this->assertDatabaseCount('activity_section_translations', 0);
        $activity = Activity::factory()->translated()->create();
        foreach ([['locale' => 'nl', 'slug' => 'different'], ['locale' => 'de', 'slug' => 'german']] as $attributes) {
            try {
                DB::table('activity_translations')->insert($attributes + ['activity_id' => $activity->id, 'title' => 'Invalid']);
                $this->fail('Expected database constraint.');
            } catch (QueryException) {
                $this->assertTrue(true);
            }
        }
        $other = Activity::factory()->create();
        $this->expectException(QueryException::class);
        DB::table('activity_translations')->insert(['activity_id' => $other->id, 'locale' => 'nl', 'title' => 'Duplicate', 'slug' => $activity->dutchTranslation->slug]);
    }
}
