import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Calendar,
  Target,
  Activity,
  Clock,
  Star,
  ShoppingCart,
  Gavel,
  MessageSquare,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AnalyticsEnhanced() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const metricas = {
    volumeTotal: 2850000,
    transacoes: 52,
    roiMedio: 14.2,
    satisfacao: 4.8,
    taxaConversao: 12.5,
    tempoMedioVenda: 6.8,
    descontoMedio: 11.3,
    avaliacaoMedia: 4.7,
    crescimentoMensal: 18.5,
    retencaoClientes: 85.2,
  };

  const dadosComparacao = {
    volumeTotal: { atual: 2850000, anterior: 2400000, variacao: 18.8 },
    transacoes: { atual: 52, anterior: 45, variacao: 15.6 },
    roiMedio: { atual: 14.2, anterior: 12.8, variacao: 10.9 },
    satisfacao: { atual: 4.8, anterior: 4.6, variacao: 4.3 },
  };

  const categorias = [
    { nome: 'ICMS', transacoes: 15, volume: 1200000, percentual: 42.1 },
    { nome: 'PIS/COFINS', transacoes: 12, volume: 680000, percentual: 23.9 },
    { nome: 'Precatório', transacoes: 8, volume: 520000, percentual: 18.2 },
    { nome: 'IRPJ/CSLL', transacoes: 10, volume: 280000, percentual: 9.8 },
    { nome: 'Rural', transacoes: 7, volume: 170000, percentual: 6.0 },
  ];

  const performanceVendas = [
    { mes: 'Out', vendas: 8, volume: 450000 },
    { mes: 'Nov', vendas: 12, volume: 680000 },
    { mes: 'Dez', vendas: 15, volume: 920000 },
    { mes: 'Jan', vendas: 17, volume: 800000 },
  ];

  const topCompradores = [
    { nome: 'FinanceServ Corp', transacoes: 5, volume: 420000, avaliacao: 4.9 },
    { nome: 'Investimentos Premium SA', transacoes: 3, volume: 380000, avaliacao: 4.8 },
    { nome: 'Consultoria Fiscal SA', transacoes: 4, volume: 280000, avaliacao: 4.7 },
    { nome: 'AgroExport Brasil Ltda', transacoes: 2, volume: 250000, avaliacao: 4.6 },
  ];

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getVariationIcon = (variation: number) => {
    if (variation > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (variation < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getVariationColor = (variation: number) => {
    if (variation > 0) return 'text-green-600';
    if (variation < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const handleExportReport = () => {
    toast.success('Relatório exportado com sucesso!');
  };

  const handleRefreshData = () => {
    toast.success('Dados atualizados!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics do Marketplace</h1>
          <p className="text-gray-600">Métricas detalhadas e insights de performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Volume Total</p>
                    <p className="text-2xl font-bold">{formatCurrency(metricas.volumeTotal)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getVariationIcon(dadosComparacao.volumeTotal.variacao)}
                      <span
                        className={`text-sm ${getVariationColor(dadosComparacao.volumeTotal.variacao)}`}
                      >
                        {formatPercentage(dadosComparacao.volumeTotal.variacao)}
                      </span>
                    </div>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Transações</p>
                    <p className="text-2xl font-bold">{metricas.transacoes}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getVariationIcon(dadosComparacao.transacoes.variacao)}
                      <span
                        className={`text-sm ${getVariationColor(dadosComparacao.transacoes.variacao)}`}
                      >
                        {formatPercentage(dadosComparacao.transacoes.variacao)}
                      </span>
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">ROI Médio</p>
                    <p className="text-2xl font-bold">{formatPercentage(metricas.roiMedio)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getVariationIcon(dadosComparacao.roiMedio.variacao)}
                      <span
                        className={`text-sm ${getVariationColor(dadosComparacao.roiMedio.variacao)}`}
                      >
                        {formatPercentage(dadosComparacao.roiMedio.variacao)}
                      </span>
                    </div>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Satisfação</p>
                    <p className="text-2xl font-bold">{metricas.satisfacao}/5</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getVariationIcon(dadosComparacao.satisfacao.variacao)}
                      <span
                        className={`text-sm ${getVariationColor(dadosComparacao.satisfacao.variacao)}`}
                      >
                        {formatPercentage(dadosComparacao.satisfacao.variacao)}
                      </span>
                    </div>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas Secundárias */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Conversão</p>
                    <p className="text-2xl font-bold">{formatPercentage(metricas.taxaConversao)}</p>
                  </div>
                  <Target className="w-8 h-8 text-indigo-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tempo Médio de Venda</p>
                    <p className="text-2xl font-bold">{metricas.tempoMedioVenda} dias</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Crescimento Mensal</p>
                    <p className="text-2xl font-bold">
                      {formatPercentage(metricas.crescimentoMensal)}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-teal-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceVendas.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="font-semibold text-blue-600">{item.mes}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{item.vendas} vendas</p>
                          <p className="text-sm text-gray-600">{formatCurrency(item.volume)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Progress value={(item.vendas / 20) * 100} className="w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Compradores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCompradores.map((comprador, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{comprador.nome}</p>
                          <p className="text-sm text-gray-600">{comprador.transacoes} transações</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(comprador.volume)}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{comprador.avaliacao}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Métricas Detalhadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de Conversão</span>
                    <span className="font-semibold">
                      {formatPercentage(metricas.taxaConversao)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tempo Médio de Venda</span>
                    <span className="font-semibold">{metricas.tempoMedioVenda} dias</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Desconto Médio</span>
                    <span className="font-semibold">
                      {formatPercentage(metricas.descontoMedio)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avaliação Média</span>
                    <span className="font-semibold">{metricas.avaliacaoMedia}/5</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Crescimento Mensal</span>
                    <span className="font-semibold text-green-600">
                      {formatPercentage(metricas.crescimentoMensal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Retenção de Clientes</span>
                    <span className="font-semibold">
                      {formatPercentage(metricas.retencaoClientes)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ticket Médio</span>
                    <span className="font-semibold">
                      {formatCurrency(metricas.volumeTotal / metricas.transacoes)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Margem Média</span>
                    <span className="font-semibold">{formatPercentage(metricas.roiMedio)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categorias.map((categoria, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="font-semibold">{categoria.nome}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(categoria.volume)}</p>
                        <p className="text-sm text-gray-600">{categoria.transacoes} transações</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={categoria.percentual} className="flex-1" />
                      <span className="text-sm font-medium w-12">
                        {formatPercentage(categoria.percentual)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">
                    {categorias.reduce((acc, cat) => acc + cat.transacoes, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total de Transações</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Gavel className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{categorias.length}</p>
                  <p className="text-sm text-gray-600">Categorias Ativas</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">{categorias[0].nome}</p>
                  <p className="text-sm text-gray-600">Categoria Líder</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Insights Principais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Crescimento Positivo</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Volume de transações cresceu 18.8% comparado ao período anterior
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Alta Satisfação</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Avaliação média de 4.8/5 indica excelente satisfação dos clientes
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-800">Conversão Eficiente</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      Taxa de conversão de 12.5% está acima da média do mercado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">Foco em ICMS</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Categoria ICMS representa 42% do volume. Considere expandir este segmento.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-orange-800">Otimizar Tempo</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      Tempo médio de venda pode ser reduzido com melhor precificação.
                    </p>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold text-indigo-800">Fidelizar Clientes</span>
                    </div>
                    <p className="text-sm text-indigo-700">
                      Implementar programa de fidelidade para top compradores.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
