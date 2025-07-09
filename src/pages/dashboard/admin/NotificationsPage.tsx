import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Filter,
  Search,
  Eye,
  Trash2,
  Settings,
  Clock,
  User,
  DollarSign,
  Bot,
  Shield,
  TrendingUp,
  FileText,
  Zap,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'system' | 'bot' | 'transaction' | 'security' | 'user';
  details?: string;
  actionRequired?: boolean;
}

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Compensação Bilateral Executada',
      message: 'Bot Trading Alpha executou compensação de R$ 45.000 com sucesso',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      priority: 'high',
      category: 'bot',
      details:
        'Processo: COMP-2024-001\nEmpresa: TechCorp LTDA\nTipo: ICMS\nValor: R$ 45.000,00\nStatus: Concluído\nTempo de execução: 2.3 segundos',
      actionRequired: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'API Receita Federal - Lentidão Detectada',
      message: 'Tempo de resposta da API aumentou para 8.5 segundos',
      timestamp: '2024-01-15T10:25:00Z',
      read: false,
      priority: 'medium',
      category: 'system',
      details:
        'Endpoint: /consulta-cpf-cnpj\nTempo médio: 8.5s (normal: 2.1s)\nTentativas: 3/3\nStatus: Degradado\nAção sugerida: Aguardar normalização ou usar cache',
      actionRequired: true,
    },
    {
      id: '3',
      type: 'info',
      title: 'Análise de Créditos Concluída',
      message: 'Bot Análise IA identificou 3 novos créditos ICMS totalizando R$ 67.200',
      timestamp: '2024-01-15T10:20:00Z',
      read: true,
      priority: 'medium',
      category: 'bot',
      details:
        'Empresa: Inovação S.A.\nCréditos encontrados: 3\nValor total: R$ 67.200,00\nTipos: ICMS (2), PIS/COFINS (1)\nConfiabilidade média: 94.7%',
      actionRequired: false,
    },
    {
      id: '4',
      type: 'error',
      title: 'Falha na Conexão Blockchain',
      message: 'Peer blockchain-peer0 não está respondendo',
      timestamp: '2024-01-15T10:15:00Z',
      read: false,
      priority: 'critical',
      category: 'system',
      details:
        'Peer: blockchain-peer0.tributa.ai\nStatus: Offline\nÚltima resposta: 10:10:00\nTentativas de reconexão: 5/5 falharam\nAção necessária: Verificar infraestrutura',
      actionRequired: true,
    },
    {
      id: '5',
      type: 'success',
      title: 'Novo Usuário Verificado',
      message: 'KYC aprovado para João Silva (TechCorp LTDA)',
      timestamp: '2024-01-15T10:10:00Z',
      read: true,
      priority: 'low',
      category: 'user',
      details:
        'Usuário: João Silva\nEmpresa: TechCorp LTDA\nCNPJ: 12.345.678/0001-90\nDocumentos: ✓ Aprovados\nNível de acesso: Padrão',
      actionRequired: false,
    },
    {
      id: '6',
      type: 'warning',
      title: 'Limite de Transações Próximo',
      message: 'Empresa Serviços Digitais ME atingiu 90% do limite mensal',
      timestamp: '2024-01-15T10:05:00Z',
      read: false,
      priority: 'medium',
      category: 'transaction',
      details:
        'Empresa: Serviços Digitais ME\nLimite atual: 90/100 transações\nPeriodo: Janeiro 2024\nRecomendação: Considerar upgrade do plano',
      actionRequired: true,
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system':
        return <Settings className="w-4 h-4" />;
      case 'bot':
        return <Bot className="w-4 h-4" />;
      case 'transaction':
        return <DollarSign className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && !notification.read) ||
      filter === notification.category ||
      filter === notification.priority;

    const matchesSearch =
      searchTerm === '' ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bell className="w-8 h-8 mr-3 text-blue-600" />
            Central de Notificações
          </h1>
          <p className="text-gray-600 mt-1">Monitoramento e comunicação em tempo real</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={markAllAsRead}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Marcar Todas como Lidas
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Settings className="w-5 h-5 mr-2" />
            Configurações
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <Bell className="w-8 h-8 text-gray-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Não Lidas</p>
              <p className="text-2xl font-bold text-blue-600">
                {notifications.filter(n => !n.read).length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Críticas</p>
              <p className="text-2xl font-bold text-red-600">
                {notifications.filter(n => n.priority === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ação Necessária</p>
              <p className="text-2xl font-bold text-orange-600">
                {notifications.filter(n => n.actionRequired).length}
              </p>
            </div>
            <Zap className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          <button
            onClick={() => {
              setFilter('all');
              setSearchTerm('');
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Limpar filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="unread">Não lidas</option>
              <option value="system">Sistema</option>
              <option value="bot">Bots</option>
              <option value="transaction">Transações</option>
              <option value="security">Segurança</option>
              <option value="user">Usuários</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar notificações..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Notificações ({filteredNotifications.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedNotification(notification)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0">{getTypeIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3
                        className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}
                      >
                        {notification.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(notification.priority)}`}
                      >
                        {notification.priority}
                      </span>
                      {notification.actionRequired && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          Ação Necessária
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(notification.timestamp)}
                      </span>
                      <span className="flex items-center">
                        {getCategoryIcon(notification.category)}
                        <span className="ml-1 capitalize">{notification.category}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {!notification.read && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Detalhes da Notificação</h2>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                {getTypeIcon(selectedNotification.type)}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedNotification.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatTime(selectedNotification.timestamp)}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{selectedNotification.message}</p>
              {selectedNotification.details && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Detalhes Técnicos:</h4>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedNotification.details}
                  </pre>
                </div>
              )}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(selectedNotification.priority)}`}
                  >
                    {selectedNotification.priority}
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    {selectedNotification.category}
                  </span>
                </div>
                <button
                  onClick={() => {
                    markAsRead(selectedNotification.id);
                    setSelectedNotification(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Marcar como Lida
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
