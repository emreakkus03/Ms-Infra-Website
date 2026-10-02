<?php

namespace Tests\Feature;

use App\Filament\Resources\Activities\Pages\CreateActivity;
use App\Filament\Resources\Activities\Pages\EditActivity;
use App\Models\Activity;
use App\Models\ActivityTag;
use App\Models\ActivityTagTranslation;
use App\Models\User;
use Filament\Facades\Filament;
use Illuminate\Support\Facades\DB;
use Livewire\Livewire;
use Tests\Concerns\UsesActivityDatabase;
use Tests\TestCase;

class ActivityTagTest extends TestCase
{
    use UsesActivityDatabase;

    public function test_list_and_detail_return_ordered_labels_for_only_the_requested_locale(): void
    {
        $activity = Activity::factory()->published()->translated()->create();
        foreach ([20 => ['Water', 'Water'], 10 => ['Elektriciteit', 'Electricity']] as $order => $labels) {
            $tag = ActivityTag::factory()->for($activity)->create(['sort_order' => $order]);
            foreach (['nl', 'en'] as $index => $locale) {
                ActivityTagTranslation::factory()->create(['activity_tag_id' => $tag->id, 'locale' => $locale, 'label' => $labels[$index]]);
            }
        }
        $missing = ActivityTag::factory()->for($activity)->create(['sort_order' => 30]);
        ActivityTagTranslation::factory()->create(['activity_tag_id' => $missing->id, 'label' => 'Alleen NL']);
        foreach (['nl' => ['Elektriciteit', 'Water', 'Alleen NL'], 'en' => ['Electricity', 'Water']] as $locale => $labels) {
            $slug = $activity->translations()->where('locale', $locale)->firstOrFail()->slug;
            $this->getJson('/api/activities?locale='.$locale)->assertOk()->assertJsonPath('data.0.tags', $labels);
            $this->getJson('/api/activities/'.$slug.'?locale='.$locale)->assertOk()->assertJsonPath('data.tags', $labels);
        }
    }

    public function test_activities_without_tags_return_empty_arrays(): void
    {
        $activity = Activity::factory()->published()->translated()->create();
        $this->getJson('/api/activities')->assertOk()->assertJsonPath('data.0.tags', []);
        $this->getJson('/api/activities/'.$activity->dutchTranslation->slug)->assertOk()->assertJsonPath('data.tags', []);
    }

    public function test_tags_are_created_reordered_edited_and_deleted_in_filament(): void
    {
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        $this->actingAs(User::factory()->create());
        Livewire::test(CreateActivity::class)->fillForm([
            'status' => 'draft', 'sort_order' => 0,
            'dutchTranslation' => ['title' => 'Nutsleidingen', 'slug' => 'nutsleidingen'],
            'englishTranslation' => ['title' => 'Utilities', 'slug' => 'utilities'],
            'tags' => [
                ['dutchTranslation' => ['label' => 'Gas'], 'englishTranslation' => ['label' => 'Gas']],
                ['dutchTranslation' => ['label' => 'Elektriciteit'], 'englishTranslation' => ['label' => 'Electricity']],
            ],
        ])->call('create')->assertHasNoFormErrors();
        $activity = Activity::firstOrFail();
        $tags = $activity->tags;
        $this->assertCount(2, $tags);
        $this->assertSame('Electricity', $tags[1]->englishTranslation->label);
        $page = Livewire::test(EditActivity::class, ['record' => $activity->id]);
        $state = array_reverse($page->get('data.tags'), true);
        $state['record-'.$tags[1]->id]['englishTranslation']['label'] = 'Power';
        $page->set('data.tags', $state)->call('save')->assertHasNoFormErrors();
        $this->assertSame($tags[1]->id, $activity->tags()->first()->id);
        $this->assertSame('Power', $tags[1]->fresh()->englishTranslation->label);
        $this->assertSame('Elektriciteit', $tags[1]->fresh()->dutchTranslation->label);
        unset($state['record-'.$tags[0]->id]);
        $page->set('data.tags', $state)->call('save')->assertHasNoFormErrors();
        $this->assertDatabaseMissing('activity_tag_translations', ['activity_tag_id' => $tags[0]->id]);
        $page->set('data.tags', [])->call('save')->assertHasNoFormErrors();
        $this->assertSame(0, $activity->tags()->count());
    }

    public function test_tag_labels_require_both_languages_and_have_a_length_limit(): void
    {
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        $this->actingAs(User::factory()->create());
        $activity = Activity::factory()->translated()->create();
        Livewire::test(EditActivity::class, ['record' => $activity->id])->fillForm([
            'tags' => [['dutchTranslation' => ['label' => str_repeat('x', 61)], 'englishTranslation' => ['label' => '']]],
        ])->call('save')->assertHasFormErrors(['tags.0.dutchTranslation.label' => 'max', 'tags.0.englishTranslation.label' => 'required']);
        $this->assertDatabaseCount('activity_tags', 0);
    }

    public function test_activity_deletion_cascades_to_tags_and_translations(): void
    {
        $activity = Activity::factory()->create();
        ActivityTag::factory()->for($activity)->has(ActivityTagTranslation::factory(), 'translations')->create();
        $activity->delete();
        $this->assertDatabaseCount('activity_tags', 0);
        $this->assertDatabaseCount('activity_tag_translations', 0);
    }

    public function test_query_count_does_not_grow_with_tags(): void
    {
        $activity = Activity::factory()->published()->translated()->create();
        ActivityTag::factory()->for($activity)->has(ActivityTagTranslation::factory(), 'translations')->create();
        $url = '/api/activities/'.$activity->dutchTranslation->slug;
        foreach (['/api/activities', $url] as $endpoint) {
            DB::enableQueryLog();
            DB::flushQueryLog();
            $this->getJson($endpoint)->assertOk();
            $initial = count(DB::getQueryLog());
            DB::disableQueryLog();
            ActivityTag::factory()->for($activity)->has(ActivityTagTranslation::factory(), 'translations')->count(10)->create();
            DB::enableQueryLog();
            DB::flushQueryLog();
            $this->getJson($endpoint)->assertOk();
            $this->assertSame($initial, count(DB::getQueryLog()));
            DB::disableQueryLog();
        }
    }
}
