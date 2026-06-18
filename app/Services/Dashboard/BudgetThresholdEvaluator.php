<?php

namespace App\Services\Dashboard;

class BudgetThresholdEvaluator
{
    public function status(float $spent, float $limit): string
    {
        if ($limit <= 0) {
            return 'none';
        }

        $usage = $spent / $limit;

        return match (true) {
            $usage > 1 => 'danger',
            $usage > 0.9 => 'red',
            $usage > 0.7 => 'yellow',
            default => 'green',
        };
    }
}
