export type MoneyMetric = number;

export type DashboardPayload = {
    month: string;
    monthly_income_goal: MoneyMetric;
    monthly_expense_limit: MoneyMetric;
    monthly_saving_goal: MoneyMetric;
    monthly_spent: MoneyMetric;
    remaining_monthly_budget: MoneyMetric;
    days_remaining: number;
    daily_allowance: MoneyMetric;
    current_cards: MoneyMetric;
    card_budget_limit: MoneyMetric;
    saved_this_month: MoneyMetric;
    monthly_saving_gap: MoneyMetric;
    reserve_current: MoneyMetric;
    reserve_target: MoneyMetric;
    future_installments_by_month: Record<string, MoneyMetric>;
};
