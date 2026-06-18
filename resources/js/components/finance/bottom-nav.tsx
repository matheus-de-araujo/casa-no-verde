import { Link } from '@inertiajs/react';
import { BarChart3, CreditCard, ListPlus, MoreHorizontal } from 'lucide-react';
import { financePath, useCurrentHousehold } from '@/lib/finance-routes';

export function BottomNav() {
    const household = useCurrentHousehold();
    const items = [
        { label: 'Dashboard', href: financePath(household.slug, '/dashboard'), icon: BarChart3 },
        { label: 'Lançar', href: financePath(household.slug, '/expenses/create'), icon: ListPlus },
        { label: 'Parcelas', href: financePath(household.slug, '/installments'), icon: CreditCard },
        { label: 'Mais', href: financePath(household.slug, '/cards'), icon: MoreHorizontal },
    ];

    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-2 py-2 backdrop-blur md:hidden">
            <div className="grid grid-cols-4 gap-1">
                {items.map((item) => (
                    <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
                        <item.icon className="size-5" />
                        {item.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
