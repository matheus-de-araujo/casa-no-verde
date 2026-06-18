import { Link, usePage } from '@inertiajs/react';
import { BadgeDollarSign, CalendarClock, CreditCard, LayoutGrid, ListPlus, PiggyBank, WalletCards } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import type { NavGroup } from '@/types';

export function AppSidebar() {
    const household = usePage().props.currentHousehold as { slug: string; name: string } | null;
    const base = household ? `/h/${household.slug}` : '/dashboard';

    const navGroups: NavGroup[] = [
        {
            label: 'Visão geral',
            items: [{ title: 'Dashboard', href: `${base}/dashboard`, icon: LayoutGrid }],
        },
        {
            label: 'Ação rápida',
            items: [{ title: 'Lançar gasto', href: `${base}/expenses/create`, icon: ListPlus, highlight: true }],
        },
        {
            label: 'Finanças',
            items: [
                { title: 'Cartões', href: `${base}/cards`, icon: CreditCard },
                { title: 'Orçamento', href: `${base}/budgets`, icon: BadgeDollarSign },
                { title: 'Parcelas', href: `${base}/installments`, icon: WalletCards },
                { title: 'Assinaturas', href: `${base}/subscriptions`, icon: CalendarClock },
                { title: 'Metas', href: `${base}/goals`, icon: PiggyBank },
            ],
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-sidebar-border/60">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={household ? `${base}/dashboard` : '/dashboard'} prefetch>
                                <AppLogo subtitle={household?.name ?? 'Controle do lar'} />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0">
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/60">
                <SidebarSeparator className="mx-0 hidden group-data-[collapsible=icon]:block" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
