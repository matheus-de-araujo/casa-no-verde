<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('goals', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('household_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('target_amount', 12, 2);
            $table->decimal('current_amount', 12, 2)->default(0);
            $table->date('deadline')->nullable();
            $table->boolean('is_monthly_saving_goal')->default(false);
            $table->timestamps();
            $table->index(['household_id', 'is_monthly_saving_goal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};
