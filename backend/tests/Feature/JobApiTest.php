<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\Job;
use App\Models\JobSection;
use App\Models\JobSectionTranslation;
use App\Support\ActivityContent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\UsesActivityDatabase;
use Tests\TestCase;

class JobApiTest extends TestCase
{
    use UsesActivityDatabase;

    public function test_list_only_contains_published_translated_jobs_in_order(): void
    {
        Job::factory()->translated()->create();
        Job::factory()->published()->create();
        $last = Job::factory()->published()->translated()->create(['sort_order' => 20]);
        $first = Job::factory()->published()->translated()->create(['sort_order' => 1]);
        $this->getJson('/api/jobs?locale=nl')->assertOk()->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $first->id)->assertJsonPath('data.1.id', $last->id)
            ->assertJsonPath('data.0.title', $first->dutchTranslation->title)
            ->assertJsonMissingPath('data.0.sections');
    }

    public function test_localized_slug_lookup_and_alternate_slugs_are_language_specific(): void
    {
        $job = Job::factory()->published()->translated()->create();
        $nl = $job->dutchTranslation;
        $en = $job->englishTranslation;
        foreach (['nl' => $nl, 'en' => $en] as $locale => $translation) {
            $this->getJson('/api/jobs/'.$translation->slug.'?locale='.$locale)->assertOk()
                ->assertJsonPath('data.title', $translation->title)->assertJsonPath('data.short_description', $translation->short_description)
                ->assertJsonPath('data.seo_title', $translation->seo_title)->assertJsonPath('data.locale', $locale)
                ->assertJsonPath('data.alternate_slugs.nl', $nl->slug)->assertJsonPath('data.alternate_slugs.en', $en->slug);
            $this->getJson('/api/jobs?locale='.$locale)->assertJsonPath('data.0.title', $translation->title)
                ->assertJsonPath('data.0.alternate_slugs.en', $en->slug);
        }
        $this->getJson('/api/jobs/'.$nl->slug.'?locale=en')->assertNotFound();
        $this->getJson('/api/jobs/'.$en->slug.'?locale=nl')->assertNotFound();
    }

    public function test_draft_and_unknown_details_are_not_public(): void
    {
        $job = Job::factory()->translated()->create();
        $this->getJson('/api/jobs/'.$job->dutchTranslation->slug)->assertNotFound();
        $this->getJson('/api/jobs/missing')->assertNotFound();
    }

    public function test_sections_are_ordered_enabled_and_never_fall_back_to_another_language(): void
    {
        $job = Job::factory()->published()->translated()->create();
        foreach ([20, 1, 10] as $order) {
            $section = JobSection::factory()->for($job)->create(['sort_order' => $order, 'is_enabled' => $order !== 10]);
            foreach (['nl', 'en'] as $locale) {
                JobSectionTranslation::factory()->create(['job_section_id' => $section->id, 'locale' => $locale,
                    'title' => $locale.' '.$order, 'content' => '<p>'.$locale.' content '.$order.'</p>']);
            }
        }
        $missing = JobSection::factory()->for($job)->create(['sort_order' => 30]);
        JobSectionTranslation::factory()->create(['job_section_id' => $missing->id, 'locale' => 'nl']);
        foreach (['nl' => 3, 'en' => 2] as $locale => $count) {
            $translation = $job->translations()->where('locale', $locale)->first();
            $this->getJson('/api/jobs/'.$translation->slug.'?locale='.$locale)->assertOk()
                ->assertJsonCount($count, 'data.sections')->assertJsonPath('data.sections.0.title', $locale.' 1')
                ->assertJsonPath('data.sections.1.title', $locale.' 20')
                ->assertJsonPath('data.sections.0.content', '<p>'.$locale.' content 1</p>');
        }
    }

    public function test_invalid_locales_return_json_validation_errors_and_default_is_dutch(): void
    {
        foreach (['de', '', 'nl[]'] as $locale) {
            $this->get('/api/jobs?locale='.urlencode($locale))->assertStatus(422)->assertJsonValidationErrors('locale');
        }
        $this->getJson('/api/jobs?locale[]=nl')->assertUnprocessable();
        $job = Job::factory()->published()->translated()->create();
        $this->getJson('/api/jobs')->assertJsonPath('data.0.locale', 'nl');
        $this->getJson('/api/jobs/'.$job->dutchTranslation->slug.'?locale=de')->assertUnprocessable();
    }

    public function test_section_types_have_frontend_ready_payloads_and_storage_urls(): void
    {
        Storage::fake('job-media');
        config(['activities.disk' => 'job-media']);
        $job = Job::factory()->published()->translated()->create(['hero_image' => 'jobs/hero.jpg']);
        foreach (['title_text', 'image_text', 'rich_text', 'bullet_list', 'gallery', 'cta'] as $order => $type) {
            $section = JobSection::factory()->for($job)->create(['type' => $type, 'sort_order' => $order,
                'image' => 'jobs/image.jpg', 'settings' => ['image_position' => 'right', 'images' => ['jobs/one.jpg', 'jobs/two.jpg']]]);
            JobSectionTranslation::factory()->create(['job_section_id' => $section->id, 'items' => ['Eerste', 'Tweede'],
                'button_text' => 'Contact', 'button_url' => '/nl/contact']);
        }
        $this->getJson('/api/jobs/'.$job->dutchTranslation->slug)->assertOk()
            ->assertJsonPath('data.hero_image', Storage::disk('job-media')->url('jobs/hero.jpg'))
            ->assertJsonPath('data.sections.1.image_position', 'right')
            ->assertJsonPath('data.sections.3.items', ['Eerste', 'Tweede'])
            ->assertJsonPath('data.sections.4.images.1.url', Storage::disk('job-media')->url('jobs/two.jpg'))
            ->assertJsonPath('data.sections.5.button_url', '/nl/contact');
    }

    public function test_queries_do_not_grow_with_job_count(): void
    {
        Job::factory()->published()->translated()->create();
        DB::enableQueryLog();
        $this->getJson('/api/jobs')->assertOk();
        $initial = count(DB::getQueryLog());
        DB::disableQueryLog();
        Job::factory()->published()->translated()->count(10)->create();
        DB::flushQueryLog();
        DB::enableQueryLog();
        $this->getJson('/api/jobs')->assertOk();
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
        $job = Job::factory()->published()->translated()->create();
        $section = JobSection::factory()->for($job)->create();
        JobSectionTranslation::factory()->create(['job_section_id' => $section->id]);
        $url = '/api/jobs/'.$job->dutchTranslation->slug;
        DB::enableQueryLog();
        $this->getJson($url)->assertOk();
        $initial = count(DB::getQueryLog());
        DB::disableQueryLog();
        JobSection::factory()->for($job)
            ->has(JobSectionTranslation::factory(), 'translations')->count(10)->create();
        DB::flushQueryLog();
        DB::enableQueryLog();
        $this->getJson($url)->assertOk()->assertJsonCount(11, 'data.sections');
        $this->assertSame($initial, count(DB::getQueryLog()));
        DB::disableQueryLog();
    }

    public function test_vacancy_metadata_and_queue_table_are_independent(): void
    {
        $job = Job::factory()->published()->translated()->create(['employment_type' => 'full_time', 'location' => 'Dendermonde']);
        $this->assertSame('vacancies', $job->getTable());
        $this->assertTrue(Schema::hasColumn('jobs', 'queue'));
        foreach (['/api/jobs?locale=en', '/api/jobs/'.$job->englishTranslation->slug.'?locale=en'] as $url) {
            $response = $this->getJson($url)->assertOk();
            $prefix = str_contains($url, '/api/jobs?') ? 'data.0' : 'data';
            $response->assertJsonPath($prefix.'.employment_type', 'full_time')->assertJsonPath($prefix.'.location', 'Dendermonde');
        }
    }

    public function test_deleting_a_job_cascades_without_touching_activities_or_queue(): void
    {
        $activity = Activity::factory()->translated()->create();
        $job = Job::factory()->translated()->create();
        JobSection::factory()->for($job)->has(JobSectionTranslation::factory(), 'translations')->create();
        $job->delete();
        $this->assertDatabaseCount('job_translations', 0);
        $this->assertDatabaseCount('job_sections', 0);
        $this->assertDatabaseCount('job_section_translations', 0);
        $this->assertDatabaseHas('activities', ['id' => $activity->id]);
    }

    public function test_api_sanitizes_rich_text_without_flattening_formatting(): void
    {
        $job = Job::factory()->published()->translated()->create();
        $section = JobSection::factory()->for($job)->create(['type' => 'rich_text']);
        JobSectionTranslation::factory()->create([
            'job_section_id' => $section->id,
            'content' => '<h2>Heading</h2><p style="position:fixed;text-align:center" onclick="alert(1)"><strong>Bold</strong><u>Underline</u></p><ul><li>Bullet</li></ul><iframe src="https://example.com"></iframe><script>alert(1)</script>',
        ]);
        $html = $this->getJson('/api/jobs/'.$job->dutchTranslation->slug)->assertOk()->json('data.sections.0.content');
        foreach (['<h2>Heading</h2>', '<strong>Bold</strong>', '<u>Underline</u>', '<ul><li>Bullet</li></ul>'] as $formatting) {
            $this->assertStringContainsString($formatting, $html);
        }
        foreach (['position:', 'onclick', '<script', '<iframe'] as $unsafe) {
            $this->assertStringNotContainsString($unsafe, $html);
        }
    }
}
