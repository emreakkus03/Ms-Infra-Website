<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Laravel's queue already owns the jobs table.
        Schema::create('vacancies', function (Blueprint $table): void {
            $table->id();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->enum('employment_type', ['full_time', 'part_time', 'temporary', 'internship'])->nullable();
            $table->string('location')->nullable();
            $table->string('hero_image')->nullable();
            $table->timestamps();
            $table->index(['status', 'sort_order']);
            $table->index(['is_featured', 'sort_order']);
        });
        Schema::create('job_translations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('job_id')->constrained('vacancies')->cascadeOnDelete();
            $table->enum('locale', ['nl', 'en']);
            $table->string('title');
            $table->string('slug');
            $table->text('short_description')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->timestamps();
            $table->unique(['job_id', 'locale']);
            $table->unique(['locale', 'slug']);
        });
        Schema::create('job_sections', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('job_id')->constrained('vacancies')->cascadeOnDelete();
            $table->enum('type', ['title_text', 'image_text', 'rich_text', 'bullet_list', 'gallery', 'cta']);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_enabled')->default(true);
            $table->string('image')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->index(['job_id', 'is_enabled', 'sort_order']);
        });
        Schema::create('job_section_translations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('job_section_id')->constrained()->cascadeOnDelete();
            $table->enum('locale', ['nl', 'en']);
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->longText('content')->nullable();
            $table->string('button_text')->nullable();
            $table->string('button_url', 2048)->nullable();
            $table->json('items')->nullable();
            $table->text('caption')->nullable();
            $table->timestamps();
            $table->unique(['job_section_id', 'locale']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_section_translations');
        Schema::dropIfExists('job_sections');
        Schema::dropIfExists('job_translations');
        Schema::dropIfExists('vacancies');
    }
};
