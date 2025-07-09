import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TipoTransacao, StatusTransacao, TCTransaction } from '@/types/tc';
import { useTC } from '@/hooks/useTC';
import { useToast } from '@/components/ui/use-toast';

interface TCTransactionFormProps {
  tcId: string;
  onSuccess?: () => void;
}

interface FormData {
  tipo: TipoTransacao;
  valor: string;
  descricao: string;
}

export function TCTransactionForm({ tcId, onSuccess }: TCTransactionFormProps) {
  const { addTransaction, loading } = useTC();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    tipo: 'compensação',
    valor: '',
    descricao: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const transactionData: Omit<TCTransaction, 'id'> = {
        tituloId: tcId,
        tipo: formData.tipo,
        valorTotal: parseFloat(formData.valor),
        valorDesconto: 0,
        valorLiquido: parseFloat(formData.valor),
        dataTransacao: new Date().toISOString(),
        status: 'pendente',
        descricao: formData.descricao,
      };

      await addTransaction(tcId, transactionData);
      toast({
        title: 'Sucesso',
        description: 'Transação adicionada com sucesso!',
      });
      onSuccess?.();
      setFormData({
        tipo: 'compensação',
        valor: '',
        descricao: '',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar transação. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Transação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Transação</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: TipoTransacao) =>
                  setFormData(prev => ({ ...prev, tipo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compensação">Compensação</SelectItem>
                  <SelectItem value="transferência">Transferência</SelectItem>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="cancelamento">Cancelamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                value={formData.valor}
                onChange={handleInputChange}
                placeholder="R$ 0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descreva a transação"
                rows={4}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Adicionando...' : 'Adicionar Transação'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
