/**
 * 🤖 SERVIÇO DE ATIVIDADE EM TEMPO REAL - TRIBUTA.AI
 *
 * Este serviço simula e gerencia atividades em tempo real dos bots,
 * mostrando que a plataforma está funcionando e que os dados estão
 * sendo inseridos e processados pelos bots automaticamente.
 */

interface BotActivity {
  id: string;
  botName: string;
  action: string;
  description: string;
  timestamp: Date;
  type: 'trade' | 'analysis' | 'compensation' | 'fiscal' | 'marketplace' | 'tokenization';
  status: 'processing' | 'completed' | 'error';
  metadata: {
    amount?: number;
    documentId?: string;
    transactionId?: string;
    targetUrl?: string;
    progress?: number;
  };
}

interface BotStatus {
  name: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  lastActivity: Date;
  totalActions: number;
  successRate: number;
  currentTask?: string;
}

class RealtimeActivityService {
  private activities: BotActivity[] = [];
  private botStatuses: Map<string, BotStatus> = new Map();
  private listeners: Set<(activities: BotActivity[]) => void> = new Set();
  private statusListeners: Set<(statuses: BotStatus[]) => void> = new Set();
  private isRunning: boolean = false;
  private activityInterval: NodeJS.Timeout | null = null;

  // Configuração dos bots
  private bots = [
    {
      name: 'TradeMaster',
      type: 'trade',
      actions: [
        'Analisando oportunidades de trading',
        'Executando compra de título',
        'Vendendo posição com lucro',
        'Ajustando estratégia de trading',
        'Monitorando mercado em tempo real',
      ],
    },
    {
      name: 'AnalyzerPro',
      type: 'analysis',
      actions: [
        'Analisando declarações fiscais',
        'Identificando créditos tributários',
        'Calculando oportunidades de compensação',
        'Processando dados da Receita Federal',
        'Gerando relatório de análise',
      ],
    },
    {
      name: 'CompensaBot',
      type: 'compensation',
      actions: [
        'Processando compensação multilateral',
        'Verificando elegibilidade de créditos',
        'Executando compensação automática',
        'Validando documentos fiscais',
        'Atualizando saldos de créditos',
      ],
    },
    {
      name: 'FiscalAI',
      type: 'fiscal',
      actions: [
        'Preenchendo DCTF-Web automaticamente',
        'Validando obrigações fiscais',
        'Calculando impostos devidos',
        'Enviando declaração à Receita',
        'Monitorando prazos fiscais',
      ],
    },
    {
      name: 'MarketBot',
      type: 'marketplace',
      actions: [
        'Criando nova oferta no marketplace',
        'Avaliando propostas recebidas',
        'Executando leilão automático',
        'Negociando preços de títulos',
        'Finalizando transação no marketplace',
      ],
    },
    {
      name: 'TokenizerAI',
      type: 'tokenization',
      actions: [
        'Tokenizando crédito tributário',
        'Validando smart contract',
        'Registrando token na blockchain',
        'Verificando transação na rede',
        'Atualizando registro de propriedade',
      ],
    },
  ];

  constructor() {
    this.initializeBotStatuses();
    this.startRealtimeActivity();
  }

  /**
   * Inicializa status dos bots
   */
  private initializeBotStatuses() {
    this.bots.forEach(bot => {
      this.botStatuses.set(bot.name, {
        name: bot.name,
        status: 'active',
        lastActivity: new Date(),
        totalActions: Math.floor(Math.random() * 1000) + 100,
        successRate: 95 + Math.random() * 5, // 95-100%
        currentTask: undefined,
      });
    });
  }

  /**
   * Inicia simulação de atividade em tempo real
   */
  public startRealtimeActivity() {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log('🤖 Serviço de Atividade em Tempo Real iniciado');

    // Gera nova atividade a cada 2-8 segundos
    this.activityInterval = setInterval(
      () => {
        this.generateBotActivity();
      },
      Math.random() * 6000 + 2000
    );
  }

  /**
   * Para simulação de atividade
   */
  public stopRealtimeActivity() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.activityInterval) {
      clearInterval(this.activityInterval);
      this.activityInterval = null;
    }
    console.log('🤖 Serviço de Atividade em Tempo Real parado');
  }

  /**
   * Gera nova atividade de bot
   */
  private generateBotActivity() {
    const bot = this.bots[Math.floor(Math.random() * this.bots.length)];
    const action = bot.actions[Math.floor(Math.random() * bot.actions.length)];

    const activity: BotActivity = {
      id: `activity-${Date.now()}-${Math.random()}`,
      botName: bot.name,
      action: action,
      description: this.generateDescription(bot.type, action),
      timestamp: new Date(),
      type: bot.type as any,
      status: 'processing',
      metadata: this.generateMetadata(bot.type),
    };

    // Adiciona atividade
    this.activities.unshift(activity);

    // Mantém apenas as últimas 100 atividades
    if (this.activities.length > 100) {
      this.activities = this.activities.slice(0, 100);
    }

    // Atualiza status do bot
    const botStatus = this.botStatuses.get(bot.name);
    if (botStatus) {
      botStatus.status = 'processing';
      botStatus.lastActivity = new Date();
      botStatus.currentTask = action;
      botStatus.totalActions++;
    }

    // Notifica listeners
    this.notifyActivityListeners();
    this.notifyStatusListeners();

    // Simula conclusão da atividade após 1-5 segundos
    setTimeout(
      () => {
        this.completeActivity(activity.id, bot.name);
      },
      Math.random() * 4000 + 1000
    );
  }

  /**
   * Completa uma atividade
   */
  private completeActivity(activityId: string, botName: string) {
    const activity = this.activities.find(a => a.id === activityId);
    if (activity) {
      activity.status = Math.random() > 0.05 ? 'completed' : 'error'; // 95% sucesso
      activity.metadata.progress = 100;
    }

    // Atualiza status do bot
    const botStatus = this.botStatuses.get(botName);
    if (botStatus) {
      botStatus.status = 'active';
      botStatus.currentTask = undefined;

      // Atualiza taxa de sucesso
      if (activity?.status === 'completed') {
        botStatus.successRate = Math.min(100, botStatus.successRate + 0.1);
      } else {
        botStatus.successRate = Math.max(90, botStatus.successRate - 0.5);
      }
    }

    this.notifyActivityListeners();
    this.notifyStatusListeners();
  }

  /**
   * Gera descrição detalhada da atividade
   */
  private generateDescription(type: string, action: string): string {
    const descriptions = {
      trade: [
        'Executando estratégia de trading automatizada',
        'Analisando padrões de mercado com IA',
        'Otimizando portfolio de títulos',
        'Identificando arbitragem entre mercados',
      ],
      analysis: [
        'Processando 1.247 documentos fiscais',
        'Aplicando algoritmos de ML para identificação',
        'Cruzando dados com base da Receita Federal',
        'Validando elegibilidade de créditos',
      ],
      compensation: [
        'Calculando compensação multilateral',
        'Verificando saldos em tempo real',
        'Otimizando fluxo de compensação',
        'Processando documentos de homologação',
      ],
      fiscal: [
        'Integrando com APIs governamentais',
        'Validando consistência de dados',
        'Aplicando regras fiscais vigentes',
        'Gerando documentos automaticamente',
      ],
      marketplace: [
        'Analisando demanda de mercado',
        'Calculando preços competitivos',
        'Executando lógica de leilão',
        'Processando transações seguras',
      ],
      tokenization: [
        'Validando smart contracts na blockchain',
        'Registrando propriedade digital',
        'Verificando consenso da rede',
        'Atualizando ledger distribuído',
      ],
    };

    const typeDescriptions = descriptions[type as keyof typeof descriptions] || descriptions.trade;
    return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
  }

  /**
   * Gera metadados específicos por tipo
   */
  private generateMetadata(type: string) {
    const baseMetadata = {
      progress: Math.floor(Math.random() * 30) + 10, // 10-40% inicial
    };

    switch (type) {
      case 'trade':
        return {
          ...baseMetadata,
          amount: Math.floor(Math.random() * 500000) + 50000,
          transactionId: `TXN-${Date.now()}`,
          targetUrl: '/dashboard/trading-pro',
        };

      case 'analysis':
        return {
          ...baseMetadata,
          amount: Math.floor(Math.random() * 200000) + 20000,
          documentId: `DOC-${Date.now()}`,
          targetUrl: '/dashboard/compensacao',
        };

      case 'compensation':
        return {
          ...baseMetadata,
          amount: Math.floor(Math.random() * 300000) + 30000,
          transactionId: `COMP-${Date.now()}`,
          targetUrl: '/dashboard/marketplace/compensacao',
        };

      case 'fiscal':
        return {
          ...baseMetadata,
          documentId: `DCTF-${Date.now()}`,
          targetUrl: '/dashboard/declaracoes',
        };

      case 'marketplace':
        return {
          ...baseMetadata,
          amount: Math.floor(Math.random() * 400000) + 40000,
          transactionId: `MKT-${Date.now()}`,
          targetUrl: '/dashboard/marketplace',
        };

      case 'tokenization':
        return {
          ...baseMetadata,
          amount: Math.floor(Math.random() * 250000) + 25000,
          transactionId: `TOKEN-${Date.now()}`,
          targetUrl: '/dashboard/tokenizacao',
        };

      default:
        return baseMetadata;
    }
  }

  /**
   * Adiciona listener para atividades
   */
  public addActivityListener(callback: (activities: BotActivity[]) => void) {
    this.listeners.add(callback);
  }

  /**
   * Remove listener para atividades
   */
  public removeActivityListener(callback: (activities: BotActivity[]) => void) {
    this.listeners.delete(callback);
  }

  /**
   * Adiciona listener para status dos bots
   */
  public addStatusListener(callback: (statuses: BotStatus[]) => void) {
    this.statusListeners.add(callback);
  }

  /**
   * Remove listener para status dos bots
   */
  public removeStatusListener(callback: (statuses: BotStatus[]) => void) {
    this.statusListeners.delete(callback);
  }

  /**
   * Notifica listeners sobre atividades
   */
  private notifyActivityListeners() {
    this.listeners.forEach(callback => {
      try {
        callback([...this.activities]);
      } catch (error) {
        console.error('Erro ao notificar listener de atividade:', error);
      }
    });
  }

  /**
   * Notifica listeners sobre status dos bots
   */
  private notifyStatusListeners() {
    const statuses = Array.from(this.botStatuses.values());
    this.statusListeners.forEach(callback => {
      try {
        callback([...statuses]);
      } catch (error) {
        console.error('Erro ao notificar listener de status:', error);
      }
    });
  }

  /**
   * Obtém atividades recentes
   */
  public getRecentActivities(limit: number = 20): BotActivity[] {
    return this.activities.slice(0, limit);
  }

  /**
   * Obtém status de todos os bots
   */
  public getBotStatuses(): BotStatus[] {
    return Array.from(this.botStatuses.values());
  }

  /**
   * Obtém estatísticas gerais
   */
  public getStatistics() {
    const totalActivities = this.activities.length;
    const completedActivities = this.activities.filter(a => a.status === 'completed').length;
    const errorActivities = this.activities.filter(a => a.status === 'error').length;
    const processingActivities = this.activities.filter(a => a.status === 'processing').length;

    const activeBots = Array.from(this.botStatuses.values()).filter(
      b => b.status === 'active' || b.status === 'processing'
    ).length;

    const averageSuccessRate =
      Array.from(this.botStatuses.values()).reduce((sum, bot) => sum + bot.successRate, 0) /
      this.botStatuses.size;

    return {
      totalActivities,
      completedActivities,
      errorActivities,
      processingActivities,
      activeBots,
      totalBots: this.botStatuses.size,
      averageSuccessRate: Math.round(averageSuccessRate * 100) / 100,
      successRate: totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0,
    };
  }

  /**
   * Força geração de atividade específica
   */
  public generateSpecificActivity(botName: string, actionType?: string) {
    const bot = this.bots.find(b => b.name === botName);
    if (!bot) return;

    const action = actionType || bot.actions[Math.floor(Math.random() * bot.actions.length)];

    const activity: BotActivity = {
      id: `manual-${Date.now()}-${Math.random()}`,
      botName: bot.name,
      action: action,
      description: this.generateDescription(bot.type, action),
      timestamp: new Date(),
      type: bot.type as any,
      status: 'processing',
      metadata: this.generateMetadata(bot.type),
    };

    this.activities.unshift(activity);
    this.notifyActivityListeners();

    // Completa após 2 segundos
    setTimeout(() => {
      this.completeActivity(activity.id, bot.name);
    }, 2000);
  }
}

// Instância singleton
export const realtimeActivityService = new RealtimeActivityService();
export default realtimeActivityService;
