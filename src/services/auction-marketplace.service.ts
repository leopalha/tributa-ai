interface CreditoLeilao {
  id: string;
  vendedor: {
    id: string;
    razaoSocial: string;
    cnpj: string;
    rating: number; // 0-100
    transacoesCompletas: number;
  };
  credito: {
    tipo: string;
    valor: number;
    vencimento: Date;
    origem: string;
    documentacao: string[];
    liquidez: number; // 0-100
    garantias: string[];
  };
  leilao: {
    precoInicial: number;
    precoReserva?: number;
    desconto: number; // %
    modalidade: 'LANCE_ABERTO' | 'LANCE_FECHADO' | 'HOLANDÊS' | 'INGLÊS';
    duracao: number; // em horas
    dataInicio: Date;
    dataFim: Date;
    status: 'AGENDADO' | 'ATIVO' | 'FINALIZADO' | 'CANCELADO';
  };
  lances: Lance[];
  metadados: {
    visualizacoes: number;
    interessados: number;
    melhorOferta: number;
    historico: string[];
  };
}

interface Lance {
  id: string;
  comprador: {
    id: string;
    razaoSocial: string;
    cnpj: string;
    rating: number;
    limiteCredito: number;
  };
  valor: number;
  desconto: number;
  timestamp: Date;
  automatico: boolean;
  estrategia?: string;
  status: 'ATIVO' | 'SUPERADO' | 'VENCEDOR' | 'REJEITADO';
  garantia?: {
    tipo: string;
    valor: number;
    documento: string;
  };
}

interface EstrategiaLance {
  id: string;
  nome: string;
  usuario: string;
  ativa: boolean;
  parametros: {
    valorMaximo: number;
    descontoMaximo: number;
    tiposCredito: string[];
    ratingMinimoVendedor: number;
    liquidezMinima: number;
    incrementoLance: number; // %
    tempoRestanteMinimo: number; // minutos
    freqMode: 'AGRESSIVO' | 'CONSERVADOR' | 'EQUILIBRADO';
  };
  condicoes: {
    valorMinimo: number;
    valorMaximo: number;
    prazoVencimento: number; // dias
    garantiasObrigatorias: boolean;
    blacklistVendedores: string[];
    whitelistTipos: string[];
  };
  historico: {
    leiloesParticipados: number;
    leiloesVencidos: number;
    valorTotalArrematado: number;
    economiaMedia: number;
    ultimaExecucao: Date;
  };
}

interface LeilaoStats {
  totalLeiloes: number;
  totalAtivos: number;
  volumeNegociado: number;
  economiaMedia: number;
  participantesAtivos: number;
  taxaSucesso: number;
  tempoMedioLeilao: number;
  tiposMaisNegociados: { tipo: string; volume: number; count: number }[];
}

interface NotificacaoLeilao {
  id: string;
  tipo: 'NOVO_LEILAO' | 'LANCE_SUPERADO' | 'LEILAO_VENCIDO' | 'ESTRATEGIA_EXECUTADA';
  leilaoId: string;
  titulo: string;
  mensagem: string;
  timestamp: Date;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  lida: boolean;
  acoes: {
    label: string;
    action: string;
    params?: any;
  }[];
}

class AuctionMarketplaceService {
  private leiloes: Map<string, CreditoLeilao> = new Map();
  private estrategias: Map<string, EstrategiaLance> = new Map();
  private notificacoes: NotificacaoLeilao[] = [];
  private intervaloMonitoramento: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeMockData();
    this.iniciarMonitoramento();
  }

  // Criar novo leilão
  async criarLeilao(creditoData: any, leilaoConfig: any): Promise<string> {
    const leilaoId = `leilao_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const leilao: CreditoLeilao = {
      id: leilaoId,
      vendedor: {
        id: creditoData.vendedorId || 'empresa-1',
        razaoSocial: creditoData.vendedorRazaoSocial || 'TechCorp Ltda',
        cnpj: creditoData.vendedorCnpj || '12.345.678/0001-90',
        rating: creditoData.vendedorRating || 85,
        transacoesCompletas: creditoData.transacoesCompletas || 47
      },
      credito: {
        tipo: creditoData.tipo,
        valor: creditoData.valor,
        vencimento: new Date(creditoData.vencimento),
        origem: creditoData.origem,
        documentacao: creditoData.documentacao || ['DCOMP', 'Análise Jurídica'],
        liquidez: creditoData.liquidez || 80,
        garantias: creditoData.garantias || []
      },
      leilao: {
        precoInicial: leilaoConfig.precoInicial,
        precoReserva: leilaoConfig.precoReserva,
        desconto: leilaoConfig.desconto,
        modalidade: leilaoConfig.modalidade || 'LANCE_ABERTO',
        duracao: leilaoConfig.duracao || 24,
        dataInicio: new Date(),
        dataFim: new Date(Date.now() + (leilaoConfig.duracao || 24) * 60 * 60 * 1000),
        status: 'ATIVO'
      },
      lances: [],
      metadados: {
        visualizacoes: 0,
        interessados: 0,
        melhorOferta: leilaoConfig.precoInicial,
        historico: [`Leilão criado em ${new Date().toLocaleString('pt-BR')}`]
      }
    };

    this.leiloes.set(leilaoId, leilao);
    
    // Notificar sobre novo leilão
    await this.notificarNovoLeilao(leilao);
    
    return leilaoId;
  }

  // Fazer lance manual
  async fazerLance(leilaoId: string, compradorData: any, valor: number): Promise<boolean> {
    const leilao = this.leiloes.get(leilaoId);
    if (!leilao || leilao.leilao.status !== 'ATIVO') {
      return false;
    }

    // Validar se lance é maior que o atual
    const melhorLance = this.obterMelhorLance(leilao);
    if (melhorLance && valor <= melhorLance.valor) {
      return false;
    }

    // Criar lance
    const lance: Lance = {
      id: `lance_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      comprador: {
        id: compradorData.id,
        razaoSocial: compradorData.razaoSocial,
        cnpj: compradorData.cnpj,
        rating: compradorData.rating || 75,
        limiteCredito: compradorData.limiteCredito || 1000000
      },
      valor,
      desconto: ((leilao.credito.valor - valor) / leilao.credito.valor) * 100,
      timestamp: new Date(),
      automatico: false,
      status: 'ATIVO'
    };

    // Marcar lances anteriores como superados
    leilao.lances.forEach(l => {
      if (l.status === 'ATIVO') l.status = 'SUPERADO';
    });

    leilao.lances.push(lance);
    leilao.metadados.melhorOferta = valor;
    leilao.metadados.historico.push(
      `Lance de R$ ${valor.toLocaleString('pt-BR')} por ${compradorData.razaoSocial}`
    );

    // Notificar lance superado para outros participantes
    await this.notificarLanceSuperado(leilao, lance);

    return true;
  }

  // Criar estratégia de lance automático
  async criarEstrategia(estrategiaData: any): Promise<string> {
    const estrategiaId = `estrategia_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const estrategia: EstrategiaLance = {
      id: estrategiaId,
      nome: estrategiaData.nome,
      usuario: estrategiaData.usuario,
      ativa: true,
      parametros: {
        valorMaximo: estrategiaData.valorMaximo,
        descontoMaximo: estrategiaData.descontoMaximo,
        tiposCredito: estrategiaData.tiposCredito || [],
        ratingMinimoVendedor: estrategiaData.ratingMinimoVendedor || 70,
        liquidezMinima: estrategiaData.liquidezMinima || 60,
        incrementoLance: estrategiaData.incrementoLance || 2,
        tempoRestanteMinimo: estrategiaData.tempoRestanteMinimo || 30,
        freqMode: estrategiaData.freqMode || 'EQUILIBRADO'
      },
      condicoes: {
        valorMinimo: estrategiaData.valorMinimo || 50000,
        valorMaximo: estrategiaData.valorMaximo,
        prazoVencimento: estrategiaData.prazoVencimento || 365,
        garantiasObrigatorias: estrategiaData.garantiasObrigatorias || false,
        blacklistVendedores: estrategiaData.blacklistVendedores || [],
        whitelistTipos: estrategiaData.whitelistTipos || []
      },
      historico: {
        leiloesParticipados: 0,
        leiloesVencidos: 0,
        valorTotalArrematado: 0,
        economiaMedia: 0,
        ultimaExecucao: new Date()
      }
    };

    this.estrategias.set(estrategiaId, estrategia);
    return estrategiaId;
  }

  // Executar estratégias automáticas
  private async executarEstrategias(): Promise<void> {
    const leiloesAtivos = Array.from(this.leiloes.values())
      .filter(l => l.leilao.status === 'ATIVO');

    for (const estrategia of this.estrategias.values()) {
      if (!estrategia.ativa) continue;

      for (const leilao of leiloesAtivos) {
        if (await this.deveParticipar(estrategia, leilao)) {
          await this.executarLanceAutomatico(estrategia, leilao);
        }
      }
    }
  }

  private async deveParticipar(estrategia: EstrategiaLance, leilao: CreditoLeilao): Promise<boolean> {
    // Verificar tipo de crédito
    if (estrategia.condicoes.whitelistTipos.length > 0 && 
        !estrategia.condicoes.whitelistTipos.includes(leilao.credito.tipo)) {
      return false;
    }

    // Verificar blacklist de vendedores
    if (estrategia.condicoes.blacklistVendedores.includes(leilao.vendedor.id)) {
      return false;
    }

    // Verificar valor
    if (leilao.credito.valor < estrategia.condicoes.valorMinimo || 
        leilao.credito.valor > estrategia.condicoes.valorMaximo) {
      return false;
    }

    // Verificar rating do vendedor
    if (leilao.vendedor.rating < estrategia.parametros.ratingMinimoVendedor) {
      return false;
    }

    // Verificar liquidez
    if (leilao.credito.liquidez < estrategia.parametros.liquidezMinima) {
      return false;
    }

    // Verificar prazo de vencimento
    const diasParaVencimento = Math.ceil(
      (leilao.credito.vencimento.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
    );
    if (diasParaVencimento > estrategia.condicoes.prazoVencimento) {
      return false;
    }

    // Verificar tempo restante do leilão
    const minutosRestantes = Math.ceil(
      (leilao.leilao.dataFim.getTime() - Date.now()) / (60 * 1000)
    );
    if (minutosRestantes < estrategia.parametros.tempoRestanteMinimo) {
      return false;
    }

    return true;
  }

  private async executarLanceAutomatico(estrategia: EstrategiaLance, leilao: CreditoLeilao): Promise<void> {
    const melhorLance = this.obterMelhorLance(leilao);
    const valorAtual = melhorLance?.valor || leilao.leilao.precoInicial;
    
    // Calcular novo valor baseado na estratégia
    let novoValor = valorAtual;
    
    switch (estrategia.parametros.freqMode) {
      case 'AGRESSIVO':
        novoValor = valorAtual * (1 + (estrategia.parametros.incrementoLance * 2) / 100);
        break;
      case 'CONSERVADOR':
        novoValor = valorAtual * (1 + estrategia.parametros.incrementoLance / 200);
        break;
      case 'EQUILIBRADO':
      default:
        novoValor = valorAtual * (1 + estrategia.parametros.incrementoLance / 100);
        break;
    }

    // Verificar se não excede o limite
    if (novoValor > estrategia.parametros.valorMaximo) {
      return;
    }

    // Verificar desconto máximo
    const desconto = ((leilao.credito.valor - novoValor) / leilao.credito.valor) * 100;
    if (desconto > estrategia.parametros.descontoMaximo) {
      return;
    }

    // Criar lance automático
    const lance: Lance = {
      id: `lance_auto_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      comprador: {
        id: estrategia.usuario,
        razaoSocial: `Estratégia: ${estrategia.nome}`,
        cnpj: '00.000.000/0001-00',
        rating: 90,
        limiteCredito: estrategia.parametros.valorMaximo
      },
      valor: novoValor,
      desconto,
      timestamp: new Date(),
      automatico: true,
      estrategia: estrategia.nome,
      status: 'ATIVO'
    };

    // Marcar lances anteriores como superados
    leilao.lances.forEach(l => {
      if (l.status === 'ATIVO') l.status = 'SUPERADO';
    });

    leilao.lances.push(lance);
    leilao.metadados.melhorOferta = novoValor;
    leilao.metadados.historico.push(
      `Lance automático de R$ ${novoValor.toLocaleString('pt-BR')} (${estrategia.nome})`
    );

    // Atualizar estatísticas da estratégia
    estrategia.historico.leiloesParticipados++;
    estrategia.historico.ultimaExecucao = new Date();

    // Notificar execução da estratégia
    await this.notificarEstrategiaExecutada(estrategia, leilao, lance);
  }

  // Finalizar leilões expirados
  private async processarLeiloesExpirados(): Promise<void> {
    const agora = new Date();
    
    for (const leilao of this.leiloes.values()) {
      if (leilao.leilao.status === 'ATIVO' && leilao.leilao.dataFim <= agora) {
        await this.finalizarLeilao(leilao.id);
      }
    }
  }

  private async finalizarLeilao(leilaoId: string): Promise<void> {
    const leilao = this.leiloes.get(leilaoId);
    if (!leilao) return;

    leilao.leilao.status = 'FINALIZADO';
    
    const lanceVencedor = this.obterMelhorLance(leilao);
    if (lanceVencedor) {
      lanceVencedor.status = 'VENCEDOR';
      
      // Atualizar estatísticas da estratégia se foi lance automático
      if (lanceVencedor.automatico && lanceVencedor.estrategia) {
        const estrategia = Array.from(this.estrategias.values())
          .find(e => e.nome === lanceVencedor.estrategia);
        
        if (estrategia) {
          estrategia.historico.leiloesVencidos++;
          estrategia.historico.valorTotalArrematado += lanceVencedor.valor;
          estrategia.historico.economiaMedia = 
            (estrategia.historico.economiaMedia + lanceVencedor.desconto) / 2;
        }
      }

      // Notificar vencedor
      await this.notificarLeilaoVencido(leilao, lanceVencedor);
    }

    leilao.metadados.historico.push(
      `Leilão finalizado em ${new Date().toLocaleString('pt-BR')}`
    );
  }

  // Obter estatísticas
  async obterEstatisticas(): Promise<LeilaoStats> {
    const leiloes = Array.from(this.leiloes.values());
    const totalLeiloes = leiloes.length;
    const leiloesAtivos = leiloes.filter(l => l.leilao.status === 'ATIVO');
    const leiloesFinalizados = leiloes.filter(l => l.leilao.status === 'FINALIZADO');

    const volumeNegociado = leiloesFinalizados.reduce((sum, l) => {
      const melhorLance = this.obterMelhorLance(l);
      return sum + (melhorLance?.valor || 0);
    }, 0);

    const economiaMedia = leiloesFinalizados.length > 0 ?
      leiloesFinalizados.reduce((sum, l) => {
        const melhorLance = this.obterMelhorLance(l);
        return sum + (melhorLance?.desconto || 0);
      }, 0) / leiloesFinalizados.length : 0;

    const participantesUnicos = new Set(
      leiloes.flatMap(l => l.lances.map(lance => lance.comprador.id))
    );

    const leiloesComLances = leiloesFinalizados.filter(l => l.lances.length > 0);
    const taxaSucesso = totalLeiloes > 0 ? (leiloesComLances.length / totalLeiloes) * 100 : 0;

    const tempoMedioLeilao = leiloes.length > 0 ?
      leiloes.reduce((sum, l) => sum + l.leilao.duracao, 0) / leiloes.length : 0;

    // Tipos mais negociados
    const tipoStats = new Map<string, { volume: number; count: number }>();
    leiloesFinalizados.forEach(l => {
      const melhorLance = this.obterMelhorLance(l);
      if (melhorLance) {
        const existing = tipoStats.get(l.credito.tipo) || { volume: 0, count: 0 };
        existing.volume += melhorLance.valor;
        existing.count++;
        tipoStats.set(l.credito.tipo, existing);
      }
    });

    const tiposMaisNegociados = Array.from(tipoStats.entries())
      .map(([tipo, stats]) => ({ tipo, ...stats }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);

    return {
      totalLeiloes,
      totalAtivos: leiloesAtivos.length,
      volumeNegociado,
      economiaMedia,
      participantesAtivos: participantesUnicos.size,
      taxaSucesso,
      tempoMedioLeilao,
      tiposMaisNegociados
    };
  }

  // Métodos auxiliares
  private obterMelhorLance(leilao: CreditoLeilao): Lance | null {
    const lancesAtivos = leilao.lances.filter(l => l.status === 'ATIVO' || l.status === 'VENCEDOR');
    if (lancesAtivos.length === 0) return null;
    
    return lancesAtivos.reduce((melhor, atual) => 
      atual.valor > melhor.valor ? atual : melhor
    );
  }

  // Notificações
  private async notificarNovoLeilao(leilao: CreditoLeilao): Promise<void> {
    const notificacao: NotificacaoLeilao = {
      id: `notif_${Date.now()}`,
      tipo: 'NOVO_LEILAO',
      leilaoId: leilao.id,
      titulo: '🔨 Novo Leilão Disponível',
      mensagem: `${leilao.credito.tipo} - R$ ${leilao.credito.valor.toLocaleString('pt-BR')} - Desconto inicial: ${leilao.leilao.desconto}%`,
      timestamp: new Date(),
      prioridade: 'MEDIA',
      lida: false,
      acoes: [
        { label: 'Ver Leilão', action: 'view_auction', params: { leilaoId: leilao.id } },
        { label: 'Fazer Lance', action: 'make_bid', params: { leilaoId: leilao.id } }
      ]
    };

    this.notificacoes.unshift(notificacao);
  }

  private async notificarLanceSuperado(leilao: CreditoLeilao, novoLance: Lance): Promise<void> {
    const notificacao: NotificacaoLeilao = {
      id: `notif_${Date.now()}`,
      tipo: 'LANCE_SUPERADO',
      leilaoId: leilao.id,
      titulo: '⚡ Lance Superado',
      mensagem: `Novo lance de R$ ${novoLance.valor.toLocaleString('pt-BR')} em ${leilao.credito.tipo}`,
      timestamp: new Date(),
      prioridade: 'ALTA',
      lida: false,
      acoes: [
        { label: 'Novo Lance', action: 'make_bid', params: { leilaoId: leilao.id } }
      ]
    };

    this.notificacoes.unshift(notificacao);
  }

  private async notificarLeilaoVencido(leilao: CreditoLeilao, lanceVencedor: Lance): Promise<void> {
    const notificacao: NotificacaoLeilao = {
      id: `notif_${Date.now()}`,
      tipo: 'LEILAO_VENCIDO',
      leilaoId: leilao.id,
      titulo: '🏆 Leilão Vencido!',
      mensagem: `Parabéns! Você venceu o leilão de ${leilao.credito.tipo} por R$ ${lanceVencedor.valor.toLocaleString('pt-BR')}`,
      timestamp: new Date(),
      prioridade: 'URGENTE',
      lida: false,
      acoes: [
        { label: 'Ver Detalhes', action: 'view_win', params: { leilaoId: leilao.id } },
        { label: 'Processar Compra', action: 'process_purchase', params: { leilaoId: leilao.id } }
      ]
    };

    this.notificacoes.unshift(notificacao);
  }

  private async notificarEstrategiaExecutada(estrategia: EstrategiaLance, leilao: CreditoLeilao, lance: Lance): Promise<void> {
    const notificacao: NotificacaoLeilao = {
      id: `notif_${Date.now()}`,
      tipo: 'ESTRATEGIA_EXECUTADA',
      leilaoId: leilao.id,
      titulo: '🤖 Estratégia Executada',
      mensagem: `"${estrategia.nome}" fez lance de R$ ${lance.valor.toLocaleString('pt-BR')} em ${leilao.credito.tipo}`,
      timestamp: new Date(),
      prioridade: 'MEDIA',
      lida: false,
      acoes: [
        { label: 'Ver Lance', action: 'view_bid', params: { leilaoId: leilao.id } }
      ]
    };

    this.notificacoes.unshift(notificacao);
  }

  // Métodos públicos
  async obterLeiloes(filtros?: any): Promise<CreditoLeilao[]> {
    let leiloes = Array.from(this.leiloes.values());

    if (filtros?.status) {
      leiloes = leiloes.filter(l => l.leilao.status === filtros.status);
    }

    if (filtros?.tipo) {
      leiloes = leiloes.filter(l => l.credito.tipo === filtros.tipo);
    }

    if (filtros?.valorMin) {
      leiloes = leiloes.filter(l => l.credito.valor >= filtros.valorMin);
    }

    if (filtros?.valorMax) {
      leiloes = leiloes.filter(l => l.credito.valor <= filtros.valorMax);
    }

    return leiloes.sort((a, b) => b.leilao.dataInicio.getTime() - a.leilao.dataInicio.getTime());
  }

  async obterLeilao(id: string): Promise<CreditoLeilao | null> {
    return this.leiloes.get(id) || null;
  }

  async obterEstrategias(usuario?: string): Promise<EstrategiaLance[]> {
    let estrategias = Array.from(this.estrategias.values());
    
    if (usuario) {
      estrategias = estrategias.filter(e => e.usuario === usuario);
    }

    return estrategias;
  }

  async atualizarEstrategia(id: string, updates: Partial<EstrategiaLance>): Promise<boolean> {
    const estrategia = this.estrategias.get(id);
    if (!estrategia) return false;

    Object.assign(estrategia, updates);
    return true;
  }

  async obterNotificacoes(limite?: number): Promise<NotificacaoLeilao[]> {
    return this.notificacoes.slice(0, limite || 50);
  }

  async marcarNotificacaoLida(id: string): Promise<void> {
    const notificacao = this.notificacoes.find(n => n.id === id);
    if (notificacao) {
      notificacao.lida = true;
    }
  }

  // Monitoramento automático
  private iniciarMonitoramento(): void {
    // Executar estratégias a cada 30 segundos
    this.intervaloMonitoramento = setInterval(async () => {
      await this.executarEstrategias();
      await this.processarLeiloesExpirados();
    }, 30000);
  }

  public pararMonitoramento(): void {
    if (this.intervaloMonitoramento) {
      clearInterval(this.intervaloMonitoramento);
      this.intervaloMonitoramento = null;
    }
  }

  // Dados mock iniciais
  private initializeMockData(): void {
    // Estratégias exemplo
    const estrategiaExample: EstrategiaLance = {
      id: 'estrategia-1',
      nome: 'ICMS Agressivo',
      usuario: 'user-1',
      ativa: true,
      parametros: {
        valorMaximo: 500000,
        descontoMaximo: 20,
        tiposCredito: ['ICMS'],
        ratingMinimoVendedor: 80,
        liquidezMinima: 70,
        incrementoLance: 3,
        tempoRestanteMinimo: 15,
        freqMode: 'AGRESSIVO'
      },
      condicoes: {
        valorMinimo: 100000,
        valorMaximo: 500000,
        prazoVencimento: 180,
        garantiasObrigatorias: false,
        blacklistVendedores: [],
        whitelistTipos: ['ICMS', 'PIS']
      },
      historico: {
        leiloesParticipados: 12,
        leiloesVencidos: 7,
        valorTotalArrematado: 1250000,
        economiaMedia: 15.5,
        ultimaExecucao: new Date()
      }
    };

    this.estrategias.set('estrategia-1', estrategiaExample);

    // Leilões exemplo
    const leilaoExample: CreditoLeilao = {
      id: 'leilao-1',
      vendedor: {
        id: 'empresa-1',
        razaoSocial: 'Indústria ABC Ltda',
        cnpj: '12.345.678/0001-90',
        rating: 92,
        transacoesCompletas: 78
      },
      credito: {
        tipo: 'ICMS',
        valor: 250000,
        vencimento: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        origem: 'SUBSTITUIÇÃO TRIBUTÁRIA',
        documentacao: ['DCOMP', 'Análise Jurídica', 'Certidão RF'],
        liquidez: 85,
        garantias: ['Seguro Garantia']
      },
      leilao: {
        precoInicial: 200000,
        precoReserva: 180000,
        desconto: 20,
        modalidade: 'LANCE_ABERTO',
        duracao: 48,
        dataInicio: new Date(),
        dataFim: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: 'ATIVO'
      },
      lances: [
        {
          id: 'lance-1',
          comprador: {
            id: 'empresa-2',
            razaoSocial: 'TechCorp Solutions',
            cnpj: '98.765.432/0001-10',
            rating: 88,
            limiteCredito: 1000000
          },
          valor: 205000,
          desconto: 18,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          automatico: false,
          status: 'ATIVO'
        }
      ],
      metadados: {
        visualizacoes: 47,
        interessados: 8,
        melhorOferta: 205000,
        historico: [
          'Leilão criado',
          'Primeiro lance de R$ 205.000'
        ]
      }
    };

    this.leiloes.set('leilao-1', leilaoExample);
  }
}

export const auctionMarketplaceService = new AuctionMarketplaceService();

export type {
  CreditoLeilao,
  Lance,
  EstrategiaLance,
  LeilaoStats,
  NotificacaoLeilao
};