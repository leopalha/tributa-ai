import { BaseAPIService } from './base-api.service';
import { APIS_GOVERNAMENTAIS, API_CONFIG } from './config';

export interface DadosCNPJ {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  dataAbertura: string;
  situacaoCadastral: string;
  dataSituacaoCadastral?: string;
  motivoSituacao?: string;
  naturezaJuridica?: string;
  porte?: string;
  capitalSocial?: number;
  atividadePrincipal: {
    codigo: string;
    descricao: string;
  };
  atividadesSecundarias?: Array<{
    codigo: string;
    descricao: string;
  }>;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
  };
  contato: {
    telefone?: string;
    email?: string;
  };
  qsa?: Array<{
    nome: string;
    qualificacao: string;
    pais?: string;
    cpfRepresentanteLegal?: string;
    nomeRepresentanteLegal?: string;
    qualificacaoRepresentanteLegal?: string;
  }>;
  simplesNacional?: {
    optante: boolean;
    dataOpcao?: string;
    dataExclusao?: string;
  };
  mei?: {
    optante: boolean;
    dataOpcao?: string;
    dataExclusao?: string;
  };
}

export class ReceitaFederalRealService extends BaseAPIService {
  private static instance: ReceitaFederalRealService;

  private constructor() {
    super('');
  }

  public static getInstance(): ReceitaFederalRealService {
    if (!ReceitaFederalRealService.instance) {
      ReceitaFederalRealService.instance = new ReceitaFederalRealService();
    }
    return ReceitaFederalRealService.instance;
  }

  /**
   * Consultar CNPJ usando múltiplas APIs públicas com fallback
   */
  async consultarCNPJ(cnpj: string): Promise<DadosCNPJ> {
    const cnpjLimpo = this.cleanString(cnpj);
    
    if (!this.validateCNPJ(cnpjLimpo)) {
      throw new Error('CNPJ inválido');
    }

    const cacheKey = `cnpj:${cnpjLimpo}`;

    // Tentar com cache primeiro
    const cached = await this.requestWithCache<DadosCNPJ>(
      cacheKey,
      async () => {
        // Estratégia de fallback entre APIs
        const apis = [
          () => this.consultarReceitaWS(cnpjLimpo),
          () => this.consultarBrasilAPI(cnpjLimpo),
          () => this.consultarCNPJWS(cnpjLimpo)
        ];

        let lastError: Error | null = null;

        for (const apiCall of apis) {
          try {
            const result = await apiCall();
            return { data: result };
          } catch (error) {
            console.error('[CNPJ API Error]', error);
            lastError = error as Error;
            // Continuar para próxima API
          }
        }

        throw lastError || new Error('Todas as APIs falharam');
      },
      API_CONFIG.CACHE_TTL.CNPJ
    );

    return cached;
  }

  /**
   * Consultar usando ReceitaWS
   */
  private async consultarReceitaWS(cnpj: string): Promise<DadosCNPJ> {
    const url = `${APIS_GOVERNAMENTAIS.RECEITA_FEDERAL.CNPJ_RECEITAWS.url}/${cnpj}`;
    
    const response = await this.requestWithRateLimit<any>(
      'receitaws',
      () => this.api.get(url),
      API_CONFIG.RATE_LIMITS.RECEITAWS.requests,
      API_CONFIG.RATE_LIMITS.RECEITAWS.window
    );

    if (response.status === 'ERROR') {
      throw new Error(response.message || 'Erro na consulta');
    }

    return this.mapearReceitaWS(response);
  }

  /**
   * Consultar usando BrasilAPI
   */
  private async consultarBrasilAPI(cnpj: string): Promise<DadosCNPJ> {
    const url = `${APIS_GOVERNAMENTAIS.RECEITA_FEDERAL.BRASIL_API.url}/${cnpj}`;
    
    const response = await this.api.get<any>(url);
    
    return this.mapearBrasilAPI(response.data);
  }

  /**
   * Consultar usando CNPJ.ws
   */
  private async consultarCNPJWS(cnpj: string): Promise<DadosCNPJ> {
    const url = `${APIS_GOVERNAMENTAIS.RECEITA_FEDERAL.CNPJ_PUBLIC.url}/${cnpj}`;
    
    const response = await this.api.get<any>(url);
    
    return this.mapearCNPJWS(response.data);
  }

  /**
   * Mapear resposta da ReceitaWS
   */
  private mapearReceitaWS(data: any): DadosCNPJ {
    return {
      cnpj: this.formatCNPJ(data.cnpj),
      razaoSocial: data.nome,
      nomeFantasia: data.fantasia,
      dataAbertura: data.abertura,
      situacaoCadastral: data.situacao,
      dataSituacaoCadastral: data.data_situacao,
      motivoSituacao: data.motivo_situacao,
      naturezaJuridica: data.natureza_juridica,
      porte: data.porte,
      capitalSocial: parseFloat(data.capital_social) || 0,
      atividadePrincipal: {
        codigo: data.atividade_principal[0]?.code || '',
        descricao: data.atividade_principal[0]?.text || ''
      },
      atividadesSecundarias: data.atividades_secundarias?.map((ativ: any) => ({
        codigo: ativ.code,
        descricao: ativ.text
      })) || [],
      endereco: {
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        uf: data.uf,
        cep: this.formatCEP(data.cep)
      },
      contato: {
        telefone: data.telefone,
        email: data.email
      },
      qsa: data.qsa?.map((socio: any) => ({
        nome: socio.nome,
        qualificacao: socio.qual,
        pais: socio.pais_origem,
        cpfRepresentanteLegal: socio.cpf_representante_legal,
        nomeRepresentanteLegal: socio.nome_representante_legal,
        qualificacaoRepresentanteLegal: socio.qual_representante_legal
      })) || [],
      simplesNacional: {
        optante: data.situacao_especial === 'Optante pelo Simples',
        dataOpcao: data.data_situacao_especial
      },
      mei: {
        optante: data.porte === 'ME' && data.situacao_especial?.includes('MEI')
      }
    };
  }

  /**
   * Mapear resposta da BrasilAPI
   */
  private mapearBrasilAPI(data: any): DadosCNPJ {
    return {
      cnpj: this.formatCNPJ(data.cnpj),
      razaoSocial: data.razao_social,
      nomeFantasia: data.nome_fantasia,
      dataAbertura: data.data_inicio_atividade,
      situacaoCadastral: data.descricao_situacao_cadastral,
      dataSituacaoCadastral: data.data_situacao_cadastral,
      motivoSituacao: data.descricao_motivo_situacao_cadastral,
      naturezaJuridica: data.descricao_natureza_juridica,
      porte: data.porte,
      capitalSocial: data.capital_social || 0,
      atividadePrincipal: {
        codigo: data.cnae_fiscal.toString(),
        descricao: data.cnae_fiscal_descricao
      },
      atividadesSecundarias: data.cnaes_secundarias?.map((cnae: any) => ({
        codigo: cnae.codigo.toString(),
        descricao: cnae.descricao
      })) || [],
      endereco: {
        logradouro: `${data.descricao_tipo_de_logradouro} ${data.logradouro}`,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        uf: data.uf,
        cep: this.formatCEP(data.cep.toString())
      },
      contato: {
        telefone: data.ddd_telefone_1 ? `(${data.ddd_telefone_1}) ${data.telefone_1}` : undefined,
        email: data.email
      },
      qsa: data.qsa?.map((socio: any) => ({
        nome: socio.nome_socio,
        qualificacao: socio.qualificacao_socio,
        pais: socio.pais,
        cpfRepresentanteLegal: socio.cpf_representante_legal,
        nomeRepresentanteLegal: socio.nome_representante_legal,
        qualificacaoRepresentanteLegal: socio.qualificacao_representante_legal
      })) || [],
      simplesNacional: {
        optante: data.opcao_pelo_simples
      },
      mei: {
        optante: data.opcao_pelo_mei
      }
    };
  }

  /**
   * Mapear resposta da CNPJ.ws
   */
  private mapearCNPJWS(data: any): DadosCNPJ {
    return {
      cnpj: this.formatCNPJ(data.estabelecimento.cnpj),
      razaoSocial: data.razao_social,
      nomeFantasia: data.estabelecimento.nome_fantasia,
      dataAbertura: data.estabelecimento.data_inicio_atividade,
      situacaoCadastral: data.estabelecimento.situacao_cadastral,
      dataSituacaoCadastral: data.estabelecimento.data_situacao_cadastral,
      motivoSituacao: data.estabelecimento.motivo_situacao_cadastral,
      naturezaJuridica: data.natureza_juridica?.descricao,
      porte: data.porte?.descricao,
      capitalSocial: data.capital_social || 0,
      atividadePrincipal: {
        codigo: data.estabelecimento.atividade_principal?.id || '',
        descricao: data.estabelecimento.atividade_principal?.descricao || ''
      },
      atividadesSecundarias: data.estabelecimento.atividades_secundarias?.map((ativ: any) => ({
        codigo: ativ.id,
        descricao: ativ.descricao
      })) || [],
      endereco: {
        logradouro: `${data.estabelecimento.tipo_logradouro} ${data.estabelecimento.logradouro}`,
        numero: data.estabelecimento.numero,
        complemento: data.estabelecimento.complemento,
        bairro: data.estabelecimento.bairro,
        municipio: data.estabelecimento.cidade?.nome || '',
        uf: data.estabelecimento.estado?.sigla || '',
        cep: this.formatCEP(data.estabelecimento.cep)
      },
      contato: {
        telefone: data.estabelecimento.ddd1 ? `(${data.estabelecimento.ddd1}) ${data.estabelecimento.telefone1}` : undefined,
        email: data.estabelecimento.email
      },
      qsa: data.socios?.map((socio: any) => ({
        nome: socio.nome,
        qualificacao: socio.qualificacao_socio?.descricao,
        pais: socio.pais?.nome
      })) || [],
      simplesNacional: {
        optante: data.simples?.optante || false,
        dataOpcao: data.simples?.data_opcao,
        dataExclusao: data.simples?.data_exclusao
      },
      mei: {
        optante: data.simei?.optante || false,
        dataOpcao: data.simei?.data_opcao,
        dataExclusao: data.simei?.data_exclusao
      }
    };
  }

  /**
   * Validar situação fiscal
   */
  async validarSituacaoFiscal(cnpj: string): Promise<{
    regular: boolean;
    situacao: string;
    pendencias: string[];
    dataConsulta: string;
  }> {
    const dados = await this.consultarCNPJ(cnpj);
    
    const regular = dados.situacaoCadastral === 'ATIVA';
    const pendencias: string[] = [];
    
    if (!regular) {
      pendencias.push(`Situação cadastral: ${dados.situacaoCadastral}`);
      if (dados.motivoSituacao) {
        pendencias.push(`Motivo: ${dados.motivoSituacao}`);
      }
    }
    
    return {
      regular,
      situacao: dados.situacaoCadastral,
      pendencias,
      dataConsulta: new Date().toISOString()
    };
  }

  /**
   * Obter regime tributário
   */
  async obterRegimeTributario(cnpj: string): Promise<{
    regime: string;
    simplesNacional: boolean;
    mei: boolean;
    dataConsulta: string;
  }> {
    const dados = await this.consultarCNPJ(cnpj);
    
    let regime = 'Lucro Presumido'; // Default
    
    if (dados.mei?.optante) {
      regime = 'MEI';
    } else if (dados.simplesNacional?.optante) {
      regime = 'Simples Nacional';
    } else if (dados.porte === 'DEMAIS') {
      regime = 'Lucro Real';
    }
    
    return {
      regime,
      simplesNacional: dados.simplesNacional?.optante || false,
      mei: dados.mei?.optante || false,
      dataConsulta: new Date().toISOString()
    };
  }
}

export const receitaFederalRealService = ReceitaFederalRealService.getInstance();