import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCreditNotifications } from '@/hooks/use-credit-notifications';

interface CreditNotificationsProps {
  creditId: string;
}

export function CreditNotifications({ creditId }: CreditNotificationsProps) {
  const { isLoading, fetchNotifications, markAsRead, markAllAsRead } = useCreditNotifications({
    creditId,
  });
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      read: boolean;
      createdAt: string;
    }>
  >([]);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };

    loadNotifications();
  }, [creditId, fetchNotifications]);

  const getNotificationType = (type: string) => {
    switch (type) {
      case 'SYSTEM':
        return 'Sistema';
      case 'TRANSACTION':
        return 'Transação';
      case 'OFFER':
        return 'Oferta';
      case 'AUCTION':
        return 'Leilão';
      default:
        return type;
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
    setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, read: true } : n)));
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Acompanhe as atualizações deste crédito</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={isLoading}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando notificações...</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma notificação encontrada.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getNotificationType(notification.type)}</Badge>
                    {!notification.read && <Badge>Nova</Badge>}
                  </div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={isLoading}
                  >
                    Marcar como lida
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
