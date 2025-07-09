interface CompensationParticipant {
  id: string;
  cnpj: string;
  razaoSocial: string;
  tipo: 'CREDORA' | 'DEVEDORA' | 'AMBAS';
  creditos: CreditoTributario[];
  debitos: DebitoTributario[];
  saldoLiquido: number;
  riscoPagamento: 'BAIXO' | 'MEDIO' | 'ALTO';
  limiteCredito: number;
  historicoPagamentos: number; // 0-100
}

interface CreditoTributario {
  id: string;
  tipo: string;
  valor: number;
  vencimento: Date;
  origem: string;
  situacao: 'DISPONIVEL' | 'BLOQUEADO' | 'EM_NEGOCIACAO' | 'COMPENSADO';
  liquidez: number; // 0-100
  desconto: number; // Desconto aplicado
  garantias?: string[];
}

interface DebitoTributario {
  id: string;
  tipo: string;
  valor: number;
  vencimento: Date;
  orgao: string;
  situacao: 'PENDENTE' | 'PARCELADO' | 'EM_COMPENSACAO' | 'QUITADO';
  prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';
  multa: number;
  juros: number;
}

interface MultilateralMatch {
  id: string;
  participantes: string[];
  valor: number;
  economia: number;
  complexidade: number;
  confiabilidade: number;
  tempoExecucao: number; // em dias
  riscoOperacional: 'BAIXO' | 'MEDIO' | 'ALTO';
  fluxos: CompensationFlow[];
  garantiasNecessarias: string[];
  cronograma: CompensationStep[];
}

interface CompensationFlow {
  de: string;
  para: string;
  valor: number;
  tipo: 'CREDITO' | 'DEBITO' | 'DIFERENCA';
  ordem: number;
  condicoes: string[];
}

interface CompensationStep {
  ordem: number;
  descricao: string;
  responsavel: string;
  prazo: Date;
  dependencias: number[];
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'BLOQUEADO';
}

interface OptimizationResult {
  matchesEncontrados: MultilateralMatch[];
  estatisticas: {
    totalParticipantes: number;
    valorTotalCompensado: number;
    economiaTotal: number;
    tempoMedioExecucao: number;
    taxaSucesso: number;
  };
  recomendacoes: string[];
  alertas: string[];
}

interface AIOptimizationConfig {
  objetivos: {
    maximizarEconomia: number; // peso 0-1
    minimizarRisco: number; // peso 0-1
    maximizarVelocidade: number; // peso 0-1
    maximizarParticipantes: number; // peso 0-1
  };
  restricoes: {
    valorMinimo: number;
    valorMaximo: number;
    prazoMaximo: number; // em dias
    riscoPagamentoMaximo: 'BAIXO' | 'MEDIO' | 'ALTO';
    tiposPermitidos: string[];
  };
  preferencias: {
    priorizarLiquidez: boolean;
    exigirGarantias: boolean;
    permitirParcelamento: boolean;
    aceitarDesconto: boolean;
  };
}

class MultilateralCompensationService {
  private participantes: Map<string, CompensationParticipant> = new Map();
  private matchesAtivos: Map<string, MultilateralMatch> = new Map();
  private historico: MultilateralMatch[] = [];

  constructor() {
    this.initializeMockData();
  }

  // Algoritmo principal de otimização multilateral
  async optimizeCompensations(config: AIOptimizationConfig): Promise<OptimizationResult> {
    console.log('🤖 Iniciando otimização multilateral com IA...');
    
    const participantesArray = Array.from(this.participantes.values());
    const matches: MultilateralMatch[] = [];
    
    // 1. Análise inicial dos participantes
    const analise = this.analisarParticipantes(participantesArray);
    
    // 2. Geração de combinações possíveis
    const combinacoes = this.gerarCombinacoes(participantesArray, config);
    
    // 3. Aplicação de algoritmos de IA
    for (const combinacao of combinacoes) {
      const match = await this.aplicarIAOptimization(combinacao, config);
      if (match && this.validarMatch(match, config)) {
        matches.push(match);
      }
    }
    
    // 4. Ranking e seleção dos melhores matches
    const matchesOtimizados = this.rankearMatches(matches, config);
    
    // 5. Análise de conflitos e exclusividade
    const matchesFinais = this.resolverConflitos(matchesOtimizados);
    
    return {
      matchesEncontrados: matchesFinais,
      estatisticas: this.calcularEstatisticas(matchesFinais, participantesArray),
      recomendacoes: this.gerarRecomendacoes(matchesFinais, analise),
      alertas: this.identificarAlertas(matchesFinais, participantesArray)
    };
  }

  private analisarParticipantes(participantes: CompensationParticipant[]) {
    return {
      totalCreditos: participantes.reduce((sum, p) => sum + p.creditos.reduce((s, c) => s + c.valor, 0), 0),
      totalDebitos: participantes.reduce((sum, p) => sum + p.debitos.reduce((s, d) => s + d.valor, 0), 0),
      participantesCredores: participantes.filter(p => p.saldoLiquido > 0).length,
      participantesDevedores: participantes.filter(p => p.saldoLiquido < 0).length,
      riscoPagamentoMedio: this.calcularRiscoMedio(participantes),
      liquidezMedia: this.calcularLiquidezMedia(participantes)
    };
  }

  private gerarCombinacoes(participantes: CompensationParticipant[], config: AIOptimizationConfig): CompensationParticipant[][] {
    const combinacoes: CompensationParticipant[][] = [];
    
    // Gerar combinações de 3 a N participantes
    for (let tamanho = 3; tamanho <= Math.min(participantes.length, 8); tamanho++) {
      const combsTamanho = this.gerarCombinacoesTamanho(participantes, tamanho);
      combinacoes.push(...combsTamanho.slice(0, 50)); // Limitar para performance
    }
    
    return combinacoes;
  }

  private gerarCombinacoesTamanho(arr: CompensationParticipant[], tamanho: number): CompensationParticipant[][] {
    if (tamanho === 1) return arr.map(item => [item]);
    if (tamanho > arr.length) return [];
    
    const resultado: CompensationParticipant[][] = [];
    
    for (let i = 0; i <= arr.length - tamanho; i++) {
      const primeiro = arr[i];
      const resto = this.gerarCombinacoesTamanho(arr.slice(i + 1), tamanho - 1);
      resultado.push(...resto.map(comb => [primeiro, ...comb]));
    }
    
    return resultado;
  }

  private async aplicarIAOptimization(
    participantes: CompensationParticipant[], 
    config: AIOptimizationConfig
  ): Promise<MultilateralMatch | null> {
    
    // 1. Calcular matriz de compatibilidade
    const matriz = this.calcularMatrizCompatibilidade(participantes);
    
    // 2. Algoritmo de otimização Hungarian/Munkres adaptado
    const fluxos = this.otimizarFluxos(participantes, matriz, config);
    
    if (fluxos.length === 0) return null;
    
    // 3. Calcular métricas do match
    const valor = fluxos.reduce((sum, f) => sum + f.valor, 0);
    const economia = this.calcularEconomia(fluxos, participantes);
    const risco = this.calcularRiscoOperacional(participantes, fluxos);
    
    // 4. Gerar cronograma otimizado
    const cronograma = this.gerarCronogramaIA(fluxos, participantes);
    
    return {
      id: `multilateral_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      participantes: participantes.map(p => p.id),
      valor,
      economia,
      complexidade: this.calcularComplexidade(fluxos),
      confiabilidade: this.calcularConfiabilidade(participantes),
      tempoExecucao: Math.max(...cronograma.map(c => Math.ceil((c.prazo.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))),
      riscoOperacional: risco,
      fluxos,
      garantiasNecessarias: this.identificarGarantiasNecessarias(participantes, risco),
      cronograma
    };
  }

  private calcularMatrizCompatibilidade(participantes: CompensationParticipant[]): number[][] {
    const n = participantes.length;
    const matriz: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          matriz[i][j] = this.calcularCompatibilidade(participantes[i], participantes[j]);
        }
      }
    }
    
    return matriz;
  }

  private calcularCompatibilidade(p1: CompensationParticipant, p2: CompensationParticipant): number {
    let score = 0;
    
    // Compatibilidade de tipos de crédito/débito
    const tiposP1 = [...new Set([...p1.creditos.map(c => c.tipo), ...p1.debitos.map(d => d.tipo)])];
    const tiposP2 = [...new Set([...p2.creditos.map(c => c.tipo), ...p2.debitos.map(d => d.tipo)])];
    const intersecao = tiposP1.filter(t => tiposP2.includes(t));
    score += intersecao.length * 10;
    
    // Complementaridade de saldos
    if ((p1.saldoLiquido > 0 && p2.saldoLiquido < 0) || (p1.saldoLiquido < 0 && p2.saldoLiquido > 0)) {
      score += 50;
    }
    
    // Confiabilidade mútua
    const riscoMedio = (this.getRiscoNumerico(p1.riscoPagamento) + this.getRiscoNumerico(p2.riscoPagamento)) / 2;
    score += (100 - riscoMedio) * 0.3;
    
    // Liquidez
    const liquidezMedia = (this.getLiquidezMedia(p1) + this.getLiquidezMedia(p2)) / 2;
    score += liquidezMedia * 0.2;
    
    return score;
  }

  private otimizarFluxos(
    participantes: CompensationParticipant[], 
    matriz: number[][], 
    config: AIOptimizationConfig
  ): CompensationFlow[] {
    const fluxos: CompensationFlow[] = [];
    const saldos = participantes.map(p => p.saldoLiquido);
    const processados = new Set<number>();
    
    // Algoritmo guloso com otimização local
    while (processados.size < participantes.length) {
      let melhorFluxo: { de: number; para: number; valor: number; score: number } | null = null;
      
      for (let i = 0; i < participantes.length; i++) {
        if (processados.has(i) || saldos[i] <= 0) continue;
        
        for (let j = 0; j < participantes.length; j++) {
          if (i === j || processados.has(j) || saldos[j] >= 0) continue;
          
          const valor = Math.min(saldos[i], Math.abs(saldos[j]));
          if (valor < config.restricoes.valorMinimo) continue;
          
          const score = matriz[i][j] * valor * config.objetivos.maximizarEconomia;
          
          if (!melhorFluxo || score > melhorFluxo.score) {
            melhorFluxo = { de: i, para: j, valor, score };
          }
        }
      }
      
      if (!melhorFluxo) break;
      
      // Adicionar fluxo
      fluxos.push({
        de: participantes[melhorFluxo.de].id,
        para: participantes[melhorFluxo.para].id,
        valor: melhorFluxo.valor,
        tipo: 'DIFERENCA',
        ordem: fluxos.length + 1,
        condicoes: this.gerarCondicoesFluxo(participantes[melhorFluxo.de], participantes[melhorFluxo.para])
      });
      
      // Atualizar saldos
      saldos[melhorFluxo.de] -= melhorFluxo.valor;
      saldos[melhorFluxo.para] += melhorFluxo.valor;
      
      // Marcar como processados se saldo zerado
      if (Math.abs(saldos[melhorFluxo.de]) < 0.01) processados.add(melhorFluxo.de);
      if (Math.abs(saldos[melhorFluxo.para]) < 0.01) processados.add(melhorFluxo.para);
    }
    
    return fluxos;
  }

  private gerarCronogramaIA(fluxos: CompensationFlow[], participantes: CompensationParticipant[]): CompensationStep[] {
    const steps: CompensationStep[] = [];
    const dataBase = new Date();
    
    // Step 1: Validação de documentos
    steps.push({
      ordem: 1,
      descricao: 'Validação de documentos e confirmação de saldos',
      responsavel: 'SISTEMA',
      prazo: new Date(dataBase.getTime() + 24 * 60 * 60 * 1000), // +1 dia
      dependencias: [],
      status: 'PENDENTE'
    });
    
    // Step 2: Análise de risco
    steps.push({
      ordem: 2,
      descricao: 'Análise de risco e aprovação das garantias',
      responsavel: 'COMPLIANCE',
      prazo: new Date(dataBase.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 dias
      dependencias: [1],
      status: 'PENDENTE'
    });
    
    // Steps 3+: Execução dos fluxos
    fluxos.forEach((fluxo, index) => {
      steps.push({
        ordem: index + 3,
        descricao: `Execução do fluxo: ${fluxo.de} → ${fluxo.para} (${fluxo.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`,
        responsavel: fluxo.de,
        prazo: new Date(dataBase.getTime() + (index + 3) * 24 * 60 * 60 * 1000),
        dependencias: index === 0 ? [2] : [index + 1],
        status: 'PENDENTE'
      });
    });
    
    // Step final: Confirmação
    steps.push({
      ordem: steps.length + 1,
      descricao: 'Confirmação final e registro blockchain',
      responsavel: 'SISTEMA',
      prazo: new Date(dataBase.getTime() + (steps.length + 1) * 24 * 60 * 60 * 1000),
      dependencias: [steps.length],
      status: 'PENDENTE'
    });
    
    return steps;
  }

  private validarMatch(match: MultilateralMatch, config: AIOptimizationConfig): boolean {
    // Validar valor
    if (match.valor < config.restricoes.valorMinimo || match.valor > config.restricoes.valorMaximo) {
      return false;
    }
    
    // Validar prazo
    if (match.tempoExecucao > config.restricoes.prazoMaximo) {
      return false;
    }
    
    // Validar risco
    const riscosPermitidos = ['BAIXO', 'MEDIO', 'ALTO'];
    const riskIndex = riscosPermitidos.indexOf(match.riscoOperacional);
    const maxRiskIndex = riscosPermitidos.indexOf(config.restricoes.riscoPagamentoMaximo);
    if (riskIndex > maxRiskIndex) {
      return false;
    }
    
    return true;
  }

  private rankearMatches(matches: MultilateralMatch[], config: AIOptimizationConfig): MultilateralMatch[] {
    return matches
      .map(match => ({
        ...match,
        score: this.calcularScoreMatch(match, config)
      }))
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 20); // Top 20 matches
  }

  private calcularScoreMatch(match: MultilateralMatch, config: AIOptimizationConfig): number {
    let score = 0;
    
    // Economia (peso configurável)
    score += match.economia * config.objetivos.maximizarEconomia * 100;
    
    // Risco (peso configurável - invertido)
    const riscoScore = match.riscoOperacional === 'BAIXO' ? 100 : 
                      match.riscoOperacional === 'MEDIO' ? 50 : 0;
    score += riscoScore * config.objetivos.minimizarRisco;
    
    // Velocidade (peso configurável - invertido)
    const velocidadeScore = Math.max(0, 100 - match.tempoExecucao * 5);
    score += velocidadeScore * config.objetivos.maximizarVelocidade;
    
    // Número de participantes (peso configurável)
    score += match.participantes.length * config.objetivos.maximizarParticipantes * 10;
    
    // Confiabilidade
    score += match.confiabilidade;
    
    return score;
  }

  private resolverConflitos(matches: MultilateralMatch[]): MultilateralMatch[] {
    const participantesUsados = new Set<string>();
    const matchesFinais: MultilateralMatch[] = [];
    
    for (const match of matches) {
      // Verificar se algum participante já está sendo usado
      const temConflito = match.participantes.some(p => participantesUsados.has(p));
      
      if (!temConflito) {
        matchesFinais.push(match);
        match.participantes.forEach(p => participantesUsados.add(p));
      }
    }
    
    return matchesFinais;
  }

  private calcularEstatisticas(matches: MultilateralMatch[], participantes: CompensationParticipant[]) {
    const participantesEnvolvidos = new Set(matches.flatMap(m => m.participantes));
    
    return {
      totalParticipantes: participantesEnvolvidos.size,
      valorTotalCompensado: matches.reduce((sum, m) => sum + m.valor, 0),
      economiaTotal: matches.reduce((sum, m) => sum + m.economia, 0),
      tempoMedioExecucao: matches.length > 0 ? 
        matches.reduce((sum, m) => sum + m.tempoExecucao, 0) / matches.length : 0,
      taxaSucesso: participantes.length > 0 ? 
        (participantesEnvolvidos.size / participantes.length) * 100 : 0
    };
  }

  private gerarRecomendacoes(matches: MultilateralMatch[], analise: any): string[] {
    const recomendacoes = [];
    
    if (matches.length === 0) {
      recomendacoes.push('Considere relaxar as restrições de valor mínimo');
      recomendacoes.push('Inclua mais participantes com perfis complementares');
    }
    
    if (analise.riscoPagamentoMedio > 60) {
      recomendacoes.push('Exija garantias adicionais para participantes de alto risco');
    }
    
    if (analise.liquidezMedia < 50) {
      recomendacoes.push('Priorize créditos com maior liquidez');
    }
    
    const tempoMedio = matches.reduce((sum, m) => sum + m.tempoExecucao, 0) / matches.length;
    if (tempoMedio > 10) {
      recomendacoes.push('Simplifique os fluxos para reduzir tempo de execução');
    }
    
    return recomendacoes;
  }

  private identificarAlertas(matches: MultilateralMatch[], participantes: CompensationParticipant[]): string[] {
    const alertas = [];
    
    // Verificar participantes de alto risco
    const participantesAltoRisco = participantes.filter(p => p.riscoPagamento === 'ALTO');
    if (participantesAltoRisco.length > 0) {
      alertas.push(`${participantesAltoRisco.length} participante(s) com alto risco de pagamento`);
    }
    
    // Verificar concentração de valor
    const valorTotal = matches.reduce((sum, m) => sum + m.valor, 0);
    const maiorMatch = Math.max(...matches.map(m => m.valor));
    if (maiorMatch > valorTotal * 0.5) {
      alertas.push('Concentração alta de valor em uma única compensação');
    }
    
    // Verificar prazos apertados
    const matchesRapidos = matches.filter(m => m.tempoExecucao < 3);
    if (matchesRapidos.length > 0) {
      alertas.push(`${matchesRapidos.length} compensação(ões) com prazo muito apertado`);
    }
    
    return alertas;
  }

  // Métodos auxiliares
  private calcularEconomia(fluxos: CompensationFlow[], participantes: CompensationParticipant[]): number {
    // Simular economia baseada em juros evitados e descontos
    let economia = 0;
    
    for (const fluxo of fluxos) {
      const participante = participantes.find(p => p.id === fluxo.para);
      if (participante) {
        // Economia de juros (estimativa 2% ao mês)
        economia += fluxo.valor * 0.02;
        
        // Economia de multa (estimativa 10%)
        const debitos = participante.debitos.filter(d => d.situacao === 'PENDENTE');
        const multaMedia = debitos.reduce((sum, d) => sum + d.multa, 0) / debitos.length || 0;
        economia += fluxo.valor * (multaMedia / 100);
      }
    }
    
    return economia;
  }

  private calcularRiscoOperacional(participantes: CompensationParticipant[], fluxos: CompensationFlow[]): 'BAIXO' | 'MEDIO' | 'ALTO' {
    const riscoMedio = participantes.reduce((sum, p) => sum + this.getRiscoNumerico(p.riscoPagamento), 0) / participantes.length;
    const complexidade = fluxos.length;
    const valor = fluxos.reduce((sum, f) => sum + f.valor, 0);
    
    const riscoCombinado = (riscoMedio + complexidade * 5 + (valor > 1000000 ? 20 : 0)) / 3;
    
    if (riscoCombinado < 30) return 'BAIXO';
    if (riscoCombinado < 60) return 'MEDIO';
    return 'ALTO';
  }

  private calcularComplexidade(fluxos: CompensationFlow[]): number {
    return Math.min(100, fluxos.length * 10 + (fluxos.length > 5 ? 20 : 0));
  }

  private calcularConfiabilidade(participantes: CompensationParticipant[]): number {
    const historico = participantes.reduce((sum, p) => sum + p.historicoPagamentos, 0) / participantes.length;
    const risco = this.calcularRiscoMedio(participantes);
    return Math.max(0, historico - risco);
  }

  private identificarGarantiasNecessarias(participantes: CompensationParticipant[], risco: string): string[] {
    const garantias = [];
    
    if (risco === 'ALTO') {
      garantias.push('Seguro garantia');
      garantias.push('Aval bancário');
    }
    
    if (risco === 'MEDIO') {
      garantias.push('Caução');
    }
    
    const participantesAltoRisco = participantes.filter(p => p.riscoPagamento === 'ALTO');
    if (participantesAltoRisco.length > 0) {
      garantias.push('Análise creditícia aprofundada');
    }
    
    return garantias;
  }

  private gerarCondicoesFluxo(p1: CompensationParticipant, p2: CompensationParticipant): string[] {
    const condicoes = [];
    
    if (p1.riscoPagamento === 'ALTO' || p2.riscoPagamento === 'ALTO') {
      condicoes.push('Validação de garantias');
    }
    
    condicoes.push('Confirmação de saldos atualizados');
    condicoes.push('Assinatura digital de ambas as partes');
    
    return condicoes;
  }

  private getRiscoNumerico(risco: string): number {
    switch (risco) {
      case 'BAIXO': return 10;
      case 'MEDIO': return 50;
      case 'ALTO': return 90;
      default: return 50;
    }
  }

  private getLiquidezMedia(participante: CompensationParticipant): number {
    if (participante.creditos.length === 0) return 0;
    return participante.creditos.reduce((sum, c) => sum + c.liquidez, 0) / participante.creditos.length;
  }

  private calcularRiscoMedio(participantes: CompensationParticipant[]): number {
    return participantes.reduce((sum, p) => sum + this.getRiscoNumerico(p.riscoPagamento), 0) / participantes.length;
  }

  private calcularLiquidezMedia(participantes: CompensationParticipant[]): number {
    const creditosTotal = participantes.flatMap(p => p.creditos);
    if (creditosTotal.length === 0) return 0;
    return creditosTotal.reduce((sum, c) => sum + c.liquidez, 0) / creditosTotal.length;
  }

  // Métodos públicos para gerenciamento
  async adicionarParticipante(participante: CompensationParticipant): Promise<void> {
    this.participantes.set(participante.id, participante);
  }

  async removerParticipante(id: string): Promise<void> {
    this.participantes.delete(id);
  }

  async obterParticipantes(): Promise<CompensationParticipant[]> {
    return Array.from(this.participantes.values());
  }

  async executarMatch(matchId: string): Promise<boolean> {
    const match = this.matchesAtivos.get(matchId);
    if (!match) return false;
    
    // Simular execução
    for (const step of match.cronograma) {
      step.status = 'CONCLUIDO';
    }
    
    // Mover para histórico
    this.historico.push(match);
    this.matchesAtivos.delete(matchId);
    
    return true;
  }

  async obterHistorico(): Promise<MultilateralMatch[]> {
    return this.historico;
  }

  // Inicialização com dados mock
  private initializeMockData(): void {
    const mockParticipantes: CompensationParticipant[] = [
      {
        id: 'empresa-1',
        cnpj: '12.345.678/0001-90',
        razaoSocial: 'TechCorp Ltda',
        tipo: 'CREDORA',
        creditos: [
          {
            id: 'cred-1',
            tipo: 'ICMS',
            valor: 500000,
            vencimento: new Date('2024-12-31'),
            origem: 'SUBSTITUIÇÃO TRIBUTÁRIA',
            situacao: 'DISPONIVEL',
            liquidez: 85,
            desconto: 5
          }
        ],
        debitos: [
          {
            id: 'deb-1',
            tipo: 'PIS',
            valor: 50000,
            vencimento: new Date('2024-11-30'),
            orgao: 'RECEITA FEDERAL',
            situacao: 'PENDENTE',
            prioridade: 'MEDIA',
            multa: 10,
            juros: 2
          }
        ],
        saldoLiquido: 450000,
        riscoPagamento: 'BAIXO',
        limiteCredito: 1000000,
        historicoPagamentos: 95
      },
      {
        id: 'empresa-2',
        cnpj: '98.765.432/0001-10',
        razaoSocial: 'Comercial ABC S.A.',
        tipo: 'DEVEDORA',
        creditos: [
          {
            id: 'cred-2',
            tipo: 'PIS',
            valor: 75000,
            vencimento: new Date('2024-11-15'),
            origem: 'RECOLHIMENTO INDEVIDO',
            situacao: 'DISPONIVEL',
            liquidez: 70,
            desconto: 8
          }
        ],
        debitos: [
          {
            id: 'deb-2',
            tipo: 'ICMS',
            valor: 800000,
            vencimento: new Date('2024-10-31'),
            orgao: 'SEFAZ-SP',
            situacao: 'PENDENTE',
            prioridade: 'ALTA',
            multa: 20,
            juros: 5
          }
        ],
        saldoLiquido: -725000,
        riscoPagamento: 'MEDIO',
        limiteCredito: 500000,
        historicoPagamentos: 78
      },
      {
        id: 'empresa-3',
        cnpj: '55.444.333/0001-22',
        razaoSocial: 'Indústria XYZ Ltda',
        tipo: 'AMBAS',
        creditos: [
          {
            id: 'cred-3',
            tipo: 'IPI',
            valor: 300000,
            vencimento: new Date('2025-01-31'),
            origem: 'EXPORTAÇÃO',
            situacao: 'DISPONIVEL',
            liquidez: 90,
            desconto: 3
          }
        ],
        debitos: [
          {
            id: 'deb-3',
            tipo: 'COFINS',
            valor: 200000,
            vencimento: new Date('2024-12-15'),
            orgao: 'RECEITA FEDERAL',
            situacao: 'PENDENTE',
            prioridade: 'MEDIA',
            multa: 15,
            juros: 3
          }
        ],
        saldoLiquido: 100000,
        riscoPagamento: 'BAIXO',
        limiteCredito: 750000,
        historicoPagamentos: 88
      }
    ];

    mockParticipantes.forEach(p => this.participantes.set(p.id, p));
  }
}

export const multilateralCompensationService = new MultilateralCompensationService();
export type {
  CompensationParticipant,
  CreditoTributario,
  DebitoTributario,
  MultilateralMatch,
  CompensationFlow,
  CompensationStep,
  OptimizationResult,
  AIOptimizationConfig
};