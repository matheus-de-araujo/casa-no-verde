<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Household;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuickEntryTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_single_expense_from_quick_entry(): void
    {
        $user = User::factory()->create();
        $household = Household::create(['name' => 'Casa', 'slug' => 'casa']);
        $household->users()->attach($user, ['role' => 'owner']);
        $category = Category::create(['household_id' => $household->id, 'name' => 'Alimentação']);

        $this->actingAs($user)
            ->post(route('households.expenses.store', $household), [
                'amount' => 87.90,
                'description' => 'Supermercado',
                'category_id' => $category->id,
                'user_id' => $user->id,
                'entry_type' => 'single',
                'payment_method' => 'pix',
                'transaction_date' => '2026-07-10',
                'necessity' => 'essential',
            ])
            ->assertRedirect(route('households.dashboard', $household));

        $this->assertDatabaseHas('transactions', [
            'household_id' => $household->id,
            'description' => 'Supermercado',
            'competence_month' => '2026-07',
        ]);
    }
}
