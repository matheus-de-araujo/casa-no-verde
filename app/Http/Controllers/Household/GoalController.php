<?php

namespace App\Http\Controllers\Household;

use App\Http\Controllers\Controller;
use App\Models\Goal;
use App\Models\GoalContribution;
use App\Models\Household;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class GoalController extends Controller
{
    public function index(Household $household): Response
    {
        $month = now($household->timezone)->format('Y-m');

        return Inertia::render('finance/goals', [
            'monthly_saving_goal' => (float) $household->monthly_saving_goal,
            'goals' => Goal::query()
                ->where('household_id', $household->id)
                ->withSum(['contributions as saved_this_month' => fn ($query) => $query->where('competence_month', $month)], 'amount')
                ->get()
                ->map(fn (Goal $goal) => [
                    'id' => $goal->id,
                    'name' => $goal->name,
                    'target_amount' => (float) $goal->target_amount,
                    'current_amount' => (float) $goal->current_amount,
                    'saved_this_month' => (float) ($goal->saved_this_month ?? 0),
                    'is_monthly_saving_goal' => $goal->is_monthly_saving_goal,
                ]),
        ]);
    }

    public function contribute(Household $household, Goal $goal, Request $request): RedirectResponse
    {
        abort_unless($goal->household_id === $household->id, 404);

        $data = $request->validate(['amount' => ['required', 'numeric', 'min:0.01'], 'notes' => ['nullable', 'string', 'max:255']]);

        DB::transaction(function () use ($household, $goal, $request, $data): void {
            GoalContribution::create([
                'household_id' => $household->id,
                'goal_id' => $goal->id,
                'user_id' => $request->user()->id,
                'amount' => $data['amount'],
                'contributed_at' => now($household->timezone)->toDateString(),
                'competence_month' => now($household->timezone)->format('Y-m'),
                'notes' => $data['notes'] ?? null,
            ]);

            $goal->increment('current_amount', $data['amount']);
        });

        return back()->with('success', 'Meta atualizada.');
    }
}
