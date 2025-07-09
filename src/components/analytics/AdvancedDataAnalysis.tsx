import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Target,
  Zap,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Database,
  Cpu,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Lightbulb,
  Shield,
  Coins,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

// Tipos de análise
export enum AnalysisType {
  PREDICTIVE = 'PREDICTIVE',
  DESCRIPTIVE = 'DESCRIPTIVE',
  PRESCRIPTIVE = 'PRESCRIPTIVE',
  DIAGNOSTIC = 'DIAGNOSTIC',
  ANOMALY_DETECTION = 'ANOMALY_DETECTION',
  PATTERN_RECOGNITION = 'PATTERN_RECOGNITION',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  COMPLIANCE_ANALYSIS = 'COMPLIANCE_ANALYSIS',
}

// Status da análise
export enum AnalysisStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

// Interface para análise de dados
export interface DataAnalysis {
  id: string;
  name: string;
  description: string;
  type: AnalysisType;
  status: AnalysisStatus;
  progress: number;
  accuracy: number;
  confidence: number;
  startedAt: Date;
  completedAt?: Date;
  estimatedDuration: number; // em minutos
  dataSource: string;
  algorithm: string;
  parameters: Record<string, any>;
  results: AnalysisResult[];
  insights: AnalysisInsight[];
  recommendations: string[];
  createdBy: string;
  tags: string[];
}

// Interface para resultado de análise
export interface AnalysisResult {
  id: string;
  metric: string;
  value: number;
  unit: string;
  trend: number;
  significance: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  timestamp: Date;
}

// Interface para insight de análise
export interface AnalysisInsight {
  id: string;
  title: string;
  description: string;
  type: 'OPPORTUNITY' | 'RISK' | 'TREND' | 'ANOMALY';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  impact: number; // 0-100
  probability: number; // 0-100
  evidence: string[];
  actionItems: string[];
}

// Interface para modelo de ML
export interface MLModel {
  id: string;
  name: string;
  type: 'CLASSIFICATION' | 'REGRESSION' | 'CLUSTERING' | 'DEEP_LEARNING';
  algorithm: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingData: string;
  features: string[];
  lastTrained: Date;
  version: string;
  status: 'ACTIVE' | 'TRAINING' | 'INACTIVE';
}

// Mock data para análises
const MOCK_ANALYSES: DataAnalysis[] = [
  {
    id: 'analysis-001',
    name: 'Previsão de Arrecadação Tributária',
    description: 'Análise preditiva para estimar arrecadação dos próximos 6 meses',
    type: AnalysisType.PREDICTIVE,
    status: AnalysisStatus.COMPLETED,
    progress: 100,
    accuracy: 94.2,
    confidence: 87.5,
    startedAt: new Date(Date.now() - 3600000),
    completedAt: new Date(Date.now() - 1800000),
    estimatedDuration: 45,
    dataSource: 'Histórico de Arrecadação + Dados Econômicos',
    algorithm: 'LSTM Neural Network',
    parameters: {
      lookback_period: 24,
      forecast_horizon: 6,
      features: ['pib', 'inflacao', 'desemprego', 'cambio'],
    },
    results: [
      {
        id: 'result-001',
        metric: 'Arrecadação Prevista',
        value: 2450000,
        unit: 'BRL',
        trend: 8.5,
        significance: 'HIGH',
        category: 'Receita',
        timestamp: new Date(),
      },
    ],
    insights: [
      {
        id: 'insight-001',
        title: 'Crescimento Sustentado',
        description: 'Modelo prevê crescimento de 8.5% na arrecadação nos próximos 6 meses',
        type: 'OPPORTUNITY',
        severity: 'MEDIUM',
        impact: 85,
        probability: 87,
        evidence: ['Melhoria indicadores econômicos', 'Histórico de compliance'],
        actionItems: ['Otimizar processos de cobrança', 'Ampliar base tributária'],
      },
    ],
    recommendations: [
      'Focar em contribuintes com maior potencial de crescimento',
      'Implementar campanhas de educação fiscal',
      'Modernizar sistemas de arrecadação',
    ],
    createdBy: 'Sistema IA',
    tags: ['previsao', 'arrecadacao', 'tributario'],
  },
  {
    id: 'analysis-002',
    name: 'Detecção de Fraudes Fiscais',
    description: 'Identificação de padrões suspeitos em declarações tributárias',
    type: AnalysisType.ANOMALY_DETECTION,
    status: AnalysisStatus.RUNNING,
    progress: 65,
    accuracy: 96.8,
    confidence: 92.3,
    startedAt: new Date(Date.now() - 1800000),
    estimatedDuration: 90,
    dataSource: 'Declarações Fiscais + Dados Bancários',
    algorithm: 'Isolation Forest + Autoencoders',
    parameters: {
      contamination: 0.05,
      threshold: 0.8,
      features: ['receita', 'despesas', 'impostos', 'patrimonio'],
    },
    results: [
      {
        id: 'result-002',
        metric: 'Anomalias Detectadas',
        value: 127,
        unit: 'casos',
        trend: -15,
        significance: 'HIGH',
        category: 'Compliance',
        timestamp: new Date(),
      },
    ],
    insights: [
      {
        id: 'insight-002',
        title: 'Padrão de Evasão Identificado',
        description:
          'Detectado padrão suspeito em 127 declarações com alta probabilidade de fraude',
        type: 'RISK',
        severity: 'HIGH',
        impact: 95,
        probability: 92,
        evidence: ['Inconsistências em receitas', 'Padrões atípicos de despesas'],
        actionItems: ['Iniciar auditoria fiscal', 'Notificar contribuintes'],
      },
    ],
    recommendations: [
      'Priorizar auditoria nos casos de maior risco',
      'Implementar validação cruzada em tempo real',
      'Criar alertas automáticos para padrões suspeitos',
    ],
    createdBy: 'Sistema IA',
    tags: ['fraude', 'anomalia', 'compliance'],
  },
  {
    id: 'analysis-003',
    name: 'Análise de Risco de Crédito',
    description: 'Avaliação de risco para transações de créditos tributários',
    type: AnalysisType.RISK_ASSESSMENT,
    status: AnalysisStatus.PENDING,
    progress: 0,
    accuracy: 0,
    confidence: 0,
    startedAt: new Date(),
    estimatedDuration: 60,
    dataSource: 'Histórico de Transações + Perfil de Usuários',
    algorithm: 'Random Forest + Gradient Boosting',
    parameters: {
      max_depth: 10,
      n_estimators: 100,
      features: ['valor_transacao', 'historico_pagamento', 'score_credito'],
    },
    results: [],
    insights: [],
    recommendations: [],
    createdBy: 'Sistema IA',
    tags: ['risco', 'credito', 'transacao'],
  },
];

// Mock data para modelos ML
const MOCK_ML_MODELS: MLModel[] = [
  {
    id: 'model-001',
    name: 'Classificador de Risco Tributário',
    type: 'CLASSIFICATION',
    algorithm: 'XGBoost',
    accuracy: 94.2,
    precision: 92.8,
    recall: 95.1,
    f1Score: 93.9,
    trainingData: '50,000 declarações fiscais',
    features: ['receita_bruta', 'lucro_liquido', 'impostos_pagos', 'setor_atividade'],
    lastTrained: new Date(Date.now() - 86400000 * 7),
    version: '2.1.0',
    status: 'ACTIVE',
  },
  {
    id: 'model-002',
    name: 'Preditor de Arrecadação',
    type: 'REGRESSION',
    algorithm: 'LSTM',
    accuracy: 89.7,
    precision: 88.2,
    recall: 91.3,
    f1Score: 89.7,
    trainingData: '10 anos de dados históricos',
    features: ['pib', 'inflacao', 'desemprego', 'cambio', 'sazonalidade'],
    lastTrained: new Date(Date.now() - 86400000 * 3),
    version: '1.5.2',
    status: 'ACTIVE',
  },
  {
    id: 'model-003',
    name: 'Detector de Anomalias',
    type: 'CLUSTERING',
    algorithm: 'Isolation Forest',
    accuracy: 96.8,
    precision: 94.5,
    recall: 97.2,
    f1Score: 95.8,
    trainingData: '100,000 transações',
    features: ['valor', 'frequencia', 'horario', 'origem', 'destino'],
    lastTrained: new Date(Date.now() - 86400000),
    version: '3.0.1',
    status: 'TRAINING',
  },
];

// Componente principal
export function AdvancedDataAnalysis() {
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState<DataAnalysis[]>(MOCK_ANALYSES);
  const [mlModels, setMLModels] = useState<MLModel[]>(MOCK_ML_MODELS);
  const [selectedAnalysis, setSelectedAnalysis] = useState<DataAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtrar análises
  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch =
      analysis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || analysis.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || analysis.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Estatísticas
  const stats = {
    totalAnalyses: analyses.length,
    runningAnalyses: analyses.filter(a => a.status === AnalysisStatus.RUNNING).length,
    completedAnalyses: analyses.filter(a => a.status === AnalysisStatus.COMPLETED).length,
    averageAccuracy:
      analyses.filter(a => a.accuracy > 0).reduce((acc, a) => acc + a.accuracy, 0) /
        analyses.filter(a => a.accuracy > 0).length || 0,
    activeModels: mlModels.filter(m => m.status === 'ACTIVE').length,
    totalInsights: analyses.reduce((acc, a) => acc + a.insights.length, 0),
  };

  // Ações
  const handleStartAnalysis = (analysisId: string) => {
    setAnalyses(prev =>
      prev.map(a =>
        a.id === analysisId
          ? { ...a, status: AnalysisStatus.RUNNING, startedAt: new Date(), progress: 0 }
          : a
      )
    );
    toast({
      title: 'Sucesso',
      description: 'Análise iniciada com sucesso',
    });
  };

  const handleCancelAnalysis = (analysisId: string) => {
    setAnalyses(prev =>
      prev.map(a =>
        a.id === analysisId ? { ...a, status: AnalysisStatus.CANCELLED, progress: 0 } : a
      )
    );
    toast({
      title: 'Sucesso',
      description: 'Análise cancelada',
    });
  };

  // Função para obter ícone do tipo de análise
  const getAnalysisTypeIcon = (type: AnalysisType) => {
    switch (type) {
      case AnalysisType.PREDICTIVE:
        return <TrendingUp className="h-4 w-4" />;
      case AnalysisType.ANOMALY_DETECTION:
        return <AlertTriangle className="h-4 w-4" />;
      case AnalysisType.RISK_ASSESSMENT:
        return <Shield className="h-4 w-4" />;
      case AnalysisType.COMPLIANCE_ANALYSIS:
        return <CheckCircle className="h-4 w-4" />;
      case AnalysisType.PATTERN_RECOGNITION:
        return <Eye className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: AnalysisStatus) => {
    switch (status) {
      case AnalysisStatus.RUNNING:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case AnalysisStatus.COMPLETED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case AnalysisStatus.FAILED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case AnalysisStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Análises Totais</p>
                <p className="text-2xl font-bold">{stats.totalAnalyses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Em Execução</p>
                <p className="text-2xl font-bold text-blue-600">{stats.runningAnalyses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedAnalyses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Precisão Média</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.averageAccuracy.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-indigo-600" />
              <div>
                <p className="text-sm font-medium">Modelos Ativos</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.activeModels}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Insights</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.totalInsights}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analyses">Análises</TabsTrigger>
          <TabsTrigger value="models">Modelos ML</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Análises em execução */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Análises em Execução
                </CardTitle>
                <CardDescription>Processamento de dados em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {analyses
                      .filter(a => a.status === AnalysisStatus.RUNNING)
                      .map(analysis => (
                        <div
                          key={analysis.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            {getAnalysisTypeIcon(analysis.type)}
                            <div>
                              <p className="font-medium text-sm">{analysis.name}</p>
                              <p className="text-xs text-muted-foreground">{analysis.algorithm}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{analysis.progress}%</p>
                            <Progress value={analysis.progress} className="w-16 h-2" />
                          </div>
                        </div>
                      ))}

                    {analyses.filter(a => a.status === AnalysisStatus.RUNNING).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma análise em execução</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Insights recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Insights Recentes
                </CardTitle>
                <CardDescription>Descobertas e recomendações da IA</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {analyses
                      .flatMap(a => a.insights)
                      .slice(0, 5)
                      .map(insight => (
                        <div key={insight.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{insight.title}</h4>
                            <Badge
                              className={cn(
                                'text-xs',
                                insight.type === 'OPPORTUNITY'
                                  ? 'bg-green-100 text-green-800'
                                  : insight.type === 'RISK'
                                    ? 'bg-red-100 text-red-800'
                                    : insight.type === 'TREND'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-yellow-100 text-yellow-800'
                              )}
                            >
                              {insight.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {insight.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span>Impacto: {insight.impact}%</span>
                            <span>Probabilidade: {insight.probability}%</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Performance dos modelos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance dos Modelos ML
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mlModels.map(model => (
                  <div key={model.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{model.name}</h4>
                      <Badge
                        className={cn(
                          'text-xs',
                          model.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : model.status === 'TRAINING'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {model.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{model.algorithm}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Precisão</span>
                        <span className="font-medium">{model.accuracy.toFixed(1)}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <span>Precision: {model.precision.toFixed(1)}%</span>
                        <span>Recall: {model.recall.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyses" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar análises..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      <SelectItem value={AnalysisType.PREDICTIVE}>Preditiva</SelectItem>
                      <SelectItem value={AnalysisType.ANOMALY_DETECTION}>
                        Detecção de Anomalias
                      </SelectItem>
                      <SelectItem value={AnalysisType.RISK_ASSESSMENT}>
                        Avaliação de Risco
                      </SelectItem>
                      <SelectItem value={AnalysisType.COMPLIANCE_ANALYSIS}>
                        Análise de Compliance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value={AnalysisStatus.RUNNING}>Em Execução</SelectItem>
                      <SelectItem value={AnalysisStatus.COMPLETED}>Concluída</SelectItem>
                      <SelectItem value={AnalysisStatus.PENDING}>Pendente</SelectItem>
                      <SelectItem value={AnalysisStatus.FAILED}>Falha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de análises */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAnalyses.map(analysis => (
              <Card
                key={analysis.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedAnalysis(analysis)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getAnalysisTypeIcon(analysis.type)}
                      <CardTitle className="text-lg">{analysis.name}</CardTitle>
                    </div>
                    <Badge className={cn('text-xs', getStatusColor(analysis.status))}>
                      {analysis.status}
                    </Badge>
                  </div>
                  <CardDescription>{analysis.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {analysis.status === AnalysisStatus.RUNNING && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{analysis.progress}%</span>
                      </div>
                      <Progress value={analysis.progress} />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Algoritmo</p>
                      <p className="font-medium">{analysis.algorithm}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Precisão</p>
                      <p className="font-medium">
                        {analysis.accuracy > 0 ? `${analysis.accuracy}%` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Confiança</p>
                      <p className="font-medium">
                        {analysis.confidence > 0 ? `${analysis.confidence}%` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Insights</p>
                      <p className="font-medium">{analysis.insights.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-1">
                      {analysis.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-1">
                      {analysis.status === AnalysisStatus.PENDING && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={e => {
                            e.stopPropagation();
                            handleStartAnalysis(analysis.id);
                          }}
                        >
                          Iniciar
                        </Button>
                      )}

                      {analysis.status === AnalysisStatus.RUNNING && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={e => {
                            e.stopPropagation();
                            handleCancelAnalysis(analysis.id);
                          }}
                        >
                          Cancelar
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={e => {
                          e.stopPropagation();
                          // Abrir detalhes
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {mlModels.map(model => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <Badge
                      className={cn(
                        'text-xs',
                        model.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : model.status === 'TRAINING'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {model.status}
                    </Badge>
                  </div>
                  <CardDescription>{model.algorithm}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Precisão</p>
                      <p className="text-2xl font-bold">{model.accuracy.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">F1-Score</p>
                      <p className="text-2xl font-bold">{model.f1Score.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Precision</span>
                      <span>{model.precision.toFixed(1)}%</span>
                    </div>
                    <Progress value={model.precision} className="h-2" />

                    <div className="flex justify-between text-sm">
                      <span>Recall</span>
                      <span>{model.recall.toFixed(1)}%</span>
                    </div>
                    <Progress value={model.recall} className="h-2" />
                  </div>

                  <div className="text-sm">
                    <p className="text-muted-foreground">Dados de Treinamento</p>
                    <p className="font-medium">{model.trainingData}</p>
                  </div>

                  <div className="text-sm">
                    <p className="text-muted-foreground">Última Atualização</p>
                    <p className="font-medium">{model.lastTrained.toLocaleDateString('pt-BR')}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Badge variant="outline">{model.version}</Badge>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            {analyses
              .flatMap(a => a.insights)
              .map(insight => (
                <Card key={insight.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <div className="flex space-x-2">
                        <Badge
                          className={cn(
                            'text-xs',
                            insight.type === 'OPPORTUNITY'
                              ? 'bg-green-100 text-green-800'
                              : insight.type === 'RISK'
                                ? 'bg-red-100 text-red-800'
                                : insight.type === 'TREND'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                          )}
                        >
                          {insight.type}
                        </Badge>
                        <Badge
                          className={cn(
                            'text-xs',
                            insight.severity === 'CRITICAL'
                              ? 'bg-red-100 text-red-800'
                              : insight.severity === 'HIGH'
                                ? 'bg-orange-100 text-orange-800'
                                : insight.severity === 'MEDIUM'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                          )}
                        >
                          {insight.severity}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{insight.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Impacto</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={insight.impact} className="flex-1" />
                          <span className="text-sm font-medium">{insight.impact}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Probabilidade</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={insight.probability} className="flex-1" />
                          <span className="text-sm font-medium">{insight.probability}%</span>
                        </div>
                      </div>
                    </div>

                    {insight.evidence.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Evidências</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {insight.evidence.map((evidence, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-1 h-1 bg-current rounded-full" />
                              <span>{evidence}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {insight.actionItems.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Ações Recomendadas</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {insight.actionItems.map((action, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-1 h-1 bg-current rounded-full" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Análise</CardTitle>
              <CardDescription>Configure parâmetros globais para análises de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="confidence-threshold">Limite de Confiança (%)</Label>
                    <Input id="confidence-threshold" type="number" defaultValue="80" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-concurrent">Máximo de Análises Simultâneas</Label>
                    <Input id="max-concurrent" type="number" defaultValue="5" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retention-days">Retenção de Dados (dias)</Label>
                    <Input id="retention-days" type="number" defaultValue="90" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="auto-retrain">Retreinamento Automático</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notification-level">Nível de Notificação</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixo</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="high">Alto</SelectItem>
                        <SelectItem value="critical">Apenas Crítico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Frequência de Backup</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Horário</SelectItem>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
