import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target,
  Zap,
  Brain,
  Calculator,
  TrendingUp,
  TrendingDown,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Play,
  Pause,
  Settings,
  FileText,
  DollarSign,
  Users,
  Activity,
  Clock,
  ArrowRightLeft,
  ArrowDownUp,
  Lightbulb,
  Star,
  Filter,
  Search,
  Download,
  Share2,
  Eye,
  Edit,
  Trash2,
  PlusCircle,
  MinusCircle,
  BarChart3,
  PieChart,
  Building,
  MapPin,
  Calendar,
  Hash,
  Link,
  X,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
} from 'recharts';

// Tipos do sistema de compensação
interface CompensationCredit {
  id: string;
  tipo: 'ICMS' | 'PIS_COFINS' | 'IRPJ_CSLL' | 'ISS' | 'IPI' | 'IOF';
  valor: number;
  saldo: number;
  esfera: 'federal' | 'estadual' | 'municipal';
  uf?: string;
  municipio?: string;
  dataGeracao: Date;
  dataVencimento: Date;
  situacao: 'disponivel' | 'bloqueado' | 'compensado' | 'vencido';
  origem: string;
  numeroProcesso?: string;
  proprietario: {
    id: string;
    nome: string;
    documento: string;
    tipo: 'pf' | 'pj';
  };
  documentos: Array<{
    tipo: string;
    nome: string;
    verificado: boolean;
  }>;
  blockchain: {
    tokenId?: string;
    contractAddress?: string;
    verified: boolean;
  };
}

interface CompensationDebt {
  id: string;
  tipo: 'ICMS' | 'PIS_COFINS' | 'IRPJ_CSLL' | 'ISS' | 'IPI' | 'IOF';
  valor: number;
  saldo: number;
  esfera: 'federal' | 'estadual' | 'municipal';
  uf?: string;
  municipio?: string;
  dataVencimento: Date;
  multa: number;
  juros: number;
  valorTotal: number;
  situacao: 'pendente' | 'parcelado' | 'pago' | 'protestado';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  devedor: {
    id: string;
    nome: string;
    documento: string;
    tipo: 'pf' | 'pj';
  };
}

interface CompensationMatch {
  id: string;
  tipo: 'direto' | 'indireto' | 'multilateral';
  credito: CompensationCredit;
  debito: CompensationDebt;
  valorCompensacao: number;
  economia: number;
  percentualEconomia: number;
  viabilidade: number;
  prazoExecucao: number; // dias
  restricoes: string[];
  beneficios: string[];
  status: 'proposto' | 'analisando' | 'aprovado' | 'executando' | 'concluido' | 'rejeitado';
  custosOperacionais: number;
  taxasGov: number;
  liquidacao: {
    dataInicio?: Date;
    dataConclusao?: Date;
    protocoloGov?: string;
    hashBlockchain?: string;
  };
}

interface MultilateralChain {
  id: string;
  participantes: Array<{
    id: string;
    nome: string;
    papel: 'credor' | 'devedor' | 'intermediario';
    valor: number;
  }>;
  economiaTotal: number;
  valorMovimentado: number;
  etapas: Array<{
    ordem: number;
    origem: string;
    destino: string;
    valor: number;
    tipo: string;
    status: 'pendente' | 'executando' | 'concluida';
  }>;
  viabilidade: number;
  complexidade: 'baixa' | 'media' | 'alta';
  prazoExecucao: number;
  risco: number;
}

interface CompensationAnalytics {
  totalCreditos: number;
  totalDebitos: number;
  potencialCompensacao: number;
  economiaEstimada: number;
  oportunidadesEncontradas: number;
  sucessoRate: number;
  tempoMedioExecucao: number;
  distribuicaoTipos: Array<{
    tipo: string;
    creditos: number;
    debitos: number;
    compensacoes: number;
    economia: number;
  }>;
  tendenciaMensal: Array<{
    mes: string;
    compensacoes: number;
    economia: number;
    volume: number;
  }>;
}

// Dados mockados do sistema de compensação
const mockCredits: CompensationCredit[] = [
  {
    id: 'cred-001',
    tipo: 'ICMS',
    valor: 250000,
    saldo: 250000,
    esfera: 'estadual',
    uf: 'SP',
    dataGeracao: new Date('2024-01-15'),
    dataVencimento: new Date('2025-01-15'),
    situacao: 'disponivel',
    origem: 'Exportação - Crédito Acumulado',
    numeroProcesso: 'SP-2024-001234',
    proprietario: {
      id: 'emp-001',
      nome: 'Indústria ABC Ltda',
      documento: '12.345.678/0001-90',
      tipo: 'pj',
    },
    documentos: [
      { tipo: 'GIA', nome: 'gia_2024_01.pdf', verificado: true },
      { tipo: 'Declaração', nome: 'declaracao_icms.pdf', verificado: true },
    ],
    blockchain: {
      tokenId: 'TKN-ICMS-001',
      contractAddress: '0x742d35Cc6634C0532925a3b8D',
      verified: true,
    },
  },
  {
    id: 'cred-002',
    tipo: 'PIS_COFINS',
    valor: 180000,
    saldo: 180000,
    esfera: 'federal',
    dataGeracao: new Date('2024-02-10'),
    dataVencimento: new Date('2026-02-10'),
    situacao: 'disponivel',
    origem: 'Energia Elétrica - Crédito Lei 12.783/13',
    numeroProcesso: 'RFB-2024-5678',
    proprietario: {
      id: 'emp-002',
      nome: 'Comercial XYZ S.A.',
      documento: '98.765.432/0001-11',
      tipo: 'pj',
    },
    documentos: [{ tipo: 'DCTF', nome: 'dctf_2024_02.pdf', verificado: true }],
    blockchain: {
      tokenId: 'TKN-PIS-002',
      verified: true,
    },
  },
];

const mockDebts: CompensationDebt[] = [
  {
    id: 'debt-001',
    tipo: 'ICMS',
    valor: 150000,
    saldo: 150000,
    esfera: 'estadual',
    uf: 'SP',
    dataVencimento: new Date('2024-12-31'),
    multa: 15000,
    juros: 8500,
    valorTotal: 173500,
    situacao: 'pendente',
    prioridade: 'alta',
    devedor: {
      id: 'emp-003',
      nome: 'Distribuidora DEF Ltda',
      documento: '11.222.333/0001-44',
      tipo: 'pj',
    },
  },
  {
    id: 'debt-002',
    tipo: 'PIS_COFINS',
    valor: 120000,
    saldo: 120000,
    esfera: 'federal',
    dataVencimento: new Date('2025-01-15'),
    multa: 12000,
    juros: 6800,
    valorTotal: 138800,
    situacao: 'pendente',
    prioridade: 'media',
    devedor: {
      id: 'emp-004',
      nome: 'Serviços GHI S.A.',
      documento: '22.333.444/0001-55',
      tipo: 'pj',
    },
  },
];

const mockAnalytics: CompensationAnalytics = {
  totalCreditos: 890000,
  totalDebitos: 765000,
  potencialCompensacao: 650000,
  economiaEstimada: 97500,
  oportunidadesEncontradas: 23,
  sucessoRate: 0.87,
  tempoMedioExecucao: 15,
  distribuicaoTipos: [
    { tipo: 'ICMS', creditos: 450000, debitos: 380000, compensacoes: 12, economia: 45000 },
    { tipo: 'PIS/COFINS', creditos: 280000, debitos: 245000, compensacoes: 8, economia: 32000 },
    { tipo: 'IRPJ/CSLL', creditos: 160000, debitos: 140000, compensacoes: 3, economia: 20500 },
  ],
  tendenciaMensal: [
    { mes: 'Set', compensacoes: 5, economia: 45000, volume: 380000 },
    { mes: 'Out', compensacoes: 8, economia: 67000, volume: 520000 },
    { mes: 'Nov', compensacoes: 12, economia: 89000, volume: 680000 },
    { mes: 'Dez', compensacoes: 15, economia: 97500, volume: 750000 },
  ],
};

// Componente principal do sistema de compensação
export function MultilateralCompensationEngine() {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [matches, setMatches] = useState<CompensationMatch[]>([]);
  const [multilateralChains, setMultilateralChains] = useState<MultilateralChain[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<CompensationMatch | null>(null);

  // Executar análise automática de oportunidades
  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simular análise progressiva
    const steps = [
      { progress: 20, message: 'Carregando créditos disponíveis...' },
      { progress: 40, message: 'Analisando débitos pendentes...' },
      { progress: 60, message: 'Executando algoritmo de matching...' },
      { progress: 80, message: 'Calculando viabilidade econômica...' },
      { progress: 100, message: 'Análise concluída!' },
    ];

    for (const step of steps) {
      setAnalysisProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Gerar matches mockados
    const generatedMatches: CompensationMatch[] = [
      {
        id: 'match-001',
        tipo: 'direto',
        credito: mockCredits[0],
        debito: mockDebts[0],
        valorCompensacao: 150000,
        economia: 23500,
        percentualEconomia: 13.5,
        viabilidade: 0.95,
        prazoExecucao: 7,
        restricoes: ['Mesmo estado (SP)', 'Mesma categoria (ICMS)'],
        beneficios: ['Liquidação imediata', 'Economia de juros e multas', 'Regularização fiscal'],
        status: 'proposto',
        custosOperacionais: 750,
        taxasGov: 450,
        liquidacao: {},
      },
      {
        id: 'match-002',
        tipo: 'indireto',
        credito: mockCredits[1],
        debito: mockDebts[1],
        valorCompensacao: 120000,
        economia: 18800,
        percentualEconomia: 13.5,
        viabilidade: 0.82,
        prazoExecucao: 12,
        restricoes: ['Esferas diferentes', 'Conversão necessária'],
        beneficios: ['Aproveitamento de crédito federal', 'Quitação de débito'],
        status: 'proposto',
        custosOperacionais: 1200,
        taxasGov: 600,
        liquidacao: {},
      },
    ];

    setMatches(generatedMatches);
    setIsAnalyzing(false);
  };

  // Executar compensação
  const executeCompensation = async (match: CompensationMatch) => {
    // Simular execução
    const updatedMatch = {
      ...match,
      status: 'executando' as const,
      liquidacao: {
        dataInicio: new Date(),
        protocoloGov: `COMP-${Date.now()}`,
        hashBlockchain: `0x${Math.random().toString(16).substring(2, 42)}`,
      },
    };

    setMatches(prev => prev.map(m => (m.id === match.id ? updatedMatch : m)));

    // Simular tempo de execução
    setTimeout(() => {
      const completedMatch = {
        ...updatedMatch,
        status: 'concluido' as const,
        liquidacao: {
          ...updatedMatch.liquidacao,
          dataConclusao: new Date(),
        },
      };
      setMatches(prev => prev.map(m => (m.id === match.id ? completedMatch : m)));
    }, 3000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  useEffect(() => {
    // Executar análise inicial
    runAnalysis();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Compensação Multilateral Inteligente
          </h1>
          <p className="text-muted-foreground">
            Sistema avançado de matching automático entre créditos e débitos tributários
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={runAnalysis} disabled={isAnalyzing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analisando...' : 'Nova Análise'}
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Cadastrar Crédito
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Economia Potencial</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(mockAnalytics.economiaEstimada)}
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15.2% vs mês anterior
                </div>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Oportunidades</p>
                <p className="text-2xl font-bold">{mockAnalytics.oportunidadesEncontradas}</p>
                <p className="text-sm text-muted-foreground">compensações possíveis</p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold">{formatPercent(mockAnalytics.sucessoRate)}</p>
                <Progress value={mockAnalytics.sucessoRate * 100} className="h-2 mt-2" />
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prazo Médio</p>
                <p className="text-2xl font-bold">{mockAnalytics.tempoMedioExecucao}</p>
                <p className="text-sm text-muted-foreground">dias para execução</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status da Análise */}
      {isAnalyzing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
                  <div>
                    <h3 className="font-semibold">IA Analisando Oportunidades</h3>
                    <p className="text-sm text-muted-foreground">
                      Processando {mockCredits.length} créditos e {mockDebts.length} débitos
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{analysisProgress}%</Badge>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs do Sistema */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
          <TabsTrigger value="multilateral">Cadeias Multilaterais</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="execution">Execução</TabsTrigger>
        </TabsList>

        {/* Tab: Oportunidades */}
        <TabsContent value="opportunities" className="space-y-6">
          <div className="space-y-4">
            {matches.map(match => (
              <Card key={match.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={match.tipo === 'direto' ? 'default' : 'secondary'}>
                          {match.tipo === 'direto' ? 'Compensação Direta' : 'Compensação Indireta'}
                        </Badge>
                        <Badge variant="outline">
                          {match.credito.tipo} ↔ {match.debito.tipo}
                        </Badge>
                        <Badge
                          variant={
                            match.status === 'concluido'
                              ? 'default'
                              : match.status === 'executando'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {match.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        Economia de {formatCurrency(match.economia)} (
                        {match.percentualEconomia.toFixed(1)}%)
                      </CardTitle>
                      <CardDescription>
                        Compensação de {formatCurrency(match.valorCompensacao)} • Viabilidade:{' '}
                        {formatPercent(match.viabilidade)} • Prazo: {match.prazoExecucao} dias
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedMatch(match)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Detalhes
                      </Button>
                      {match.status === 'proposto' && (
                        <Button size="sm" onClick={() => executeCompensation(match)}>
                          <Play className="h-4 w-4 mr-2" />
                          Executar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Crédito */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-600">Crédito Disponível</h4>
                      <div className="text-sm space-y-1">
                        <div>Proprietário: {match.credito.proprietario.nome}</div>
                        <div>Valor: {formatCurrency(match.credito.saldo)}</div>
                        <div>Origem: {match.credito.origem}</div>
                        <div>
                          Vencimento: {match.credito.dataVencimento.toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    {/* Débito */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-600">Débito Pendente</h4>
                      <div className="text-sm space-y-1">
                        <div>Devedor: {match.debito.devedor.nome}</div>
                        <div>Valor Total: {formatCurrency(match.debito.valorTotal)}</div>
                        <div>Principal: {formatCurrency(match.debito.saldo)}</div>
                        <div>
                          Vencimento: {match.debito.dataVencimento.toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefícios */}
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Benefícios da Compensação</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.beneficios.map((beneficio, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {beneficio}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Status de Execução */}
                  {match.status === 'executando' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        <span className="text-sm font-medium">Executando compensação...</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Protocolo: {match.liquidacao.protocoloGov}
                      </p>
                    </div>
                  )}

                  {match.status === 'concluido' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Compensação concluída!
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hash: {match.liquidacao.hashBlockchain}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {matches.length === 0 && !isAnalyzing && (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma oportunidade encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    Execute uma nova análise para buscar oportunidades de compensação
                  </p>
                  <Button onClick={runAnalysis}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Executar Análise
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab: Cadeias Multilaterais */}
        <TabsContent value="multilateral" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Cadeias de Compensação Multilateral
              </CardTitle>
              <CardDescription>
                Operações complexas envolvendo múltiplos participantes para otimizar economia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">Funcionalidade em Desenvolvimento</p>
                  <p>Sistema de compensação multilateral será liberado em breve</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Gráfico de Tendência */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Compensações</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockAnalytics.tendenciaMensal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'economia' ? formatCurrency(value) : value,
                        name === 'economia' ? 'Economia' : 'Volume',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="economia"
                      stroke="#10B981"
                      fill="url(#colorEconomia)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorEconomia" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribuição por Tipo */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tipo de Tributo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.distribuicaoTipos.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.tipo}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.compensacoes} compensações
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Economia: {formatCurrency(item.economia)}</span>
                          <span>Créditos: {formatCurrency(item.creditos)}</span>
                        </div>
                        <Progress
                          value={(item.economia / mockAnalytics.economiaEstimada) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas Detalhadas */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(mockAnalytics.potencialCompensacao)}
                  </div>
                  <div className="text-sm text-muted-foreground">Potencial Total</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPercent(mockAnalytics.sucessoRate)}
                  </div>
                  <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {mockAnalytics.tempoMedioExecucao}d
                  </div>
                  <div className="text-sm text-muted-foreground">Tempo Médio</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-orange-600">
                    {mockAnalytics.oportunidadesEncontradas}
                  </div>
                  <div className="text-sm text-muted-foreground">Oportunidades</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Execução */}
        <TabsContent value="execution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Centro de Controle de Execução
              </CardTitle>
              <CardDescription>
                Monitore o status de todas as compensações em andamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matches
                  .filter(m => ['executando', 'concluido'].includes(m.status))
                  .map(match => (
                    <div key={match.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            {match.credito.tipo} → {match.debito.tipo}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(match.valorCompensacao)} • {match.status}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={match.status === 'concluido' ? 'default' : 'secondary'}>
                            {match.status}
                          </Badge>
                          {match.liquidacao.protocoloGov && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {match.liquidacao.protocoloGov}
                            </p>
                          )}
                        </div>
                      </div>

                      {match.liquidacao.hashBlockchain && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                          <span className="font-medium">Blockchain: </span>
                          <span className="font-mono">{match.liquidacao.hashBlockchain}</span>
                        </div>
                      )}
                    </div>
                  ))}

                {matches.filter(m => ['executando', 'concluido'].includes(m.status)).length ===
                  0 && (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Nenhuma compensação em execução</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detalhes da Compensação</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedMatch(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Aqui viria o conteúdo detalhado do match */}
              <div className="text-center py-8">
                <Info className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p>Detalhes completos da compensação</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default MultilateralCompensationEngine;
