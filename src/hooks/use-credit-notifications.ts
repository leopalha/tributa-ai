import { useState } from 'react';
import { useRouter } from '@/lib/router-utils';
import { toast } from 'sonner';

interface UseCreditNotificationsProps {
  creditId: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function useCreditNotifications({ creditId }: UseCreditNotificationsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/notifications`);

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      return data as Notification[];
    } catch (error) {
      toast.error('Erro ao carregar notificações');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/marketplace/credits/${creditId}/notifications/${notificationId}/read`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      toast.success('Notificação marcada como lida');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao marcar notificação como lida');
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/marketplace/credits/${creditId}/notifications/read-all`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      toast.success('Todas as notificações marcadas como lidas');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao marcar notificações como lidas');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
