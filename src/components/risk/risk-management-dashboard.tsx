import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertTriangle,
  Shield,
  TrendingDown,
  TrendingUp,
  Target,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Bell,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Filter,
} from 'lucide-react';
import { TituloCreditoUnion, TipoTC } from '@/types/titulo-credito';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export interface RiskFactor {
  id: string;
  name: string;
  category: 'credit' | 'market' | 'liquidity' | 'operational' | 'regulatory';
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: number; // 0-100
  probability: number; // 0-100
  description: string;
  mitigation: string[];
  lastUpdated: Date;
}

export interface RiskMetrics {
  overallScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  categories: {
    credit: number;
    market: number;
    liquidity: number;
    operational: number;
    regulatory: number;
  };
  concentration: {
    byType: Record<TipoTC, number>;
    byIssuer: Record<string, number>;
    byMaturity: Record<string, number>;
    geographic: Record<string, number>;
  };
  volatility: {
    daily: number;
    weekly: number;
    monthly: number;
    annual: number;
  };
  var: {
    // Value at Risk
    confidence95: number;
    confidence99: number;
    timeHorizon: number; // dias
  };
  stressTest: {
    scenarios: Array<{
      name: string;
      description: string;
      impact: number;
      probability: number;
    }>;
  };
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    acknowledged: boolean;
  }>;
}

export interface RiskLimit {
  id: string;
  name: string;
  type: 'concentration' | 'exposure' | 'var' | 'volatility';
  limit: number;
  current: number;
  unit: 'percentage' | 'currency' | 'ratio';
  breached: boolean;
  warningThreshold: number;
}

interface RiskManagementDashboardProps {
  portfolio: TituloCreditoUnion[];
  riskMetrics: RiskMetrics;
  riskFactors: RiskFactor[];
  riskLimits: RiskLimit[];
  onAcknowledgeAlert: (alertId: string) => void;
  onUpdateRiskLimit: (limitId: string, newLimit: number) => void;
  onGenerateReport: () => void;
  onRefreshData: () => void;
}

export function RiskManagementDashboard({
  portfolio,
  riskMetrics,
  riskFactors,
  riskLimits,
  onAcknowledgeAlert,
  onUpdateRiskLimit,
  onGenerateReport,
  onRefreshData,
}: RiskManagementDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1d' | '7d' | '30d' | '90d'>('30d');
  const [showAcknowledgedAlerts, setShowAcknowledgedAlerts] = useState(false);
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>('all');

  // Dados para gráficos
  const riskTrendData = [
    {
      date: '2024-01',
      overall: 25,
      credit: 20,
      market: 30,
      liquidity: 15,
      operational: 25,
      regulatory: 35,
    },
    {
      date: '2024-02',
      overall: 28,
      credit: 22,
      market: 35,
      liquidity: 18,
      operational: 23,
      regulatory: 32,
    },
    {
      date: '2024-03',
      overall: 32,
      credit: 25,
      market: 40,
      liquidity: 20,
      operational: 28,
      regulatory: 30,
    },
    {
      date: '2024-04',
      overall: 29,
      credit: 23,
      market: 35,
      liquidity: 22,
      operational: 25,
      regulatory: 28,
    },
    {
      date: '2024-05',
      overall: 26,
      credit: 21,
      market: 32,
      liquidity: 19,
      operational: 22,
      regulatory: 26,
    },
    {
      date: '2024-06',
      overall: 30,
      credit: 24,
      market: 38,
      liquidity: 21,
      operational: 26,
      regulatory: 29,
    },
  ];

  const radarData = [
    { subject: 'Crédito', A: riskMetrics.categories.credit, fullMark: 100 },
    { subject: 'Mercado', A: riskMetrics.categories.market, fullMark: 100 },
    { subject: 'Liquidez', A: riskMetrics.categories.liquidity, fullMark: 100 },
    { subject: 'Operacional', A: riskMetrics.categories.operational, fullMark: 100 },
    { subject: 'Regulatório', A: riskMetrics.categories.regulatory, fullMark: 100 },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredAlerts = riskMetrics.alerts.filter(
    alert => showAcknowledgedAlerts || !alert.acknowledged
  );

  const filteredRiskFactors = riskFactors.filter(
    factor => selectedRiskCategory === 'all' || factor.category === selectedRiskCategory
  );

  const breachedLimits = riskLimits.filter(limit => limit.breached);
  const warningLimits = riskLimits.filter(
    limit => !limit.breached && limit.current >= limit.warningThreshold
  );

  return (
    <div className="space-y-6">
      {/* Header com métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`border-2 ${getRiskColor(riskMetrics.riskLevel)}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risco Geral</p>
                <p className="text-2xl font-bold">{riskMetrics.overallScore}/100</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
            <Badge className={getRiskColor(riskMetrics.riskLevel)}>
              {riskMetrics.riskLevel.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">VaR (95%)</p>
                <p className="text-2xl font-bold">
                  R${' '}
                  {riskMetrics.var.confidence95.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{riskMetrics.var.timeHorizon} dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volatilidade</p>
                <p className="text-2xl font-bold">{riskMetrics.volatility.monthly.toFixed(2)}%</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Mensal</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alertas Ativos</p>
                <p className="text-2xl font-bold">{filteredAlerts.length}</p>
              </div>
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {breachedLimits.length} limites violados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Críticos */}
      {(breachedLimits.length > 0 || filteredAlerts.some(a => !a.acknowledged)) && (
        <div className="space-y-2">
          {breachedLimits.map(limit => (
            <Alert key={limit.id} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Limite de Risco Violado</AlertTitle>
              <AlertDescription>
                {limit.name}: {limit.current.toFixed(2)}
                {limit.unit === 'percentage' ? '%' : ''}
                (limite: {limit.limit.toFixed(2)}
                {limit.unit === 'percentage' ? '%' : ''})
              </AlertDescription>
            </Alert>
          ))}

          {filteredAlerts
            .filter(alert => !alert.acknowledged && alert.type === 'error')
            .map(alert => (
              <Alert key={alert.id} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>{alert.message}</span>
                  <Button size="sm" variant="outline" onClick={() => onAcknowledgeAlert(alert.id)}>
                    Reconhecer
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
        </div>
      )}

      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <select
            value={selectedTimeframe}
            onChange={e => setSelectedTimeframe(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="1d">1 Dia</option>
            <option value="7d">7 Dias</option>
            <option value="30d">30 Dias</option>
            <option value="90d">90 Dias</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onGenerateReport}>
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="factors">Fatores</TabsTrigger>
          <TabsTrigger value="limits">Limites</TabsTrigger>
          <TabsTrigger value="stress">Stress Test</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tendência de Risco */}
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Risco</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={riskTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="overall" stroke="#8884d8" strokeWidth={3} />
                    <Line type="monotone" dataKey="credit" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="market" stroke="#ffc658" />
                    <Line type="monotone" dataKey="liquidity" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Radar de Categorias */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Risco"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Concentrações */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Concentração por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(riskMetrics.concentration.byType).map(([tipo, valor]) => (
                    <div key={tipo} className="flex items-center justify-between">
                      <span className="text-sm">{tipo}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={valor} className="w-16 h-2" />
                        <span className="text-sm font-medium">{valor.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Volatilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Diária</span>
                    <span className="font-medium">{riskMetrics.volatility.daily.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Semanal</span>
                    <span className="font-medium">{riskMetrics.volatility.weekly.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Mensal</span>
                    <span className="font-medium">
                      {riskMetrics.volatility.monthly.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Anual</span>
                    <span className="font-medium">{riskMetrics.volatility.annual.toFixed(2)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Value at Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">95% Confiança</p>
                    <p className="font-bold text-orange-600">
                      R${' '}
                      {riskMetrics.var.confidence95.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">99% Confiança</p>
                    <p className="font-bold text-red-600">
                      R${' '}
                      {riskMetrics.var.confidence99.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Horizonte: {riskMetrics.var.timeHorizon} dias
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status dos Limites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dentro do Limite</span>
                    <Badge variant="outline" className="text-green-600">
                      {riskLimits.filter(l => !l.breached && l.current < l.warningThreshold).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Em Alerta</span>
                    <Badge variant="outline" className="text-yellow-600">
                      {warningLimits.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Violados</span>
                    <Badge variant="outline" className="text-red-600">
                      {breachedLimits.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="factors" className="space-y-4">
          <div className="flex items-center gap-4">
            <select
              value={selectedRiskCategory}
              onChange={e => setSelectedRiskCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Todas as Categorias</option>
              <option value="credit">Risco de Crédito</option>
              <option value="market">Risco de Mercado</option>
              <option value="liquidity">Risco de Liquidez</option>
              <option value="operational">Risco Operacional</option>
              <option value="regulatory">Risco Regulatório</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredRiskFactors.map(factor => (
              <Card key={factor.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(factor.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{factor.name}</h4>
                          <Badge variant="outline">{factor.category}</Badge>
                          <Badge className={getRiskColor(factor.severity)}>{factor.severity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{factor.description}</p>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Impacto</p>
                            <div className="flex items-center gap-2">
                              <Progress value={factor.impact} className="h-2" />
                              <span className="text-sm font-medium">{factor.impact}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Probabilidade</p>
                            <div className="flex items-center gap-2">
                              <Progress value={factor.probability} className="h-2" />
                              <span className="text-sm font-medium">{factor.probability}%</span>
                            </div>
                          </div>
                        </div>
                        {factor.mitigation.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Mitigações:
                            </p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {factor.mitigation.map((item, index) => (
                                <li key={index} className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Atualizado em {new Date(factor.lastUpdated).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <div className="space-y-3">
            {riskLimits.map(limit => (
              <Card
                key={limit.id}
                className={
                  limit.breached
                    ? 'border-red-200'
                    : limit.current >= limit.warningThreshold
                      ? 'border-yellow-200'
                      : ''
                }
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{limit.name}</h4>
                        <Badge variant="outline">{limit.type}</Badge>
                        {limit.breached && <Badge variant="destructive">VIOLADO</Badge>}
                        {!limit.breached && limit.current >= limit.warningThreshold && (
                          <Badge variant="outline" className="text-yellow-600">
                            ALERTA
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            Atual: {limit.current.toFixed(2)}
                            {limit.unit === 'percentage' ? '%' : ''}
                          </span>
                          <span>
                            Limite: {limit.limit.toFixed(2)}
                            {limit.unit === 'percentage' ? '%' : ''}
                          </span>
                        </div>
                        <Progress
                          value={(limit.current / limit.limit) * 100}
                          className={`h-2 ${limit.breached ? 'bg-red-100' : limit.current >= limit.warningThreshold ? 'bg-yellow-100' : ''}`}
                        />
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Ajustar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {riskMetrics.stressTest.scenarios.map((scenario, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{scenario.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Impacto Estimado</span>
                      <span
                        className={`font-medium ${scenario.impact < 0 ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {scenario.impact > 0 ? '+' : ''}
                        {scenario.impact.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Probabilidade</span>
                      <span className="font-medium">{scenario.probability.toFixed(1)}%</span>
                    </div>
                    <Progress value={scenario.probability} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAcknowledgedAlerts(!showAcknowledgedAlerts)}
              >
                {showAcknowledgedAlerts ? (
                  <EyeOff className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {showAcknowledgedAlerts ? 'Ocultar' : 'Mostrar'} Reconhecidos
              </Button>
            </div>
            <Badge variant="outline">{filteredAlerts.length} alertas</Badge>
          </div>

          <div className="space-y-3">
            {filteredAlerts.map(alert => (
              <Card key={alert.id} className={alert.acknowledged ? 'opacity-60' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {alert.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      {alert.type === 'warning' && (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                      {alert.type === 'info' && <Activity className="h-4 w-4 text-blue-600" />}
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.acknowledged && (
                        <Badge variant="outline" className="text-green-600">
                          Reconhecido
                        </Badge>
                      )}
                      {!alert.acknowledged && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAcknowledgeAlert(alert.id)}
                        >
                          Reconhecer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
