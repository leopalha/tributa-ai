import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import { ObrigacaoFiscal, ObrigacaoFiscalCreate } from '@/types/obrigacao-fiscal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  tipo: z.string(),
  dataVencimento: z.string(),
  valor: z.string().transform(val => parseFloat(val.replace(/[^\d.-]/g, ''))),
  descricao: z.string().optional(),
  observacoes: z.string().optional(),
  responsavel: z.string().optional(),
  empresaId: z.string(),
});

interface ObrigacaoFiscalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obrigacao?: ObrigacaoFiscal;
  onSubmit: (data: ObrigacaoFiscalCreate) => void;
}

export function ObrigacaoFiscalDialog({
  open,
  onOpenChange,
  obrigacao,
  onSubmit,
}: ObrigacaoFiscalDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: obrigacao?.tipo || '',
      dataVencimento: obrigacao?.dataVencimento
        ? new Date(obrigacao.dataVencimento).toISOString().split('T')[0]
        : '',
      valor: obrigacao?.valor.toString() || '',
      descricao: obrigacao?.descricao || '',
      observacoes: obrigacao?.observacoes || '',
      responsavel: obrigacao?.responsavel || '',
      empresaId: obrigacao?.empresaId || '1', // TODO: Get from context
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{obrigacao ? 'Editar Obrigação' : 'Nova Obrigação'}</DialogTitle>
          <DialogDescription>
            {obrigacao
              ? 'Edite os detalhes da obrigação fiscal.'
              : 'Preencha os detalhes da nova obrigação fiscal.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tipo"
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
                    <Input
                      type="text"
                      {...field}
                      onChange={e => {
                        const value = e.target.value.replace(/[^\d.-]/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{obrigacao ? 'Salvar' : 'Criar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
