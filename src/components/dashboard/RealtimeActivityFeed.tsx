import React, { useState, useEffect } from 'react';
import {
  Activity,
  Bot,
  TrendingUp,
  ArrowRightLeft,
  FileText,
  ShoppingCart,
  Coins,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  ExternalLink,
  Play,
  Pause,
  BarChart3,
  Zap,
} from 'lucide-react';

interface BotActivity {
  id: string;
  botName: string;
  action: string;
  description: string;
  timestamp: Date;
  type: 'trade' | 'analysis' | 'compensation' | 'fiscal' | 'marketplace' | 'tokenization';
  status: 'processing' | 'completed' | 'error';
  metadata: {
    amount?: number;
    documentId?: string;
    transactionId?: string;
    targetUrl?: string;
    progress?: number;
  };
}

interface BotStatus {
  name: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  lastActivity: Date;
  totalActions: number;
  successRate: number;
  currentTask?: string;
}

const RealtimeActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<BotActivity[]>([]);
  const [botStatuses, setBotStatuses] = useState<BotStatus[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [statistics, setStatistics] = useState({
    totalActivities: 0,
    completedActivities: 0,
    errorActivities: 0,
    processingActivities: 0,
    activeBots: 6,
    totalBots: 6,
    averageSuccessRate: 97.3,
    successRate: 95.8,
  });

  useEffect(() => {
    // Simula dados iniciais
    const mockActivities: BotActivity[] = [
      {
        id: '1',
        botName: 'TradeMaster',
        action: 'Executou transação de compra',
        description: 'Compra de TC-SP-001 por R$ 45.000 realizada com sucesso',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        type: 'trade',
        status: 'completed',
        metadata: {
          amount: 45000,
          transactionId: 'TXN-2024-001',
          targetUrl: '/dashboard/trading-pro',
        },
      },
      {
        id: '2',
        botName: 'AnalyzerPro',
        action: 'Analisando documentos fiscais',
        description: 'Processando 1.247 documentos fiscais',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'analysis',
        status: 'processing',
        metadata: {
          amount: 85000,
          documentId: 'DOC-2024-002',
          targetUrl: '/dashboard/recuperacao',
          progress: 65,
        },
      },
      {
        id: '3',
        botName: 'CompensaBot',
        action: 'Compensação multilateral processada',
        description: 'Compensação de R$ 120.000 executada automaticamente',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        type: 'compensation',
        status: 'completed',
        metadata: {
          amount: 120000,
          transactionId: 'COMP-2024-003',
          targetUrl: '/dashboard/recuperacao/compensacao-multilateral',
        },
      },
    ];

    const mockBotStatuses: BotStatus[] = [
      {
        name: 'TradeMaster',
        status: 'active',
        lastActivity: new Date(),
        totalActions: 247,
        successRate: 98.2,
        currentTask: 'Monitorando mercado',
      },
      {
        name: 'AnalyzerPro',
        status: 'processing',
        lastActivity: new Date(Date.now() - 2 * 60 * 1000),
        totalActions: 156,
        successRate: 96.8,
        currentTask: 'Analisando documentos fiscais',
      },
      {
        name: 'CompensaBot',
        status: 'active',
        lastActivity: new Date(Date.now() - 5 * 60 * 1000),
        totalActions: 89,
        successRate: 99.1,
        currentTask: 'Aguardando próxima compensação',
      },
      {
        name: 'FiscalAI',
        status: 'active',
        lastActivity: new Date(Date.now() - 3 * 60 * 1000),
        totalActions: 203,
        successRate: 97.5,
        currentTask: 'Validando obrigações fiscais',
      },
      {
        name: 'MarketBot',
        status: 'active',
        lastActivity: new Date(Date.now() - 1 * 60 * 1000),
        totalActions: 134,
        successRate: 95.2,
        currentTask: 'Analisando propostas',
      },
      {
        name: 'TokenizerAI',
        status: 'active',
        lastActivity: new Date(Date.now() - 7 * 60 * 1000),
        totalActions: 78,
        successRate: 98.7,
        currentTask: 'Registrando tokens na blockchain',
      },
    ];

    setActivities(mockActivities);
    setBotStatuses(mockBotStatuses);

    // Simula novas atividades a cada 10 segundos
    const interval = setInterval(() => {
      if (isMonitoring) {
        generateNewActivity();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const generateNewActivity = () => {
    const bots = [
      'TradeMaster',
      'AnalyzerPro',
      'CompensaBot',
      'FiscalAI',
      'MarketBot',
      'TokenizerAI',
    ];
    const actions = [
      'Executou nova transação',
      'Identificou oportunidade',
      'Processou documentos',
      'Completou análise',
      'Enviou relatório',
      'Atualizou status',
    ];

    const newActivity: BotActivity = {
      id: Date.now().toString(),
      botName: bots[Math.floor(Math.random() * bots.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      description: `Processamento automático realizado com sucesso`,
      timestamp: new Date(),
      type: 'trade',
      status: 'completed',
      metadata: {
        amount: Math.floor(Math.random() * 100000) + 10000,
        transactionId: `TXN-${Date.now()}`,
        targetUrl: '/dashboard/trading-pro',
      },
    };

    setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    setStatistics(prev => ({
      ...prev,
      totalActivities: prev.totalActivities + 1,
      completedActivities: prev.completedActivities + 1,
    }));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'trade':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'analysis':
        return <BarChart3 className="w-4 h-4 text-blue-500" />;
      case 'compensation':
        return <ArrowRightLeft className="w-4 h-4 text-purple-500" />;
      case 'fiscal':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'marketplace':
        return <ShoppingCart className="w-4 h-4 text-pink-500" />;
      case 'tokenization':
        return <Coins className="w-4 h-4 text-indigo-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBotStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'idle':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s atrás`;
    if (minutes < 60) return `${minutes}min atrás`;
    return `${hours}h atrás`;
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return '';
    return `R$ ${amount.toLocaleString('pt-BR')}`;
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Atividade em Tempo Real</h2>
          <div
            className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
          ></div>
        </div>
        <button
          onClick={toggleMonitoring}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
            isMonitoring
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isMonitoring ? 'Pausar' : 'Retomar'}</span>
        </button>
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bots Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {statistics.activeBots}/{statistics.totalBots}
              </p>
            </div>
            <Bot className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Atividades Hoje</p>
              <p className="text-2xl font-bold text-blue-600">{statistics.totalActivities}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-green-600">
                {statistics.averageSuccessRate.toFixed(1)}%
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processando</p>
              <p className="text-2xl font-bold text-orange-600">
                {statistics.processingActivities}
              </p>
            </div>
            <Loader className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status dos Bots */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Bot className="w-5 h-5 mr-2 text-blue-600" />
              Status dos Bots
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {botStatuses.map(bot => (
              <div
                key={bot.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      bot.status === 'active'
                        ? 'bg-green-500'
                        : bot.status === 'processing'
                          ? 'bg-blue-500 animate-pulse'
                          : bot.status === 'error'
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900">{bot.name}</p>
                    <p className="text-sm text-gray-600">
                      {bot.currentTask || 'Aguardando próxima tarefa'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getBotStatusColor(bot.status)}`}
                  >
                    {bot.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {bot.successRate.toFixed(1)}% sucesso
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feed de Atividades */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              Atividades Recentes
            </h3>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhuma atividade recente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.botName}</p>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(activity.status)}
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          {activity.metadata.amount && (
                            <span className="text-xs font-medium text-green-600">
                              {formatAmount(activity.metadata.amount)}
                            </span>
                          )}
                          {activity.metadata.progress && (
                            <div className="w-16 bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${activity.metadata.progress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                        {activity.metadata.targetUrl && (
                          <a
                            href={activity.metadata.targetUrl}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            Ver
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeActivityFeed;
