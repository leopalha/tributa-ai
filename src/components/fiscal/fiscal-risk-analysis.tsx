import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Activity,
  Zap,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  RefreshCw,
  Settings,
  Download,
  AlertCircle,
  Info,
  Lightbulb,
  Star,
  Calendar,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  LineChart as RechartsLineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RiskFactor {
  id: string;
  name: string;
  category: 'compliance' | 'financial' | 'operational' | 'regulatory';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-100
  impact: number; // 0-100
  riskScore: number;
  description: string;
  recommendations: string[];
  mitigationActions: string[];
  status: 'identified' | 'monitoring' | 'mitigating' | 'resolved';
  lastUpdated: Date;
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface RiskScenario {
  id: string;
  name: string;
  description: string;
  probability: number;
  impact: number;
  riskFactors: string[];
  mitigationCost: number;
  potentialLoss: number;
  timeToMitigate: number; // days
}

interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'opportunity' | 'prediction';
  title: string;
  description: string;
  confidence: number; // 0-100
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  actionItems: string[];
  estimatedSavings?: number;
  potentialLoss?: number;
  implementationTime?: number;
  createdAt: Date;
}

export function FiscalRiskAnalysis() {
  const [selectedRisk, setSelectedRisk] = useState<RiskFactor | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [refreshing, setRefreshing] = useState(false);

  // Dados de exemplo para fatores de risco
  const riskFactors: RiskFactor[] = [
    {
      id: '1',
      name: 'Atraso em Obrigações Acessórias',
      category: 'compliance',
      severity: 'high',
      probability: 75,
      impact: 85,
      riskScore: 79,
      description:
        'Histórico de atrasos na entrega de obrigações acessórias pode resultar em multas e autuações.',
      recommendations: [
        'Implementar sistema de alertas automáticos',
        'Revisar processo de coleta de dados',
        'Capacitar equipe fiscal',
      ],
      mitigationActions: [
        'Configurar notificações 15 dias antes do vencimento',
        'Criar checklist de documentos necessários',
        'Designar responsável backup',
      ],
      status: 'monitoring',
      lastUpdated: new Date(),
      trend: 'decreasing',
    },
    {
      id: '2',
      name: 'Inconsistências na Apuração de ICMS',
      category: 'financial',
      severity: 'critical',
      probability: 65,
      impact: 95,
      riskScore: 82,
      description:
        'Divergências entre escrituração fiscal e contábil podem gerar autuações fiscais.',
      recommendations: [
        'Reconciliação mensal obrigatória',
        'Auditoria interna trimestral',
        'Treinamento em legislação ICMS',
      ],
      mitigationActions: [
        'Implementar controles de conciliação',
        'Revisar procedimentos de escrituração',
        'Contratar consultoria especializada',
      ],
      status: 'mitigating',
      lastUpdated: new Date(),
      trend: 'stable',
    },
    {
      id: '3',
      name: 'Mudanças Regulatórias Frequentes',
      category: 'regulatory',
      severity: 'medium',
      probability: 90,
      impact: 60,
      riskScore: 72,
      description: 'Alterações constantes na legislação tributária podem impactar a conformidade.',
      recommendations: [
        'Assinatura de serviços de atualização legal',
        'Participação em eventos do setor',
        'Rede de contatos especializados',
      ],
      mitigationActions: [
        'Monitoramento diário de legislação',
        'Análise de impacto de mudanças',
        'Atualização de procedimentos',
      ],
      status: 'monitoring',
      lastUpdated: new Date(),
      trend: 'increasing',
    },
    {
      id: '4',
      name: 'Falta de Integração entre Sistemas',
      category: 'operational',
      severity: 'medium',
      probability: 55,
      impact: 70,
      riskScore: 61,
      description: 'Sistemas não integrados podem causar inconsistências e retrabalho.',
      recommendations: [
        'Implementar ERP integrado',
        'Automatizar fluxos de dados',
        'Padronizar processos',
      ],
      mitigationActions: [
        'Mapear integrações necessárias',
        'Avaliar soluções de mercado',
        'Planejar migração gradual',
      ],
      status: 'identified',
      lastUpdated: new Date(),
      trend: 'stable',
    },
  ];

  // Cenários de risco
  const riskScenarios: RiskScenario[] = [
    {
      id: '1',
      name: 'Autuação Fiscal ICMS',
      description: 'Cenário de autuação por inconsistências na apuração de ICMS',
      probability: 25,
      impact: 90,
      riskFactors: ['1', '2'],
      mitigationCost: 50000,
      potentialLoss: 500000,
      timeToMitigate: 90,
    },
    {
      id: '2',
      name: 'Multa por Atraso em Obrigações',
      description: 'Multas por entrega em atraso de obrigações acessórias',
      probability: 40,
      impact: 60,
      riskFactors: ['1', '4'],
      mitigationCost: 25000,
      potentialLoss: 150000,
      timeToMitigate: 30,
    },
  ];

  // Insights de IA
  const aiInsights: AIInsight[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Risco Elevado de Autuação ICMS',
      description:
        'Padrões identificados sugerem 78% de probabilidade de autuação nos próximos 6 meses.',
      confidence: 85,
      priority: 'critical',
      category: 'Compliance',
      actionItems: [
        'Revisar escrituração dos últimos 3 meses',
        'Contratar auditoria externa especializada',
        'Implementar controles adicionais',
      ],
      potentialLoss: 450000,
      implementationTime: 60,
      createdAt: new Date(),
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Oportunidade de Crédito PIS/COFINS',
      description: 'Análise indica possibilidade de recuperação de créditos não aproveitados.',
      confidence: 92,
      priority: 'high',
      category: 'Otimização',
      actionItems: [
        'Analisar base de cálculo dos últimos 5 anos',
        'Verificar direito a créditos',
        'Solicitar restituição',
      ],
      estimatedSavings: 280000,
      implementationTime: 45,
      createdAt: new Date(),
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Automatização de Processos',
      description: 'Implementação de RPA pode reduzir erros manuais em 85%.',
      confidence: 88,
      priority: 'medium',
      category: 'Eficiência',
      actionItems: ['Mapear processos manuais', 'Avaliar ferramentas de RPA', 'Implementar piloto'],
      estimatedSavings: 120000,
      implementationTime: 120,
      createdAt: new Date(),
    },
  ];

  const overallRiskScore = useMemo(() => {
    const totalScore = riskFactors.reduce((sum, risk) => sum + risk.riskScore, 0);
    return Math.round(totalScore / riskFactors.length);
  }, [riskFactors]);

  const riskDistribution = useMemo(() => {
    const distribution = riskFactors.reduce(
      (acc, risk) => {
        acc[risk.severity] = (acc[risk.severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(distribution).map(([severity, count]) => ({
      name: severity,
      value: count,
      color:
        severity === 'critical'
          ? '#dc2626'
          : severity === 'high'
            ? '#ea580c'
            : severity === 'medium'
              ? '#d97706'
              : '#16a34a',
    }));
  }, [riskFactors]);

  const riskTrend = useMemo(() => {
    // Simulando dados históricos de risco
    return [
      { month: 'Jan', score: 65 },
      { month: 'Fev', score: 72 },
      { month: 'Mar', score: 68 },
      { month: 'Abr', score: 75 },
      { month: 'Mai', score: 71 },
      { month: 'Jun', score: overallRiskScore },
    ];
  }, [overallRiskScore]);

  const complianceRadarData = [
    { subject: 'ICMS', score: 75, fullMark: 100 },
    { subject: 'IPI', score: 85, fullMark: 100 },
    { subject: 'PIS/COFINS', score: 90, fullMark: 100 },
    { subject: 'ISS', score: 80, fullMark: 100 },
    { subject: 'IRPJ', score: 88, fullMark: 100 },
    { subject: 'CSLL', score: 82, fullMark: 100 },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity':
        return <Lightbulb className="h-4 w-4" />;
      case 'recommendation':
        return <Target className="h-4 w-4" />;
      case 'prediction':
        return <Brain className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const refreshAnalysis = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Análise de Riscos Fiscais
          </h2>
          <p className="text-muted-foreground">
            Monitoramento inteligente e prevenção de riscos tributários
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshAnalysis} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Risk Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Score Geral de Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl font-bold">
                {overallRiskScore}
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
              <Badge
                className={
                  overallRiskScore >= 80
                    ? 'bg-red-500'
                    : overallRiskScore >= 60
                      ? 'bg-orange-500'
                      : overallRiskScore >= 40
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                }
              >
                {overallRiskScore >= 80
                  ? 'Crítico'
                  : overallRiskScore >= 60
                    ? 'Alto'
                    : overallRiskScore >= 40
                      ? 'Médio'
                      : 'Baixo'}
              </Badge>
            </div>
            <Progress value={overallRiskScore} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Baseado em {riskFactors.length} fatores de risco identificados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Riscos Críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {riskFactors.filter(r => r.severity === 'critical').length}
            </div>
            <p className="text-sm text-muted-foreground">Requerem ação imediata</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Insights de IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{aiInsights.length}</div>
            <p className="text-sm text-muted-foreground">Recomendações ativas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="factors">Fatores de Risco</TabsTrigger>
          <TabsTrigger value="scenarios">Cenários</TabsTrigger>
          <TabsTrigger value="ai-insights">Insights IA</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Riscos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Risco</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={riskTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle>Principais Fatores de Risco</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors
                  .sort((a, b) => b.riskScore - a.riskScore)
                  .slice(0, 5)
                  .map(risk => (
                    <div
                      key={risk.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{risk.name}</h4>
                          <Badge className={getSeverityColor(risk.severity)}>{risk.severity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{risk.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{risk.riskScore}</div>
                        <div className="text-sm text-muted-foreground">Score</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Factors List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Fatores de Risco</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {riskFactors.map(risk => (
                        <div
                          key={risk.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedRisk?.id === risk.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedRisk(risk)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{risk.name}</h4>
                            <Badge className={getSeverityColor(risk.severity)}>
                              {risk.severity}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Probabilidade:</span>
                              <div className="font-medium">{risk.probability}%</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Impacto:</span>
                              <div className="font-medium">{risk.impact}%</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Score:</span>
                              <div className="font-bold">{risk.riskScore}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Risk Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Risco</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRisk ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">{selectedRisk.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedRisk.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Probabilidade</span>
                        <span className="text-sm font-medium">{selectedRisk.probability}%</span>
                      </div>
                      <Progress value={selectedRisk.probability} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Impacto</span>
                        <span className="text-sm font-medium">{selectedRisk.impact}%</span>
                      </div>
                      <Progress value={selectedRisk.impact} />
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Recomendações</h5>
                      <ul className="text-sm space-y-1">
                        {selectedRisk.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Ações de Mitigação</h5>
                      <ul className="text-sm space-y-1">
                        {selectedRisk.mitigationActions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecione um fator de risco para ver os detalhes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {riskScenarios.map(scenario => (
              <Card key={scenario.id}>
                <CardHeader>
                  <CardTitle>{scenario.name}</CardTitle>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Probabilidade</span>
                      <div className="text-2xl font-bold">{scenario.probability}%</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Impacto</span>
                      <div className="text-2xl font-bold">{scenario.impact}%</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Perda Potencial</span>
                      <span className="text-sm font-medium text-red-600">
                        {formatCurrency(scenario.potentialLoss)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Custo de Mitigação</span>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(scenario.mitigationCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tempo para Mitigar</span>
                      <span className="text-sm font-medium">{scenario.timeToMitigate} dias</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full">Criar Plano de Mitigação</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="space-y-4">
            {aiInsights.map(insight => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <CardDescription>
                          {insight.category} • Confiança: {insight.confidence}%
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={insight.priority === 'critical' ? 'destructive' : 'secondary'}>
                      {insight.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{insight.description}</p>

                  {(insight.estimatedSavings || insight.potentialLoss) && (
                    <div className="flex gap-4">
                      {insight.estimatedSavings && (
                        <div className="flex items-center gap-2 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Economia: {formatCurrency(insight.estimatedSavings)}
                          </span>
                        </div>
                      )}
                      {insight.potentialLoss && (
                        <div className="flex items-center gap-2 text-red-600">
                          <TrendingDown className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Risco: {formatCurrency(insight.potentialLoss)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <h5 className="font-medium mb-2">Ações Recomendadas</h5>
                    <ul className="text-sm space-y-1">
                      {insight.actionItems.map((action, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      {format(insight.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                    <Button size="sm">Implementar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Radar de Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={complianceRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Compliance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {complianceRadarData.map(item => (
                  <div key={item.subject} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{item.subject}</span>
                      <span className="text-sm">{item.score}%</span>
                    </div>
                    <Progress value={item.score} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
