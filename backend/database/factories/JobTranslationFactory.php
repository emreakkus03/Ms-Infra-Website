<?php

namespace Database\Factories;

use App\Models\Job;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobTranslationFactory extends Factory
{
    public function definition(): array
    {
        return ['job_id' => Job::factory(), 'locale' => 'nl', 'title' => fake()->sentence(3),
            'slug' => fake()->unique()->slug(), 'short_description' => fake()->sentence(), 'seo_title' => fake()->sentence(3), 'seo_description' => fake()->sentence()];
    }
}
