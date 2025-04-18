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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTC } from '@/hooks/useTC';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';
import { TC } from '@/types/tc';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const compensacaoSchema = z.object({
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
  tributo: z.string().min(1, 'Tributo é obrigatório'),
  periodoReferencia: z.string().min(1, 'Período de referência é obrigatório'),
  documentoOrigem: z.string().optional(),
});

type CompensacaoFormData = z.infer<typeof compensacaoSchema>;

interface TCCompensacaoProps {
  tc: TC | null;
}

export function TCCompensacao({ tc }: TCCompensacaoProps) {
  const { compensar, simularCompensacao } = useTC();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [simulacao, setSimulacao] = useState<{
    possivel: boolean;
    valorDisponivel: number;
    mensagem?: string;
  } | null>(null);

  const form = useForm<CompensacaoFormData>({
    resolver: zodResolver(compensacaoSchema),
    defaultValues: {
      valor: 0,
      tributo: '',
      periodoReferencia: '',
      documentoOrigem: '',
    },
  });

  const handleSimular = async (valor: number) => {
    if (!tc) return;
    
    try {
      const resultado = await simularCompensacao(tc.id, valor);
      setSimulacao(resultado);
    } catch (error) {
      console.error('Erro ao simular compensação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível simular a compensação.',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: CompensacaoFormData) => {
    if (!tc) return;
    
    try {
      setLoading(true);
      await compensar(tc.id, data);
      toast({
        title: 'Compensação realizada',
        description: 'A compensação foi realizada com sucesso.',
      });
      form.reset();
      setSimulacao(null);
    } catch (error) {
      toast({
        title: 'Erro na compensação',
        description: 'Ocorreu um erro ao realizar a compensação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!tc) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Selecione um título de crédito</h3>
            <p className="text-muted-foreground">
              Para realizar compensações, selecione um TC na lista
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compensação de TC</CardTitle>
          <CardDescription>
            Realize a compensação do título de crédito com débitos tributários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Valor Disponível</h3>
              <p className="text-2xl font-bold">{formatCurrency(tc.valorDisponivel)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="text-lg">{tc.status}</p>
            </div>
          </div>

          {simulacao && (
            <Alert variant={simulacao.possivel ? 'default' : 'destructive'} className="mb-6">
              {simulacao.possivel ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertTitle>
                {simulacao.possivel ? 'Compensação Possível' : 'Compensação não Permitida'}
              </AlertTitle>
              <AlertDescription>{simulacao.mensagem}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor a Compensar</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                          handleSimular(parseFloat(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Informe o valor que deseja compensar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tributo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tributo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: ICMS, IPI, etc." />
                    </FormControl>
                    <FormDescription>
                      Informe o tributo a ser compensado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="periodoReferencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período de Referência</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: 01/2024" />
                    </FormControl>
                    <FormDescription>
                      Informe o período de referência do tributo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentoOrigem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento de Origem</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Número do documento (opcional)" />
                    </FormControl>
                    <FormDescription>
                      Informe o número do documento de origem, se houver
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading || !simulacao?.possivel}>
                {loading ? 'Processando...' : 'Realizar Compensação'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 