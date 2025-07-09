import { BaseAPIService } from './base-api.service';
import { APIS_GOVERNAMENTAIS, ESTADOS_BRASIL } from './config';

export interface DadosNFe {
  chaveAcesso: string;
  numero: string;
  serie: string;
  dataEmissao: string;
  dataAutorizacao?: string;
  protocolo?: string;
  situacao: 'AUTORIZADA' | 'CANCELADA' | 'DENEGADA' | 'REJEITADA';
  emitente: {
    cnpj: string;
    razaoSocial: string;
    nomeFantasia?: string;
    inscricaoEstadual?: string;
    uf: string;
  };
  destinatario: {
    documento: string;
    nome: string;
    uf: string;
  };
  valores: {
    totalNFe: number;
    totalProdutos: number;
    totalDesconto: number;
    totalFrete?: number;
    totalSeguro?: number;
    totalOutros?: number;
    totalICMS: number;
    totalIPI?: number;
    totalPIS?: number;
    totalCOFINS?: number;
  };
  produtos?: Array<{
    codigo: string;
    descricao: string;
    ncm: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  }>;
}

export interface ValidacaoChaveAcesso {
  valida: boolean;
  uf: string;
  ano: string;
  mes: string;
  cnpj: string;
  modelo: string;
  serie: string;
  numero: string;
  tipoEmissao: string;
  codigoNumerico: string;
  digitoVerificador: string;
}

export class NFeConsultaRealService extends BaseAPIService {
  private static instance: NFeConsultaRealService;

  private constructor() {
    super('');
  }

  public static getInstance(): NFeConsultaRealService {
    if (!NFeConsultaRealService.instance) {
      NFeConsultaRealService.instance = new NFeConsultaRealService();
    }
    return NFeConsultaRealService.instance;
  }

  /**
   * Validar chave de acesso da NFe
   */
  validarChaveAcesso(chaveAcesso: string): ValidacaoChaveAcesso {
    const chave = chaveAcesso.replace(/[^\d]/g, '');
    
    if (chave.length !== 44) {
      return {
        valida: false,
        uf: '',
        ano: '',
        mes: '',
        cnpj: '',
        modelo: '',
        serie: '',
        numero: '',
        tipoEmissao: '',
        codigoNumerico: '',
        digitoVerificador: ''
      };
    }

    // Decomposição da chave
    const uf = chave.substring(0, 2);
    const ano = chave.substring(2, 4);
    const mes = chave.substring(4, 6);
    const cnpj = chave.substring(6, 20);
    const modelo = chave.substring(20, 22);
    const serie = chave.substring(22, 25);
    const numero = chave.substring(25, 34);
    const tipoEmissao = chave.substring(34, 35);
    const codigoNumerico = chave.substring(35, 43);
    const digitoVerificador = chave.substring(43, 44);

    // Validar dígito verificador
    const chaveParaCalculo = chave.substring(0, 43);
    const dvCalculado = this.calcularDigitoVerificador(chaveParaCalculo);
    
    const valida = digitoVerificador === dvCalculado.toString();

    return {
      valida,
      uf,
      ano: `20${ano}`,
      mes,
      cnpj: this.formatCNPJ(cnpj),
      modelo,
      serie: serie.replace(/^0+/, ''),
      numero: numero.replace(/^0+/, ''),
      tipoEmissao,
      codigoNumerico,
      digitoVerificador
    };
  }

  /**
   * Calcular dígito verificador da chave de acesso
   */
  private calcularDigitoVerificador(chave: string): number {
    let soma = 0;
    let peso = 2;

    for (let i = chave.length - 1; i >= 0; i--) {
      soma += parseInt(chave[i]) * peso;
      peso++;
      if (peso > 9) peso = 2;
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }

  /**
   * Gerar URL de consulta pública da NFe
   */
  gerarURLConsultaPublica(chaveAcesso: string): string | null {
    const validacao = this.validarChaveAcesso(chaveAcesso);
    
    if (!validacao.valida) {
      return null;
    }

    const uf = this.obterUFPorCodigo(validacao.uf);
    if (!uf) return null;

    const urlBase = APIS_GOVERNAMENTAIS.SEFAZ.CONSULTA_NFE[uf.sigla as keyof typeof APIS_GOVERNAMENTAIS.SEFAZ.CONSULTA_NFE];
    
    if (!urlBase) return null;

    // A maioria dos estados usa o padrão com chave de acesso
    return `${urlBase}?chNFe=${chaveAcesso.replace(/[^\d]/g, '')}`;
  }

  /**
   * Obter UF por código IBGE
   */
  private obterUFPorCodigo(codigo: string): typeof ESTADOS_BRASIL[0] | null {
    const codigosUF: Record<string, string> = {
      '11': 'RO', '12': 'AC', '13': 'AM', '14': 'RR', '15': 'PA',
      '16': 'AP', '17': 'TO', '21': 'MA', '22': 'PI', '23': 'CE',
      '24': 'RN', '25': 'PB', '26': 'PE', '27': 'AL', '28': 'SE',
      '29': 'BA', '31': 'MG', '32': 'ES', '33': 'RJ', '35': 'SP',
      '41': 'PR', '42': 'SC', '43': 'RS', '50': 'MS', '51': 'MT',
      '52': 'GO', '53': 'DF'
    };

    const sigla = codigosUF[codigo];
    if (!sigla) return null;

    return ESTADOS_BRASIL.find(e => e.sigla === sigla) || null;
  }

  /**
   * Extrair informações básicas da chave de acesso
   */
  extrairInformacoesChave(chaveAcesso: string): {
    ufEmissao: string;
    dataEmissao: string;
    cnpjEmitente: string;
    numeroNota: string;
    serieNota: string;
    modeloDocumento: string;
  } | null {
    const validacao = this.validarChaveAcesso(chaveAcesso);
    
    if (!validacao.valida) {
      return null;
    }

    const uf = this.obterUFPorCodigo(validacao.uf);
    
    return {
      ufEmissao: uf?.sigla || validacao.uf,
      dataEmissao: `${validacao.mes}/${validacao.ano}`,
      cnpjEmitente: validacao.cnpj,
      numeroNota: validacao.numero,
      serieNota: validacao.serie,
      modeloDocumento: this.obterDescricaoModelo(validacao.modelo)
    };
  }

  /**
   * Obter descrição do modelo do documento fiscal
   */
  private obterDescricaoModelo(codigo: string): string {
    const modelos: Record<string, string> = {
      '55': 'NF-e (Nota Fiscal Eletrônica)',
      '65': 'NFC-e (Nota Fiscal de Consumidor Eletrônica)',
      '57': 'CT-e (Conhecimento de Transporte Eletrônico)',
      '58': 'MDF-e (Manifesto Eletrônico de Documentos Fiscais)',
      '59': 'CF-e-SAT (Cupom Fiscal Eletrônico)'
    };

    return modelos[codigo] || `Modelo ${codigo}`;
  }

  /**
   * Analisar múltiplas chaves de acesso
   */
  analisarLoteChaves(chavesAcesso: string[]): {
    validas: Array<{
      chave: string;
      informacoes: ReturnType<typeof this.extrairInformacoesChave>;
      urlConsulta: string | null;
    }>;
    invalidas: Array<{
      chave: string;
      motivo: string;
    }>;
    resumo: {
      total: number;
      validas: number;
      invalidas: number;
      porUF: Record<string, number>;
      porModelo: Record<string, number>;
    };
  } {
    const validas: Array<any> = [];
    const invalidas: Array<any> = [];
    const porUF: Record<string, number> = {};
    const porModelo: Record<string, number> = {};

    chavesAcesso.forEach(chave => {
      const validacao = this.validarChaveAcesso(chave);
      
      if (validacao.valida) {
        const informacoes = this.extrairInformacoesChave(chave);
        const urlConsulta = this.gerarURLConsultaPublica(chave);
        
        validas.push({
          chave,
          informacoes,
          urlConsulta
        });

        // Contabilizar por UF
        if (informacoes) {
          porUF[informacoes.ufEmissao] = (porUF[informacoes.ufEmissao] || 0) + 1;
          porModelo[informacoes.modeloDocumento] = (porModelo[informacoes.modeloDocumento] || 0) + 1;
        }
      } else {
        invalidas.push({
          chave,
          motivo: 'Chave de acesso inválida'
        });
      }
    });

    return {
      validas,
      invalidas,
      resumo: {
        total: chavesAcesso.length,
        validas: validas.length,
        invalidas: invalidas.length,
        porUF,
        porModelo
      }
    };
  }

  /**
   * Calcular impostos aproximados de uma NFe
   * (Valores aproximados baseados em alíquotas médias)
   */
  calcularImpostosAproximados(valor: number, uf: string, tipo: 'PRODUTO' | 'SERVICO' = 'PRODUTO'): {
    valorBase: number;
    icms: {
      aliquota: number;
      valor: number;
    };
    pis: {
      aliquota: number;
      valor: number;
    };
    cofins: {
      aliquota: number;
      valor: number;
    };
    ipi?: {
      aliquota: number;
      valor: number;
    };
    totalImpostos: number;
    percentualCarga: number;
  } {
    // Alíquotas médias por UF (simplificado)
    const aliquotasICMS: Record<string, number> = {
      'SP': 18, 'RJ': 20, 'MG': 18, 'RS': 17.5, 'PR': 18,
      'SC': 17, 'BA': 18, 'PE': 18, 'CE': 18, 'GO': 17,
      'DEFAULT': 18
    };

    const aliquotaICMS = aliquotasICMS[uf] || aliquotasICMS.DEFAULT;
    const valorICMS = valor * (aliquotaICMS / 100);

    // PIS e COFINS (regime não cumulativo)
    const aliquotaPIS = 1.65;
    const aliquotaCOFINS = 7.6;
    const valorPIS = valor * (aliquotaPIS / 100);
    const valorCOFINS = valor * (aliquotaCOFINS / 100);

    let totalImpostos = valorICMS + valorPIS + valorCOFINS;
    let resultado: any = {
      valorBase: valor,
      icms: {
        aliquota: aliquotaICMS,
        valor: Math.round(valorICMS * 100) / 100
      },
      pis: {
        aliquota: aliquotaPIS,
        valor: Math.round(valorPIS * 100) / 100
      },
      cofins: {
        aliquota: aliquotaCOFINS,
        valor: Math.round(valorCOFINS * 100) / 100
      }
    };

    // IPI apenas para produtos
    if (tipo === 'PRODUTO') {
      const aliquotaIPI = 10; // Alíquota média
      const valorIPI = valor * (aliquotaIPI / 100);
      totalImpostos += valorIPI;
      
      resultado.ipi = {
        aliquota: aliquotaIPI,
        valor: Math.round(valorIPI * 100) / 100
      };
    }

    resultado.totalImpostos = Math.round(totalImpostos * 100) / 100;
    resultado.percentualCarga = Math.round((totalImpostos / valor) * 10000) / 100;

    return resultado;
  }

  /**
   * Gerar QR Code para consulta de NFCe
   */
  gerarQRCodeNFCe(chaveAcesso: string, ambiente: '1' | '2' = '1'): string {
    const validacao = this.validarChaveAcesso(chaveAcesso);
    
    if (!validacao.valida || validacao.modelo !== '65') {
      throw new Error('Chave de acesso inválida ou não é uma NFCe');
    }

    const uf = this.obterUFPorCodigo(validacao.uf);
    if (!uf) throw new Error('UF não encontrada');

    const urlBase = APIS_GOVERNAMENTAIS.SEFAZ.CONSULTA_NFE[uf.sigla as keyof typeof APIS_GOVERNAMENTAIS.SEFAZ.CONSULTA_NFE];
    
    // Formato padrão do QR Code NFCe
    return `${urlBase}?p=${chaveAcesso}|2|${ambiente}|1`;
  }
}

export const nfeConsultaRealService = NFeConsultaRealService.getInstance();