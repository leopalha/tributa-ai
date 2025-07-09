import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { TituloCreate, TituloUpdate } from '@/services/titulo.service';

const garantiaSchema = z.object({
  tipo: z.string().min(1, 'Tipo de garantia é obrigatório'),
  valor: z.number().min(0, 'Valor deve ser maior que zero'),
  instituicao: z.string().min(1, 'Instituição é obrigatória'),
});

const tituloSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  valor: z.number().min(0, 'Valor deve ser maior que zero'),
  taxaJuros: z.number().min(0, 'Taxa de juros deve ser maior que zero'),
  dataVencimento: z.date({
    required_error: 'Data de vencimento é obrigatória',
  }),
  garantias: z.array(garantiaSchema).min(1, 'Pelo menos uma garantia é obrigatória'),
});

type TituloFormData = z.infer<typeof tituloSchema>;

interface TituloFormProps {
  titulo?: TituloCreate | TituloUpdate;
  onSubmit: (data: TituloFormData) => Promise<void>;
  isLoading?: boolean;
}

export function TituloForm({ titulo, onSubmit, isLoading }: TituloFormProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    titulo?.dataVencimento ? new Date(titulo.dataVencimento) : undefined
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TituloFormData>({
    resolver: zodResolver(tituloSchema),
    defaultValues: {
      nome: titulo?.nome || '',
      valor: titulo?.valor || 0,
      taxaJuros: titulo?.taxaJuros || 0,
      garantias: titulo?.garantias || [{ tipo: '', valor: 0, instituicao: '' }],
    },
  });

  const garantias = watch('garantias');

  const addGarantia = () => {
    setValue('garantias', [...garantias, { tipo: '', valor: 0, instituicao: '' }]);
  };

  const removeGarantia = (index: number) => {
    setValue(
      'garantias',
      garantias.filter((_, i) => i !== index)
    );
  };

  const handleFormSubmit = async (data: TituloFormData) => {
    if (date) {
      data.dataVencimento = date;
    }
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Título</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Título</Label>
            <Input id="nome" {...register('nome')} placeholder="Digite o nome do título" />
            {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                {...register('valor', { valueAsNumber: true })}
                placeholder="0,00"
              />
              {errors.valor && <p className="text-sm text-red-500">{errors.valor.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxaJuros">Taxa de Juros (% a.a.)</Label>
              <Input
                id="taxaJuros"
                type="number"
                step="0.01"
                {...register('taxaJuros', { valueAsNumber: true })}
                placeholder="0,00"
              />
              {errors.taxaJuros && (
                <p className="text-sm text-red-500">{errors.taxaJuros.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data de Vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: ptBR }) : 'Selecione uma data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
            {errors.dataVencimento && (
              <p className="text-sm text-red-500">{errors.dataVencimento.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Garantias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {garantias.map((_, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`garantias.${index}.tipo`}>Tipo</Label>
                <Input
                  id={`garantias.${index}.tipo`}
                  {...register(`garantias.${index}.tipo`)}
                  placeholder="Ex: Fiança Bancária"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`garantias.${index}.valor`}>Valor (R$)</Label>
                <Input
                  id={`garantias.${index}.valor`}
                  type="number"
                  step="0.01"
                  {...register(`garantias.${index}.valor`, { valueAsNumber: true })}
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`garantias.${index}.instituicao`}>Instituição</Label>
                <div className="flex gap-2">
                  <Input
                    id={`garantias.${index}.instituicao`}
                    {...register(`garantias.${index}.instituicao`)}
                    placeholder="Ex: Banco XYZ"
                  />
                  {garantias.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeGarantia(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {errors.garantias && <p className="text-sm text-red-500">{errors.garantias.message}</p>}

          <Button type="button" variant="outline" className="w-full" onClick={addGarantia}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Garantia
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Título'}
        </Button>
      </div>
    </form>
  );
}
