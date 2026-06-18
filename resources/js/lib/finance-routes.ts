import { usePage } from '@inertiajs/react';

type CurrentHousehold = {
    id: number;
    name: string;
    slug: string;
    monthly_income_goal: number | string;
    monthly_expense_limit: number | string;
    monthly_saving_goal: number | string;
};

export function useCurrentHousehold(): CurrentHousehold {
    const household = usePage().props.currentHousehold as CurrentHousehold | null;

    if (!household) {
        throw new Error('Current household is not available on this page.');
    }

    return household;
}

export function financePath(slug: string, path: string): string {
    return `/h/${slug}${path}`;
}
