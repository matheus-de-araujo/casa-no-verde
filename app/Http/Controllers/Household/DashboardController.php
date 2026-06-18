<?php

namespace App\Http\Controllers\Household;

use App\Http\Controllers\Controller;
use App\Models\Household;
use App\Services\Dashboard\DashboardAggregator;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Household $household, DashboardAggregator $dashboard): Response
    {
        return Inertia::render('finance/dashboard', [
            'dashboard' => $dashboard->aggregate($household),
        ]);
    }
}
