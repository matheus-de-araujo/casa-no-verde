<?php

namespace App\Http\Controllers\Household;

use App\Http\Controllers\Controller;
use App\Models\Household;
use App\Models\Transaction;
use Inertia\Inertia;
use Inertia\Response;

class InstallmentController extends Controller
{
    public function __invoke(Household $household): Response
    {
        $month = now($household->timezone)->format('Y-m');
        $transactions = Transaction::query()
            ->with('installmentGroup')
            ->where('household_id', $household->id)
            ->whereNotNull('installment_group_id')
            ->orderBy('competence_month')
            ->get();

        return Inertia::render('finance/installments', [
            'groups' => $transactions->groupBy('installment_group_id')->map(function ($transactions) use ($month) {
                $first = $transactions->first();
                $group = $first->installmentGroup;
                $last = $transactions->sortBy('competence_month')->last();

                return [
                    'id' => $group->id,
                    'description' => $group->description,
                    'current_installment' => $transactions->where('competence_month', $month)->first()?->installment_number ?? $transactions->min('installment_number'),
                    'installments_count' => $group->installments_count,
                    'amount' => (float) $first->amount,
                    'remaining' => $transactions->where('competence_month', '>=', $month)->count(),
                    'ends_at' => $last?->competence_month,
                ];
            })->values(),
            'projection' => Transaction::query()
                ->where('household_id', $household->id)
                ->where('type', 'expense')
                ->whereNotNull('installment_group_id')
                ->where('competence_month', '>', $month)
                ->selectRaw('competence_month, SUM(amount) as total')
                ->groupBy('competence_month')
                ->orderBy('competence_month')
                ->limit(12)
                ->pluck('total', 'competence_month')
                ->map(fn ($total) => (float) $total)
                ->all(),
        ]);
    }
}
