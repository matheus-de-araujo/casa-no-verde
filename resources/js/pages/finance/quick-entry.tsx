import { Head, useForm } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { FormSelect } from '@/components/finance/form-select';
import { PageShell } from '@/components/finance/page-shell';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AppLayout from '@/layouts/app-layout';
import { financePath, useCurrentHousehold } from '@/lib/finance-routes';
import { cn } from '@/lib/utils';

type Option = { id: number; name: string; type?: string; color?: string };

type Props = {
    categories: Option[];
    accounts: Option[];
    cards: Option[];
    users: Option[];
};

const paymentOptions = [
    ['pix', 'Pix'],
    ['debit', 'Débito'],
    ['credit_card', 'Cartão'],
    ['cash', 'Dinheiro'],
] as const;

const entryTypeOptions = [
    ['single', 'À vista'],
    ['installment', 'Parcelado'],
    ['subscription', 'Assinatura'],
] as const;

const necessityOptions = [
    ['essential', 'Essencial'],
    ['important', 'Importante'],
    ['desire', 'Desejo'],
] as const;

export default function QuickEntry({ categories, accounts, cards, users }: Props) {
    const household = useCurrentHousehold();
    const [detailsOpen, setDetailsOpen] = useState(false);
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
            <PageShell
                title="Lançar gasto"
                subtitle="Leva menos de um minuto"
            >
                <form onSubmit={submit} className="space-y-6">
                    <section
                        className="rounded-xl border border-primary/25 bg-primary/5 p-4 md:p-5"
                        aria-labelledby="amount-heading"
                    >
                        <Label htmlFor="amount" id="amount-heading" className="text-sm font-medium text-primary">
                            Quanto foi?
                        </Label>
                        <div className="relative mt-2">
                            <span
                                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xl font-medium text-muted-foreground"
                                aria-hidden
                            >
                                R$
                            </span>
                            <Input
                                id="amount"
                                inputMode="decimal"
                                autoFocus
                                placeholder="0,00"
                                value={data.amount}
                                onChange={(event) => setData('amount', event.target.value.replace(',', '.'))}
                                className="h-14 border-0 bg-transparent pl-12 text-3xl font-semibold tabular-nums shadow-none focus-visible:ring-0 md:text-4xl"
                                aria-invalid={!!errors.amount}
                            />
                        </div>
                        {errors.amount && <p className="mt-2 text-sm text-destructive">{errors.amount}</p>}
                    </section>

                    <FormSection title="O que foi?">
                        <div className="grid gap-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Input
                                id="description"
                                placeholder="Ex.: Supermercado, farmácia, almoço"
                                value={data.description}
                                onChange={(event) => setData('description', event.target.value)}
                                aria-invalid={!!errors.description}
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>
                    </FormSection>

                    <FormSection title="Como pagou?">
                        <ToggleGroup
                            type="single"
                            value={data.payment_method}
                            onValueChange={(value) => value && setData('payment_method', value)}
                            className="grid w-full grid-cols-2 gap-2 md:grid-cols-4"
                        >
                            {paymentOptions.map(([value, label]) => (
                                <ToggleGroupItem
                                    key={value}
                                    value={value}
                                    variant="outline"
                                    className={cn(
                                        'h-10 w-full px-2',
                                        'data-[state=on]:border-primary/40 data-[state=on]:bg-primary/10 data-[state=on]:text-primary',
                                    )}
                                >
                                    {label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </FormSection>

                    <FormSection title="Tipo de lançamento">
                        <ToggleGroup
                            type="single"
                            value={data.entry_type}
                            onValueChange={(value) => value && setData('entry_type', value)}
                            className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3"
                        >
                            {entryTypeOptions.map(([value, label]) => (
                                <ToggleGroupItem
                                    key={value}
                                    value={value}
                                    variant="outline"
                                    className={cn(
                                        'h-10 w-full',
                                        'data-[state=on]:border-primary/40 data-[state=on]:bg-primary/10 data-[state=on]:text-primary',
                                    )}
                                >
                                    {label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </FormSection>

                    <div className="grid gap-4 md:grid-cols-2">
                        <FormSelect
                            id="category_id"
                            label="Categoria"
                            value={data.category_id}
                            onChange={(value) => setData('category_id', value)}
                            options={categories.map((category) => ({
                                value: category.id.toString(),
                                label: category.name,
                            }))}
                            error={errors.category_id}
                        />
                        <FormSelect
                            id="user_id"
                            label="Quem gastou?"
                            value={data.user_id}
                            onChange={(value) => setData('user_id', value)}
                            options={users.map((user) => ({
                                value: user.id.toString(),
                                label: user.name,
                            }))}
                            error={errors.user_id}
                        />
                    </div>

                    {data.entry_type === 'installment' && (
                        <div className="rounded-xl border bg-card p-4">
                            <div className="grid gap-2">
                                <Label htmlFor="installments_count">Número de parcelas</Label>
                                <Input
                                    id="installments_count"
                                    type="number"
                                    min="2"
                                    max="60"
                                    value={data.installments_count}
                                    onChange={(event) => setData('installments_count', event.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
                        <CollapsibleTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                className="flex w-full items-center justify-between px-0 text-muted-foreground hover:text-foreground"
                            >
                                <span>Mais detalhes (conta, cartão, data)</span>
                                <ChevronDown
                                    className={cn('size-4 transition-transform duration-200', detailsOpen && 'rotate-180')}
                                />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4 space-y-4 rounded-xl border bg-card p-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormSelect
                                    id="account_id"
                                    label="Conta"
                                    value={data.account_id}
                                    onChange={(value) => setData('account_id', value)}
                                    options={[
                                        { value: EMPTY_VALUE, label: 'Nenhuma' },
                                        ...accounts.map((account) => ({
                                            value: account.id.toString(),
                                            label: account.name,
                                        })),
                                    ]}
                                />
                                <FormSelect
                                    id="card_id"
                                    label="Cartão"
                                    value={data.card_id}
                                    onChange={(value) => setData('card_id', value)}
                                    options={[
                                        { value: EMPTY_VALUE, label: 'Nenhum' },
                                        ...cards.map((card) => ({
                                            value: card.id.toString(),
                                            label: card.name,
                                        })),
                                    ]}
                                />
                            </div>
                            <FormSelect
                                id="necessity"
                                label="Necessidade"
                                value={data.necessity}
                                onChange={(value) => setData('necessity', value)}
                                options={necessityOptions.map(([value, label]) => ({ value, label }))}
                            />
                            <div className="grid gap-2">
                                <Label htmlFor="transaction_date">Data da compra</Label>
                                <Input
                                    id="transaction_date"
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={(event) => setData('transaction_date', event.target.value)}
                                />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    <div className="sticky bottom-20 z-30 pt-2 md:static md:bottom-auto">
                        <Button type="submit" disabled={processing} className="h-11 w-full text-base">
                            {processing ? 'Salvando…' : 'Salvar gasto'}
                        </Button>
                    </div>
                </form>
            </PageShell>
        </>
    );
}

const EMPTY_VALUE = '__empty__';

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            <h2 className="text-sm font-semibold">{title}</h2>
            {children}
        </section>
    );
}

QuickEntry.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
