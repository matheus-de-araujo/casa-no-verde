<?php

namespace App\Http\Controllers\Household;

use App\Http\Controllers\Controller;
use App\Models\Household;
use App\Models\Subscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(Household $household): Response
    {
        return Inertia::render('finance/subscriptions', [
            'subscriptions' => $household->subscriptions()->with('category')->orderBy('billing_day')->get()->map(fn ($subscription) => [
                'id' => $subscription->id,
                'name' => $subscription->name,
                'amount' => (float) $subscription->amount,
                'billing_day' => $subscription->billing_day,
                'category' => $subscription->category->name,
                'active' => $subscription->active,
            ]),
            'categories' => $household->categories()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'cards' => $household->cards()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'accounts' => $household->accounts()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Household $household, Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'billing_day' => ['required', 'integer', 'min:1', 'max:31'],
            'category_id' => ['required', 'exists:categories,id'],
            'card_id' => ['nullable', 'exists:cards,id'],
            'account_id' => ['nullable', 'exists:accounts,id'],
        ]);

        Subscription::create([...$data, 'household_id' => $household->id, 'user_id' => $request->user()->id, 'start_date' => now()->toDateString()]);

        return back()->with('success', 'Assinatura criada.');
    }
}
