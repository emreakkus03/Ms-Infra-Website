<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_tags', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('activity_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->index(['activity_id', 'sort_order']);
        });
        Schema::create('activity_tag_translations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('activity_tag_id')->constrained()->cascadeOnDelete();
            $table->enum('locale', ['nl', 'en']);
            $table->string('label', 60);
            $table->timestamps();
            $table->unique(['activity_tag_id', 'locale']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_tag_translations');
        Schema::dropIfExists('activity_tags');
    }
};
