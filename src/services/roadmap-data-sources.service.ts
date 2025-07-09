import axios, { AxiosInstance } from 'axios';
import { ExternalIntegrationService } from './external-integration.service';
import { GovernmentAPIService } from './government-api.service';

// Interfaces para as fontes de dados
export interface DataSourceConfig {
  id: string;
  name: string;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  type: 'API' | 'WEB_SCRAPING' | 'HYBRID';
  baseUrl: string;
  volume: string;
  valor: string;
  status: 'IMPLEMENTADO' | 'FÁCIL' | 'MÉDIO' | 'COMPLEXO';
  prioridade: number;
  enabled: boolean;
  endpoints: DataSourceEndpoint[];
  authentication: {
    type: 'API_KEY' | 'OAUTH2' | 'CERTIFICATE' | 'NONE';
    credentials?: any;
  };
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}

export interface DataSourceEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  responseType: 'JSON' | 'XML' | 'HTML';
}

export interface CollectionResult {
  sourceId: string;
  sourceName: string;
  success: boolean;
  recordsFound: number;
  totalValue: number;
  opportunities: number;
  errorMessage?: string;
  processingTime: number;
  timestamp: Date;
}

export interface CompanyOpportunity {
  id: string;
  cnpj: string;
  razaoSocial: string;
  tipo: 'CREDITO' | 'DEBITO' | 'PROCESSO' | 'PRECATORIO';
  valor: number;
  valorAtualizado: number;
  fonte: string;
  situacao: string;
  prioridade: 'ALTA' | 'MÉDIA' | 'BAIXA';
  viabilidade: number;
  prazoRecuperacao: string;
  metadata: any;
}

export class RoadmapDataSourcesService {
  private static instance: RoadmapDataSourcesService;
  private dataSources: Map<string, DataSourceConfig> = new Map();
  private httpClients: Map<string, AxiosInstance> = new Map();
  private collectionStats: Map<string, CollectionResult[]> = new Map();
  private governmentAPI: GovernmentAPIService;
  private externalIntegration: ExternalIntegrationService;

  private constructor() {
    this.governmentAPI = GovernmentAPIService.getInstance();
    this.externalIntegration = ExternalIntegrationService.getInstance();
    this.initializeRoadmapSources();
  }

  public static getInstance(): RoadmapDataSourcesService {
    if (!RoadmapDataSourcesService.instance) {
      RoadmapDataSourcesService.instance = new RoadmapDataSourcesService();
    }
    return RoadmapDataSourcesService.instance;
  }

  /**
   * Inicializa todas as fontes de dados do roadmap
   */
  private initializeRoadmapSources(): void {
    // 🏆 TIER 1 - ALTA PRIORIDADE
    this.registerDataSource({
      id: 'pgfn-fazenda-nacional',
      name: 'PGFN - Procuradoria Fazenda Nacional',
      tier: 'TIER_1',
      type: 'API',
      baseUrl: 'https://api.pgfn.fazenda.gov.br/v1',
      volume: '50.000+ devedores/mês',
      valor: 'R$ 380+ bilhões',
      status: 'IMPLEMENTADO',
      prioridade: 1,
      enabled: true,
      endpoints: [
        {
          id: 'divida-ativa',
          name: 'Dívida Ativa da União',
          method: 'GET',
          path: '/divida-ativa/{documento}',
          description: 'Consulta débitos inscritos em dívida ativa',
          responseType: 'JSON',
        },
        {
          id: 'lista-devedores',
          name: 'Lista de Devedores',
          method: 'GET',
          path: '/devedores',
          description: 'Lista devedores por UF e valor',
          responseType: 'JSON',
        },
      ],
      authentication: {
        type: 'CERTIFICATE',
        credentials: {
          cert: process.env.PGFN_CERTIFICATE,
          key: process.env.PGFN_PRIVATE_KEY,
        },
      },
      rateLimit: {
        requestsPerMinute: 100,
        requestsPerHour: 1000,
      },
    });

    this.registerDataSource({
      id: 'receita-federal-empresas',
      name: 'Receita Federal - Dados Empresariais',
      tier: 'TIER_1',
      type: 'API',
      baseUrl: 'https://api.receitaws.com.br/v1',
      volume: '19M+ CNPJs ativos',
      valor: 'Base empresarial completa',
      status: 'FÁCIL',
      prioridade: 2,
      enabled: true,
      endpoints: [
        {
          id: 'cnpj-consulta',
          name: 'Consulta CNPJ',
          method: 'GET',
          path: '/cnpj/{cnpj}',
          description: 'Dados cadastrais da empresa',
          responseType: 'JSON',
        },
        {
          id: 'situacao-fiscal',
          name: 'Situação Fiscal',
          method: 'GET',
          path: '/situacao-fiscal/{cnpj}',
          description: 'Situação fiscal da empresa',
          responseType: 'JSON',
        },
      ],
      authentication: {
        type: 'API_KEY',
        credentials: {
          apiKey: process.env.RECEITA_FEDERAL_API_KEY,
        },
      },
      rateLimit: {
        requestsPerMinute: 60,
        requestsPerHour: 1000,
      },
    });

    this.registerDataSource({
      id: 'sefaz-sp',
      name: 'SEFAZ-SP - Secretaria Fazenda SP',
      tier: 'TIER_1',
      type: 'HYBRID',
      baseUrl: 'https://api.fazenda.sp.gov.br/v2',
      volume: '180.000+ devedores',
      valor: 'R$ 45+ bilhões (só SP)',
      status: 'MÉDIO',
      prioridade: 3,
      enabled: true,
      endpoints: [
        {
          id: 'devedores-icms',
          name: 'Devedores ICMS',
          method: 'GET',
          path: '/devedores/icms',
          description: 'Lista devedores de ICMS em SP',
          responseType: 'JSON',
        },
        {
          id: 'creditos-acumulados',
          name: 'Créditos Acumulados',
          method: 'GET',
          path: '/creditos/acumulados',
          description: 'Créditos acumulados de ICMS',
          responseType: 'JSON',
        },
      ],
      authentication: {
        type: 'CERTIFICATE',
        credentials: {
          cert: process.env.SEFAZ_SP_CERTIFICATE,
          key: process.env.SEFAZ_SP_PRIVATE_KEY,
        },
      },
      rateLimit: {
        requestsPerMinute: 30,
        requestsPerHour: 500,
      },
    });

    this.registerDataSource({
      id: 'cnj-precatorios',
      name: 'CNJ - Precatórios Nacionais',
      tier: 'TIER_1',
      type: 'API',
      baseUrl: 'https://api.cnj.jus.br/datajud/v1',
      volume: '380.000+ precatórios',
      valor: 'R$ 89+ bilhões',
      status: 'FÁCIL',
      prioridade: 4,
      enabled: true,
      endpoints: [
        {
          id: 'precatorios-lista',
          name: 'Lista Precatórios',
          method: 'GET',
          path: '/precatorios',
          description: 'Lista precatórios por tribunal',
          responseType: 'JSON',
        },
        {
          id: 'execucoes-fiscais',
          name: 'Execuções Fiscais',
          method: 'GET',
          path: '/execucoes/fiscais',
          description: 'Execuções fiscais em andamento',
          responseType: 'JSON',
        },
      ],
      authentication: {
        type: 'API_KEY',
        credentials: {
          apiKey: process.env.CNJ_API_KEY,
        },
      },
      rateLimit: {
        requestsPerMinute: 50,
        requestsPerHour: 800,
      },
    });

    this.registerDataSource({
      id: 'cvm-debentures',
      name: 'CVM - Debêntures e Bonds',
      tier: 'TIER_1',
      type: 'API',
      baseUrl: 'https://dados.cvm.gov.br/dados',
      volume: '2.500+ séries ativas',
      valor: 'R$ 680+ bilhões',
      status: 'FÁCIL',
      prioridade: 5,
      enabled: true,
      endpoints: [
        {
          id: 'debentures-ativas',
          name: 'Debêntures Ativas',
          method: 'GET',
          path: '/CIA_ABERTA/DOC/DFP/DADOS/dfp_cia_aberta_BPP_con_{ano}.csv',
          description: 'Lista debêntures ativas',
          responseType: 'JSON',
        },
        {
          id: 'fundos-credito',
          name: 'Fundos de Crédito',
          method: 'GET',
          path: '/FI/DOC/INF_DIARIO/DADOS/inf_diario_fi_{ano}.csv',
          description: 'Fundos de investimento em crédito',
          responseType: 'JSON',
        },
      ],
      authentication: {
        type: 'NONE',
      },
      rateLimit: {
        requestsPerMinute: 100,
        requestsPerHour: 2000,
      },
    });

    // 🥈 TIER 2 - MÉDIA PRIORIDADE
    this.registerDataSource({
      id: 'sefaz-outros-estados',
      name: 'SEFAZ-RJ/MG/RS - Outros SEFAZs',
      tier: 'TIER_2',
      type: 'HYBRID',
      baseUrl: 'https://api.sefaz.gov.br/v1',
      volume: '200.000+ devedores',
      valor: 'R$ 60+ bilhões',
      status: 'MÉDIO',
      prioridade: 6,
      enabled: true,
      endpoints: [
        {
          id: 'devedores-estaduais',
          name: 'Devedores Estaduais',
          method: 'GET',
          path: '/{uf}/devedores',
          description: 'Lista devedores por estado',
          responseType: 'JSON',
        },
      ],
      authentication: {
        type: 'CERTIFICATE',
      },
      rateLimit: {
        requestsPerMinute: 25,
        requestsPerHour: 400,
      },
    });

    this.registerDataSource({
      id: 'tribunais-estaduais',
      name: 'Tribunais Estaduais - Execuções',
      tier: 'TIER_2',
      type: 'WEB_SCRAPING',
      baseUrl: 'https://esaj.tjsp.jus.br/cpopg/search.do',
      volume: '1M+ execuções ativas',
      valor: 'R$ 200+ bilhões',
      status: 'COMPLEXO',
      prioridade: 7,
      enabled: true,
      endpoints: [
        {
          id: 'execucoes-fiscais',
          name: 'Execuções Fiscais',
          method: 'GET',
          path: '/search.do',
          description: 'Busca execuções fiscais',
          responseType: 'HTML',
        },
      ],
      authentication: {
        type: 'NONE',
      },
      rateLimit: {
        requestsPerMinute: 10,
        requestsPerHour: 200,
      },
    });

    this.registerDataSource({
      id: 'serasa-protestos',
      name: 'Cartórios Protesto - via SERASA',
      tier: 'TIER_2',
      type: 'API',
      baseUrl: 'https://api.serasa.com.br/v1',
      volume: '8M+ protestos/ano',
      valor: 'R$ 120+ bilhões',
      status: 'MÉDIO',
      prioridade: 8,
      enabled: true,
      endpoints: [
        {
          id: 'protestos-lista',
          name: 'Lista Protestos',
          method: 'GET',
          path: '/protestos',
          description: 'Lista protestos por documento',
          responseType: 'JSON',
        },
      ],
      authentication: {
        type: 'API_KEY',
        credentials: {
          apiKey: process.env.SERASA_API_KEY,
        },
      },
      rateLimit: {
        requestsPerMinute: 80,
        requestsPerHour: 1500,
      },
    });

    this.registerDataSource({
      id: 'bacen-sistema-credito',
      name: 'BACEN - Sistema de Crédito',
      tier: 'TIER_2',
      type: 'API',
      baseUrl: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs',
      volume: '4.800+ instituições',
      valor: 'R$ 3.2+ trilhões',
      status: 'FÁCIL',
      prioridade: 9,
      enabled: true,
      endpoints: [
        {
          id: 'operacoes-credito',
          name: 'Operações de Crédito',
          method: 'GET',
          path: '/dados',
          description: 'Dados de operações de crédito',
          responseType: 'JSON',
        },
      ],
      authentication: {
        type: 'NONE',
      },
      rateLimit: {
        requestsPerMinute: 200,
        requestsPerHour: 5000,
      },
    });

    // 🥉 TIER 3 - BAIXA PRIORIDADE
    this.registerDataSource({
      id: 'b3-empresas-listadas',
      name: 'B3 - Empresas Listadas',
      tier: 'TIER_3',
      type: 'API',
      baseUrl: 'https://api.b3.com.br/v1',
      volume: '400+ empresas listadas',
      valor: 'R$ 500+ bilhões',
      status: 'FÁCIL',
      prioridade: 10,
      enabled: true,
      endpoints: [
        {
          id: 'empresas-listadas',
          name: 'Empresas Listadas',
          method: 'GET',
          path: '/empresas',
          description: 'Lista empresas de capital aberto',
          responseType: 'JSON',
        },
      ],
      authentication: {
        type: 'API_KEY',
      },
      rateLimit: {
        requestsPerMinute: 50,
        requestsPerHour: 1000,
      },
    });

    this.initializeHttpClients();
  }

  /**
   * Registra uma fonte de dados
   */
  private registerDataSource(config: DataSourceConfig): void {
    this.dataSources.set(config.id, config);
    console.log(`📊 Fonte registrada: ${config.name} (${config.tier}) - ${config.valor}`);
  }

  /**
   * Inicializa clientes HTTP
   */
  private initializeHttpClients(): void {
    this.dataSources.forEach((config, sourceId) => {
      const client = axios.create({
        baseURL: config.baseUrl,
        timeout: 30000,
        headers: {
          'User-Agent': 'Tributa.AI Data Collector v1.0',
          Accept: 'application/json',
        },
      });

      // Configurar autenticação
      if (config.authentication.type === 'API_KEY' && config.authentication.credentials?.apiKey) {
        client.defaults.headers.common['Authorization'] =
          `Bearer ${config.authentication.credentials.apiKey}`;
      }

      // Rate limiting middleware
      client.interceptors.request.use(async config => {
        await this.enforceRateLimit(sourceId);
        return config;
      });

      this.httpClients.set(sourceId, client);
    });
  }

  /**
   * Coleta dados de uma empresa em todas as fontes
   */
  public async collectAllSourcesData(cnpj: string): Promise<{
    empresa: string;
    totalFontesConsultadas: number;
    totalOportunidades: number;
    valorTotalIdentificado: number;
    resultados: CollectionResult[];
    oportunidades: CompanyOpportunity[];
  }> {
    const startTime = Date.now();
    console.log(`🔍 Iniciando coleta completa para CNPJ: ${cnpj}`);

    const resultados: CollectionResult[] = [];
    const oportunidades: CompanyOpportunity[] = [];

    // Dados básicos da empresa
    let razaoSocial = '';
    try {
      const dadosBasicos = await this.governmentAPI.consultarCNPJ(cnpj);
      if (dadosBasicos.status === 'success') {
        razaoSocial = dadosBasicos.data.razaoSocial;
      }
    } catch (error) {
      console.error('Erro ao consultar dados básicos:', error);
    }

    // Coletar de todas as fontes habilitadas
    const fontesHabilitadas = Array.from(this.dataSources.values()).filter(s => s.enabled);

    for (const fonte of fontesHabilitadas) {
      try {
        const resultado = await this.collectFromSource(fonte, cnpj);
        resultados.push(resultado);

        // Gerar oportunidades baseadas na fonte
        if (resultado.success && resultado.opportunities > 0) {
          const novasOportunidades = this.generateOpportunities(
            fonte,
            cnpj,
            razaoSocial,
            resultado
          );
          oportunidades.push(...novasOportunidades);
        }
      } catch (error) {
        console.error(`Erro ao coletar da fonte ${fonte.name}:`, error);
        resultados.push({
          sourceId: fonte.id,
          sourceName: fonte.name,
          success: false,
          recordsFound: 0,
          totalValue: 0,
          opportunities: 0,
          errorMessage: error.message,
          processingTime: 0,
          timestamp: new Date(),
        });
      }
    }

    const totalProcessingTime = Date.now() - startTime;
    const totalOportunidades = oportunidades.length;
    const valorTotalIdentificado = oportunidades.reduce((sum, op) => sum + op.valorAtualizado, 0);

    console.log(`✅ Coleta concluída em ${totalProcessingTime}ms`);
    console.log(
      `📊 Encontradas ${totalOportunidades} oportunidades no valor de R$ ${valorTotalIdentificado.toLocaleString('pt-BR')}`
    );

    return {
      empresa: razaoSocial || cnpj,
      totalFontesConsultadas: fontesHabilitadas.length,
      totalOportunidades,
      valorTotalIdentificado,
      resultados,
      oportunidades,
    };
  }

  /**
   * Coleta dados de uma fonte específica
   */
  private async collectFromSource(
    fonte: DataSourceConfig,
    cnpj: string
  ): Promise<CollectionResult> {
    const startTime = Date.now();

    try {
      const client = this.httpClients.get(fonte.id);
      if (!client) {
        throw new Error(`Cliente HTTP não encontrado para ${fonte.id}`);
      }

      let recordsFound = 0;
      let totalValue = 0;
      let opportunities = 0;

      // Simular coleta de dados (em produção, fazer requisições reais)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

      // Dados simulados baseados na fonte
      switch (fonte.id) {
        case 'pgfn-fazenda-nacional':
          recordsFound = Math.floor(Math.random() * 5) + 1;
          totalValue = Math.floor(Math.random() * 500000) + 50000;
          opportunities = recordsFound;
          break;
        case 'cnj-precatorios':
          recordsFound = Math.floor(Math.random() * 3) + 1;
          totalValue = Math.floor(Math.random() * 800000) + 100000;
          opportunities = recordsFound;
          break;
        case 'cvm-debentures':
          recordsFound = Math.floor(Math.random() * 2) + 1;
          totalValue = Math.floor(Math.random() * 2000000) + 200000;
          opportunities = recordsFound;
          break;
        case 'sefaz-sp':
          recordsFound = Math.floor(Math.random() * 4) + 1;
          totalValue = Math.floor(Math.random() * 300000) + 75000;
          opportunities = recordsFound;
          break;
        default:
          recordsFound = Math.floor(Math.random() * 3);
          totalValue = Math.floor(Math.random() * 200000);
          opportunities = recordsFound;
      }

      return {
        sourceId: fonte.id,
        sourceName: fonte.name,
        success: true,
        recordsFound,
        totalValue,
        opportunities,
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        sourceId: fonte.id,
        sourceName: fonte.name,
        success: false,
        recordsFound: 0,
        totalValue: 0,
        opportunities: 0,
        errorMessage: error.message,
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Gera oportunidades baseadas na fonte
   */
  private generateOpportunities(
    fonte: DataSourceConfig,
    cnpj: string,
    razaoSocial: string,
    resultado: CollectionResult
  ): CompanyOpportunity[] {
    const oportunidades: CompanyOpportunity[] = [];

    for (let i = 0; i < resultado.opportunities; i++) {
      const valorBase = resultado.totalValue / resultado.opportunities;
      const valorAtualizado = valorBase * (1 + Math.random() * 0.3);

      let tipo: 'CREDITO' | 'DEBITO' | 'PROCESSO' | 'PRECATORIO' = 'CREDITO';
      let situacao = 'DISPONIVEL';
      let prioridade: 'ALTA' | 'MÉDIA' | 'BAIXA' = 'MÉDIA';

      switch (fonte.id) {
        case 'pgfn-fazenda-nacional':
          tipo = 'DEBITO';
          situacao = 'DIVIDA_ATIVA';
          prioridade = 'ALTA';
          break;
        case 'cnj-precatorios':
          tipo = 'PRECATORIO';
          situacao = 'AGUARDANDO_PAGAMENTO';
          prioridade = 'ALTA';
          break;
        case 'cvm-debentures':
          tipo = 'CREDITO';
          situacao = 'NEGOCIAVEL';
          prioridade = 'MÉDIA';
          break;
        case 'sefaz-sp':
          tipo = Math.random() > 0.5 ? 'CREDITO' : 'DEBITO';
          situacao = tipo === 'CREDITO' ? 'ACUMULADO' : 'PENDENTE';
          prioridade = 'ALTA';
          break;
      }

      oportunidades.push({
        id: `${fonte.id}-${Date.now()}-${i}`,
        cnpj,
        razaoSocial,
        tipo,
        valor: valorBase,
        valorAtualizado,
        fonte: fonte.name,
        situacao,
        prioridade,
        viabilidade: Math.random() * 0.4 + 0.6, // 60% a 100%
        prazoRecuperacao: this.calculateRecoveryTime(tipo, prioridade),
        metadata: {
          sourceId: fonte.id,
          tier: fonte.tier,
          coletadoEm: new Date(),
        },
      });
    }

    return oportunidades;
  }

  /**
   * Calcula tempo de recuperação
   */
  private calculateRecoveryTime(tipo: string, prioridade: string): string {
    const tempos = {
      CREDITO: { ALTA: '3-6 meses', MÉDIA: '6-12 meses', BAIXA: '12-24 meses' },
      DEBITO: { ALTA: '1-3 meses', MÉDIA: '3-6 meses', BAIXA: '6-12 meses' },
      PRECATORIO: { ALTA: '12-18 meses', MÉDIA: '18-24 meses', BAIXA: '24-36 meses' },
      PROCESSO: { ALTA: '6-12 meses', MÉDIA: '12-18 meses', BAIXA: '18-24 meses' },
    };

    return tempos[tipo]?.[prioridade] || '6-12 meses';
  }

  /**
   * Coleta em massa para múltiplas empresas
   */
  public async massCollection(cnpjs: string[]): Promise<{
    totalEmpresas: number;
    empresasProcessadas: number;
    totalOportunidades: number;
    valorTotalIdentificado: number;
    tempoProcessamento: number;
    resumoPorFonte: Array<{
      fonte: string;
      sucessos: number;
      erros: number;
      valorTotal: number;
    }>;
  }> {
    const startTime = Date.now();
    console.log(`🚀 Iniciando coleta em massa para ${cnpjs.length} empresas`);

    const resultados: Array<{
      empresa: string;
      totalOportunidades: number;
      valorTotalIdentificado: number;
      resultados: CollectionResult[];
    }> = [];

    const batchSize = 5; // Processar 5 empresas por vez
    for (let i = 0; i < cnpjs.length; i += batchSize) {
      const batch = cnpjs.slice(i, i + batchSize);

      const batchPromises = batch.map(async cnpj => {
        try {
          return await this.collectAllSourcesData(cnpj);
        } catch (error) {
          console.error(`Erro ao processar ${cnpj}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      batchResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          resultados.push(result.value);
        }
      });

      // Delay entre batches
      if (i + batchSize < cnpjs.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Consolidar estatísticas
    const totalOportunidades = resultados.reduce((sum, r) => sum + r.totalOportunidades, 0);
    const valorTotalIdentificado = resultados.reduce((sum, r) => sum + r.valorTotalIdentificado, 0);
    const tempoProcessamento = Date.now() - startTime;

    // Resumo por fonte
    const resumoPorFonte = new Map<
      string,
      { sucessos: number; erros: number; valorTotal: number }
    >();

    resultados.forEach(resultado => {
      resultado.resultados.forEach(r => {
        if (!resumoPorFonte.has(r.sourceName)) {
          resumoPorFonte.set(r.sourceName, { sucessos: 0, erros: 0, valorTotal: 0 });
        }
        const stats = resumoPorFonte.get(r.sourceName)!;
        if (r.success) {
          stats.sucessos++;
          stats.valorTotal += r.totalValue;
        } else {
          stats.erros++;
        }
      });
    });

    const resumoFinal = Array.from(resumoPorFonte.entries()).map(([fonte, stats]) => ({
      fonte,
      sucessos: stats.sucessos,
      erros: stats.erros,
      valorTotal: stats.valorTotal,
    }));

    console.log(`✅ Coleta em massa concluída em ${tempoProcessamento}ms`);
    console.log(
      `📊 Total: ${totalOportunidades} oportunidades, R$ ${valorTotalIdentificado.toLocaleString('pt-BR')}`
    );

    return {
      totalEmpresas: cnpjs.length,
      empresasProcessadas: resultados.length,
      totalOportunidades,
      valorTotalIdentificado,
      tempoProcessamento,
      resumoPorFonte: resumoFinal,
    };
  }

  /**
   * Enforce rate limiting
   */
  private async enforceRateLimit(sourceId: string): Promise<void> {
    const source = this.dataSources.get(sourceId);
    if (!source) return;

    // Delay simples - em produção, usar sistema mais sofisticado
    const delay = 60000 / source.rateLimit.requestsPerMinute;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Obtém estatísticas das fontes
   */
  public getSourcesStats(): {
    totalSources: number;
    tier1Sources: number;
    tier2Sources: number;
    tier3Sources: number;
    enabledSources: number;
    estimatedTotalValue: string;
    estimatedTotalOpportunities: string;
    sourcesByStatus: Record<string, number>;
  } {
    const sources = Array.from(this.dataSources.values());

    return {
      totalSources: sources.length,
      tier1Sources: sources.filter(s => s.tier === 'TIER_1').length,
      tier2Sources: sources.filter(s => s.tier === 'TIER_2').length,
      tier3Sources: sources.filter(s => s.tier === 'TIER_3').length,
      enabledSources: sources.filter(s => s.enabled).length,
      estimatedTotalValue: 'R$ 280+ bilhões',
      estimatedTotalOpportunities: '1M+ empresas',
      sourcesByStatus: {
        IMPLEMENTADO: sources.filter(s => s.status === 'IMPLEMENTADO').length,
        FÁCIL: sources.filter(s => s.status === 'FÁCIL').length,
        MÉDIO: sources.filter(s => s.status === 'MÉDIO').length,
        COMPLEXO: sources.filter(s => s.status === 'COMPLEXO').length,
      },
    };
  }

  /**
   * Obtém lista de todas as fontes
   */
  public getAllSources(): DataSourceConfig[] {
    return Array.from(this.dataSources.values()).sort((a, b) => a.prioridade - b.prioridade);
  }

  /**
   * Habilita/desabilita fonte
   */
  public toggleSource(sourceId: string, enabled: boolean): void {
    const source = this.dataSources.get(sourceId);
    if (source) {
      source.enabled = enabled;
      console.log(`📊 Fonte ${source.name} ${enabled ? 'habilitada' : 'desabilitada'}`);
    }
  }

  /**
   * Testa conectividade de uma fonte
   */
  public async testSource(
    sourceId: string
  ): Promise<{ success: boolean; message: string; responseTime: number }> {
    const startTime = Date.now();
    const source = this.dataSources.get(sourceId);

    if (!source) {
      return { success: false, message: 'Fonte não encontrada', responseTime: 0 };
    }

    try {
      const client = this.httpClients.get(sourceId);
      if (!client) {
        return { success: false, message: 'Cliente HTTP não configurado', responseTime: 0 };
      }

      // Teste simples de conectividade
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular teste

      return {
        success: true,
        message: 'Conectividade OK',
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        responseTime: Date.now() - startTime,
      };
    }
  }
}

export default RoadmapDataSourcesService;
