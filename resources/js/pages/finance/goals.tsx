import { Head, useForm } from '@inertiajs/react';
import { PageShell } from '@/components/finance/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/currency';
import { financePath, useCurrentHousehold } from '@/lib/finance-routes';

type Goal = { id: number; name: string; target_amount: number; current_amount: number; saved_this_month: number; is_monthly_saving_goal: boolean };

export default function Goals({ monthly_saving_goal, goals }: { monthly_saving_goal: number; goals: Goal[] }) {
    const household = useCurrentHousehold();
    const { data, setData, post, processing, reset } = useForm({ amount: '', notes: '' });

    function contribute(goal: Goal) {
        post(financePath(household.slug, `/goals/${goal.id}/contributions`), { onSuccess: () => reset() });
    }

    return (
        <>
            <Head title="Metas" />
            <PageShell title="Metas de reserva">
                <div className="grid gap-4 md:grid-cols-2">
                    {goals.map((goal) => (
                        <section key={goal.id} className="rounded-2xl border bg-card p-4">
                            <h2 className="text-lg font-semibold">{goal.name}</h2>
                            <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}</p>
                            {goal.is_monthly_saving_goal && <p className="mt-1 text-sm">Guardado no mês: {formatCurrency(goal.saved_this_month)} / {formatCurrency(monthly_saving_goal)}</p>}
                            <div className="mt-4 grid gap-2">
                                <Input inputMode="decimal" placeholder="Valor do depósito" value={data.amount} onChange={(event) => setData('amount', event.target.value.replace(',', '.'))} />
                                <Input placeholder="Observação" value={data.notes} onChange={(event) => setData('notes', event.target.value)} />
                                <Button disabled={processing || !data.amount} onClick={() => contribute(goal)}>Registrar depósito</Button>
                            </div>
                        </section>
                    ))}
                </div>
            </PageShell>
        </>
    );
}

Goals.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
