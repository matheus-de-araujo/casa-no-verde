<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('installment_groups', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('household_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->foreignId('card_id')->nullable()->constrained()->nullOnDelete();
            $table->string('description');
            $table->decimal('total_amount', 12, 2);
            $table->unsignedInteger('installments_count')->nullable();
            $table->decimal('installment_amount', 12, 2)->nullable();
            $table->unsignedInteger('rounding_installment')->nullable();
            $table->date('purchase_date');
            $table->string('first_month', 7);
            $table->string('status')->default('active');
            $table->timestamps();
            $table->softDeletes();
            $table->index(['household_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('installment_groups');
    }
};
