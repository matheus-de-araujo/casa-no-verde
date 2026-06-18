<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('household_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('account_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('card_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('installment_group_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('subscription_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('goal_id')->nullable()->constrained()->nullOnDelete();
            $table->string('description');
            $table->decimal('amount', 12, 2);
            $table->string('type');
            $table->string('payment_method');
            $table->date('transaction_date');
            $table->string('competence_month', 7);
            $table->string('status')->default('pending');
            $table->string('necessity')->nullable();
            $table->unsignedInteger('installment_number')->nullable();
            $table->boolean('is_generated')->default(false);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['household_id', 'competence_month', 'type']);
            $table->index(['household_id', 'card_id', 'competence_month']);
            $table->unique(['installment_group_id', 'installment_number']);
            $table->unique(['subscription_id', 'competence_month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
