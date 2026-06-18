<?php

namespace App\Services\Transactions;

use App\Models\Card;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;

class CompetenceMonthResolver
{
    public function resolve(CarbonInterface|string $transactionDate, string $paymentMethod, ?Card $card = null): string
    {
        $date = $transactionDate instanceof CarbonInterface
            ? Carbon::instance($transactionDate->toDateTime())
            : Carbon::parse($transactionDate);

        if ($paymentMethod !== 'credit_card' || ! $card instanceof Card) {
            return $date->format('Y-m');
        }

        return $date->day <= $card->closing_day
            ? $date->format('Y-m')
            : $date->copy()->addMonthNoOverflow()->format('Y-m');
    }
}
