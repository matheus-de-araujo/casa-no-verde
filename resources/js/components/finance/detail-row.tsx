import { cn } from '@/lib/utils';

type DetailRowProps = {
    label: string;
    value: string;
    helper?: string;
    emphasis?: boolean;
    className?: string;
};

export function DetailRow({ label, value, helper, emphasis = false, className }: DetailRowProps) {
    return (
        <div className={cn('flex items-start justify-between gap-4 border-b border-border/60 py-3 last:border-b-0', className)}>
            <div className="min-w-0">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                {helper && <p className="mt-0.5 text-xs text-muted-foreground">{helper}</p>}
            </div>
            <dd className={cn('shrink-0 text-right text-sm tabular-nums', emphasis ? 'font-semibold text-foreground' : 'font-medium text-foreground')}>
                {value}
            </dd>
        </div>
    );
}
