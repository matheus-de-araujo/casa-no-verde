<?php

use App\Models\Card;
use App\Models\Household;
use App\Services\Transactions\CompetenceMonthResolver;

it('keeps credit card purchases on the closing day in the same month', function () {
    $household = Household::create(['name' => 'Casa', 'slug' => 'casa']);
    $card = Card::create([
        'household_id' => $household->id,
        'name' => 'Nubank',
        'closing_day' => 25,
        'due_day' => 5,
    ]);

    $resolver = new CompetenceMonthResolver;

    expect($resolver->resolve('2026-07-25', 'credit_card', $card))->toBe('2026-07')
        ->and($resolver->resolve('2026-07-26', 'credit_card', $card))->toBe('2026-08')
        ->and($resolver->resolve('2026-07-26', 'pix', $card))->toBe('2026-07');
});
