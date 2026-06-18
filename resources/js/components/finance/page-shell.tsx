import { BottomNav } from '@/components/finance/bottom-nav';

export function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 p-4 pb-24 md:p-6 md:pb-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            </div>
            {children}
            <BottomNav />
        </div>
    );
}
