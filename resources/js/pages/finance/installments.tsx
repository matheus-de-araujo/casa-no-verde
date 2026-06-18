import { Head } from '@inertiajs/react';
import { PageShell } from '@/components/finance/page-shell';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/currency';

type Group = { id: number; description: string; current_installment: number; installments_count: number | null; amount: number; remaining: number; ends_at: string | null };

export default function Installments({ groups, projection }: { groups: Group[]; projection: Record<string, number> }) {
    return (
        <>
            <Head title="Parcelas" />
            <PageShell title="Parcelas">
                <section className="rounded-2xl border bg-card p-4">
                    <h2 className="text-lg font-semibold">Total comprometido nos próximos meses</h2>
                    <div className="mt-3 space-y-2">
                        {Object.entries(projection).map(([month, total]) => <Line key={month} label={month} value={formatCurrency(total)} />)}
                        {Object.keys(projection).length === 0 && <p className="text-sm text-muted-foreground">Sem parcelas futuras.</p>}
                    </div>
                </section>
                <section className="rounded-2xl border bg-card p-4">
                    <h2 className="text-lg font-semibold">Compras parceladas</h2>
                    <div className="mt-3 space-y-2">
                        {groups.map((group) => <Line key={group.id} label={`${group.description} (${group.current_installment}/${group.installments_count ?? '?'})`} value={`${formatCurrency(group.amount)} · faltam ${group.remaining} · acaba ${group.ends_at ?? '?'}`} />)}
                    </div>
                </section>
            </PageShell>
        </>
    );
}

function Line({ label, value }: { label: string; value: string }) {
    return <div className="flex items-center justify-between gap-3 rounded-xl bg-muted px-3 py-2 text-sm"><span>{label}</span><strong className="text-right">{value}</strong></div>;
}

Installments.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
