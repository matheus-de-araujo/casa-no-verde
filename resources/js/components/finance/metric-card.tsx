import { cn } from '@/lib/utils';

type MetricCardProps = {
    label: string;
    value: string;
    helper?: string;
    tone?: 'default' | 'brand' | 'good' | 'warning' | 'danger' | 'strong';
    variant?: 'default' | 'hero' | 'compact';
    className?: string;
};

const tones = {
    default: 'border-border bg-card text-foreground',
    brand: 'border-primary/25 bg-primary/8 text-foreground dark:border-primary/35 dark:bg-primary/15',
    good: 'border-emerald-300/80 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-50',
    warning: 'border-amber-300/80 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-50',
    danger: 'border-red-300/80 bg-red-50 text-red-950 dark:border-red-800 dark:bg-red-950/40 dark:text-red-50',
    strong: 'border-primary/30 bg-primary/10 text-foreground dark:border-primary/40 dark:bg-primary/20',
};

export function MetricCard({ label, value, helper, tone = 'default', variant = 'default', className }: MetricCardProps) {
    const isHero = variant === 'hero';
    const isCompact = variant === 'compact';
    const labelTone = tone === 'default' ? 'text-muted-foreground' : 'opacity-80';

    return (
        <div
            className={cn(
                'rounded-xl border',
                !isCompact && 'p-4',
                isCompact && 'px-3 py-2.5',
                isHero && 'p-5 md:p-6',
                tones[tone],
                className,
            )}
        >
            <p className={cn('font-medium', labelTone, isHero ? 'text-sm' : isCompact ? 'text-xs' : 'text-sm')}>{label}</p>
            <p
                className={cn(
                    'mt-1 font-semibold tracking-tight tabular-nums',
                    isHero && 'mt-2 text-4xl md:text-5xl',
                    !isHero && !isCompact && 'mt-2 text-2xl',
                    isCompact && 'mt-0.5 text-lg',
                )}
            >
                {value}
            </p>
            {helper && (
                <p className={cn('mt-1 opacity-80', isHero ? 'text-sm' : 'text-xs')}>{helper}</p>
            )}
        </div>
    );
}
