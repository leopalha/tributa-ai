import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Gavel,
  ShoppingCart,
  MessageSquare,
  FileText,
  X,
  Eye,
  Download,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'purchase' | 'sale' | 'bid' | 'offer' | 'message' | 'system' | 'payment';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  data: {
    creditId?: string;
    creditTitle?: string;
    amount?: number;
    buyerName?: string;
    sellerName?: string;
    transactionId?: string;
    proofUrl?: string;
    status?: string;
  };
}

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onViewProof: (notification: Notification) => void;
}

export function NotificationSystem({
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewProof,
}: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'purchases' | 'sales' | 'bids'>('all');

  useEffect(() => {
    // Simular notificações em tempo real
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'purchase',
        title: 'Compra Concluída',
        description: 'Você adquiriu o título ICMS - Exportação Agronegócio por R$ 765.000',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        priority: 'high',
        data: {
          creditId: 'credit_1',
          creditTitle: 'ICMS - Exportação Agronegócio Tokenizado',
          amount: 765000,
          sellerName: 'AgroExport Brasil Ltda',
          transactionId: 'TXN_20240115_001',
          proofUrl: '/proof/TXN_20240115_001.pdf',
          status: 'completed',
        },
      },
      {
        id: '2',
        type: 'bid',
        title: 'Você foi superado!',
        description:
          'Seu lance de R$ 380.000 foi superado no leilão PIS/COFINS - Indústria Química',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        priority: 'medium',
        data: {
          creditId: 'credit_2',
          creditTitle: 'PIS/COFINS - Indústria Química Tokenizada',
          amount: 380000,
          transactionId: 'BID_20240115_002',
        },
      },
      {
        id: '3',
        type: 'sale',
        title: 'Venda Realizada',
        description: 'Seu título Precatório Judicial foi vendido por R$ 960.000',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
        priority: 'high',
        data: {
          creditId: 'credit_3',
          creditTitle: 'Precatório Judicial Tokenizado TJSP',
          amount: 960000,
          buyerName: 'Investimentos Premium SA',
          transactionId: 'SALE_20240115_003',
          proofUrl: '/proof/SALE_20240115_003.pdf',
          status: 'completed',
        },
      },
      {
        id: '4',
        type: 'offer',
        title: 'Nova Proposta Recebida',
        description: 'Você recebeu uma proposta de R$ 285.000 para o título IPI - Manufatura',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: false,
        priority: 'medium',
        data: {
          creditId: 'credit_4',
          creditTitle: 'IPI - Manufatura Eletrônicos Tokenizado',
          amount: 285000,
          buyerName: 'TechInvest Corp',
          transactionId: 'OFFER_20240115_004',
        },
      },
      {
        id: '5',
        type: 'message',
        title: 'Nova Mensagem',
        description: 'Você recebeu uma mensagem sobre o título IRPJ/CSLL - Serviços Financeiros',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: false,
        priority: 'low',
        data: {
          creditId: 'credit_5',
          creditTitle: 'IRPJ/CSLL - Serviços Financeiros Tokenizado',
          transactionId: 'MSG_20240115_005',
        },
      },
      {
        id: '6',
        type: 'system',
        title: 'Documentação Aprovada',
        description: 'A documentação do seu título ISS foi aprovada e está disponível para venda',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        read: true,
        priority: 'medium',
        data: {
          creditId: 'credit_6',
          creditTitle: 'ISS - Prestação de Serviços Tokenizado',
          transactionId: 'DOC_20240115_006',
        },
      },
      {
        id: '7',
        type: 'payment',
        title: 'Pagamento Processado',
        description: 'O pagamento de R$ 855.000 foi processado com sucesso',
        timestamp: new Date(Date.now() - 120 * 60 * 1000),
        read: true,
        priority: 'high',
        data: {
          creditId: 'credit_7',
          creditTitle: 'Crédito Rural Tokenizado',
          amount: 855000,
          transactionId: 'PAY_20240115_007',
          proofUrl: '/proof/PAY_20240115_007.pdf',
          status: 'completed',
        },
      },
    ];

    setNotifications(mockNotifications);

    // Simular novas notificações chegando
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification: Notification = {
          id: `new_${Date.now()}`,
          type: ['bid', 'offer', 'message', 'system'][Math.floor(Math.random() * 4)] as any,
          title: 'Nova Atividade',
          description: 'Há nova atividade em seus títulos',
          timestamp: new Date(),
          read: false,
          priority: 'medium',
          data: {
            transactionId: `TXN_${Date.now()}`,
          },
        };
        setNotifications(prev => [newNotification, ...prev]);
        toast.info('Nova notificação recebida');
      }
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart className="w-5 h-5 text-green-600" />;
      case 'sale':
        return <DollarSign className="w-5 h-5 text-blue-600" />;
      case 'bid':
        return <Gavel className="w-5 h-5 text-purple-600" />;
      case 'offer':
        return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
      case 'system':
        return <Bell className="w-5 h-5 text-indigo-600" />;
      case 'payment':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'purchases':
        return notification.type === 'purchase';
      case 'sales':
        return notification.type === 'sale';
      case 'bids':
        return notification.type === 'bid';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    onMarkAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    onMarkAllAsRead();
  };

  const handleViewProof = (notification: Notification) => {
    onViewProof(notification);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex gap-1">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Todas
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Não Lidas ({unreadCount})
              </Button>
              <Button
                variant={filter === 'purchases' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('purchases')}
              >
                Compras
              </Button>
              <Button
                variant={filter === 'sales' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('sales')}
              >
                Vendas
              </Button>
              <Button
                variant={filter === 'bids' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('bids')}
              >
                Lances
              </Button>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                Marcar Todas como Lidas
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-3">
              {filteredNotifications.map(notification => (
                <Card
                  key={notification.id}
                  className={`border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'bg-blue-50' : 'bg-white'
                  } hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{notification.description}</p>

                        {notification.data.amount && (
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {formatCurrency(notification.data.amount)}
                            </Badge>
                            {notification.data.status === 'completed' && (
                              <Badge
                                variant="default"
                                className="text-xs bg-green-100 text-green-800"
                              >
                                Concluído
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          {notification.data.proofUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation();
                                handleViewProof(notification);
                              }}
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              Comprovante
                            </Button>
                          )}

                          {notification.data.creditId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation();
                                toast.info('Abrindo detalhes do título...');
                              }}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver Título
                            </Button>
                          )}

                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma notificação encontrada</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
