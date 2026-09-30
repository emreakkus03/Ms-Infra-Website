<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ActivityLocaleRequest;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ActivityController extends Controller
{
    public function index(ActivityLocaleRequest $request): AnonymousResourceCollection
    {
        $activities = Activity::query()->published()->ordered()
            ->whereHas('translations', fn (Builder $query) => $query->where('locale', $request->locale()))
            ->with('translations')->get();

        return ActivityResource::collection($activities);
    }

    public function show(ActivityLocaleRequest $request, string $slug): ActivityResource
    {
        $activity = Activity::query()->published()
            ->whereHas('translations', fn (Builder $query) => $query->where('locale', $request->locale())->where('slug', $slug))
            ->with(['translations', 'sections' => fn (HasMany $query) => $query->enabled()
                ->whereHas('translations', fn (Builder $query) => $query->where('locale', $request->locale()))
                ->with(['translations' => fn (HasMany $query) => $query->where('locale', $request->locale())])])
            ->firstOrFail();

        return new ActivityResource($activity);
    }
}
