import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  category: 'fiscal' | 'marketplace' | 'blockchain' | 'system' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface NotificationStats {
  total: number;
  unread: number;
  urgent: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Obrigação Fiscal Vencendo',
      message: 'DCTF vence em 3 dias. Não esqueça de enviar.',
      type: 'warning',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      actionUrl: '/dashboard/obrigacoes-fiscais',
      category: 'fiscal',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Nova Oferta Recebida',
      message: 'Você recebeu uma oferta de R$ 95.000 para seu Precatório Federal.',
      type: 'info',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
      actionUrl: '/dashboard/marketplace/ofertas',
      category: 'marketplace',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Transação Concluída',
      message: 'Sua venda de Crédito ICMS SP foi finalizada com sucesso.',
      type: 'success',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      actionUrl: '/dashboard/transacoes',
      category: 'marketplace',
      priority: 'low',
    },
    {
      id: '4',
      title: 'Validação de Crédito Aprovada',
      message: 'Seu crédito PIS/COFINS 2023 foi aprovado e está pronto para negociação.',
      type: 'success',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      actionUrl: '/dashboard/creditos',
      category: 'general',
      priority: 'medium',
    },
    {
      id: '5',
      title: 'Manutenção Programada',
      message: 'O sistema blockchain estará em manutenção amanhã das 2h às 4h.',
      type: 'info',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: false,
      actionUrl: '/dashboard/status',
      category: 'system',
      priority: 'low',
    },
    {
      id: '6',
      title: 'Documentação Pendente',
      message: 'Faltam documentos para completar a tokenização do seu crédito rural.',
      type: 'warning',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: false,
      actionUrl: '/dashboard/creditos/pendentes',
      category: 'general',
      priority: 'high',
    },
  ];

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 1000);
    };

    loadNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  }, []);

  // Delete notification
  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Add new notification
  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      };

      setNotifications(prev => [newNotification, ...prev]);

      // Show toast for new notifications
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'error' ? 'destructive' : 'default',
      });
    },
    [toast]
  );

  // Filter notifications
  const getNotificationsByCategory = useCallback(
    (category: Notification['category']) => {
      return notifications.filter(notification => notification.category === category);
    },
    [notifications]
  );

  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  const getUrgentNotifications = useCallback(() => {
    return notifications.filter(notification => notification.priority === 'urgent');
  }, [notifications]);

  // Statistics
  const stats: NotificationStats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    urgent: notifications.filter(n => n.priority === 'urgent').length,
  };

  // Sort notifications by timestamp (newest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return {
    notifications: sortedNotifications,
    loading,
    stats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification,
    getNotificationsByCategory,
    getUnreadNotifications,
    getUrgentNotifications,
  };
}
