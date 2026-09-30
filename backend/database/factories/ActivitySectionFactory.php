<?php

namespace Database\Factories;

use App\Enums\ActivitySectionType;
use App\Models\Activity;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivitySectionFactory extends Factory
{
    public function definition(): array
    {
        return ['activity_id' => Activity::factory(), 'type' => ActivitySectionType::TitleText, 'sort_order' => 0, 'is_enabled' => true];
    }
}
