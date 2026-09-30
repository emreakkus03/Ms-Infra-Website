<?php

namespace Tests\Concerns;

trait UsesActivityDatabase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Never run migrations against the developer's database, even with a cached configuration.
        if (config('database.default') !== 'sqlite' || config('database.connections.sqlite.database') !== ':memory:') {
            throw new \RuntimeException('Activity tests require SQLite :memory:.');
        }
        $this->artisan('migrate', ['--no-interaction' => true])->assertSuccessful();
    }
}
