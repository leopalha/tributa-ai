import {
  BotProfile,
  BotTransaction,
  BotMetrics,
  BotControlPanel,
  MLParameters,
  BotStrategy,
  EMPRESAS_BOT,
  PESSOAS_FISICAS_BOT,
} from '@/types/bots';
import { TituloCredito, ModalidadeVenda, StatusTitulo, NivelRisco } from '@/types/marketplace';
import { toast } from 'sonner';

// === SERVIÇO DE TRADING COM BOTS ===

export class BotTradingService {
  private static instance: BotTradingService;
  private bots: BotProfile[] = [];
  private transactions: BotTransaction[] = [];
  private controlPanel: BotControlPanel;
  private isRunning = false;
  private intervalId?: NodeJS.Timeout;
  private metrics: BotMetrics;

  constructor() {
    this.controlPanel = {
      id: 'main-control',
      nome: 'Painel Principal',
      status: 'parado',
      botsAtivos: 0,
      transacoesPorMinuto: 0,
      volumeHoje: 0,
      lucroHoje: 0,
      configuracoes: {
        intervaloBots: 60, // 1 minuto
        limiteDiario: 1000000,
        autoAprendizado: true,
        notificacoes: true,
        logDetalhado: true,
      },
    };

    this.metrics = {
      totalBots: 0,
      botsAtivos: 0,
      transacoesHoje: 0,
      volumeHoje: 0,
      lucroHoje: 0,
      taxaSucessoMedia: 0,
      tempoMedioResposta: 0,
      categoriasMaisNegociadas: [],
      horariosAtividade: [],
    };

    this.initializeBots();
  }

  static getInstance(): BotTradingService {
    if (!BotTradingService.instance) {
      BotTradingService.instance = new BotTradingService();
    }
    return BotTradingService.instance;
  }

  // === INICIALIZAÇÃO ===

  private initializeBots() {
    // Gerar bots baseados nos dados mock
    const allBotData = [...EMPRESAS_BOT, ...PESSOAS_FISICAS_BOT];

    this.bots = allBotData.map((botData, index) => ({
      id: `bot-${index + 1}`,
      avatar: this.generateAvatar(botData.name!),
      telefone: this.generatePhone(),
      endereco: this.generateAddress(),
      kyc: this.generateKYC(),
      comportamento: this.generateBehavior(),
      stats: this.generateStats(),
      ativo: Math.random() > 0.3, // 70% dos bots ativos
      ultimaAtividade: new Date(Date.now() - Math.random() * 86400000), // Última atividade nas últimas 24h
      criadoEm: new Date(Date.now() - Math.random() * 30 * 86400000), // Criado nos últimos 30 dias
      ...botData,
    })) as BotProfile[];

    this.updateMetrics();
  }

  private generateAvatar(name: string): string {
    const initial = name.charAt(0).toLowerCase();
    return `https://api.dicebear.com/7.x/initials/svg?seed=${initial}&backgroundColor=random`;
  }

  private generatePhone(): string {
    const area = Math.floor(Math.random() * 90) + 10;
    const number = Math.floor(Math.random() * 900000000) + 100000000;
    return `(${area}) ${number.toString().slice(0, 5)}-${number.toString().slice(5)}`;
  }

  private generateAddress() {
    const addresses = [
      { cep: '01310-100', logradouro: 'Av. Paulista', cidade: 'São Paulo', estado: 'SP' },
      { cep: '22071-900', logradouro: 'Av. Atlântica', cidade: 'Rio de Janeiro', estado: 'RJ' },
      { cep: '30112-000', logradouro: 'Av. Afonso Pena', cidade: 'Belo Horizonte', estado: 'MG' },
      { cep: '80010-000', logradouro: 'Rua XV de Novembro', cidade: 'Curitiba', estado: 'PR' },
      { cep: '40070-110', logradouro: 'Av. Sete de Setembro', cidade: 'Salvador', estado: 'BA' },
    ];

    const address = addresses[Math.floor(Math.random() * addresses.length)];
    return {
      ...address,
      numero: Math.floor(Math.random() * 9999) + 1 + '',
      pais: 'Brasil',
    };
  }

  private generateKYC() {
    return {
      status: 'aprovado' as const,
      score: Math.floor(Math.random() * 30) + 70, // Score entre 70-100
      documentos: [
        {
          id: 'doc-1',
          tipo: 'cpf' as const,
          nome: 'CPF/CNPJ',
          url: '#',
          status: 'aprovado' as const,
          dataUpload: new Date(Date.now() - Math.random() * 7 * 86400000),
          dataValidacao: new Date(Date.now() - Math.random() * 6 * 86400000),
        },
      ],
      dataAprovacao: new Date(Date.now() - Math.random() * 5 * 86400000),
      validadeDocumentos: new Date(Date.now() + 365 * 86400000),
      nivelRisco: ['baixo', 'medio', 'alto'][Math.floor(Math.random() * 3)] as any,
    };
  }

  private generateBehavior() {
    return {
      agressividade: Math.floor(Math.random() * 100),
      paciencia: Math.floor(Math.random() * 100),
      analise: Math.floor(Math.random() * 100),
      impulso: Math.floor(Math.random() * 100),
      estrategias: this.generateStrategies(),
      limites: {
        valorMaximoTransacao: Math.floor(Math.random() * 500000) + 50000,
        percentualPatrimonio: Math.floor(Math.random() * 20) + 5,
        numeroMaximoLeiloes: Math.floor(Math.random() * 10) + 3,
        tempoMinimoAnalise: Math.floor(Math.random() * 300) + 60,
      },
      horarios: {
        inicio: '09:00',
        fim: '18:00',
        diasSemana: [1, 2, 3, 4, 5],
        pausas: [{ inicio: '12:00', fim: '13:00' }],
      },
      ml: {
        modeloTreinado: Math.random() > 0.3,
        precisao: Math.random() * 0.3 + 0.7,
        ultimoTreinamento: new Date(Date.now() - Math.random() * 7 * 86400000),
        parametros: this.generateMLParameters(),
      },
    };
  }

  private generateStrategies(): BotStrategy[] {
    const strategies = [
      {
        id: 'strategy-1',
        nome: 'Leilão Agressivo',
        tipo: 'leilao' as const,
        ativa: true,
        prioridade: 1,
        condicoes: [
          { campo: 'desconto', operador: '>' as const, valor: 10 },
          { campo: 'tempoRestante', operador: '<' as const, valor: 3600 },
        ],
        acoes: [{ tipo: 'dar_lance' as const, parametros: { incremento: 0.05 } }],
      },
      {
        id: 'strategy-2',
        nome: 'Compra Direta Conservadora',
        tipo: 'compra_direta' as const,
        ativa: true,
        prioridade: 2,
        condicoes: [
          { campo: 'rating', operador: '>' as const, valor: 4 },
          { campo: 'risco', operador: '=' as const, valor: 'baixo' },
        ],
        acoes: [{ tipo: 'comprar' as const, parametros: { negociar: true } }],
      },
    ];

    return strategies.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  private generateMLParameters(): MLParameters {
    return {
      algoritmo: ['random_forest', 'neural_network', 'gradient_boosting', 'svm'][
        Math.floor(Math.random() * 4)
      ] as any,
      features: ['preco', 'desconto', 'rating', 'risco', 'categoria', 'tempo_restante'],
      pesos: {
        preco: Math.random(),
        desconto: Math.random(),
        rating: Math.random(),
        risco: Math.random(),
        categoria: Math.random(),
        tempo_restante: Math.random(),
      },
      threshold: Math.random() * 0.3 + 0.5,
      confianca: Math.random() * 0.4 + 0.6,
    };
  }

  private generateStats() {
    return {
      transacoes: Math.floor(Math.random() * 100),
      volumeNegociado: Math.floor(Math.random() * 1000000),
      lucroAcumulado: Math.floor(Math.random() * 100000),
      taxaSucesso: Math.random() * 0.4 + 0.6,
      tempoMedioDecisao: Math.floor(Math.random() * 300) + 30,
      categoriasFavoritas: ['ICMS', 'PIS_COFINS', 'PRECATORIO'].slice(
        0,
        Math.floor(Math.random() * 3) + 1
      ),
    };
  }

  // === CONTROLE DO SISTEMA ===

  public startBotSystem(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.controlPanel.status = 'ativo';
    this.controlPanel.botsAtivos = this.bots.filter(b => b.ativo).length;

    this.intervalId = setInterval(() => {
      this.processBotActions();
    }, this.controlPanel.configuracoes.intervaloBots * 1000);

    toast.success('Sistema de bots iniciado!');
    console.log('🤖 Sistema de bots iniciado');
  }

  public stopBotSystem(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.controlPanel.status = 'parado';
    this.controlPanel.botsAtivos = 0;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    toast.info('Sistema de bots parado!');
    console.log('🛑 Sistema de bots parado');
  }

  public pauseBotSystem(): void {
    if (!this.isRunning) return;

    this.controlPanel.status = 'pausado';
    toast.warning('Sistema de bots pausado!');
    console.log('⏸️ Sistema de bots pausado');
  }

  public resumeBotSystem(): void {
    if (!this.isRunning) return;

    this.controlPanel.status = 'ativo';
    toast.success('Sistema de bots retomado!');
    console.log('▶️ Sistema de bots retomado');
  }

  // === PROCESSAMENTO DE AÇÕES ===

  private async processBotActions(): Promise<void> {
    if (this.controlPanel.status !== 'ativo') return;

    const activeBots = this.bots.filter(bot => bot.ativo && this.isBotActiveNow(bot));
    const titulos = await this.getTitulosDisponiveis();

    for (const bot of activeBots) {
      try {
        const decision = await this.makeBotDecision(bot, titulos);
        if (decision) {
          await this.executeBotAction(bot, decision);
        }
      } catch (error) {
        console.error(`Erro no bot ${bot.name}:`, error);
      }
    }

    this.updateMetrics();
  }

  private isBotActiveNow(bot: BotProfile): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    // Verificar dia da semana
    if (!bot.comportamento.horarios.diasSemana.includes(currentDay)) {
      return false;
    }

    // Verificar horário
    const startHour = parseInt(bot.comportamento.horarios.inicio.split(':')[0]);
    const endHour = parseInt(bot.comportamento.horarios.fim.split(':')[0]);

    if (currentHour < startHour || currentHour > endHour) {
      return false;
    }

    // Verificar pausas
    for (const pausa of bot.comportamento.horarios.pausas) {
      const pausaStart = parseInt(pausa.inicio.split(':')[0]);
      const pausaEnd = parseInt(pausa.fim.split(':')[0]);

      if (currentHour >= pausaStart && currentHour < pausaEnd) {
        return false;
      }
    }

    return true;
  }

  private async getTitulosDisponiveis(): Promise<TituloCredito[]> {
    // Simular busca de títulos disponíveis
    // Na implementação real, seria uma chamada à API
    return [];
  }

  private async makeBotDecision(bot: BotProfile, titulos: TituloCredito[]): Promise<any> {
    // Simular análise ML
    const analysisTime = Math.random() * bot.comportamento.limites.tempoMinimoAnalise;

    // Aguardar tempo de análise
    await new Promise(resolve => setTimeout(resolve, analysisTime));

    // Decidir se deve agir
    const shouldAct = Math.random() < bot.comportamento.impulso / 100;

    if (!shouldAct || titulos.length === 0) {
      return null;
    }

    const titulo = titulos[Math.floor(Math.random() * titulos.length)];
    const strategy = bot.comportamento.estrategias.find(s => s.ativa);

    if (!strategy) return null;

    return {
      titulo,
      strategy,
      confidence: bot.comportamento.ml.precisao,
      action: this.determineAction(bot, titulo, strategy),
    };
  }

  private determineAction(bot: BotProfile, titulo: TituloCredito, strategy: BotStrategy) {
    // Lógica de decisão baseada na estratégia
    switch (strategy.tipo) {
      case 'leilao':
        return {
          tipo: 'dar_lance',
          valor: titulo.precoVenda * (1 + Math.random() * 0.1),
        };
      case 'compra_direta':
        return {
          tipo: 'comprar',
          valor: titulo.precoVenda,
        };
      case 'proposta':
        return {
          tipo: 'fazer_proposta',
          valor: titulo.precoVenda * (0.8 + Math.random() * 0.15),
        };
      default:
        return null;
    }
  }

  private async executeBotAction(bot: BotProfile, decision: any): Promise<void> {
    const transaction: BotTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      botId: bot.id,
      tituloId: decision.titulo.id,
      tipo: decision.action.tipo,
      valor: decision.action.valor,
      timestamp: new Date(),
      status: 'executada',
      estrategiaUsada: decision.strategy.nome,
      confiancaML: decision.confidence,
      resultado: {
        lucro: Math.random() * 10000 - 5000,
        roi: Math.random() * 0.4 - 0.2,
        tempoExecucao: Math.random() * 5000,
      },
    };

    this.transactions.push(transaction);

    // Atualizar estatísticas do bot
    bot.stats.transacoes++;
    bot.stats.volumeNegociado += transaction.valor;
    bot.ultimaAtividade = new Date();

    // Log da transação
    if (this.controlPanel.configuracoes.logDetalhado) {
      console.log(
        `🤖 ${bot.name} executou ${transaction.tipo} de ${this.formatCurrency(transaction.valor)}`
      );
    }

    // Notificação
    if (this.controlPanel.configuracoes.notificacoes) {
      toast.success(`${bot.name} executou ${transaction.tipo}`);
    }
  }

  // === MACHINE LEARNING ===

  public async trainBotML(botId: string): Promise<void> {
    const bot = this.bots.find(b => b.id === botId);
    if (!bot) return;

    // Simular treinamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    bot.comportamento.ml.modeloTreinado = true;
    bot.comportamento.ml.precisao = Math.min(0.95, bot.comportamento.ml.precisao + 0.1);
    bot.comportamento.ml.ultimoTreinamento = new Date();

    toast.success(`ML do bot ${bot.name} retreinado!`);
  }

  public async trainAllBots(): Promise<void> {
    for (const bot of this.bots) {
      await this.trainBotML(bot.id);
    }

    toast.success('Todos os bots foram retreinados!');
  }

  // === GETTERS ===

  public getBots(): BotProfile[] {
    return this.bots;
  }

  public getBot(id: string): BotProfile | undefined {
    return this.bots.find(b => b.id === id);
  }

  public getTransactions(): BotTransaction[] {
    return this.transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getControlPanel(): BotControlPanel {
    return this.controlPanel;
  }

  public getMetrics(): BotMetrics {
    return this.metrics;
  }

  public updateBotConfig(botId: string, config: Partial<BotProfile>): void {
    const bot = this.bots.find(b => b.id === botId);
    if (bot) {
      Object.assign(bot, config);
      this.updateMetrics();
    }
  }

  public updateControlConfig(config: Partial<BotControlPanel['configuracoes']>): void {
    Object.assign(this.controlPanel.configuracoes, config);

    // Reiniciar com novo intervalo se necessário
    if (this.isRunning && config.intervaloBots) {
      this.stopBotSystem();
      this.startBotSystem();
    }
  }

  // === UTILITÁRIOS ===

  private updateMetrics(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const todayTransactions = this.transactions.filter(t => t.timestamp >= today);

    this.metrics = {
      totalBots: this.bots.length,
      botsAtivos: this.bots.filter(b => b.ativo).length,
      transacoesHoje: todayTransactions.length,
      volumeHoje: todayTransactions.reduce((sum, t) => sum + t.valor, 0),
      lucroHoje: todayTransactions.reduce((sum, t) => sum + (t.resultado?.lucro || 0), 0),
      taxaSucessoMedia:
        this.bots.reduce((sum, b) => sum + b.stats.taxaSucesso, 0) / this.bots.length,
      tempoMedioResposta:
        this.bots.reduce((sum, b) => sum + b.stats.tempoMedioDecisao, 0) / this.bots.length,
      categoriasMaisNegociadas: this.getCategoriasMaisNegociadas(),
      horariosAtividade: this.getHorariosAtividade(),
    };

    this.controlPanel.transacoesPorMinuto =
      todayTransactions.length / (now.getHours() * 60 + now.getMinutes() + 1);
    this.controlPanel.volumeHoje = this.metrics.volumeHoje;
    this.controlPanel.lucroHoje = this.metrics.lucroHoje;
  }

  private getCategoriasMaisNegociadas(): string[] {
    const categorias = this.bots.flatMap(b => b.stats.categoriasFavoritas);
    const counts = categorias.reduce(
      (acc, cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cat]) => cat);
  }

  private getHorariosAtividade(): { hora: number; atividade: number }[] {
    const horarios = Array.from({ length: 24 }, (_, i) => ({ hora: i, atividade: 0 }));

    this.transactions.forEach(t => {
      const hour = t.timestamp.getHours();
      horarios[hour].atividade++;
    });

    return horarios;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}

// Instância singleton
export const botTradingService = BotTradingService.getInstance();
