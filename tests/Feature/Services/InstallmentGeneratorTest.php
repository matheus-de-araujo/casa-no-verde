<?php

use App\Models\Card;
use App\Models\Category;
use App\Models\Household;
use App\Models\InstallmentGroup;
use App\Models\User;
use App\Services\Installments\InstallmentGenerator;

it('generates installments across month boundaries and puts rounding cents on the last one', function () {
    $user = User::factory()->create();
    $household = Household::create(['name' => 'Casa', 'slug' => 'casa']);
    $category = Category::create(['household_id' => $household->id, 'name' => 'Casa']);
    $card = Card::create(['household_id' => $household->id, 'name' => 'Nubank', 'closing_day' => 25, 'due_day' => 5]);
    $group = InstallmentGroup::create([
        'household_id' => $household->id,
        'user_id' => $user->id,
        'category_id' => $category->id,
        'card_id' => $card->id,
        'description' => 'Mesa',
        'total_amount' => 1000,
        'installments_count' => 3,
        'purchase_date' => '2026-12-20',
        'first_month' => '2026-12',
    ]);

    $transactions = app(InstallmentGenerator::class)->generate($group);

    expect($transactions)->toHaveCount(3)
        ->and($transactions->pluck('competence_month')->all())->toBe(['2026-12', '2027-01', '2027-02'])
        ->and($transactions->pluck('amount')->map(fn ($amount) => (float) $amount)->all())->toBe([333.33, 333.33, 333.34]);
});
