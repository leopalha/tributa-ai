"use client";

import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast.tsx';
import { formatCurrency } from '@/lib/utils';
import { AlertTriangle, CheckCircle, FileText, Search, ArrowRight, Download, Filter } from 'lucide-react';

const compensacaoSchema = z.object({
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
  tributo: z.string().min(1, 'Tributo é obrigatório'),
  periodoReferencia: z.string().min(1, 'Período de referência é obrigatório'),
  documentoOrigem: z.string().optional(),
});

type CompensacaoFormData = z.infer<typeof compensacaoSchema>;

const mockTCs = [
  {
    id: '1',
    numero: 'TC-F-2023-001',
    tipo: 'TC-F',
    valorTotal: 50000,
    valorDisponivel: 35000,
    emissor: {
      id: '1',
      nome: 'Empresa ABC Ltda',
      documento: '12.345.678/0001-90'
    },
    origemCredito: 'Restituição de PIS/COFINS',
    tipoTributo: 'PIS/COFINS',
    dataEmissao: new Date('2023-05-15'),
    dataValidade: new Date('2028-05-15'),
    status: 'APROVADO'
  },
  {
    id: '2',
    numero: 'TC-E-2023-002',
    tipo: 'TC-E',
    valorTotal: 75000,
    valorDisponivel: 75000,
    emissor: {
      id: '2',
      nome: 'Indústria XYZ S.A.',
      documento: '98.765.432/0001-10'
    },
    origemCredito: 'Crédito de ICMS',
    tipoTributo: 'ICMS',
    dataEmissao: new Date('2023-08-10'),
    dataValidade: new Date('2028-08-10'),
    status: 'APROVADO'
  },
  {
    id: '3',
    numero: 'TC-F-2023-003',
    tipo: 'TC-F',
    valorTotal: 120000,
    valorDisponivel: 85000,
    emissor: {
      id: '1',
      nome: 'Empresa ABC Ltda',
      documento: '12.345.678/0001-90'
    },
    origemCredito: 'Restituição de IRPJ',
    tipoTributo: 'IRPJ',
    dataEmissao: new Date('2023-11-22'),
    dataValidade: new Date('2028-11-22'),
    status: 'APROVADO'
  }
];

const mockTributos = [
  { id: '1', nome: 'ICMS' },
  { id: '2', nome: 'IPI' },
  { id: '3', nome: 'PIS' },
  { id: '4', nome: 'COFINS' },
  { id: '5', nome: 'IRPJ' },
  { id: '6', nome: 'CSLL' },
  { id: '7', nome: 'ISS' },
];

export default function TaxCompensation() {
  const [selectedTC, setSelectedTC] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simulacao, setSimulacao] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTCs, setFilteredTCs] = useState(mockTCs);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(compensacaoSchema),
    defaultValues: {
      valor: 0,
      tributo: '',
      periodoReferencia: '',
      documentoOrigem: '',
    },
  });

  useEffect(() => {
    const filtered = mockTCs.filter(tc => 
      tc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.origemCredito.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.tipoTributo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTCs(filtered);
  }, [searchTerm]);

  const handleSimular = async (valor) => {
    if (!selectedTC) return;
    
    setLoading(true);
    try {
      // Simulação mock
      setTimeout(() => {
        const possivel = valor <= selectedTC.valorDisponivel;
        setSimulacao({
          possivel,
          valorDisponivel: selectedTC.valorDisponivel,
          mensagem: possivel 
            ? `Compensação de ${formatCurrency(valor)} é possível. Valor disponível: ${formatCurrency(selectedTC.valorDisponivel)}.`
            : `Compensação não permitida. O valor solicitado (${formatCurrency(valor)}) excede o disponível (${formatCurrency(selectedTC.valorDisponivel)}).`
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao simular compensação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível simular a compensação.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedTC) return;
    
    setLoading(true);
    try {
      // Simulação de compensação
      setTimeout(() => {
        toast({
          title: 'Compensação realizada',
          description: `Compensação de ${formatCurrency(data.valor)} realizada com sucesso para o tributo ${data.tributo}.`,
        });
        
        // Atualiza o valor disponível do TC selecionado
        const updatedTCs = mockTCs.map(tc => {
          if (tc.id === selectedTC.id) {
            return {
              ...tc,
              valorDisponivel: tc.valorDisponivel - data.valor
            };
          }
          return tc;
        });
        
        // Atualiza a lista filtrada
        const filtered = updatedTCs.filter(tc => 
          tc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tc.origemCredito.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tc.tipoTributo.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setFilteredTCs(filtered);
        setSelectedTC(null);
        form.reset();
        setSimulacao(null);
        setLoading(false);
      }, 1500);
    } catch (error) {
      toast({
        title: 'Erro na compensação',
        description: 'Ocorreu um erro ao realizar a compensação. Tente novamente.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getTipoTCColor = (tipo) => {
    switch (tipo) {
      case 'TC-F':
        return 'bg-blue-100 text-blue-800';
      case 'TC-E':
        return 'bg-green-100 text-green-800';
      case 'TC-M':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Compensação Tributária</h1>
      </div>

      <Tabs defaultValue="titulos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="titulos">Títulos de Crédito</TabsTrigger>
          <TabsTrigger value="compensacao">Realizar Compensação</TabsTrigger>
        </TabsList>

        <TabsContent value="titulos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Títulos de Crédito Disponíveis</CardTitle>
              <CardDescription>
                Selecione um título de crédito para realizar uma compensação tributária
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por número, origem ou tipo de tributo..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {filteredTCs.map((tc) => (
                    <Card 
                      key={tc.id} 
                      className={`cursor-pointer hover:bg-accent/5 transition-colors ${selectedTC?.id === tc.id ? 'border-primary' : ''}`}
                      onClick={() => setSelectedTC(tc)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{tc.numero}</h3>
                              <Badge className={getTipoTCColor(tc.tipo)}>{tc.tipo}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{tc.emissor.nome}</p>
                            <p className="text-sm">{tc.origemCredito}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Valor Disponível</p>
                            <p className="text-lg font-bold">{formatCurrency(tc.valorDisponivel)}</p>
                            <p className="text-xs text-muted-foreground">
                              Válido até {formatDate(tc.dataValidade)}
                            </p>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex justify-between items-center">
                          <div>
                            <Badge variant="outline">{tc.tipoTributo}</Badge>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTC(tc);
                              document.querySelector('[data-value="compensacao"]').click();
                            }}
                          >
                            Compensar <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredTCs.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">Nenhum título encontrado</h3>
                      <p className="text-muted-foreground">
                        Tente ajustar sua busca ou filtros
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compensacao">
          <Card>
            <CardHeader>
              <CardTitle>Compensação de Título de Crédito</CardTitle>
              <CardDescription>
                Realize a compensação do título de crédito com débitos tributários
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedTC ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">Selecione um título de crédito</h3>
                  <p className="text-muted-foreground">
                    Para realizar compensações, selecione um TC na aba "Títulos de Crédito"
                  </p>
                  <Button 
                    className="mt-4" 
                    variant="outline"
                    onClick={() => document.querySelector('[data-value="titulos"]').click()}
                  >
                    Selecionar Título
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Título Selecionado</h3>
                      <p className="text-lg font-medium">{selectedTC.numero}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getTipoTCColor(selectedTC.tipo)}>{selectedTC.tipo}</Badge>
                        <Badge variant="outline">{selectedTC.tipoTributo}</Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Valor Disponível</h3>
                      <p className="text-2xl font-bold">{formatCurrency(selectedTC.valorDisponivel)}</p>
                      <p className="text-xs text-muted-foreground">
                        Válido até {formatDate(selectedTC.dataValidade)}
                      </p>
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
                                  const value = parseFloat(e.target.value);
                                  field.onChange(value);
                                  if (!isNaN(value) && value > 0) {
                                    handleSimular(value);
                                  }
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tributo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mockTributos.map((tributo) => (
                                  <SelectItem key={tributo.id} value={tributo.nome}>
                                    {tributo.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                              Informe o período de referência do tributo (MM/AAAA)
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
                            <FormLabel>Documento de Origem (opcional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ex: Número da DARF, Processo, etc." />
                            </FormControl>
                            <FormDescription>
                              Informe o documento de origem do débito, se houver
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setSelectedTC(null);
                            form.reset();
                            setSimulacao(null);
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || !simulacao?.possivel}>
                          {loading ? 'Processando...' : 'Realizar Compensação'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}