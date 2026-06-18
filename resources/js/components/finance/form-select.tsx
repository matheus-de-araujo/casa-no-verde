import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export type FormSelectOption = {
    value: string;
    label: string;
};

type FormSelectProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: FormSelectOption[];
    placeholder?: string;
    error?: string;
};

const EMPTY_VALUE = '__empty__';

export function FormSelect({
    id,
    label,
    value,
    onChange,
    options,
    placeholder = 'Selecione',
    error,
}: FormSelectProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Select
                value={value || EMPTY_VALUE}
                onValueChange={(next) => onChange(next === EMPTY_VALUE ? '' : next)}
            >
                <SelectTrigger id={id} className="w-full" aria-invalid={!!error}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
