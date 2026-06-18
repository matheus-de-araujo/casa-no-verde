<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('goal_contributions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('household_id')->constrained()->cascadeOnDelete();
            $table->foreignId('goal_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->date('contributed_at');
            $table->string('competence_month', 7);
            $table->string('notes')->nullable();
            $table->timestamps();
            $table->index(['household_id', 'competence_month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goal_contributions');
    }
};
