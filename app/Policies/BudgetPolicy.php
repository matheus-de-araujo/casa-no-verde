<?php

namespace App\Policies;

use App\Models\Budget;
use App\Models\User;

class BudgetPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Budget $budget): bool
    {
        return $user->belongsToHousehold($budget->household_id);
    }

    public function create(User $user): bool
    {
        return $user->households()->exists();
    }

    public function update(User $user, Budget $budget): bool
    {
        return $this->view($user, $budget);
    }

    public function delete(User $user, Budget $budget): bool
    {
        return $this->view($user, $budget);
    }
}
