import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { v4 as uuidv4 } from 'uuid';

export enum NotificationType {
  // Sistema
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  SYSTEM_MAINTENANCE = 'SYSTEM_MAINTENANCE',

  // Transações
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',

  // Marketplace
  OFFER_RECEIVED = 'OFFER_RECEIVED',
  OFFER_ACCEPTED = 'OFFER_ACCEPTED',
  OFFER_REJECTED = 'OFFER_REJECTED',
  OFFER_EXPIRED = 'OFFER_EXPIRED',

  // Créditos
  CREDIT_TOKENIZED = 'CREDIT_TOKENIZED',
  CREDIT_LISTED = 'CREDIT_LISTED',
  CREDIT_SOLD = 'CREDIT_SOLD',
  CREDIT_EXPIRING = 'CREDIT_EXPIRING',

  // Compensação
  COMPENSATION_AVAILABLE = 'COMPENSATION_AVAILABLE',
  COMPENSATION_EXECUTED = 'COMPENSATION_EXECUTED',
  COMPENSATION_FAILED = 'COMPENSATION_FAILED',

  // Débitos
  DEBIT_DUE_SOON = 'DEBIT_DUE_SOON',
  DEBIT_OVERDUE = 'DEBIT_OVERDUE',
  DEBIT_PAID = 'DEBIT_PAID',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
  SMS = 'SMS',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

interface NotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: NotificationPriority;
  channels?: NotificationChannel[];
  actionUrl?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  relatedId?: string; // ID do processo relacionado
  relatedType?: 'compensation' | 'process' | 'analysis';
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  type: 'primary' | 'secondary';
}

class NotificationService {
  private static instance: NotificationService;
  private emailTransporter: nodemailer.Transporter | null = null;
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  private constructor() {
    this.initializeEmailTransporter();
    this.loadNotifications();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initializeEmailTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
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

  /**
   * Envia notificação para um usuário
   */
  async notify(notification: NotificationData): Promise<void> {
    try {
      // Determinar canais baseado na prioridade se não especificado
      const channels = notification.channels || this.getChannelsByPriority(notification.priority);

      // Criar notificação no banco (in-app sempre)
      const dbNotification = await this.createInAppNotification(notification);

      // Enviar por outros canais
      const promises: Promise<any>[] = [];

      if (channels.includes(NotificationChannel.EMAIL)) {
        promises.push(this.sendEmail(notification));
      }

      if (channels.includes(NotificationChannel.PUSH)) {
        promises.push(this.sendPushNotification(notification));
      }

      if (
        channels.includes(NotificationChannel.SMS) &&
        notification.priority === NotificationPriority.URGENT
      ) {
        promises.push(this.sendSMS(notification));
      }

      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }

  /**
   * Envia notificação em massa
   */
  async notifyBatch(
    userIds: string[],
    notification: Omit<NotificationData, 'userId'>
  ): Promise<void> {
    const promises = userIds.map(userId => this.notify({ ...notification, userId }));

    await Promise.allSettled(promises);
  }

  /**
   * Cria notificação in-app no banco
   */
  private async createInAppNotification(notification: NotificationData) {
    return await prisma.notification.create({
      data: {
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: false,
        createdAt: new Date(),
      },
    });
  }

  /**
   * Envia email
   */
  private async sendEmail(notification: NotificationData): Promise<void> {
    if (!this.emailTransporter) {
      console.warn('Email transporter não configurado');
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: notification.userId },
        select: { email: true, name: true },
      });

      if (!user?.email) return;

      // Template HTML para o email
      const htmlContent = this.generateEmailTemplate(notification, user.name || 'Usuário');

      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_FROM || 'Tributa.AI <noreply@tributa.ai>',
        to: user.email,
        subject: notification.title,
        html: htmlContent,
        text: notification.message, // Fallback para clientes sem HTML
      });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  }

  /**
   * Envia notificação push (implementar com Firebase/OneSignal)
   */
  private async sendPushNotification(notification: NotificationData): Promise<void> {
    // TODO: Implementar quando push notifications forem configuradas
    console.log('Push notification:', notification);
  }

  /**
   * Envia SMS (implementar com Twilio)
   */
  private async sendSMS(notification: NotificationData): Promise<void> {
    // TODO: Implementar quando SMS for configurado
    console.log('SMS notification:', notification);
  }

  /**
   * Determina canais baseado na prioridade
   */
  private getChannelsByPriority(priority?: NotificationPriority): NotificationChannel[] {
    switch (priority) {
      case NotificationPriority.URGENT:
        return [
          NotificationChannel.EMAIL,
          NotificationChannel.PUSH,
          NotificationChannel.IN_APP,
          NotificationChannel.SMS,
        ];
      case NotificationPriority.HIGH:
        return [NotificationChannel.EMAIL, NotificationChannel.PUSH, NotificationChannel.IN_APP];
      case NotificationPriority.MEDIUM:
        return [NotificationChannel.EMAIL, NotificationChannel.IN_APP];
      default:
        return [NotificationChannel.IN_APP];
    }
  }

  /**
   * Gera template HTML para emails
   */
  private generateEmailTemplate(notification: NotificationData, userName: string): string {
    const actionButton = notification.actionUrl
      ? `<a href="${notification.actionUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">Ver Detalhes</a>`
      : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${notification.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
            .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">Tributa.AI</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Plataforma de Tokenização de Créditos Tributários</p>
            </div>
            <div class="content">
              <p>Olá ${userName},</p>
              <h2 style="color: #1f2937; margin: 20px 0;">${notification.title}</h2>
              <p>${notification.message}</p>
              ${actionButton}
            </div>
            <div class="footer">
              <p>Este é um email automático. Por favor, não responda.</p>
              <p>© ${new Date().getFullYear()} Tributa.AI. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Marca notificação como lida
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        read: true,
      },
    });
  }

  /**
   * Marca todas notificações como lidas
   */
  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }

  /**
   * Busca notificações do usuário
   */
  async getUserNotifications(
    userId: string,
    options?: {
      unreadOnly?: boolean;
      limit?: number;
      offset?: number;
    }
  ) {
    const where: any = { userId };

    if (options?.unreadOnly) {
      where.read = false;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 20,
        skip: options?.offset || 0,
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      total,
      unread: await prisma.notification.count({
        where: { userId, read: false },
      }),
    };
  }

  /**
   * Deleta notificações antigas
   */
  async cleanupOldNotifications(daysToKeep: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        read: true,
      },
    });
  }

  // Adicionar uma nova notificação
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string {
    const newNotification: Notification = {
      id: uuidv4(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    
    return newNotification.id;
  }

  // Marcar notificação como lida
  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  // Marcar todas como lidas
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
  }

  // Remover notificação
  removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
  }

  // Obter todas as notificações
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // Obter notificações não lidas
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  // Obter contagem de não lidas
  getUnreadCount(): number {
    return this.getUnreadNotifications().length;
  }

  // Inscrever-se para receber atualizações
  subscribe(listener: (notifications: Notification[]) => void) {
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

// Exportar instância singleton
export const notificationService = NotificationService.getInstance();

// Helpers para notificações específicas
export const notificationHelpers = {
  /**
   * Notifica sobre nova oferta recebida
   */
  async notifyNewOffer(sellerId: string, offer: any) {
    await notificationService.notify({
      userId: sellerId,
      type: NotificationType.OFFER_RECEIVED,
      title: 'Nova Proposta Recebida',
      message: `Você recebeu uma nova proposta de ${offer.bidder.name} no valor de R$ ${offer.amount.toLocaleString('pt-BR')}`,
      priority: NotificationPriority.HIGH,
      actionUrl: `/dashboard/marketplace/ofertas/${offer.id}`,
      data: { offerId: offer.id, amount: offer.amount },
    });
  },

  /**
   * Notifica sobre crédito próximo do vencimento
   */
  async notifyCreditExpiring(userId: string, credit: any, daysUntilExpiry: number) {
    await notificationService.notify({
      userId,
      type: NotificationType.CREDIT_EXPIRING,
      title: 'Crédito Próximo do Vencimento',
      message: `Seu crédito ${credit.title} vencerá em ${daysUntilExpiry} dias. Considere negociá-lo no marketplace.`,
      priority: daysUntilExpiry <= 7 ? NotificationPriority.URGENT : NotificationPriority.HIGH,
      actionUrl: `/dashboard/creditos/${credit.id}`,
      data: { creditId: credit.id, daysUntilExpiry },
    });
  },

  /**
   * Notifica sobre oportunidade de compensação
   */
  async notifyCompensationOpportunity(userId: string, compensation: any) {
    await notificationService.notify({
      userId,
      type: NotificationType.COMPENSATION_AVAILABLE,
      title: 'Oportunidade de Compensação Identificada',
      message: `Identificamos uma oportunidade de compensar R$ ${compensation.amount.toLocaleString('pt-BR')} em débitos tributários.`,
      priority: NotificationPriority.MEDIUM,
      actionUrl: '/dashboard/compensacao',
      data: { amount: compensation.amount, debitCount: compensation.debits.length },
    });
  },
};
