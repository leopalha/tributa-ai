import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { TituloCreditoUnion, TipoTC, StatusTC } from '@/types/titulo-credito';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';

export interface PortfolioPosition {
  id: string;
  tc: TituloCreditoUnion;
  quantidade: number;
  valorInvestido: number;
  valorAtual: number;
  dataAquisicao: Date;
  retorno: number;
  retornoPercentual: number;
  status: 'ativo' | 'vencido' | 'compensado' | 'vendido';
  proximoVencimento?: Date;
  rendimentoEsperado: number;
}

export interface PortfolioMetrics {
  valorTotal: number;
  valorInvestido: number;
  retornoTotal: number;
  retornoPercentual: number;
  quantidadeTitulos: number;
  diversificacao: {
    porTipo: Record<TipoTC, number>;
    porStatus: Record<StatusTC, number>;
    porVencimento: Record<string, number>;
  };
  performance: {
    ultimos30Dias: number;
    ultimos90Dias: number;
    ultimoAno: number;
    desdeInicio: number;
  };
  risco: {
    score: number;
    nivel: 'baixo' | 'medio' | 'alto';
    fatores: string[];
  };
  projecoes: {
    proximoMes: number;
    proximoTrimestre: number;
    proximoAno: number;
  };
}

interface PortfolioDashboardProps {
  positions: PortfolioPosition[];
  metrics: PortfolioMetrics;
  onRebalance?: () => void;
  onExportReport?: () => void;
  onRefresh?: () => void;
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF7C7C',
];

export function PortfolioDashboard({
  positions,
  metrics,
  onRebalance,
  onExportReport,
  onRefresh,
}: PortfolioDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '1y' | 'all'>('30d');
  const [sortBy, setSortBy] = useState<'retorno' | 'valor' | 'vencimento'>('retorno');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'ativo' | 'vencido'>('todos');

  // Dados para gráficos
  const performanceData = [
    { period: 'Jan', value: 10000, return: 0 },
    { period: 'Fev', value: 10500, return: 5 },
    { period: 'Mar', value: 11200, return: 12 },
    { period: 'Abr', value: 10800, return: 8 },
    { period: 'Mai', value: 11500, return: 15 },
    { period: 'Jun', value: 12200, return: 22 },
  ];

  const diversificationData = Object.entries(metrics.diversificacao.porTipo).map(
    ([tipo, valor]) => ({
      name: tipo,
      value: valor,
    })
  );

  const upcomingMaturityData = positions
    .filter(p => p.proximoVencimento)
    .sort(
      (a, b) => new Date(a.proximoVencimento!).getTime() - new Date(b.proximoVencimento!).getTime()
    )
    .slice(0, 5);

  const filteredPositions = positions
    .filter(p => filterStatus === 'todos' || p.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'retorno':
          return b.retornoPercentual - a.retornoPercentual;
        case 'valor':
          return b.valorAtual - a.valorAtual;
        case 'vencimento':
          return (
            new Date(a.proximoVencimento || 0).getTime() -
            new Date(b.proximoVencimento || 0).getTime()
          );
        default:
          return 0;
      }
    });

  const getRiskColor = (nivel: string) => {
    switch (nivel) {
      case 'baixo':
        return 'text-green-600 bg-green-100';
      case 'medio':
        return 'text-yellow-600 bg-yellow-100';
      case 'alto':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'vencido':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'compensado':
        return <Target className="h-4 w-4 text-blue-600" />;
      case 'vendido':
        return <ArrowUpRight className="h-4 w-4 text-purple-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">
                  R$ {metrics.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2">
              {metrics.retornoPercentual >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  metrics.retornoPercentual >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {metrics.retornoPercentual > 0 ? '+' : ''}
                {metrics.retornoPercentual.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Retorno Total</p>
                <p className="text-2xl font-bold">
                  R$ {metrics.retornoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Percent className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Sobre R${' '}
              {metrics.valorInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{' '}
              investidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Títulos Ativos</p>
                <p className="text-2xl font-bold">{metrics.quantidadeTitulos}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {positions.filter(p => p.status === 'ativo').length} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nível de Risco</p>
                <Badge className={getRiskColor(metrics.risco.nivel)}>
                  {metrics.risco.nivel.toUpperCase()}
                </Badge>
              </div>
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Score: {metrics.risco.score}/100</p>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          {onRebalance && (
            <Button size="sm" onClick={onRebalance}>
              <Target className="h-4 w-4 mr-2" />
              Rebalancear
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="positions">Posições</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="projections">Projeções</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance do Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'value'
                          ? `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          : `${value}%`,
                        name === 'value' ? 'Valor' : 'Retorno',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Diversificação */}
            <Card>
              <CardHeader>
                <CardTitle>Diversificação por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={diversificationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {diversificationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={value => [
                        `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                        'Valor',
                      ]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Próximos Vencimentos */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Vencimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingMaturityData.map(position => (
                  <div
                    key={position.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{position.tc.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          Vence em{' '}
                          {new Date(position.proximoVencimento!).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        R${' '}
                        {position.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p
                        className={`text-sm ${
                          position.retornoPercentual >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {position.retornoPercentual > 0 ? '+' : ''}
                        {position.retornoPercentual.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          {/* Controles de filtro e ordenação */}
          <div className="flex items-center gap-4">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="todos">Todos os Status</option>
              <option value="ativo">Apenas Ativos</option>
              <option value="vencido">Apenas Vencidos</option>
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="retorno">Ordenar por Retorno</option>
              <option value="valor">Ordenar por Valor</option>
              <option value="vencimento">Ordenar por Vencimento</option>
            </select>
          </div>

          {/* Lista de posições */}
          <div className="space-y-3">
            {filteredPositions.map(position => (
              <Card key={position.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(position.status)}
                      <div>
                        <p className="font-medium">{position.tc.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {position.quantidade} títulos • Adquirido em{' '}
                          {new Date(position.dataAquisicao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        R${' '}
                        {position.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p
                        className={`text-sm ${
                          position.retornoPercentual >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {position.retornoPercentual > 0 ? '+' : ''}
                        {position.retornoPercentual.toFixed(2)}% ({position.retorno > 0 ? '+' : ''}
                        R$ {position.retorno.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Investido</p>
                      <p className="font-medium">
                        R${' '}
                        {position.valorInvestido.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tipo</p>
                      <Badge variant="outline">{position.tc.tipo}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge variant={position.status === 'ativo' ? 'default' : 'secondary'}>
                        {position.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Análise de Risco */}
            <Card>
              <CardHeader>
                <CardTitle>Análise de Risco</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Score de Risco</span>
                  <Badge className={getRiskColor(metrics.risco.nivel)}>
                    {metrics.risco.score}/100
                  </Badge>
                </div>
                <Progress value={metrics.risco.score} className="h-2" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Fatores de Risco:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {metrics.risco.fatores.map((fator, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3" />
                        {fator}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Performance Comparativa */}
            <Card>
              <CardHeader>
                <CardTitle>Performance por Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Últimos 30 dias</span>
                    <span
                      className={`font-medium ${
                        metrics.performance.ultimos30Dias >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metrics.performance.ultimos30Dias > 0 ? '+' : ''}
                      {metrics.performance.ultimos30Dias.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Últimos 90 dias</span>
                    <span
                      className={`font-medium ${
                        metrics.performance.ultimos90Dias >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metrics.performance.ultimos90Dias > 0 ? '+' : ''}
                      {metrics.performance.ultimos90Dias.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Último ano</span>
                    <span
                      className={`font-medium ${
                        metrics.performance.ultimoAno >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metrics.performance.ultimoAno > 0 ? '+' : ''}
                      {metrics.performance.ultimoAno.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Desde o início</span>
                    <span
                      className={`font-medium ${
                        metrics.performance.desdeInicio >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metrics.performance.desdeInicio > 0 ? '+' : ''}
                      {metrics.performance.desdeInicio.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Projeções de Rendimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Próximo Mês</p>
                  <p className="text-2xl font-bold text-blue-600">
                    R${' '}
                    {metrics.projecoes.proximoMes.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Próximo Trimestre</p>
                  <p className="text-2xl font-bold text-green-600">
                    R${' '}
                    {metrics.projecoes.proximoTrimestre.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Próximo Ano</p>
                  <p className="text-2xl font-bold text-purple-600">
                    R${' '}
                    {metrics.projecoes.proximoAno.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
