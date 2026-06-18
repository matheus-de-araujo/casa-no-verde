<?php

namespace App\Http\Controllers\Household;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Household;
use App\Services\Dashboard\BudgetThresholdEvaluator;
use Inertia\Inertia;
use Inertia\Response;

class BudgetController extends Controller
{
    public function __invoke(Household $household, BudgetThresholdEvaluator $thresholds): Response
    {
        $month = now($household->timezone)->format('Y-m');

        return Inertia::render('finance/budgets', [
            'month' => $month,
            'budgets' => Budget::query()
                ->with('category')
                ->where('household_id', $household->id)
                ->where('month', $month)
                ->get()
                ->map(function (Budget $budget) use ($household, $month, $thresholds) {
                    $spent = (float) $household->transactions()->where('type', 'expense')->where('competence_month', $month)->where('category_id', $budget->category_id)->sum('amount');
                    $limit = (float) $budget->limit_amount;

                    return [
                        'id' => $budget->id,
                        'category' => $budget->category->name,
                        'color' => $budget->category->color,
                        'limit' => $limit,
                        'spent' => $spent,
                        'remaining' => round($limit - $spent, 2),
                        'status' => $thresholds->status($spent, $limit),
                    ];
                }),
        ]);
    }
}
