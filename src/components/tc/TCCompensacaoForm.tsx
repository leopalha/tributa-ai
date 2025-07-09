import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TituloDeCredito } from '@/types/tc';
import { formatCurrency } from '@/lib/utils';
import { tcService } from '@/services/tc.service';
import { useToast } from '@/components/ui/use-toast';
import { DatePicker } from '@/components/ui/date-picker'; // Este componente precisará ser implementado

interface TCCompensacaoFormProps {
  tc: TituloDeCredito;
  onSuccess?: () => void;
}

export function TCCompensacaoForm({ tc, onSuccess }: TCCompensacaoFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [simulationResults, setSimulationResults] = useState<{
    possivel: boolean;
    valorDisponivel: number;
    mensagem?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    valor: tc.valor > 0 ? tc.valor.toString() : '',
    tributo: '',
    periodoReferencia: '',
    dataVencimento: new Date().toISOString().split('T')[0],
    observacoes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpar erro do campo que está sendo editado
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar valor
    const valor = parseFloat(formData.valor);
    if (isNaN(valor) || valor <= 0) {
      newErrors.valor = 'Valor precisa ser maior que zero';
    } else if (valor > tc.valor) {
      newErrors.valor = `Valor não pode exceder o disponível (${formatCurrency(tc.valor)})`;
    }

    // Validar tributo
    if (!formData.tributo) {
      newErrors.tributo = 'Selecione o tributo a ser compensado';
    }

    // Validar período de referência
    if (!formData.periodoReferencia) {
      newErrors.periodoReferencia = 'Período de referência é obrigatório';
    }

    // Validar data de vencimento
    if (!formData.dataVencimento) {
      newErrors.dataVencimento = 'Data de vencimento é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSimulate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const valor = parseFloat(formData.valor);
      const result = await tcService.simularCompensacao(tc.id, valor);
      setSimulationResults(result);

      if (!result.possivel) {
        toast({
          title: 'Simulação concluída',
          description: result.mensagem || 'Não é possível realizar esta compensação',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Simulação concluída',
          description: 'A compensação pode ser realizada',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro na simulação',
        description: 'Ocorreu um erro ao simular a compensação',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await tcService.compensar(tc.id, {
        valor: parseFloat(formData.valor),
        tributo: formData.tributo,
        periodoReferencia: formData.periodoReferencia,
      });

      toast({
        title: 'Compensação realizada',
        description: 'A compensação foi realizada com sucesso',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: 'Erro na compensação',
        description: 'Ocorreu um erro ao realizar a compensação',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compensação de Título de Crédito</CardTitle>
        <CardDescription>
          Preencha os dados para realizar a compensação do título {tc.numero}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorDisponivel">Valor Disponível</Label>
              <Input id="valorDisponivel" value={formatCurrency(tc.valor)} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor a Compensar</Label>
              <Input
                id="valor"
                value={formData.valor}
                onChange={e => handleChange('valor', e.target.value)}
                className={errors.valor ? 'border-red-500' : ''}
              />
              {errors.valor && <p className="text-red-500 text-xs mt-1">{errors.valor}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tributo">Tributo</Label>
            <Select
              value={formData.tributo}
              onValueChange={value => handleChange('tributo', value)}
            >
              <SelectTrigger className={errors.tributo ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione o tributo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ICMS">ICMS</SelectItem>
                <SelectItem value="IPI">IPI</SelectItem>
                <SelectItem value="PIS">PIS</SelectItem>
                <SelectItem value="COFINS">COFINS</SelectItem>
                <SelectItem value="IRPJ">IRPJ</SelectItem>
                <SelectItem value="CSLL">CSLL</SelectItem>
                <SelectItem value="ISS">ISS</SelectItem>
              </SelectContent>
            </Select>
            {errors.tributo && <p className="text-red-500 text-xs mt-1">{errors.tributo}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodoReferencia">Período de Referência</Label>
              <Input
                id="periodoReferencia"
                placeholder="MM/AAAA"
                value={formData.periodoReferencia}
                onChange={e => handleChange('periodoReferencia', e.target.value)}
                className={errors.periodoReferencia ? 'border-red-500' : ''}
              />
              {errors.periodoReferencia && (
                <p className="text-red-500 text-xs mt-1">{errors.periodoReferencia}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataVencimento">Data de Vencimento</Label>
              <Input
                id="dataVencimento"
                type="date"
                value={formData.dataVencimento}
                onChange={e => handleChange('dataVencimento', e.target.value)}
                className={errors.dataVencimento ? 'border-red-500' : ''}
              />
              {errors.dataVencimento && (
                <p className="text-red-500 text-xs mt-1">{errors.dataVencimento}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <textarea
              id="observacoes"
              className="w-full min-h-[100px] p-2 rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))]"
              placeholder="Observações adicionais (opcional)"
              value={formData.observacoes}
              onChange={e => handleChange('observacoes', e.target.value)}
            />
          </div>

          {simulationResults && simulationResults.possivel && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 font-medium">Compensação validada</p>
              <p className="text-green-600 text-sm">
                Você pode prosseguir com a compensação de{' '}
                {formatCurrency(parseFloat(formData.valor))}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={handleSimulate} variant="outline" disabled={isLoading}>
              Simular
            </Button>
            <Button type="submit" disabled={isLoading || !simulationResults?.possivel}>
              {isLoading ? 'Processando...' : 'Realizar Compensação'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
