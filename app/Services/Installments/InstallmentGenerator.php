<?php

namespace App\Services\Installments;

use App\Models\InstallmentGroup;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class InstallmentGenerator
{
    /**
     * @return Collection<int, Transaction>
     */
    public function generate(InstallmentGroup $group): Collection
    {
        if (! $group->installments_count) {
            return new Collection;
        }

        return DB::transaction(function () use ($group): Collection {
            $group->transactions()
                ->where('status', 'pending')
                ->where('competence_month', '>=', $group->first_month)
                ->delete();

            $totalCents = (int) round(((float) $group->total_amount) * 100);
            $baseCents = intdiv($totalCents, $group->installments_count);
            $remainder = $totalCents - ($baseCents * $group->installments_count);
            $firstMonth = Carbon::createFromFormat('Y-m', $group->first_month)->startOfMonth();

            $transactions = new Collection;

            for ($number = 1; $number <= $group->installments_count; $number++) {
                $amountCents = $baseCents + ($number === $group->installments_count ? $remainder : 0);
                $competenceMonth = $firstMonth->copy()->addMonthsNoOverflow($number - 1)->format('Y-m');

                $transactions->push(Transaction::create([
                    'household_id' => $group->household_id,
                    'user_id' => $group->user_id,
                    'account_id' => null,
                    'card_id' => $group->card_id,
                    'category_id' => $group->category_id,
                    'installment_group_id' => $group->id,
                    'description' => $group->description,
                    'amount' => number_format($amountCents / 100, 2, '.', ''),
                    'type' => 'expense',
                    'payment_method' => $group->card_id ? 'credit_card' : 'pix',
                    'transaction_date' => $group->purchase_date,
                    'competence_month' => $competenceMonth,
                    'status' => 'pending',
                    'installment_number' => $number,
                ]));
            }

            $group->update([
                'installment_amount' => number_format($baseCents / 100, 2, '.', ''),
                'rounding_installment' => $group->installments_count,
            ]);

            return $transactions;
        });
    }
}
