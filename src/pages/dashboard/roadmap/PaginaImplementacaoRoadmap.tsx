import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Rocket,
  TrendingUp,
  DollarSign,
  Target,
  Clock,
  Database,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Settings,
  Activity,
  BarChart3,
  Zap,
  Users,
  Building2,
  Gavel,
  Receipt,
  MapPin,
  FileText,
  Shield,
  Globe,
} from 'lucide-react';

// Dados do roadmap conforme especificado
const ROADMAP_DATA = {
  investimento: {
    desenvolvimento: 225000,
    infraestrutura: 420000,
    total: 645000,
  },
  projecoes: {
    receita12meses: 56400000,
    roi: 87.4,
    payback: '3-4 meses',
    valorOportunidades: 280000000000,
  },
  cronograma: {
    fase1: { prazo: 4, resultado: { empresas: 200000, valor: 45000000000, tcs: 8500 } },
    fase2: { prazo: 6, resultado: { empresas: 650000, valor: 120000000000, tcs: 22000 } },
    fase3: { prazo: 4, resultado: { empresas: 1200000, valor: 280000000000, tcs: 45000 } },
  },
};

const TIER_1_SOURCES = [
  {
    id: 'pgfn',
    name: 'PGFN - Procuradoria Fazenda Nacional',
    volume: '50.000+ devedores/mês',
    valor: 'R$ 380+ bilhões',
    status: 'IMPLEMENTADO',
    icon: <Gavel className="h-5 w-5" />,
    prioridade: 1,
    enabled: true,
    implementationCost: 0,
    expectedRevenue: 8500000,
  },
  {
    id: 'receita-federal',
    name: 'Receita Federal - Dados Empresariais',
    volume: '19M+ CNPJs ativos',
    valor: 'Base empresarial completa',
    status: 'FÁCIL',
    icon: <Receipt className="h-5 w-5" />,
    prioridade: 2,
    enabled: false,
    implementationCost: 45000,
    expectedRevenue: 12000000,
  },
  {
    id: 'sefaz-sp',
    name: 'SEFAZ-SP - Secretaria Fazenda SP',
    volume: '180.000+ devedores',
    valor: 'R$ 45+ bilhões (só SP)',
    status: 'MÉDIO',
    icon: <Building2 className="h-5 w-5" />,
    prioridade: 3,
    enabled: false,
    implementationCost: 85000,
    expectedRevenue: 6800000,
  },
  {
    id: 'cnj-precatorios',
    name: 'CNJ - Precatórios Nacionais',
    volume: '380.000+ precatórios',
    valor: 'R$ 89+ bilhões',
    status: 'FÁCIL',
    icon: <Shield className="h-5 w-5" />,
    prioridade: 4,
    enabled: false,
    implementationCost: 35000,
    expectedRevenue: 8900000,
  },
  {
    id: 'cvm-debentures',
    name: 'CVM - Debêntures e Bonds',
    volume: '2.500+ séries ativas',
    valor: 'R$ 680+ bilhões',
    status: 'FÁCIL',
    icon: <TrendingUp className="h-5 w-5" />,
    prioridade: 5,
    enabled: false,
    implementationCost: 25000,
    expectedRevenue: 15200000,
  },
];

const TIER_2_SOURCES = [
  {
    id: 'sefaz-outros',
    name: 'SEFAZ-RJ/MG/RS - Outros SEFAZs',
    volume: '200.000+ devedores',
    valor: 'R$ 60+ bilhões',
    status: 'MÉDIO',
    icon: <MapPin className="h-5 w-5" />,
    prioridade: 6,
    enabled: false,
    implementationCost: 120000,
    expectedRevenue: 7200000,
  },
  {
    id: 'tribunais-estaduais',
    name: 'Tribunais Estaduais - Execuções',
    volume: '1M+ execuções ativas',
    valor: 'R$ 200+ bilhões',
    status: 'COMPLEXO',
    icon: <FileText className="h-5 w-5" />,
    prioridade: 7,
    enabled: false,
    implementationCost: 180000,
    expectedRevenue: 18000000,
  },
];

const RoadmapImplementationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tier1Sources, setTier1Sources] = useState(TIER_1_SOURCES);
  const [tier2Sources, setTier2Sources] = useState(TIER_2_SOURCES);
  const [implementationProgress, setImplementationProgress] = useState(0);
  const [isImplementing, setIsImplementing] = useState(false);
  const [implementationPhase, setImplementationPhase] = useState('');
  const [selectedImplementationOption, setSelectedImplementationOption] = useState<
    'internal' | 'partnership' | 'acquisition' | null
  >(null);

  // Calcular estatísticas
  const totalSources = tier1Sources.length + tier2Sources.length;
  const enabledSources = [...tier1Sources, ...tier2Sources].filter(s => s.enabled).length;
  const totalImplementationCost = [...tier1Sources, ...tier2Sources]
    .filter(s => s.enabled)
    .reduce((sum, s) => sum + s.implementationCost, 0);
  const totalExpectedRevenue = [...tier1Sources, ...tier2Sources]
    .filter(s => s.enabled)
    .reduce((sum, s) => sum + s.expectedRevenue, 0);

  useEffect(() => {
    const implementedSources = [...tier1Sources, ...tier2Sources].filter(
      s => s.status === 'IMPLEMENTADO'
    ).length;
    setImplementationProgress((implementedSources / totalSources) * 100);
  }, [tier1Sources, tier2Sources]);

  const toggleSource = (sourceId: string, tier: 'tier1' | 'tier2') => {
    if (tier === 'tier1') {
      setTier1Sources(prev =>
        prev.map(source =>
          source.id === sourceId ? { ...source, enabled: !source.enabled } : source
        )
      );
    } else {
      setTier2Sources(prev =>
        prev.map(source =>
          source.id === sourceId ? { ...source, enabled: !source.enabled } : source
        )
      );
    }
  };

  const startImplementation = async (option: 'internal' | 'partnership' | 'acquisition') => {
    setSelectedImplementationOption(option);
    setIsImplementing(true);
    setImplementationProgress(0);

    const phases = [
      { name: 'Aprovação da verba', duration: 2000 },
      { name: 'Contratação da equipe', duration: 3000 },
      { name: 'Setup infraestrutura', duration: 2000 },
      { name: 'Desenvolvimento das integrações', duration: 5000 },
      { name: 'Testes e validação', duration: 3000 },
      { name: 'Deploy em produção', duration: 2000 },
    ];

    let currentProgress = 0;
    const totalPhases = phases.length;

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      setImplementationPhase(phase.name);

      await new Promise(resolve => setTimeout(resolve, phase.duration));

      currentProgress = ((i + 1) / totalPhases) * 100;
      setImplementationProgress(currentProgress);
    }

    // Marcar fontes habilitadas como implementadas
    setTier1Sources(prev =>
      prev.map(source => (source.enabled ? { ...source, status: 'IMPLEMENTADO' as const } : source))
    );
    setTier2Sources(prev =>
      prev.map(source => (source.enabled ? { ...source, status: 'IMPLEMENTADO' as const } : source))
    );

    setIsImplementing(false);
    setImplementationPhase('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
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

  const getImplementationOptionDetails = (option: string) => {
    switch (option) {
      case 'internal':
        return {
          title: 'Desenvolvimento Interno',
          cost: ROADMAP_DATA.investimento.total,
          time: '3 meses',
          team: '4 pessoas',
          control: 'Total',
          benefits: ['Sistema customizado', 'IP próprio', 'Flexibilidade total'],
        };
      case 'partnership':
        return {
          title: 'Parceria Tecnológica',
          cost: 980000,
          time: '1.5 meses',
          team: 'Externa + 1 interno',
          control: 'Parcial',
          benefits: ['Implementação mais rápida', 'Conhecimento externo', 'Riscos compartilhados'],
        };
      case 'acquisition':
        return {
          title: 'Aquisição de Solução',
          cost: 1500000,
          time: '1 mês',
          team: 'Fornecedor',
          control: 'Baixo',
          benefits: ['Implementação imediata', 'Solução testada', 'Suporte incluído'],
        };
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🚀 Roadmap de Implementação</h1>
          <p className="text-gray-600 mt-2">Sistema Completo de Fontes de Dados - Tributa.AI</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            Investimento: {formatCurrency(ROADMAP_DATA.investimento.total)}
          </Badge>
          <Badge variant="outline" className="text-sm">
            ROI: {ROADMAP_DATA.projecoes.roi}x
          </Badge>
        </div>
      </div>

      {/* Progresso da Implementação */}
      {isImplementing && (
        <Alert className="border-blue-200 bg-blue-50">
          <Rocket className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Implementando: {implementationPhase}</span>
              <span className="font-semibold">{Math.round(implementationProgress)}%</span>
            </div>
            <Progress value={implementationProgress} className="mt-2" />
          </AlertDescription>
        </Alert>
      )}

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Valor Total</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(ROADMAP_DATA.projecoes.valorOportunidades / 1000000)}M
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Fontes Ativas</p>
                <p className="text-2xl font-bold text-blue-900">
                  {enabledSources} / {totalSources}
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">ROI Estimado</p>
                <p className="text-2xl font-bold text-purple-900">{ROADMAP_DATA.projecoes.roi}x</p>
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
                <p className="text-2xl font-bold text-orange-900">
                  {ROADMAP_DATA.projecoes.payback}
                </p>
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
          <TabsTrigger value="tier1">Tier 1 - Alta Prioridade</TabsTrigger>
          <TabsTrigger value="tier2">Tier 2 - Média Prioridade</TabsTrigger>
          <TabsTrigger value="implementation">Implementação</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Resumo Executivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Objetivo:</p>
                  <p className="text-gray-600">
                    Transformar a Tributa.AI na maior plataforma de títulos de crédito do Brasil
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Resultado Esperado:</p>
                  <p className="text-gray-600">
                    1M+ empresas mapeadas, R$ 280+ bilhões em oportunidades, ROI 15x em 12 meses
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Investimento:</p>
                  <p className="text-gray-600">
                    {formatCurrency(ROADMAP_DATA.investimento.total)} (desenvolvimento +
                    infraestrutura)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Projeção Financeira
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Receita Ano 1:</span>
                  <span className="text-sm font-bold text-green-600">
                    {formatCurrency(ROADMAP_DATA.projecoes.receita12meses)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">ROI:</span>
                  <span className="text-sm font-bold text-blue-600">
                    {ROADMAP_DATA.projecoes.roi}x
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Payback:</span>
                  <span className="text-sm font-bold text-orange-600">
                    {ROADMAP_DATA.projecoes.payback}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Baseado em transaction fees de 1.5% + serviços premium
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Cronograma de Implementação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Fase 1 - Foundation (4 semanas)</h3>
                    <p className="text-sm text-gray-600">
                      {formatNumber(ROADMAP_DATA.cronograma.fase1.resultado.empresas)} empresas •
                      {formatCurrency(ROADMAP_DATA.cronograma.fase1.resultado.valor / 1000000)}M
                      oportunidades •{formatNumber(ROADMAP_DATA.cronograma.fase1.resultado.tcs)} TCs
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Fase 2 - Expansion (6 semanas)</h3>
                    <p className="text-sm text-gray-600">
                      {formatNumber(ROADMAP_DATA.cronograma.fase2.resultado.empresas)} empresas •
                      {formatCurrency(ROADMAP_DATA.cronograma.fase2.resultado.valor / 1000000)}M
                      oportunidades •{formatNumber(ROADMAP_DATA.cronograma.fase2.resultado.tcs)} TCs
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Fase 3 - Optimization (4 semanas)</h3>
                    <p className="text-sm text-gray-600">
                      {formatNumber(ROADMAP_DATA.cronograma.fase3.resultado.empresas)} empresas •
                      {formatCurrency(ROADMAP_DATA.cronograma.fase3.resultado.valor / 1000000)}M
                      oportunidades •{formatNumber(ROADMAP_DATA.cronograma.fase3.resultado.tcs)} TCs
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tier1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">🏆 Tier 1 - Alta Prioridade</CardTitle>
              <CardDescription>Implementar primeiro - máximo impacto e ROI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tier1Sources.map((source, index) => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">{source.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{source.name}</h3>
                          <Badge className={getStatusColor(source.status)}>{source.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {source.volume} • {source.valor}
                        </p>
                        <p className="text-xs text-gray-500">
                          Custo: {formatCurrency(source.implementationCost)} • Receita:{' '}
                          {formatCurrency(source.expectedRevenue)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSource(source.id, 'tier1')}
                        className={source.enabled ? 'border-green-500 text-green-600' : ''}
                      >
                        {source.enabled ? (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <Play className="h-4 w-4 mr-1" />
                        )}
                        {source.enabled ? 'Selecionado' : 'Selecionar'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tier2" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">🥈 Tier 2 - Média Prioridade</CardTitle>
              <CardDescription>Expandir depois - complementar cobertura</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tier2Sources.map((source, index) => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">{source.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{source.name}</h3>
                          <Badge className={getStatusColor(source.status)}>{source.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {source.volume} • {source.valor}
                        </p>
                        <p className="text-xs text-gray-500">
                          Custo: {formatCurrency(source.implementationCost)} • Receita:{' '}
                          {formatCurrency(source.expectedRevenue)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSource(source.id, 'tier2')}
                        className={source.enabled ? 'border-green-500 text-green-600' : ''}
                      >
                        {source.enabled ? (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <Play className="h-4 w-4 mr-1" />
                        )}
                        {source.enabled ? 'Selecionado' : 'Selecionar'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(['internal', 'partnership', 'acquisition'] as const).map(option => {
              const details = getImplementationOptionDetails(option);
              if (!details) return null;

              return (
                <Card
                  key={option}
                  className={`cursor-pointer transition-all ${
                    selectedImplementationOption === option ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{details.title}</CardTitle>
                    <CardDescription>
                      {details.time} • {details.team}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(details.cost)}
                      </p>
                      <p className="text-sm text-gray-500">Investimento total</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Benefícios:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {details.benefits.map((benefit, idx) => (
                          <li key={idx}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      onClick={() => startImplementation(option)}
                      disabled={isImplementing}
                      className="w-full"
                      variant={selectedImplementationOption === option ? 'default' : 'outline'}
                    >
                      {isImplementing && selectedImplementationOption === option ? (
                        <>
                          <Activity className="h-4 w-4 mr-2 animate-spin" />
                          Implementando...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-4 w-4 mr-2" />
                          Implementar
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {enabledSources > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Resumo da Implementação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{enabledSources}</p>
                    <p className="text-sm text-gray-600">Fontes Selecionadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalImplementationCost)}
                    </p>
                    <p className="text-sm text-gray-600">Custo Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(totalExpectedRevenue)}
                    </p>
                    <p className="text-sm text-gray-600">Receita Esperada</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoadmapImplementationPage;
