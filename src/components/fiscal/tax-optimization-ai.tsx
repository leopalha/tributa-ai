import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calculator,
  Target,
  Lightbulb,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Play,
  Pause,
  Save,
  FileText,
  Calendar,
  Clock,
  Award,
  Rocket,
  Shield,
  Eye,
  Filter,
  Search,
  Plus,
  Minus,
  ArrowRight,
  ArrowUp,
  ArrowDown,
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
  AreaChart,
  Area,
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OptimizationOpportunity {
  id: string;
  title: string;
  description: string;
  category:
    | 'credit_recovery'
    | 'tax_planning'
    | 'regime_optimization'
    | 'deduction_maximization'
    | 'timing_optimization';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedSavings: number;
  implementationCost: number;
  roi: number; // Return on Investment
  timeToImplement: number; // days
  complexity: 'simple' | 'medium' | 'complex';
  confidence: number; // 0-100
  requirements: string[];
  risks: string[];
  status: 'identified' | 'analyzing' | 'ready' | 'implementing' | 'completed';
  aiRecommendation: string;
  legalBasis: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface TaxScenario {
  id: string;
  name: string;
  description: string;
  currentTaxBurden: number;
  optimizedTaxBurden: number;
  potentialSavings: number;
  implementationSteps: string[];
  timeline: number; // months
  riskLevel: 'low' | 'medium' | 'high';
  applicability: number; // 0-100
}

interface AIAnalysis {
  id: string;
  type:
    | 'pattern_analysis'
    | 'benchmark_comparison'
    | 'predictive_modeling'
    | 'optimization_suggestion';
  title: string;
  description: string;
  insights: string[];
  recommendations: string[];
  confidence: number;
  dataPoints: number;
  lastUpdated: Date;
}

interface OptimizationMetrics {
  totalOpportunities: number;
  totalPotentialSavings: number;
  implementedSavings: number;
  averageROI: number;
  completionRate: number;
  riskScore: number;
}

export function TaxOptimizationAI() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<OptimizationOpportunity | null>(
    null
  );
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('12');

  // Dados de exemplo para oportunidades de otimização
  const optimizationOpportunities: OptimizationOpportunity[] = [
    {
      id: '1',
      title: 'Recuperação de Créditos PIS/COFINS não Cumulativo',
      description:
        'Análise identificou R$ 280.000 em créditos de PIS/COFINS não aproveitados dos últimos 5 anos.',
      category: 'credit_recovery',
      priority: 'high',
      estimatedSavings: 280000,
      implementationCost: 15000,
      roi: 1767,
      timeToImplement: 45,
      complexity: 'medium',
      confidence: 92,
      requirements: [
        'Análise detalhada da base de cálculo',
        'Levantamento de documentos fiscais',
        'Peticionamento junto à RFB',
      ],
      risks: ['Possível questionamento fiscal', 'Necessidade de documentação adicional'],
      status: 'ready',
      aiRecommendation:
        'Oportunidade de alta confiança com excelente ROI. Recomenda-se implementação imediata.',
      legalBasis: ['Lei 10.637/2002', 'Lei 10.833/2003', 'IN RFB 1.911/2019'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Otimização do Regime Tributário - Lucro Presumido',
      description:
        'Migração para Lucro Presumido pode gerar economia de 18% na carga tributária anual.',
      category: 'regime_optimization',
      priority: 'critical',
      estimatedSavings: 450000,
      implementationCost: 25000,
      roi: 1700,
      timeToImplement: 90,
      complexity: 'complex',
      confidence: 87,
      requirements: [
        'Análise de faturamento anual',
        'Projeção de margem de lucro',
        'Planejamento da transição',
      ],
      risks: [
        'Mudança de regime pode ser irreversível no ano',
        'Necessidade de controles adicionais',
      ],
      status: 'analyzing',
      aiRecommendation:
        'Mudança estratégica com alto impacto. Avaliar cuidadosamente o timing da implementação.',
      legalBasis: ['Lei 9.718/1998', 'RIR/2018', 'IN RFB 1.700/2017'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Maximização de Deduções IRPJ/CSLL',
      description:
        'Identificadas deduções não aproveitadas em despesas operacionais e depreciação acelerada.',
      category: 'deduction_maximization',
      priority: 'medium',
      estimatedSavings: 125000,
      implementationCost: 8000,
      roi: 1463,
      timeToImplement: 30,
      complexity: 'simple',
      confidence: 95,
      requirements: [
        'Revisão de despesas dedutíveis',
        'Análise de depreciação',
        'Ajustes na escrituração',
      ],
      risks: ['Necessidade de documentação comprobatória', 'Possível revisão em fiscalização'],
      status: 'ready',
      aiRecommendation: 'Oportunidade de baixo risco e alta confiança. Implementação recomendada.',
      legalBasis: ['Lei 9.249/1995', 'Decreto 9.580/2018', 'IN RFB 1.515/2014'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      title: 'Planejamento de Timing - Diferimento de Receitas',
      description:
        'Estratégia de diferimento de receitas para otimização da carga tributária no exercício.',
      category: 'timing_optimization',
      priority: 'medium',
      estimatedSavings: 95000,
      implementationCost: 5000,
      roi: 1800,
      timeToImplement: 15,
      complexity: 'simple',
      confidence: 78,
      requirements: [
        'Análise do fluxo de receitas',
        'Planejamento de faturamento',
        'Controles de timing',
      ],
      risks: ['Impacto no fluxo de caixa', 'Necessidade de coordenação operacional'],
      status: 'identified',
      aiRecommendation: 'Estratégia válida mas requer cuidado com impactos operacionais.',
      legalBasis: ['Lei 6.404/1976', 'CPC 30 - Receitas', 'IN RFB 1.397/2013'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Cenários de otimização
  const taxScenarios: TaxScenario[] = [
    {
      id: '1',
      name: 'Cenário Conservador',
      description: 'Implementação apenas de oportunidades de baixo risco',
      currentTaxBurden: 2500000,
      optimizedTaxBurden: 2125000,
      potentialSavings: 375000,
      implementationSteps: [
        'Recuperação de créditos PIS/COFINS',
        'Maximização de deduções IRPJ/CSLL',
        'Otimização de procedimentos fiscais',
      ],
      timeline: 6,
      riskLevel: 'low',
      applicability: 95,
    },
    {
      id: '2',
      name: 'Cenário Balanceado',
      description: 'Combinação de estratégias de médio risco com alto retorno',
      currentTaxBurden: 2500000,
      optimizedTaxBurden: 1875000,
      potentialSavings: 625000,
      implementationSteps: [
        'Mudança de regime tributário',
        'Recuperação de créditos',
        'Planejamento de timing',
        'Otimização de estrutura',
      ],
      timeline: 12,
      riskLevel: 'medium',
      applicability: 78,
    },
    {
      id: '3',
      name: 'Cenário Agressivo',
      description: 'Implementação de todas as oportunidades identificadas',
      currentTaxBurden: 2500000,
      optimizedTaxBurden: 1550000,
      potentialSavings: 950000,
      implementationSteps: [
        'Reestruturação completa',
        'Todas as recuperações de crédito',
        'Mudança de regime',
        'Estratégias avançadas de timing',
      ],
      timeline: 18,
      riskLevel: 'high',
      applicability: 65,
    },
  ];

  // Análises de IA
  const aiAnalyses: AIAnalysis[] = [
    {
      id: '1',
      type: 'pattern_analysis',
      title: 'Padrão de Subaproveitamento de Créditos',
      description:
        'Análise de padrões históricos indica subaproveitamento sistemático de créditos tributários.',
      insights: [
        'Média de 23% de créditos não aproveitados nos últimos 3 anos',
        'Maior concentração em PIS/COFINS não cumulativo',
        'Correlação com períodos de alta atividade operacional',
      ],
      recommendations: [
        'Implementar sistema automatizado de controle de créditos',
        'Criar rotinas mensais de conciliação',
        'Capacitar equipe em legislação específica',
      ],
      confidence: 89,
      dataPoints: 1247,
      lastUpdated: new Date(),
    },
    {
      id: '2',
      type: 'benchmark_comparison',
      title: 'Comparação com Empresas Similares',
      description: 'Benchmarking indica carga tributária 15% acima da média do setor.',
      insights: [
        'Carga tributária efetiva: 28.5% vs média do setor: 24.1%',
        'Principais gaps em planejamento tributário',
        'Oportunidades em regime de tributação',
      ],
      recommendations: [
        'Avaliar mudança de regime tributário',
        'Implementar estratégias do setor',
        'Considerar reorganização societária',
      ],
      confidence: 84,
      dataPoints: 856,
      lastUpdated: new Date(),
    },
  ];

  const metrics: OptimizationMetrics = useMemo(() => {
    const totalOpportunities = optimizationOpportunities.length;
    const totalPotentialSavings = optimizationOpportunities.reduce(
      (sum, opp) => sum + opp.estimatedSavings,
      0
    );
    const implementedSavings = optimizationOpportunities
      .filter(opp => opp.status === 'completed')
      .reduce((sum, opp) => sum + opp.estimatedSavings, 0);
    const averageROI =
      optimizationOpportunities.reduce((sum, opp) => sum + opp.roi, 0) / totalOpportunities;
    const completedCount = optimizationOpportunities.filter(
      opp => opp.status === 'completed'
    ).length;
    const completionRate = (completedCount / totalOpportunities) * 100;
    const riskScore =
      optimizationOpportunities.reduce((sum, opp) => {
        const riskValue = opp.complexity === 'complex' ? 3 : opp.complexity === 'medium' ? 2 : 1;
        return sum + riskValue;
      }, 0) / totalOpportunities;

    return {
      totalOpportunities,
      totalPotentialSavings,
      implementedSavings,
      averageROI: Math.round(averageROI),
      completionRate: Math.round(completionRate),
      riskScore: Math.round(riskScore * 33.33), // Convert to 0-100 scale
    };
  }, [optimizationOpportunities]);

  const savingsProjection = useMemo(() => {
    // Simulando projeção de economia ao longo do tempo
    return [
      { month: 'Jan', current: 0, projected: 45000 },
      { month: 'Fev', current: 0, projected: 95000 },
      { month: 'Mar', current: 0, projected: 165000 },
      { month: 'Abr', current: 0, projected: 245000 },
      { month: 'Mai', current: 0, projected: 325000 },
      { month: 'Jun', current: 0, projected: 425000 },
      { month: 'Jul', current: 0, projected: 525000 },
      { month: 'Ago', current: 0, projected: 645000 },
      { month: 'Set', current: 0, projected: 745000 },
      { month: 'Out', current: 0, projected: 825000 },
      { month: 'Nov', current: 0, projected: 895000 },
      { month: 'Dez', current: 0, projected: 950000 },
    ];
  }, []);

  const opportunityDistribution = useMemo(() => {
    const distribution = optimizationOpportunities.reduce(
      (acc, opp) => {
        acc[opp.category] = (acc[opp.category] || 0) + opp.estimatedSavings;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(distribution).map(([category, value]) => ({
      name: category.replace('_', ' ').toUpperCase(),
      value,
      color:
        category === 'credit_recovery'
          ? '#22c55e'
          : category === 'regime_optimization'
            ? '#3b82f6'
            : category === 'deduction_maximization'
              ? '#f59e0b'
              : category === 'timing_optimization'
                ? '#ef4444'
                : '#8b5cf6',
    }));
  }, [optimizationOpportunities]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'credit_recovery':
        return <TrendingUp className="h-4 w-4" />;
      case 'regime_optimization':
        return <Settings className="h-4 w-4" />;
      case 'deduction_maximization':
        return <Calculator className="h-4 w-4" />;
      case 'timing_optimization':
        return <Clock className="h-4 w-4" />;
      case 'tax_planning':
        return <Target className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'implementing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-purple-100 text-purple-800';
      case 'analyzing':
        return 'bg-yellow-100 text-yellow-800';
      case 'identified':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const runAIAnalysis = () => {
    setAnalysisRunning(true);
    setTimeout(() => setAnalysisRunning(false), 3000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Otimização Tributária com IA
          </h2>
          <p className="text-muted-foreground">
            Identificação inteligente de oportunidades de economia fiscal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={runAIAnalysis} disabled={analysisRunning}>
            <Brain className={`h-4 w-4 mr-2 ${analysisRunning ? 'animate-pulse' : ''}`} />
            {analysisRunning ? 'Analisando...' : 'Executar IA'}
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

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOpportunities}</div>
            <p className="text-xs text-muted-foreground">Identificadas pela IA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Potencial</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(metrics.totalPotentialSavings)}
            </div>
            <p className="text-xs text-muted-foreground">Próximos 12 meses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.averageROI}%</div>
            <p className="text-xs text-muted-foreground">Retorno sobre investimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Oportunidades implementadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de Risco</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.riskScore}</div>
            <p className="text-xs text-muted-foreground">Risco médio das estratégias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Realizada</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(metrics.implementedSavings)}
            </div>
            <p className="text-xs text-muted-foreground">Já implementado</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList>
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
          <TabsTrigger value="scenarios">Cenários</TabsTrigger>
          <TabsTrigger value="projections">Projeções</TabsTrigger>
          <TabsTrigger value="ai-analysis">Análise IA</TabsTrigger>
          <TabsTrigger value="implementation">Implementação</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Opportunities List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Oportunidades de Otimização</CardTitle>
                  <CardDescription>
                    Oportunidades identificadas pela análise de IA ordenadas por ROI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {optimizationOpportunities
                        .sort((a, b) => b.roi - a.roi)
                        .map(opportunity => (
                          <div
                            key={opportunity.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedOpportunity?.id === opportunity.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedOpportunity(opportunity)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getCategoryIcon(opportunity.category)}
                                <h4 className="font-medium">{opportunity.title}</h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getPriorityColor(opportunity.priority)}>
                                  {opportunity.priority}
                                </Badge>
                                <Badge className={getStatusColor(opportunity.status)}>
                                  {opportunity.status}
                                </Badge>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3">
                              {opportunity.description}
                            </p>

                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Economia:</span>
                                <div className="font-medium text-green-600">
                                  {formatCurrency(opportunity.estimatedSavings)}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">ROI:</span>
                                <div className="font-medium text-blue-600">{opportunity.roi}%</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Confiança:</span>
                                <div className="font-medium">{opportunity.confidence}%</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Prazo:</span>
                                <div className="font-medium">
                                  {opportunity.timeToImplement} dias
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Opportunity Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Oportunidade</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedOpportunity ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">{selectedOpportunity.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedOpportunity.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Economia</span>
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(selectedOpportunity.estimatedSavings)}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Custo</span>
                        <div className="text-xl font-bold text-red-600">
                          {formatCurrency(selectedOpportunity.implementationCost)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Confiança da IA</span>
                        <span className="text-sm font-medium">
                          {selectedOpportunity.confidence}%
                        </span>
                      </div>
                      <Progress value={selectedOpportunity.confidence} />
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Recomendação da IA</h5>
                      <p className="text-sm bg-blue-50 p-3 rounded-lg">
                        {selectedOpportunity.aiRecommendation}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Requisitos</h5>
                      <ul className="text-sm space-y-1">
                        {selectedOpportunity.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Riscos</h5>
                      <ul className="text-sm space-y-1">
                        {selectedOpportunity.risks.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Base Legal</h5>
                      <ul className="text-sm space-y-1">
                        {selectedOpportunity.legalBasis.map((basis, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            {basis}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 space-y-2">
                      <Button className="w-full">
                        <Rocket className="h-4 w-4 mr-2" />
                        Implementar Oportunidade
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Análise Detalhada
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecione uma oportunidade para ver os detalhes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Oportunidades por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={opportunityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {opportunityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={value => formatCurrency(Number(value))} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {taxScenarios.map(scenario => (
              <Card key={scenario.id}>
                <CardHeader>
                  <CardTitle>{scenario.name}</CardTitle>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Carga Atual</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(scenario.currentTaxBurden)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Carga Otimizada</span>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(scenario.optimizedTaxBurden)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-sm">Economia</span>
                      <span className="text-sm text-green-600">
                        {formatCurrency(scenario.potentialSavings)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Aplicabilidade</span>
                      <span className="text-sm font-medium">{scenario.applicability}%</span>
                    </div>
                    <Progress value={scenario.applicability} />
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">
                      Cronograma ({scenario.timeline} meses)
                    </span>
                    <ul className="text-sm space-y-1">
                      {scenario.implementationSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ArrowRight className="h-3 w-3 mt-1 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full">Simular Cenário</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Projeção de Economia Acumulada</CardTitle>
              <CardDescription>
                Estimativa de economia ao longo dos próximos 12 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={savingsProjection}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={value => formatCurrency(value)} />
                  <Tooltip formatter={value => formatCurrency(Number(value))} />
                  <Area
                    type="monotone"
                    dataKey="projected"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-analysis" className="space-y-6">
          <div className="space-y-4">
            {aiAnalyses.map(analysis => (
              <Card key={analysis.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{analysis.title}</CardTitle>
                      <CardDescription>
                        {analysis.type.replace('_', ' ').toUpperCase()} • Confiança:{' '}
                        {analysis.confidence}% •{analysis.dataPoints} pontos de dados
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      <Brain className="h-3 w-3 mr-1" />
                      IA
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{analysis.description}</p>

                  <div>
                    <h5 className="font-medium mb-2">Insights Identificados</h5>
                    <ul className="text-sm space-y-1">
                      {analysis.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Recomendações</h5>
                    <ul className="text-sm space-y-1">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      Última atualização:{' '}
                      {format(analysis.lastUpdated, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                    <Button size="sm">Ver Detalhes</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plano de Implementação</CardTitle>
                <CardDescription>
                  Cronograma de implementação das oportunidades prioritárias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizationOpportunities
                    .filter(opp => opp.status === 'ready' || opp.status === 'implementing')
                    .sort((a, b) => b.roi - a.roi)
                    .map((opportunity, index) => (
                      <div
                        key={opportunity.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{opportunity.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(opportunity.estimatedSavings)} •{' '}
                            {opportunity.timeToImplement} dias
                          </p>
                        </div>
                        <Badge className={getStatusColor(opportunity.status)}>
                          {opportunity.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recursos Necessários</CardTitle>
                <CardDescription>Estimativa de recursos para implementação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(
                        optimizationOpportunities
                          .filter(opp => opp.status === 'ready' || opp.status === 'implementing')
                          .reduce((sum, opp) => sum + opp.implementationCost, 0)
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Investimento Total</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(
                        optimizationOpportunities
                          .filter(opp => opp.status === 'ready' || opp.status === 'implementing')
                          .reduce((sum, opp) => sum + opp.timeToImplement, 0) / 30
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Meses de Trabalho</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium">Equipe Necessária</h5>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Especialista em Tributação (Senior)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Analista Fiscal (Pleno)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Consultor Jurídico (Externo)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Gerente de Projeto
                    </li>
                  </ul>
                </div>

                <div className="pt-4">
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar Implementação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
