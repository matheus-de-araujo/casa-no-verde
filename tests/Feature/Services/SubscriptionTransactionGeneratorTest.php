<?php

use App\Models\Category;
use App\Models\Household;
use App\Models\Subscription;
use App\Models\User;
use App\Services\Subscriptions\SubscriptionTransactionGenerator;
use Illuminate\Support\Carbon;

it('generates due subscriptions once per competence month', function () {
    $user = User::factory()->create();
    $household = Household::create(['name' => 'Casa', 'slug' => 'casa']);
    $category = Category::create(['household_id' => $household->id, 'name' => 'Assinaturas']);
    Subscription::create([
        'household_id' => $household->id,
        'user_id' => $user->id,
        'category_id' => $category->id,
        'name' => 'Netflix',
        'amount' => 20.90,
        'billing_day' => 10,
        'start_date' => '2026-07-01',
    ]);

    $generator = app(SubscriptionTransactionGenerator::class);

    expect($generator->generateDue(Carbon::parse('2026-07-10')))->toBe(1)
        ->and($generator->generateDue(Carbon::parse('2026-07-20')))->toBe(0)
        ->and($household->transactions()->count())->toBe(1);
});
