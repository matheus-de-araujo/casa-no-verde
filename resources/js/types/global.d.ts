import type { Auth } from '@/types/auth';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            currentHousehold: {
                id: number;
                name: string;
                slug: string;
                monthly_income_goal: string | number;
                monthly_expense_limit: string | number;
                monthly_saving_goal: string | number;
            } | null;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
