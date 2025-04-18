'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Check, ChevronDown, Building2, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as SelectPrimitive from "@radix-ui/react-select";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const tiposDeclaracao = {
  DCTF: 'DCTF Web',
  EFD_ICMS_IPI: 'EFD ICMS/IPI',
  EFD_CONTRIBUICOES: 'EFD Contribuições',
  SPED_CONTABIL: 'SPED Contábil',
  SPED_FISCAL: 'SPED Fiscal',
  GFIP: 'GFIP',
  REINF: 'EFD-Reinf',
  DCTFWEB: 'DCTFWeb',
  DIRF: 'DIRF',
  DEFIS: 'DEFIS',
  DASN_SIMEI: 'DASN-SIMEI',
  ECF: 'ECF',
  ECD: 'ECD'
} as const;

const empresas = [
  { id: '1', nome: 'Empresa ABC Ltda', cnpj: '12.345.678/0001-90', regime: 'Simples Nacional' },
  { id: '2', nome: 'Filial XYZ', cnpj: '98.765.432/0001-21', regime: 'Lucro Real' },
  { id: '3', nome: 'Empresa 123', cnpj: '11.222.333/0001-44', regime: 'Lucro Presumido' },
  { id: '4', nome: 'Comércio XYZ', cnpj: '44.555.666/0001-77', regime: 'Simples Nacional' }
] as const;

const formSchema = z.object({
  tipo: z.enum(['DCTF', 'EFD_ICMS_IPI', 'EFD_CONTRIBUICOES', 'SPED_CONTABIL', 'SPED_FISCAL', 'GFIP', 'REINF', 'DCTFWEB', 'DIRF', 'DEFIS', 'DASN_SIMEI', 'ECF', 'ECD']),
  empresaId: z.string().min(1, 'Selecione uma empresa'),
  competencia: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Formato inválido. Use AAAA-MM'),
  prazo: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'Data inválida'),
  responsavel: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  prioridade: z.enum(['baixa', 'media', 'alta']).default('media'),
  status: z.enum(['pendente', 'em_andamento', 'concluida']).default('pendente'),
  observacoes: z.string().optional(),
  anexos: z.array(z.string()).optional(),
  notificar: z.boolean().default(true),
  lembrete: z.number().min(1).max(30).optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function EditarDeclaracao({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<typeof empresas[0] | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    // TODO: Integrar com API
    const fetchDeclaracao = async () => {
      try {
        // Simulando chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados mockados
        const data = {
          tipo: 'DCTF' as const,
          empresaId: '1',
          competencia: '2024-02',
          prazo: '2024-03-25',
          responsavel: 'João Silva',
          prioridade: 'media' as const,
          status: 'em_andamento' as const,
          observacoes: 'Declaração referente ao período de fevereiro/2024',
          notificar: true,
          lembrete: 7,
          anexos: []
        };

        form.reset(data);
        setSelectedEmpresa(empresas.find(emp => emp.id === data.empresaId) || null);
        setLoading(false);
      } catch (error) {
        toast.error('Erro ao carregar declaração');
        router.push('/declaracoes');
      }
    };

    fetchDeclaracao();
  }, [params.id]);

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      // TODO: Integrar com API
      console.log('Dados do formulário:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Declaração atualizada com sucesso!');
      router.push('/declaracoes/' + params.id);
    } catch (error) {
      toast.error('Erro ao atualizar declaração. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const getPrazoSugerido = (tipo: string, competencia: string) => {
    const dataCompetencia = new Date(competencia + '-01');
    let prazo = new Date(dataCompetencia);

    switch (tipo) {
      case 'DCTF':
      case 'DCTFWEB':
        prazo.setMonth(prazo.getMonth() + 2);
        prazo.setDate(15);
        break;
      case 'EFD_CONTRIBUICOES':
        prazo.setMonth(prazo.getMonth() + 2);
        prazo.setDate(10);
        break;
      case 'SPED_FISCAL':
      case 'EFD_ICMS_IPI':
        prazo.setMonth(prazo.getMonth() + 1);
        prazo.setDate(20);
        break;
      case 'DIRF':
        prazo = new Date(dataCompetencia.getFullYear() + 1, 1, 28); // Último dia útil de fevereiro
        break;
      case 'ECF':
        prazo = new Date(dataCompetencia.getFullYear() + 1, 6, 30); // Último dia útil de julho
        break;
      default:
        prazo.setMonth(prazo.getMonth() + 1);
        prazo.setDate(15);
    }

    return format(prazo, 'yyyy-MM-dd');
  };

  const getDescricaoTipo = (tipo: string) => {
    const descricoes: Record<string, string> = {
      DCTF: 'Declaração de Débitos e Créditos Tributários Federais',
      DCTFWEB: 'Declaração de Débitos e Créditos Tributários Federais Previdenciários e de Outras Entidades e Fundos',
      EFD_ICMS_IPI: 'Escrituração Fiscal Digital ICMS/IPI',
      EFD_CONTRIBUICOES: 'Escrituração Fiscal Digital das Contribuições',
      SPED_CONTABIL: 'Sistema Público de Escrituração Digital Contábil',
      SPED_FISCAL: 'Sistema Público de Escrituração Digital Fiscal',
      GFIP: 'Guia de Recolhimento do FGTS e de Informações à Previdência Social',
      REINF: 'Escrituração Fiscal Digital de Retenções e Outras Informações Fiscais',
      DIRF: 'Declaração do Imposto sobre a Renda Retido na Fonte',
      DEFIS: 'Declaração de Informações Socioeconômicas e Fiscais',
      DASN_SIMEI: 'Declaração Anual Simplificada para o Microempreendedor Individual',
      ECF: 'Escrituração Contábil Fiscal',
      ECD: 'Escrituração Contábil Digital'
    };

    return descricoes[tipo] || '';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Carregando...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Editar Declaração</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Declaração</CardTitle>
          <CardDescription>
            Atualize os dados da declaração. Os campos marcados com * são obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Declaração *</FormLabel>
                      <SelectPrimitive.Root
                        onValueChange={(value: string) => {
                          field.onChange(value);
                          const competencia = form.getValues('competencia');
                          if (competencia) {
                            form.setValue('prazo', getPrazoSugerido(value, competencia));
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectPrimitive.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <SelectPrimitive.Value placeholder="Selecione o tipo" />
                            <SelectPrimitive.Icon>
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </SelectPrimitive.Icon>
                          </SelectPrimitive.Trigger>
                        </FormControl>
                        <SelectPrimitive.Portal>
                          <SelectPrimitive.Content className="relative z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
                            <SelectPrimitive.Viewport className="p-1">
                              {Object.entries(tiposDeclaracao).map(([key, value]) => (
                                <SelectPrimitive.Item
                                  key={key}
                                  value={key}
                                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                >
                                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                    <SelectPrimitive.ItemIndicator>
                                      <Check className="h-4 w-4" />
                                    </SelectPrimitive.ItemIndicator>
                                  </span>
                                  <FileText className="mr-2 h-4 w-4" />
                                  <span>{value}</span>
                                </SelectPrimitive.Item>
                              ))}
                            </SelectPrimitive.Viewport>
                          </SelectPrimitive.Content>
                        </SelectPrimitive.Portal>
                      </SelectPrimitive.Root>
                      {field.value && (
                        <FormDescription>
                          {getDescricaoTipo(field.value)}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="empresaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa *</FormLabel>
                      <SelectPrimitive.Root
                        onValueChange={(value: string) => {
                          field.onChange(value);
                          setSelectedEmpresa(empresas.find(emp => emp.id === value) || null);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectPrimitive.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <SelectPrimitive.Value placeholder="Selecione a empresa" />
                            <SelectPrimitive.Icon>
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </SelectPrimitive.Icon>
                          </SelectPrimitive.Trigger>
                        </FormControl>
                        <SelectPrimitive.Portal>
                          <SelectPrimitive.Content className="relative z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
                            <SelectPrimitive.Viewport className="p-1">
                              {empresas.map((empresa) => (
                                <SelectPrimitive.Item
                                  key={empresa.id}
                                  value={empresa.id}
                                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                >
                                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                    <SelectPrimitive.ItemIndicator>
                                      <Check className="h-4 w-4" />
                                    </SelectPrimitive.ItemIndicator>
                                  </span>
                                  <Building2 className="mr-2 h-4 w-4" />
                                  <span>{empresa.nome}</span>
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    {empresa.cnpj}
                                  </span>
                                </SelectPrimitive.Item>
                              ))}
                            </SelectPrimitive.Viewport>
                          </SelectPrimitive.Content>
                        </SelectPrimitive.Portal>
                      </SelectPrimitive.Root>
                      {selectedEmpresa && (
                        <FormDescription>
                          Regime Tributário: {selectedEmpresa.regime}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="competencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competência *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="month"
                            {...field}
                            className="pl-10"
                            onChange={(e) => {
                              field.onChange(e);
                              const tipo = form.getValues('tipo');
                              if (tipo) {
                                form.setValue('prazo', getPrazoSugerido(tipo, e.target.value));
                              }
                            }}
                          />
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prazo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo de Entrega *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="date"
                            {...field}
                            className="pl-10"
                          />
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>
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
                      <FormLabel>Responsável *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prioridade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade</FormLabel>
                      <SelectPrimitive.Root
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectPrimitive.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <SelectPrimitive.Value placeholder="Selecione a prioridade" />
                            <SelectPrimitive.Icon>
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </SelectPrimitive.Icon>
                          </SelectPrimitive.Trigger>
                        </FormControl>
                        <SelectPrimitive.Portal>
                          <SelectPrimitive.Content className="relative z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
                            <SelectPrimitive.Viewport className="p-1">
                              <SelectPrimitive.Item
                                value="baixa"
                                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                              >
                                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                  <SelectPrimitive.ItemIndicator>
                                    <Check className="h-4 w-4" />
                                  </SelectPrimitive.ItemIndicator>
                                </span>
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                                Baixa
                              </SelectPrimitive.Item>
                              <SelectPrimitive.Item
                                value="media"
                                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                              >
                                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                  <SelectPrimitive.ItemIndicator>
                                    <Check className="h-4 w-4" />
                                  </SelectPrimitive.ItemIndicator>
                                </span>
                                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                                Média
                              </SelectPrimitive.Item>
                              <SelectPrimitive.Item
                                value="alta"
                                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                              >
                                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                  <SelectPrimitive.ItemIndicator>
                                    <Check className="h-4 w-4" />
                                  </SelectPrimitive.ItemIndicator>
                                </span>
                                <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                                Alta
                              </SelectPrimitive.Item>
                            </SelectPrimitive.Viewport>
                          </SelectPrimitive.Content>
                        </SelectPrimitive.Portal>
                      </SelectPrimitive.Root>
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
                      <SelectPrimitive.Root
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectPrimitive.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <SelectPrimitive.Value placeholder="Selecione o status" />
                            <SelectPrimitive.Icon>
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </SelectPrimitive.Icon>
                          </SelectPrimitive.Trigger>
                        </FormControl>
                        <SelectPrimitive.Portal>
                          <SelectPrimitive.Content className="relative z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
                            <SelectPrimitive.Viewport className="p-1">
                              <SelectPrimitive.Item
                                value="pendente"
                                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                              >
                                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                  <SelectPrimitive.ItemIndicator>
                                    <Check className="h-4 w-4" />
                                  </SelectPrimitive.ItemIndicator>
                                </span>
                                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                                Pendente
                              </SelectPrimitive.Item>
                              <SelectPrimitive.Item
                                value="em_andamento"
                                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                              >
                                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                  <SelectPrimitive.ItemIndicator>
                                    <Check className="h-4 w-4" />
                                  </SelectPrimitive.ItemIndicator>
                                </span>
                                <span className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                                Em Andamento
                              </SelectPrimitive.Item>
                              <SelectPrimitive.Item
                                value="concluida"
                                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                              >
                                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                  <SelectPrimitive.ItemIndicator>
                                    <Check className="h-4 w-4" />
                                  </SelectPrimitive.ItemIndicator>
                                </span>
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                                Concluída
                              </SelectPrimitive.Item>
                            </SelectPrimitive.Viewport>
                          </SelectPrimitive.Content>
                        </SelectPrimitive.Portal>
                      </SelectPrimitive.Root>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Digite informações adicionais sobre a declaração..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 