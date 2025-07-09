import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Database,
  Play,
  Pause,
  Settings,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Activity,
  BarChart3,
  Zap,
  Globe,
  Building2,
  Gavel,
  Receipt,
  MapPin,
  FileText,
  Shield,
  Target,
  Rocket,
} from 'lucide-react';

// Interfaces para o roadmap
interface DataSource {
  id: string;
  name: string;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  type: 'API' | 'WEB_SCRAPING' | 'HYBRID';
  volume: string;
  valor: string;
  status: 'IMPLEMENTADO' | 'FÁCIL' | 'MÉDIO' | 'COMPLEXO';
  prioridade: number;
  enabled: boolean;
  lastSync?: Date;
  successRate: number;
  responseTime: number;
  recordsCollected: number;
  opportunities: number;
  icon: React.ReactNode;
  description: string;
  endpoints: number;
}

interface RoadmapStats {
  totalSources: number;
  tier1Sources: number;
  tier2Sources: number;
  tier3Sources: number;
  enabledSources: number;
  totalValue: string;
  totalOpportunities: string;
  implementationProgress: number;
  estimatedROI: string;
  paybackTime: string;
}

interface CollectionResult {
  sourceId: string;
  sourceName: string;
  success: boolean;
  recordsFound: number;
  totalValue: number;
  opportunities: number;
  processingTime: number;
  timestamp: Date;
}

const RoadmapDataSourcesOrchestrator: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [roadmapStats, setRoadmapStats] = useState<RoadmapStats | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectionProgress, setCollectionProgress] = useState(0);
  const [collectionResults, setCollectionResults] = useState<CollectionResult[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [testingSource, setTestingSource] = useState<string | null>(null);

  // Inicializar dados das fontes do roadmap
  useEffect(() => {
    initializeRoadmapSources();
    loadRoadmapStats();
  }, []);

  const initializeRoadmapSources = () => {
    const sources: DataSource[] = [
      // 🏆 TIER 1 - ALTA PRIORIDADE
      {
        id: 'pgfn-fazenda-nacional',
        name: 'PGFN - Procuradoria Fazenda Nacional',
        tier: 'TIER_1',
        type: 'API',
        volume: '50.000+ devedores/mês',
        valor: 'R$ 380+ bilhões',
        status: 'IMPLEMENTADO',
        prioridade: 1,
        enabled: true,
        lastSync: new Date(),
        successRate: 98,
        responseTime: 850,
        recordsCollected: 15420,
        opportunities: 2847,
        icon: <Gavel className="h-5 w-5 text-blue-600" />,
        description: 'Dívida ativa da União, execuções fiscais e devedores federais',
        endpoints: 3,
      },
      {
        id: 'receita-federal-empresas',
        name: 'Receita Federal - Dados Empresariais',
        tier: 'TIER_1',
        type: 'API',
        volume: '19M+ CNPJs ativos',
        valor: 'Base empresarial completa',
        status: 'FÁCIL',
        prioridade: 2,
        enabled: true,
        lastSync: new Date(Date.now() - 300000),
        successRate: 95,
        responseTime: 650,
        recordsCollected: 45780,
        opportunities: 8920,
        icon: <Receipt className="h-5 w-5 text-green-600" />,
        description: 'Dados cadastrais, situação fiscal e atividades econômicas',
        endpoints: 4,
      },
      {
        id: 'sefaz-sp',
        name: 'SEFAZ-SP - Secretaria Fazenda SP',
        tier: 'TIER_1',
        type: 'HYBRID',
        volume: '180.000+ devedores',
        valor: 'R$ 45+ bilhões (só SP)',
        status: 'MÉDIO',
        prioridade: 3,
        enabled: true,
        lastSync: new Date(Date.now() - 600000),
        successRate: 92,
        responseTime: 1200,
        recordsCollected: 8950,
        opportunities: 1890,
        icon: <Building2 className="h-5 w-5 text-purple-600" />,
        description: 'Devedores de ICMS, créditos acumulados e NFe',
        endpoints: 5,
      },
      {
        id: 'cnj-precatorios',
        name: 'CNJ - Precatórios Nacionais',
        tier: 'TIER_1',
        type: 'API',
        volume: '380.000+ precatórios',
        valor: 'R$ 89+ bilhões',
        status: 'FÁCIL',
        prioridade: 4,
        enabled: true,
        lastSync: new Date(Date.now() - 900000),
        successRate: 94,
        responseTime: 980,
        recordsCollected: 12300,
        opportunities: 3450,
        icon: <Shield className="h-5 w-5 text-orange-600" />,
        description: 'Precatórios, execuções fiscais e RPVs',
        endpoints: 3,
      },
      {
        id: 'cvm-debentures',
        name: 'CVM - Debêntures e Bonds',
        tier: 'TIER_1',
        type: 'API',
        volume: '2.500+ séries ativas',
        valor: 'R$ 680+ bilhões',
        status: 'FÁCIL',
        prioridade: 5,
        enabled: true,
        lastSync: new Date(Date.now() - 1200000),
        successRate: 97,
        responseTime: 450,
        recordsCollected: 6780,
        opportunities: 1250,
        icon: <TrendingUp className="h-5 w-5 text-indigo-600" />,
        description: 'Debêntures, fundos de crédito e bonds corporativos',
        endpoints: 2,
      },
      // 🥈 TIER 2 - MÉDIA PRIORIDADE
      {
        id: 'sefaz-outros-estados',
        name: 'SEFAZ-RJ/MG/RS - Outros SEFAZs',
        tier: 'TIER_2',
        type: 'HYBRID',
        volume: '200.000+ devedores',
        valor: 'R$ 60+ bilhões',
        status: 'MÉDIO',
        prioridade: 6,
        enabled: false,
        successRate: 0,
        responseTime: 0,
        recordsCollected: 0,
        opportunities: 0,
        icon: <MapPin className="h-5 w-5 text-yellow-600" />,
        description: 'Secretarias de Fazenda de outros estados',
        endpoints: 6,
      },
      {
        id: 'tribunais-estaduais',
        name: 'Tribunais Estaduais - Execuções',
        tier: 'TIER_2',
        type: 'WEB_SCRAPING',
        volume: '1M+ execuções ativas',
        valor: 'R$ 200+ bilhões',
        status: 'COMPLEXO',
        prioridade: 7,
        enabled: false,
        successRate: 0,
        responseTime: 0,
        recordsCollected: 0,
        opportunities: 0,
        icon: <FileText className="h-5 w-5 text-red-600" />,
        description: 'Execuções fiscais nos tribunais estaduais',
        endpoints: 8,
      },
      {
        id: 'serasa-protestos',
        name: 'Cartórios Protesto - via SERASA',
        tier: 'TIER_2',
        type: 'API',
        volume: '8M+ protestos/ano',
        valor: 'R$ 120+ bilhões',
        status: 'MÉDIO',
        prioridade: 8,
        enabled: false,
        successRate: 0,
        responseTime: 0,
        recordsCollected: 0,
        opportunities: 0,
        icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
        description: 'Protestos em cartórios e inadimplência',
        endpoints: 3,
      },
      {
        id: 'bacen-sistema-credito',
        name: 'BACEN - Sistema de Crédito',
        tier: 'TIER_2',
        type: 'API',
        volume: '4.800+ instituições',
        valor: 'R$ 3.2+ trilhões',
        status: 'FÁCIL',
        prioridade: 9,
        enabled: false,
        successRate: 0,
        responseTime: 0,
        recordsCollected: 0,
        opportunities: 0,
        icon: <Database className="h-5 w-5 text-teal-600" />,
        description: 'Sistema de Crédito do Banco Central',
        endpoints: 4,
      },
      // 🥉 TIER 3 - BAIXA PRIORIDADE
      {
        id: 'b3-empresas-listadas',
        name: 'B3 - Empresas Listadas',
        tier: 'TIER_3',
        type: 'API',
        volume: '400+ empresas listadas',
        valor: 'R$ 500+ bilhões',
        status: 'FÁCIL',
        prioridade: 10,
        enabled: false,
        successRate: 0,
        responseTime: 0,
        recordsCollected: 0,
        opportunities: 0,
        icon: <Globe className="h-5 w-5 text-blue-500" />,
        description: 'Empresas de capital aberto na B3',
        endpoints: 2,
      },
    ];

    setDataSources(sources);
  };

  const loadRoadmapStats = () => {
    const stats: RoadmapStats = {
      totalSources: 10,
      tier1Sources: 5,
      tier2Sources: 4,
      tier3Sources: 1,
      enabledSources: 5,
      totalValue: 'R$ 280+ bilhões',
      totalOpportunities: '1M+ empresas',
      implementationProgress: 50,
      estimatedROI: '87x em 12 meses',
      paybackTime: '3-4 meses',
    };

    setRoadmapStats(stats);
  };

  const toggleSourceEnabled = (sourceId: string) => {
    setDataSources(prev =>
      prev.map(source =>
        source.id === sourceId ? { ...source, enabled: !source.enabled } : source
      )
    );
  };

  const testSourceConnection = async (sourceId: string) => {
    setTestingSource(sourceId);

    // Simular teste de conectividade
    await new Promise(resolve => setTimeout(resolve, 2000));

    setDataSources(prev =>
      prev.map(source =>
        source.id === sourceId
          ? {
              ...source,
              lastSync: new Date(),
              successRate: Math.random() * 20 + 80,
              responseTime: Math.random() * 1000 + 500,
            }
          : source
      )
    );

    setTestingSource(null);
  };

  const startMassCollection = async () => {
    setIsCollecting(true);
    setCollectionProgress(0);
    setCollectionResults([]);

    const enabledSources = dataSources.filter(s => s.enabled);
    const totalSteps = enabledSources.length;

    for (let i = 0; i < totalSteps; i++) {
      const source = enabledSources[i];

      // Simular coleta de dados
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result: CollectionResult = {
        sourceId: source.id,
        sourceName: source.name,
        success: Math.random() > 0.1,
        recordsFound: Math.floor(Math.random() * 1000) + 100,
        totalValue: Math.floor(Math.random() * 500000) + 50000,
        opportunities: Math.floor(Math.random() * 100) + 20,
        processingTime: Math.floor(Math.random() * 3000) + 1000,
        timestamp: new Date(),
      };

      setCollectionResults(prev => [...prev, result]);
      setCollectionProgress(((i + 1) / totalSteps) * 100);
    }

    setIsCollecting(false);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'TIER_1':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'TIER_2':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'TIER_3':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IMPLEMENTADO':
        return 'bg-green-100 text-green-800';
      case 'FÁCIL':
        return 'bg-blue-100 text-blue-800';
      case 'MÉDIO':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLEXO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  if (!roadmapStats) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            🚀 Roadmap - Sistema de Fontes de Dados
          </h1>
          <p className="text-gray-600 mt-2">
            Transformando a Tributa.AI na maior plataforma de títulos de crédito do Brasil
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={startMassCollection}
            disabled={isCollecting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isCollecting ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Coletando...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Iniciar Coleta
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Alert de Progresso */}
      {isCollecting && (
        <Alert className="border-blue-200 bg-blue-50">
          <Activity className="h-4 w-4 text-blue-600 animate-spin" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Coletando dados de todas as fontes habilitadas...</span>
              <span className="font-semibold">{Math.round(collectionProgress)}%</span>
            </div>
            <Progress value={collectionProgress} className="mt-2" />
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Valor Total</p>
                <p className="text-2xl font-bold text-green-900">{roadmapStats.totalValue}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Oportunidades</p>
                <p className="text-2xl font-bold text-blue-900">
                  {roadmapStats.totalOpportunities}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">ROI Estimado</p>
                <p className="text-2xl font-bold text-purple-900">{roadmapStats.estimatedROI}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Payback</p>
                <p className="text-2xl font-bold text-orange-900">{roadmapStats.paybackTime}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sources">Fontes de Dados</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Distribuição por Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">🏆 Tier 1 (Alta Prioridade)</span>
                    <Badge className="bg-green-100 text-green-800">
                      {roadmapStats.tier1Sources} fontes
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">🥈 Tier 2 (Média Prioridade)</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {roadmapStats.tier2Sources} fontes
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">🥉 Tier 3 (Baixa Prioridade)</span>
                    <Badge className="bg-gray-100 text-gray-800">
                      {roadmapStats.tier3Sources} fontes
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Progresso da Implementação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Fontes Habilitadas</span>
                    <span className="text-sm text-gray-600">
                      {roadmapStats.enabledSources} / {roadmapStats.totalSources}
                    </span>
                  </div>
                  <Progress value={roadmapStats.implementationProgress} className="h-2" />
                  <p className="text-sm text-gray-600">
                    {roadmapStats.implementationProgress}% do roadmap implementado
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {dataSources.map(source => (
              <Card key={source.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {source.icon}
                      <div>
                        <CardTitle className="text-lg">{source.name}</CardTitle>
                        <CardDescription className="text-sm">{source.description}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSourceEnabled(source.id)}
                      className={source.enabled ? 'text-green-600' : 'text-gray-400'}
                    >
                      {source.enabled ? (
                        <Play className="h-4 w-4" />
                      ) : (
                        <Pause className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getTierColor(source.tier)}>{source.tier}</Badge>
                    <Badge className={getStatusColor(source.status)}>{source.status}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {source.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Volume</p>
                      <p className="font-medium">{source.volume}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Valor</p>
                      <p className="font-medium">{source.valor}</p>
                    </div>
                  </div>

                  {source.enabled && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Taxa de Sucesso</span>
                        <span className="font-medium">{source.successRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tempo de Resposta</span>
                        <span className="font-medium">{source.responseTime}ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Registros Coletados</span>
                        <span className="font-medium">{formatNumber(source.recordsCollected)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Oportunidades</span>
                        <span className="font-medium">{formatNumber(source.opportunities)}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testSourceConnection(source.id)}
                      disabled={testingSource === source.id}
                      className="w-full"
                    >
                      {testingSource === source.id ? (
                        <>
                          <Activity className="h-4 w-4 mr-2 animate-spin" />
                          Testando...
                        </>
                      ) : (
                        <>
                          <Settings className="h-4 w-4 mr-2" />
                          Testar Conexão
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {collectionResults.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Database className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma coleta realizada ainda
                </h3>
                <p className="text-gray-600 mb-4">
                  Clique em "Iniciar Coleta" para começar a coletar dados de todas as fontes
                  habilitadas.
                </p>
                <Button onClick={startMassCollection} className="bg-blue-600 hover:bg-blue-700">
                  <Rocket className="h-4 w-4 mr-2" />
                  Iniciar Primeira Coleta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {collectionResults.map((result, index) => (
                <Card
                  key={index}
                  className={result.success ? 'border-green-200' : 'border-red-200'}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <h3 className="font-semibold">{result.sourceName}</h3>
                          <p className="text-sm text-gray-600">
                            {result.timestamp.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Tempo de Processamento</p>
                        <p className="font-medium">{result.processingTime}ms</p>
                      </div>
                    </div>

                    {result.success && (
                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Registros Encontrados</p>
                          <p className="font-medium">{formatNumber(result.recordsFound)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Valor Total</p>
                          <p className="font-medium">{formatCurrency(result.totalValue)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Oportunidades</p>
                          <p className="font-medium">{formatNumber(result.opportunities)}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Valor Total por Fonte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {collectionResults
                    .filter(r => r.success)
                    .sort((a, b) => b.totalValue - a.totalValue)
                    .map((result, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{result.sourceName}</span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(result.totalValue)}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Oportunidades por Fonte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {collectionResults
                    .filter(r => r.success)
                    .sort((a, b) => b.opportunities - a.opportunities)
                    .map((result, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{result.sourceName}</span>
                        <span className="text-sm text-gray-600">
                          {formatNumber(result.opportunities)}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoadmapDataSourcesOrchestrator;
