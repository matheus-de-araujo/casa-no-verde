import { cn } from '@/lib/utils';

type ProgressBarProps = {
    value: number;
    max: number;
    className?: string;
    tone?: 'brand' | 'success' | 'warning' | 'danger';
};

const toneFill = {
    brand: 'bg-primary',
    success: 'bg-emerald-600 dark:bg-emerald-500',
    warning: 'bg-amber-600 dark:bg-amber-500',
    danger: 'bg-red-600 dark:bg-red-500',
};

export function ProgressBar({ value, max, className, tone = 'brand' }: ProgressBarProps) {
    const ratio = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

    return (
        <div
            className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
            role="progressbar"
            aria-valuenow={Math.round(ratio)}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <div
                className={cn('h-full rounded-full transition-[width] duration-300 ease-out', toneFill[tone])}
                style={{ width: `${ratio}%` }}
            />
        </div>
    );
}
