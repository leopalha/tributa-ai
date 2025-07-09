import { simpleNotificationService } from './notification-simple.service';

export interface IntelligentNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'critical';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'FISCAL' | 'FINANCIAL' | 'LEGAL' | 'OPERATIONAL' | 'STRATEGIC';
  title: string;
  message: string;
  details?: string;
  relatedEntity?: {
    type: 'COMPANY' | 'CREDIT' | 'DEBT' | 'PROCESS' | 'COMPENSATION';
    id: string;
    name: string;
  };
  actionable: boolean;
  actions?: NotificationAction[];
  channels: NotificationChannel[];
  schedule?: {
    sendAt?: Date;
    repeat?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    endDate?: Date;
  };
  conditions?: NotificationCondition[];
  metadata?: Record<string, any>;
  createdAt: Date;
  readAt?: Date;
  dismissedAt?: Date;
  archivedAt?: Date;
}

export interface NotificationAction {
  id: string;
  label: string;
  type: 'PRIMARY' | 'SECONDARY' | 'DANGER';
  handler: () => void | Promise<void>;
  url?: string;
  confirmMessage?: string;
}

export interface NotificationChannel {
  type: 'IN_APP' | 'EMAIL' | 'SMS' | 'WEBHOOK' | 'PUSH';
  enabled: boolean;
  config?: {
    email?: string;
    phone?: string;
    webhookUrl?: string;
    pushToken?: string;
  };
}

export interface NotificationCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface NotificationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: {
    event: 'DEBT_DUE' | 'CREDIT_IDENTIFIED' | 'COMPENSATION_OPPORTUNITY' | 'REGULATORY_CHANGE' | 'ANALYSIS_COMPLETE';
    conditions: NotificationCondition[];
  };
  template: Omit<IntelligentNotification, 'id' | 'createdAt' | 'readAt' | 'dismissedAt' | 'archivedAt'>;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  actionableCount: number;
  last24Hours: number;
}

class IntelligentNotificationService {
  private notifications: Map<string, IntelligentNotification> = new Map();
  private rules: Map<string, NotificationRule> = new Map();
  private subscribers: Map<string, (notification: IntelligentNotification) => void> = new Map();
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.initialized) return;
    
    await this.loadPersistedData();
    this.setupDefaultRules();
    this.startPeriodicChecks();
    this.initialized = true;
  }

  // Criar notificação inteligente
  async createNotification(notification: Omit<IntelligentNotification, 'id' | 'createdAt'>): Promise<string> {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const intelligentNotification: IntelligentNotification = {
      id,
      createdAt: new Date(),
      ...notification
    };

    // Aplicar inteligência para priorização
    intelligentNotification.priority = this.calculatePriority(intelligentNotification);
    
    // Determinar canais apropriados
    intelligentNotification.channels = this.determineChannels(intelligentNotification);
    
    // Adicionar ações inteligentes
    if (intelligentNotification.actionable) {
      intelligentNotification.actions = this.generateActions(intelligentNotification);
    }

    this.notifications.set(id, intelligentNotification);
    
    // Enviar através dos canais
    await this.sendThroughChannels(intelligentNotification);
    
    // Persistir
    await this.persistNotifications();
    
    // Notificar subscribers
    this.notifySubscribers(intelligentNotification);
    
    return id;
  }

  // Calcular prioridade inteligente
  private calculatePriority(notification: IntelligentNotification): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
    let score = 0;

    // Fatores baseados no tipo
    switch (notification.type) {
      case 'critical':
      case 'error':
        score += 40;
        break;
      case 'warning':
        score += 25;
        break;
      case 'success':
        score += 15;
        break;
      case 'info':
        score += 5;
        break;
    }

    // Fatores baseados na categoria
    switch (notification.category) {
      case 'FISCAL':
        score += 30;
        break;
      case 'FINANCIAL':
        score += 25;
        break;
      case 'LEGAL':
        score += 35;
        break;
      case 'OPERATIONAL':
        score += 15;
        break;
      case 'STRATEGIC':
        score += 20;
        break;
    }

    // Fatores baseados no conteúdo
    const urgentKeywords = ['vencimento', 'prazo', 'urgente', 'crítico', 'imediato'];
    const hasUrgentKeywords = urgentKeywords.some(keyword => 
      notification.title.toLowerCase().includes(keyword) || 
      notification.message.toLowerCase().includes(keyword)
    );
    
    if (hasUrgentKeywords) score += 20;

    // Fatores baseados em valores financeiros
    if (notification.metadata?.valor) {
      const valor = notification.metadata.valor;
      if (valor > 1000000) score += 25;
      else if (valor > 100000) score += 15;
      else if (valor > 10000) score += 10;
    }

    // Determinar prioridade final
    if (score >= 80) return 'URGENT';
    if (score >= 60) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  }

  // Determinar canais apropriados
  private determineChannels(notification: IntelligentNotification): NotificationChannel[] {
    const channels: NotificationChannel[] = [];

    // Sempre incluir notificação in-app
    channels.push({ type: 'IN_APP', enabled: true });

    // Email para notificações importantes
    if (notification.priority === 'HIGH' || notification.priority === 'URGENT') {
      channels.push({ 
        type: 'EMAIL', 
        enabled: true,
        config: { email: this.getUserEmail() }
      });
    }

    // SMS para notificações urgentes
    if (notification.priority === 'URGENT') {
      channels.push({ 
        type: 'SMS', 
        enabled: true,
        config: { phone: this.getUserPhone() }
      });
    }

    // Push notifications para notificações acionáveis
    if (notification.actionable) {
      channels.push({ type: 'PUSH', enabled: true });
    }

    return channels;
  }

  // Gerar ações inteligentes
  private generateActions(notification: IntelligentNotification): NotificationAction[] {
    const actions: NotificationAction[] = [];

    // Ações baseadas na categoria
    switch (notification.category) {
      case 'FISCAL':
        if (notification.relatedEntity?.type === 'DEBT') {
          actions.push({
            id: 'view_debt',
            label: 'Ver Débito',
            type: 'PRIMARY',
            handler: () => this.navigateToDebt(notification.relatedEntity!.id),
            url: `/dashboard/debitos/${notification.relatedEntity!.id}`
          });
          
          actions.push({
            id: 'start_compensation',
            label: 'Iniciar Compensação',
            type: 'SECONDARY',
            handler: () => this.startCompensation(notification.relatedEntity!.id)
          });
        }
        break;

      case 'FINANCIAL':
        if (notification.relatedEntity?.type === 'CREDIT') {
          actions.push({
            id: 'view_credit',
            label: 'Ver Crédito',
            type: 'PRIMARY',
            handler: () => this.navigateToCredit(notification.relatedEntity!.id),
            url: `/dashboard/creditos/${notification.relatedEntity!.id}`
          });
          
          actions.push({
            id: 'tokenize_credit',
            label: 'Tokenizar',
            type: 'SECONDARY',
            handler: () => this.tokenizeCredit(notification.relatedEntity!.id)
          });
        }
        break;

      case 'OPERATIONAL':
        actions.push({
          id: 'view_dashboard',
          label: 'Ver Dashboard',
          type: 'PRIMARY',
          handler: () => this.navigateToDashboard(),
          url: '/dashboard'
        });
        break;
    }

    // Ação universal de dispensar
    actions.push({
      id: 'dismiss',
      label: 'Dispensar',
      type: 'SECONDARY',
      handler: () => this.dismissNotification(notification.id)
    });

    return actions;
  }

  // Enviar através dos canais
  private async sendThroughChannels(notification: IntelligentNotification): Promise<void> {
    for (const channel of notification.channels) {
      if (!channel.enabled) continue;

      try {
        switch (channel.type) {
          case 'IN_APP':
            await this.sendInApp(notification);
            break;
          case 'EMAIL':
            await this.sendEmail(notification, channel.config?.email);
            break;
          case 'SMS':
            await this.sendSMS(notification, channel.config?.phone);
            break;
          case 'PUSH':
            await this.sendPush(notification);
            break;
          case 'WEBHOOK':
            await this.sendWebhook(notification, channel.config?.webhookUrl);
            break;
        }
      } catch (error) {
        console.error(`Erro ao enviar notificação via ${channel.type}:`, error);
      }
    }
  }

  // Implementações dos canais
  private async sendInApp(notification: IntelligentNotification): Promise<void> {
    // Usar o serviço existente como fallback
    simpleNotificationService.addNotification({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      relatedType: notification.category.toLowerCase() as any,
      actions: notification.actions?.map(action => ({
        label: action.label,
        action: action.handler,
        type: action.type.toLowerCase() as any
      }))
    });
  }

  private async sendEmail(notification: IntelligentNotification, email?: string): Promise<void> {
    if (!email) return;
    
    // Simulação de envio de email
    console.log(`[EMAIL] Enviando para ${email}:`, {
      subject: notification.title,
      body: notification.message,
      priority: notification.priority
    });
    
    // Aqui integraria com serviço real de email (SendGrid, AWS SES, etc.)
  }

  private async sendSMS(notification: IntelligentNotification, phone?: string): Promise<void> {
    if (!phone) return;
    
    // Simulação de envio de SMS
    console.log(`[SMS] Enviando para ${phone}:`, {
      message: `${notification.title}: ${notification.message}`,
      priority: notification.priority
    });
    
    // Aqui integraria com serviço real de SMS (Twilio, AWS SNS, etc.)
  }

  private async sendPush(notification: IntelligentNotification): Promise<void> {
    // Simulação de push notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }
  }

  private async sendWebhook(notification: IntelligentNotification, webhookUrl?: string): Promise<void> {
    if (!webhookUrl) return;
    
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: notification.id,
          type: notification.type,
          priority: notification.priority,
          category: notification.category,
          title: notification.title,
          message: notification.message,
          timestamp: notification.createdAt.toISOString()
        })
      });
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
    }
  }

  // Configurar regras padrão
  private setupDefaultRules(): void {
    const defaultRules: NotificationRule[] = [
      {
        id: 'debt_due_soon',
        name: 'Débitos Vencendo',
        description: 'Alertar sobre débitos com vencimento em 30 dias',
        enabled: true,
        trigger: {
          event: 'DEBT_DUE',
          conditions: [
            { field: 'daysToExpiry', operator: 'LESS_THAN', value: 30 }
          ]
        },
        template: {
          type: 'warning',
          priority: 'HIGH',
          category: 'FISCAL',
          title: 'Débito Vencendo',
          message: 'Você tem débitos vencendo em breve',
          actionable: true,
          channels: []
        },
        triggerCount: 0
      },
      
      {
        id: 'high_value_credit',
        name: 'Créditos Alto Valor',
        description: 'Notificar sobre créditos identificados acima de R$ 50.000',
        enabled: true,
        trigger: {
          event: 'CREDIT_IDENTIFIED',
          conditions: [
            { field: 'valor', operator: 'GREATER_THAN', value: 50000 }
          ]
        },
        template: {
          type: 'success',
          priority: 'HIGH',
          category: 'FINANCIAL',
          title: 'Crédito Alto Valor Identificado',
          message: 'Novo crédito de alto valor foi identificado',
          actionable: true,
          channels: []
        },
        triggerCount: 0
      },
      
      {
        id: 'compensation_opportunity',
        name: 'Oportunidade de Compensação',
        description: 'Alertar sobre oportunidades de compensação',
        enabled: true,
        trigger: {
          event: 'COMPENSATION_OPPORTUNITY',
          conditions: []
        },
        template: {
          type: 'info',
          priority: 'MEDIUM',
          category: 'FISCAL',
          title: 'Oportunidade de Compensação',
          message: 'Nova oportunidade de compensação identificada',
          actionable: true,
          channels: []
        },
        triggerCount: 0
      }
    ];

    defaultRules.forEach(rule => {
      if (!this.rules.has(rule.id)) {
        this.rules.set(rule.id, rule);
      }
    });
  }

  // Métodos de ação
  private navigateToDebt(debtId: string): void {
    window.location.href = `/dashboard/debitos/${debtId}`;
  }

  private navigateToCredit(creditId: string): void {
    window.location.href = `/dashboard/creditos/${creditId}`;
  }

  private navigateToDashboard(): void {
    window.location.href = '/dashboard';
  }

  private startCompensation(debtId: string): void {
    window.location.href = `/dashboard/compensacao?debt=${debtId}`;
  }

  private tokenizeCredit(creditId: string): void {
    window.location.href = `/dashboard/tokenizacao?credit=${creditId}`;
  }

  private dismissNotification(notificationId: string): void {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.dismissedAt = new Date();
      this.persistNotifications();
    }
  }

  // Métodos públicos
  public async getNotifications(filters?: {
    unreadOnly?: boolean;
    category?: string;
    priority?: string;
    limit?: number;
  }): Promise<IntelligentNotification[]> {
    await this.initialize();
    
    let notifications = Array.from(this.notifications.values());
    
    if (filters?.unreadOnly) {
      notifications = notifications.filter(n => !n.readAt);
    }
    
    if (filters?.category) {
      notifications = notifications.filter(n => n.category === filters.category);
    }
    
    if (filters?.priority) {
      notifications = notifications.filter(n => n.priority === filters.priority);
    }
    
    // Ordenar por prioridade e data
    notifications.sort((a, b) => {
      const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    
    if (filters?.limit) {
      notifications = notifications.slice(0, filters.limit);
    }
    
    return notifications;
  }

  public getStats(): NotificationStats {
    const notifications = Array.from(this.notifications.values());
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.readAt).length,
      byType: this.groupBy(notifications, 'type'),
      byCategory: this.groupBy(notifications, 'category'),
      byPriority: this.groupBy(notifications, 'priority'),
      actionableCount: notifications.filter(n => n.actionable).length,
      last24Hours: notifications.filter(n => n.createdAt > oneDayAgo).length
    };
  }

  public markAsRead(notificationId: string): void {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.readAt = new Date();
      this.persistNotifications();
    }
  }

  public subscribe(id: string, callback: (notification: IntelligentNotification) => void): void {
    this.subscribers.set(id, callback);
  }

  public unsubscribe(id: string): void {
    this.subscribers.delete(id);
  }

  // Métodos utilitários
  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce((groups, item) => {
      const value = item[key];
      groups[value] = (groups[value] || 0) + 1;
      return groups;
    }, {});
  }

  private notifySubscribers(notification: IntelligentNotification): void {
    this.subscribers.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Erro ao notificar subscriber:', error);
      }
    });
  }

  private startPeriodicChecks(): void {
    // Verificar regras a cada 5 minutos
    setInterval(() => {
      this.checkRules();
    }, 5 * 60 * 1000);
  }

  private async checkRules(): Promise<void> {
    // Implementar verificação de regras
    // Por enquanto, simulação básica
  }

  private getUserEmail(): string {
    return localStorage.getItem('user_email') || 'user@example.com';
  }

  private getUserPhone(): string {
    return localStorage.getItem('user_phone') || '+5511999999999';
  }

  private async loadPersistedData(): Promise<void> {
    try {
      const notificationsData = localStorage.getItem('intelligent_notifications');
      if (notificationsData) {
        const parsed = JSON.parse(notificationsData);
        parsed.forEach((n: any) => {
          n.createdAt = new Date(n.createdAt);
          if (n.readAt) n.readAt = new Date(n.readAt);
          if (n.dismissedAt) n.dismissedAt = new Date(n.dismissedAt);
          if (n.archivedAt) n.archivedAt = new Date(n.archivedAt);
          this.notifications.set(n.id, n);
        });
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }

  private async persistNotifications(): Promise<void> {
    try {
      const notifications = Array.from(this.notifications.values());
      localStorage.setItem('intelligent_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Erro ao persistir notificações:', error);
    }
  }
}

export const intelligentNotificationService = new IntelligentNotificationService();