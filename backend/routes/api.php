<?php

use App\Http\Controllers\Api\ActivityController;
use Illuminate\Support\Facades\Route;

Route::get('activities', [ActivityController::class, 'index'])->name('api.activities.index');
Route::get('activities/{slug}', [ActivityController::class, 'show'])->name('api.activities.show');
