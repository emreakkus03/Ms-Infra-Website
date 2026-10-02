<?php

namespace Database\Factories;

use App\Enums\ActivitySectionType;
use App\Models\Job;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobSectionFactory extends Factory
{
    public function definition(): array
    {
        return ['job_id' => Job::factory(), 'type' => ActivitySectionType::TitleText, 'sort_order' => 0, 'is_enabled' => true];
    }
}
