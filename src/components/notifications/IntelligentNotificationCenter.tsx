import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Settings,
  Filter,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Archive,
  MoreVertical,
  ExternalLink,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  TrendingUp,
  DollarSign,
  Building2,
  Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  intelligentNotificationService, 
  IntelligentNotification, 
  NotificationStats 
} from '@/services/intelligent-notification.service';

interface IntelligentNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const IntelligentNotificationCenter: React.FC<IntelligentNotificationCenterProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [notifications, setNotifications] = useState<IntelligentNotification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: '',
    priority: '',
    unreadOnly: false,
    search: ''
  });
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'actionable'>('all');

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      loadStats();
    }
  }, [isOpen, filter, selectedTab]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const filters = {
        unreadOnly: selectedTab === 'unread' || filter.unreadOnly,
        category: filter.category || undefined,
        priority: filter.priority || undefined,
        limit: 50
      };

      let notifs = await intelligentNotificationService.getNotifications(filters);
      
      // Filtrar por actionable se necessário
      if (selectedTab === 'actionable') {
        notifs = notifs.filter(n => n.actionable);
      }

      // Filtrar por busca
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        notifs = notifs.filter(n => 
          n.title.toLowerCase().includes(searchLower) ||
          n.message.toLowerCase().includes(searchLower)
        );
      }

      setNotifications(notifs);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    const currentStats = intelligentNotificationService.getStats();
    setStats(currentStats);
  };

  const handleMarkAsRead = (notificationId: string) => {
    intelligentNotificationService.markAsRead(notificationId);
    loadNotifications();
    loadStats();
  };

  const handleExecuteAction = async (action: any) => {
    try {
      if (action.confirmMessage) {
        const confirmed = window.confirm(action.confirmMessage);
        if (!confirmed) return;
      }

      if (action.url) {
        window.open(action.url, '_blank');
      } else if (action.handler) {
        await action.handler();
      }
    } catch (error) {
      console.error('Erro ao executar ação:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': 
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'info': 
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'FISCAL': return <Shield className="w-4 h-4" />;
      case 'FINANCIAL': return <DollarSign className="w-4 h-4" />;
      case 'LEGAL': return <Building2 className="w-4 h-4" />;
      case 'OPERATIONAL': return <Settings className="w-4 h-4" />;
      case 'STRATEGIC': return <TrendingUp className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return 'Agora';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold">Central de Notificações</h2>
              <p className="text-sm text-gray-600">
                {stats && `${stats.unread} não lidas de ${stats.total} total`}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 p-6 border-b bg-gray-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.unread}</div>
              <div className="text-xs text-gray-600">Não Lidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.actionableCount}</div>
              <div className="text-xs text-gray-600">Acionáveis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.last24Hours}</div>
              <div className="text-xs text-gray-600">Últimas 24h</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.byPriority.HIGH || 0}</div>
              <div className="text-xs text-gray-600">Alta Prioridade</div>
            </div>
          </div>
        )}

        {/* Tabs and Filters */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex space-x-2">
            <Button
              variant={selectedTab === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTab('all')}
            >
              Todas
            </Button>
            <Button
              variant={selectedTab === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTab('unread')}
            >
              Não Lidas
              {stats && stats.unread > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {stats.unread}
                </Badge>
              )}
            </Button>
            <Button
              variant={selectedTab === 'actionable' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTab('actionable')}
            >
              Acionáveis
              {stats && stats.actionableCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {stats.actionableCount}
                </Badge>
              )}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              placeholder="Buscar..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-64"
            />
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma notificação encontrada</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                  notification.readAt ? 'bg-white' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Priority Indicator */}
                  <div className={`w-1 h-16 rounded-full ${getPriorityColor(notification.priority)}`} />
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(notification.type)}
                        {getCategoryIcon(notification.category)}
                        <h3 className="font-medium text-gray-900 truncate">
                          {notification.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {notification.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {!notification.readAt && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                    
                    {notification.details && (
                      <p className="text-xs text-gray-500 mb-3">{notification.details}</p>
                    )}
                    
                    {/* Related Entity */}
                    {notification.relatedEntity && (
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {notification.relatedEntity.type}
                        </Badge>
                        <span className="text-xs text-gray-600">
                          {notification.relatedEntity.name}
                        </span>
                      </div>
                    )}
                    
                    {/* Actions */}
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {notification.actions.map((action) => (
                          <Button
                            key={action.id}
                            size="sm"
                            variant={action.type === 'PRIMARY' ? 'default' : 
                                   action.type === 'DANGER' ? 'destructive' : 'outline'}
                            onClick={() => handleExecuteAction(action)}
                            className="text-xs"
                          >
                            {action.label}
                            {action.url && <ExternalLink className="w-3 h-3 ml-1" />}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {notifications.length > 0 && `Exibindo ${notifications.length} notificações`}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Archive className="w-4 h-4 mr-1" />
              Arquivar Lidas
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentNotificationCenter;