import { useRouter } from '@/lib/router-utils';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreditListing } from '@/hooks/use-credit-listing';

interface ListCreditFormProps {
  credit: {
    id: string;
    title: string;
    nominalValue: number;
    issuer: {
      id: string;
      name: string;
      email: string;
    };
    owner: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export function ListCreditForm({ credit }: ListCreditFormProps) {
  const router = useRouter();
  const { isLoading, handleList } = useCreditListing({ creditId: credit.id });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const price = Number(formData.get('price'));

    if (!price || price <= 0) {
      toast.error('Por favor, insira um preço válido');
      return;
    }

    await handleList(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listar Crédito para Venda</CardTitle>
        <CardDescription>Defina o preço pelo qual deseja vender este crédito.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Título do Crédito</Label>
            <Input value={credit.title} disabled />
          </div>
          <div className="space-y-2">
            <Label>Valor Nominal</Label>
            <Input
              value={new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(credit.nominalValue)}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Preço de Venda</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="Digite o preço de venda"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Listando...' : 'Listar Crédito'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
