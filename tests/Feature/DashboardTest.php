<?php

namespace Tests\Feature;

use App\Models\Household;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->create();
        $household = Household::create(['name' => 'Casa', 'slug' => 'casa']);
        $household->users()->attach($user, ['role' => 'owner']);

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('households.dashboard', $household));
    }
}
