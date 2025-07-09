import { useState } from 'react';
import { useRouter } from '@/lib/router-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { FiscalObligation } from '@prisma/client';

const formSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  type: z.enum(['TAX', 'CONTRIBUTION', 'FINE']),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']),
  amount: z.string().min(1, 'O valor é obrigatório'),
  currency: z.string().min(1, 'A moeda é obrigatória'),
  dueDate: z.string().min(1, 'A data de vencimento é obrigatória'),
  taxCode: z.string().optional(),
  taxName: z.string().optional(),
  taxType: z.string().optional(),
  taxPeriod: z.string().optional(),
  taxBase: z.string().optional(),
  taxRate: z.string().optional(),
  taxValue: z.string().optional(),
  taxInterest: z.string().optional(),
  taxFine: z.string().optional(),
  taxTotal: z.string().optional(),
});

interface EditObligationFormProps {
  obligation: FiscalObligation;
}

export function EditObligationForm({ obligation }: EditObligationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: obligation.title,
      description: obligation.description || '',
      type: obligation.type,
      status: obligation.status,
      amount: obligation.amount.toString(),
      currency: obligation.currency,
      dueDate: new Date(obligation.dueDate).toISOString().split('T')[0],
      taxCode: obligation.taxCode || '',
      taxName: obligation.taxName || '',
      taxType: obligation.taxType || '',
      taxPeriod: obligation.taxPeriod || '',
      taxBase: obligation.taxBase?.toString() || '',
      taxRate: obligation.taxRate?.toString() || '',
      taxValue: obligation.taxValue?.toString() || '',
      taxInterest: obligation.taxInterest?.toString() || '',
      taxFine: obligation.taxFine?.toString() || '',
      taxTotal: obligation.taxTotal?.toString() || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/fiscal/obligations/${obligation.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          amount: parseFloat(values.amount),
          taxBase: values.taxBase ? parseFloat(values.taxBase) : null,
          taxRate: values.taxRate ? parseFloat(values.taxRate) : null,
          taxValue: values.taxValue ? parseFloat(values.taxValue) : null,
          taxInterest: values.taxInterest ? parseFloat(values.taxInterest) : null,
          taxFine: values.taxFine ? parseFloat(values.taxFine) : null,
          taxTotal: values.taxTotal ? parseFloat(values.taxTotal) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar obrigação');
      }

      toast.success('Obrigação atualizada com sucesso');
      router.refresh();
      router.push(`/dashboard/gestao-fiscal/${obligation.id}`);
    } catch (error) {
      toast.error('Erro ao atualizar obrigação');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título da obrigação" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TAX">Imposto</SelectItem>
                    <SelectItem value="CONTRIBUTION">Contribuição</SelectItem>
                    <SelectItem value="FINE">Multa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="PAID">Pago</SelectItem>
                    <SelectItem value="OVERDUE">Vencido</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moeda</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BRL">Real (BRL)</SelectItem>
                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Vencimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código do Tributo</FormLabel>
                <FormControl>
                  <Input placeholder="Código do tributo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Tributo</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do tributo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do Tributo</FormLabel>
                <FormControl>
                  <Input placeholder="Tipo do tributo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Período</FormLabel>
                <FormControl>
                  <Input placeholder="Período do tributo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxBase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base de Cálculo</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alíquota (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do Tributo</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxInterest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Juros</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxFine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Multa</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição da obrigação" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                Adicione uma descrição detalhada da obrigação fiscal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
