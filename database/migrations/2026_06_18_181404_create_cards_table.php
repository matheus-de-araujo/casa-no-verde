<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cards', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('household_id')->constrained()->cascadeOnDelete();
            $table->foreignId('account_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->decimal('limit_amount', 12, 2)->default(0);
            $table->decimal('budget_limit', 12, 2)->default(0);
            $table->unsignedTinyInteger('closing_day');
            $table->unsignedTinyInteger('due_day');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['household_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
