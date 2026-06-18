import { BottomNav } from '@/components/finance/bottom-nav';

type PageShellProps = {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
};

export function PageShell({ title, subtitle, children }: PageShellProps) {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 p-4 pb-24 md:p-6 md:pb-6">
            <header className="space-y-1">
                {subtitle && (
                    <p className="text-sm font-medium text-primary">{subtitle}</p>
                )}
                <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
            </header>
            {children}
            <BottomNav />
        </div>
    );
}
