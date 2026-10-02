<?php

namespace Database\Factories;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityTagFactory extends Factory
{
    public function definition(): array
    {
        return ['activity_id' => Activity::factory(), 'sort_order' => 0];
    }
}
