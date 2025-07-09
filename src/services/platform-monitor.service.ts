import { EventEmitter } from 'events';

interface SystemMetric {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  unit: string;
  threshold: { warning: number; critical: number };
  lastUpdate: Date;
  history: Array<{ timestamp: Date; value: number }>;
}

interface BotMetric {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error' | 'maintenance';
  performance: number;
  tasksCompleted: number;
  tasksQueue: number;
  uptime: number;
  lastAction: string;
  errors: number;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'system' | 'bot' | 'transaction' | 'security' | 'user';
  read: boolean;
  actionRequired: boolean;
  details?: string;
}

interface PlatformHealth {
  overall: number;
  systems: SystemMetric[];
  bots: BotMetric[];
  notifications: Notification[];
  lastUpdate: Date;
}

class PlatformMonitorService extends EventEmitter {
  private static instance: PlatformMonitorService;
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private metricsHistory: Map<string, Array<{ timestamp: Date; value: number }>> = new Map();

  private systemMetrics: SystemMetric[] = [
    {
      id: 'database',
      name: 'Base de Dados',
      status: 'healthy',
      value: 99.2,
      unit: '%',
      threshold: { warning: 95, critical: 90 },
      lastUpdate: new Date(),
      history: [],
    },
    {
      id: 'blockchain',
      name: 'Rede Blockchain',
      status: 'healthy',
      value: 97.8,
      unit: '%',
      threshold: { warning: 95, critical: 85 },
      lastUpdate: new Date(),
      history: [],
    },
    {
      id: 'api-external',
      name: 'APIs Externas',
      status: 'warning',
      value: 94.1,
      unit: '%',
      threshold: { warning: 95, critical: 80 },
      lastUpdate: new Date(),
      history: [],
    },
    {
      id: 'security',
      name: 'Segurança',
      status: 'healthy',
      value: 99.8,
      unit: '%',
      threshold: { warning: 98, critical: 95 },
      lastUpdate: new Date(),
      history: [],
    },
    {
      id: 'performance',
      name: 'Performance',
      status: 'healthy',
      value: 96.5,
      unit: '%',
      threshold: { warning: 90, critical: 80 },
      lastUpdate: new Date(),
      history: [],
    },
    {
      id: 'storage',
      name: 'Armazenamento',
      status: 'healthy',
      value: 78.2,
      unit: '%',
      threshold: { warning: 85, critical: 95 },
      lastUpdate: new Date(),
      history: [],
    },
  ];

  private botMetrics: BotMetric[] = [
    {
      id: 'trading-bot-alpha',
      name: 'Bot Trading Alpha',
      status: 'active',
      performance: 94.7,
      tasksCompleted: 247,
      tasksQueue: 3,
      uptime: Date.now() - (23 * 60 * 60 * 1000 + 45 * 60 * 1000),
      lastAction: 'Executou compensação bilateral - R$ 45.000',
      errors: 0,
    },
    {
      id: 'analysis-bot',
      name: 'Bot Análise IA',
      status: 'active',
      performance: 98.2,
      tasksCompleted: 892,
      tasksQueue: 7,
      uptime: Date.now() - (47 * 60 * 60 * 1000 + 12 * 60 * 1000),
      lastAction: 'Identificou 3 novos créditos ICMS',
      errors: 1,
    },
    {
      id: 'compliance-bot',
      name: 'Bot Compliance',
      status: 'idle',
      performance: 91.3,
      tasksCompleted: 156,
      tasksQueue: 0,
      uptime: Date.now() - (12 * 60 * 60 * 1000 + 30 * 60 * 1000),
      lastAction: 'Verificou obrigações fiscais - OK',
      errors: 0,
    },
    {
      id: 'notification-bot',
      name: 'Bot Notificações',
      status: 'active',
      performance: 99.1,
      tasksCompleted: 1247,
      tasksQueue: 12,
      uptime: Date.now() - (72 * 60 * 60 * 1000 + 15 * 60 * 1000),
      lastAction: 'Enviou 12 alertas de prazo',
      errors: 0,
    },
    {
      id: 'recovery-bot',
      name: 'Bot Recuperação',
      status: 'active',
      performance: 96.8,
      tasksCompleted: 89,
      tasksQueue: 5,
      uptime: Date.now() - (18 * 60 * 60 * 1000 + 22 * 60 * 1000),
      lastAction: 'Processou recuperação IRPJ - R$ 23.800',
      errors: 0,
    },
    {
      id: 'marketplace-bot',
      name: 'Bot Marketplace',
      status: 'active',
      performance: 93.4,
      tasksCompleted: 334,
      tasksQueue: 8,
      uptime: Date.now() - (31 * 60 * 60 * 1000 + 45 * 60 * 1000),
      lastAction: 'Executou leilão de títulos - 15 participantes',
      errors: 2,
    },
  ];

  private notifications: Notification[] = [];

  private constructor() {
    super();
    this.initializeMetricsHistory();
  }

  public static getInstance(): PlatformMonitorService {
    if (!PlatformMonitorService.instance) {
      PlatformMonitorService.instance = new PlatformMonitorService();
    }
    return PlatformMonitorService.instance;
  }

  private initializeMetricsHistory(): void {
    // Inicializar histórico com dados simulados
    const now = new Date();
    this.systemMetrics.forEach(metric => {
      const history = [];
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        const baseValue = metric.value;
        const variance = (Math.random() - 0.5) * 10;
        const value = Math.max(0, Math.min(100, baseValue + variance));
        history.push({ timestamp, value });
      }
      metric.history = history;
      this.metricsHistory.set(metric.id, history);
    });
  }

  public startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.updateMetrics();
      this.updateBots();
      this.checkAlerts();
      this.emit('metricsUpdated', this.getPlatformHealth());
    }, 5000); // Atualiza a cada 5 segundos

    this.addNotification({
      type: 'success',
      title: 'Monitoramento Iniciado',
      message: 'Sistema de monitoramento da plataforma ativado',
      priority: 'medium',
      category: 'system',
      actionRequired: false,
    });

    console.log('🔍 Platform Monitor: Monitoramento iniciado');
  }

  public stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.addNotification({
      type: 'warning',
      title: 'Monitoramento Pausado',
      message: 'Sistema de monitoramento foi pausado pelo administrador',
      priority: 'medium',
      category: 'system',
      actionRequired: false,
    });

    console.log('⏸️ Platform Monitor: Monitoramento pausado');
  }

  private updateMetrics(): void {
    const now = new Date();

    this.systemMetrics.forEach(metric => {
      // Simular variação realística
      const variance = (Math.random() - 0.5) * 2;
      let newValue = metric.value + variance;

      // Aplicar tendências específicas
      if (metric.id === 'api-external') {
        // APIs externas podem ter mais instabilidade
        newValue += (Math.random() - 0.6) * 3;
      } else if (metric.id === 'storage') {
        // Storage tende a crescer ao longo do tempo
        newValue += 0.1;
      }

      // Manter dentro dos limites
      newValue = Math.max(0, Math.min(100, newValue));

      // Atualizar status baseado nos thresholds
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (newValue < metric.threshold.critical) {
        status = 'critical';
      } else if (newValue < metric.threshold.warning) {
        status = 'warning';
      }

      metric.value = newValue;
      metric.status = status;
      metric.lastUpdate = now;

      // Atualizar histórico
      const history = this.metricsHistory.get(metric.id) || [];
      history.push({ timestamp: now, value: newValue });

      // Manter apenas últimas 24 horas
      const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const filteredHistory = history.filter(h => h.timestamp > cutoff);

      metric.history = filteredHistory;
      this.metricsHistory.set(metric.id, filteredHistory);
    });
  }

  private updateBots(): void {
    this.botMetrics.forEach(bot => {
      // Simular atividade dos bots
      if (bot.status === 'active') {
        // Chance de completar tarefas
        if (Math.random() < 0.3) {
          bot.tasksCompleted += Math.floor(Math.random() * 3) + 1;
          bot.tasksQueue = Math.max(0, bot.tasksQueue - 1);

          // Atualizar última ação
          const actions = this.getBotActions(bot.id);
          bot.lastAction = actions[Math.floor(Math.random() * actions.length)];
        }

        // Chance de receber novas tarefas
        if (Math.random() < 0.2) {
          bot.tasksQueue += Math.floor(Math.random() * 2) + 1;
        }

        // Atualizar performance
        const performanceChange = (Math.random() - 0.5) * 2;
        bot.performance = Math.max(80, Math.min(100, bot.performance + performanceChange));

        // Chance pequena de erro
        if (Math.random() < 0.01) {
          bot.errors += 1;
        }
      }

      // Atualizar uptime
      bot.uptime += 5000; // 5 segundos
    });
  }

  private getBotActions(botId: string): string[] {
    const actionMap: Record<string, string[]> = {
      'trading-bot-alpha': [
        'Executou compensação bilateral - R$ 45.000',
        'Analisou oportunidade de trading - ICMS',
        'Processou transação blockchain',
        'Identificou arbitragem - R$ 12.500',
      ],
      'analysis-bot': [
        'Identificou 3 novos créditos ICMS',
        'Analisou declaração fiscal - TechCorp',
        'Processou análise de obrigações',
        'Detectou inconsistência - PIS/COFINS',
      ],
      'compliance-bot': [
        'Verificou obrigações fiscais - OK',
        'Monitorou prazos de entrega',
        'Validou documentação fiscal',
        'Auditou transações - Conformidade OK',
      ],
      'notification-bot': [
        'Enviou 12 alertas de prazo',
        'Notificou usuários sobre atualizações',
        'Processou notificações em lote',
        'Enviou relatório semanal',
      ],
      'recovery-bot': [
        'Processou recuperação IRPJ - R$ 23.800',
        'Iniciou processo de recuperação ICMS',
        'Finalizou recuperação PIS/COFINS',
        'Identificou crédito extemporâneo',
      ],
      'marketplace-bot': [
        'Executou leilão de títulos - 15 participantes',
        'Processou oferta de compra - R$ 89.000',
        'Atualizou preços de mercado',
        'Facilitou negociação bilateral',
      ],
    };

    return actionMap[botId] || ['Executou tarefa padrão'];
  }

  private checkAlerts(): void {
    // Verificar métricas críticas
    this.systemMetrics.forEach(metric => {
      if (metric.status === 'critical' && !this.hasRecentAlert(metric.id, 'critical')) {
        this.addNotification({
          type: 'error',
          title: `${metric.name} Crítico`,
          message: `${metric.name} está em estado crítico: ${metric.value.toFixed(1)}${metric.unit}`,
          priority: 'critical',
          category: 'system',
          actionRequired: true,
          details: `Threshold crítico: ${metric.threshold.critical}${metric.unit}\nValor atual: ${metric.value.toFixed(1)}${metric.unit}\nÚltima atualização: ${metric.lastUpdate.toLocaleString()}`,
        });
      } else if (metric.status === 'warning' && !this.hasRecentAlert(metric.id, 'warning')) {
        this.addNotification({
          type: 'warning',
          title: `${metric.name} em Alerta`,
          message: `${metric.name} está abaixo do esperado: ${metric.value.toFixed(1)}${metric.unit}`,
          priority: 'medium',
          category: 'system',
          actionRequired: false,
          details: `Threshold de alerta: ${metric.threshold.warning}${metric.unit}\nValor atual: ${metric.value.toFixed(1)}${metric.unit}`,
        });
      }
    });

    // Verificar bots com erro
    this.botMetrics.forEach(bot => {
      if (bot.status === 'error' && !this.hasRecentAlert(bot.id, 'bot-error')) {
        this.addNotification({
          type: 'error',
          title: `${bot.name} com Erro`,
          message: `Bot apresentou falha e precisa de atenção`,
          priority: 'high',
          category: 'bot',
          actionRequired: true,
          details: `Performance: ${bot.performance.toFixed(1)}%\nErros: ${bot.errors}\nÚltima ação: ${bot.lastAction}`,
        });
      }
    });
  }

  private hasRecentAlert(id: string, type: string): boolean {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.notifications.some(
      notif =>
        notif.details?.includes(id) &&
        notif.timestamp > fiveMinutesAgo &&
        notif.title.toLowerCase().includes(type.toLowerCase())
    );
  }

  private addNotification(notif: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
      ...notif,
    };

    this.notifications.unshift(notification);

    // Manter apenas últimas 100 notificações
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    this.emit('notificationAdded', notification);
  }

  public getPlatformHealth(): PlatformHealth {
    const overallHealth = this.calculateOverallHealth();

    return {
      overall: overallHealth,
      systems: [...this.systemMetrics],
      bots: [...this.botMetrics],
      notifications: [...this.notifications],
      lastUpdate: new Date(),
    };
  }

  private calculateOverallHealth(): number {
    const systemAvg =
      this.systemMetrics.reduce((sum, metric) => sum + metric.value, 0) / this.systemMetrics.length;
    const botAvg =
      this.botMetrics.reduce((sum, bot) => sum + bot.performance, 0) / this.botMetrics.length;

    return (systemAvg + botAvg) / 2;
  }

  public getNotifications(filter?: {
    category?: string;
    priority?: string;
    unread?: boolean;
  }): Notification[] {
    let filtered = [...this.notifications];

    if (filter?.category) {
      filtered = filtered.filter(n => n.category === filter.category);
    }

    if (filter?.priority) {
      filtered = filtered.filter(n => n.priority === filter.priority);
    }

    if (filter?.unread) {
      filtered = filtered.filter(n => !n.read);
    }

    return filtered;
  }

  public markNotificationAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.emit('notificationUpdated', notification);
    }
  }

  public deleteNotification(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.emit('notificationDeleted', id);
    }
  }

  public getSystemMetric(id: string): SystemMetric | undefined {
    return this.systemMetrics.find(m => m.id === id);
  }

  public getBotMetric(id: string): BotMetric | undefined {
    return this.botMetrics.find(b => b.id === id);
  }

  public isMonitoringActive(): boolean {
    return this.isMonitoring;
  }

  // Métodos para IA Administrativa
  public executeAutomaticFix(issue: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        // Simular correção automática
        this.addNotification({
          type: 'success',
          title: 'Correção Automática Executada',
          message: `ARIA Admin resolveu automaticamente: ${issue}`,
          priority: 'medium',
          category: 'system',
          actionRequired: false,
          details: `Ação executada pela IA:\n- Identificou problema: ${issue}\n- Aplicou correção padrão\n- Sistema normalizado`,
        });
        resolve(true);
      }, 2000);
    });
  }

  public optimizePerformance(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        // Simular otimização
        this.systemMetrics.forEach(metric => {
          if (metric.value < 95) {
            metric.value = Math.min(100, metric.value + 5);
            if (metric.value >= metric.threshold.warning) {
              metric.status = 'healthy';
            }
          }
        });

        this.addNotification({
          type: 'success',
          title: 'Otimização Automática Concluída',
          message: 'ARIA Admin otimizou performance dos sistemas',
          priority: 'medium',
          category: 'system',
          actionRequired: false,
          details:
            'Otimizações aplicadas:\n- Cache otimizado\n- Conexões de banco ajustadas\n- Recursos realocados\n- Performance melhorada em 5%',
        });
        resolve();
      }, 3000);
    });
  }
}

export const platformMonitor = PlatformMonitorService.getInstance();
export type { PlatformHealth, SystemMetric, BotMetric, Notification };
