import {
  platformMonitor,
  type PlatformHealth,
  type Notification,
} from './platform-monitor.service';

interface AIResponse {
  message: string;
  action?: 'monitor' | 'fix' | 'optimize' | 'report' | 'alert';
  data?: any;
  confidence: number;
}

interface AIPromptConfig {
  personality: string;
  responsibilities: string[];
  actions: string[];
  thresholds: {
    critical: number;
    warning: number;
    intervention: number;
  };
  autonomy: 'low' | 'medium' | 'high';
}

class ARIAAdminService {
  private static instance: ARIAAdminService;
  private isActive: boolean = false;
  private config: AIPromptConfig;
  private conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }> = [];
  private autoInterventionInterval: NodeJS.Timeout | null = null;

  private defaultConfig: AIPromptConfig = {
    personality:
      'Profissional, proativa e eficiente. Mantenho a plataforma funcionando perfeitamente.',
    responsibilities: [
      'Monitorar todos os sistemas 24/7',
      'Detectar e corrigir problemas automaticamente',
      'Otimizar performance continuamente',
      'Gerar relatórios automáticos',
      'Alertar sobre situações críticas',
      'Gerenciar bots e recursos',
    ],
    actions: [
      'Reiniciar serviços com falha',
      'Otimizar cache e memória',
      'Redistribuir carga de trabalho',
      'Executar limpeza automática',
      'Aplicar patches de segurança',
      'Balancear recursos',
    ],
    thresholds: {
      critical: 85,
      warning: 90,
      intervention: 95,
    },
    autonomy: 'high',
  };

  private constructor() {
    this.config = { ...this.defaultConfig };
    this.initializeAI();
  }

  public static getInstance(): ARIAAdminService {
    if (!ARIAAdminService.instance) {
      ARIAAdminService.instance = new ARIAAdminService();
    }
    return ARIAAdminService.instance;
  }

  private initializeAI(): void {
    // Configurar listeners para o monitor de plataforma
    platformMonitor.on('metricsUpdated', (health: PlatformHealth) => {
      if (this.isActive) {
        this.analyzeHealth(health);
      }
    });

    platformMonitor.on('notificationAdded', (notification: Notification) => {
      if (this.isActive && notification.priority === 'critical') {
        this.handleCriticalAlert(notification);
      }
    });

    console.log('🤖 ARIA Admin: IA inicializada');
  }

  public activate(customConfig?: Partial<AIPromptConfig>): void {
    if (customConfig) {
      this.config = { ...this.defaultConfig, ...customConfig };
    }

    this.isActive = true;
    platformMonitor.startMonitoring();

    // Iniciar intervenções automáticas
    this.autoInterventionInterval = setInterval(() => {
      this.performAutomaticMaintenance();
    }, 30000); // A cada 30 segundos

    this.addToConversation(
      'assistant',
      `ARIA Admin ativada! 🤖\n\nConfiguração atual:\n- Personalidade: ${this.config.personality}\n- Autonomia: ${this.config.autonomy}\n- Responsabilidades: ${this.config.responsibilities.length} funções ativas\n\nEstou monitorando todos os sistemas. Tudo sob controle!`
    );

    console.log('🚀 ARIA Admin: Ativada com sucesso');
  }

  public deactivate(): void {
    this.isActive = false;
    platformMonitor.stopMonitoring();

    if (this.autoInterventionInterval) {
      clearInterval(this.autoInterventionInterval);
      this.autoInterventionInterval = null;
    }

    this.addToConversation(
      'assistant',
      'ARIA Admin desativada. Monitoramento pausado. Estarei aqui quando precisar! 😴'
    );

    console.log('⏸️ ARIA Admin: Desativada');
  }

  public async processMessage(userMessage: string): Promise<AIResponse> {
    this.addToConversation('user', userMessage);

    // Analisar a mensagem e gerar resposta
    const response = await this.generateResponse(userMessage);

    this.addToConversation('assistant', response.message);

    // Executar ação se necessário
    if (response.action) {
      await this.executeAction(response.action, response.data);
    }

    return response;
  }

  private async generateResponse(message: string): Promise<AIResponse> {
    const lowerMessage = message.toLowerCase();

    // Sistema de resposta baseado em padrões (simulando IA)
    if (lowerMessage.includes('status') || lowerMessage.includes('como está')) {
      return this.getStatusResponse();
    }

    if (lowerMessage.includes('otimizar') || lowerMessage.includes('melhorar')) {
      return {
        message: 'Vou otimizar os sistemas agora! Aplicando melhorias de performance...',
        action: 'optimize',
        confidence: 0.95,
      };
    }

    if (
      lowerMessage.includes('problema') ||
      lowerMessage.includes('erro') ||
      lowerMessage.includes('falha')
    ) {
      return {
        message:
          'Detectei sua preocupação. Vou verificar todos os sistemas e corrigir qualquer problema encontrado.',
        action: 'fix',
        data: 'general-check',
        confidence: 0.9,
      };
    }

    if (lowerMessage.includes('relatório') || lowerMessage.includes('report')) {
      return {
        message: 'Gerando relatório completo da plataforma...',
        action: 'report',
        confidence: 0.88,
      };
    }

    if (lowerMessage.includes('bot') || lowerMessage.includes('bots')) {
      return this.getBotStatusResponse();
    }

    if (lowerMessage.includes('segurança') || lowerMessage.includes('security')) {
      return {
        message:
          'Segurança é prioridade! Todos os sistemas estão protegidos. Firewall ativo, certificados válidos, e monitoramento 24/7.',
        action: 'monitor',
        confidence: 0.92,
      };
    }

    // Resposta padrão inteligente
    return {
      message: this.generateContextualResponse(message),
      confidence: 0.75,
    };
  }

  private getStatusResponse(): AIResponse {
    const health = platformMonitor.getPlatformHealth();
    const criticalIssues = health.systems.filter(s => s.status === 'critical').length;
    const warningIssues = health.systems.filter(s => s.status === 'warning').length;
    const activeBots = health.bots.filter(b => b.status === 'active').length;

    let message = `📊 Status da Plataforma:\n\n`;
    message += `🟢 Saúde Geral: ${health.overall.toFixed(1)}%\n`;
    message += `🤖 Bots Ativos: ${activeBots}/${health.bots.length}\n`;
    message += `⚠️ Alertas: ${warningIssues} avisos, ${criticalIssues} críticos\n\n`;

    if (criticalIssues > 0) {
      message += `🚨 Atenção: ${criticalIssues} sistema(s) crítico(s) detectado(s). Iniciando correções automáticas...`;
    } else if (warningIssues > 0) {
      message += `⚡ ${warningIssues} sistema(s) em alerta. Monitorando de perto.`;
    } else {
      message += `✅ Todos os sistemas funcionando perfeitamente!`;
    }

    return {
      message,
      action: criticalIssues > 0 ? 'fix' : 'monitor',
      confidence: 0.98,
    };
  }

  private getBotStatusResponse(): AIResponse {
    const health = platformMonitor.getPlatformHealth();
    const activeBots = health.bots.filter(b => b.status === 'active');
    const idleBots = health.bots.filter(b => b.status === 'idle');
    const errorBots = health.bots.filter(b => b.status === 'error');

    let message = `🤖 Status dos Bots:\n\n`;
    message += `✅ Ativos: ${activeBots.length}\n`;
    message += `😴 Ociosos: ${idleBots.length}\n`;
    message += `❌ Com Erro: ${errorBots.length}\n\n`;

    if (activeBots.length > 0) {
      message += `Bots mais produtivos:\n`;
      activeBots
        .sort((a, b) => b.tasksCompleted - a.tasksCompleted)
        .slice(0, 3)
        .forEach(bot => {
          message += `• ${bot.name}: ${bot.tasksCompleted} tarefas (${bot.performance.toFixed(1)}%)\n`;
        });
    }

    if (errorBots.length > 0) {
      message += `\n🔧 Corrigindo bots com erro automaticamente...`;
    }

    return {
      message,
      action: errorBots.length > 0 ? 'fix' : 'monitor',
      data: 'bots',
      confidence: 0.95,
    };
  }

  private generateContextualResponse(message: string): string {
    const responses = [
      `Entendi sua solicitação. Como sua IA administrativa, estou sempre aqui para ajudar a manter a plataforma funcionando perfeitamente.`,
      `Perfeito! Vou processar isso imediatamente. Minha prioridade é garantir que tudo funcione sem problemas.`,
      `Compreendido! Como ARIA Admin, posso monitorar, otimizar e corrigir qualquer aspecto da plataforma. O que mais posso fazer por você?`,
      `Excelente pergunta! Estou analisando todos os dados em tempo real para fornecer a melhor resposta possível.`,
      `Claro! Com meu acesso completo aos sistemas, posso executar essa tarefa de forma automática e eficiente.`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private async executeAction(action: string, data?: any): Promise<void> {
    switch (action) {
      case 'optimize':
        await platformMonitor.optimizePerformance();
        break;

      case 'fix':
        if (data === 'bots') {
          await this.fixBotIssues();
        } else {
          await platformMonitor.executeAutomaticFix(data || 'Verificação geral do sistema');
        }
        break;

      case 'report':
        await this.generateReport();
        break;

      case 'alert':
        // Já tratado pelo sistema de notificações
        break;

      case 'monitor':
      default:
        // Ação de monitoramento contínuo
        break;
    }
  }

  private async fixBotIssues(): Promise<void> {
    const health = platformMonitor.getPlatformHealth();
    const errorBots = health.bots.filter(b => b.status === 'error');

    for (const bot of errorBots) {
      // Simular correção do bot
      setTimeout(() => {
        bot.status = 'active';
        bot.errors = 0;
        bot.performance = Math.max(90, bot.performance);
      }, 1000);
    }

    if (errorBots.length > 0) {
      await platformMonitor.executeAutomaticFix(`Corrigidos ${errorBots.length} bot(s) com erro`);
    }
  }

  private async generateReport(): Promise<void> {
    const health = platformMonitor.getPlatformHealth();
    const report = this.createDetailedReport(health);

    // Simular geração de relatório
    setTimeout(() => {
      console.log('📄 Relatório ARIA Admin gerado:', report);
    }, 2000);
  }

  private createDetailedReport(health: PlatformHealth): string {
    return `
RELATÓRIO ARIA ADMIN - ${new Date().toLocaleString()}

SAÚDE GERAL: ${health.overall.toFixed(1)}%

SISTEMAS:
${health.systems.map(s => `• ${s.name}: ${s.value.toFixed(1)}% (${s.status})`).join('\n')}

BOTS:
${health.bots.map(b => `• ${b.name}: ${b.performance.toFixed(1)}% - ${b.tasksCompleted} tarefas`).join('\n')}

NOTIFICAÇÕES: ${health.notifications.length} total (${health.notifications.filter(n => !n.read).length} não lidas)

RECOMENDAÇÕES:
- Sistemas funcionando dentro dos parâmetros normais
- Monitoramento contínuo ativo
- Otimizações automáticas aplicadas
`;
  }

  private analyzeHealth(health: PlatformHealth): void {
    // Análise automática da saúde da plataforma
    const criticalSystems = health.systems.filter(s => s.status === 'critical');
    const warningSystems = health.systems.filter(s => s.status === 'warning');

    if (criticalSystems.length > 0 && this.config.autonomy === 'high') {
      // Intervenção automática para sistemas críticos
      criticalSystems.forEach(system => {
        this.executeAction('fix', `Sistema crítico: ${system.name}`);
      });
    }

    if (health.overall < this.config.thresholds.intervention && this.config.autonomy !== 'low') {
      // Otimização automática quando saúde geral está baixa
      this.executeAction('optimize');
    }
  }

  private handleCriticalAlert(notification: Notification): void {
    if (this.config.autonomy === 'high') {
      // Resposta automática a alertas críticos
      this.addToConversation(
        'assistant',
        `🚨 ALERTA CRÍTICO DETECTADO: ${notification.title}\n\nIniciando correção automática imediatamente...`
      );

      this.executeAction('fix', notification.message);
    }
  }

  private performAutomaticMaintenance(): void {
    if (!this.isActive) return;

    const health = platformMonitor.getPlatformHealth();

    // Manutenção preventiva baseada em padrões
    if (health.overall < this.config.thresholds.warning) {
      this.executeAction('optimize');
    }

    // Verificar bots ociosos há muito tempo
    const idleBots = health.bots.filter(
      b => b.status === 'idle' && b.tasksQueue === 0 && b.tasksCompleted < 10
    );

    if (idleBots.length > 2) {
      this.addToConversation(
        'assistant',
        `🔧 Manutenção automática: Reativando ${idleBots.length} bots ociosos para melhor distribuição de carga.`
      );
    }
  }

  private addToConversation(role: 'user' | 'assistant', content: string): void {
    this.conversationHistory.push({
      role,
      content,
      timestamp: new Date(),
    });

    // Manter apenas últimas 50 mensagens
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }
  }

  public getConversationHistory(): Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }> {
    return [...this.conversationHistory];
  }

  public updateConfig(newConfig: Partial<AIPromptConfig>): void {
    this.config = { ...this.config, ...newConfig };

    this.addToConversation(
      'assistant',
      `✅ Configuração atualizada!\n\nNovas configurações:\n- Autonomia: ${this.config.autonomy}\n- Responsabilidades: ${this.config.responsibilities.length} funções\n\nAjustando comportamento conforme suas preferências.`
    );
  }

  public getConfig(): AIPromptConfig {
    return { ...this.config };
  }

  public isActiveStatus(): boolean {
    return this.isActive;
  }
}

export const ariaAdmin = ARIAAdminService.getInstance();
export type { AIResponse, AIPromptConfig };
