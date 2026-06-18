<?php

namespace App\Http\Middleware;

use App\Models\Household;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureHouseholdAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $household = $request->route('household');

        abort_unless($household instanceof Household, 404);
        abort_unless($request->user()?->belongsToHousehold($household), 403);

        app()->instance(Household::class, $household);

        return $next($request);
    }
}
