<?php

namespace App\Policies;

use App\Models\Goal;
use App\Models\User;

class GoalPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Goal $goal): bool
    {
        return $user->belongsToHousehold($goal->household_id);
    }

    public function create(User $user): bool
    {
        return $user->households()->exists();
    }

    public function update(User $user, Goal $goal): bool
    {
        return $this->view($user, $goal);
    }

    public function delete(User $user, Goal $goal): bool
    {
        return $this->view($user, $goal);
    }
}
