import { Head } from '@inertiajs/react';
import { PageShell } from '@/components/finance/page-shell';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/currency';

type CardRow = {
    id: number;
    name: string;
    limit_amount: number;
    budget_limit: number;
    closing_day: number;
    due_day: number;
    current_invoice: number;
    future_installments: number;
    next_invoices: Record<string, number>;
};

export default function Cards({ cards }: { cards: CardRow[] }) {
    return (
        <>
            <Head title="Cartões" />
            <PageShell title="Cartões">
                <div className="grid gap-4 md:grid-cols-2">
                    {cards.map((card) => {
                        const overBudget = card.current_invoice > card.budget_limit;

                        return (
                            <section key={card.id} className="rounded-2xl border bg-card p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold">{card.name}</h2>
                                        <p className="text-sm text-muted-foreground">Fecha dia {card.closing_day}, vence dia {card.due_day}</p>
                                    </div>
                                    <span className={overBudget ? 'rounded-full bg-red-100 px-2 py-1 text-xs text-red-700' : 'rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700'}>{overBudget ? 'Passou' : 'Dentro'}</span>
                                </div>
                                <div className="mt-4 grid gap-2 text-sm">
                                    <Line label="Fatura atual" value={`${formatCurrency(card.current_invoice)} / ${formatCurrency(card.budget_limit)}`} />
                                    <Line label="Limite real" value={formatCurrency(card.limit_amount)} />
                                    <Line label="Compras futuras" value={formatCurrency(card.future_installments)} />
                                </div>
                                <div className="mt-4 space-y-2">
                                    <h3 className="text-sm font-medium">Próximas faturas</h3>
                                    {Object.entries(card.next_invoices).map(([month, total]) => <Line key={month} label={month} value={formatCurrency(total)} />)}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </PageShell>
        </>
    );
}

function Line({ label, value }: { label: string; value: string }) {
    return <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2"><span>{label}</span><strong>{value}</strong></div>;
}

Cards.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
