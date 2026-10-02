<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContentLocaleRequest;
use App\Http\Resources\JobResource;
use App\Models\Job;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobController extends Controller
{
    public function index(ContentLocaleRequest $request): AnonymousResourceCollection
    {
        $jobs = Job::query()->published()->ordered()
            ->whereHas('translations', fn (Builder $query) => $query->where('locale', $request->locale()))
            ->with('translations')->get();

        return JobResource::collection($jobs);
    }

    public function show(ContentLocaleRequest $request, string $slug): JobResource
    {
        $job = Job::query()->published()
            ->whereHas('translations', fn (Builder $query) => $query->where('locale', $request->locale())->where('slug', $slug))
            ->with(['translations', 'sections' => fn (HasMany $query) => $query->enabled()
                ->whereHas('translations', fn (Builder $query) => $query->where('locale', $request->locale()))
                ->with(['translations' => fn (HasMany $query) => $query->where('locale', $request->locale())])])
            ->firstOrFail();

        return new JobResource($job);
    }
}
