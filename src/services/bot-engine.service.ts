import { BotProfile, BotTransaction, BotMetrics, BotControlPanel } from '@/types/bots';
import { TituloCredito, ModalidadeVenda, StatusTitulo } from '@/types/marketplace';
import { toast } from 'sonner';

// === MOTOR DE BOTS REAL ===
export class BotEngineService {
  private static instance: BotEngineService;
  private bots: Map<string, BotProfile> = new Map();
  private transactions: BotTransaction[] = [];
  private titulos: TituloCredito[] = [];
  private isRunning = false;
  private intervalId?: NodeJS.Timeout;
  private metrics: BotMetrics;
  private controlPanel: BotControlPanel;

  constructor() {
    this.metrics = this.initializeMetrics();
    this.controlPanel = this.initializeControlPanel();
    this.initializeBots();
    this.generateMockTitulos();
  }

  static getInstance(): BotEngineService {
    if (!BotEngineService.instance) {
      BotEngineService.instance = new BotEngineService();
    }
    return BotEngineService.instance;
  }

  // === INICIALIZAÇÃO ===
  private initializeMetrics(): BotMetrics {
    return {
      totalBots: 0,
      botsAtivos: 0,
      transacoesHoje: 0,
      volumeHoje: 0,
      lucroHoje: 0,
      taxaSucessoMedia: 0,
      tempoMedioResposta: 0,
      categoriasMaisNegociadas: [],
      horariosAtividade: Array.from({ length: 24 }, (_, i) => ({ hora: i, atividade: 0 })),
    };
  }

  private initializeControlPanel(): BotControlPanel {
    return {
      id: 'main-control',
      nome: 'Sistema Principal de Bots',
      status: 'parado',
      botsAtivos: 0,
      transacoesPorMinuto: 0,
      volumeHoje: 0,
      lucroHoje: 0,
      configuracoes: {
        intervaloBots: 30, // 30 segundos para demonstração
        limiteDiario: 10000000, // R$ 10M
        autoAprendizado: true,
        notificacoes: true,
        logDetalhado: true,
      },
    };
  }

  private initializeBots() {
    // Empresas
    const empresas = [
      {
        nome: 'TechCorp Soluções Ltda',
        setor: 'tecnologia',
        patrimonio: 5000000,
        agressividade: 75,
      },
      {
        nome: 'Agronegócio Sul Brasil S/A',
        setor: 'agronegocio',
        patrimonio: 15000000,
        agressividade: 45,
      },
      {
        nome: 'Construtora Horizonte Ltda',
        setor: 'construcao',
        patrimonio: 8000000,
        agressividade: 60,
      },
      {
        nome: 'Metalúrgica Forte Aço S/A',
        setor: 'industrial',
        patrimonio: 12000000,
        agressividade: 80,
      },
      {
        nome: 'Energia Renovável do Brasil S/A',
        setor: 'energia',
        patrimonio: 25000000,
        agressividade: 55,
      },
    ];

    // Pessoas Físicas
    const pessoas = [
      { nome: 'Carlos Eduardo Silva', patrimonio: 500000, agressividade: 65 },
      { nome: 'Maria Fernanda Santos', patrimonio: 1200000, agressividade: 85 },
      { nome: 'João Pedro Oliveira', patrimonio: 800000, agressividade: 35 },
      { nome: 'Ana Carolina Ferreira', patrimonio: 2000000, agressividade: 70 },
      { nome: 'Juliana Alves Costa', patrimonio: 1500000, agressividade: 90 },
    ];

    let botId = 1;

    // Criar bots empresas
    empresas.forEach(empresa => {
      const bot: BotProfile = {
        id: `bot-${botId++}`,
        name: empresa.nome,
        type: 'empresa',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${empresa.nome.charAt(0)}&backgroundColor=random`,
        email: `financeiro@${empresa.nome.toLowerCase().replace(/[^a-z]/g, '')}.com.br`,
        documento: this.generateCNPJ(),
        telefone: this.generatePhone(),
        endereco: this.generateAddress(),
        kyc: this.generateKYC(),
        perfil: {
          patrimonio: empresa.patrimonio,
          rendaMensal: empresa.patrimonio * 0.05,
          experienciaInvestimentos: 'avancado',
          toleranciaRisco: empresa.agressividade > 70 ? 'agressivo' : 'moderado',
          objetivos: ['crescimento', 'diversificacao'],
          setoresPreferencia: [empresa.setor, 'financeiro'],
        },
        comportamento: this.generateBehavior(empresa.agressividade),
        stats: this.generateInitialStats(),
        ativo: Math.random() > 0.2, // 80% ativos
        ultimaAtividade: new Date(),
        criadoEm: new Date(),
      };
      this.bots.set(bot.id, bot);
    });

    // Criar bots pessoas físicas
    pessoas.forEach(pessoa => {
      const bot: BotProfile = {
        id: `bot-${botId++}`,
        name: pessoa.nome,
        type: 'pessoa_fisica',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${pessoa.nome}&backgroundColor=random`,
        email: `${pessoa.nome.toLowerCase().replace(/\s/g, '.')}@email.com`,
        documento: this.generateCPF(),
        telefone: this.generatePhone(),
        endereco: this.generateAddress(),
        kyc: this.generateKYC(),
        perfil: {
          patrimonio: pessoa.patrimonio,
          rendaMensal: pessoa.patrimonio * 0.03,
          experienciaInvestimentos: pessoa.agressividade > 70 ? 'avancado' : 'intermediario',
          toleranciaRisco: pessoa.agressividade > 70 ? 'agressivo' : 'moderado',
          objetivos: ['renda_passiva', 'preservacao'],
          setoresPreferencia: ['tributario', 'judicial'],
        },
        comportamento: this.generateBehavior(pessoa.agressividade),
        stats: this.generateInitialStats(),
        ativo: Math.random() > 0.3, // 70% ativos
        ultimaAtividade: new Date(),
        criadoEm: new Date(),
      };
      this.bots.set(bot.id, bot);
    });

    this.updateMetrics();
  }

  private generateMockTitulos() {
    const titulos = [
      { titulo: 'Crédito ICMS - Exportação Soja', categoria: 'ICMS', valor: 850000, desconto: 12 },
      {
        titulo: 'Precatório Alimentar - TJ/SP',
        categoria: 'PRECATORIO',
        valor: 1200000,
        desconto: 18,
      },
      {
        titulo: 'PIS/COFINS - Indústria Farmacêutica',
        categoria: 'PIS_COFINS',
        valor: 650000,
        desconto: 15,
      },
      {
        titulo: 'Crédito IRPJ - Empresa Tecnologia',
        categoria: 'IRPJ_CSLL',
        valor: 920000,
        desconto: 10,
      },
      {
        titulo: 'Duplicata Mercantil - Agronegócio',
        categoria: 'DUPLICATA',
        valor: 380000,
        desconto: 8,
      },
      { titulo: 'CPR Soja - Safra 2024', categoria: 'CPR', valor: 1500000, desconto: 20 },
      { titulo: 'ICMS ST - Combustíveis', categoria: 'ICMS', valor: 780000, desconto: 14 },
      {
        titulo: 'Precatório Federal - União',
        categoria: 'PRECATORIO',
        valor: 2100000,
        desconto: 22,
      },
      { titulo: 'Crédito Energia Elétrica', categoria: 'ICMS', valor: 560000, desconto: 11 },
      { titulo: 'COFINS - Setor Alimentício', categoria: 'PIS_COFINS', valor: 440000, desconto: 9 },
    ];

    this.titulos = titulos.map((t, index) => ({
      id: `titulo-${index + 1}`,
      titulo: t.titulo,
      descricao: `${t.titulo} - Oportunidade de investimento com ${t.desconto}% de desconto`,
      categoria: t.categoria as any,
      subcategoria: t.categoria as any,
      tipo: 'tributario' as any,
      classificacao: 'bom' as any,
      valor: t.valor,
      precoVenda: t.valor * (1 - t.desconto / 100),
      desconto: t.desconto,
      moeda: 'BRL' as const,
      vencimento: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
      dataEmissao: new Date(),
      rating: 3 + Math.random() * 2,
      qualidade: 'bbb' as any,
      risco: ['baixo', 'medio', 'alto'][Math.floor(Math.random() * 3)] as any,
      liquidez: 'media' as any,
      emissor: {
        nome: 'Empresa Exemplo Ltda',
        rating: 4.2,
        transacoes: 50,
        verificado: true,
        categoria: 'grande_empresa' as any,
        porte: 'grande' as any,
        setor: 'comercio' as any,
        regiao: {
          estado: 'SP',
          cidade: 'São Paulo',
          regiao: 'sudeste' as any,
        },
      },
      modalidade: ['leilao', 'venda_direta', 'proposta'][Math.floor(Math.random() * 3)] as any,
      status: 'disponivel' as any,
      garantias: [],
      seguros: [],
      fase: 'execucao' as any,
      orgaoEmissor: 'Receita Federal',
      visualizacoes: Math.floor(Math.random() * 100),
      favoritos: Math.floor(Math.random() * 20),
      compartilhamentos: Math.floor(Math.random() * 10),
      tempoMercado: Math.floor(Math.random() * 30),
      leilao: t.categoria.includes('LEILAO')
        ? {
            tempoRestante: Math.floor(Math.random() * 86400),
            lanceMinimo: t.valor * 0.8,
            participantes: Math.floor(Math.random() * 10) + 1,
            ultimoLance: t.valor * 0.85,
            incrementoMinimo: t.valor * 0.01,
            lanceAutomatico: false,
          }
        : undefined,
      vendaDireta: {
        precoFixo: t.valor * (1 - t.desconto / 100),
        negociavel: true,
        condicoesPagamento: ['a_vista', 'parcelado'],
        prazoEntrega: 5,
      },
      destaque: Math.random() > 0.7,
      premium: Math.random() > 0.8,
      urgente: Math.random() > 0.9,
      exclusivo: false,
      documentos: [],
      certificacoes: [],
      historico: [],
      tags: [t.categoria.toLowerCase()],
      palavrasChave: [t.titulo.toLowerCase()],
      condicoes: {
        aceitaNegociacao: true,
        condicoesPagamento: ['a_vista' as any],
      },
      observacoes: `Título de ${t.categoria} com excelente oportunidade de retorno`,
    }));
  }

  // === SISTEMA DE BOTS ===
  public startBotSystem(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.controlPanel.status = 'ativo';
    this.updateMetrics();

    // Processar ações dos bots
    this.intervalId = setInterval(() => {
      this.processBotActions();
    }, this.controlPanel.configuracoes.intervaloBots * 1000);

    toast.success('🤖 Sistema de bots iniciado!');
    console.log(
      '🤖 Sistema de bots iniciado - Processando a cada',
      this.controlPanel.configuracoes.intervaloBots,
      'segundos'
    );
  }

  public stopBotSystem(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.controlPanel.status = 'parado';

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    toast.info('🛑 Sistema de bots parado!');
    console.log('🛑 Sistema de bots parado');
  }

  public pauseBotSystem(): void {
    this.controlPanel.status = 'pausado';
    toast.warning('⏸️ Sistema de bots pausado!');
  }

  public resumeBotSystem(): void {
    this.controlPanel.status = 'ativo';
    toast.success('▶️ Sistema de bots retomado!');
  }

  // === PROCESSAMENTO DE AÇÕES ===
  private async processBotActions(): Promise<void> {
    if (this.controlPanel.status !== 'ativo') return;

    const activeBots = Array.from(this.bots.values()).filter(bot => bot.ativo);

    // Cada ciclo, alguns bots podem agir
    const actingBots = activeBots.filter(() => Math.random() < 0.3); // 30% chance de agir

    for (const bot of actingBots) {
      try {
        await this.executeBotAction(bot);
      } catch (error) {
        console.error(`Erro no bot ${bot.name}:`, error);
      }
    }

    this.updateMetrics();

    if (this.controlPanel.configuracoes.logDetalhado) {
      console.log(`🔄 Ciclo processado: ${actingBots.length} bots agiram`);
    }
  }

  private async executeBotAction(bot: BotProfile): Promise<void> {
    // Selecionar título aleatório
    const availableTitulos = this.titulos.filter(t => t.status === 'disponivel');
    if (availableTitulos.length === 0) return;

    const titulo = availableTitulos[Math.floor(Math.random() * availableTitulos.length)];

    // Decidir ação baseada no comportamento do bot
    const decision = this.makeBotDecision(bot, titulo);
    if (!decision) return;

    // Executar transação
    const transaction: BotTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      botId: bot.id,
      tituloId: titulo.id,
      tipo: decision.tipo,
      valor: decision.valor,
      timestamp: new Date(),
      status: 'executada',
      estrategiaUsada: decision.estrategia,
      confiancaML: decision.confianca,
      resultado: {
        lucro: (Math.random() - 0.3) * decision.valor * 0.1, // -30% a +70% do valor
        roi: (Math.random() - 0.3) * 0.2, // -30% a +70% ROI
        tempoExecucao: Math.random() * 2000 + 500, // 500ms a 2.5s
      },
    };

    this.transactions.push(transaction);

    // Atualizar estatísticas do bot
    bot.stats.transacoes++;
    bot.stats.volumeNegociado += transaction.valor;
    if (transaction.resultado && transaction.resultado.lucro > 0) {
      bot.stats.lucroAcumulado += transaction.resultado.lucro;
    }
    bot.ultimaAtividade = new Date();

    // Simular mudança no título (às vezes fica indisponível)
    if (Math.random() < 0.1) {
      // 10% chance
      titulo.status = 'vendido' as any;
    }

    // Log da transação
    if (this.controlPanel.configuracoes.logDetalhado) {
      console.log(
        `💰 ${bot.name} executou ${transaction.tipo} de ${this.formatCurrency(transaction.valor)} em ${titulo.titulo}`
      );
    }

    // Notificação
    if (this.controlPanel.configuracoes.notificacoes) {
      toast.success(
        `${bot.name} executou ${transaction.tipo} - ${this.formatCurrency(transaction.valor)}`
      );
    }
  }

  private makeBotDecision(bot: BotProfile, titulo: TituloCredito): any {
    // Análise baseada no comportamento do bot
    const interesse = this.calculateInterest(bot, titulo);
    if (interesse < 0.3) return null; // Não há interesse suficiente

    // Determinar tipo de ação
    let tipo: string;
    let valor: number;
    let estrategia: string;

    if (titulo.modalidade === 'leilao' && bot.comportamento.agressividade > 60) {
      tipo = 'dar_lance';
      valor = titulo.leilao?.ultimoLance! * (1 + Math.random() * 0.1) || titulo.precoVenda;
      estrategia = 'Leilão Agressivo';
    } else if (titulo.modalidade === 'venda_direta') {
      tipo = 'comprar';
      valor = titulo.precoVenda * (0.95 + Math.random() * 0.1); // Pequena negociação
      estrategia = 'Compra Direta';
    } else {
      tipo = 'fazer_proposta';
      valor = titulo.precoVenda * (0.8 + Math.random() * 0.15);
      estrategia = 'Proposta Estratégica';
    }

    // Verificar limites do bot
    if (valor > bot.comportamento.limites.valorMaximoTransacao) {
      valor = bot.comportamento.limites.valorMaximoTransacao;
    }

    return {
      tipo,
      valor,
      estrategia,
      confianca: interesse,
    };
  }

  private calculateInterest(bot: BotProfile, titulo: TituloCredito): number {
    let interesse = 0.5; // Base

    // Ajustar por desconto
    interesse += titulo.desconto * 0.02; // +2% por cada % de desconto

    // Ajustar por rating
    interesse += (titulo.rating - 3) * 0.1;

    // Ajustar por risco vs tolerância
    if (bot.perfil.toleranciaRisco === 'agressivo' && titulo.risco === 'alto') {
      interesse += 0.2;
    } else if (bot.perfil.toleranciaRisco === 'conservador' && titulo.risco === 'baixo') {
      interesse += 0.2;
    }

    // Ajustar por setores de preferência
    if (
      bot.perfil.setoresPreferencia.some(setor =>
        titulo.categoria.toLowerCase().includes(setor.toLowerCase())
      )
    ) {
      interesse += 0.15;
    }

    // Fator de aleatoriedade baseado na personalidade
    interesse += (Math.random() - 0.5) * (bot.comportamento.impulso / 100);

    return Math.max(0, Math.min(1, interesse));
  }

  // === UTILITÁRIOS ===
  private generateCNPJ(): string {
    const num = Math.floor(Math.random() * 100000000000000)
      .toString()
      .padStart(14, '0');
    return `${num.slice(0, 2)}.${num.slice(2, 5)}.${num.slice(5, 8)}/${num.slice(8, 12)}-${num.slice(12, 14)}`;
  }

  private generateCPF(): string {
    const num = Math.floor(Math.random() * 100000000000)
      .toString()
      .padStart(11, '0');
    return `${num.slice(0, 3)}.${num.slice(3, 6)}.${num.slice(6, 9)}-${num.slice(9, 11)}`;
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
    ];
    const address = addresses[Math.floor(Math.random() * addresses.length)];
    return { ...address, numero: Math.floor(Math.random() * 9999) + 1 + '', pais: 'Brasil' };
  }

  private generateKYC() {
    return {
      status: 'aprovado' as const,
      score: Math.floor(Math.random() * 30) + 70,
      documentos: [],
      dataAprovacao: new Date(),
      validadeDocumentos: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      nivelRisco: ['baixo', 'medio'][Math.floor(Math.random() * 2)] as any,
    };
  }

  private generateBehavior(agressividade: number) {
    return {
      agressividade,
      paciencia: 100 - agressividade + Math.random() * 20 - 10,
      analise: 50 + Math.random() * 40,
      impulso: agressividade + Math.random() * 20 - 10,
      estrategias: [],
      limites: {
        valorMaximoTransacao: Math.floor(Math.random() * 500000) + 100000,
        percentualPatrimonio: Math.floor(Math.random() * 15) + 5,
        numeroMaximoLeiloes: Math.floor(Math.random() * 5) + 3,
        tempoMinimoAnalise: Math.floor(Math.random() * 60) + 30,
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
        ultimoTreinamento: new Date(),
        parametros: {
          algoritmo: 'random_forest' as any,
          features: ['preco', 'desconto', 'rating'],
          pesos: { preco: 0.3, desconto: 0.4, rating: 0.3 },
          threshold: 0.7,
          confianca: 0.8,
        },
      },
    };
  }

  private generateInitialStats() {
    return {
      transacoes: Math.floor(Math.random() * 50),
      volumeNegociado: Math.floor(Math.random() * 1000000),
      lucroAcumulado: Math.floor(Math.random() * 100000),
      taxaSucesso: Math.random() * 0.4 + 0.6,
      tempoMedioDecisao: Math.floor(Math.random() * 120) + 30,
      categoriasFavoritas: ['ICMS', 'PRECATORIO', 'PIS_COFINS'].slice(
        0,
        Math.floor(Math.random() * 3) + 1
      ),
    };
  }

  private updateMetrics(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayTransactions = this.transactions.filter(t => t.timestamp >= today);

    this.metrics = {
      totalBots: this.bots.size,
      botsAtivos: Array.from(this.bots.values()).filter(b => b.ativo).length,
      transacoesHoje: todayTransactions.length,
      volumeHoje: todayTransactions.reduce((sum, t) => sum + t.valor, 0),
      lucroHoje: todayTransactions.reduce((sum, t) => sum + (t.resultado?.lucro || 0), 0),
      taxaSucessoMedia:
        Array.from(this.bots.values()).reduce((sum, b) => sum + b.stats.taxaSucesso, 0) /
        this.bots.size,
      tempoMedioResposta:
        Array.from(this.bots.values()).reduce((sum, b) => sum + b.stats.tempoMedioDecisao, 0) /
        this.bots.size,
      categoriasMaisNegociadas: this.getCategoriasMaisNegociadas(),
      horariosAtividade: this.getHorariosAtividade(),
    };

    this.controlPanel.botsAtivos = this.metrics.botsAtivos;
    this.controlPanel.volumeHoje = this.metrics.volumeHoje;
    this.controlPanel.lucroHoje = this.metrics.lucroHoje;
    this.controlPanel.transacoesPorMinuto =
      todayTransactions.length / Math.max(1, now.getHours() * 60 + now.getMinutes());
  }

  private getCategoriasMaisNegociadas(): string[] {
    const categorias = this.transactions.map(t => {
      const titulo = this.titulos.find(tit => tit.id === t.tituloId);
      return titulo?.categoria || 'OUTROS';
    });

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

  // === GETTERS PÚBLICOS ===
  public getBots(): BotProfile[] {
    return Array.from(this.bots.values());
  }

  public getBot(id: string): BotProfile | undefined {
    return this.bots.get(id);
  }

  public getTransactions(): BotTransaction[] {
    return this.transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getMetrics(): BotMetrics {
    return this.metrics;
  }

  public getControlPanel(): BotControlPanel {
    return this.controlPanel;
  }

  public getTitulos(): TituloCredito[] {
    return this.titulos;
  }

  public updateBotConfig(botId: string, config: Partial<BotProfile>): void {
    const bot = this.bots.get(botId);
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
      setTimeout(() => this.startBotSystem(), 1000);
    }
  }

  // === MACHINE LEARNING ===
  public async trainBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) return;

    // Simular treinamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    bot.comportamento.ml.modeloTreinado = true;
    bot.comportamento.ml.precisao = Math.min(0.95, bot.comportamento.ml.precisao + 0.05);
    bot.comportamento.ml.ultimoTreinamento = new Date();

    toast.success(`🧠 Bot ${bot.name} retreinado com sucesso!`);
  }

  public async trainAllBots(): Promise<void> {
    const bots = Array.from(this.bots.values());

    for (const bot of bots) {
      await this.trainBot(bot.id);
      await new Promise(resolve => setTimeout(resolve, 200)); // Pequena pausa entre treinamentos
    }

    toast.success('🧠 Todos os bots foram retreinados!');
  }
}

// Instância singleton
export const botEngine = BotEngineService.getInstance();
