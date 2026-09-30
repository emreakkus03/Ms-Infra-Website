<?php

namespace Database\Factories;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityTranslationFactory extends Factory
{
    public function definition(): array
    {
        return ['activity_id' => Activity::factory(), 'locale' => 'nl', 'title' => fake()->sentence(3),
            'slug' => fake()->unique()->slug(), 'description' => fake()->sentence(), 'seo_title' => fake()->sentence(3), 'seo_description' => fake()->sentence()];
    }
}
