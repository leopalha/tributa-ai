"use client";

import React, { useState, useEffect } from 'react';
import { useTC } from '@/hooks/useTC';
import { TCEmissao } from '@/components/tc/TCEmissao';
import { TCTransactions } from '@/components/tc/TCTransactions';
import { TCAnalytics } from '@/components/tc/TCAnalytics';
import { TCRiskAnalysis } from '@/components/tc/TCRiskAnalysis';
import { TCCompensacao } from '@/components/tc/TCCompensacao';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TC, TCFilters, TCType } from '@/types/tc';
import { formatCurrency } from '@/lib/utils';
import { Plus, Filter, Download, FileText } from 'lucide-react';
import { TCList } from "@/components/tc/TCList";
import { TCValidation } from '@/components/tc/TCValidation';

export default function TCPage() {
  const { listarTCs } = useTC();
  const [tcs, setTCs] = useState<TC[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEmissao, setShowEmissao] = useState(false);
  const [selectedTC, setSelectedTC] = useState<TC | null>(null);
  const [filters, setFilters] = useState<TCFilters>({});

  useEffect(() => {
    loadTCs();
  }, [filters]);

  const loadTCs = async () => {
    try {
      setLoading(true);
      const data = await listarTCs(filters);
      setTCs(data);
    } catch (error) {
      console.error('Erro ao carregar TCs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof TCFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const getTotalValue = () => {
    return tcs.reduce((total, tc) => total + tc.valorDisponivel, 0);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Títulos de Crédito</h1>
          <p className="text-muted-foreground">
            Gerencie seus títulos de crédito e realize compensações
          </p>
        </div>
        <Button onClick={() => setShowEmissao(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo TC
        </Button>
      </div>

      {showEmissao ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Emissão de TC</CardTitle>
                <CardDescription>
                  Preencha os dados para emitir um novo título de crédito
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowEmissao(false)}>
                Voltar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <TCEmissao />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total em Créditos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(getTotalValue())}</div>
                <p className="text-xs text-muted-foreground">
                  {tcs.length} títulos ativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Compensações Realizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tcs.reduce((total, tc) => total + tc.transacoes.filter(t => t.tipo.includes('COMPENSACAO')).length, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Nos últimos 30 dias
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  TCs por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-xs">TC-F: {tcs.filter(tc => tc.tipo === 'TC-F').length}</div>
                  <div className="text-xs">TC-E: {tcs.filter(tc => tc.tipo === 'TC-E').length}</div>
                  <div className="text-xs">TC-M: {tcs.filter(tc => tc.tipo === 'TC-M').length}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(tcs.length > 0 ? getTotalValue() / tcs.length : 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Por título de crédito
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Filtros</CardTitle>
                <Button variant="outline" onClick={() => setFilters({})}>
                  Limpar Filtros
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Select
                    value={filters.tipo || ''}
                    onValueChange={(value) => handleFilterChange('tipo', value as TCType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de TC" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="TC-F">TC-F (Federal)</SelectItem>
                      <SelectItem value="TC-E">TC-E (Estadual)</SelectItem>
                      <SelectItem value="TC-M">TC-M (Municipal)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select
                    value={filters.status || ''}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="PENDENTE">Pendente</SelectItem>
                      <SelectItem value="APROVADO">Aprovado</SelectItem>
                      <SelectItem value="REJEITADO">Rejeitado</SelectItem>
                      <SelectItem value="COMPENSADO">Compensado</SelectItem>
                      <SelectItem value="VENCIDO">Vencido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Input
                    type="number"
                    placeholder="Valor Mínimo"
                    value={filters.valorMin || ''}
                    onChange={(e) => handleFilterChange('valorMin', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Input
                    type="number"
                    placeholder="Valor Máximo"
                    value={filters.valorMax || ''}
                    onChange={(e) => handleFilterChange('valorMax', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {loading ? (
              <Card>
                <CardContent className="py-6">
                  <div className="text-center">Carregando títulos de crédito...</div>
                </CardContent>
              </Card>
            ) : tcs.length === 0 ? (
              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Nenhum título encontrado</h3>
                    <p className="text-muted-foreground">
                      Comece emitindo um novo título de crédito
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="list">Lista</TabsTrigger>
                  <TabsTrigger value="emissao">Emissão</TabsTrigger>
                  <TabsTrigger value="transacoes">Transações</TabsTrigger>
                  <TabsTrigger value="analytics">Análises</TabsTrigger>
                  <TabsTrigger value="risco">Risco</TabsTrigger>
                  <TabsTrigger value="compensacao">Compensação</TabsTrigger>
                  <TabsTrigger value="validacao">Validação</TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4">
                  <TCList tcs={tcs} onSelect={setSelectedTC} />
                </TabsContent>

                <TabsContent value="emissao">
                  <TCEmissao />
                </TabsContent>

                <TabsContent value="transacoes">
                  <TCTransactions tc={selectedTC} />
                </TabsContent>

                <TabsContent value="analytics">
                  <TCAnalytics tc={selectedTC} />
                </TabsContent>

                <TabsContent value="risco">
                  <TCRiskAnalysis tc={selectedTC} />
                </TabsContent>

                <TabsContent value="compensacao">
                  <TCCompensacao tc={selectedTC} />
                </TabsContent>

                <TabsContent value="validacao">
                  {selectedTC ? (
                    <TCValidation 
                      tc={selectedTC} 
                      onValidationComplete={(isValid) => {
                        if (isValid) {
                          // Update TC status or show success message
                        }
                      }} 
                    />
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Selecione um TC</CardTitle>
                        <CardDescription>
                          Selecione um título de crédito da lista para validar
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </>
      )}
    </div>
  );
} 