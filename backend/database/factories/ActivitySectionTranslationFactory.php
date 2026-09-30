<?php

namespace Database\Factories;

use App\Models\ActivitySection;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivitySectionTranslationFactory extends Factory
{
    public function definition(): array
    {
        return ['activity_section_id' => ActivitySection::factory(), 'locale' => 'nl', 'title' => fake()->sentence(3), 'content' => '<p>'.fake()->sentence().'</p>'];
    }
}
