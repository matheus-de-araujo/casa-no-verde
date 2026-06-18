<?php

namespace Tests\Feature;

use App\Models\Household;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HouseholdAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_access_own_household_dashboard(): void
    {
        $user = User::factory()->create();
        $household = Household::create(['name' => 'Casa', 'slug' => 'casa']);
        $household->users()->attach($user, ['role' => 'owner']);

        $this->actingAs($user)
            ->get(route('households.dashboard', $household))
            ->assertOk();
    }

    public function test_user_cannot_access_another_household_dashboard(): void
    {
        $user = User::factory()->create();
        $household = Household::create(['name' => 'Outra Casa', 'slug' => 'outra']);

        $this->actingAs($user)
            ->get(route('households.dashboard', $household))
            ->assertForbidden();
    }
}
