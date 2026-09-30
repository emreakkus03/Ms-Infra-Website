<?php

namespace Tests\Feature;

use App\Filament\Resources\Activities\Pages\CreateActivity;
use App\Filament\Resources\Activities\Pages\EditActivity;
use App\Filament\Resources\Activities\Pages\ListActivities;
use App\Models\Activity;
use App\Models\User;
use Filament\Facades\Filament;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\Concerns\UsesActivityDatabase;
use Tests\TestCase;

class ActivityAdminTest extends TestCase
{
    use UsesActivityDatabase { setUp as setUpActivityDatabase; }

    protected function setUp(): void
    {
        $this->setUpActivityDatabase();
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        $this->actingAs(User::factory()->create());
    }

    private function formData(): array
    {
        return [
            'status' => 'published', 'sort_order' => 3, 'is_featured' => true,
            'dutchTranslation' => ['title' => 'Nutsleidingen', 'slug' => 'nutsleidingen', 'description' => 'NL omschrijving', 'seo_title' => 'NL SEO'],
            'englishTranslation' => ['title' => 'Utilities', 'slug' => 'utilities', 'description' => 'EN description', 'seo_title' => 'EN SEO'],
        ];
    }

    public function test_create_and_edit_persist_both_translations_and_seo(): void
    {
        Livewire::test(CreateActivity::class)->fillForm($this->formData())->call('create')->assertHasNoFormErrors();
        $activity = Activity::firstOrFail();
        $this->assertSame('nutsleidingen', $activity->dutchTranslation->slug);
        $this->assertSame('utilities', $activity->englishTranslation->slug);
        $this->assertSame('NL SEO', $activity->dutchTranslation->seo_title);
        $this->assertSame('EN SEO', $activity->englishTranslation->seo_title);
        Livewire::test(EditActivity::class, ['record' => $activity->id])->fillForm(['englishTranslation' => [
            'title' => 'Utility installation', 'slug' => 'utilities', 'description' => 'Updated', 'seo_title' => 'Updated SEO',
        ]])->call('save')->assertHasNoFormErrors();
        $activity->refresh();
        $this->assertSame(2, $activity->translations()->count());
        $this->assertSame('Updated SEO', $activity->englishTranslation->seo_title);
        $this->assertSame('NL SEO', $activity->dutchTranslation->seo_title);
        Livewire::test(ListActivities::class)->assertCanSeeTableRecords([$activity]);
    }

    public function test_title_generates_only_its_own_slug_and_preserves_custom_slug(): void
    {
        $page = Livewire::test(CreateActivity::class)
            ->set('data.dutchTranslation.title', 'Aanleg van nutsleidingen')
            ->assertSet('data.dutchTranslation.slug', 'aanleg-van-nutsleidingen')
            ->set('data.englishTranslation.title', 'Utility network installation')
            ->assertSet('data.englishTranslation.slug', 'utility-network-installation')
            ->assertSet('data.dutchTranslation.slug', 'aanleg-van-nutsleidingen');
        $page->set('data.dutchTranslation.slug', 'handmatige-slug')->set('data.dutchTranslation.title', 'Nieuwe titel')
            ->assertSet('data.dutchTranslation.slug', 'handmatige-slug');
    }

    public function test_slug_uniqueness_is_scoped_to_locale(): void
    {
        Activity::factory()->hasTranslations(1, ['locale' => 'nl', 'slug' => 'nutsleidingen'])->create();
        Livewire::test(CreateActivity::class)->fillForm($this->formData())->call('create')
            ->assertHasFormErrors(['dutchTranslation.slug' => 'unique']);
        $data = $this->formData();
        $data['dutchTranslation']['slug'] = 'andere-slug';
        $data['englishTranslation']['slug'] = 'nutsleidingen';
        Livewire::test(CreateActivity::class)->fillForm($data)->call('create')->assertHasNoFormErrors();
    }

    public function test_nested_sections_and_bullets_are_saved_reordered_and_deleted(): void
    {
        $data = $this->formData();
        $data['sections'] = [
            ['type' => 'bullet_list', 'is_enabled' => true,
                'dutchTranslation' => ['title' => 'NL lijst', 'items' => [['text' => 'Eerst'], ['text' => 'Tweede']]],
                'englishTranslation' => ['title' => 'EN list', 'items' => [['text' => 'First'], ['text' => 'Second']]]],
            ['type' => 'cta', 'is_enabled' => false,
                'dutchTranslation' => ['title' => 'NL CTA', 'content' => '<p>NL tekst</p>', 'button_text' => 'Contact', 'button_url' => '/nl/contact'],
                'englishTranslation' => ['title' => 'EN CTA', 'content' => '<p>EN text</p>', 'button_text' => 'Contact', 'button_url' => '/en/contact']],
        ];
        Livewire::test(CreateActivity::class)->fillForm($data)->call('create')->assertHasNoFormErrors();
        $activity = Activity::firstOrFail();
        $sections = $activity->sections;
        $this->assertCount(2, $sections);
        $this->assertSame(['Eerst', 'Tweede'], $sections[0]->dutchTranslation->items);
        $this->assertSame(['First', 'Second'], $sections[0]->englishTranslation->items);
        $this->assertFalse($sections[1]->is_enabled);
        $page = Livewire::test(EditActivity::class, ['record' => $activity->id]);
        $state = $page->get('data.sections');
        $state = array_reverse($state, true);
        $page->set('data.sections', $state)->call('save')->assertHasNoFormErrors();
        $this->assertSame($sections[1]->id, $activity->sections()->first()->id);
        unset($state['record-'.$sections[0]->id]);
        $page->set('data.sections', $state)->call('save')->assertHasNoFormErrors();
        $this->assertSame(1, $activity->sections()->count());
        $this->assertDatabaseMissing('activity_section_translations', ['activity_section_id' => $sections[0]->id]);
    }

    public function test_all_section_forms_save_and_cta_rejects_unsafe_urls(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('activities/test.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII='));
        $data = $this->formData();
        foreach (['title_text', 'image_text', 'rich_text', 'gallery', 'cta'] as $type) {
            $translation = ['title' => 'Titel', 'content' => '<p>Inhoud</p>', 'button_text' => 'Contact', 'button_url' => '/contact', 'caption' => 'Bijschrift'];
            $data['sections'][] = ['type' => $type, 'is_enabled' => true, 'image' => ['activities/test.png'],
                'settings' => ['image_position' => 'right', 'images' => ['activities/test.png']],
                'dutchTranslation' => $translation, 'englishTranslation' => $translation];
        }
        Livewire::test(CreateActivity::class)->fillForm($data)->call('create')->assertHasNoFormErrors();
        $activity = Activity::firstOrFail();
        $this->assertCount(5, $activity->sections);
        $this->assertSame(['activities/test.png'], $activity->sections[3]->settings['images']);
        $this->assertSame('right', $activity->sections[1]->settings['image_position']);
        $this->assertSame('activities/test.png', $activity->sections[1]->image);
        $page = Livewire::test(EditActivity::class, ['record' => $activity->id]);
        $state = $page->get('data.sections');
        $key = 'record-'.$activity->sections[4]->id;
        $state[$key]['englishTranslation']['button_url'] = 'javascript:alert(1)';
        $page->set('data.sections', $state)->call('save')->assertHasFormErrors(['sections.'.$key.'.englishTranslation.button_url']);
        $this->assertSame('/contact', $activity->sections[4]->englishTranslation->button_url);
    }
}
