import { BaseAPIService } from './base-api.service';
import { APIS_GOVERNAMENTAIS, API_CONFIG } from './config';

export interface DadosCEP {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
}

export interface ConsultaCEPCompleta extends DadosCEP {
  coordenadas?: {
    latitude: number;
    longitude: number;
  };
  altitude?: number;
  vizinhos?: string[];
}

export class CEPRealService extends BaseAPIService {
  private static instance: CEPRealService;

  private constructor() {
    super('');
  }

  public static getInstance(): CEPRealService {
    if (!CEPRealService.instance) {
      CEPRealService.instance = new CEPRealService();
    }
    return CEPRealService.instance;
  }

  /**
   * Consultar CEP usando múltiplas APIs com fallback
   */
  async consultarCEP(cep: string): Promise<DadosCEP> {
    const cepLimpo = this.cleanString(cep);
    
    if (!this.validateCEP(cepLimpo)) {
      throw new Error('CEP inválido. Deve conter 8 dígitos.');
    }

    const cacheKey = `cep:${cepLimpo}`;

    return this.requestWithCache<DadosCEP>(
      cacheKey,
      async () => {
        // Estratégia de fallback entre APIs
        const apis = [
          () => this.consultarViaCEP(cepLimpo),
          () => this.consultarBrasilAPICEP(cepLimpo)
        ];

        let lastError: Error | null = null;

        for (const apiCall of apis) {
          try {
            const result = await apiCall();
            return { data: result };
          } catch (error) {
            console.error('[CEP API Error]', error);
            lastError = error as Error;
          }
        }

        throw lastError || new Error('Todas as APIs de CEP falharam');
      },
      API_CONFIG.CACHE_TTL.CEP
    );
  }

  /**
   * Consultar usando ViaCEP
   */
  private async consultarViaCEP(cep: string): Promise<DadosCEP> {
    const url = `${APIS_GOVERNAMENTAIS.CORREIOS.VIACEP.url}/${cep}/json/`;
    
    const response = await this.api.get<any>(url);
    
    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }

    return this.mapearViaCEP(response.data);
  }

  /**
   * Consultar usando BrasilAPI
   */
  private async consultarBrasilAPICEP(cep: string): Promise<DadosCEP> {
    const url = `${APIS_GOVERNAMENTAIS.CORREIOS.BRASILAPI_CEP.url}/${cep}`;
    
    const response = await this.api.get<any>(url);
    
    return this.mapearBrasilAPICEP(response.data);
  }

  /**
   * Mapear resposta do ViaCEP
   */
  private mapearViaCEP(data: any): DadosCEP {
    return {
      cep: this.formatCEP(data.cep),
      logradouro: data.logradouro,
      complemento: data.complemento,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
      ibge: data.ibge,
      gia: data.gia,
      ddd: data.ddd,
      siafi: data.siafi
    };
  }

  /**
   * Mapear resposta da BrasilAPI
   */
  private mapearBrasilAPICEP(data: any): DadosCEP {
    return {
      cep: this.formatCEP(data.cep),
      logradouro: data.street,
      complemento: undefined,
      bairro: data.neighborhood,
      localidade: data.city,
      uf: data.state,
      ibge: data.ibge,
      ddd: data.ddd
    };
  }

  /**
   * Validar CEP
   */
  private validateCEP(cep: string): boolean {
    const cleaned = cep.replace(/[^\d]/g, '');
    return cleaned.length === 8 && /^\d{8}$/.test(cleaned);
  }

  /**
   * Buscar CEPs por logradouro
   */
  async buscarPorLogradouro(
    uf: string,
    cidade: string,
    logradouro: string
  ): Promise<DadosCEP[]> {
    if (uf.length !== 2) {
      throw new Error('UF deve ter 2 caracteres');
    }

    if (cidade.length < 3) {
      throw new Error('Cidade deve ter pelo menos 3 caracteres');
    }

    if (logradouro.length < 3) {
      throw new Error('Logradouro deve ter pelo menos 3 caracteres');
    }

    const url = `${APIS_GOVERNAMENTAIS.CORREIOS.VIACEP.url}/${uf}/${cidade}/${logradouro}/json/`;
    
    try {
      const response = await this.api.get<any[]>(url);
      
      if (!Array.isArray(response.data)) {
        return [];
      }

      return response.data.map(item => this.mapearViaCEP(item));
    } catch (error) {
      console.error('[CEP Search Error]', error);
      return [];
    }
  }

  /**
   * Consultar múltiplos CEPs
   */
  async consultarMultiplosCEPs(ceps: string[]): Promise<Map<string, DadosCEP | null>> {
    const resultados = new Map<string, DadosCEP | null>();
    
    // Processar em lotes para não sobrecarregar
    const batchSize = 5;
    for (let i = 0; i < ceps.length; i += batchSize) {
      const batch = ceps.slice(i, i + batchSize);
      
      const promises = batch.map(async (cep) => {
        try {
          const dados = await this.consultarCEP(cep);
          resultados.set(cep, dados);
        } catch (error) {
          console.error(`Erro ao consultar CEP ${cep}:`, error);
          resultados.set(cep, null);
        }
      });
      
      await Promise.all(promises);
      
      // Pequeno delay entre lotes
      if (i + batchSize < ceps.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return resultados;
  }

  /**
   * Calcular distância aproximada entre CEPs
   */
  async calcularDistanciaEntreCEPs(cepOrigem: string, cepDestino: string): Promise<{
    origem: DadosCEP;
    destino: DadosCEP;
    distanciaAproximadaKm: number;
    mesmaUF: boolean;
    mesmaCidade: boolean;
  }> {
    const [origem, destino] = await Promise.all([
      this.consultarCEP(cepOrigem),
      this.consultarCEP(cepDestino)
    ]);

    // Cálculo simplificado baseado em diferenças de CEP
    // Este é um cálculo aproximado, não preciso
    const cepOrigemNum = parseInt(this.cleanString(origem.cep));
    const cepDestinoNum = parseInt(this.cleanString(destino.cep));
    const diferenca = Math.abs(cepOrigemNum - cepDestinoNum);
    
    // Estimativa muito aproximada (não usar para cálculos precisos)
    let distanciaAproximadaKm = 0;
    
    if (origem.uf === destino.uf) {
      if (origem.localidade === destino.localidade) {
        // Mesma cidade
        distanciaAproximadaKm = Math.min(diferenca / 1000, 50);
      } else {
        // Mesmo estado, cidades diferentes
        distanciaAproximadaKm = Math.min(diferenca / 100, 500);
      }
    } else {
      // Estados diferentes
      distanciaAproximadaKm = Math.min(diferenca / 50, 3000);
    }

    return {
      origem,
      destino,
      distanciaAproximadaKm: Math.round(distanciaAproximadaKm),
      mesmaUF: origem.uf === destino.uf,
      mesmaCidade: origem.localidade === destino.localidade
    };
  }

  /**
   * Obter informações do município pelo código IBGE
   */
  async obterInformacoesMunicipio(codigoIBGE: string): Promise<{
    nome: string;
    uf: string;
    regiao: string;
    populacao?: number;
    area?: number;
  }> {
    const url = `${APIS_GOVERNAMENTAIS.IBGE.LOCALIDADES.municipios}/${codigoIBGE}`;
    
    try {
      const response = await this.api.get<any>(url);
      
      return {
        nome: response.data.nome,
        uf: response.data.microrregiao.mesorregiao.UF.sigla,
        regiao: response.data.microrregiao.mesorregiao.UF.regiao.nome,
        populacao: response.data.populacao,
        area: response.data.area
      };
    } catch (error) {
      console.error('[IBGE API Error]', error);
      throw new Error('Erro ao consultar informações do município');
    }
  }

  /**
   * Validar endereço completo
   */
  async validarEndereco(endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
  }): Promise<{
    valido: boolean;
    problemas: string[];
    sugestoes?: Partial<typeof endereco>;
  }> {
    const problemas: string[] = [];
    const sugestoes: Partial<typeof endereco> = {};

    try {
      const dadosCEP = await this.consultarCEP(endereco.cep);
      
      // Validar UF
      if (dadosCEP.uf !== endereco.uf.toUpperCase()) {
        problemas.push(`UF incorreta. CEP ${endereco.cep} pertence a ${dadosCEP.uf}`);
        sugestoes.uf = dadosCEP.uf;
      }
      
      // Validar cidade
      if (dadosCEP.localidade.toLowerCase() !== endereco.cidade.toLowerCase()) {
        problemas.push(`Cidade incorreta. CEP ${endereco.cep} pertence a ${dadosCEP.localidade}`);
        sugestoes.cidade = dadosCEP.localidade;
      }
      
      // Validar bairro (se disponível)
      if (dadosCEP.bairro && dadosCEP.bairro.toLowerCase() !== endereco.bairro.toLowerCase()) {
        problemas.push(`Bairro pode estar incorreto. Sugestão: ${dadosCEP.bairro}`);
        sugestoes.bairro = dadosCEP.bairro;
      }
      
      // Validar logradouro (verificação parcial)
      if (dadosCEP.logradouro) {
        const logradouroSimplificado = endereco.logradouro.toLowerCase().replace(/^(rua|avenida|travessa|alameda)\s+/i, '');
        const logradouroCEPSimplificado = dadosCEP.logradouro.toLowerCase().replace(/^(rua|avenida|travessa|alameda)\s+/i, '');
        
        if (!logradouroCEPSimplificado.includes(logradouroSimplificado) && 
            !logradouroSimplificado.includes(logradouroCEPSimplificado)) {
          problemas.push(`Logradouro pode estar incorreto. Sugestão: ${dadosCEP.logradouro}`);
          sugestoes.logradouro = dadosCEP.logradouro;
        }
      }
      
    } catch (error) {
      problemas.push('CEP não encontrado ou inválido');
    }

    return {
      valido: problemas.length === 0,
      problemas,
      sugestoes: Object.keys(sugestoes).length > 0 ? sugestoes : undefined
    };
  }
}

export const cepRealService = CEPRealService.getInstance();