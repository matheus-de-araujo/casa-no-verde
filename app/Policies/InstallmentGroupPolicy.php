<?php

namespace App\Policies;

use App\Models\InstallmentGroup;
use App\Models\User;

class InstallmentGroupPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, InstallmentGroup $installmentGroup): bool
    {
        return $user->belongsToHousehold($installmentGroup->household_id);
    }

    public function create(User $user): bool
    {
        return $user->households()->exists();
    }

    public function update(User $user, InstallmentGroup $installmentGroup): bool
    {
        return $this->view($user, $installmentGroup);
    }

    public function delete(User $user, InstallmentGroup $installmentGroup): bool
    {
        return $this->view($user, $installmentGroup);
    }
}
