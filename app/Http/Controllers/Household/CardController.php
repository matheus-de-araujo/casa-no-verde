<?php

namespace App\Http\Controllers\Household;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Household;
use Inertia\Inertia;
use Inertia\Response;

class CardController extends Controller
{
    public function __invoke(Household $household): Response
    {
        $month = now($household->timezone)->format('Y-m');

        return Inertia::render('finance/cards', [
            'cards' => Card::query()
                ->where('household_id', $household->id)
                ->where('is_active', true)
                ->orderBy('name')
                ->get()
                ->map(fn (Card $card) => [
                    'id' => $card->id,
                    'name' => $card->name,
                    'limit_amount' => (float) $card->limit_amount,
                    'budget_limit' => (float) $card->budget_limit,
                    'closing_day' => $card->closing_day,
                    'due_day' => $card->due_day,
                    'current_invoice' => (float) $card->transactions()->where('type', 'expense')->where('competence_month', $month)->sum('amount'),
                    'future_installments' => (float) $card->transactions()->where('type', 'expense')->whereNotNull('installment_group_id')->where('competence_month', '>', $month)->sum('amount'),
                    'next_invoices' => $card->transactions()->where('type', 'expense')->where('competence_month', '>=', $month)->selectRaw('competence_month, SUM(amount) as total')->groupBy('competence_month')->orderBy('competence_month')->limit(6)->pluck('total', 'competence_month')->map(fn ($total) => (float) $total)->all(),
                ]),
        ]);
    }
}
