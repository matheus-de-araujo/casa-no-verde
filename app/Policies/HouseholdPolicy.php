<?php

namespace App\Policies;

use App\Models\Household;
use App\Models\User;

class HouseholdPolicy
{
    public function view(User $user, Household $household): bool
    {
        return $user->belongsToHousehold($household);
    }

    public function update(User $user, Household $household): bool
    {
        return $user->households()->whereKey($household->id)->wherePivot('role', 'owner')->exists();
    }
}
