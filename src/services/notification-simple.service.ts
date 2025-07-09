export interface SimpleNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  relatedId?: string;
  relatedType?: 'compensation' | 'process' | 'analysis';
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  type: 'primary' | 'secondary';
}

class SimpleNotificationService {
  private notifications: SimpleNotification[] = [];
  private listeners: ((notifications: SimpleNotification[]) => void)[] = [];

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications() {
    const saved = localStorage.getItem('tributa_notifications');
    if (saved) {
      try {
        this.notifications = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      }
    }
  }

  private saveNotifications() {
    localStorage.setItem('tributa_notifications', JSON.stringify(this.notifications));
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  addNotification(notification: Omit<SimpleNotification, 'id' | 'timestamp' | 'read'>): string {
    const newNotification: SimpleNotification = {
      id: this.generateId(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    
    return newNotification.id;
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
  }

  getNotifications(): SimpleNotification[] {
    return this.notifications;
  }

  getUnreadNotifications(): SimpleNotification[] {
    return this.notifications.filter(n => !n.read);
  }

  getUnreadCount(): number {
    return this.getUnreadNotifications().length;
  }

  subscribe(listener: (notifications: SimpleNotification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notificações específicas para compensação
  notifyCompensationStarted(processId: string, type: 'bilateral' | 'multilateral', value: number) {
    this.addNotification({
      type: 'info',
      title: 'Compensação Iniciada',
      message: `Compensação ${type} de R$ ${value.toLocaleString()} foi enviada para análise da Receita Federal.`,
      relatedId: processId,
      relatedType: 'compensation',
      actions: [
        {
          label: 'Acompanhar',
          action: () => window.location.href = '/dashboard/recuperacao/processos',
          type: 'primary'
        }
      ]
    });
  }

  notifyCompensationApproved(processId: string, protocol: string, value: number) {
    this.addNotification({
      type: 'success',
      title: 'Compensação Aprovada',
      message: `Compensação ${protocol} de R$ ${value.toLocaleString()} foi aprovada pela Receita Federal.`,
      relatedId: processId,
      relatedType: 'compensation',
      actions: [
        {
          label: 'Baixar Comprovante',
          action: () => this.downloadComprovante(protocol),
          type: 'primary'
        },
        {
          label: 'Ver Detalhes',
          action: () => window.location.href = `/dashboard/recuperacao/processos?id=${processId}`,
          type: 'secondary'
        }
      ]
    });
  }

  notifyCompensationRejected(processId: string, protocol: string, reason: string) {
    this.addNotification({
      type: 'error',
      title: 'Compensação Rejeitada',
      message: `Compensação ${protocol} foi rejeitada: ${reason}`,
      relatedId: processId,
      relatedType: 'compensation',
      actions: [
        {
          label: 'Ver Detalhes',
          action: () => window.location.href = `/dashboard/recuperacao/processos?id=${processId}`,
          type: 'primary'
        }
      ]
    });
  }

  notifyDocumentsPending(processId: string, protocol: string, documents: string[]) {
    this.addNotification({
      type: 'warning',
      title: 'Documentos Pendentes',
      message: `Processo ${protocol} requer documentos adicionais: ${documents.join(', ')}`,
      relatedId: processId,
      relatedType: 'process',
      actions: [
        {
          label: 'Enviar Documentos',
          action: () => window.location.href = `/dashboard/recuperacao/processos?id=${processId}`,
          type: 'primary'
        }
      ]
    });
  }

  notifyProcessUpdate(processId: string, protocol: string, newStatus: string, message: string) {
    this.addNotification({
      type: 'info',
      title: 'Atualização de Processo',
      message: `${protocol}: ${message}`,
      relatedId: processId,
      relatedType: 'process',
      actions: [
        {
          label: 'Ver Detalhes',
          action: () => window.location.href = `/dashboard/recuperacao/processos?id=${processId}`,
          type: 'primary'
        }
      ]
    });
  }

  notifyAnalysisCompleted(analysisId: string, creditsFound: number, totalValue: number) {
    this.addNotification({
      type: 'success',
      title: 'Análise Concluída',
      message: `Análise identificou ${creditsFound} créditos no valor de R$ ${totalValue.toLocaleString()}`,
      relatedId: analysisId,
      relatedType: 'analysis',
      actions: [
        {
          label: 'Ver Créditos',
          action: () => window.location.href = '/dashboard/recuperacao/creditos',
          type: 'primary'
        }
      ]
    });
  }

  private downloadComprovante(protocol: string) {
    // Simular download do comprovante
    const blob = new Blob([`Comprovante de Compensação - ${protocol}`], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprovante-${protocol}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Simular atualizações de processo em tempo real
  startProcessMonitoring() {
    setInterval(() => {
      // Simular atualizações aleatórias
      if (Math.random() > 0.95) { // 5% de chance a cada intervalo
        const protocols = ['RF-45123890', 'RF-45123855', 'RF-45123830'];
        const protocol = protocols[Math.floor(Math.random() * protocols.length)];
        const messages = [
          'Processo movido para análise técnica',
          'Documentos recebidos e em análise',
          'Processo em fila para aprovação',
          'Análise fiscal em andamento'
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        this.notifyProcessUpdate(protocol, protocol, 'PROCESSANDO', message);
      }
    }, 30000); // Verificar a cada 30 segundos
  }
}

export const simpleNotificationService = new SimpleNotificationService(); 