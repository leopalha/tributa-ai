import axios, { AxiosInstance } from 'axios';
import { ExternalIntegrationService } from './external-integration.service';
import { GovernmentAPIService } from './government-api.service';

// Interfaces para as fontes de dados
interface DataSourceConfig {
  id: string;
  name: string;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  type: 'API' | 'WEB_SCRAPING' | 'HYBRID';
  baseUrl: string;
  apiKey?: string;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  authentication: {
    type: 'API_KEY' | 'OAUTH2' | 'CERTIFICATE' | 'NONE';
    credentials?: any;
  };
  endpoints: DataSourceEndpoint[];
  enabled: boolean;
  priority: number;
  healthCheckInterval: number;
}

interface DataSourceEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters: string[];
  responseSchema: any;
  cacheTimeout: number;
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
  };
}

interface DataCollectionResult {
  sourceId: string;
  sourceName: string;
  success: boolean;
  recordsCollected: number;
  totalValue: number;
  opportunities: number;
  errorMessage?: string;
  processingTime: number;
  timestamp: Date;
}

interface CompanyData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  situacao: string;
  capitalSocial: number;
  faturamentoEstimado: number;
  creditos: CreditoData[];
  debitos: DebitoData[];
  processos: ProcessoData[];
  dataAtualizacao: Date;
  fontesConsultadas: string[];
}

interface CreditoData {
  id: string;
  tipo: 'ICMS' | 'PIS_COFINS' | 'IRPJ_CSLL' | 'IPI' | 'IOF' | 'PRECATORIO' | 'DEBENTURE';
  valorNominal: number;
  valorAtualizado: number;
  valorRecuperavel: number;
  periodo: {
    inicio: Date;
    fim: Date;
  };
  origem: string;
  situacao: 'DISPONIVEL' | 'BLOQUEADO' | 'COMPENSADO' | 'PRESCRITO';
  tribunal?: string;
  numeroProcesso?: string;
  metadata: any;
}

interface DebitoData {
  id: string;
  tipo: 'ICMS' | 'PIS_COFINS' | 'IRPJ_CSLL' | 'IPI' | 'IOF' | 'DIVIDA_ATIVA';
  valorPrincipal: number;
  juros: number;
  multa: number;
  valorTotal: number;
  dataVencimento: Date;
  situacao: 'PENDENTE' | 'PARCELADO' | 'PAGO' | 'PROTESTADO';
  origem: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  metadata: any;
}

interface ProcessoData {
  id: string;
  numero: string;
  tipo: 'EXECUCAO' | 'PRECATORIO' | 'COMPENSACAO' | 'RESTITUICAO';
  valor: number;
  tribunal: string;
  instancia: string;
  situacao: string;
  dataDistribuicao: Date;
  ultimaMovimentacao: Date;
  partes: string[];
  metadata: any;
}

export class DataSourcesOrchestratorService {
  private static instance: DataSourcesOrchestratorService;
  private dataSources: Map<string, DataSourceConfig> = new Map();
  private httpClients: Map<string, AxiosInstance> = new Map();
  private collectionStats: Map<string, DataCollectionResult[]> = new Map();
  private governmentAPI: GovernmentAPIService;
  private externalIntegration: ExternalIntegrationService;

  private constructor() {
    this.governmentAPI = GovernmentAPIService.getInstance();
    this.externalIntegration = ExternalIntegrationService.getInstance();
    this.initializeDataSources();
  }

  public static getInstance(): DataSourcesOrchestratorService {
    if (!DataSourcesOrchestratorService.instance) {
      DataSourcesOrchestratorService.instance = new DataSourcesOrchestratorService();
    }
    return DataSourcesOrchestratorService.instance;
  }

  /**
   * Inicializa todas as fontes de dados do roadmap
   */
  private initializeDataSources(): void {
    // TIER 1 - ALTA PRIORIDADE
    this.registerDataSource({
      id: 'pgfn-api',
      name: 'PGFN - Procuradoria Fazenda Nacional',
      tier: 'TIER_1',
      type: 'API',
      baseUrl: 'https://api.pgfn.fazenda.gov.br/v1',
      rateLimit: {
        requestsPerMinute: 100,
        requestsPerHour: 1000,
        requestsPerDay: 10000,
      },
      authentication: {
        type: 'CERTIFICATE',
        credentials: {
          cert: process.env.PGFN_CERTIFICATE,
          key: process.env.PGFN_PRIVATE_KEY,
        },
      },
      endpoints: [
        {
          id: 'divida-ativa',
          name: 'Consulta Dívida Ativa',
          method: 'GET',
          path: '/divida-ativa/{documento}',
          description: 'Consulta débitos inscritos em dívida ativa da União',
          parameters: ['documento'],
          responseSchema: {},
          cacheTimeout: 3600,
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
        {
          id: 'devedores-lista',
          name: 'Lista Devedores',
          method: 'GET',
          path: '/devedores',
          description: 'Lista devedores da União',
          parameters: ['page', 'limit', 'uf', 'valor_min'],
          responseSchema: {},
          cacheTimeout: 7200,
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
      ],
      enabled: true,
      priority: 1,
      healthCheckInterval: 300000, // 5 minutos
    });

    this.registerDataSource({
      id: 'receita-federal-api',
      name: 'Receita Federal - Dados Empresariais',
      tier: 'TIER_1',
      type: 'API',
      baseUrl: 'https://api.receita.fazenda.gov.br/v1',
      rateLimit: {
        requestsPerMinute: 60,
        requestsPerHour: 1000,
        requestsPerDay: 5000,
      },
      authentication: {
        type: 'API_KEY',
        credentials: {
          apiKey: process.env.RECEITA_FEDERAL_API_KEY,
        },
      },
      endpoints: [
        {
          id: 'cnpj-dados',
          name: 'Dados CNPJ',
          method: 'GET',
          path: '/cnpj/{cnpj}',
          description: 'Consulta dados cadastrais de CNPJ',
          parameters: ['cnpj'],
          responseSchema: {},
          cacheTimeout: 86400, // 24 horas
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
        {
          id: 'empresas-ativas',
          name: 'Empresas Ativas',
          method: 'GET',
          path: '/empresas',
          description: 'Lista empresas ativas por região',
          parameters: ['uf', 'municipio', 'porte', 'atividade'],
          responseSchema: {},
          cacheTimeout: 43200, // 12 horas
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
      ],
      enabled: true,
      priority: 2,
      healthCheckInterval: 300000,
    });

    this.registerDataSource({
      id: 'sefaz-sp-api',
      name: 'SEFAZ-SP - Secretaria Fazenda SP',
      tier: 'TIER_1',
      type: 'HYBRID',
      baseUrl: 'https://api.fazenda.sp.gov.br/v2',
      rateLimit: {
        requestsPerMinute: 30,
        requestsPerHour: 500,
        requestsPerDay: 3000,
      },
      authentication: {
        type: 'CERTIFICATE',
        credentials: {
          cert: process.env.SEFAZ_SP_CERTIFICATE,
          key: process.env.SEFAZ_SP_PRIVATE_KEY,
        },
      },
      endpoints: [
        {
          id: 'devedores-icms',
          name: 'Devedores ICMS',
          method: 'GET',
          path: '/devedores/icms',
          description: 'Lista devedores de ICMS em SP',
          parameters: ['municipio', 'valor_min', 'situacao'],
          responseSchema: {},
          cacheTimeout: 3600,
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
        {
          id: 'creditos-acumulados',
          name: 'Créditos Acumulados',
          method: 'GET',
          path: '/creditos/acumulados',
          description: 'Lista créditos acumulados de ICMS',
          parameters: ['cnpj', 'periodo_inicio', 'periodo_fim'],
          responseSchema: {},
          cacheTimeout: 3600,
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
      ],
      enabled: true,
      priority: 3,
      healthCheckInterval: 600000, // 10 minutos
    });

    this.registerDataSource({
      id: 'cnj-datajud',
      name: 'CNJ - DataJud Precatórios',
      tier: 'TIER_1',
      type: 'API',
      baseUrl: 'https://api.cnj.jus.br/datajud/v1',
      rateLimit: {
        requestsPerMinute: 50,
        requestsPerHour: 800,
        requestsPerDay: 5000,
      },
      authentication: {
        type: 'API_KEY',
        credentials: {
          apiKey: process.env.CNJ_API_KEY,
        },
      },
      endpoints: [
        {
          id: 'precatorios-lista',
          name: 'Lista Precatórios',
          method: 'GET',
          path: '/precatorios',
          description: 'Lista precatórios nacionais',
          parameters: ['tribunal', 'uf', 'valor_min', 'situacao'],
          responseSchema: {},
          cacheTimeout: 7200,
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
        {
          id: 'execucoes-fiscais',
          name: 'Execuções Fiscais',
          method: 'GET',
          path: '/execucoes/fiscais',
          description: 'Lista execuções fiscais',
          parameters: ['tribunal', 'uf', 'valor_min'],
          responseSchema: {},
          cacheTimeout: 3600,
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
      ],
      enabled: true,
      priority: 4,
      healthCheckInterval: 600000,
    });

    this.registerDataSource({
      id: 'cvm-api',
      name: 'CVM - Debêntures e Bonds',
      tier: 'TIER_1',
      type: 'API',
      baseUrl: 'https://api.cvm.gov.br/v1',
      rateLimit: {
        requestsPerMinute: 100,
        requestsPerHour: 2000,
        requestsPerDay: 10000,
      },
      authentication: {
        type: 'NONE',
      },
      endpoints: [
        {
          id: 'debentures-ativas',
          name: 'Debêntures Ativas',
          method: 'GET',
          path: '/debentures',
          description: 'Lista debêntures ativas',
          parameters: ['emissor', 'tipo', 'valor_min', 'vencimento'],
          responseSchema: {},
          cacheTimeout: 3600,
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
        {
          id: 'fundos-credito',
          name: 'Fundos de Crédito',
          method: 'GET',
          path: '/fundos/credito',
          description: 'Lista fundos de crédito',
          parameters: ['gestor', 'tipo', 'patrimonio_min'],
          responseSchema: {},
          cacheTimeout: 3600,
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
      ],
      enabled: true,
      priority: 5,
      healthCheckInterval: 600000,
    });

    // TIER 2 - MÉDIA PRIORIDADE
    this.registerDataSource({
      id: 'bacen-scr',
      name: 'BACEN - Sistema de Crédito',
      tier: 'TIER_2',
      type: 'API',
      baseUrl: 'https://api.bcb.gov.br/v1',
      rateLimit: {
        requestsPerMinute: 200,
        requestsPerHour: 5000,
        requestsPerDay: 50000,
      },
      authentication: {
        type: 'API_KEY',
        credentials: {
          apiKey: process.env.BACEN_API_KEY,
        },
      },
      endpoints: [
        {
          id: 'instituicoes-financeiras',
          name: 'Instituições Financeiras',
          method: 'GET',
          path: '/instituicoes',
          description: 'Lista instituições financeiras',
          parameters: ['tipo', 'situacao', 'uf'],
          responseSchema: {},
          cacheTimeout: 86400,
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
        {
          id: 'operacoes-credito',
          name: 'Operações de Crédito',
          method: 'GET',
          path: '/operacoes/credito',
          description: 'Dados agregados de operações de crédito',
          parameters: ['periodo', 'modalidade', 'porte'],
          responseSchema: {},
          cacheTimeout: 3600,
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
      ],
      enabled: true,
      priority: 6,
      healthCheckInterval: 3600000, // 1 hora
    });

    this.registerDataSource({
      id: 'serasa-protesto',
      name: 'SERASA - Cartórios Protesto',
      tier: 'TIER_2',
      type: 'API',
      baseUrl: 'https://api.serasa.com.br/v1',
      rateLimit: {
        requestsPerMinute: 80,
        requestsPerHour: 1500,
        requestsPerDay: 8000,
      },
      authentication: {
        type: 'API_KEY',
        credentials: {
          apiKey: process.env.SERASA_API_KEY,
        },
      },
      endpoints: [
        {
          id: 'protestos-lista',
          name: 'Lista Protestos',
          method: 'GET',
          path: '/protestos',
          description: 'Lista protestos em cartórios',
          parameters: ['documento', 'uf', 'valor_min', 'data_inicio'],
          responseSchema: {},
          cacheTimeout: 3600,
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
        {
          id: 'inadimplencia-dados',
          name: 'Dados Inadimplência',
          method: 'GET',
          path: '/inadimplencia',
          description: 'Dados de inadimplência empresarial',
          parameters: ['cnpj', 'setor', 'porte'],
          responseSchema: {},
          cacheTimeout: 3600,
          retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
        },
      ],
      enabled: true,
      priority: 7,
      healthCheckInterval: 3600000,
    });

    this.initializeHttpClients();
  }

  /**
   * Registra uma nova fonte de dados
   */
  private registerDataSource(config: DataSourceConfig): void {
    this.dataSources.set(config.id, config);
    console.log(`📊 Fonte de dados registrada: ${config.name} (${config.tier})`);
  }

  /**
   * Inicializa clientes HTTP para cada fonte de dados
   */
  private initializeHttpClients(): void {
    this.dataSources.forEach((config, sourceId) => {
      const client = axios.create({
        baseURL: config.baseUrl,
        timeout: 30000,
        headers: {
          'User-Agent': 'Tributa.AI Data Collector v1.0',
          'Content-Type': 'application/json',
        },
      });

      // Configurar autenticação
      if (config.authentication.type === 'API_KEY' && config.authentication.credentials?.apiKey) {
        client.defaults.headers.common['Authorization'] =
          `Bearer ${config.authentication.credentials.apiKey}`;
      }

      // Interceptors para rate limiting e retry
      client.interceptors.request.use(
        async config => {
          await this.enforceRateLimit(sourceId);
          return config;
        },
        error => Promise.reject(error)
      );

      client.interceptors.response.use(
        response => response,
        async error => {
          const config = error.config;
          if (!config || !config.retry) config.retry = 0;

          const maxRetries =
            this.dataSources.get(sourceId)?.endpoints[0]?.retryPolicy?.maxRetries || 3;
          const backoffMultiplier =
            this.dataSources.get(sourceId)?.endpoints[0]?.retryPolicy?.backoffMultiplier || 2;

          if (config.retry < maxRetries && error.response?.status >= 500) {
            config.retry++;
            const delay = 1000 * Math.pow(backoffMultiplier, config.retry - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
            return client(config);
          }

          return Promise.reject(error);
        }
      );

      this.httpClients.set(sourceId, client);
    });
  }

  /**
   * Coleta dados de uma empresa específica em todas as fontes
   */
  public async collectCompanyData(cnpj: string): Promise<CompanyData> {
    const startTime = Date.now();
    console.log(`🔍 Iniciando coleta de dados para CNPJ: ${cnpj}`);

    const companyData: CompanyData = {
      cnpj,
      razaoSocial: '',
      situacao: '',
      capitalSocial: 0,
      faturamentoEstimado: 0,
      creditos: [],
      debitos: [],
      processos: [],
      dataAtualizacao: new Date(),
      fontesConsultadas: [],
    };

    // Dados básicos da empresa (Receita Federal)
    try {
      const dadosBasicos = await this.consultarReceitaFederal(cnpj);
      if (dadosBasicos.success) {
        companyData.razaoSocial = dadosBasicos.data.razaoSocial;
        companyData.nomeFantasia = dadosBasicos.data.nomeFantasia;
        companyData.situacao = dadosBasicos.data.situacao;
        companyData.capitalSocial = dadosBasicos.data.capital || 0;
        companyData.fontesConsultadas.push('Receita Federal');
      }
    } catch (error) {
      console.error('Erro ao consultar Receita Federal:', error);
    }

    // Coletar dados em paralelo de todas as fontes habilitadas
    const dataCollectionPromises = Array.from(this.dataSources.values())
      .filter(source => source.enabled)
      .map(source => this.collectFromSource(source, cnpj));

    const collectionResults = await Promise.allSettled(dataCollectionPromises);

    // Processar resultados
    collectionResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        const sourceResult = result.value;
        companyData.fontesConsultadas.push(sourceResult.sourceName);

        // Processar dados específicos baseado na fonte
        this.processSourceData(sourceResult, companyData);
      }
    });

    const processingTime = Date.now() - startTime;
    console.log(
      `✅ Coleta concluída em ${processingTime}ms - ${companyData.fontesConsultadas.length} fontes consultadas`
    );

    return companyData;
  }

  /**
   * Coleta dados de uma fonte específica
   */
  private async collectFromSource(
    source: DataSourceConfig,
    cnpj: string
  ): Promise<DataCollectionResult> {
    const startTime = Date.now();
    let recordsCollected = 0;
    let totalValue = 0;
    let opportunities = 0;

    try {
      const client = this.httpClients.get(source.id);
      if (!client) {
        throw new Error(`Cliente HTTP não encontrado para fonte: ${source.id}`);
      }

      // Executar todos os endpoints da fonte
      for (const endpoint of source.endpoints) {
        try {
          const url = this.buildEndpointUrl(endpoint.path, { documento: cnpj, cnpj });
          const response = await client.get(url);

          if (response.data) {
            recordsCollected++;

            // Processar resposta baseado no tipo de endpoint
            const processedData = this.processEndpointResponse(
              source.id,
              endpoint.id,
              response.data
            );
            totalValue += processedData.value;
            opportunities += processedData.opportunities;
          }
        } catch (endpointError) {
          console.error(`Erro no endpoint ${endpoint.id} da fonte ${source.id}:`, endpointError);
        }
      }

      return {
        sourceId: source.id,
        sourceName: source.name,
        success: true,
        recordsCollected,
        totalValue,
        opportunities,
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`Erro ao coletar dados da fonte ${source.id}:`, error);
      return {
        sourceId: source.id,
        sourceName: source.name,
        success: false,
        recordsCollected: 0,
        totalValue: 0,
        opportunities: 0,
        errorMessage: error.message,
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Processa dados de resposta de endpoint
   */
  private processEndpointResponse(
    sourceId: string,
    endpointId: string,
    data: any
  ): { value: number; opportunities: number } {
    let value = 0;
    let opportunities = 0;

    // Processar baseado na fonte e endpoint
    switch (sourceId) {
      case 'pgfn-api':
        if (endpointId === 'divida-ativa' && data.debitos) {
          value = data.debitos.reduce((sum, debito) => sum + debito.valor, 0);
          opportunities = data.debitos.length;
        }
        break;
      case 'cnj-datajud':
        if (endpointId === 'precatorios-lista' && data.precatorios) {
          value = data.precatorios.reduce((sum, precatorio) => sum + precatorio.valor, 0);
          opportunities = data.precatorios.length;
        }
        break;
      case 'cvm-api':
        if (endpointId === 'debentures-ativas' && data.debentures) {
          value = data.debentures.reduce((sum, debenture) => sum + debenture.valor_nominal, 0);
          opportunities = data.debentures.length;
        }
        break;
      case 'sefaz-sp-api':
        if (endpointId === 'creditos-acumulados' && data.creditos) {
          value = data.creditos.reduce((sum, credito) => sum + credito.valor, 0);
          opportunities = data.creditos.length;
        }
        break;
    }

    return { value, opportunities };
  }

  /**
   * Processa dados da fonte para a estrutura da empresa
   */
  private processSourceData(sourceResult: DataCollectionResult, companyData: CompanyData): void {
    // Adicionar créditos fictícios baseados na fonte
    if (sourceResult.sourceId === 'cvm-api' && sourceResult.opportunities > 0) {
      companyData.creditos.push({
        id: `cvm-${Date.now()}`,
        tipo: 'DEBENTURE',
        valorNominal: sourceResult.totalValue,
        valorAtualizado: sourceResult.totalValue * 1.1,
        valorRecuperavel: sourceResult.totalValue * 0.9,
        periodo: {
          inicio: new Date(2020, 0, 1),
          fim: new Date(2025, 11, 31),
        },
        origem: 'CVM - Debêntures',
        situacao: 'DISPONIVEL',
        metadata: { fonte: sourceResult.sourceName },
      });
    }

    if (sourceResult.sourceId === 'cnj-datajud' && sourceResult.opportunities > 0) {
      companyData.creditos.push({
        id: `cnj-${Date.now()}`,
        tipo: 'PRECATORIO',
        valorNominal: sourceResult.totalValue,
        valorAtualizado: sourceResult.totalValue * 1.15,
        valorRecuperavel: sourceResult.totalValue * 0.85,
        periodo: {
          inicio: new Date(2018, 0, 1),
          fim: new Date(2024, 11, 31),
        },
        origem: 'CNJ - Precatórios',
        situacao: 'DISPONIVEL',
        tribunal: 'TJSP',
        numeroProcesso: `CNJ-${Date.now()}`,
        metadata: { fonte: sourceResult.sourceName },
      });
    }

    if (sourceResult.sourceId === 'pgfn-api' && sourceResult.opportunities > 0) {
      companyData.debitos.push({
        id: `pgfn-${Date.now()}`,
        tipo: 'DIVIDA_ATIVA',
        valorPrincipal: sourceResult.totalValue,
        juros: sourceResult.totalValue * 0.1,
        multa: sourceResult.totalValue * 0.05,
        valorTotal: sourceResult.totalValue * 1.15,
        dataVencimento: new Date(2024, 11, 31),
        situacao: 'PENDENTE',
        origem: 'PGFN - Dívida Ativa',
        prioridade: 'ALTA',
        metadata: { fonte: sourceResult.sourceName },
      });
    }
  }

  /**
   * Constrói URL do endpoint com parâmetros
   */
  private buildEndpointUrl(pathTemplate: string, parameters: Record<string, any>): string {
    let url = pathTemplate;
    Object.entries(parameters).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, encodeURIComponent(value));
    });
    return url;
  }

  /**
   * Consulta Receita Federal
   */
  private async consultarReceitaFederal(cnpj: string): Promise<{ success: boolean; data: any }> {
    try {
      const response = await this.governmentAPI.consultarCNPJ(cnpj);
      return {
        success: response.status === 'success',
        data: response.data,
      };
    } catch (error) {
      return { success: false, data: null };
    }
  }

  /**
   * Enforce rate limiting
   */
  private async enforceRateLimit(sourceId: string): Promise<void> {
    const source = this.dataSources.get(sourceId);
    if (!source) return;

    // Implementar lógica de rate limiting
    // Por simplicidade, apenas um delay mínimo
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Executa coleta em massa para múltiplas empresas
   */
  public async massDataCollection(empresas: string[]): Promise<DataCollectionResult[]> {
    console.log(`🚀 Iniciando coleta em massa para ${empresas.length} empresas`);

    const results: DataCollectionResult[] = [];
    const batchSize = 10; // Processar 10 empresas por vez

    for (let i = 0; i < empresas.length; i += batchSize) {
      const batch = empresas.slice(i, i + batchSize);

      const batchPromises = batch.map(async cnpj => {
        try {
          const companyData = await this.collectCompanyData(cnpj);
          return {
            sourceId: 'mass-collection',
            sourceName: 'Coleta em Massa',
            success: true,
            recordsCollected: companyData.fontesConsultadas.length,
            totalValue: companyData.creditos.reduce((sum, c) => sum + c.valorNominal, 0),
            opportunities: companyData.creditos.length + companyData.debitos.length,
            processingTime: 0,
            timestamp: new Date(),
          };
        } catch (error) {
          return {
            sourceId: 'mass-collection',
            sourceName: 'Coleta em Massa',
            success: false,
            recordsCollected: 0,
            totalValue: 0,
            opportunities: 0,
            errorMessage: error.message,
            processingTime: 0,
            timestamp: new Date(),
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        }
      });

      // Delay entre batches para evitar sobrecarga
      if (i + batchSize < empresas.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`✅ Coleta em massa concluída: ${results.length} empresas processadas`);
    return results;
  }

  /**
   * Obtém estatísticas de coleta
   */
  public getCollectionStats(): {
    totalSources: number;
    enabledSources: number;
    tier1Sources: number;
    tier2Sources: number;
    tier3Sources: number;
    totalCollections: number;
    successRate: number;
    averageProcessingTime: number;
  } {
    const sources = Array.from(this.dataSources.values());
    const allStats = Array.from(this.collectionStats.values()).flat();

    return {
      totalSources: sources.length,
      enabledSources: sources.filter(s => s.enabled).length,
      tier1Sources: sources.filter(s => s.tier === 'TIER_1').length,
      tier2Sources: sources.filter(s => s.tier === 'TIER_2').length,
      tier3Sources: sources.filter(s => s.tier === 'TIER_3').length,
      totalCollections: allStats.length,
      successRate:
        allStats.length > 0 ? allStats.filter(s => s.success).length / allStats.length : 0,
      averageProcessingTime:
        allStats.length > 0
          ? allStats.reduce((sum, s) => sum + s.processingTime, 0) / allStats.length
          : 0,
    };
  }

  /**
   * Obtém lista de fontes de dados
   */
  public getDataSources(): DataSourceConfig[] {
    return Array.from(this.dataSources.values());
  }

  /**
   * Habilita/desabilita fonte de dados
   */
  public toggleDataSource(sourceId: string, enabled: boolean): void {
    const source = this.dataSources.get(sourceId);
    if (source) {
      source.enabled = enabled;
      console.log(`📊 Fonte ${source.name} ${enabled ? 'habilitada' : 'desabilitada'}`);
    }
  }

  /**
   * Verifica saúde de todas as fontes
   */
  public async checkSourcesHealth(): Promise<
    Array<{ sourceId: string; healthy: boolean; responseTime: number }>
  > {
    const healthChecks = Array.from(this.dataSources.values())
      .filter(source => source.enabled)
      .map(async source => {
        const startTime = Date.now();
        try {
          const client = this.httpClients.get(source.id);
          if (!client) {
            throw new Error('Cliente HTTP não encontrado');
          }

          // Fazer uma requisição simples de health check
          await client.get('/health');

          return {
            sourceId: source.id,
            healthy: true,
            responseTime: Date.now() - startTime,
          };
        } catch (error) {
          return {
            sourceId: source.id,
            healthy: false,
            responseTime: Date.now() - startTime,
          };
        }
      });

    return Promise.all(healthChecks);
  }
}

export default DataSourcesOrchestratorService;
