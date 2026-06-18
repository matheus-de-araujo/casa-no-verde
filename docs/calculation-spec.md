# Casa no Azul Calculation Spec

This document is the source of truth for financial calculations. UI code may format and display numbers, but official values must come from the backend services that implement these rules.

## Month Context

- `competence_month` uses `YYYY-MM`.
- Household timezone defaults to `America/Sao_Paulo`.
- Current month is resolved from the household timezone.

## Monthly Spending

Monthly spending includes committed expenses, not only paid ones:

```text
spent = SUM(transactions.amount)
WHERE household_id = household.id
  AND type = expense
  AND competence_month = current_month
```

Transfers and goal contributions are not expenses.

## Remaining Monthly Budget

```text
remaining = household.monthly_expense_limit - spent
```

If remaining is negative, dashboards show the deficit separately and daily allowance as zero.

## Daily Spend Allowance

```text
days_remaining = days_in_month(today) - day(today) + 1
daily_allowance = max(0, remaining) / days_remaining
```

The current day counts as available spending time. On the last day of the month, the allowance is the full remaining amount.

## Credit Card Competence Month

For `payment_method = credit_card`, use the card closing day:

```text
if transaction_date.day <= card.closing_day:
    competence_month = month(transaction_date)
else:
    competence_month = month(transaction_date + 1 month)
```

Purchases on the closing day belong to the current invoice month. Debit, pix, and cash use the transaction date month.

## Card Totals

Current card invoice:

```text
invoice_total = SUM(transactions.amount)
WHERE card_id = card.id
  AND type = expense
  AND competence_month = invoice_month
```

Dashboard card commitment:

```text
current_cards = SUM(current invoice totals for active cards)
card_budget_limit = SUM(cards.budget_limit for active cards)
```

Future card exposure sums credit card transactions with `competence_month > current_month`.

## Installments

An installment purchase creates one `installment_groups` row and one transaction per installment.

- `total_amount` is split by cents.
- The base amount is floor division in cents.
- The last installment receives any rounding remainder.
- Month arithmetic must handle year boundaries.
- Editing a group regenerates only future `pending` installments.
- Cancelling a group soft-deletes only future `pending` installments and marks the group as `cancelled`.

## Subscriptions

Subscriptions generate one transaction per competence month.

- Scheduler runs daily after midnight.
- The generated transaction is idempotent by `subscription_id + competence_month`.
- If `billing_day` does not exist in the target month, use the last day of that month.
- Generated transactions are `pending`, `is_generated = true`, and use the same `CompetenceMonthResolver` as manual expenses.

## Savings Goal

Monthly savings are recorded as goal contributions, not inferred from income minus expenses.

```text
saved_this_month = SUM(goal_contributions.amount)
WHERE household_id = household.id
  AND competence_month = current_month
```

```text
monthly_saving_gap = max(0, household.monthly_saving_goal - saved_this_month)
```

Long-term reserve progress uses `goals.current_amount / goals.target_amount`.

## Category Budget Status

Category usage uses the same monthly spending rule filtered by category.

- green: usage <= 70%
- yellow: usage > 70% and <= 90%
- red: usage > 90% and <= 100%
- danger: usage > 100%
