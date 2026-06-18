export function formatCurrency(value: number | string | null | undefined): string {
    const number = Number(value ?? 0);

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(number);
}

export function parseCurrencyInput(value: string): string {
    const normalized = value.replace(/[^0-9,.-]/g, '').replace(',', '.');

    return normalized || '0';
}
