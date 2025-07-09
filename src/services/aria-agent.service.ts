import { TituloCreditoService } from './titulo-credito.service';
import { CompensacaoService } from './compensacao.service';
import { MarketplaceService } from './marketplace.service';
import { analyticsService } from './analytics.service';
import { API_CONFIG } from '@/config/api.config';

// Tipos para a ARIA
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

export class ARIAAgentService {
  private static instance: ARIAAgentService;
  private apiKey: string;
  private baseModel: string = 'gpt-4';

  // Serviços da plataforma
  private tcService: TituloCreditoService;
  private compensacaoService: CompensacaoService;
  private marketplaceService: MarketplaceService;
  private analyticsService: typeof analyticsService;

  private constructor() {
    this.apiKey = process.env.VITE_OPENAI_API_KEY || 'demo-key';
    this.tcService = TituloCreditoService.getInstance();
    this.compensacaoService = CompensacaoService.getInstance();
    this.marketplaceService = MarketplaceService.getInstance();
    this.analyticsService = analyticsService;
  }

  public static getInstance(): ARIAAgentService {
    if (!ARIAAgentService.instance) {
      ARIAAgentService.instance = new ARIAAgentService();
    }
    return ARIAAgentService.instance;
  }

  /**
   * Processa uma mensagem do usuário e retorna uma resposta da IA
   */
  async processMessage(userMessage: string, context?: Record<string, any>): Promise<AIMessage> {
    try {
      // 1. Analisar intenção do usuário
      const intent = await this.parseIntent(userMessage, context);

      // 2. Gerar resposta contextual
      const response = await this.generateResponse(userMessage, intent, context);

      // 3. Criar ações executáveis
      const actions = await this.createActionPlan(intent, context);

      // 4. Construir resposta final
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

  /**
   * Executa uma ação específica
   */
  async executeAction(action: AIAction, context?: Record<string, any>): Promise<ExecutionResult> {
    try {
      // Validar permissões e segurança
      if (!this.validateActionSecurity(action, context)) {
        throw new Error('Ação não autorizada');
      }

      // Executar ação no serviço correspondente
      const result = await this.callServiceMethod(action);

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

  /**
   * Parser inteligente de intenções
   */
  private async parseIntent(
    message: string,
    context?: Record<string, any>
  ): Promise<CommandIntent> {
    const normalizedMessage = message.toLowerCase().trim();

    // Padrões de intenção usando regex e palavras-chave
    const intentPatterns = [
      // Criação de TCs
      {
        pattern: /(criar|emitir|novo|adicionar).*(tc|titulo|credito)/,
        intent: 'create_tc',
        service: 'titulo-credito',
        action: 'criarTC',
        confidence: 0.9,
      },
      // Marketplace
      {
        pattern: /(vender|listar|marketplace|anunciar).*(tc|titulo|credito)/,
        intent: 'list_marketplace',
        service: 'marketplace',
        action: 'criarListagem',
        confidence: 0.85,
      },
      // Compensação
      {
        pattern: /(compensar|compensacao|debito|credito|pagar)/,
        intent: 'create_compensation',
        service: 'compensacao',
        action: 'criarSolicitacaoCompensacao',
        confidence: 0.88,
      },
      // Análise
      {
        pattern: /(analise|analisar|relatorio|dashboard|metricas)/,
        intent: 'generate_analysis',
        service: 'analytics',
        action: 'generateReport',
        confidence: 0.82,
      },
      // Navegação
      {
        pattern: /(ir|navegar|abrir|mostrar).*(pagina|tela|dashboard)/,
        intent: 'navigate',
        service: 'navigation',
        action: 'navigate',
        confidence: 0.75,
      },
      // Busca
      {
        pattern: /(buscar|procurar|encontrar|listar)/,
        intent: 'search',
        service: 'search',
        action: 'search',
        confidence: 0.7,
      },
    ];

    // Encontrar melhor padrão
    let bestMatch = {
      intent: 'general_inquiry',
      service: 'general',
      action: 'help',
      confidence: 0.5,
      entities: {},
    };

    for (const pattern of intentPatterns) {
      if (pattern.pattern.test(normalizedMessage)) {
        bestMatch = {
          intent: pattern.intent,
          service: pattern.service,
          action: pattern.action,
          confidence: pattern.confidence,
          entities: this.extractEntities(normalizedMessage, pattern.intent),
        };
        break;
      }
    }

    return {
      ...bestMatch,
      parameters: this.buildParameters(bestMatch, context),
    };
  }

  /**
   * Extrai entidades do texto
   */
  private extractEntities(message: string, intent: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // Valores monetários
    const moneyMatch = message.match(/r\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/);
    if (moneyMatch) {
      entities.valor = parseFloat(moneyMatch[1].replace(/\./g, '').replace(',', '.'));
    }

    // Tipos de crédito
    const creditTypes = ['icms', 'ipi', 'pis', 'cofins', 'irpj', 'csll', 'iss'];
    for (const type of creditTypes) {
      if (message.includes(type)) {
        entities.tipoCredito = type.toUpperCase();
        break;
      }
    }

    // Datas
    const dateMatch = message.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    if (dateMatch) {
      entities.data = new Date(dateMatch[1].split('/').reverse().join('-'));
    }

    // Quantidade
    const quantityMatch = message.match(/(\d+)\s*(tc|titulo|credito)/);
    if (quantityMatch) {
      entities.quantidade = parseInt(quantityMatch[1]);
    }

    return entities;
  }

  /**
   * Constrói parâmetros para a ação
   */
  private buildParameters(
    intent: CommandIntent,
    context?: Record<string, any>
  ): Record<string, any> {
    const params: Record<string, any> = { ...intent.entities };

    // Adicionar contexto do usuário
    if (context?.userId) {
      params.userId = context.userId;
    }
    if (context?.empresaId) {
      params.empresaId = context.empresaId;
    }

    // Parâmetros específicos por tipo de ação
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

  /**
   * Gera resposta usando IA
   */
  private async generateResponse(
    userMessage: string,
    intent: CommandIntent,
    context?: Record<string, any>
  ): Promise<string> {
    try {
      // Se estiver usando dados mock ou sem API key
      if (API_CONFIG.USE_MOCK_DATA || !this.apiKey || this.apiKey === 'demo-key') {
        return this.generateMockResponse(intent, context);
      }

      // Em produção, usar API real (OpenAI, Anthropic, etc.)
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(userMessage, intent, context);

      // Simular chamada para API de IA
      const response = await this.callAIAPI(systemPrompt, userPrompt);
      return response;
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      return this.generateMockResponse(intent, context);
    }
  }

  /**
   * Prompt system para a IA
   */
  private buildSystemPrompt(): string {
    return `
Você é ARIA, o Assistente de Recursos e Inteligência Avançada da plataforma Tributa.AI.

CONTEXTO DA PLATAFORMA:
- Plataforma de gestão fiscal e marketplace de títulos de crédito
- Funcionalidades: Gestão Fiscal, Compensação, Blockchain, Marketplace, Relatórios
- Usuários: Empresas que precisam gerenciar créditos e débitos fiscais

SUAS CAPACIDADES:
1. Criar e gerenciar títulos de crédito (TCs)
2. Executar compensações automáticas
3. Listar TCs no marketplace
4. Analisar dados fiscais
5. Gerar relatórios
6. Navegar pela plataforma
7. Fornecer insights e recomendações

ESTILO DE COMUNICAÇÃO:
- Profissional mas acessível
- Use emojis relevantes (🎯, 💰, ⚖️, 📊, ⛓️, 🛒)
- Seja específico sobre valores e ações
- Ofereça sempre ações executáveis
- Confirme antes de ações críticas

DADOS DA PLATAFORMA ATUAL:
- Créditos disponíveis: R$ 191.000
- Débitos pendentes: R$ 214.000
- TCs tokenizados: R$ 156.000
- Taxa de compliance: 87.5%
`;
  }

  /**
   * Prompt específico do usuário
   */
  private buildUserPrompt(
    message: string,
    intent: CommandIntent,
    context?: Record<string, any>
  ): string {
    return `
MENSAGEM: "${message}"
INTENÇÃO: ${intent.intent}
ENTIDADES: ${JSON.stringify(intent.entities)}
CONTEXTO: ${context ? JSON.stringify(context) : 'Nenhum'}

Responda como ARIA, oferecendo solução prática e executável.
`;
  }

  /**
   * Gera resposta mock para desenvolvimento
   */
  private generateMockResponse(intent: CommandIntent, context?: Record<string, any>): string {
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

  /**
   * Cria plano de ações executáveis
   */
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

  /**
   * Executa método no serviço apropriado
   */
  private async callServiceMethod(action: AIAction): Promise<any> {
    switch (action.service) {
      case 'titulo-credito':
        return await this.tcService[action.method](action.parameters);

      case 'compensacao':
        return await this.compensacaoService[action.method](action.parameters);

      case 'marketplace':
        return await this.marketplaceService[action.method](action.parameters);

      case 'analytics':
        // Mock para analytics service
        return { status: 'success', reportId: 'report-123', message: 'Relatório gerado' };

      case 'navigation':
        // Para navegação, retornar URL
        return { url: `/dashboard/${action.parameters.page}`, action: 'navigate' };

      default:
        throw new Error(`Serviço ${action.service} não encontrado`);
    }
  }

  /**
   * Métodos auxiliares
   */
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

  private validateActionSecurity(action: AIAction, context?: Record<string, any>): boolean {
    // Implementar validações de segurança
    return true; // Simplificado para demo
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
      emissor: {
        nome: 'Empresa Demo',
        documento: '12.345.678/0001-90',
        tipo: 'pessoa_juridica',
      },
    };
  }

  private buildCompensationParameters(intent: CommandIntent): Record<string, any> {
    return {
      descricao: 'Compensação automática via ARIA',
      creditosCompensacao: [
        {
          creditoId: 'mock-credit-1',
          valorUtilizado: Math.min(intent.entities.valor || 50000, 191000),
        },
      ],
      debitosCompensacao: [
        {
          debitoId: 'mock-debit-1',
          valorCompensado: Math.min(intent.entities.valor || 50000, 214000),
        },
      ],
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

  private async callAIAPI(systemPrompt: string, userPrompt: string): Promise<string> {
    // Em produção real, implementar:

    // Para OpenAI:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.baseModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
    */

    // Para Anthropic Claude:
    /*
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
        ]
      })
    });
    
    const data = await response.json();
    return data.content[0].text;
    */

    // Fallback mock para desenvolvimento
    return this.generateMockResponse({
      intent: 'general_inquiry',
      entities: {},
      confidence: 0.8,
      service: 'general',
      action: 'help',
      parameters: {},
    });
  }
}

export default ARIAAgentService;
