<?php

namespace App\Policies;

use App\Models\Subscription;
use App\Models\User;

class SubscriptionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Subscription $subscription): bool
    {
        return $user->belongsToHousehold($subscription->household_id);
    }

    public function create(User $user): bool
    {
        return $user->households()->exists();
    }

    public function update(User $user, Subscription $subscription): bool
    {
        return $this->view($user, $subscription);
    }

    public function delete(User $user, Subscription $subscription): bool
    {
        return $this->view($user, $subscription);
    }
}
