<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\ActivitySection;
use App\Models\ActivitySectionTranslation;
use App\Support\ActivityContent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\UsesActivityDatabase;
use Tests\TestCase;

class ActivityApiTest extends TestCase
{
    use UsesActivityDatabase;

    public function test_list_only_contains_published_translated_activities_in_order(): void
    {
        Activity::factory()->translated()->create();
        Activity::factory()->published()->create();
        $last = Activity::factory()->published()->translated()->create(['sort_order' => 20]);
        $first = Activity::factory()->published()->translated()->create(['sort_order' => 1]);
        $this->getJson('/api/activities?locale=nl')->assertOk()->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $first->id)->assertJsonPath('data.1.id', $last->id)
            ->assertJsonPath('data.0.title', $first->dutchTranslation->title)
            ->assertJsonMissingPath('data.0.sections');
    }

    public function test_localized_slug_lookup_and_alternate_slugs_are_language_specific(): void
    {
        $activity = Activity::factory()->published()->translated()->create();
        $nl = $activity->dutchTranslation;
        $en = $activity->englishTranslation;
        foreach (['nl' => $nl, 'en' => $en] as $locale => $translation) {
            $this->getJson('/api/activities/'.$translation->slug.'?locale='.$locale)->assertOk()
                ->assertJsonPath('data.title', $translation->title)->assertJsonPath('data.description', $translation->description)
                ->assertJsonPath('data.seo_title', $translation->seo_title)->assertJsonPath('data.locale', $locale)
                ->assertJsonPath('data.alternate_slugs.nl', $nl->slug)->assertJsonPath('data.alternate_slugs.en', $en->slug);
            $this->getJson('/api/activities?locale='.$locale)->assertJsonPath('data.0.title', $translation->title)
                ->assertJsonPath('data.0.alternate_slugs.en', $en->slug);
        }
        $this->getJson('/api/activities/'.$nl->slug.'?locale=en')->assertNotFound();
        $this->getJson('/api/activities/'.$en->slug.'?locale=nl')->assertNotFound();
    }

    public function test_draft_and_unknown_details_are_not_public(): void
    {
        $activity = Activity::factory()->translated()->create();
        $this->getJson('/api/activities/'.$activity->dutchTranslation->slug)->assertNotFound();
        $this->getJson('/api/activities/missing')->assertNotFound();
    }

    public function test_sections_are_ordered_enabled_and_never_fall_back_to_another_language(): void
    {
        $activity = Activity::factory()->published()->translated()->create();
        foreach ([20, 1, 10] as $order) {
            $section = ActivitySection::factory()->for($activity)->create(['sort_order' => $order, 'is_enabled' => $order !== 10]);
            foreach (['nl', 'en'] as $locale) {
                ActivitySectionTranslation::factory()->create(['activity_section_id' => $section->id, 'locale' => $locale,
                    'title' => $locale.' '.$order, 'content' => '<p>'.$locale.' content '.$order.'</p>']);
            }
        }
        $missing = ActivitySection::factory()->for($activity)->create(['sort_order' => 30]);
        ActivitySectionTranslation::factory()->create(['activity_section_id' => $missing->id, 'locale' => 'nl']);
        foreach (['nl' => 3, 'en' => 2] as $locale => $count) {
            $translation = $activity->translations()->where('locale', $locale)->first();
            $this->getJson('/api/activities/'.$translation->slug.'?locale='.$locale)->assertOk()
                ->assertJsonCount($count, 'data.sections')->assertJsonPath('data.sections.0.title', $locale.' 1')
                ->assertJsonPath('data.sections.1.title', $locale.' 20')
                ->assertJsonPath('data.sections.0.content', '<p>'.$locale.' content 1</p>');
        }
    }

    public function test_invalid_locales_return_json_validation_errors_and_default_is_dutch(): void
    {
        foreach (['de', '', 'nl[]'] as $locale) {
            $this->get('/api/activities?locale='.urlencode($locale))->assertStatus(422)->assertJsonValidationErrors('locale');
        }
        $this->getJson('/api/activities?locale[]=nl')->assertUnprocessable();
        $activity = Activity::factory()->published()->translated()->create();
        $this->getJson('/api/activities')->assertJsonPath('data.0.locale', 'nl');
        $this->getJson('/api/activities/'.$activity->dutchTranslation->slug.'?locale=de')->assertUnprocessable();
    }

    public function test_section_types_have_frontend_ready_payloads_and_storage_urls(): void
    {
        Storage::fake('activity-media');
        config(['activities.disk' => 'activity-media']);
        $activity = Activity::factory()->published()->translated()->create(['hero_image' => 'activities/hero.jpg']);
        foreach (['title_text', 'image_text', 'rich_text', 'bullet_list', 'gallery', 'cta'] as $order => $type) {
            $section = ActivitySection::factory()->for($activity)->create(['type' => $type, 'sort_order' => $order,
                'image' => 'activities/image.jpg', 'settings' => ['image_position' => 'right', 'images' => ['activities/one.jpg', 'activities/two.jpg']]]);
            ActivitySectionTranslation::factory()->create(['activity_section_id' => $section->id, 'items' => ['Eerste', 'Tweede'],
                'button_text' => 'Contact', 'button_url' => '/nl/contact']);
        }
        $this->getJson('/api/activities/'.$activity->dutchTranslation->slug)->assertOk()
            ->assertJsonPath('data.hero_image', Storage::disk('activity-media')->url('activities/hero.jpg'))
            ->assertJsonPath('data.sections.1.image_position', 'right')
            ->assertJsonPath('data.sections.3.items', ['Eerste', 'Tweede'])
            ->assertJsonPath('data.sections.4.images.1.url', Storage::disk('activity-media')->url('activities/two.jpg'))
            ->assertJsonPath('data.sections.5.button_url', '/nl/contact');
    }

    public function test_queries_do_not_grow_with_activity_count(): void
    {
        Activity::factory()->published()->translated()->create();
        DB::enableQueryLog();
        $this->getJson('/api/activities')->assertOk();
        $initial = count(DB::getQueryLog());
        DB::disableQueryLog();
        Activity::factory()->published()->translated()->count(10)->create();
        DB::flushQueryLog();
        DB::enableQueryLog();
        $this->getJson('/api/activities')->assertOk();
        $this->assertSame($initial, count(DB::getQueryLog()));
        DB::disableQueryLog();
    }

    public function test_rich_content_is_sanitized_and_brand_colors_render(): void
    {
        $html = ActivityContent::html('<p><span class="color" data-color="brand">Rood</span><script>alert(1)</script><a href="javascript:alert(1)">Link</a></p>');
        $this->assertStringNotContainsString('<script', $html);
        $this->assertStringNotContainsString('javascript:', $html);
        $this->assertStringContainsString('#B81C31', $html);
    }

    public function test_detail_query_count_does_not_grow_with_sections(): void
    {
        $activity = Activity::factory()->published()->translated()->create();
        $section = ActivitySection::factory()->for($activity)->create();
        ActivitySectionTranslation::factory()->create(['activity_section_id' => $section->id]);
        $url = '/api/activities/'.$activity->dutchTranslation->slug;
        DB::enableQueryLog();
        $this->getJson($url)->assertOk();
        $initial = count(DB::getQueryLog());
        DB::disableQueryLog();
        ActivitySection::factory()->for($activity)
            ->has(ActivitySectionTranslation::factory(), 'translations')->count(10)->create();
        DB::flushQueryLog();
        DB::enableQueryLog();
        $this->getJson($url)->assertOk()->assertJsonCount(11, 'data.sections');
        $this->assertSame($initial, count(DB::getQueryLog()));
        DB::disableQueryLog();
    }
}
