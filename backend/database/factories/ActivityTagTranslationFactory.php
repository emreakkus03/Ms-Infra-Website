<?php

namespace Database\Factories;

use App\Models\ActivityTag;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityTagTranslationFactory extends Factory
{
    public function definition(): array
    {
        return ['activity_tag_id' => ActivityTag::factory(), 'locale' => 'nl', 'label' => fake()->word()];
    }
}
