import { cn } from '@/lib/utils';

type MetricCardProps = {
    label: string;
    value: string;
    helper?: string;
    tone?: 'default' | 'good' | 'warning' | 'danger' | 'strong';
};

const tones = {
    default: 'border-sidebar-border/70 bg-card',
    good: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-50',
    warning: 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-50',
    danger: 'border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/30 dark:text-red-50',
    strong: 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-50',
};

export function MetricCard({ label, value, helper, tone = 'default' }: MetricCardProps) {
    return (
        <div className={cn('rounded-2xl border p-4 shadow-sm', tones[tone])}>
            <p className="text-sm font-medium opacity-70">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
            {helper && <p className="mt-1 text-xs opacity-70">{helper}</p>}
        </div>
    );
}
