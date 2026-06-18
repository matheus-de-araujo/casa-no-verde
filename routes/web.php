<?php

use App\Http\Controllers\Household\BudgetController;
use App\Http\Controllers\Household\CardController;
use App\Http\Controllers\Household\DashboardController;
use App\Http\Controllers\Household\ExpenseController;
use App\Http\Controllers\Household\GoalController;
use App\Http\Controllers\Household\InstallmentController;
use App\Http\Controllers\Household\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $household = request()->user()->households()->first();

        abort_unless($household, 404);

        return redirect()->route('households.dashboard', $household);
    })->name('dashboard');

    Route::middleware('household.access')
        ->prefix('h/{household:slug}')
        ->name('households.')
        ->group(function (): void {
            Route::get('dashboard', DashboardController::class)->name('dashboard');
            Route::get('expenses/create', [ExpenseController::class, 'create'])->name('expenses.create');
            Route::post('expenses', [ExpenseController::class, 'store'])->name('expenses.store');
            Route::get('cards', CardController::class)->name('cards.index');
            Route::get('budgets', BudgetController::class)->name('budgets.index');
            Route::get('installments', InstallmentController::class)->name('installments.index');
            Route::get('subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
            Route::post('subscriptions', [SubscriptionController::class, 'store'])->name('subscriptions.store');
            Route::get('goals', [GoalController::class, 'index'])->name('goals.index');
            Route::post('goals/{goal}/contributions', [GoalController::class, 'contribute'])->name('goals.contribute');
        });
});

require __DIR__.'/settings.php';
