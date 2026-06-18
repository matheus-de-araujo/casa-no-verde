<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;

class TransactionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Transaction $transaction): bool
    {
        return $user->belongsToHousehold($transaction->household_id);
    }

    public function create(User $user): bool
    {
        return $user->households()->exists();
    }

    public function update(User $user, Transaction $transaction): bool
    {
        return $this->view($user, $transaction);
    }

    public function delete(User $user, Transaction $transaction): bool
    {
        return $this->view($user, $transaction);
    }
}
