// Versão simplificada da ARIA sem dependências complexas
export interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'analysis' | 'recommendation' | 'alert' | 'optimization' | 'action';
  confidence?: number;
  actions?: AIAction[];
  metadata?: Record<string, any>;
}

export interface AIAction {
  id: string;
  title: string;
  description: string;
  type: 'execute' | 'analyze' | 'optimize' | 'navigate' | 'report' | 'create' | 'update' | 'delete';
  service: string;
  method: string;
  parameters: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedSavings?: number;
  implementationTime?: number;
  complexity: 'simple' | 'medium' | 'complex';
  canExecute: boolean;
  requiresConfirmation: boolean;
}

export interface CommandIntent {
  intent: string;
  entities: Record<string, any>;
  confidence: number;
  service: string;
  action: string;
  parameters: Record<string, any>;
}

export interface ExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  message: string;
  metadata?: Record<string, any>;
}

export class ARIAAgentSimpleService {
  private static instance: ARIAAgentSimpleService;
  private apiKey: string;

  private constructor() {
    this.apiKey = 'demo-key';
  }

  public static getInstance(): ARIAAgentSimpleService {
    if (!ARIAAgentSimpleService.instance) {
      ARIAAgentSimpleService.instance = new ARIAAgentSimpleService();
    }
    return ARIAAgentSimpleService.instance;
  }

  async processMessage(userMessage: string, context?: Record<string, any>): Promise<AIMessage> {
    try {
      const intent = await this.parseIntent(userMessage, context);
      const response = await this.generateResponse(userMessage, intent, context);
      const actions = await this.createActionPlan(intent, context);

      const aiMessage: AIMessage = {
        id: this.generateId(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        category: this.categorizeIntent(intent.intent),
        confidence: intent.confidence,
        actions,
        metadata: {
          intent: intent.intent,
          entities: intent.entities,
          service: intent.service,
        },
      };

      return aiMessage;
    } catch (error) {
      console.error('Erro no processamento da mensagem:', error);
      return this.createErrorResponse(error);
    }
  }

  async executeAction(action: AIAction, context?: Record<string, any>): Promise<ExecutionResult> {
    try {
      // Simular execução real
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = this.mockExecuteAction(action);

      return {
        success: true,
        data: result,
        message: `✅ ${action.title} executada com sucesso!`,
        metadata: {
          actionId: action.id,
          executedAt: new Date(),
          service: action.service,
          method: action.method,
        },
      };
    } catch (error) {
      console.error('Erro na execução da ação:', error);
      return {
        success: false,
        error: error.message,
        message: `❌ Erro ao executar ${action.title}: ${error.message}`,
        metadata: {
          actionId: action.id,
          failedAt: new Date(),
          error: error.message,
        },
      };
    }
  }

  private async parseIntent(
    message: string,
    context?: Record<string, any>
  ): Promise<CommandIntent> {
    const normalizedMessage = message.toLowerCase().trim();

    const intentPatterns = [
      {
        pattern: /(criar|emitir|novo|adicionar).*(tc|titulo|credito)/,
        intent: 'create_tc',
        service: 'titulo-credito',
        action: 'criarTC',
        confidence: 0.9,
      },
      {
        pattern: /(vender|listar|marketplace|anunciar).*(tc|titulo|credito)/,
        intent: 'list_marketplace',
        service: 'marketplace',
        action: 'criarListagem',
        confidence: 0.85,
      },
      {
        pattern: /(compensar|compensacao|debito|credito|pagar)/,
        intent: 'create_compensation',
        service: 'compensacao',
        action: 'criarSolicitacaoCompensacao',
        confidence: 0.88,
      },
      {
        pattern: /(analise|analisar|relatorio|dashboard|metricas)/,
        intent: 'generate_analysis',
        service: 'analytics',
        action: 'generateReport',
        confidence: 0.82,
      },
      {
        pattern: /(ir|navegar|abrir|mostrar).*(pagina|tela|dashboard)/,
        intent: 'navigate',
        service: 'navigation',
        action: 'navigate',
        confidence: 0.75,
      },
      {
        pattern: /(buscar|procurar|encontrar|listar)/,
        intent: 'search',
        service: 'search',
        action: 'search',
        confidence: 0.7,
      },
    ];

    let bestMatch: CommandIntent = {
      intent: 'general_inquiry',
      service: 'general',
      action: 'help',
      confidence: 0.5,
      entities: {},
      parameters: {},
    };

    for (const pattern of intentPatterns) {
      if (pattern.pattern.test(normalizedMessage)) {
        bestMatch = {
          intent: pattern.intent,
          service: pattern.service,
          action: pattern.action,
          confidence: pattern.confidence,
          entities: this.extractEntities(normalizedMessage, pattern.intent),
          parameters: {},
        };
        break;
      }
    }

    bestMatch.parameters = this.buildParameters(bestMatch, context);
    return bestMatch;
  }

  private extractEntities(message: string, intent: string): Record<string, any> {
    const entities: Record<string, any> = {};

    const moneyMatch = message.match(/r\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/);
    if (moneyMatch) {
      entities.valor = parseFloat(moneyMatch[1].replace(/\./g, '').replace(',', '.'));
    }

    const creditTypes = ['icms', 'ipi', 'pis', 'cofins', 'irpj', 'csll', 'iss'];
    for (const type of creditTypes) {
      if (message.includes(type)) {
        entities.tipoCredito = type.toUpperCase();
        break;
      }
    }

    const dateMatch = message.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    if (dateMatch) {
      entities.data = new Date(dateMatch[1].split('/').reverse().join('-'));
    }

    const quantityMatch = message.match(/(\d+)\s*(tc|titulo|credito)/);
    if (quantityMatch) {
      entities.quantidade = parseInt(quantityMatch[1]);
    }

    return entities;
  }

  private buildParameters(
    intent: CommandIntent,
    context?: Record<string, any>
  ): Record<string, any> {
    const params: Record<string, any> = { ...intent.entities };

    if (context?.userId) {
      params.userId = context.userId;
    }
    if (context?.empresaId) {
      params.empresaId = context.empresaId;
    }

    switch (intent.intent) {
      case 'create_tc':
        params.status = 'rascunho';
        params.dataEmissao = new Date();
        break;
      case 'create_compensation':
        params.status = 'PENDENTE';
        params.dataVencimento = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        break;
      case 'list_marketplace':
        params.status = 'ativa';
        params.categoria = 'titulo-credito';
        break;
    }

    return params;
  }

  private async generateResponse(
    userMessage: string,
    intent: CommandIntent,
    context?: Record<string, any>
  ): Promise<string> {
    const responses = {
      create_tc: `🎯 Perfeito! Vou criar um novo título de crédito para você. ${intent.entities.tipoCredito ? `Identifiquei que é do tipo ${intent.entities.tipoCredito}` : ''} ${intent.entities.valor ? `no valor de ${this.formatCurrency(intent.entities.valor)}` : ''}. Posso prosseguir com a criação?`,

      list_marketplace: `🛒 Ótima ideia! Vou listar seu TC no marketplace. ${intent.entities.valor ? `Com o valor de ${this.formatCurrency(intent.entities.valor)}` : 'Preciso saber o valor para listagem'}. Isso pode gerar liquidez imediata!`,

      create_compensation: `⚖️ Analisando suas possibilidades de compensação... Você tem R$ 191.000 em créditos disponíveis para compensar R$ 214.000 em débitos. Posso processar uma compensação de R$ 191.000 automaticamente?`,

      generate_analysis: `📊 Gerando análise completa dos seus dados fiscais... Identifiquei 3 oportunidades de otimização que podem economizar R$ 67.000. Posso detalhar o relatório?`,

      navigate: `🔄 Posso navegar para a seção solicitada. Para onde você gostaria que eu levasse você? Marketplace, Blockchain, Compensação ou outra área?`,

      search: `🔍 Realizando busca... ${intent.entities.tipoCredito ? `Procurando por créditos do tipo ${intent.entities.tipoCredito}` : 'O que especificamente você está procurando?'}`,

      general_inquiry: `🤖 Olá! Sou ARIA, seu assistente operacional. Posso ajudar com criação de TCs, compensações, marketplace, análises e muito mais. O que você precisa fazer hoje?`,
    };

    return responses[intent.intent] || responses.general_inquiry;
  }

  private async createActionPlan(
    intent: CommandIntent,
    context?: Record<string, any>
  ): Promise<AIAction[]> {
    const actions: AIAction[] = [];

    switch (intent.intent) {
      case 'create_tc':
        actions.push({
          id: this.generateId(),
          title: 'Criar Título de Crédito',
          description: 'Criar novo TC com os dados fornecidos',
          type: 'create',
          service: 'titulo-credito',
          method: 'criarTC',
          parameters: this.buildTCParameters(intent),
          priority: 'high',
          complexity: 'medium',
          canExecute: true,
          requiresConfirmation: false,
        });
        break;

      case 'create_compensation':
        actions.push({
          id: this.generateId(),
          title: 'Executar Compensação',
          description: 'Processar compensação automática de créditos vs débitos',
          type: 'execute',
          service: 'compensacao',
          method: 'criarSolicitacaoCompensacao',
          parameters: this.buildCompensationParameters(intent),
          priority: 'high',
          estimatedSavings: Math.min(191000, 214000),
          complexity: 'medium',
          canExecute: true,
          requiresConfirmation: true,
        });
        break;

      case 'list_marketplace':
        actions.push({
          id: this.generateId(),
          title: 'Listar no Marketplace',
          description: 'Criar listagem no marketplace para venda',
          type: 'create',
          service: 'marketplace',
          method: 'criarListagem',
          parameters: this.buildMarketplaceParameters(intent),
          priority: 'medium',
          complexity: 'simple',
          canExecute: true,
          requiresConfirmation: false,
        });
        break;

      case 'generate_analysis':
        actions.push({
          id: this.generateId(),
          title: 'Gerar Relatório Completo',
          description: 'Criar relatório com análises e recomendações',
          type: 'report',
          service: 'analytics',
          method: 'generateAdvancedReport',
          parameters: { tipo: 'completo', periodo: '30dias' },
          priority: 'medium',
          complexity: 'simple',
          canExecute: true,
          requiresConfirmation: false,
        });
        break;

      case 'navigate':
        actions.push({
          id: this.generateId(),
          title: 'Navegar para Página',
          description: 'Abrir página solicitada',
          type: 'navigate',
          service: 'navigation',
          method: 'navigateTo',
          parameters: { page: this.extractNavigationTarget(intent) },
          priority: 'low',
          complexity: 'simple',
          canExecute: true,
          requiresConfirmation: false,
        });
        break;
    }

    return actions;
  }

  private mockExecuteAction(action: AIAction): any {
    switch (action.service) {
      case 'titulo-credito':
        return {
          id: `tc-${Date.now()}`,
          nome: action.parameters.nome || 'Novo TC',
          valor: action.parameters.valorNominal || 10000,
          status: 'criado',
        };

      case 'compensacao':
        return {
          id: `comp-${Date.now()}`,
          protocolo: `COMP-${Date.now().toString().slice(-6)}`,
          valor: action.parameters.valor || 50000,
          status: 'processada',
        };

      case 'marketplace':
        return {
          id: `list-${Date.now()}`,
          titulo: action.parameters.titulo || 'Nova Listagem',
          valor: action.parameters.valor || 10000,
          status: 'ativa',
        };

      case 'navigation':
        return { url: `/dashboard/${action.parameters.page}`, action: 'navigate' };

      default:
        return { status: 'success', message: 'Ação executada' };
    }
  }

  private generateId(): string {
    return `aria-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  private categorizeIntent(
    intent: string
  ): 'analysis' | 'recommendation' | 'alert' | 'optimization' | 'action' {
    const categories = {
      create_tc: 'action',
      create_compensation: 'action',
      list_marketplace: 'action',
      generate_analysis: 'analysis',
      navigate: 'action',
      search: 'analysis',
    };
    return categories[intent] || 'recommendation';
  }

  private buildTCParameters(intent: CommandIntent): Record<string, any> {
    return {
      nome: intent.entities.tipoCredito
        ? `Crédito ${intent.entities.tipoCredito}`
        : 'Novo Título de Crédito',
      tipo: intent.entities.tipoCredito?.toLowerCase() || 'tributario',
      valorNominal: intent.entities.valor || 10000,
      dataEmissao: new Date(),
      dataVencimento: intent.entities.data || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'rascunho',
    };
  }

  private buildCompensationParameters(intent: CommandIntent): Record<string, any> {
    return {
      descricao: 'Compensação automática via ARIA',
      valor: Math.min(intent.entities.valor || 50000, 191000),
    };
  }

  private buildMarketplaceParameters(intent: CommandIntent): Record<string, any> {
    return {
      titulo: `Título de Crédito ${intent.entities.tipoCredito || 'Fiscal'}`,
      descricao: 'Título disponível para negociação',
      valor: intent.entities.valor || 10000,
      categoria: 'titulo-credito',
      tipo: intent.entities.tipoCredito?.toLowerCase() || 'tributario',
      status: 'ativa',
    };
  }

  private extractNavigationTarget(intent: CommandIntent): string {
    const message = JSON.stringify(intent.entities).toLowerCase();
    if (message.includes('marketplace')) return 'marketplace';
    if (message.includes('blockchain')) return 'blockchain';
    if (message.includes('compensacao')) return 'compensacao';
    if (message.includes('relatorio')) return 'relatorios';
    return 'dashboard';
  }

  private createErrorResponse(error: any): AIMessage {
    return {
      id: this.generateId(),
      type: 'assistant',
      content: `❌ Desculpe, ocorreu um erro ao processar sua solicitação: ${error.message}. Posso tentar novamente ou ajudar de outra forma?`,
      timestamp: new Date(),
      category: 'alert',
      confidence: 0,
      actions: [],
    };
  }
}

export default ARIAAgentSimpleService;
