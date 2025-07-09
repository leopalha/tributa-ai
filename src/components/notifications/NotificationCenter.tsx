import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Check,
  AlertTriangle,
  Info,
  TrendingUp,
  Bot,
  DollarSign,
  FileText,
  ShoppingCart,
  Zap,
  ExternalLink,
  Clock,
  Filter,
  Trash2,
  Eye,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'bot_action' | 'transaction' | 'system' | 'alert' | 'marketplace' | 'fiscal';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    amount?: number;
    botName?: string;
    transactionId?: string;
    documentId?: string;
    userId?: string;
    protocolo?: string;
    prazoEstimado?: string;
    documentosPendentes?: string[];
    prazoProcessamento?: number;
  };
}

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'bots' | 'transactions'>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  // Simula notificações em tempo real
  useEffect(() => {
    // Carrega notificações iniciais
    loadInitialNotifications();

    // Simula notificações em tempo real dos bots
    const interval = setInterval(() => {
      generateRealtimeNotification();
    }, 5000); // Nova notificação a cada 5 segundos

    // Listener para notificações da Receita Federal
    const handleNotificacaoRF = (event: CustomEvent) => {
      const novaNotificacao = event.detail;
      setNotifications(prev => [novaNotificacao, ...prev.slice(0, 49)]);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('nova-notificacao-rf', handleNotificacaoRF as EventListener);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('nova-notificacao-rf', handleNotificacaoRF as EventListener);
      }
    };
  }, []);

  // Atualiza contador de não lidas
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const loadInitialNotifications = () => {
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'bot_action',
        title: 'Bot TradeMaster executou transação',
        message: 'Compra de TC-SP-001 por R$ 45.000 realizada com sucesso',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        read: false,
        priority: 'high',
        actionUrl: '/dashboard/trading-pro',
        actionLabel: 'Ver Transação',
        metadata: {
          amount: 45000,
          botName: 'TradeMaster',
          transactionId: 'TXN-2024-001',
        },
      },
      {
        id: '2',
        type: 'marketplace',
        title: 'Nova proposta recebida',
        message: 'Empresa XYZ fez uma oferta de R$ 120.000 para seu TC-RJ-005',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        priority: 'medium',
        actionUrl: '/dashboard/marketplace/propostas',
        actionLabel: 'Ver Proposta',
        metadata: {
          amount: 120000,
          userId: 'empresa-xyz',
        },
      },
      {
        id: '3',
        type: 'fiscal',
        title: 'Declaração processada',
        message: 'DCTF-Web de Janeiro/2024 foi enviada com sucesso',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        read: true,
        priority: 'medium',
        actionUrl: '/dashboard/declaracoes',
        actionLabel: 'Ver Declaração',
        metadata: {
          documentId: 'DCTF-2024-01',
        },
      },
      {
        id: '4',
        type: 'bot_action',
        title: 'Bot AnalyzerPro identificou oportunidade',
        message: 'Encontrado crédito de ICMS de R$ 85.000 para recuperação',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: true,
        priority: 'high',
        actionUrl: '/dashboard/recuperacao/compensacao-bilateral',
        actionLabel: 'Ver Oportunidade',
        metadata: {
          amount: 85000,
          botName: 'AnalyzerPro',
        },
      },
      {
        id: '5',
        type: 'system',
        title: 'Tokenização concluída',
        message: 'TC-MG-003 foi tokenizado com sucesso na blockchain',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        read: true,
        priority: 'medium',
        actionUrl: '/dashboard/tokenizacao',
        actionLabel: 'Ver Token',
        metadata: {
          transactionId: 'TOKEN-2024-003',
        },
      },
      {
        id: '6',
        type: 'fiscal',
        title: '🏛️ Receita Federal - Compensação Processada',
        message: 'Protocolo RF-45123890 - Compensação de R$ 125.000 aprovada e homologada',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        read: false,
        priority: 'high',
        actionUrl: '/dashboard/recuperacao/processos',
        actionLabel: 'Ver Comprovante',
        metadata: {
          amount: 125000,
          protocolo: 'RF-45123890',
          documentId: 'COMP-RF-45123890',
        },
      },
      {
        id: '7',
        type: 'fiscal',
        title: '📋 Receita Federal - Análise Documental',
        message: 'Protocolo RF-45123855 - Documentos em análise pela equipe técnica da RFB',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: false,
        priority: 'medium',
        actionUrl: '/dashboard/recuperacao/processos',
        actionLabel: 'Acompanhar Status',
        metadata: {
          protocolo: 'RF-45123855',
          prazoEstimado: '7 dias úteis',
        },
      },
      {
        id: '8',
        type: 'fiscal',
        title: '⚠️ Receita Federal - Documentos Adicionais',
        message: 'Protocolo RF-45123830 - Necessário envio de Balancete Analítico e Livro Razão',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: false,
        priority: 'high',
        actionUrl: '/dashboard/recuperacao/processos',
        actionLabel: 'Enviar Documentos',
        metadata: {
          protocolo: 'RF-45123830',
          documentosPendentes: ['Balancete Analítico', 'Livro Razão'],
        },
      },
    ];

    setNotifications(initialNotifications);
  };

  const generateRealtimeNotification = () => {
    const botNames = ['TradeMaster', 'AnalyzerPro', 'CompensaBot', 'FiscalAI', 'MarketBot'];
    const actions = [
      {
        type: 'bot_action' as const,
        titles: [
          'Bot {bot} executou compra',
          'Bot {bot} vendeu título',
          'Bot {bot} identificou oportunidade',
          'Bot {bot} completou análise',
        ],
        messages: [
          'Transação de R$ {amount} executada automaticamente',
          'Título vendido por R$ {amount} com lucro de 15%',
          'Oportunidade de compensação de R$ {amount} identificada',
          'Análise fiscal completada, {amount} em créditos encontrados',
        ],
      },
      {
        type: 'transaction' as const,
        titles: ['Transação blockchain confirmada', 'Pagamento recebido', 'Token transferido'],
        messages: [
          'Transação {txn} confirmada na rede',
          'Pagamento de R$ {amount} creditado',
          'Token TC-{state}-{num} transferido com sucesso',
        ],
      },
      {
        type: 'marketplace' as const,
        titles: ['Nova proposta recebida', 'Leilão finalizado', 'Título vendido'],
        messages: [
          'Oferta de R$ {amount} para seu título',
          'Leilão finalizado com lance vencedor de R$ {amount}',
          'Seu título foi vendido por R$ {amount}',
        ],
      },
    ];

    const actionType = actions[Math.floor(Math.random() * actions.length)];
    const botName = botNames[Math.floor(Math.random() * botNames.length)];
    const amount = Math.floor(Math.random() * 500000) + 10000;
    const state = ['SP', 'RJ', 'MG', 'RS', 'PR'][Math.floor(Math.random() * 5)];
    const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');

    const title = actionType.titles[Math.floor(Math.random() * actionType.titles.length)].replace(
      '{bot}',
      botName
    );

    const message = actionType.messages[Math.floor(Math.random() * actionType.messages.length)]
      .replace('{amount}', amount.toLocaleString('pt-BR'))
      .replace('{bot}', botName)
      .replace('{txn}', `TXN-${Date.now()}`)
      .replace('{state}', state)
      .replace('{num}', num);

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: actionType.type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      priority: Math.random() > 0.7 ? 'high' : 'medium',
      actionUrl: getActionUrl(actionType.type),
      actionLabel: getActionLabel(actionType.type),
      metadata: {
        amount,
        botName,
        transactionId: `TXN-${Date.now()}`,
        documentId: `DOC-${Date.now()}`,
      },
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Mantém apenas 50 notificações
  };

  const getActionUrl = (type: string) => {
    switch (type) {
      case 'bot_action':
        return '/dashboard/admin/bots';
      case 'transaction':
        return '/dashboard/trading-pro';
      case 'marketplace':
        return '/dashboard/marketplace';
      case 'fiscal':
        return '/dashboard/declaracoes';
      default:
        return '/dashboard';
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'bot_action':
        return 'Ver Bot';
      case 'transaction':
        return 'Ver Transação';
      case 'marketplace':
        return 'Ver Marketplace';
      case 'fiscal':
        return 'Ver Declaração';
      default:
        return 'Ver Detalhes';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bot_action':
        return <Bot className="w-5 h-5 text-blue-500" />;
      case 'transaction':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'marketplace':
        return <ShoppingCart className="w-5 h-5 text-purple-500" />;
      case 'fiscal':
        return <FileText className="w-5 h-5 text-orange-500" />;
      case 'system':
        return <Zap className="w-5 h-5 text-indigo-500" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-white';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'bots':
        return notification.type === 'bot_action';
      case 'transactions':
        return notification.type === 'transaction';
      default:
        return true;
    }
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="relative">
      {/* Botão de notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Painel de notificações */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Notificações {unreadCount > 0 && `(${unreadCount})`}
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Marcar todas como lidas
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex space-x-2 mt-3">
              {[
                { key: 'all', label: 'Todas' },
                { key: 'unread', label: 'Não lidas' },
                { key: 'bots', label: 'Bots' },
                { key: 'transactions', label: 'Transações' },
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === filterOption.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de notificações */}
          <div className="max-h-80 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p>Nenhuma notificação encontrada</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {notification.metadata?.amount && (
                              <span className="text-xs font-medium text-green-600">
                                R$ {notification.metadata.amount.toLocaleString('pt-BR')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-blue-600"
                              title="Marcar como lida"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {notification.actionUrl && (
                        <Link
                          to={notification.actionUrl}
                          onClick={() => {
                            markAsRead(notification.id);
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-2"
                        >
                          {notification.actionLabel}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <Link
              to="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver todas as notificações
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
