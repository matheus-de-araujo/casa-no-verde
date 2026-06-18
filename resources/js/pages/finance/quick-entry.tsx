import { Head, useForm } from '@inertiajs/react';
import { PageShell } from '@/components/finance/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { financePath, useCurrentHousehold } from '@/lib/finance-routes';

type Option = { id: number; name: string; type?: string; color?: string };

type Props = {
    categories: Option[];
    accounts: Option[];
    cards: Option[];
    users: Option[];
};

export default function QuickEntry({ categories, accounts, cards, users }: Props) {
    const household = useCurrentHousehold();
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        description: '',
        category_id: categories[0]?.id?.toString() ?? '',
        user_id: users[0]?.id?.toString() ?? '',
        account_id: '',
        card_id: '',
        entry_type: 'single',
        payment_method: 'pix',
        transaction_date: new Date().toISOString().slice(0, 10),
        installments_count: '2',
        necessity: 'essential',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(financePath(household.slug, '/expenses'));
    }

    return (
        <>
            <Head title="Lançar gasto" />
            <PageShell title="Lançar gasto rápido">
                <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Valor</Label>
                        <Input id="amount" inputMode="decimal" autoFocus placeholder="87,90" value={data.amount} onChange={(event) => setData('amount', event.target.value.replace(',', '.'))} />
                        {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input id="description" placeholder="Supermercado" value={data.description} onChange={(event) => setData('description', event.target.value)} />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <Select label="Categoria" value={data.category_id} onChange={(value) => setData('category_id', value)} options={categories} />
                        <Select label="Pessoa" value={data.user_id} onChange={(value) => setData('user_id', value)} options={users} />
                        <Select label="Conta" value={data.account_id} onChange={(value) => setData('account_id', value)} options={[{ id: 0, name: 'Nenhuma' }, ...accounts]} />
                        <Select label="Cartão" value={data.card_id} onChange={(value) => setData('card_id', value === '0' ? '' : value)} options={[{ id: 0, name: 'Nenhum' }, ...cards]} />
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        <NativeSelect label="Tipo" value={data.entry_type} onChange={(value) => setData('entry_type', value)} options={[['single', 'À vista'], ['installment', 'Parcela'], ['subscription', 'Assinatura']]} />
                        <NativeSelect label="Pagamento" value={data.payment_method} onChange={(value) => setData('payment_method', value)} options={[['pix', 'Pix'], ['debit', 'Débito'], ['credit_card', 'Cartão'], ['cash', 'Dinheiro']]} />
                        <NativeSelect label="Necessidade" value={data.necessity} onChange={(value) => setData('necessity', value)} options={[['essential', 'Essencial'], ['important', 'Importante'], ['desire', 'Desejo']]} />
                    </div>

                    {data.entry_type === 'installment' && (
                        <div className="grid gap-2">
                            <Label htmlFor="installments_count">Parcelas</Label>
                            <Input id="installments_count" type="number" min="2" max="60" value={data.installments_count} onChange={(event) => setData('installments_count', event.target.value)} />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="transaction_date">Data</Label>
                        <Input id="transaction_date" type="date" value={data.transaction_date} onChange={(event) => setData('transaction_date', event.target.value)} />
                    </div>

                    <Button type="submit" disabled={processing} className="w-full">Salvar gasto</Button>
                </form>
            </PageShell>
        </>
    );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Option[] }) {
    return (
        <label className="grid gap-2 text-sm font-medium">
            {label}
            <select className="h-10 rounded-md border bg-background px-3" value={value || '0'} onChange={(event) => onChange(event.target.value === '0' ? '' : event.target.value)}>
                {options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
            </select>
        </label>
    );
}

function NativeSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
    return (
        <label className="grid gap-2 text-sm font-medium">
            {label}
            <select className="h-10 rounded-md border bg-background px-3" value={value} onChange={(event) => onChange(event.target.value)}>
                {options.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </select>
        </label>
    );
}

QuickEntry.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
