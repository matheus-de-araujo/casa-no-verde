<?php

use App\Models\Card;
use App\Models\Category;
use App\Models\Goal;
use App\Models\GoalContribution;
use App\Models\Household;
use App\Models\InstallmentGroup;
use App\Models\Transaction;
use App\Models\User;
use App\Services\Dashboard\DashboardAggregator;
use Illuminate\Support\Carbon;

it('answers the dashboard financial questions for the current month', function () {
    $user = User::factory()->create();
    $household = Household::create([
        'name' => 'Casa',
        'slug' => 'casa',
        'monthly_income_goal' => 15000,
        'monthly_expense_limit' => 8000,
        'monthly_saving_goal' => 7000,
    ]);
    $category = Category::create(['household_id' => $household->id, 'name' => 'Alimentacao']);
    $card = Card::create(['household_id' => $household->id, 'name' => 'Nubank', 'closing_day' => 25, 'due_day' => 5, 'budget_limit' => 4000]);
    $installmentGroup = InstallmentGroup::create([
        'household_id' => $household->id,
        'user_id' => $user->id,
        'category_id' => $category->id,
        'card_id' => $card->id,
        'description' => 'Futura',
        'total_amount' => 2100,
        'installments_count' => 1,
        'purchase_date' => '2026-07-10',
        'first_month' => '2026-08',
    ]);
    $monthlyGoal = Goal::create(['household_id' => $household->id, 'name' => 'Reserva mensal', 'target_amount' => 7000, 'is_monthly_saving_goal' => true]);
    Goal::create(['household_id' => $household->id, 'name' => 'Reserva 3 meses', 'target_amount' => 24000, 'current_amount' => 10000]);

    Transaction::create([
        'household_id' => $household->id,
        'user_id' => $user->id,
        'card_id' => $card->id,
        'category_id' => $category->id,
        'description' => 'Mercado',
        'amount' => 6250,
        'type' => 'expense',
        'payment_method' => 'credit_card',
        'transaction_date' => '2026-07-10',
        'competence_month' => '2026-07',
    ]);
    Transaction::create([
        'household_id' => $household->id,
        'user_id' => $user->id,
        'card_id' => $card->id,
        'category_id' => $category->id,
        'installment_group_id' => $installmentGroup->id,
        'description' => 'Futura',
        'amount' => 2100,
        'type' => 'expense',
        'payment_method' => 'credit_card',
        'transaction_date' => '2026-07-10',
        'competence_month' => '2026-08',
    ]);
    GoalContribution::create([
        'household_id' => $household->id,
        'goal_id' => $monthlyGoal->id,
        'user_id' => $user->id,
        'amount' => 5000,
        'contributed_at' => '2026-07-10',
        'competence_month' => '2026-07',
    ]);

    $dashboard = app(DashboardAggregator::class)->aggregate($household, Carbon::parse('2026-07-20'));

    expect($dashboard['monthly_spent'])->toBe(6250.0)
        ->and($dashboard['remaining_monthly_budget'])->toBe(1750.0)
        ->and($dashboard['daily_allowance'])->toBe(145.83)
        ->and($dashboard['current_cards'])->toBe(6250.0)
        ->and($dashboard['card_budget_limit'])->toBe(4000.0)
        ->and($dashboard['saved_this_month'])->toBe(5000.0)
        ->and($dashboard['monthly_saving_gap'])->toBe(2000.0)
        ->and($dashboard['future_installments_by_month'])->toBe(['2026-08' => 2100.0]);
});
