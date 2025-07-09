/**
 * Serviço unificado de integrações governamentais
 * Centraliza o acesso a todas as APIs públicas brasileiras
 */

// Exportar configurações
export * from './config';

// Exportar serviços individuais
export { receitaFederalRealService } from './receita-federal-real.service';
export { bancoCentralRealService } from './banco-central-real.service';
export { cepRealService } from './cep-real.service';
export { nfeConsultaRealService } from './nfe-consulta-real.service';
export { ibgeRealService } from './ibge-real.service';

// Exportar tipos
export type { DadosCNPJ } from './receita-federal-real.service';
export type { TaxaSelic, TaxaCambio, Indice } from './banco-central-real.service';
export type { DadosCEP } from './cep-real.service';
export type { DadosNFe, ValidacaoChaveAcesso } from './nfe-consulta-real.service';
export type { Estado, Municipio, DadosMunicipioCompleto } from './ibge-real.service';

// Importar serviços
import { receitaFederalRealService } from './receita-federal-real.service';
import { bancoCentralRealService } from './banco-central-real.service';
import { cepRealService } from './cep-real.service';
import { nfeConsultaRealService } from './nfe-consulta-real.service';
import { ibgeRealService } from './ibge-real.service';

/**
 * Classe unificada para acesso às APIs governamentais
 */
export class IntegracoesGovernamentais {
  private static instance: IntegracoesGovernamentais;

  // Serviços disponíveis
  public readonly receitaFederal = receitaFederalRealService;
  public readonly bancocentral = bancoCentralRealService;
  public readonly cep = cepRealService;
  public readonly nfe = nfeConsultaRealService;
  public readonly ibge = ibgeRealService;

  private constructor() {}

  public static getInstance(): IntegracoesGovernamentais {
    if (!IntegracoesGovernamentais.instance) {
      IntegracoesGovernamentais.instance = new IntegracoesGovernamentais();
    }
    return IntegracoesGovernamentais.instance;
  }

  /**
   * Consulta completa de empresa
   */
  async consultarEmpresaCompleta(cnpj: string) {
    const [dadosCNPJ, situacaoFiscal, regimeTributario] = await Promise.all([
      this.receitaFederal.consultarCNPJ(cnpj),
      this.receitaFederal.validarSituacaoFiscal(cnpj),
      this.receitaFederal.obterRegimeTributario(cnpj)
    ]);

    // Consultar CEP se disponível
    let endereco = null;
    if (dadosCNPJ.endereco.cep) {
      try {
        endereco = await this.cep.consultarCEP(dadosCNPJ.endereco.cep);
      } catch (error) {
        console.error('Erro ao consultar CEP:', error);
      }
    }

    // Consultar município no IBGE
    let municipio = null;
    if (endereco?.ibge) {
      try {
        municipio = await this.ibge.obterMunicipioPorCodigo(endereco.ibge);
      } catch (error) {
        console.error('Erro ao consultar município:', error);
      }
    }

    return {
      dadosBasicos: dadosCNPJ,
      situacaoFiscal,
      regimeTributario,
      enderecoCompleto: endereco,
      dadosMunicipio: municipio,
      dataConsulta: new Date().toISOString()
    };
  }

  /**
   * Calcular impostos com correção monetária
   */
  async calcularImpostosCorrigidos(
    valor: number,
    dataVencimento: string,
    uf: string,
    tipo: 'PRODUTO' | 'SERVICO' = 'PRODUTO'
  ) {
    const dataAtual = new Date().toISOString().split('T')[0];

    // Calcular impostos base
    const impostos = this.nfe.calcularImpostosAproximados(valor, uf, tipo);

    // Calcular juros e multa se vencido
    const jurosMulta = await this.bancocentral.calcularJurosMulta(
      impostos.totalImpostos,
      dataVencimento,
      dataAtual
    );

    // Obter índices econômicos
    const indices = await this.bancocentral.consultarIndicesEconomicos();

    return {
      impostos,
      jurosMulta,
      indices,
      resumo: {
        valorOriginal: valor,
        totalImpostos: impostos.totalImpostos,
        totalComJurosMulta: jurosMulta.valorTotal,
        vencido: jurosMulta.diasAtraso > 0
      }
    };
  }

  /**
   * Validar documentos fiscais
   */
  async validarDocumentosFiscais(
    documentos: Array<{
      tipo: 'CNPJ' | 'NFE' | 'CEP';
      valor: string;
    }>
  ) {
    const resultados = await Promise.all(
      documentos.map(async (doc) => {
        try {
          switch (doc.tipo) {
            case 'CNPJ':
              const cnpjValido = this.receitaFederal['validateCNPJ'](doc.valor);
              const dadosCNPJ = cnpjValido 
                ? await this.receitaFederal.consultarCNPJ(doc.valor)
                : null;
              
              return {
                tipo: doc.tipo,
                valor: doc.valor,
                valido: cnpjValido,
                dados: dadosCNPJ,
                erro: cnpjValido ? null : 'CNPJ inválido'
              };

            case 'NFE':
              const nfeInfo = this.nfe.validarChaveAcesso(doc.valor);
              const urlConsulta = nfeInfo.valida 
                ? this.nfe.gerarURLConsultaPublica(doc.valor)
                : null;
              
              return {
                tipo: doc.tipo,
                valor: doc.valor,
                valido: nfeInfo.valida,
                dados: nfeInfo,
                urlConsulta,
                erro: nfeInfo.valida ? null : 'Chave de acesso inválida'
              };

            case 'CEP':
              const cepValido = this.cep['validateCEP'](doc.valor);
              const dadosCEP = cepValido
                ? await this.cep.consultarCEP(doc.valor)
                : null;
              
              return {
                tipo: doc.tipo,
                valor: doc.valor,
                valido: cepValido,
                dados: dadosCEP,
                erro: cepValido ? null : 'CEP inválido'
              };

            default:
              return {
                tipo: doc.tipo,
                valor: doc.valor,
                valido: false,
                dados: null,
                erro: 'Tipo de documento não suportado'
              };
          }
        } catch (error) {
          return {
            tipo: doc.tipo,
            valor: doc.valor,
            valido: false,
            dados: null,
            erro: error instanceof Error ? error.message : 'Erro desconhecido'
          };
        }
      })
    );

    const validos = resultados.filter(r => r.valido).length;
    const invalidos = resultados.filter(r => !r.valido).length;

    return {
      resultados,
      resumo: {
        total: documentos.length,
        validos,
        invalidos,
        percentualValido: (validos / documentos.length) * 100
      }
    };
  }

  /**
   * Obter dashboard de indicadores econômicos
   */
  async obterDashboardEconomico() {
    const [indices, feriados, regioes] = await Promise.all([
      this.bancocentral.consultarIndicesEconomicos(),
      this.ibge.obterFeriados(new Date().getFullYear()),
      this.ibge.listarRegioes()
    ]);

    return {
      indices,
      feriados,
      regioes,
      proximoFeriado: this.obterProximoFeriado(feriados),
      dataConsulta: new Date().toISOString()
    };
  }

  /**
   * Obter próximo feriado
   */
  private obterProximoFeriado(feriados: Array<{ data: string; nome: string; tipo: string }>) {
    const hoje = new Date();
    const feriadosFuturos = feriados
      .filter(f => new Date(f.data) > hoje)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    
    return feriadosFuturos[0] || null;
  }

  /**
   * Status das APIs
   */
  async verificarStatusAPIs(): Promise<{
    servico: string;
    status: 'online' | 'offline' | 'degraded';
    tempoResposta?: number;
    erro?: string;
  }[]> {
    const servicos = [
      {
        nome: 'Receita Federal (CNPJ)',
        teste: () => this.receitaFederal.consultarCNPJ('11222333000181')
      },
      {
        nome: 'Banco Central (SELIC)',
        teste: () => this.bancocentral.consultarTaxaSelic()
      },
      {
        nome: 'Correios (CEP)',
        teste: () => this.cep.consultarCEP('01310100')
      },
      {
        nome: 'IBGE (Estados)',
        teste: () => this.ibge.listarEstados()
      }
    ];

    return Promise.all(
      servicos.map(async (servico) => {
        const inicio = Date.now();
        
        try {
          await servico.teste();
          const tempoResposta = Date.now() - inicio;
          
          return {
            servico: servico.nome,
            status: tempoResposta > 5000 ? 'degraded' : 'online' as const,
            tempoResposta
          };
        } catch (error) {
          return {
            servico: servico.nome,
            status: 'offline' as const,
            erro: error instanceof Error ? error.message : 'Erro desconhecido'
          };
        }
      })
    );
  }
}

// Exportar instância singleton
export const integracoesGovernamentais = IntegracoesGovernamentais.getInstance();