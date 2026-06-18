import { Head } from '@inertiajs/react';
import { PageShell } from '@/components/finance/page-shell';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/currency';

type BudgetRow = { id: number; category: string; color: string; limit: number; spent: number; remaining: number; status: string };

const statusClass: Record<string, string> = {
    green: 'bg-emerald-100 text-emerald-800',
    yellow: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
    danger: 'bg-red-600 text-white',
    none: 'bg-muted text-muted-foreground',
};

export default function Budgets({ month, budgets }: { month: string; budgets: BudgetRow[] }) {
    return (
        <>
            <Head title="Orçamento" />
            <PageShell title={`Orçamento por categoria (${month})`}>
                <div className="overflow-hidden rounded-2xl border bg-card">
                    {budgets.map((budget) => (
                        <div key={budget.id} className="grid gap-2 border-b p-4 last:border-0 md:grid-cols-5 md:items-center">
                            <div className="font-medium">{budget.category}</div>
                            <div>Limite: {formatCurrency(budget.limit)}</div>
                            <div>Gasto: {formatCurrency(budget.spent)}</div>
                            <div>Restante: {formatCurrency(budget.remaining)}</div>
                            <div><span className={`rounded-full px-2 py-1 text-xs ${statusClass[budget.status]}`}>{budget.status}</span></div>
                        </div>
                    ))}
                </div>
            </PageShell>
        </>
    );
}

Budgets.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
