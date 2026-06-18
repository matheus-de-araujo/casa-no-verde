<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Card extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id',
        'account_id',
        'name',
        'limit_amount',
        'budget_limit',
        'closing_day',
        'due_day',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'limit_amount' => 'decimal:2',
            'budget_limit' => 'decimal:2',
            'closing_day' => 'integer',
            'due_day' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
