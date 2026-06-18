<?php

namespace App\Console\Commands;

use App\Services\Subscriptions\SubscriptionTransactionGenerator;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

#[Signature('subscriptions:process')]
#[Description('Generate due subscription transactions for the current month.')]
class ProcessSubscriptionsCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(SubscriptionTransactionGenerator $generator): int
    {
        $created = $generator->generateDue(Carbon::now());

        $this->info("Created {$created} subscription transaction(s).");

        return self::SUCCESS;
    }
}
