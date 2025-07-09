import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter, useSearchParams } from '@/lib/router-utils';
import { useSafeCallback } from '@/hooks/use-safe-hooks';

export function ObligationsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use useSafeCallback to prevent re-creation on each render
  const createQueryString = useSafeCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const onStatusChange = useSafeCallback(
    (value: string) => {
      const query = createQueryString({ status: value, page: '1' });
      router.push(`/dashboard/gestao-fiscal/obrigacoes?${query}`);
    },
    [createQueryString, router]
  );

  const onTypeChange = useSafeCallback(
    (value: string) => {
      const query = createQueryString({ type: value, page: '1' });
      router.push(`/dashboard/gestao-fiscal/obrigacoes?${query}`);
    },
    [createQueryString, router]
  );

  const onClearFilters = useSafeCallback(() => {
    router.push('/dashboard/gestao-fiscal/obrigacoes');
  }, [router]);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Status</p>
        <Select value={searchParams?.get('status') || ''} onValueChange={onStatusChange}>
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="PENDING">Pendente</SelectItem>
            <SelectItem value="PAID">Pago</SelectItem>
            <SelectItem value="OVERDUE">Vencido</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Tipo</p>
        <Select value={searchParams?.get('type') || ''} onValueChange={onTypeChange}>
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="TAX">Imposto</SelectItem>
            <SelectItem value="CONTRIBUTION">Contribuição</SelectItem>
            <SelectItem value="FINE">Multa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="sm" onClick={onClearFilters} type="button">
        Limpar Filtros
      </Button>
    </div>
  );
}
