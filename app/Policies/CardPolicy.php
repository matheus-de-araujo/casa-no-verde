<?php

namespace App\Policies;

use App\Models\Card;
use App\Models\User;

class CardPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Card $card): bool
    {
        return $user->belongsToHousehold($card->household_id);
    }

    public function create(User $user): bool
    {
        return $user->households()->exists();
    }

    public function update(User $user, Card $card): bool
    {
        return $this->view($user, $card);
    }

    public function delete(User $user, Card $card): bool
    {
        return $this->view($user, $card);
    }
}
