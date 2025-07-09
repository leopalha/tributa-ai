import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface SEFAZConfig {
  uf: string;
  baseURL: string;
  certificado?: string;
  ambiente: 'producao' | 'homologacao';
}

interface ConsultaICMSResponse {
  cnpj: string;
  uf: string;
  situacao: 'REGULAR' | 'IRREGULAR' | 'SUSPENSA';
  debitos: {
    codigo: string;
    descricao: string;
    valor: number;
    vencimento: string;
    multa: number;
    juros: number;
    valorTotal: number;
  }[];
  creditos: {
    codigo: string;
    descricao: string;
    valor: number;
    origem: string;
    saldo: number;
    dataExpiracao?: string;
  }[];
}

interface SubstituicaoTributariaResponse {
  cnpj: string;
  produtos: {
    ncm: string;
    descricao: string;
    valorST: number;
    valorEfetivo: number;
    diferenca: number;
    situacao: 'RECOLHIDO_MAIOR' | 'RECOLHIDO_MENOR' | 'REGULAR';
  }[];
  valorTotalDiferenca: number;
}

interface DiferencialAliquotaResponse {
  cnpj: string;
  operacoes: {
    nfe: string;
    dataEmissao: string;
    ufOrigem: string;
    ufDestino: string;
    aliquotaOrigem: number;
    aliquotaDestino: number;
    baseCalculo: number;
    icmsRecolhido: number;
    icmsDevido: number;
    diferenca: number;
  }[];
  valorTotalDiferenca: number;
}

export class SEFAZIntegrationService {
  private apis: Map<string, AxiosInstance> = new Map();
  private configs: Map<string, SEFAZConfig> = new Map();

  constructor() {
    this.inicializarConfiguracoes();
    this.criarInstanciasAPI();
  }

  private inicializarConfiguracoes() {
    // Configurações por estado
    const estados: SEFAZConfig[] = [
      {
        uf: 'SP',
        baseURL: 'https://api.fazenda.sp.gov.br/v1',
        ambiente: 'producao'
      },
      {
        uf: 'RJ',
        baseURL: 'https://api.sefaz.rj.gov.br/v1',
        ambiente: 'producao'
      },
      {
        uf: 'MG',
        baseURL: 'https://api.sefaz.mg.gov.br/v1',
        ambiente: 'producao'
      },
      {
        uf: 'RS',
        baseURL: 'https://api.sefaz.rs.gov.br/v1',
        ambiente: 'producao'
      },
      {
        uf: 'PR',
        baseURL: 'https://api.sefaz.pr.gov.br/v1',
        ambiente: 'producao'
      },
      {
        uf: 'SC',
        baseURL: 'https://api.sef.sc.gov.br/v1',
        ambiente: 'producao'
      },
      {
        uf: 'GO',
        baseURL: 'https://api.sefaz.go.gov.br/v1',
        ambiente: 'producao'
      },
      {
        uf: 'BA',
        baseURL: 'https://api.sefaz.ba.gov.br/v1',
        ambiente: 'producao'
      },
      {
        uf: 'PE',
        baseURL: 'https://api.sefaz.pe.gov.br/v1',
        ambiente: 'producao'
      },
      {
        uf: 'CE',
        baseURL: 'https://api.sefaz.ce.gov.br/v1',
        ambiente: 'producao'
      }
    ];

    estados.forEach(config => {
      this.configs.set(config.uf, config);
    });
  }

  private criarInstanciasAPI() {
    this.configs.forEach((config, uf) => {
      const api = axios.create({
        baseURL: config.baseURL,
        timeout: 25000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TributaAI/1.0',
          'X-Estado': uf
        }
      });

      // Interceptors específicos por estado
      api.interceptors.request.use(
        (request) => {
          console.log(`[SEFAZ-${uf}] ${request.method?.toUpperCase()} ${request.url}`);
          
          // Adicionar certificado se disponível
          const certificado = process.env[`SEFAZ_${uf}_CERTIFICATE`];
          if (certificado) {
            request.headers['X-Certificate'] = certificado;
          }
          
          return request;
        },
        (error) => {
          console.error(`[SEFAZ-${uf}] Request error:`, error);
          return Promise.reject(error);
        }
      );

      api.interceptors.response.use(
        (response) => {
          console.log(`[SEFAZ-${uf}] Response ${response.status}: ${response.config.url}`);
          return response;
        },
        (error) => {
          console.error(`[SEFAZ-${uf}] Response error:`, error.response?.data || error.message);
          
          if (error.response?.status === 401) {
            throw new Error(`Certificado digital inválido para SEFAZ-${uf}`);
          }
          
          return Promise.reject(error);
        }
      );

      this.apis.set(uf, api);
    });
  }

  // Consultar ICMS de um estado específico
  async consultarICMS(cnpj: string, uf: string): Promise<ConsultaICMSResponse> {
    try {
      const api = this.apis.get(uf.toUpperCase());
      if (!api) {
        throw new Error(`Estado ${uf} não suportado`);
      }

      const cnpjLimpo = cnpj.replace(/\D/g, '');
      
      // Se não tiver certificado, retornar mock
      const certificado = process.env[`SEFAZ_${uf.toUpperCase()}_CERTIFICATE`];
      if (!certificado) {
        return this.mockConsultaICMS(cnpjLimpo, uf.toUpperCase());
      }

      const response: AxiosResponse<ConsultaICMSResponse> = await api.get(
        `/contribuinte/${cnpjLimpo}/icms`
      );

      return response.data;
    } catch (error) {
      console.error(`Erro ao consultar ICMS no ${uf}:`, error);
      throw new Error(`Falha na consulta de ICMS no ${uf}`);
    }
  }

  // Consultar todos os estados de uma vez
  async consultarTodosEstados(cnpj: string): Promise<Map<string, ConsultaICMSResponse>> {
    const resultados = new Map<string, ConsultaICMSResponse>();
    const promessas: Promise<void>[] = [];

    // Executar consultas em paralelo para melhor performance
    this.configs.forEach((config, uf) => {
      const promessa = this.consultarICMS(cnpj, uf)
        .then(resultado => {
          resultados.set(uf, resultado);
        })
        .catch(error => {
          console.warn(`Erro ao consultar ${uf}:`, error.message);
          // Não interromper outras consultas
        });
      
      promessas.push(promessa);
    });

    // Aguardar todas as consultas (com timeout)
    await Promise.allSettled(promessas);
    
    return resultados;
  }

  // Analisar substituição tributária
  async analisarSubstituicaoTributaria(cnpj: string, uf: string): Promise<SubstituicaoTributariaResponse> {
    try {
      const api = this.apis.get(uf.toUpperCase());
      if (!api) {
        throw new Error(`Estado ${uf} não suportado`);
      }

      const cnpjLimpo = cnpj.replace(/\D/g, '');
      
      const certificado = process.env[`SEFAZ_${uf.toUpperCase()}_CERTIFICATE`];
      if (!certificado) {
        return this.mockSubstituicaoTributaria(cnpjLimpo);
      }

      const response: AxiosResponse<SubstituicaoTributariaResponse> = await api.get(
        `/contribuinte/${cnpjLimpo}/substituicao-tributaria`
      );

      return response.data;
    } catch (error) {
      console.error(`Erro ao analisar ST no ${uf}:`, error);
      throw new Error(`Falha na análise de substituição tributária no ${uf}`);
    }
  }

  // Consultar diferencial de alíquota
  async consultarDiferencialAliquota(cnpj: string, uf: string): Promise<DiferencialAliquotaResponse> {
    try {
      const api = this.apis.get(uf.toUpperCase());
      if (!api) {
        throw new Error(`Estado ${uf} não suportado`);
      }

      const cnpjLimpo = cnpj.replace(/\D/g, '');
      
      const certificado = process.env[`SEFAZ_${uf.toUpperCase()}_CERTIFICATE`];
      if (!certificado) {
        return this.mockDiferencialAliquota(cnpjLimpo);
      }

      const response: AxiosResponse<DiferencialAliquotaResponse> = await api.get(
        `/contribuinte/${cnpjLimpo}/diferencial-aliquota`
      );

      return response.data;
    } catch (error) {
      console.error(`Erro ao consultar diferencial no ${uf}:`, error);
      throw new Error(`Falha na consulta de diferencial de alíquota no ${uf}`);
    }
  }

  // Análise completa multi-estado
  async analiseCompletaMultiEstado(cnpj: string): Promise<{
    icms: Map<string, ConsultaICMSResponse>;
    substituicaoTributaria: Map<string, SubstituicaoTributariaResponse>;
    diferencialAliquota: Map<string, DiferencialAliquotaResponse>;
    resumo: {
      totalCreditos: number;
      totalDebitos: number;
      oportunidades: number;
      estadosAnalisados: string[];
    };
  }> {
    const icms = await this.consultarTodosEstados(cnpj);
    const substituicaoTributaria = new Map<string, SubstituicaoTributariaResponse>();
    const diferencialAliquota = new Map<string, DiferencialAliquotaResponse>();

    // Analisar ST e diferencial nos estados principais
    const estadosPrincipais = ['SP', 'RJ', 'MG', 'RS', 'PR'];
    
    for (const uf of estadosPrincipais) {
      try {
        const [st, diff] = await Promise.all([
          this.analisarSubstituicaoTributaria(cnpj, uf),
          this.consultarDiferencialAliquota(cnpj, uf)
        ]);
        
        substituicaoTributaria.set(uf, st);
        diferencialAliquota.set(uf, diff);
      } catch (error) {
        console.warn(`Erro ao analisar ${uf}:`, error);
      }
    }

    // Calcular resumo
    let totalCreditos = 0;
    let totalDebitos = 0;
    let oportunidades = 0;

    icms.forEach((resultado) => {
      totalCreditos += resultado.creditos.reduce((sum, c) => sum + c.saldo, 0);
      totalDebitos += resultado.debitos.reduce((sum, d) => sum + d.valorTotal, 0);
    });

    substituicaoTributaria.forEach((resultado) => {
      oportunidades += resultado.valorTotalDiferenca;
    });

    diferencialAliquota.forEach((resultado) => {
      oportunidades += resultado.valorTotalDiferenca;
    });

    return {
      icms,
      substituicaoTributaria,
      diferencialAliquota,
      resumo: {
        totalCreditos,
        totalDebitos,
        oportunidades,
        estadosAnalisados: Array.from(icms.keys())
      }
    };
  }

  // Métodos mock para desenvolvimento
  private mockConsultaICMS(cnpj: string, uf: string): ConsultaICMSResponse {
    return {
      cnpj,
      uf,
      situacao: 'REGULAR',
      debitos: [
        {
          codigo: '001',
          descricao: 'ICMS - Imposto sobre Circulação de Mercadorias',
          valor: 75000,
          vencimento: '2024-12-15',
          multa: 7500,
          juros: 2250,
          valorTotal: 84750
        }
      ],
      creditos: [
        {
          codigo: '100',
          descricao: 'Diferencial de Alíquota Interestadual',
          valor: 45000,
          origem: 'Operações interestaduais',
          saldo: 45000,
          dataExpiracao: '2029-12-31'
        }
      ]
    };
  }

  private mockSubstituicaoTributaria(cnpj: string): SubstituicaoTributariaResponse {
    return {
      cnpj,
      produtos: [
        {
          ncm: '2710.12.10',
          descricao: 'Gasolina comum',
          valorST: 15000,
          valorEfetivo: 12000,
          diferenca: 3000,
          situacao: 'RECOLHIDO_MAIOR'
        }
      ],
      valorTotalDiferenca: 3000
    };
  }

  private mockDiferencialAliquota(cnpj: string): DiferencialAliquotaResponse {
    return {
      cnpj,
      operacoes: [
        {
          nfe: '35240612345678901234567890123456789012345678',
          dataEmissao: '2024-01-15',
          ufOrigem: 'SP',
          ufDestino: 'RJ',
          aliquotaOrigem: 12,
          aliquotaDestino: 18,
          baseCalculo: 100000,
          icmsRecolhido: 12000,
          icmsDevido: 18000,
          diferenca: 6000
        }
      ],
      valorTotalDiferenca: 6000
    };
  }

  // Utilitários
  static getEstadosSuportados(): string[] {
    return ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'GO', 'BA', 'PE', 'CE'];
  }

  static validarUF(uf: string): boolean {
    return this.getEstadosSuportados().includes(uf.toUpperCase());
  }
}

export const sefazService = new SEFAZIntegrationService();