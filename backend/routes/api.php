<?php

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\JobController;
use Illuminate\Support\Facades\Route;

Route::get('activities', [ActivityController::class, 'index'])->name('api.activities.index');
Route::get('activities/{slug}', [ActivityController::class, 'show'])->name('api.activities.show');

Route::get('jobs', [JobController::class, 'index'])->name('api.jobs.index');
Route::get('jobs/{slug}', [JobController::class, 'show'])->name('api.jobs.show');


Route::post('/contact', ContactController::class)
    ->middleware('throttle:5,1');