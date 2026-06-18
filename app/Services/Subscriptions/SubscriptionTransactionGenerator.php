<?php

namespace App\Services\Subscriptions;

use App\Models\Subscription;
use App\Models\Transaction;
use App\Services\Transactions\CompetenceMonthResolver;
use Illuminate\Support\Carbon;

class SubscriptionTransactionGenerator
{
    public function __construct(private readonly CompetenceMonthResolver $competenceMonthResolver) {}

    public function generateDue(Carbon $today): int
    {
        $created = 0;

        Subscription::query()
            ->with('card')
            ->where('active', true)
            ->whereDate('start_date', '<=', $today->toDateString())
            ->where(fn ($query) => $query->whereNull('end_date')->orWhereDate('end_date', '>=', $today->toDateString()))
            ->each(function (Subscription $subscription) use ($today, &$created): void {
                $billingDate = $this->billingDateFor($subscription, $today);

                if ($billingDate->greaterThan($today)) {
                    return;
                }

                $competenceMonth = $this->competenceMonthResolver->resolve(
                    $billingDate,
                    $subscription->card_id ? 'credit_card' : 'debit',
                    $subscription->card,
                );

                $transaction = Transaction::firstOrCreate(
                    [
                        'subscription_id' => $subscription->id,
                        'competence_month' => $competenceMonth,
                    ],
                    [
                        'household_id' => $subscription->household_id,
                        'user_id' => $subscription->user_id,
                        'account_id' => $subscription->account_id,
                        'card_id' => $subscription->card_id,
                        'category_id' => $subscription->category_id,
                        'description' => $subscription->name,
                        'amount' => $subscription->amount,
                        'type' => 'expense',
                        'payment_method' => $subscription->card_id ? 'credit_card' : 'debit',
                        'transaction_date' => $billingDate->toDateString(),
                        'status' => 'pending',
                        'is_generated' => true,
                    ],
                );

                if ($transaction->wasRecentlyCreated) {
                    $created++;
                }
            });

        return $created;
    }

    private function billingDateFor(Subscription $subscription, Carbon $today): Carbon
    {
        $day = min($subscription->billing_day, $today->copy()->endOfMonth()->day);

        return $today->copy()->day($day)->startOfDay();
    }
}
