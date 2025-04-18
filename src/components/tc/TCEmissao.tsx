"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTC } from '@/hooks/useTC';
import { useToast } from '@/components/ui/use-toast';

const tcSchema = z.object({
  tipo: z.enum(['TC-F', 'TC-E', 'TC-M']),
  valorTotal: z.string().min(1, 'Valor total é obrigatório'),
  emissor: z.string().min(1, 'Emissor é obrigatório'),
  origemCredito: z.string().min(1, 'Origem do crédito é obrigatória'),
  tipoTributo: z.string().min(1, 'Tipo de tributo é obrigatório'),
  processoAdministrativo: z.string().optional(),
  processoJudicial: z.string().optional(),
  documentos: z.array(z.any()).optional(),
});

type TCFormData = z.infer<typeof tcSchema>;

export function TCEmissao() {
  const { emitirTC } = useTC();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<TCFormData>({
    resolver: zodResolver(tcSchema),
    defaultValues: {
      tipo: 'TC-F',
      valorTotal: '',
      emissor: '',
      origemCredito: '',
      tipoTributo: '',
      processoAdministrativo: '',
      processoJudicial: '',
      documentos: [],
    },
  });

  const onSubmit = async (data: TCFormData) => {
    try {
      setLoading(true);
      await emitirTC(data);
      toast({
        title: 'TC emitido com sucesso',
        description: 'O título de crédito foi emitido e está em análise.',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Erro ao emitir TC',
        description: 'Ocorreu um erro ao emitir o título de crédito. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emissão de Título de Crédito</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de TC</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de TC" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TC-F">TC-F (Federal)</SelectItem>
                      <SelectItem value="TC-E">TC-E (Estadual)</SelectItem>
                      <SelectItem value="TC-M">TC-M (Municipal)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Escolha o tipo de título de crédito de acordo com a origem do crédito.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valorTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Total</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Digite o valor total do crédito"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Valor total do crédito em reais (R$).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emissor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emissor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome do emissor"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Nome da empresa ou pessoa emissora do título.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="origemCredito"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origem do Crédito</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite a origem do crédito"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Descreva a origem do crédito (ex: restituição, compensação, etc).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipoTributo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Tributo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o tipo de tributo"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Especifique o tipo de tributo relacionado ao crédito.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processoAdministrativo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processo Administrativo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o número do processo administrativo"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Número do processo administrativo (se houver).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processoJudicial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processo Judicial</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o número do processo judicial"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Número do processo judicial (se houver).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Emitindo...' : 'Emitir TC'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
