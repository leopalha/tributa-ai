import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Declaracao, DeclaracaoCreate, TipoDeclaracao } from '@/types/declaracao';

const formSchema = z.object({
  tipo: z.enum(
    ['ICMS', 'IPI', 'PIS', 'COFINS', 'IRPJ', 'CSLL', 'ISS', 'INSS', 'FGTS', 'SIMPLES'] as const,
    {
      required_error: 'Tipo de declaração é obrigatório',
    }
  ),
  dataVencimento: z.string().min(1, 'Data de vencimento é obrigatória'),
  valor: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: 'Valor deve ser um número positivo',
    }),
  descricao: z.string().optional(),
  observacoes: z.string().optional(),
  responsavel: z.string().optional(),
  empresaId: z.string().min(1, 'Empresa é obrigatória'),
  obrigacaoId: z.string().optional(),
});

interface DeclaracaoFormProps {
  declaracao?: Declaracao;
  onSubmit: (data: DeclaracaoCreate) => void;
  onCancel: () => void;
}

export function DeclaracaoForm({ declaracao, onSubmit, onCancel }: DeclaracaoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: declaracao?.tipo || 'ICMS',
      dataVencimento: declaracao?.dataVencimento || '',
      valor: declaracao?.valor?.toString() || '',
      descricao: declaracao?.descricao || '',
      observacoes: declaracao?.observacoes || '',
      responsavel: declaracao?.responsavel || '',
      empresaId: declaracao?.empresaId || '',
      obrigacaoId: declaracao?.obrigacaoId || '',
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const formData: DeclaracaoCreate = {
      tipo: data.tipo,
      dataVencimento: data.dataVencimento,
      valor: parseFloat(data.valor),
      empresaId: data.empresaId,
      descricao: data.descricao,
      observacoes: data.observacoes,
      responsavel: data.responsavel,
      obrigacaoId: data.obrigacaoId,
    };
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Declaração</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de declaração" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ICMS">ICMS</SelectItem>
                    <SelectItem value="IPI">IPI</SelectItem>
                    <SelectItem value="PIS">PIS</SelectItem>
                    <SelectItem value="COFINS">COFINS</SelectItem>
                    <SelectItem value="IRPJ">IRPJ</SelectItem>
                    <SelectItem value="CSLL">CSLL</SelectItem>
                    <SelectItem value="ISS">ISS</SelectItem>
                    <SelectItem value="INSS">INSS</SelectItem>
                    <SelectItem value="FGTS">FGTS</SelectItem>
                    <SelectItem value="SIMPLES">SIMPLES</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Selecione o tipo de declaração que deseja criar</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataVencimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Vencimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>Data limite para envio da declaração</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>Valor total da declaração</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="empresaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Identificador da empresa</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Nome do responsável pela declaração</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="obrigacaoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Obrigação</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Identificador da obrigação fiscal</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>Descrição detalhada da declaração</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>Informações adicionais sobre a declaração</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{declaracao ? 'Salvar Alterações' : 'Criar Declaração'}</Button>
        </div>
      </form>
    </Form>
  );
}
