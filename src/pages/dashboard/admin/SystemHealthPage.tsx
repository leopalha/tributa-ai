import React, { useState, useEffect } from 'react';
import { platformMonitor } from '@/services/platform-monitor.service';
import { ariaAdmin, type AIResponse } from '@/services/aria-admin.service';
import platformHealthService from '@/services/platform-health.service';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Settings,
  Zap,
  Shield,
  TrendingUp,
  Heart,
  Server,
  Database,
  Bot,
  Wifi,
  RotateCcw,
  Play,
  Pause,
  Eye,
  AlertTriangle,
  Clock,
  MessageSquare,
  Brain,
  Bell,
  Users,
  FileText,
  DollarSign,
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: string;
  description: string;
  lastUpdate: string;
  trend: 'up' | 'down' | 'stable';
}

interface BotStatus {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  lastAction: string;
  performance: number;
  tasksCompleted: number;
  uptime: string;
}

const SystemHealthPage: React.FC = () => {
  const [platformStatus, setPlatformStatus] = useState<any>(null);
  const [components, setComponents] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoMonitoring, setAutoMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isMonitoringActive, setIsMonitoringActive] = useState(true);
  const [aiAdminPrompt, setAiAdminPrompt] = useState('');
  const [aiAdminActive, setAiAdminActive] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'system', message: 'ARIA Admin inicializada. Pronta para monitoramento automático.' },
    {
      type: 'ai',
      message:
        'Olá! Sou a ARIA Admin. Estou monitorando todos os sistemas da plataforma. Tudo funcionando perfeitamente! 🤖',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      id: 'platform-health',
      name: 'Saúde da Plataforma',
      status: 'healthy',
      value: '98.7%',
      description: 'Status geral dos sistemas',
      lastUpdate: '2 min atrás',
      trend: 'stable',
    },
    {
      id: 'database',
      name: 'Base de Dados',
      status: 'healthy',
      value: '99.2%',
      description: 'Conexões e performance do banco',
      lastUpdate: '1 min atrás',
      trend: 'up',
    },
    {
      id: 'blockchain',
      name: 'Rede Blockchain',
      status: 'healthy',
      value: '97.8%',
      description: 'Conectividade Hyperledger Fabric',
      lastUpdate: '3 min atrás',
      trend: 'stable',
    },
    {
      id: 'apis',
      name: 'APIs Externas',
      status: 'warning',
      value: '94.1%',
      description: 'Receita Federal e órgãos públicos',
      lastUpdate: '5 min atrás',
      trend: 'down',
    },
    {
      id: 'bots',
      name: 'Sistema de Bots',
      status: 'healthy',
      value: '96.5%',
      description: 'Bots de trading e análise',
      lastUpdate: '1 min atrás',
      trend: 'up',
    },
    {
      id: 'security',
      name: 'Segurança',
      status: 'healthy',
      value: '99.8%',
      description: 'Firewall e proteções ativas',
      lastUpdate: '30 seg atrás',
      trend: 'stable',
    },
  ]);

  const [botStatuses, setBotStatuses] = useState<BotStatus[]>([
    {
      id: 'trading-bot-1',
      name: 'Bot Trading Alpha',
      status: 'active',
      lastAction: 'Executou compensação bilateral - R$ 45.000',
      performance: 94.7,
      tasksCompleted: 247,
      uptime: '23h 45m',
    },
    {
      id: 'analysis-bot',
      name: 'Bot Análise IA',
      status: 'active',
      lastAction: 'Identificou 3 novos créditos ICMS',
      performance: 98.2,
      tasksCompleted: 892,
      uptime: '47h 12m',
    },
    {
      id: 'compliance-bot',
      name: 'Bot Compliance',
      status: 'idle',
      lastAction: 'Verificou obrigações fiscais - OK',
      performance: 91.3,
      tasksCompleted: 156,
      uptime: '12h 30m',
    },
    {
      id: 'notification-bot',
      name: 'Bot Notificações',
      status: 'active',
      lastAction: 'Enviou 12 alertas de prazo',
      performance: 99.1,
      tasksCompleted: 1247,
      uptime: '72h 15m',
    },
  ]);

  // Carrega dados do serviço de saúde
  const loadHealthData = async () => {
    try {
      setIsLoading(true);

      // Obtém dados do serviço
      const status = platformHealthService.getPlatformStatus();
      const componentsList = platformHealthService.getComponents();
      const integrationsList = platformHealthService.getIntegrations();
      const alertsList = platformHealthService.getAlerts(20);
      const performanceMetrics = platformHealthService.getPerformanceMetrics();

      setPlatformStatus(status);
      setComponents(componentsList);
      setIntegrations(integrationsList);
      setAlerts(alertsList);
      setMetrics(performanceMetrics);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar dados de saúde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-atualização
  useEffect(() => {
    loadHealthData();

    let interval: NodeJS.Timeout;
    if (autoMonitoring) {
      interval = setInterval(() => {
        loadHealthData();
      }, 30000); // Atualiza a cada 30 segundos
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoMonitoring]);

  // Força sincronização de todas as integrações
  const handleForceSyncAll = async () => {
    try {
      await platformHealthService.forceSyncAll();
      setTimeout(() => loadHealthData(), 2000);
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
    }
  };

  // Reinicia todos os componentes
  const handleRestartAll = async () => {
    if (confirm('Tem certeza que deseja reiniciar todos os componentes?')) {
      try {
        await platformHealthService.restartAll();
        setTimeout(() => loadHealthData(), 5000);
      } catch (error) {
        console.error('Erro ao reiniciar:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return 'text-green-500';
      case 'warning':
      case 'syncing':
        return 'text-yellow-500';
      case 'error':
      case 'disconnected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return 'bg-green-100';
      case 'warning':
      case 'syncing':
        return 'bg-yellow-100';
      case 'error':
      case 'disconnected':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
      case 'syncing':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
      case 'disconnected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSystemIcon = (type: string) => {
    switch (type) {
      case 'server':
        return <Server className="w-6 h-6" />;
      case 'database':
        return <Database className="w-6 h-6" />;
      case 'bot':
        return <Bot className="w-6 h-6" />;
      case 'service':
        return <Settings className="w-6 h-6" />;
      case 'blockchain':
        return <Shield className="w-6 h-6" />;
      default:
        return <Activity className="w-6 h-6" />;
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <Wifi className="w-5 h-5" />;
      case 'database':
        return <Database className="w-5 h-5" />;
      case 'service':
        return <Settings className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setChatMessages(prev => [...prev, { type: 'user', message: newMessage }]);

    // Simular resposta da IA
    setTimeout(() => {
      const responses = [
        'Entendido! Vou monitorar essa situação de perto.',
        'Já implementei a correção. Sistema otimizado!',
        'Detectei uma melhoria possível. Posso implementar?',
        'Todos os sistemas estão funcionando perfeitamente. Relatório gerado!',
        'Identifiquei 3 oportunidades de otimização. Quer que eu execute?',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { type: 'ai', message: randomResponse }]);
    }, 1000);

    setNewMessage('');
  };

  // Simular atualizações em tempo real
  useEffect(() => {
    if (!isMonitoringActive) return;

    const interval = setInterval(() => {
      // Atualizar métricas
      setSystemMetrics(prev =>
        prev.map(metric => ({
          ...metric,
          value: `${(parseFloat(metric.value) + (Math.random() - 0.5) * 2).toFixed(1)}%`,
          lastUpdate: 'agora',
        }))
      );

      // Atualizar bots
      setBotStatuses(prev =>
        prev.map(bot => ({
          ...bot,
          tasksCompleted: bot.tasksCompleted + Math.floor(Math.random() * 3),
          performance: Math.min(100, bot.performance + (Math.random() - 0.5) * 2),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isMonitoringActive]);

  const defaultAiPrompt = `Você é a ARIA Admin, uma IA administradora da plataforma Tributa.AI. Suas responsabilidades:

1. MONITORAMENTO CONTÍNUO:
   - Monitore todos os sistemas 24/7
   - Detecte anomalias e problemas automaticamente
   - Mantenha métricas de performance atualizadas

2. MANUTENÇÃO AUTOMÁTICA:
   - Execute correções automáticas quando possível
   - Reinicie serviços que falharem
   - Otimize performance automaticamente

3. GESTÃO DE BOTS:
   - Monitore performance de todos os bots
   - Redistribua tarefas conforme necessário
   - Ative/desative bots baseado na demanda

4. RELATÓRIOS E ALERTAS:
   - Gere relatórios automáticos
   - Envie alertas críticos imediatamente
   - Mantenha logs detalhados de todas as ações

5. COMUNICAÇÃO:
   - Responda perguntas sobre status dos sistemas
   - Explique problemas de forma clara
   - Sugira melhorias proativamente

Mantenha sempre um tom profissional mas amigável. Seja proativa em identificar e resolver problemas.`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-2 text-gray-600">Carregando sistema de saúde...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Heart
              className={`w-8 h-8 text-red-500 mr-3 ${autoMonitoring ? 'animate-pulse' : ''}`}
            />
            Sistema de Saúde da Plataforma
          </h1>
          <p className="text-gray-600 mt-1">Monitoramento completo e IA administrativa</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMonitoringActive(!isMonitoringActive)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isMonitoringActive
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isMonitoringActive ? (
              <Pause className="w-5 h-5 mr-2" />
            ) : (
              <Play className="w-5 h-5 mr-2" />
            )}
            {isMonitoringActive ? 'Pausar' : 'Iniciar'} Monitoramento
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-5 h-5 mr-2" />
            Atualizar
          </button>
        </div>
      </div>

      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Status Geral</p>
              <p className="text-2xl font-bold text-green-600">98.7%</p>
            </div>
            <Heart className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Todos os sistemas operacionais</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bots Ativos</p>
              <p className="text-2xl font-bold text-blue-600">
                {botStatuses.filter(b => b.status === 'active').length}/{botStatuses.length}
              </p>
            </div>
            <Bot className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Funcionando perfeitamente</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-purple-600">99.9%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Últimos 30 dias</p>
        </div>
      </div>

      {/* Métricas Detalhadas */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Métricas dos Sistemas</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemMetrics.map(metric => (
              <div key={metric.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{metric.name}</h3>
                  <span
                    className={`flex items-center px-2 py-1 text-xs rounded-full ${getStatusColor(metric.status)}`}
                  >
                    {getStatusIcon(metric.status)}
                    <span className="ml-1 capitalize">{metric.status}</span>
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{metric.lastUpdate}</span>
                  <span
                    className={`flex items-center ${
                      metric.trend === 'up'
                        ? 'text-green-600'
                        : metric.trend === 'down'
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status dos Bots */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Status dos Bots</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {botStatuses.map(bot => (
              <div key={bot.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Bot className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="font-medium text-gray-900">{bot.name}</h3>
                  </div>
                  <span
                    className={`flex items-center px-2 py-1 text-xs rounded-full ${getStatusColor(bot.status)}`}
                  >
                    {getStatusIcon(bot.status)}
                    <span className="ml-1 capitalize">{bot.status}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{bot.lastAction}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Performance</p>
                    <p className="font-medium">{bot.performance.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tarefas</p>
                    <p className="font-medium">{bot.tasksCompleted}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-gray-500 text-xs">Uptime: {bot.uptime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IA Administradora */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração da IA */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-600" />
                ARIA Admin - IA Administradora
              </h2>
              <button
                onClick={() => setAiAdminActive(!aiAdminActive)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  aiAdminActive
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Zap className="w-4 h-4 mr-1" />
                {aiAdminActive ? 'Ativa' : 'Inativa'}
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt de Configuração da IA
                </label>
                <textarea
                  value={aiAdminPrompt || defaultAiPrompt}
                  onChange={e => setAiAdminPrompt(e.target.value)}
                  placeholder="Configure o comportamento da IA administradora..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setAiAdminPrompt(defaultAiPrompt)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Usar Padrão
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Aplicar Configuração
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat com IA */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
              Chat com ARIA Admin
            </h2>
          </div>
          <div className="p-6">
            <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 space-y-3">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : msg.type === 'ai'
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Converse com a ARIA Admin..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPage;
