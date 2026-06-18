<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('households', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('monthly_income_goal', 12, 2)->default(0);
            $table->decimal('monthly_expense_limit', 12, 2)->default(0);
            $table->decimal('monthly_saving_goal', 12, 2)->default(0);
            $table->string('timezone')->default('America/Sao_Paulo');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('households');
    }
};
