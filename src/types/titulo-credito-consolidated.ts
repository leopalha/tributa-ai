// =====================================================
// FONTE ÚNICA DE VERDADE PARA TIPOS DE TÍTULOS DE CRÉDITO
// Este arquivo consolida TODOS os tipos relacionados a:
// - Títulos de Crédito (TC)
// - Tokenização de créditos
// - Categorias, status, subtipos, garantias, blockchain, histórico, estatísticas, filtros, formulários, etc.
// NÃO use mais tc.ts, titulo-credito.ts, titulo.ts. Todos os imports devem ser feitos a partir deste arquivo.
// =====================================================

// === TIPOS CONSOLIDADOS PARA TÍTULOS DE CRÉDITO ===
// Este arquivo substitui tc.ts, titulo-credito.ts, titulo.ts e credit-types.ts

import { z } from 'zod';

// === TIPOS BASE ===

export type StatusTituloCredito =
  | 'disponivel'
  | 'reservado'
  | 'vendido'
  | 'tokenizado'
  | 'compensado'
  | 'vencido'
  | 'cancelado';

export type TipoTituloCredito =
  | 'tributario'
  | 'comercial'
  | 'financeiro'
  | 'judicial'
  | 'rural'
  | 'imobiliario'
  | 'ambiental'
  | 'especial';

export type SubtipoTituloCredito = {
  tributario: 'federal' | 'estadual' | 'municipal';
  comercial: 'duplicata_mercantil' | 'duplicata_servico' | 'nota_promissoria' | 'letra_cambio';
  financeiro: 'debenture_simples' | 'debenture_incentivada' | 'ccb' | 'cri' | 'cra';
  judicial: 'precatorio_comum' | 'precatorio_alimentar' | 'creditorio_pre_judicial' | 'honorarios';
  rural: 'ccr' | 'cpr_fisica' | 'cpr_financeira' | 'cpr_eletronica' | 'ncr';
  imobiliario: 'sbpe' | 'pmcmv' | 'hipoteca' | 'alienacao_fiduciaria';
  ambiental: 'carbono_voluntario' | 'carbono_regulatorio' | 'biodiversidade' | 'hidrico';
  especial:
    | 'recuperacao_judicial'
    | 'consorcio'
    | 'plano_economico'
    | 'royalties'
    | 'seguros'
    | 'previdencia'
    | 'frete'
    | 'energia'
    | 'leasing';
};

export type TipoTransacaoTC = 'compensacao' | 'transferencia' | 'venda' | 'cancelamento';

// === INTERFACES PRINCIPAIS ===

export interface BaseTituloCredito {
  id: string;
  tcId: string; // Identificador único na blockchain
  nome: string;
  descricao: string;
  numero: string;

  // Classificação
  tipo: TipoTituloCredito;
  subtipo: string;

  // Valores financeiros
  valorNominal: number;
  valorAtual: number;
  valorMinimo?: number;
  taxaDesconto?: number;
  taxaJuros?: number;

  // Datas
  dataEmissao: Date;
  dataVencimento: Date;
  dataUltimaAtualizacao: Date;

  // Status e validação
  status: StatusTituloCredito;
  validado: boolean;
  documentosVerificados: boolean;

  // Partes envolvidas
  emissorId: string;
  portadorId: string;

  // Emissor detalhado
  emissor: EmisorTC;

  // Garantias
  garantias: GarantiaTC[];

  // Documentação
  documentos: DocumentoTC[];
  documentosIds: string[];

  // Blockchain
  blockchain: BlockchainTC;

  // Histórico
  historico: HistoricoEventoTC[];
  historicoTransacoesIds: string[];

  // Metadados
  metadados: Record<string, any>;

  // Controle
  createdAt: Date;
  updatedAt: Date;
}

// === INTERFACES ESPECÍFICAS POR TIPO ===

export interface TituloCreditoTributario extends BaseTituloCredito {
  tipo: 'tributario';
  tributario: {
    esfera: 'federal' | 'estadual' | 'municipal';
    tributo: string;
    periodoApuracao: {
      inicio: Date;
      fim: Date;
    };
    numeroProcessoAdministrativo?: string;
    numeroProcessoJudicial?: string;
    orgaoArrecadador: string;
    codigoReceita: string;
    situacaoFiscal: 'regular' | 'irregular' | 'pendente';
  };
}

export interface TituloCreditoComercial extends BaseTituloCredito {
  tipo: 'comercial';
  comercial: {
    numeroDocumento: string;
    sacado: {
      nome: string;
      documento: string;
      endereco: EnderecoTC;
    };
    operacaoComercial: {
      descricao: string;
      numeroNotaFiscal?: string;
      dataOperacao: Date;
    };
    protestado: boolean;
    dataProtesto?: Date;
  };
}

export interface TituloCreditoFinanceiro extends BaseTituloCredito {
  tipo: 'financeiro';
  financeiro: {
    instituicaoFinanceira: string;
    numeroContrato: string;
    modalidade: string;
    indexador?: string;
    spread?: number;
    garantiaReal?: boolean;
    rating: string;
    liquidezMercado: 'alta' | 'media' | 'baixa';
  };
}

export interface TituloCreditoJudicial extends BaseTituloCredito {
  tipo: 'judicial';
  judicial: {
    tribunal: string;
    numeroProcesso: string;
    vara: string;
    tribunalOrigem: string;
    varaOrigem?: string;
    natureza: 'alimentar' | 'comum';
    situacaoProcessual: 'tramitando' | 'sentenciado' | 'transitado_julgado';
    dataTransitoJulgado?: Date;
    advogado: {
      nome: string;
      oab: string;
    };
    valorSentenca: number;
    valorAtualizado: number;
    indiceCorrecao: string;
    enteDevedor?: string;
  };
}

export interface TituloCreditoRural extends BaseTituloCredito {
  tipo: 'rural';
  rural: {
    produtor: {
      nome: string;
      cpfCnpj: string;
      propriedade: {
        nome: string;
        inscricaoEstadual: string;
        area: number;
        municipio: string;
        estado: string;
      };
    };
    produto?: string;
    quantidade?: number;
    unidadeMedida?: string;
    safra?: string;
    localEntrega?: string;
    finalidade: 'custeio' | 'investimento' | 'comercializacao';
    registroImovelRural?: string;
    areaFinanciadaHectares?: number;
  };
}

export interface TituloCreditoImobiliario extends BaseTituloCredito {
  tipo: 'imobiliario';
  imobiliario: {
    imovel: {
      endereco: EnderecoTC;
      matricula: string;
      cartorio: string;
      areaTotal: number;
      areaPrivativa?: number;
      valorAvaliacao: number;
    };
    financiamento: {
      sistema: 'SFH' | 'SFI' | 'SBPE';
      programa?: string;
      prazoTotal: number;
      prazoRestante: number;
      saldoDevedor: number;
      prestacaoMensal: number;
    };
    garantia: {
      tipo: 'hipoteca' | 'alienacao_fiduciaria';
      valorGarantia: number;
    };
    matriculaImovel: string;
    enderecoImovel: EnderecoTC;
    tipoGarantia?: 'HIPOTECA' | 'ALIENACAO_FIDUCIARIA';
  };
}

export interface TituloCreditoAmbiental extends BaseTituloCredito {
  tipo: 'ambiental';
  ambiental: {
    tipoCredito: 'carbono' | 'biodiversidade' | 'hidrico';
    projeto: {
      nome: string;
      localizacao: string;
      metodologia: string;
      certificadora: string;
      numeroCertificado: string;
      dataValidacao: Date;
    };
    quantidade: number;
    unidadeMedida: string;
    vintage: number;
    adicionalidade: boolean;
    permanencia: boolean;
    projetoVinculado?: string;
    metodologiaCertificacao?: string;
    toneladasCO2Equivalente?: number;
    hectaresConservados?: number;
    volumeAguaEconomizadoM3?: number;
  };
}

export interface TituloCreditoEspecial extends BaseTituloCredito {
  tipo: 'especial';
  especial: {
    categoria: SubtipoTituloCredito['especial'];
    detalhes: Record<string, any>;
    orgaoRegulador?: string;
    numeroRegistro?: string;
    situacaoEspecial?: string;
    processoRecuperacaoJudicial?: string;
    credorOriginal?: string;
    classeCreditoRJ?: 'TRABALHISTA' | 'GARANTIA_REAL' | 'QUIROGRAFARIO' | 'ME_EPP' | 'FISCAL';
    administradoraConsorcio?: string;
    grupoConsorcio?: string;
    cotaConsorcio?: string;
  };
}

// === TIPOS UNIÃO ===

export type TituloCreditoUnion =
  | TituloCreditoTributario
  | TituloCreditoComercial
  | TituloCreditoFinanceiro
  | TituloCreditoJudicial
  | TituloCreditoRural
  | TituloCreditoImobiliario
  | TituloCreditoAmbiental
  | TituloCreditoEspecial;

// === INTERFACES DE APOIO ===

export interface EmisorTC {
  id: string;
  nome: string;
  documento: string;
  tipo: 'pessoa_fisica' | 'pessoa_juridica';
  rating?: string;
  endereco: EnderecoTC;
  contato: ContatoTC;
}

export interface EnderecoTC {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
}

export interface ContatoTC {
  email: string;
  telefone: string;
  telefoneAlternativo?: string;
  website?: string;
}

export interface GarantiaTC {
  id: string;
  tipo: 'real' | 'pessoal' | 'bancaria' | 'seguro';
  descricao: string;
  valor: number;
  instituicao?: string;
  dataVencimento?: Date;
  documentos: string[];
}

export interface DocumentoTC {
  id: string;
  nome: string;
  tipo: string;
  url: string;
  hash: string;
  dataUpload: Date;
  verificado: boolean;
  assinaturaDigital?: string;
}

export interface BlockchainTC {
  network: string;
  contractAddress: string;
  tokenId: string;
  transactionHash: string;
  blockNumber: number;
}

export interface HistoricoEventoTC {
  id: string;
  data: Date;
  tipo: 'emissao' | 'tokenizacao' | 'negociacao' | 'compensacao' | 'atualizacao' | 'cancelamento';
  descricao: string;
  usuario: string;
  valorAnterior?: number;
  valorNovo?: number;
  metadados?: Record<string, any>;
}

// === TRANSAÇÕES ===

export interface TransacaoTC {
  id: string;
  tituloId: string;
  tcId: string;
  tipo: TipoTransacaoTC;
  valorTransacao: number;
  valorDesconto?: number;
  valorLiquido: number;
  dataTransacao: Date;
  status: 'pendente' | 'confirmada' | 'falhou' | 'cancelada';
  descricao?: string;
  parteOrigemId: string;
  parteDestinoId: string;
  comprador: string;
  vendedor: string;
  quantidade: number;
  valorTotal: number;
  detalhesCompensacao?: {
    tipoTributo: string;
    numeroDebito?: string;
    valorDebito: number;
    dataVencimento: string;
  };
  taxas: {
    plataforma: number;
    blockchain: number;
    total: number;
  };
  blockchainTxHash?: string;
  hashTransacao?: string;
  blockNumber?: number;
}

// === FILTROS E FORMULÁRIOS ===

export interface FiltrosTituloCredito {
  tipo?: TipoTituloCredito[];
  subtipo?: string[];
  status?: StatusTituloCredito[];
  valorMin?: number;
  valorMax?: number;
  dataEmissaoInicio?: Date;
  dataEmissaoFim?: Date;
  dataVencimentoInicio?: Date;
  dataVencimentoFim?: Date;
  emissorId?: string;
  portadorId?: string;
  emissor?: string;
  validado?: boolean;
  rating?: string[];
  esfera?: string[];
  tribunal?: string[];
  regiao?: string[];
  ordenacao?: 'valor' | 'data_emissao' | 'data_vencimento' | 'rating' | 'rendimento';
  direcao?: 'asc' | 'desc';
  limite?: number;
  offset?: number;
}

export interface FormularioTituloCredito {
  nome: string;
  tipo: TipoTituloCredito;
  subtipo: string;
  valorNominal: number;
  valorTotal: number;
  emissor: string;
  origemCredito: string;
  tipoTributo?: string;
  processoAdministrativo?: string;
  processoJudicial?: string;
  documentos: File[];
}

// === PAGINAÇÃO ===

export interface TitulosCreditoPaginados {
  itens: TituloCreditoUnion[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

// === ESTATÍSTICAS ===

export interface EstatisticasTitulosCredito {
  totalTCs: number;
  valorTotalEmCarteira: number;
  valorTotalNegociado: number;
  tcsAtivos: number;
  tcsPorTipo: Record<TipoTituloCredito, number>;
  tcsPorStatus: Record<StatusTituloCredito, number>;
  volumeNegociacaoPeriodo: {
    diario: number;
    semanal: number;
    mensal: number;
    anual: number;
  };
  transacoesRecentes: {
    quantidade: number;
    valorMedio: number;
    variacaoPercentual: number;
  };
  topEmissores: Array<{
    id: string;
    nome: string;
    quantidade: number;
    valorTotal: number;
  }>;
  tendenciaPrecos: Array<{
    data: Date;
    valorMedio: number;
    volume: number;
  }>;
  liquidezPorTipo: Record<
    TipoTituloCredito,
    {
      tempoMedioNegociacao: number;
      volumeDiario: number;
      spread: number;
    }
  >;
}

// === ALIASES PARA COMPATIBILIDADE ===

// Aliases do tc.ts
export type StatusTitulo = StatusTituloCredito;
export type TipoTitulo = TipoTituloCredito;
export type TipoTransacao = TipoTransacaoTC;
export type TituloCreditoDetalhado = TituloCreditoUnion;
export type FiltrosTitulo = FiltrosTituloCredito;
export type FormularioTitulo = FormularioTituloCredito;
export type TitulosPaginados = TitulosCreditoPaginados;

// Aliases do titulo-credito.ts
export type StatusTC = StatusTituloCredito;
export type TipoTC = TipoTituloCredito;
export type SubtipoTC = SubtipoTituloCredito;
export type TituloCredito = BaseTituloCredito;
export type TCTributario = TituloCreditoTributario;
export type TCComercial = TituloCreditoComercial;
export type TCFinanceiro = TituloCreditoFinanceiro;
export type TCJudicial = TituloCreditoJudicial;
export type TCRural = TituloCreditoRural;
export type TCImobiliario = TituloCreditoImobiliario;
export type TCAmbiental = TituloCreditoAmbiental;
export type TCEspecial = TituloCreditoEspecial;
export type Endereco = EnderecoTC;
export type Contato = ContatoTC;
export type Garantia = GarantiaTC;
export type Documento = DocumentoTC;
export type HistoricoEvento = HistoricoEventoTC;
export type FiltrosTC = FiltrosTituloCredito;
export type EstatisticasMarketplace = EstatisticasTitulosCredito;

// === SCHEMAS ZOD (OPCIONAIS) ===

export const TituloCreditoSchema = z.object({
  id: z.string(),
  tcId: z.string(),
  nome: z.string(),
  tipo: z.enum([
    'tributario',
    'comercial',
    'financeiro',
    'judicial',
    'rural',
    'imobiliario',
    'ambiental',
    'especial',
  ]),
  valorNominal: z.number().positive(),
  valorAtual: z.number().positive(),
  status: z.enum([
    'disponivel',
    'reservado',
    'vendido',
    'tokenizado',
    'compensado',
    'vencido',
    'cancelado',
  ]),
  // ... outros campos conforme necessário
});

export type TituloCreditoSchemaType = z.infer<typeof TituloCreditoSchema>;
