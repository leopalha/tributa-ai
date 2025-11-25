import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Filter,
  CheckSquare,
  Square,
  Trash2,
  Bot,
  TrendingUp,
  ShoppingCart,
  FileText,
  Zap,
  AlertTriangle,
  Clock,
  ExternalLink,
  Settings,
  Download,
  Archive,
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
  };
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'priority'>('timestamp');

  // Carrega notificações (simulação)
  useEffect(() => {
    loadNotifications();
  }, []);

  // Aplica filtros
  useEffect(() => {
    let filtered = notifications;

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(
        n =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.metadata?.botName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    // Filtro por prioridade
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(n => n.priority === priorityFilter);
    }

    // Filtro por status de leitura
    if (readFilter === 'read') {
      filtered = filtered.filter(n => n.read);
    } else if (readFilter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    }

    // Ordenação
    filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, typeFilter, priorityFilter, readFilter, sortBy]);

  const loadNotifications = () => {
    // Simula carregamento de notificações
    const mockNotifications: Notification[] = [];

    // Gera 50 notificações de exemplo
    for (let i = 0; i < 50; i++) {
      const types = ['bot_action', 'transaction', 'marketplace', 'fiscal', 'system'] as const;
      const priorities = ['low', 'medium', 'high', 'critical'] as const;
      const botNames = ['TradeMaster', 'AnalyzerPro', 'CompensaBot', 'FiscalAI', 'MarketBot'];

      const type = types[Math.floor(Math.random() * types.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const botName = botNames[Math.floor(Math.random() * botNames.length)];
      const amount = Math.floor(Math.random() * 500000) + 10000;

      mockNotifications.push({
        id: `notif-${i}`,
        type,
        title: getRandomTitle(type, botName),
        message: getRandomMessage(type, botName, amount),
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
        read: Math.random() > 0.3, // 70% lidas
        priority,
        actionUrl: getActionUrl(type),
        actionLabel: getActionLabel(type),
        metadata: {
          amount,
          botName,
          transactionId: `TXN-${Date.now()}-${i}`,
          documentId: `DOC-${Date.now()}-${i}`,
        },
      });
    }

    setNotifications(mockNotifications);
  };

  const getRandomTitle = (type: string, botName: string) => {
    const titles = {
      bot_action: [
        `Bot ${botName} executou transação`,
        `${botName} identificou oportunidade`,
        `Bot ${botName} completou análise`,
        `${botName} realizou compensação`,
      ],
      transaction: [
        'Transação confirmada na blockchain',
        'Pagamento processado',
        'Token transferido',
        'Venda concluída',
      ],
      marketplace: [
        'Nova proposta recebida',
        'Leilão finalizado',
        'Título vendido',
        'Oferta aceita',
      ],
      fiscal: [
        'Declaração enviada',
        'Obrigação vencendo',
        'Documento processado',
        'Prazo se aproximando',
      ],
      system: [
        'Sistema atualizado',
        'Backup concluído',
        'Manutenção programada',
        'Nova funcionalidade',
      ],
    };

    const typeTitle = titles[type as keyof typeof titles] || titles.system;
    return typeTitle[Math.floor(Math.random() * typeTitle.length)];
  };

  const getRandomMessage = (type: string, botName: string, amount: number) => {
    const messages = {
      bot_action: [
        `Transação de R$ ${amount.toLocaleString('pt-BR')} executada automaticamente`,
        `Oportunidade de R$ ${amount.toLocaleString('pt-BR')} identificada pelo ${botName}`,
        `Análise completada com sucesso pelo ${botName}`,
        `Compensação de R$ ${amount.toLocaleString('pt-BR')} processada`,
      ],
      transaction: [
        `Transação de R$ ${amount.toLocaleString('pt-BR')} confirmada`,
        `Pagamento de R$ ${amount.toLocaleString('pt-BR')} recebido`,
        'Token transferido com sucesso na blockchain',
        `Venda finalizada por R$ ${amount.toLocaleString('pt-BR')}`,
      ],
      marketplace: [
        `Nova oferta de R$ ${amount.toLocaleString('pt-BR')} recebida`,
        `Leilão finalizado com lance de R$ ${amount.toLocaleString('pt-BR')}`,
        `Título vendido por R$ ${amount.toLocaleString('pt-BR')}`,
        'Sua proposta foi aceita',
      ],
      fiscal: [
        'DCTF-Web enviada com sucesso à Receita Federal',
        'Prazo de entrega se aproxima em 3 dias',
        'Documento processado e arquivado',
        'Obrigação fiscal vence amanhã',
      ],
      system: [
        'Sistema atualizado para versão 2.1.0',
        'Backup automático concluído',
        'Manutenção programada para domingo',
        'Nova funcionalidade de IA disponível',
      ],
    };

    const typeMessages = messages[type as keyof typeof messages] || messages.system;
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
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
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[priority as keyof typeof styles]}`}
      >
        {priority.toUpperCase()}
      </span>
    );
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedNotifications(newSelected);
  };

  const selectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const markSelectedAsRead = () => {
    setNotifications(prev =>
      prev.map(n => (selectedNotifications.has(n.id) ? { ...n, read: true } : n))
    );
    setSelectedNotifications(new Set());
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
    setSelectedNotifications(new Set());
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="w-7 h-7 mr-3 text-blue-600" />
            Notificações
          </h1>
          <p className="text-gray-600 mt-1">
            {notifications.length} notificações • {unreadCount} não lidas
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Busca */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar notificações..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filtros */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos os tipos</option>
            <option value="bot_action">Ações de Bots</option>
            <option value="transaction">Transações</option>
            <option value="marketplace">Marketplace</option>
            <option value="fiscal">Fiscal</option>
            <option value="system">Sistema</option>
          </select>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todas as prioridades</option>
            <option value="critical">Crítica</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>

          <select
            value={readFilter}
            onChange={e => setReadFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todas</option>
            <option value="unread">Não lidas</option>
            <option value="read">Lidas</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'timestamp' | 'priority')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="timestamp">Mais recentes</option>
            <option value="priority">Prioridade</option>
          </select>
        </div>
      </div>

      {/* Ações em lote */}
      {selectedNotifications.size > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedNotifications.size} notificações selecionadas
            </span>
            <div className="flex space-x-2">
              <button
                onClick={markSelectedAsRead}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Marcar como lidas
              </button>
              <button
                onClick={deleteSelected}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de notificações */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header da tabela */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <button onClick={selectAll} className="p-1">
              {selectedNotifications.size === filteredNotifications.length &&
              filteredNotifications.length > 0 ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <span className="font-medium text-gray-700">
              {filteredNotifications.length} notificações encontradas
            </span>
          </div>
        </div>

        {/* Notificações */}
        <div className="divide-y divide-gray-200">
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <button onClick={() => toggleSelection(notification.id)} className="mt-1">
                  {selectedNotifications.has(notification.id) ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {getNotificationIcon(notification.type)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3
                          className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}
                        >
                          {notification.title}
                        </h3>
                        {getPriorityBadge(notification.priority)}
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDateTime(notification.timestamp)}
                        </span>
                        {notification.metadata?.amount && (
                          <span className="text-sm font-medium text-green-600">
                            R$ {notification.metadata.amount.toLocaleString('pt-BR')}
                          </span>
                        )}
                        {notification.metadata?.botName && (
                          <span className="text-sm text-blue-600">
                            Bot: {notification.metadata.botName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {notification.actionUrl && (
                        <Link
                          to={notification.actionUrl}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 flex items-center"
                        >
                          {notification.actionLabel}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setNotifications(prev => prev.filter(n => n.id !== notification.id));
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma notificação encontrada
            </h3>
            <p className="text-gray-500">Tente ajustar os filtros ou termos de busca</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
