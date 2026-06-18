<?php

namespace App\Policies;

use App\Models\Account;
use App\Models\User;

class AccountPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Account $account): bool
    {
        return $user->belongsToHousehold($account->household_id);
    }

    public function create(User $user): bool
    {
        return $user->households()->exists();
    }

    public function update(User $user, Account $account): bool
    {
        return $this->view($user, $account);
    }

    public function delete(User $user, Account $account): bool
    {
        return $this->view($user, $account);
    }
}
