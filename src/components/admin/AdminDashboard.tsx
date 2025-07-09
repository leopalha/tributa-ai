import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SimulationCenter } from '@/components/admin/SimulationCenter';
import { BotControlPanel } from '@/components/admin/BotControlPanel';
import { adminBotOrchestratorService } from '@/services/admin-bot-orchestrator.service';
import {
  Activity,
  Users,
  TrendingUp,
  DollarSign,
  Bot,
  Settings,
  AlertTriangle,
  Shield,
  Database,
  Server,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  Lock,
  UserCheck,
  CreditCard,
  FileText,
  Bell,
  Eye,
  RefreshCw,
  Play,
  Pause,
  Square,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit,
  Search,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building,
  User,
  Target,
  Calculator
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
} from 'recharts';
import { toast } from 'sonner';

// === INTERFACES ===
interface AdminMetrics {
  usuarios: {
    total: number;
    ativos: number;
    novosHoje: number;
    verificados: number;
    pendentesKYC: number;
    suspensos: number;
    crescimentoMensal: number;
  };
  transacoes: {
    total: number;
    hoje: number;
    volume: number;
    volumeHoje: number;
    taxaSucesso: number;
    tempoMedio: number;
    crescimentoMensal: number;
  };
  plataforma: {
    uptime: number;
    latencia: number;
    erros: number;
    requests: number;
    bandwidth: number;
    storage: number;
    cpu: number;
    memoria: number;
  };
  financeiro: {
    receita: number;
    receitaHoje: number;
    lucro: number;
    lucroHoje: number;
    taxas: number;
    taxasHoje: number;
    crescimentoMensal: number;
  };
  marketplace: {
    anuncios: number;
    anunciosAtivos: number;
    categorias: number;
    vendas: number;
    compras: number;
    leiloes: number;
    propostas: number;
  };
  bots: {
    total: number;
    ativos: number;
    transacoes: number;
    volume: number;
    lucro: number;
    eficiencia: number;
  };
  kyc: {
    pendentes: number;
    aprovados: number;
    rejeitados: number;
    revisao: number;
    tempoMedio: number;
    taxaAprovacao: number;
  };
  compliance: {
    alertas: number;
    investigacoes: number;
    bloqueios: number;
    reportes: number;
    score: number;
  };
}

interface SystemAlert {
  id: string;
  tipo: 'critico' | 'aviso' | 'info';
  titulo: string;
  descricao: string;
  timestamp: Date;
  resolvido: boolean;
  acao?: string;
}

interface UserActivity {
  id: string;
  usuario: string;
  acao: string;
  timestamp: Date;
  ip: string;
  dispositivo: string;
  localizacao: string;
  sucesso: boolean;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [botSystemStatus, setBotSystemStatus] = useState(adminBotOrchestratorService.getBotsStatus());

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(() => {
      loadDashboardData();
      setBotSystemStatus(adminBotOrchestratorService.getBotsStatus());
    }, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);

      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMetrics(generateMockMetrics());
      setAlerts(generateMockAlerts());
      setActivities(generateMockActivities());
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateMockMetrics = (): AdminMetrics => ({
    usuarios: {
      total: 15420,
      ativos: 12850,
      novosHoje: 45,
      verificados: 14200,
      pendentesKYC: 320,
      suspensos: 15,
      crescimentoMensal: 12.5,
    },
    transacoes: {
      total: 89650,
      hoje: 245,
      volume: 450000000,
      volumeHoje: 2850000,
      taxaSucesso: 98.5,
      tempoMedio: 1.2,
      crescimentoMensal: 18.3,
    },
    plataforma: {
      uptime: 99.97,
      latencia: 120,
      erros: 3,
      requests: 1250000,
      bandwidth: 85.2,
      storage: 67.8,
      cpu: 45.2,
      memoria: 62.1,
    },
    financeiro: {
      receita: 12500000,
      receitaHoje: 85000,
      lucro: 8200000,
      lucroHoje: 55000,
      taxas: 2850000,
      taxasHoje: 18500,
      crescimentoMensal: 15.2,
    },
    marketplace: {
      anuncios: 5420,
      anunciosAtivos: 4850,
      categorias: 12,
      vendas: 2150,
      compras: 1980,
      leiloes: 320,
      propostas: 1250,
    },
    bots: {
      total: 20,
      ativos: 18,
      transacoes: 1250,
      volume: 25000000,
      lucro: 1850000,
      eficiencia: 94.5,
    },
    kyc: {
      pendentes: 45,
      aprovados: 1250,
      rejeitados: 25,
      revisao: 8,
      tempoMedio: 2.5,
      taxaAprovacao: 96.2,
    },
    compliance: {
      alertas: 12,
      investigacoes: 3,
      bloqueios: 1,
      reportes: 5,
      score: 95.8,
    },
  });

  const generateMockAlerts = (): SystemAlert[] => [
    {
      id: '1',
      tipo: 'critico',
      titulo: 'Alto volume de transações',
      descricao: 'Volume de transações 200% acima da média horária',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      resolvido: false,
      acao: 'Verificar capacidade do sistema',
    },
    {
      id: '2',
      tipo: 'aviso',
      titulo: 'KYC pendente crítico',
      descricao: '45 verificações KYC pendentes há mais de 48h',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolvido: false,
      acao: 'Revisar processos pendentes',
    },
    {
      id: '3',
      tipo: 'info',
      titulo: 'Backup concluído',
      descricao: 'Backup automático dos dados concluído com sucesso',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      resolvido: true,
    },
  ];

  const generateMockActivities = (): UserActivity[] => [
    {
      id: '1',
      usuario: 'admin@tributa.ai',
      acao: 'Login administrativo',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      ip: '192.168.1.100',
      dispositivo: 'Chrome/Windows',
      localizacao: 'São Paulo, SP',
      sucesso: true,
    },
    {
      id: '2',
      usuario: 'carlos.silva@empresa.com',
      acao: 'Transação de R$ 500.000',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      ip: '192.168.1.101',
      dispositivo: 'Safari/MacOS',
      localizacao: 'Rio de Janeiro, RJ',
      sucesso: true,
    },
    {
      id: '3',
      usuario: 'bot-sistema-01',
      acao: 'Execução automática',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      ip: '127.0.0.1',
      dispositivo: 'Sistema',
      localizacao: 'Servidor',
      sucesso: true,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getAlertColor = (tipo: SystemAlert['tipo']) => {
    switch (tipo) {
      case 'critico':
        return 'destructive';
      case 'aviso':
        return 'default';
      case 'info':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getAlertIcon = (tipo: SystemAlert['tipo']) => {
    switch (tipo) {
      case 'critico':
        return AlertTriangle;
      case 'aviso':
        return Bell;
      case 'info':
        return Eye;
      default:
        return Bell;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Erro ao carregar dados</p>
          <Button onClick={loadDashboardData} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
          <p className="text-gray-500">Gerencie todos os aspectos da plataforma</p>
        </div>
          <Button variant="outline" size="sm" onClick={loadDashboardData} disabled={refreshing}>
          {refreshing ? <Spinner className="h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Atualizar Dados
          </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-7 lg:grid-cols-7">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="bots">Bots Admin</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="financials">Financeiro</TabsTrigger>
          <TabsTrigger value="simulations">Simulações</TabsTrigger>
          <TabsTrigger value="marketplace-bots">Bots Trading</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Transações */}
            <Card>
              <CardHeader>
                <CardTitle>Volume de Transações (7 dias)</CardTitle>
                <CardDescription>Evolução do volume diário</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart
                    data={[
                      { dia: 'Seg', volume: 2500000 },
                      { dia: 'Ter', volume: 3200000 },
                      { dia: 'Qua', volume: 2800000 },
                      { dia: 'Qui', volume: 3800000 },
                      { dia: 'Sex', volume: 4200000 },
                      { dia: 'Sab', volume: 1800000 },
                      { dia: 'Dom', volume: 1200000 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip formatter={value => formatCurrency(value as number)} />
                    <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribuição por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>Marketplace por tipo de título</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'ICMS', value: 35, color: '#3b82f6' },
                        { name: 'Precatórios', value: 25, color: '#ef4444' },
                        { name: 'PIS/COFINS', value: 20, color: '#10b981' },
                        { name: 'IRPJ/CSLL', value: 15, color: '#f59e0b' },
                        { name: 'Outros', value: 5, color: '#6b7280' },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'ICMS', value: 35, color: '#3b82f6' },
                        { name: 'Precatórios', value: 25, color: '#ef4444' },
                        { name: 'PIS/COFINS', value: 20, color: '#10b981' },
                        { name: 'IRPJ/CSLL', value: 15, color: '#f59e0b' },
                        { name: 'Outros', value: 5, color: '#6b7280' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Métricas Detalhadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Receita Total</span>
                  <span className="font-semibold">
                    {formatCurrency(metrics.financeiro.receita)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Receita Hoje</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(metrics.financeiro.receitaHoje)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lucro Total</span>
                  <span className="font-semibold">{formatCurrency(metrics.financeiro.lucro)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxas Hoje</span>
                  <span className="font-semibold">
                    {formatCurrency(metrics.financeiro.taxasHoje)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marketplace</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Anúncios Totais</span>
                  <span className="font-semibold">
                    {formatNumber(metrics.marketplace.anuncios)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Anúncios Ativos</span>
                  <span className="font-semibold text-green-600">
                    {formatNumber(metrics.marketplace.anunciosAtivos)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vendas</span>
                  <span className="font-semibold">{formatNumber(metrics.marketplace.vendas)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Leilões Ativos</span>
                  <span className="font-semibold text-blue-600">
                    {formatNumber(metrics.marketplace.leiloes)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CPU</span>
                    <span className="font-semibold">{metrics.plataforma.cpu}%</span>
                  </div>
                  <Progress value={metrics.plataforma.cpu} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Memória</span>
                    <span className="font-semibold">{metrics.plataforma.memoria}%</span>
                  </div>
                  <Progress value={metrics.plataforma.memoria} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Storage</span>
                    <span className="font-semibold">{metrics.plataforma.storage}%</span>
                  </div>
                  <Progress value={metrics.plataforma.storage} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Requests</span>
                  <span className="font-semibold">{formatNumber(metrics.plataforma.requests)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Usuários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(metrics.usuarios.total)}
                    </div>
                    <div className="text-sm text-blue-600">Total</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(metrics.usuarios.ativos)}
                    </div>
                    <div className="text-sm text-green-600">Ativos</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatNumber(metrics.usuarios.pendentesKYC)}
                    </div>
                    <div className="text-sm text-yellow-600">Pendente KYC</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {formatNumber(metrics.usuarios.suspensos)}
                    </div>
                    <div className="text-sm text-red-600">Suspensos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>KYC Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pendentes</span>
                  <Badge variant="outline">{metrics.kyc.pendentes}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Aprovados</span>
                  <Badge variant="secondary">{metrics.kyc.aprovados}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rejeitados</span>
                  <Badge variant="destructive">{metrics.kyc.rejeitados}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Em Revisão</span>
                  <Badge variant="default">{metrics.kyc.revisao}</Badge>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taxa de Aprovação</span>
                    <span className="font-semibold text-green-600">
                      {metrics.kyc.taxaAprovacao}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tempo Médio</span>
                    <span className="font-semibold">{metrics.kyc.tempoMedio}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <div className="space-y-6">
            {/* Admin Bot Control Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  Sistema de Bots Administrativos
                  <Badge variant={botSystemStatus.isRunning ? "default" : "secondary"}>
                    {botSystemStatus.isRunning ? "ATIVO" : "PARADO"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Bots exclusivos para simulação e geração de métricas da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {botSystemStatus.bots.filter(b => b.isActive).length}/{botSystemStatus.bots.length}
                    </div>
                    <div className="text-sm text-blue-600">Bots Ativos</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {botSystemStatus.metrics.totalOperations}
                    </div>
                    <div className="text-sm text-green-600">Operações Total</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(botSystemStatus.metrics.volumeGenerated)}
                    </div>
                    <div className="text-sm text-purple-600">Volume Gerado</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {botSystemStatus.metrics.totalOperations > 0 ? 
                        ((botSystemStatus.metrics.successfulOperations / botSystemStatus.metrics.totalOperations) * 100).toFixed(1)
                        : 0}%
                    </div>
                    <div className="text-sm text-yellow-600">Taxa Sucesso</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button
                    onClick={() => {
                      const result = adminBotOrchestratorService.startAllBots();
                      setBotSystemStatus(adminBotOrchestratorService.getBotsStatus());
                      toast(result.success ? 'success' : 'error', result.message);
                    }}
                    disabled={botSystemStatus.isRunning}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar Sistema de Bots
                  </Button>
                  <Button
                    onClick={() => {
                      const result = adminBotOrchestratorService.stopAllBots();
                      setBotSystemStatus(adminBotOrchestratorService.getBotsStatus());
                      toast(result.success ? 'success' : 'error', result.message);
                    }}
                    disabled={!botSystemStatus.isRunning}
                    variant="destructive"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Parar Sistema de Bots
                  </Button>
                  <Button
                    onClick={() => setBotSystemStatus(adminBotOrchestratorService.getBotsStatus())}
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar Status
                  </Button>
                </div>

                {/* Últimas Operações */}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Últimas Operações dos Bots</h4>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {botSystemStatus.recentOperations.slice(0, 10).map(operation => (
                        <div 
                          key={operation.id} 
                          className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              operation.success ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <span className="font-medium">{operation.botName}</span>
                            <Badge variant="outline" className="text-xs">
                              {operation.operation}
                            </Badge>
                          </div>
                          <div className="text-gray-500">
                            {operation.startTime.toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>

            {/* Performance por Bot */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Individual dos Bots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {botSystemStatus.bots.map(bot => (
                    <div key={bot.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{bot.name}</h5>
                        <Badge variant={bot.isActive ? "default" : "secondary"}>
                          {bot.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{bot.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Operações:</span>
                          <span className="font-medium ml-1">{bot.totalOperations}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Sucesso:</span>
                          <span className="font-medium ml-1">{(bot.successRate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Última operação:</span>
                          <span className="font-medium ml-1">
                            {bot.lastOperation ? bot.lastOperation.toLocaleString() : 'Nunca'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketplace-bots" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bots Trading (Usuários)</CardTitle>
                <CardDescription>Sistema de bots para usuários do marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.bots.ativos}/{metrics.bots.total}
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>{metrics.bots.eficiencia}% eficiência</span>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {formatCurrency(metrics.bots.volume)} volume • {formatNumber(metrics.bots.transacoes)}{' '}
                  transações
                </div>
                <div className="mt-4">
                  <BotControlPanel />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status Geral</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Activity className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="font-semibold">{metrics.plataforma.uptime}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Latência</span>
                  <span className="font-semibold">{metrics.plataforma.latencia}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Erros (24h)</span>
                  <span className="font-semibold text-red-600">{metrics.plataforma.erros}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recursos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CPU</span>
                    <span className="font-semibold">{metrics.plataforma.cpu}%</span>
                  </div>
                  <Progress value={metrics.plataforma.cpu} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Memória</span>
                    <span className="font-semibold">{metrics.plataforma.memoria}%</span>
                  </div>
                  <Progress value={metrics.plataforma.memoria} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Storage</span>
                    <span className="font-semibold">{metrics.plataforma.storage}%</span>
                  </div>
                  <Progress value={metrics.plataforma.storage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bandwidth</span>
                    <span className="font-semibold">{metrics.plataforma.bandwidth}%</span>
                  </div>
                  <Progress value={metrics.plataforma.bandwidth} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financials" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Receita Total</span>
                  <span className="font-semibold">
                    {formatCurrency(metrics.financeiro.receita)}
                  </span>
                  </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Receita Hoje</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(metrics.financeiro.receitaHoje)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lucro Total</span>
                  <span className="font-semibold">{formatCurrency(metrics.financeiro.lucro)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxas Hoje</span>
                  <span className="font-semibold">
                    {formatCurrency(metrics.financeiro.taxasHoje)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marketplace</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Anúncios Totais</span>
                  <span className="font-semibold">
                    {formatNumber(metrics.marketplace.anuncios)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Anúncios Ativos</span>
                  <span className="font-semibold text-green-600">
                    {formatNumber(metrics.marketplace.anunciosAtivos)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vendas</span>
                  <span className="font-semibold">{formatNumber(metrics.marketplace.vendas)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Leilões Ativos</span>
                  <span className="font-semibold text-blue-600">
                    {formatNumber(metrics.marketplace.leiloes)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simulations" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Centro de Simulações
                </CardTitle>
                <CardDescription>
                  Simule diferentes cenários de crescimento e monetização para a plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimulationCenter 
                  currentStats={{
                    totalUsers: metrics?.usuarios.total || 15000,
                    totalTransactions: metrics?.transacoes.total || 80000,
                    revenue: metrics?.financeiro.receita || 10000000,
                    totalVolume: metrics?.transacoes.volume || 400000000
                  }}
                  onRunSimulation={(results) => {
                    toast.success("Simulação concluída com sucesso!");
                  }}
                />
                    </CardContent>
                  </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas ações na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {activities.map(activity => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.sucesso ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <div>
                      <div className="font-medium text-sm">{activity.usuario}</div>
                      <div className="text-xs text-gray-600">{activity.acao}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {activity.timestamp.toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-gray-400">{activity.localizacao}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Spinner para indicar carregamento
function Spinner({ className }: { className?: string }) {
  return <RefreshCw className={`animate-spin ${className}`} />;
}
