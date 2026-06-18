import { Head } from '@inertiajs/react';
import { DetailRow } from '@/components/finance/detail-row';
import { MetricCard } from '@/components/finance/metric-card';
import { PageShell } from '@/components/finance/page-shell';
import { ProgressBar } from '@/components/finance/progress-bar';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/currency';
import type { DashboardPayload } from '@/types';

function formatCompetenceMonth(month: string): string {
    const [year, monthPart] = month.split('-');
    const date = new Date(Number(year), Number(monthPart) - 1, 1);

    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function resolveDailyTone(dashboard: DashboardPayload): 'brand' | 'good' | 'warning' | 'danger' {
    if (dashboard.remaining_monthly_budget <= 0) {
        return 'danger';
    }

    if (dashboard.daily_allowance < 100) {
        return 'warning';
    }

    return 'brand';
}

export default function Dashboard({ dashboard }: { dashboard: DashboardPayload }) {
    const dailyTone = resolveDailyTone(dashboard);
    const cardUsageRatio = dashboard.card_budget_limit > 0
        ? dashboard.current_cards / dashboard.card_budget_limit
        : 0;
    const cardTone = cardUsageRatio >= 1 ? 'danger' : cardUsageRatio >= 0.85 ? 'warning' : 'brand';
    const reserveRatio = dashboard.reserve_target > 0
        ? dashboard.reserve_current / dashboard.reserve_target
        : 0;
    const savingRatio = dashboard.monthly_saving_goal > 0
        ? dashboard.saved_this_month / dashboard.monthly_saving_goal
        : 0;
    const installmentEntries = Object.entries(dashboard.future_installments_by_month);

    return (
        <>
            <Head title="Dashboard" />
            <PageShell
                title="Quanto ainda dá para gastar?"
                subtitle={formatCompetenceMonth(dashboard.month)}
            >
                <MetricCard
                    variant="hero"
                    label="Pode gastar hoje"
                    value={formatCurrency(dashboard.daily_allowance)}
                    helper={
                        dashboard.remaining_monthly_budget <= 0
                            ? 'Orçamento do mês esgotado'
                            : `${dashboard.days_remaining} dias restantes no mês`
                    }
                    tone={dailyTone}
                />

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    <MetricCard
                        variant="compact"
                        label="Gastos do mês"
                        value={formatCurrency(dashboard.monthly_spent)}
                    />
                    <MetricCard
                        variant="compact"
                        label="Restante no mês"
                        value={formatCurrency(dashboard.remaining_monthly_budget)}
                        tone={dashboard.remaining_monthly_budget < 0 ? 'danger' : 'strong'}
                    />
                    <MetricCard
                        variant="compact"
                        label="Limite de gastos"
                        value={formatCurrency(dashboard.monthly_expense_limit)}
                        className="col-span-2 md:col-span-1"
                    />
                </div>

                <section className="rounded-xl border bg-card p-4 md:p-5" aria-labelledby="budget-details-heading">
                    <h2 id="budget-details-heading" className="text-base font-semibold">
                        Orçamento do mês
                    </h2>
                    <dl className="mt-1">
                        <DetailRow label="Renda prevista" value={formatCurrency(dashboard.monthly_income_goal)} />
                        <DetailRow
                            label="Meta de guardar"
                            value={`${formatCurrency(dashboard.saved_this_month)} / ${formatCurrency(dashboard.monthly_saving_goal)}`}
                            helper={dashboard.monthly_saving_gap > 0 ? `Faltam ${formatCurrency(dashboard.monthly_saving_gap)}` : 'Meta atingida'}
                            emphasis={dashboard.monthly_saving_gap <= 0}
                        />
                    </dl>
                    <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Progresso da meta mensal</span>
                            <span>{Math.round(savingRatio * 100)}%</span>
                        </div>
                        <ProgressBar
                            value={dashboard.saved_this_month}
                            max={dashboard.monthly_saving_goal}
                            tone={dashboard.monthly_saving_gap > 0 ? 'warning' : 'success'}
                        />
                    </div>
                </section>

                <section className="rounded-xl border bg-card p-4 md:p-5" aria-labelledby="cards-reserve-heading">
                    <h2 id="cards-reserve-heading" className="text-base font-semibold">
                        Cartões e reserva
                    </h2>
                    <dl className="mt-1">
                        <DetailRow
                            label="Cartões no mês"
                            value={`${formatCurrency(dashboard.current_cards)} / ${formatCurrency(dashboard.card_budget_limit)}`}
                        />
                        <DetailRow
                            label="Reserva total"
                            value={`${formatCurrency(dashboard.reserve_current)} / ${formatCurrency(dashboard.reserve_target)}`}
                            emphasis={reserveRatio >= 1}
                        />
                    </dl>
                    <div className="mt-4 space-y-4">
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Uso do limite de cartões</span>
                                <span>{Math.round(cardUsageRatio * 100)}%</span>
                            </div>
                            <ProgressBar
                                value={dashboard.current_cards}
                                max={dashboard.card_budget_limit}
                                tone={cardTone}
                            />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Reserva acumulada</span>
                                <span>{Math.round(reserveRatio * 100)}%</span>
                            </div>
                            <ProgressBar
                                value={dashboard.reserve_current}
                                max={dashboard.reserve_target}
                                tone={reserveRatio >= 1 ? 'success' : 'brand'}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border bg-card p-4 md:p-5" aria-labelledby="installments-heading">
                    <h2 id="installments-heading" className="text-base font-semibold">
                        Parcelas futuras
                    </h2>
                    {installmentEntries.length === 0 ? (
                        <p className="mt-3 text-sm text-muted-foreground">
                            Nenhuma parcela futura lançada. Quando você registrar compras parceladas, elas aparecem aqui mês a mês.
                        </p>
                    ) : (
                        <ul className="mt-3 divide-y divide-border/60">
                            {installmentEntries.map(([month, total]) => (
                                <li key={month} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                    <span className="text-sm text-muted-foreground">{month}</span>
                                    <span className="text-sm font-semibold tabular-nums">{formatCurrency(total)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </PageShell>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
