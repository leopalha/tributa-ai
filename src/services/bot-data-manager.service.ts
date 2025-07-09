// Bot Data Manager Service
// Gerencia dados dos bots vs dados do usuário
// Implementa padrão de atualização consistente

export interface DataOrigin {
  source: 'USER' | 'BOT' | 'SYSTEM';
  timestamp: string;
  userId?: string;
  botId?: string;
  category: string;
}

export interface RefreshableData {
  id: string;
  data: any;
  origin: DataOrigin;
  preserveOnRefresh: boolean;
  lastUpdated: string;
}

class BotDataManagerService {
  private readonly USER_DATA_KEYS = [
    'analises_obrigacoes',
    'creditos_identificados',
    'tokens_criados',
    'empresas_cadastradas',
    'kyc_data'
  ];

  private readonly BOT_DATA_KEYS = [
    'marketplace_anuncios',
    'negociacoes_ativas',
    'estatisticas_plataforma',
    'processos_rf',
    'oportunidades_compensacao'
  ];

  /**
   * Atualiza dados mantendo preservação seletiva
   */
  async refreshData(category: string, forceRefresh: boolean = false): Promise<void> {
    console.log(`Atualizando dados da categoria: ${category}`);
    
    try {
      switch (category) {
        case 'marketplace':
          await this.refreshMarketplaceData();
          break;
        case 'compensacao':
          await this.refreshCompensacaoData();
          break;
        case 'creditos':
          await this.refreshCreditosData();
          break;
        case 'tokenizacao':
          await this.refreshTokenizacaoData();
          break;
        case 'processos':
          await this.refreshProcessosData();
          break;
        case 'all':
          await this.refreshAllData();
          break;
        default:
          console.warn(`Categoria não reconhecida: ${category}`);
      }
      
      this.notifyRefreshComplete(category);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      throw error;
    }
  }

  /**
   * Preserva dados do usuário e atualiza dados dos bots
   */
  private preserveUserData(storageKey: string, newData: any[]): any[] {
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Separar dados do usuário dos dados dos bots
    const userData = existingData.filter((item: any) => 
      item.origin?.source === 'USER' || 
      item.isUserCreated === true ||
      item.origem === 'ANALISE_IA' ||
      item.source === 'user'
    );
    
    // Combinar dados preservados com novos dados dos bots
    const combinedData = [...userData, ...newData];
    
    console.log(`${storageKey}: Preservados ${userData.length} itens do usuário, adicionados ${newData.length} novos dos bots`);
    
    return combinedData;
  }

  /**
   * Gera dados simulados do marketplace
   */
  private async refreshMarketplaceData(): Promise<void> {
    const mockAnuncios = this.generateMarketplaceData();
    const preservedData = this.preserveUserData('marketplace_anuncios', mockAnuncios);
    localStorage.setItem('marketplace_anuncios', JSON.stringify(preservedData));
    
    // Atualizar estatísticas
    const stats = this.generateMarketplaceStats();
    localStorage.setItem('marketplace_stats', JSON.stringify(stats));
  }

  /**
   * Gera dados simulados de compensação
   */
  private async refreshCompensacaoData(): Promise<void> {
    const mockOportunidades = this.generateCompensacaoData();
    const preservedData = this.preserveUserData('oportunidades_compensacao', mockOportunidades);
    localStorage.setItem('oportunidades_compensacao', JSON.stringify(preservedData));
    
    // Atualizar estatísticas de compensação
    const stats = this.generateCompensacaoStats();
    localStorage.setItem('compensacao_stats', JSON.stringify(stats));
  }

  /**
   * Atualiza dados de créditos (preserva identificados pelo usuário)
   */
  private async refreshCreditosData(): Promise<void> {
    const mockCreditos = this.generateCreditosData();
    const preservedData = this.preserveUserData('creditos_identificados', mockCreditos);
    localStorage.setItem('creditos_identificados', JSON.stringify(preservedData));
  }

  /**
   * Atualiza dados de tokenização (preserva tokens criados pelo usuário)
   */
  private async refreshTokenizacaoData(): Promise<void> {
    const mockTokens = this.generateTokenizacaoData();
    const preservedData = this.preserveUserData('tokens_marketplace', mockTokens);
    localStorage.setItem('tokens_marketplace', JSON.stringify(preservedData));
  }

  /**
   * Atualiza processos da Receita Federal
   */
  private async refreshProcessosData(): Promise<void> {
    const mockProcessos = this.generateProcessosData();
    const preservedData = this.preserveUserData('processos_rf', mockProcessos);
    localStorage.setItem('processos_rf', JSON.stringify(preservedData));
  }

  /**
   * Atualiza todos os dados
   */
  private async refreshAllData(): Promise<void> {
    await Promise.all([
      this.refreshMarketplaceData(),
      this.refreshCompensacaoData(),
      this.refreshCreditosData(),
      this.refreshTokenizacaoData(),
      this.refreshProcessosData()
    ]);
  }

  /**
   * Gera dados simulados do marketplace
   */
  private generateMarketplaceData(): any[] {
    const tipos = ['PIS', 'COFINS', 'ICMS', 'IRPJ', 'CSLL', 'IPI'];
    const empresas = [
      'Tech Solutions Ltda', 'Indústria Brasil S.A.', 'Comércio Global Ltda',
      'Serviços Premium S.A.', 'Logística Express Ltda', 'Consultoria Avançada S.A.'
    ];
    
    return Array.from({ length: 15 }, (_, i) => ({
      id: `bot_${Date.now()}_${i}`,
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
      empresa: empresas[Math.floor(Math.random() * empresas.length)],
      valor: Math.floor(Math.random() * 500000) + 50000,
      descricao: `Crédito ${tipos[Math.floor(Math.random() * tipos.length)]} - Negociação automática`,
      dataVencimento: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: ['ATIVO', 'NEGOCIANDO', 'RESERVADO'][Math.floor(Math.random() * 3)],
      origem: 'BOT_NEGOCIACAO',
      origin: {
        source: 'BOT',
        timestamp: new Date().toISOString(),
        botId: `bot_${i % 3 + 1}`,
        category: 'marketplace'
      },
      lastUpdated: new Date().toISOString()
    }));
  }

  /**
   * Gera dados simulados de compensação
   */
  private generateCompensacaoData(): any[] {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `comp_bot_${Date.now()}_${i}`,
      tipo: 'BILATERAL',
      valorCredito: Math.floor(Math.random() * 300000) + 100000,
      valorDebito: Math.floor(Math.random() * 300000) + 100000,
      economia: Math.floor(Math.random() * 50000) + 10000,
      prazo: Math.floor(Math.random() * 30) + 5,
      confiabilidade: Math.floor(Math.random() * 20) + 80,
      origem: 'BOT_COMPENSACAO',
      origin: {
        source: 'BOT',
        timestamp: new Date().toISOString(),
        botId: `comp_bot_${i % 2 + 1}`,
        category: 'compensacao'
      },
      lastUpdated: new Date().toISOString()
    }));
  }

  /**
   * Gera dados simulados de créditos
   */
  private generateCreditosData(): any[] {
    const tipos = ['PIS', 'COFINS', 'ICMS', 'IRPJ', 'CSLL'];
    
    return Array.from({ length: 8 }, (_, i) => ({
      id: `cred_bot_${Date.now()}_${i}`,
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
      descricao: `Crédito identificado por bot de análise automática`,
      valorNominal: Math.floor(Math.random() * 200000) + 50000,
      valorAtual: Math.floor(Math.random() * 10) + 90,
      statusCredito: 'IDENTIFICADO',
      origem: 'BOT_ANALISE',
      origin: {
        source: 'BOT',
        timestamp: new Date().toISOString(),
        botId: `analysis_bot_${i % 2 + 1}`,
        category: 'creditos'
      },
      lastUpdated: new Date().toISOString()
    }));
  }

  /**
   * Gera dados simulados de tokenização
   */
  private generateTokenizacaoData(): any[] {
    return Array.from({ length: 6 }, (_, i) => ({
      id: `token_bot_${Date.now()}_${i}`,
      nome: `Token Automático ${i + 1}`,
      tipo: 'CREDITO_TRIBUTARIO',
      valor: Math.floor(Math.random() * 1000000) + 100000,
      supply: Math.floor(Math.random() * 1000) + 100,
      preco: Math.floor(Math.random() * 500) + 100,
      status: 'ATIVO',
      origem: 'BOT_TOKENIZACAO',
      origin: {
        source: 'BOT',
        timestamp: new Date().toISOString(),
        botId: `token_bot_${i % 2 + 1}`,
        category: 'tokenizacao'
      },
      lastUpdated: new Date().toISOString()
    }));
  }

  /**
   * Gera dados simulados de processos
   */
  private generateProcessosData(): any[] {
    const status = ['EM_ANDAMENTO', 'AGUARDANDO_RESPOSTA', 'CONCLUIDO', 'PENDENTE'];
    
    return Array.from({ length: 12 }, (_, i) => ({
      id: `proc_bot_${Date.now()}_${i}`,
      numero: `${Date.now().toString().slice(-8)}-${i}`,
      tipo: 'COMPENSACAO_TRIBUTARIA',
      valor: Math.floor(Math.random() * 400000) + 100000,
      status: status[Math.floor(Math.random() * status.length)],
      dataInicio: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      origem: 'BOT_PROCESSOS',
      origin: {
        source: 'BOT',
        timestamp: new Date().toISOString(),
        botId: `process_bot_${i % 3 + 1}`,
        category: 'processos'
      },
      lastUpdated: new Date().toISOString()
    }));
  }

  /**
   * Gera estatísticas do marketplace
   */
  private generateMarketplaceStats(): any {
    return {
      totalAnuncios: Math.floor(Math.random() * 50) + 150,
      valorTotal: Math.floor(Math.random() * 10000000) + 5000000,
      negociacoesAtivas: Math.floor(Math.random() * 20) + 30,
      taxaSucesso: Math.floor(Math.random() * 15) + 85,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Gera estatísticas de compensação
   */
  private generateCompensacaoStats(): any {
    return {
      totalCompensacoes: Math.floor(Math.random() * 100) + 200,
      valorEconomizado: Math.floor(Math.random() * 2000000) + 1000000,
      tempoMedio: Math.floor(Math.random() * 10) + 15,
      sucessoRate: Math.floor(Math.random() * 10) + 90,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Notifica sobre atualização concluída
   */
  notifyRefreshComplete(category: string): void {
    const message = `Dados atualizados: ${category}`;
    console.log(message);
    
    // Disparar evento customizado para componentes
    window.dispatchEvent(new CustomEvent('dataRefreshed', {
      detail: { category, timestamp: new Date().toISOString() }
    }));
  }

  /**
   * Verifica se dados precisam ser atualizados
   */
  shouldRefresh(storageKey: string, maxAge: number = 5 * 60 * 1000): boolean {
    const data = localStorage.getItem(storageKey);
    if (!data) return true;
    
    try {
      const parsed = JSON.parse(data);
      const lastUpdated = parsed.lastUpdated || parsed[0]?.lastUpdated;
      if (!lastUpdated) return true;
      
      const age = Date.now() - new Date(lastUpdated).getTime();
      return age > maxAge;
    } catch {
      return true;
    }
  }
}

export const botDataManagerService = new BotDataManagerService();
export default botDataManagerService; 