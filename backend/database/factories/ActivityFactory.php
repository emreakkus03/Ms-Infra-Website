<?php

namespace Database\Factories;

use App\Enums\ActivityStatus;
use App\Models\ActivityTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    public function definition(): array
    {
        return ['status' => ActivityStatus::Draft, 'is_featured' => false, 'sort_order' => 0];
    }

    public function published(): static
    {
        return $this->state(fn (): array => ['status' => ActivityStatus::Published]);
    }

    public function translated(): static
    {
        return $this->has(ActivityTranslation::factory()->state(['locale' => 'nl']), 'translations')
            ->has(ActivityTranslation::factory()->state(['locale' => 'en']), 'translations');
    }
}
