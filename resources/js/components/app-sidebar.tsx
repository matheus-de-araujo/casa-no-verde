import { Link, usePage } from '@inertiajs/react';
import { BadgeDollarSign, BookOpen, CalendarClock, CreditCard, LayoutGrid, ListPlus, PiggyBank, WalletCards } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
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
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Calculation Spec',
        href: '/docs/calculation-spec.md',
        icon: BookOpen,
    },
    {
        title: 'Laravel Docs',
        href: 'https://laravel.com/docs',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const household = usePage().props.currentHousehold as { slug: string } | null;
    const base = household ? `/h/${household.slug}` : '/dashboard';
    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: `${base}/dashboard`, icon: LayoutGrid },
        { title: 'Lançar gasto', href: `${base}/expenses/create`, icon: ListPlus },
        { title: 'Cartões', href: `${base}/cards`, icon: CreditCard },
        { title: 'Orçamento', href: `${base}/budgets`, icon: BadgeDollarSign },
        { title: 'Parcelas', href: `${base}/installments`, icon: WalletCards },
        { title: 'Assinaturas', href: `${base}/subscriptions`, icon: CalendarClock },
        { title: 'Metas', href: `${base}/goals`, icon: PiggyBank },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={household ? `${base}/dashboard` : '/dashboard'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
