<?php

namespace Database\Factories;

use App\Models\JobSection;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobSectionTranslationFactory extends Factory
{
    public function definition(): array
    {
        return ['job_section_id' => JobSection::factory(), 'locale' => 'nl', 'title' => fake()->sentence(3), 'content' => '<p>'.fake()->sentence().'</p>'];
    }
}
