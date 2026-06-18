import { Head, useForm } from '@inertiajs/react';
import { PageShell } from '@/components/finance/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/currency';
import { financePath, useCurrentHousehold } from '@/lib/finance-routes';

type Option = { id: number; name: string };
type Sub = { id: number; name: string; amount: number; billing_day: number; category: string; active: boolean };

export default function Subscriptions({ subscriptions, categories }: { subscriptions: Sub[]; categories: Option[]; cards: Option[]; accounts: Option[] }) {
    const household = useCurrentHousehold();
    const { data, setData, post, processing, reset } = useForm({ name: '', amount: '', billing_day: '10', category_id: categories[0]?.id?.toString() ?? '', card_id: '', account_id: '' });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(financePath(household.slug, '/subscriptions'), { onSuccess: () => reset('name', 'amount') });
    }

    return (
        <>
            <Head title="Assinaturas" />
            <PageShell title="Assinaturas">
                <form onSubmit={submit} className="grid gap-3 rounded-2xl border bg-card p-4 md:grid-cols-5">
                    <Field label="Nome"><Input value={data.name} onChange={(event) => setData('name', event.target.value)} placeholder="Netflix" /></Field>
                    <Field label="Valor"><Input inputMode="decimal" value={data.amount} onChange={(event) => setData('amount', event.target.value.replace(',', '.'))} /></Field>
                    <Field label="Dia"><Input type="number" min="1" max="31" value={data.billing_day} onChange={(event) => setData('billing_day', event.target.value)} /></Field>
                    <Select label="Categoria" value={data.category_id} onChange={(value) => setData('category_id', value)} options={categories} />
                    <Button disabled={processing} className="self-end">Adicionar</Button>
                </form>
                <div className="rounded-2xl border bg-card">
                    {subscriptions.map((subscription) => <div key={subscription.id} className="grid gap-2 border-b p-4 last:border-0 md:grid-cols-5"><strong>{subscription.name}</strong><span>{formatCurrency(subscription.amount)}</span><span>Dia {subscription.billing_day}</span><span>{subscription.category}</span><span>{subscription.active ? 'Ativa' : 'Pausada'}</span></div>)}
                </div>
            </PageShell>
        </>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
 return <label className="grid gap-2 text-sm font-medium"><Label>{label}</Label>{children}</label>; 
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Option[] }) {
 return <label className="grid gap-2 text-sm font-medium"><Label>{label}</Label><select className="h-10 rounded-md border bg-background px-3" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</select></label>; 
}

Subscriptions.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
