import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StandardizedPageHeader } from '@/components/ui/standardized-page-header';
import { StandardizedStatCard } from '@/components/ui/standardized-stat-card';
import {
  Bot,
  Brain,
  Sparkles,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Zap,
  FileText,
  Calculator,
  Shield,
  CheckCircle,
  Clock,
  Send,
  Mic,
  MicOff,
  Download,
  Share2,
  Bookmark,
  ThumbsUp,
  RefreshCw,
  DollarSign,
  Activity,
  PieChart,
  BarChart3,
  Users,
  Wallet,
  Building,
  CreditCard,
  Globe,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Play,
  Pause,
  Settings,
  Filter,
  Plus,
  ShoppingBag,
  LayoutDashboard,
  PiggyBank,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ARIAAgentSimpleService, {
  AIMessage,
  AIAction,
  ExecutionResult,
} from '@/services/aria-agent-simple.service';
import { useNavigate } from 'react-router-dom';
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
  Pie,
  Cell,
} from 'recharts';
import RealDataPanel from '@/components/dashboard/RealDataPanel';
// Tipos agora importados do serviço ARIA

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'risk' | 'compliance' | 'optimization';
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  potentialSavings?: number;
  potentialRisk?: number;
  recommendations: string[];
  deadline?: Date;
  category: string;
  status: 'new' | 'in_progress' | 'completed' | 'dismissed';
}

// Dados mockados realistas para dashboard executivo
const executiveData = {
  kpis: {
    volumeTotal: 125000000, // R$ 125M
    volumeMensal: 15800000, // R$ 15.8M
    transacoes: 1247,
    usuariosAtivos: 2890,
    tcsTokenizados: 156,
    economiaMedia: 0.185, // 18.5%
    crescimentoMes: 0.234, // 23.4%
    uptime: 99.97,
  },
  performance: [
    { mes: 'Jul', volume: 8500000, transacoes: 145, usuarios: 1200 },
    { mes: 'Ago', volume: 11200000, transacoes: 189, usuarios: 1580 },
    { mes: 'Set', volume: 13800000, transacoes: 234, usuarios: 1920 },
    { mes: 'Out', volume: 15800000, transacoes: 298, usuarios: 2450 },
    { mes: 'Nov', volume: 18200000, transacoes: 356, usuarios: 2890 },
    { mes: 'Dez', volume: 22100000, transacoes: 425, usuarios: 3340 },
  ],
  distribuicaoTCs: [
    { categoria: 'ICMS', valor: 45000000, count: 67, color: '#3B82F6' },
    { categoria: 'PIS/COFINS', valor: 28000000, count: 43, color: '#10B981' },
    { categoria: 'Precatórios', valor: 35000000, count: 28, color: '#F59E0B' },
    { categoria: 'IRPJ/CSLL', valor: 17000000, count: 18, color: '#EF4444' },
  ],
  alerts: [
    {
      id: 1,
      tipo: 'oportunidade',
      titulo: 'Nova oportunidade ICMS',
      descricao: 'R$ 2.3M disponível em São Paulo',
      prioridade: 'alta',
      tempo: '5 min',
    },
    {
      id: 2,
      tipo: 'sistema',
      titulo: 'Blockchain sincronizado',
      descricao: '1.247 transações confirmadas',
      prioridade: 'info',
      tempo: '10 min',
    },
    {
      id: 3,
      tipo: 'compliance',
      titulo: 'KYC pendente',
      descricao: '12 usuários aguardando verificação',
      prioridade: 'media',
      tempo: '1h',
    },
  ],
  recentActivity: [
    {
      id: 1,
      acao: 'Tokenização',
      descricao: 'TC ICMS R$ 850K tokenizado',
      usuario: 'Empresa ABC Ltda',
      tempo: '3 min',
      status: 'sucesso',
    },
    {
      id: 2,
      acao: 'Compensação',
      descricao: 'Matching automático R$ 1.2M',
      usuario: 'Sistema',
      tempo: '7 min',
      status: 'processando',
    },
    {
      id: 3,
      acao: 'Negociação',
      descricao: 'Proposta aceita R$ 680K',
      usuario: 'Investidor XYZ',
      tempo: '12 min',
      status: 'sucesso',
    },
    {
      id: 4,
      acao: 'KYC',
      descricao: 'Verificação aprovada',
      usuario: 'Escritório DEF',
      tempo: '18 min',
      status: 'sucesso',
    },
  ],
  marketData: {
    precoMedio: 0.87, // 87% do valor nominal
    liquidezIndex: 0.92,
    volatilidade: 0.045,
    volumeDiario: 2100000,
  },
};

// Componente de KPI Card
const KPICard = ({ title, value, change, icon: Icon, trend, prefix = '', suffix = '' }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium leading-none text-muted-foreground">{title}</p>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold">
          {prefix}
          {value}
          {suffix}
        </p>
        <div className="flex items-center text-sm">
          {trend === 'up' ? (
            <>
              <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
              <span className="text-green-600">+{change}%</span>
            </>
          ) : (
            <>
              <TrendingDown className="mr-1 h-4 w-4 text-red-600" />
              <span className="text-red-600">-{change}%</span>
            </>
          )}
          <span className="ml-1 text-muted-foreground">vs mês anterior</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Componente de Alerta
const AlertCard = ({ alert }) => (
  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
    <div
      className={`p-1 rounded ${
        alert.prioridade === 'alta'
          ? 'bg-red-100 text-red-600'
          : alert.prioridade === 'media'
            ? 'bg-yellow-100 text-yellow-600'
            : 'bg-blue-100 text-blue-600'
      }`}
    >
      {alert.tipo === 'oportunidade' ? (
        <Target className="h-4 w-4" />
      ) : alert.tipo === 'sistema' ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
    </div>
    <div className="flex-1 space-y-1">
      <p className="text-sm font-medium leading-none">{alert.titulo}</p>
      <p className="text-sm text-muted-foreground">{alert.descricao}</p>
      <p className="text-xs text-muted-foreground">{alert.tempo}</p>
    </div>
  </div>
);

// Componente de Atividade Recente
const ActivityItem = ({ activity }) => (
  <div className="flex items-center space-x-3 p-3">
    <div
      className={`p-2 rounded-full ${
        activity.status === 'sucesso'
          ? 'bg-green-100 text-green-600'
          : activity.status === 'processando'
            ? 'bg-yellow-100 text-yellow-600'
            : 'bg-gray-100 text-gray-600'
      }`}
    >
      {activity.acao === 'Tokenização' ? (
        <Zap className="h-4 w-4" />
      ) : activity.acao === 'Compensação' ? (
        <Target className="h-4 w-4" />
      ) : activity.acao === 'Negociação' ? (
        <DollarSign className="h-4 w-4" />
      ) : (
        <Shield className="h-4 w-4" />
      )}
    </div>
    <div className="flex-1 space-y-1">
      <p className="text-sm font-medium leading-none">{activity.descricao}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{activity.usuario}</p>
        <p className="text-xs text-muted-foreground">{activity.tempo}</p>
      </div>
    </div>
    <Badge
      variant={
        activity.status === 'sucesso'
          ? 'default'
          : activity.status === 'processando'
            ? 'secondary'
            : 'outline'
      }
    >
      {activity.status}
    </Badge>
  </div>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const ariaService = ARIAAgentSimpleService.getInstance();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        'Olá! Sou **ARIA** - seu Assistente de Recursos e Inteligência Avançada. Posso executar ações em toda a plataforma Tributa.AI para você: gestão fiscal, compensações, marketplace, blockchain e muito mais. Como posso ajudar hoje?',
      timestamp: new Date(),
      category: 'analysis',
      confidence: 100,
      actions: [],
    },
  ]);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: '1',
      title: 'Oportunidade de Recuperação de Créditos',
      description:
        'Identifiquei R$ 45.000 em créditos de ICMS não utilizados que podem ser compensados.',
      type: 'opportunity',
      impact: 'high',
      confidence: 87,
      potentialSavings: 45000,
      recommendations: [
        'Revisar apuração de ICMS dos últimos 6 meses',
        'Verificar créditos de energia elétrica',
        'Analisar créditos de matéria-prima',
      ],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      category: 'Recuperação de Créditos',
      status: 'new',
    },
    {
      id: '2',
      title: 'Risco de Não Conformidade',
      description:
        'Detectei inconsistências nas declarações de PIS/COFINS que podem gerar autuações.',
      type: 'risk',
      impact: 'critical',
      confidence: 92,
      potentialRisk: 125000,
      recommendations: [
        'Revisar base de cálculo de PIS/COFINS',
        'Verificar enquadramento do regime tributário',
        'Atualizar procedimentos de apuração',
      ],
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      category: 'Compliance',
      status: 'new',
    },
    {
      id: '3',
      title: 'Otimização de Regime Tributário',
      description:
        'Análise indica que mudança para Lucro Presumido pode reduzir carga tributária em 18%.',
      type: 'optimization',
      impact: 'high',
      confidence: 78,
      potentialSavings: 89000,
      recommendations: [
        'Simular cenários de Lucro Presumido vs Real',
        'Analisar impacto nos próximos 12 meses',
        'Consultar contador para viabilidade',
      ],
      category: 'Planejamento Tributário',
      status: 'new',
    },
  ]);

  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('agent');

  // Stats do Dashboard
  const dashboardStats = {
    totalCredits: 191000,
    totalDebits: 214000,
    tokenizedValue: 156000,
    marketplaceTransactions: 23,
    complianceRate: 87.5,
    activeTCs: 12,
    consultasIA: 47,
    precisaoIA: 94.2,
  };

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Simular carregamento inicial
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular atualização de dados
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Simular resposta da ARIA usando o serviço real
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date(),
      actions: [],
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    try {
      // Usar serviço real da ARIA
      const context = {
        userId: 'demo-user',
        empresaId: 'demo-empresa',
        currentPage: '/dashboard',
      };

      const aiResponse = await ariaService.processMessage(currentMessage, context);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: '❌ Desculpe, ocorreu um erro ao processar sua mensagem. Posso tentar novamente?',
        timestamp: new Date(),
        category: 'alert',
        confidence: 0,
        actions: [],
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Executar ação usando o serviço real da ARIA
  const executeAction = async (action: AIAction) => {
    const executionMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `🔄 Executando: ${action.title}... Aguarde um momento.`,
      timestamp: new Date(),
      category: 'action',
      confidence: 100,
      actions: [],
    };

    setMessages(prev => [...prev, executionMessage]);

    try {
      // Usar serviço real da ARIA
      const context = {
        userId: 'demo-user',
        empresaId: 'demo-empresa',
      };

      const result: ExecutionResult = await ariaService.executeAction(action, context);

      // Se for navegação, executar a navegação
      if (action.type === 'navigate' && result.success && result.data?.url) {
        navigate(result.data.url);
      }

      const completionMessage: AIMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: result.message,
        timestamp: new Date(),
        category: result.success ? 'action' : 'alert',
        confidence: 100,
        actions: [],
        metadata: result.metadata,
      };

      setMessages(prev => [...prev, completionMessage]);
    } catch (error) {
      console.error('Erro na execução da ação:', error);
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `❌ Erro ao executar ${action.title}: ${error.message}`,
        timestamp: new Date(),
        category: 'alert',
        confidence: 0,
        actions: [],
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Obter cor do insight baseado no tipo
  const getOpportunityColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'risk':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'compliance':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'optimization':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Obter ícone do opportunity
  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="h-4 w-4" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4" />;
      case 'compliance':
        return <Shield className="h-4 w-4" />;
      case 'optimization':
        return <Target className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-lg font-medium">Carregando Dashboard Executivo...</p>
          <p className="text-sm text-muted-foreground">Sincronizando dados em tempo real</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <StandardizedPageHeader
        title="Dashboard Executivo"
        description="Visão 360° do marketplace de títulos de crédito em tempo real"
        icon={<Activity />}
        actions={[
          {
            label: 'Atualizar',
            onClick: handleRefresh,
            variant: 'outline',
            icon: <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />,
          },
          {
            label: 'Marketplace',
            onClick: () => navigate('/dashboard/marketplace'),
            variant: 'outline',
            icon: <ShoppingBag className="h-4 w-4" />,
          },
          {
            label: 'Tokenizar',
            onClick: () => navigate('/dashboard/tokenizacao'),
            icon: <Zap className="h-4 w-4" />,
          },
        ]}
      />

      {/* Navegação Rápida */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Button
          variant="outline"
          className="h-20 flex-col space-y-2"
          onClick={() => navigate('/dashboard/marketplace')}
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="text-xs">Marketplace</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col space-y-2"
          onClick={() => navigate('/dashboard/recuperacao/compensacao-bilateral')}
        >
          <Target className="h-6 w-6" />
          <span className="text-xs">Compensação</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col space-y-2"
          onClick={() => navigate('/dashboard/blockchain')}
        >
          <Zap className="h-6 w-6" />
          <span className="text-xs">Blockchain</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col space-y-2"
          onClick={() => navigate('/dashboard/kyc')}
        >
          <Shield className="h-6 w-6" />
          <span className="text-xs">KYC</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col space-y-2"
          onClick={() => navigate('/dashboard/aria')}
        >
          <Brain className="h-6 w-6" />
          <span className="text-xs">ARIA AI</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col space-y-2"
          onClick={() => navigate('/dashboard/relatorios')}
        >
          <BarChart3 className="h-6 w-6" />
          <span className="text-xs">Relatórios</span>
        </Button>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Volume Total Transacionado"
          value={formatCurrency(executiveData.kpis.volumeTotal)}
          change="23.4"
          trend="up"
          icon={DollarSign}
        />
        <KPICard
          title="Usuários Ativos"
          value={formatNumber(executiveData.kpis.usuariosAtivos)}
          change="18.2"
          trend="up"
          icon={Users}
        />
        <KPICard
          title="TCs Tokenizados"
          value={formatNumber(executiveData.kpis.tcsTokenizados)}
          change="34.7"
          trend="up"
          icon={Zap}
        />
        <KPICard
          title="Economia Média"
          value={(executiveData.kpis.economiaMedia * 100).toFixed(1)}
          change="2.3"
          trend="up"
          icon={Target}
          suffix="%"
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance do Marketplace
            </CardTitle>
            <CardDescription>Volume transacionado e crescimento mensal</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={executiveData.performance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={value => `R$ ${(value / 1000000).toFixed(0)}M`} />
                <Tooltip
                  formatter={value => [formatCurrency(value), 'Volume']}
                  labelFormatter={label => `Mês: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#3B82F6"
                  fill="url(#colorVolume)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de TCs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Distribuição de Títulos de Crédito
            </CardTitle>
            <CardDescription>Por categoria e volume financeiro</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={executiveData.distribuicaoTCs}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                  label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`}
                >
                  {executiveData.distribuicaoTCs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={value => formatCurrency(value)} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {executiveData.distribuicaoTCs.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div className="text-sm">
                    <p className="font-medium">{item.categoria}</p>
                    <p className="text-muted-foreground">{formatCurrency(item.valor)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banco de Dados Real */}
      <RealDataPanel />

      {/* Alertas e Atividade */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Alertas Críticos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas e Oportunidades
            </CardTitle>
            <CardDescription>Monitoramento em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {executiveData.alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Últimas transações e eventos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {executiveData.recentActivity.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Mercado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Métricas de Mercado
          </CardTitle>
          <CardDescription>Indicadores chave do marketplace de TCs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Preço Médio</p>
              <p className="text-2xl font-bold">
                {(executiveData.marketData.precoMedio * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">do valor nominal</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Índice de Liquidez</p>
              <p className="text-2xl font-bold">
                {(executiveData.marketData.liquidezIndex * 100).toFixed(1)}%
              </p>
              <Progress value={executiveData.marketData.liquidezIndex * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Volatilidade</p>
              <p className="text-2xl font-bold">
                {(executiveData.marketData.volatilidade * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">desvio padrão 30d</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Volume Diário</p>
              <p className="text-2xl font-bold">
                {formatCurrency(executiveData.marketData.volumeDiario)}
              </p>
              <p className="text-xs text-muted-foreground">média 7 dias</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status do Sistema */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Blockchain</p>
                <p className="text-2xl font-bold text-green-600">Online</p>
                <p className="text-xs text-muted-foreground">
                  Uptime: {executiveData.kpis.uptime}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">APIs</p>
                <p className="text-2xl font-bold text-blue-600">Ativas</p>
                <p className="text-xs text-muted-foreground">Response: &lt;200ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Wallet className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Carteiras</p>
                <p className="text-2xl font-bold text-yellow-600">{formatNumber(2890)}</p>
                <p className="text-xs text-muted-foreground">Conectadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teste da ARIA */}
      <div
        style={{
          position: 'fixed',
          bottom: '200px',
          right: '24px',
          background: 'blue',
          color: 'white',
          padding: '20px',
          zIndex: 9999,
        }}
      >
        ARIA deve aparecer abaixo!
      </div>

      {/* ARIA Assistant será exibida no layout via ClientLayout */}
    </div>
  );
}
