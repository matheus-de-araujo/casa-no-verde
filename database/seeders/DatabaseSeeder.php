<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Budget;
use App\Models\Card;
use App\Models\Category;
use App\Models\Goal;
use App\Models\Household;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $household = Household::firstOrCreate(
            ['slug' => 'familia-matheus'],
            [
                'name' => 'Família Matheus',
                'monthly_income_goal' => 15000,
                'monthly_expense_limit' => 8000,
                'monthly_saving_goal' => 7000,
            ],
        );

        $matheus = User::firstOrCreate(
            ['email' => 'matheus@example.com'],
            ['name' => 'Matheus', 'password' => Hash::make('password')],
        );

        $dayane = User::firstOrCreate(
            ['email' => 'dayane@example.com'],
            ['name' => 'Dayane', 'password' => Hash::make('password')],
        );

        $household->users()->syncWithoutDetaching([
            $matheus->id => ['role' => 'owner'],
            $dayane->id => ['role' => 'member'],
        ]);

        $accounts = collect([
            ['name' => 'Caixa', 'type' => 'cash'],
            ['name' => 'Conta Matheus', 'type' => 'checking'],
            ['name' => 'Conta Dayane', 'type' => 'checking'],
            ['name' => 'Reserva', 'type' => 'reserve', 'initial_balance' => 10000],
            ['name' => 'PJ Matheus', 'type' => 'business'],
        ])->map(fn (array $account) => Account::firstOrCreate(
            ['household_id' => $household->id, 'name' => $account['name']],
            ['type' => $account['type'], 'initial_balance' => $account['initial_balance'] ?? 0],
        ));

        $categories = collect([
            ['name' => 'Alimentação', 'color' => '#22c55e', 'limit' => 1600],
            ['name' => 'Lazer', 'color' => '#f59e0b', 'limit' => 300],
            ['name' => 'Assinaturas', 'color' => '#8b5cf6', 'limit' => 700],
            ['name' => 'Desejos', 'color' => '#ef4444', 'limit' => 800],
            ['name' => 'Farmácia', 'color' => '#06b6d4', 'limit' => 300],
            ['name' => 'Gasolina', 'color' => '#f97316', 'limit' => 800],
            ['name' => 'Moradia', 'color' => '#64748b', 'limit' => 2500],
            ['name' => 'Bebê', 'color' => '#ec4899', 'limit' => 800],
            ['name' => 'Trabalho', 'color' => '#0ea5e9', 'limit' => 1000],
            ['name' => 'Reserva', 'color' => '#10b981', 'limit' => 7000, 'type' => 'saving'],
        ])->mapWithKeys(function (array $category) use ($household) {
            $model = Category::firstOrCreate(
                ['household_id' => $household->id, 'name' => $category['name'], 'type' => $category['type'] ?? 'expense'],
                ['color' => $category['color']],
            );

            Budget::firstOrCreate(
                ['household_id' => $household->id, 'category_id' => $model->id, 'month' => now()->format('Y-m')],
                ['limit_amount' => $category['limit']],
            );

            return [$category['name'] => $model];
        });

        $contaMatheus = $accounts->firstWhere('name', 'Conta Matheus');
        $contaDayane = $accounts->firstWhere('name', 'Conta Dayane');
        $pjMatheus = $accounts->firstWhere('name', 'PJ Matheus');

        collect([
            ['name' => 'Nubank Matheus', 'account_id' => $contaMatheus->id, 'budget_limit' => 2000],
            ['name' => 'Nubank Dayane', 'account_id' => $contaDayane->id, 'budget_limit' => 1000],
            ['name' => 'PJ Matheus', 'account_id' => $pjMatheus->id, 'budget_limit' => 1000],
            ['name' => 'Mercado Pago', 'account_id' => null, 'budget_limit' => 500],
        ])->each(fn (array $card) => Card::firstOrCreate(
            ['household_id' => $household->id, 'name' => $card['name']],
            [
                'account_id' => $card['account_id'],
                'limit_amount' => 0,
                'budget_limit' => $card['budget_limit'],
                'closing_day' => 25,
                'due_day' => 5,
            ],
        ));

        Goal::firstOrCreate(
            ['household_id' => $household->id, 'name' => 'Reserva mensal'],
            ['target_amount' => 7000, 'is_monthly_saving_goal' => true],
        );

        Goal::firstOrCreate(
            ['household_id' => $household->id, 'name' => 'Reserva 3 meses'],
            ['target_amount' => 24000, 'current_amount' => 10000],
        );

        collect([
            ['name' => 'Netflix', 'amount' => 20.90, 'billing_day' => 10, 'category' => 'Assinaturas'],
            ['name' => 'ChatGPT', 'amount' => 99.90, 'billing_day' => 20, 'category' => 'Trabalho'],
            ['name' => 'Hostinger', 'amount' => 108.99, 'billing_day' => 20, 'category' => 'Trabalho'],
            ['name' => 'Academia', 'amount' => 119.90, 'billing_day' => 10, 'category' => 'Farmácia'],
        ])->each(fn (array $subscription) => Subscription::firstOrCreate(
            ['household_id' => $household->id, 'name' => $subscription['name']],
            [
                'user_id' => $matheus->id,
                'category_id' => $categories[$subscription['category']]->id,
                'amount' => $subscription['amount'],
                'billing_day' => $subscription['billing_day'],
                'start_date' => now()->startOfMonth()->toDateString(),
            ],
        ));
    }
}
