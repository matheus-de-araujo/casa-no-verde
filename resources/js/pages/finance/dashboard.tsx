import { Head } from '@inertiajs/react';
import { MetricCard } from '@/components/finance/metric-card';
import { PageShell } from '@/components/finance/page-shell';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/currency';
import type { DashboardPayload } from '@/types';

export default function Dashboard({ dashboard }: { dashboard: DashboardPayload }) {
    const dailyTone = dashboard.remaining_monthly_budget <= 0 ? 'danger' : dashboard.daily_allowance < 100 ? 'warning' : 'good';

    return (
        <>
            <Head title="Dashboard" />
            <PageShell title="Dashboard do mês">
                <MetricCard
                    label="Pode gastar hoje"
                    value={formatCurrency(dashboard.daily_allowance)}
                    helper={`${dashboard.days_remaining} dias restantes no mês`}
                    tone={dailyTone}
                />

                <div className="grid gap-3 md:grid-cols-3">
                    <MetricCard label="Renda prevista" value={formatCurrency(dashboard.monthly_income_goal)} />
                    <MetricCard label="Gastos do mês" value={formatCurrency(dashboard.monthly_spent)} />
                    <MetricCard label="Limite de gastos" value={formatCurrency(dashboard.monthly_expense_limit)} />
                    <MetricCard label="Pode gastar ainda" value={formatCurrency(dashboard.remaining_monthly_budget)} tone={dashboard.remaining_monthly_budget < 0 ? 'danger' : 'strong'} />
                    <MetricCard label="Cartões atuais" value={`${formatCurrency(dashboard.current_cards)} / ${formatCurrency(dashboard.card_budget_limit)}`} />
                    <MetricCard label="Guardado no mês" value={`${formatCurrency(dashboard.saved_this_month)} / ${formatCurrency(dashboard.monthly_saving_goal)}`} />
                    <MetricCard label="Reserva total" value={`${formatCurrency(dashboard.reserve_current)} / ${formatCurrency(dashboard.reserve_target)}`} />
                    <MetricCard label="Falta guardar" value={formatCurrency(dashboard.monthly_saving_gap)} tone={dashboard.monthly_saving_gap > 0 ? 'warning' : 'good'} />
                </div>

                <section className="rounded-2xl border bg-card p-4">
                    <h2 className="text-lg font-semibold">Parcelas futuras</h2>
                    <div className="mt-3 space-y-2">
                        {Object.entries(dashboard.future_installments_by_month).length === 0 && <p className="text-sm text-muted-foreground">Nenhuma parcela futura lançada.</p>}
                        {Object.entries(dashboard.future_installments_by_month).map(([month, total]) => (
                            <div key={month} className="flex items-center justify-between rounded-xl bg-muted px-3 py-2">
                                <span>{month}</span>
                                <strong>{formatCurrency(total)}</strong>
                            </div>
                        ))}
                    </div>
                </section>
            </PageShell>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
