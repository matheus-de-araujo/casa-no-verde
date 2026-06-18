<?php

namespace App\Http\Controllers\Household;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Household;
use App\Models\InstallmentGroup;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Services\Installments\InstallmentGenerator;
use App\Services\Transactions\CompetenceMonthResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function create(Household $household): Response
    {
        return Inertia::render('finance/quick-entry', [
            'categories' => $household->categories()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'color', 'type']),
            'accounts' => $household->accounts()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'type']),
            'cards' => $household->cards()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'closing_day', 'due_day']),
            'users' => $household->users()->orderBy('name')->get(['users.id', 'users.name']),
        ]);
    }

    public function store(Household $household, Request $request, CompetenceMonthResolver $resolver, InstallmentGenerator $installments): RedirectResponse
    {
        $data = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'description' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'user_id' => ['required', 'exists:users,id'],
            'account_id' => ['nullable', 'exists:accounts,id'],
            'card_id' => ['nullable', 'exists:cards,id'],
            'entry_type' => ['required', 'in:single,installment,subscription'],
            'payment_method' => ['required', 'in:debit,credit_card,cash,pix'],
            'transaction_date' => ['required', 'date'],
            'installments_count' => ['nullable', 'integer', 'min:2', 'max:60'],
            'necessity' => ['nullable', 'in:essential,important,desire'],
        ]);

        DB::transaction(function () use ($household, $data, $resolver, $installments): void {
            $card = isset($data['card_id'])
                ? Card::query()->where('household_id', $household->id)->find($data['card_id'])
                : null;
            $competenceMonth = $resolver->resolve($data['transaction_date'], $data['payment_method'], $card);

            if ($data['entry_type'] === 'installment') {
                $group = InstallmentGroup::create([
                    'household_id' => $household->id,
                    'user_id' => $data['user_id'],
                    'category_id' => $data['category_id'],
                    'card_id' => $data['card_id'] ?? null,
                    'description' => $data['description'],
                    'total_amount' => $data['amount'],
                    'installments_count' => $data['installments_count'],
                    'purchase_date' => $data['transaction_date'],
                    'first_month' => $competenceMonth,
                ]);

                $installments->generate($group);

                return;
            }

            if ($data['entry_type'] === 'subscription') {
                Subscription::create([
                    'household_id' => $household->id,
                    'user_id' => $data['user_id'],
                    'category_id' => $data['category_id'],
                    'account_id' => $data['account_id'] ?? null,
                    'card_id' => $data['card_id'] ?? null,
                    'name' => $data['description'],
                    'amount' => $data['amount'],
                    'billing_day' => (int) date('j', strtotime($data['transaction_date'])),
                    'start_date' => $data['transaction_date'],
                ]);
            }

            Transaction::create([
                'household_id' => $household->id,
                'user_id' => $data['user_id'],
                'account_id' => $data['account_id'] ?? null,
                'card_id' => $data['card_id'] ?? null,
                'category_id' => $data['category_id'],
                'description' => $data['description'],
                'amount' => $data['amount'],
                'type' => 'expense',
                'payment_method' => $data['payment_method'],
                'transaction_date' => $data['transaction_date'],
                'competence_month' => $competenceMonth,
                'status' => 'pending',
                'necessity' => $data['necessity'] ?? null,
            ]);
        });

        return redirect()->route('households.dashboard', $household)->with('success', 'Gasto lançado.');
    }
}
