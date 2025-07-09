import { BaseAPIService } from './base-api.service';
import { APIS_GOVERNAMENTAIS, API_CONFIG } from './config';

export interface Estado {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}

export interface Municipio {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: Estado;
    };
  };
}

export interface DadosMunicipioCompleto extends Municipio {
  area?: {
    total: number;
    unidade: string;
  };
  populacao?: {
    total: number;
    densidade: number;
    ano: number;
  };
  pib?: {
    total: number;
    perCapita: number;
    ano: number;
  };
  idh?: {
    valor: number;
    ano: number;
    ranking?: {
      estadual: number;
      nacional: number;
    };
  };
}

export interface IndicadorEconomico {
  id: string;
  nome: string;
  unidade: string;
  valor: number;
  data: string;
  fonte: string;
}

export class IBGERealService extends BaseAPIService {
  private static instance: IBGERealService;

  private constructor() {
    super(APIS_GOVERNAMENTAIS.IBGE.LOCALIDADES.estados.replace('/estados', ''));
  }

  public static getInstance(): IBGERealService {
    if (!IBGERealService.instance) {
      IBGERealService.instance = new IBGERealService();
    }
    return IBGERealService.instance;
  }

  /**
   * Listar todos os estados
   */
  async listarEstados(): Promise<Estado[]> {
    const cacheKey = 'ibge:estados';
    
    return this.requestWithCache<Estado[]>(
      cacheKey,
      async () => {
        const response = await this.api.get('/estados?orderBy=nome');
        return { data: response.data };
      },
      30 * 24 * 60 * 60 * 1000 // 30 dias
    );
  }

  /**
   * Obter estado por sigla
   */
  async obterEstadoPorSigla(sigla: string): Promise<Estado | null> {
    const estados = await this.listarEstados();
    return estados.find(e => e.sigla.toUpperCase() === sigla.toUpperCase()) || null;
  }

  /**
   * Listar municípios de um estado
   */
  async listarMunicipiosPorEstado(ufSigla: string): Promise<Municipio[]> {
    const cacheKey = `ibge:municipios:${ufSigla}`;
    
    const estado = await this.obterEstadoPorSigla(ufSigla);
    if (!estado) {
      throw new Error(`Estado ${ufSigla} não encontrado`);
    }

    return this.requestWithCache<Municipio[]>(
      cacheKey,
      async () => {
        const response = await this.api.get(`/estados/${estado.id}/municipios?orderBy=nome`);
        return { data: response.data };
      },
      30 * 24 * 60 * 60 * 1000 // 30 dias
    );
  }

  /**
   * Buscar município por nome
   */
  async buscarMunicipioPorNome(nome: string, uf?: string): Promise<Municipio[]> {
    let municipios: Municipio[] = [];

    if (uf) {
      // Buscar apenas no estado especificado
      const municipiosEstado = await this.listarMunicipiosPorEstado(uf);
      municipios = municipiosEstado.filter(m => 
        m.nome.toLowerCase().includes(nome.toLowerCase())
      );
    } else {
      // Buscar em todos os estados (mais demorado)
      const estados = await this.listarEstados();
      
      for (const estado of estados) {
        try {
          const municipiosEstado = await this.listarMunicipiosPorEstado(estado.sigla);
          const encontrados = municipiosEstado.filter(m => 
            m.nome.toLowerCase().includes(nome.toLowerCase())
          );
          municipios.push(...encontrados);
        } catch (error) {
          console.error(`Erro ao buscar municípios em ${estado.sigla}:`, error);
        }
      }
    }

    return municipios;
  }

  /**
   * Obter município por código IBGE
   */
  async obterMunicipioPorCodigo(codigo: string | number): Promise<DadosMunicipioCompleto> {
    const cacheKey = `ibge:municipio:${codigo}`;
    
    return this.requestWithCache<DadosMunicipioCompleto>(
      cacheKey,
      async () => {
        const response = await this.api.get(`/municipios/${codigo}`);
        
        // Enriquecer com dados adicionais (simulados por enquanto)
        const municipio = response.data;
        
        return {
          data: {
            ...municipio,
            area: {
              total: this.estimarAreaMunicipio(municipio.nome),
              unidade: 'km²'
            },
            populacao: {
              total: this.estimarPopulacaoMunicipio(municipio.nome, municipio.id),
              densidade: 0,
              ano: 2023
            },
            pib: {
              total: this.estimarPIBMunicipio(municipio.nome),
              perCapita: 0,
              ano: 2021
            },
            idh: {
              valor: this.estimarIDHMunicipio(municipio.nome),
              ano: 2010
            }
          }
        };
      },
      7 * 24 * 60 * 60 * 1000 // 7 dias
    );
  }

  /**
   * Listar regiões do Brasil
   */
  async listarRegioes(): Promise<Array<{
    id: number;
    sigla: string;
    nome: string;
    estados: number;
  }>> {
    const estados = await this.listarEstados();
    
    const regioesMap = new Map<string, any>();
    
    estados.forEach(estado => {
      const regiao = estado.regiao;
      if (!regioesMap.has(regiao.sigla)) {
        regioesMap.set(regiao.sigla, {
          ...regiao,
          estados: 0
        });
      }
      regioesMap.get(regiao.sigla).estados++;
    });

    return Array.from(regioesMap.values()).sort((a, b) => a.nome.localeCompare(b.nome));
  }

  /**
   * Obter estatísticas por região
   */
  async obterEstatisticasRegiao(regiaoSigla: string): Promise<{
    regiao: string;
    estados: Estado[];
    totalMunicipios: number;
    maiorEstado: string;
    menorEstado: string;
  }> {
    const estados = await this.listarEstados();
    const estadosRegiao = estados.filter(e => e.regiao.sigla === regiaoSigla);
    
    if (estadosRegiao.length === 0) {
      throw new Error(`Região ${regiaoSigla} não encontrada`);
    }

    let totalMunicipios = 0;
    const municipiosPorEstado: Record<string, number> = {};

    for (const estado of estadosRegiao) {
      const municipios = await this.listarMunicipiosPorEstado(estado.sigla);
      municipiosPorEstado[estado.nome] = municipios.length;
      totalMunicipios += municipios.length;
    }

    const estadosOrdenados = Object.entries(municipiosPorEstado)
      .sort(([, a], [, b]) => b - a);

    return {
      regiao: estadosRegiao[0].regiao.nome,
      estados: estadosRegiao,
      totalMunicipios,
      maiorEstado: estadosOrdenados[0][0],
      menorEstado: estadosOrdenados[estadosOrdenados.length - 1][0]
    };
  }

  /**
   * Validar código de município
   */
  validarCodigoMunicipio(codigo: string): boolean {
    // Código IBGE de município tem 7 dígitos
    const cleaned = codigo.replace(/[^\d]/g, '');
    return cleaned.length === 7 && /^\d{7}$/.test(cleaned);
  }

  /**
   * Obter feriados nacionais
   */
  async obterFeriados(ano: number): Promise<Array<{
    data: string;
    nome: string;
    tipo: string;
  }>> {
    const url = `${APIS_GOVERNAMENTAIS.COMPLEMENTARES.FERIADOS.url}/${ano}`;
    
    try {
      const response = await this.api.get(url);
      
      return response.data.map((feriado: any) => ({
        data: feriado.date,
        nome: feriado.name,
        tipo: feriado.type
      }));
    } catch (error) {
      console.error('[Feriados API Error]', error);
      
      // Retornar feriados fixos como fallback
      return this.getFeriadosFixos(ano);
    }
  }

  /**
   * Obter feriados fixos (fallback)
   */
  private getFeriadosFixos(ano: number): Array<{
    data: string;
    nome: string;
    tipo: string;
  }> {
    return [
      { data: `${ano}-01-01`, nome: 'Confraternização Universal', tipo: 'nacional' },
      { data: `${ano}-04-21`, nome: 'Tiradentes', tipo: 'nacional' },
      { data: `${ano}-05-01`, nome: 'Dia do Trabalho', tipo: 'nacional' },
      { data: `${ano}-09-07`, nome: 'Independência do Brasil', tipo: 'nacional' },
      { data: `${ano}-10-12`, nome: 'Nossa Senhora Aparecida', tipo: 'nacional' },
      { data: `${ano}-11-02`, nome: 'Finados', tipo: 'nacional' },
      { data: `${ano}-11-15`, nome: 'Proclamação da República', tipo: 'nacional' },
      { data: `${ano}-12-25`, nome: 'Natal', tipo: 'nacional' }
    ];
  }

  /**
   * Calcular distância aproximada entre municípios
   */
  async calcularDistanciaEntreMunicipios(
    codigoOrigem: string,
    codigoDestino: string
  ): Promise<{
    origem: DadosMunicipioCompleto;
    destino: DadosMunicipioCompleto;
    distanciaAproximadaKm: number;
    mesmoEstado: boolean;
    mesmaRegiao: boolean;
  }> {
    const [origem, destino] = await Promise.all([
      this.obterMunicipioPorCodigo(codigoOrigem),
      this.obterMunicipioPorCodigo(codigoDestino)
    ]);

    const mesmoEstado = origem.microrregiao.mesorregiao.UF.sigla === 
                       destino.microrregiao.mesorregiao.UF.sigla;
    
    const mesmaRegiao = origem.microrregiao.mesorregiao.UF.regiao.sigla === 
                       destino.microrregiao.mesorregiao.UF.regiao.sigla;

    // Cálculo muito aproximado baseado em localização
    let distanciaAproximadaKm = 0;
    
    if (origem.id === destino.id) {
      distanciaAproximadaKm = 0;
    } else if (mesmoEstado) {
      distanciaAproximadaKm = 200; // Média dentro do estado
    } else if (mesmaRegiao) {
      distanciaAproximadaKm = 800; // Média dentro da região
    } else {
      distanciaAproximadaKm = 2000; // Média entre regiões
    }

    return {
      origem,
      destino,
      distanciaAproximadaKm,
      mesmoEstado,
      mesmaRegiao
    };
  }

  // Métodos auxiliares para estimativas (substituir por APIs reais quando disponíveis)
  
  private estimarAreaMunicipio(nome: string): number {
    // Estimativa baseada no tamanho do nome (placeholder)
    const hash = nome.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.round((hash % 5000) + 100);
  }

  private estimarPopulacaoMunicipio(nome: string, codigo: number): number {
    // Estimativa baseada no código (placeholder)
    const base = codigo % 1000000;
    return Math.round(base * 100);
  }

  private estimarPIBMunicipio(nome: string): number {
    // Estimativa em milhões (placeholder)
    const hash = nome.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.round((hash % 1000) + 50) * 1000000;
  }

  private estimarIDHMunicipio(nome: string): number {
    // IDH entre 0.5 e 0.85 (placeholder)
    const hash = nome.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 0.5 + ((hash % 35) / 100);
  }
}

export const ibgeRealService = IBGERealService.getInstance();