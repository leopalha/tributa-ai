import { BaseAPIService } from './base-api.service';
import { APIS_GOVERNAMENTAIS, API_CONFIG } from './config';

export interface TaxaSelic {
  data: string;
  valor: number;
}

export interface TaxaCambio {
  cotacaoCompra: number;
  cotacaoVenda: number;
  dataHoraCotacao: string;
}

export interface Indice {
  data: string;
  valor: number;
}

export interface SerieHistorica {
  nome: string;
  unidade: string;
  valores: Array<{
    data: string;
    valor: number;
  }>;
}

export class BancoCentralRealService extends BaseAPIService {
  private static instance: BancoCentralRealService;

  private constructor() {
    super(APIS_GOVERNAMENTAIS.BANCO_CENTRAL.SELIC.url.replace('/dados', ''));
  }

  public static getInstance(): BancoCentralRealService {
    if (!BancoCentralRealService.instance) {
      BancoCentralRealService.instance = new BancoCentralRealService();
    }
    return BancoCentralRealService.instance;
  }

  /**
   * Consultar taxa SELIC atual
   */
  async consultarTaxaSelic(): Promise<TaxaSelic> {
    const cacheKey = 'selic:atual';
    
    return this.requestWithCache<TaxaSelic>(
      cacheKey,
      async () => {
        const response = await this.api.get(
          '/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json'
        );
        
        const data = response.data[0];
        return {
          data: {
            data: data.data,
            valor: parseFloat(data.valor)
          }
        };
      },
      API_CONFIG.CACHE_TTL.SELIC
    );
  }

  /**
   * Consultar série histórica da SELIC
   */
  async consultarHistoricoSelic(dataInicio: string, dataFim: string): Promise<SerieHistorica> {
    const cacheKey = `selic:historico:${dataInicio}:${dataFim}`;
    
    return this.requestWithCache<SerieHistorica>(
      cacheKey,
      async () => {
        const response = await this.api.get(
          `/dados/serie/bcdata.sgs.11/dados?formato=json&dataInicial=${dataInicio}&dataFinal=${dataFim}`
        );
        
        return {
          data: {
            nome: 'Taxa SELIC',
            unidade: '% a.a.',
            valores: response.data.map((item: any) => ({
              data: item.data,
              valor: parseFloat(item.valor)
            }))
          }
        };
      },
      API_CONFIG.CACHE_TTL.SELIC
    );
  }

  /**
   * Consultar taxa de câmbio PTAX
   */
  async consultarTaxaCambio(): Promise<TaxaCambio> {
    const cacheKey = 'cambio:ptax:atual';
    
    return this.requestWithCache<TaxaCambio>(
      cacheKey,
      async () => {
        const response = await this.api.get(
          '/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json'
        );
        
        const data = response.data[0];
        const valor = parseFloat(data.valor);
        
        return {
          data: {
            cotacaoCompra: valor,
            cotacaoVenda: valor * 1.01, // Aproximação do spread
            dataHoraCotacao: `${data.data} 13:00:00`
          }
        };
      },
      API_CONFIG.CACHE_TTL.CAMBIO
    );
  }

  /**
   * Consultar IPCA
   */
  async consultarIPCA(): Promise<Indice> {
    const cacheKey = 'ipca:atual';
    
    return this.requestWithCache<Indice>(
      cacheKey,
      async () => {
        const response = await this.api.get(
          '/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json'
        );
        
        const data = response.data[0];
        return {
          data: {
            data: data.data,
            valor: parseFloat(data.valor)
          }
        };
      },
      API_CONFIG.CACHE_TTL.INDICES
    );
  }

  /**
   * Consultar IGP-M
   */
  async consultarIGPM(): Promise<Indice> {
    const cacheKey = 'igpm:atual';
    
    return this.requestWithCache<Indice>(
      cacheKey,
      async () => {
        const response = await this.api.get(
          '/dados/serie/bcdata.sgs.189/dados/ultimos/1?formato=json'
        );
        
        const data = response.data[0];
        return {
          data: {
            data: data.data,
            valor: parseFloat(data.valor)
          }
        };
      },
      API_CONFIG.CACHE_TTL.INDICES
    );
  }

  /**
   * Consultar múltiplos índices de uma vez
   */
  async consultarIndicesEconomicos(): Promise<{
    selic: TaxaSelic;
    ipca: Indice;
    igpm: Indice;
    cambio: TaxaCambio;
    dataConsulta: string;
  }> {
    const [selic, ipca, igpm, cambio] = await Promise.all([
      this.consultarTaxaSelic(),
      this.consultarIPCA(),
      this.consultarIGPM(),
      this.consultarTaxaCambio()
    ]);

    return {
      selic,
      ipca,
      igpm,
      cambio,
      dataConsulta: new Date().toISOString()
    };
  }

  /**
   * Calcular correção monetária
   */
  async calcularCorrecaoMonetaria(
    valor: number,
    dataInicio: string,
    dataFim: string,
    indice: 'IPCA' | 'IGPM' | 'SELIC' = 'IPCA'
  ): Promise<{
    valorOriginal: number;
    valorCorrigido: number;
    percentualCorrecao: number;
    indiceUtilizado: string;
    periodo: {
      inicio: string;
      fim: string;
    };
  }> {
    let serie: string;
    
    switch (indice) {
      case 'IPCA':
        serie = 'bcdata.sgs.433';
        break;
      case 'IGPM':
        serie = 'bcdata.sgs.189';
        break;
      case 'SELIC':
        serie = 'bcdata.sgs.11';
        break;
    }

    const response = await this.api.get(
      `/dados/serie/${serie}/dados?formato=json&dataInicial=${dataInicio}&dataFinal=${dataFim}`
    );

    // Calcular acumulado
    let acumulado = 1;
    response.data.forEach((item: any) => {
      const taxa = parseFloat(item.valor) / 100;
      acumulado *= (1 + taxa);
    });

    const percentualCorrecao = (acumulado - 1) * 100;
    const valorCorrigido = valor * acumulado;

    return {
      valorOriginal: valor,
      valorCorrigido: Math.round(valorCorrigido * 100) / 100,
      percentualCorrecao: Math.round(percentualCorrecao * 100) / 100,
      indiceUtilizado: indice,
      periodo: {
        inicio: dataInicio,
        fim: dataFim
      }
    };
  }

  /**
   * Obter taxa de juros para cálculo de multa e juros
   */
  async obterTaxaJurosMora(): Promise<{
    taxaMensal: number;
    taxaDiaria: number;
    baseCalculo: string;
    dataConsulta: string;
  }> {
    const selic = await this.consultarTaxaSelic();
    
    // Taxa de juros de mora = SELIC + 1% ao mês
    const taxaAnual = selic.valor;
    const taxaMensal = (taxaAnual / 12) + 1; // + 1% adicional
    const taxaDiaria = taxaMensal / 30;

    return {
      taxaMensal: Math.round(taxaMensal * 100) / 100,
      taxaDiaria: Math.round(taxaDiaria * 10000) / 10000,
      baseCalculo: `SELIC (${selic.valor}% a.a.) + 1% a.m.`,
      dataConsulta: new Date().toISOString()
    };
  }

  /**
   * Calcular juros e multa sobre débito tributário
   */
  async calcularJurosMulta(
    valorPrincipal: number,
    dataVencimento: string,
    dataCalculo: string = new Date().toISOString().split('T')[0]
  ): Promise<{
    valorPrincipal: number;
    multa: number;
    juros: number;
    valorTotal: number;
    diasAtraso: number;
    percentualMulta: number;
    percentualJuros: number;
    detalhamento: string;
  }> {
    // Calcular dias de atraso
    const vencimento = new Date(dataVencimento);
    const calculo = new Date(dataCalculo);
    const diasAtraso = Math.floor((calculo.getTime() - vencimento.getTime()) / (1000 * 60 * 60 * 24));

    if (diasAtraso <= 0) {
      return {
        valorPrincipal,
        multa: 0,
        juros: 0,
        valorTotal: valorPrincipal,
        diasAtraso: 0,
        percentualMulta: 0,
        percentualJuros: 0,
        detalhamento: 'Sem atraso'
      };
    }

    // Multa de mora: 0,33% por dia de atraso, limitada a 20%
    const percentualMultaDiaria = 0.33;
    const percentualMulta = Math.min(diasAtraso * percentualMultaDiaria, 20);
    const multa = valorPrincipal * (percentualMulta / 100);

    // Juros de mora: SELIC acumulada
    const taxaJuros = await this.obterTaxaJurosMora();
    const percentualJuros = (taxaJuros.taxaDiaria * diasAtraso);
    const juros = valorPrincipal * (percentualJuros / 100);

    const valorTotal = valorPrincipal + multa + juros;

    return {
      valorPrincipal,
      multa: Math.round(multa * 100) / 100,
      juros: Math.round(juros * 100) / 100,
      valorTotal: Math.round(valorTotal * 100) / 100,
      diasAtraso,
      percentualMulta: Math.round(percentualMulta * 100) / 100,
      percentualJuros: Math.round(percentualJuros * 100) / 100,
      detalhamento: `Multa: ${percentualMulta.toFixed(2)}% | Juros: ${percentualJuros.toFixed(2)}% (${diasAtraso} dias)`
    };
  }
}

export const bancoCentralRealService = BancoCentralRealService.getInstance();