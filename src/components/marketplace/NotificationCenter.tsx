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

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'purchases' | 'sales' | 'bids'>('all');

  useEffect(() => {
    // Simular notificações
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
        description: 'Seu lance de R$ 380.000 foi superado no leilão PIS/COFINS',
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
    ];

    setNotifications(mockNotifications);
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
        return <MessageSquare className="w-5 h-5 text-orange-600" />;
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
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-3">
              {filteredNotifications.map(notification => (
                <Card
                  key={notification.id}
                  className={`${!notification.read ? 'bg-blue-50' : 'bg-white'} hover:shadow-md transition-shadow cursor-pointer`}
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
                            <Button variant="outline" size="sm">
                              <FileText className="w-3 h-3 mr-1" />
                              Comprovante
                            </Button>
                          )}

                          {notification.data.creditId && (
                            <Button variant="outline" size="sm">
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
