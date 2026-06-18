<?php

namespace App\Services\Dashboard;

use App\Models\Household;
use Illuminate\Support\Carbon;

class DashboardAggregator
{
    /**
     * @return array<string, mixed>
     */
    public function aggregate(Household $household, ?Carbon $today = null): array
    {
        $today ??= now($household->timezone);
        $month = $today->format('Y-m');

        $monthlySpent = (float) $household->transactions()
            ->where('type', 'expense')
            ->where('competence_month', $month)
            ->sum('amount');

        $remaining = (float) $household->monthly_expense_limit - $monthlySpent;
        $daysRemaining = $today->daysInMonth - $today->day + 1;
        $dailyAllowance = max(0, $remaining) / max(1, $daysRemaining);

        $currentCards = (float) $household->transactions()
            ->where('type', 'expense')
            ->whereNotNull('card_id')
            ->where('competence_month', $month)
            ->sum('amount');

        $cardBudgetLimit = (float) $household->cards()
            ->where('is_active', true)
            ->sum('budget_limit');

        $savedThisMonth = (float) $household->goals()
            ->where('is_monthly_saving_goal', true)
            ->withSum(['contributions as monthly_contributions_sum' => fn ($query) => $query->where('competence_month', $month)], 'amount')
            ->get()
            ->sum('monthly_contributions_sum');

        $reserveGoal = $household->goals()
            ->where('is_monthly_saving_goal', false)
            ->orderBy('target_amount')
            ->first();

        return [
            'month' => $month,
            'monthly_income_goal' => (float) $household->monthly_income_goal,
            'monthly_expense_limit' => (float) $household->monthly_expense_limit,
            'monthly_saving_goal' => (float) $household->monthly_saving_goal,
            'monthly_spent' => round($monthlySpent, 2),
            'remaining_monthly_budget' => round($remaining, 2),
            'days_remaining' => $daysRemaining,
            'daily_allowance' => round($dailyAllowance, 2),
            'current_cards' => round($currentCards, 2),
            'card_budget_limit' => round($cardBudgetLimit, 2),
            'saved_this_month' => round($savedThisMonth, 2),
            'monthly_saving_gap' => round(max(0, (float) $household->monthly_saving_goal - $savedThisMonth), 2),
            'reserve_current' => $reserveGoal ? (float) $reserveGoal->current_amount : 0.0,
            'reserve_target' => $reserveGoal ? (float) $reserveGoal->target_amount : 0.0,
            'future_installments_by_month' => $household->transactions()
                ->where('type', 'expense')
                ->whereNotNull('installment_group_id')
                ->where('competence_month', '>', $month)
                ->selectRaw('competence_month, SUM(amount) as total')
                ->groupBy('competence_month')
                ->orderBy('competence_month')
                ->limit(12)
                ->pluck('total', 'competence_month')
                ->map(fn ($value) => round((float) $value, 2))
                ->all(),
        ];
    }
}
