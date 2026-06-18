import AppLogoIcon from '@/components/app-logo-icon';

type AppLogoProps = {
    subtitle?: string;
};

export default function AppLogo({ subtitle = 'Controle do lar' }: AppLogoProps) {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-1 grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Casa no Azul</span>
                {subtitle && (
                    <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
                )}
            </div>
        </>
    );
}
