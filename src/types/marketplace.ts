import { TipoTitulo, TCStatus } from './tc';
import { CreditCategory, CreditStatus } from '@prisma/client';
import { BaseStatus } from './common/status';
import { StatusTransacao } from './transacao';

export type TipoNegociacao = 'VENDA_DIRETA' | 'LEILAO' | 'OFERTA_PUBLICA';
export type OrigemTC = TipoTitulo;
export type StatusAnuncio =
  | 'anuncio_ativo'
  | 'anuncio_pausado'
  | 'anuncio_finalizado'
  | 'anuncio_expirado';

export type StatusProposta =
  | 'proposta_pendente'
  | 'proposta_aceita'
  | 'proposta_rejeitada'
  | 'proposta_cancelada';

export type TipoAvaliacao = 'positiva' | 'negativa' | 'neutra';

export interface Anuncio {
  id: string;
  tcId: string;
  tc: {
    id: string;
    numero: string;
    tipo: TipoTitulo;
    valorOriginal: number;
    valorDisponivel: number;
    emissor: {
      id: string;
      nome: string;
      documento: string;
    };
    origemCredito: string;
    tipoTributo: string;
    dataEmissao: string;
    dataVencimento: string;
    status: TCStatus;
    documentos: any[];
    transacoes: any[];
  };
  vendedorId: string;
  titulo: string;
  descricao: string;
  valorOriginal: number;
  valorMinimo: number;
  valorSugerido: number;
  tipoNegociacao: TipoNegociacao;
  status: StatusAnuncio;
  dataPublicacao: Date;
  dataExpiracao?: Date;
  visualizacoes: number;
  interessados: number;
  origemTC: OrigemTC;
  documentosNecessarios: string[];
  garantias: {
    tipo: string;
    descricao: string;
    valor: number;
  }[];
  restricoes?: string[];
  createdAt: Date;
  updatedAt: Date;
  imagens: string[];
  categoria: string;
  tags: string[];
  localizacao: string;
  observacoes?: string;
}

export interface Proposta {
  id: string;
  anuncioId: string;
  compradorId: string;
  status: StatusProposta;
  valor: number;
  dataProposta: Date;
  dataResposta?: Date;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transacao {
  id: string;
  anuncioId: string;
  propostaId: string;
  compradorId: string;
  vendedorId: string;
  valor: number;
  tipo: TipoNegociacao;
  status: StatusTransacao;
  dataCriacao: string;
  dataConclusao?: string;
  detalhes?: {
    tipoTributo?: string;
    numeroDebito?: string;
    valorDebito?: number;
    dataVencimento?: string;
  };
}

export interface AvaliacaoNegociacao {
  id: string;
  transacaoId: string;
  avaliadorId: string;
  avaliadoId: string;
  tipo: TipoAvaliacao;
  nota: number;
  comentario: string;
  dataCriacao: string;
}

export interface MarketplaceItem {
  id: string;
  tipo: TipoTitulo;
  titulo: string;
  descricao: string;
  valor: number;
  status: StatusAnuncio;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface CarrinhoItem {
  id: string;
  itemId: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  dataAdicao: string;
}

export interface Pedido {
  id: string;
  itens: CarrinhoItem[];
  valorTotal: number;
  status: StatusTransacao;
  enderecoEntrega?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  metodoPagamento: {
    tipo: 'cartao' | 'transferencia' | 'boleto';
    detalhes: Record<string, unknown>;
  };
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface Avaliacao {
  id: string;
  itemId: string;
  usuarioId: string;
  nota: number;
  comentario: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

enum AnuncioStatusMarketplace {
  ATIVO = 'ativo',
  PAUSADO = 'pausado',
  FINALIZADO = 'finalizado',
  EXPIRADO = 'expirado',
}

export interface EstatisticasMarketplace {
  totalAnuncios: number;
  anunciosAtivos: number;
  valorTotalAnunciado: number;
  negociacoesConcluidas: number;
  valorNegociado: number;
  anunciosPorTipo?: Partial<Record<TipoNegociacao, number>>;
  anunciosPorStatus?: Partial<Record<AnuncioStatusMarketplace, number>>;
  ultimasNegociacoes: {
    id: string;
    titulo?: string | null;
    valor: number;
    data: string | Date;
  }[];
  totalPropostas?: number;
  totalTransacoes?: number;
  valorTotalTransacionado?: number;
  distribuicaoPorTipo?: Partial<Record<CreditCategory, number>>;
  distribuicaoPorStatus?: Partial<Record<CreditStatus, number>>;
  distribuicaoPorOrigem?: Record<OrigemTC, number>;
  mediaValorAnuncio?: number;
  mediaValorProposta?: number;
  taxaSucesso?: number;
  volumeNegociado30d?: number;
  desagioMedioPercentual?: number;
  tempoMedioVendaDias?: number;
}

export interface AnuncioFiltros {
  status?: StatusAnuncio;
  categoria?: string;
  valorMin?: number;
  valorMax?: number;
  dataInicio?: Date;
  dataFim?: Date;
  localizacao?: string;
}

export interface PropostaFiltros {
  anuncioId?: string;
  compradorId?: string;
  status?: StatusProposta;
  dataInicio?: Date;
  dataFim?: Date;
}

export interface AnuncioCreate {
  titulo: string;
  descricao: string;
  valor: number;
  categoria: string;
  tags: string[];
  localizacao: string;
  imagens: string[];
  dataExpiracao?: Date;
  observacoes?: string;
}

export interface AnuncioUpdate {
  status?: StatusAnuncio;
  titulo?: string;
  descricao?: string;
  valor?: number;
  categoria?: string;
  tags?: string[];
  localizacao?: string;
  imagens?: string[];
  dataExpiracao?: Date;
  observacoes?: string;
}

export interface PropostaCreate {
  anuncioId: string;
  compradorId: string;
  valor: number;
  observacoes?: string;
}

export interface PropostaUpdate {
  status?: StatusProposta;
  valor?: number;
  observacoes?: string;
}

export interface MarketplaceStats {
  totalTitulos: number;
  valorTotal: number;
  titulosPorStatus: Record<string, number>;
  titulosPorTipo: Record<string, number>;
  volumeNegociado: {
    diario: number;
    semanal: number;
    mensal: number;
  };
  transacoesRecentes: {
    quantidade: number;
    valor: number;
    variacaoPercentual: number;
  };
  categoriasPopulares: Array<{
    categoria: string;
    percentual: number;
  }>;
  tendenciaNegociacao: Array<{
    data: string;
    volume: number;
  }>;
}

export enum AuctionType {
  REVERSE = 'REVERSE',
  FORWARD = 'FORWARD',
  DUTCH = 'DUTCH',
}

export enum AuctionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
}

// Sistema de Classificação de Títulos de Crédito - Baseado no eBay
// Desenvolvido para o Marketplace Tributa.AI

export interface TituloCredito {
  id: string;
  titulo: string;
  descricao: string;

  // === CLASSIFICAÇÃO PRINCIPAL ===
  categoria: CategoriaCredito;
  subcategoria: SubcategoriaCredito;
  tipo: TipoCredito;
  classificacao: ClassificacaoCredito;

  // === INFORMAÇÕES FINANCEIRAS ===
  valor: number;
  precoVenda: number;
  desconto: number;
  moeda: 'BRL' | 'USD' | 'EUR';

  // === DATAS E PRAZOS ===
  vencimento: Date;
  dataEmissao: Date;
  dataVencimentoOriginal?: Date;
  prazoMedio?: number; // em dias

  // === RATING E QUALIDADE ===
  rating: number; // 1-5 estrelas
  qualidade: QualidadeCredito;
  risco: NivelRisco;
  liquidez: NivelLiquidez;

  // === EMISSOR ===
  emissor: {
    nome: string;
    cnpj?: string;
    rating: number;
    transacoes: number;
    verificado: boolean;
    categoria: CategoriaEmissor;
    porte: PorteEmpresa;
    setor: SetorEconomico;
    regiao: {
      estado: string;
      cidade: string;
      regiao: RegiaoGeografica;
    };
  };

  // === MODALIDADE DE VENDA ===
  modalidade: ModalidadeVenda;
  status: StatusTitulo;

  // === GARANTIAS E SEGUROS ===
  garantias: TipoGarantia[];
  seguros: TipoSeguro[];
  avalista?: string;

  // === INFORMAÇÕES LEGAIS ===
  numeroProcesso?: string;
  orgaoEmissor: string;
  instanciaJudicial?: string;
  fase: FaseProcessual;

  // === BLOCKCHAIN E TOKENIZAÇÃO ===
  blockchain?: {
    tokenId: string;
    contractAddress: string;
    transactionHash: string;
    verified: boolean;
    network: string;
    tokenStandard: 'ERC-20' | 'ERC-721' | 'ERC-1155' | 'HyperledgerFabric';
  };

  // === MÉTRICAS DE MERCADO ===
  visualizacoes: number;
  favoritos: number;
  compartilhamentos: number;
  tempoMercado: number; // dias desde listagem

  // === MODALIDADE ESPECÍFICA ===
  leilao?: {
    tempoRestante: number;
    lanceMinimo: number;
    participantes: number;
    ultimoLance: number;
    incrementoMinimo: number;
    lanceAutomatico: boolean;
  };

  vendaDireta?: {
    precoFixo: number;
    negociavel: boolean;
    condicoesPagamento: string[];
    prazoEntrega: number;
  };

  proposta?: {
    precoMinimo: number;
    prazoPropostas: number;
    propostas: number;
    melhorProposta: number;
  };

  oferta?: {
    melhorOferta: number;
    numeroOfertas: number;
    aceitaContraoferta: boolean;
    precoReserva?: number;
  };

  // === CARACTERÍSTICAS ESPECIAIS ===
  destaque: boolean;
  premium: boolean;
  urgente: boolean;
  exclusivo: boolean;

  // === DOCUMENTAÇÃO ===
  documentos: DocumentoCredito[];
  certificacoes: CertificacaoCredito[];

  // === HISTÓRICO ===
  historico: HistoricoCredito[];

  // === TAGS E FILTROS ===
  tags: string[];
  palavrasChave: string[];

  // === CONDIÇÕES DE NEGOCIAÇÃO ===
  condicoes: CondicaoNegociacao;

  // === INFORMAÇÕES ADICIONAIS ===
  observacoes?: string;
  informacoesAdicionais?: Record<string, any>;
}

// === ENUMS E TIPOS ===

export enum CategoriaCredito {
  // TRIBUTÁRIOS
  TRIBUTARIO = 'tributario',
  ICMS = 'icms',
  PIS_COFINS = 'pis_cofins',
  IRPJ_CSLL = 'irpj_csll',
  ISS = 'iss',
  IPI = 'ipi',
  CONTRIBUICAO_PREVIDENCIARIA = 'contribuicao_previdenciaria',
  SIMPLES_NACIONAL = 'simples_nacional',
  OUTROS_TRIBUTOS = 'outros_tributos',

  // JUDICIAIS
  JUDICIAL = 'judicial',
  PRECATORIOS = 'precatorios',
  EXECUCAO_FISCAL = 'execucao_fiscal',
  ACAO_ORDINARIA = 'acao_ordinaria',
  MANDADO_SEGURANCA = 'mandado_seguranca',

  // COMERCIAIS
  COMERCIAL = 'comercial',
  DUPLICATA = 'duplicata',
  NOTA_PROMISSORIA = 'nota_promissoria',
  CHEQUE = 'cheque',
  CCB = 'ccb',
  CDB = 'cdb',

  // RURAIS
  RURAL = 'rural',
  CPR = 'cpr',
  CDCA = 'cdca',
  CRA = 'cra',
  LCA = 'lca',

  // AMBIENTAIS
  AMBIENTAL = 'ambiental',
  CARBONO = 'carbono',
  AGUA = 'agua',
  BIODIVERSIDADE = 'biodiversidade',

  // TRABALHISTAS
  TRABALHISTA = 'trabalhista',
  FGTS = 'fgts',
  INSS = 'inss',

  // OUTROS
  OUTROS = 'outros',
}

export enum SubcategoriaCredito {
  // ICMS
  ICMS_EXPORTACAO = 'icms_exportacao',
  ICMS_SUBSTITUICAO = 'icms_substituicao',
  ICMS_DIFERENCIAL = 'icms_diferencial',
  ICMS_ENERGIA = 'icms_energia',
  ICMS_COMBUSTIVEL = 'icms_combustivel',
  ICMS_TRANSPORTE = 'icms_transporte',

  // PIS/COFINS
  PIS_COFINS_ENERGIA = 'pis_cofins_energia',
  PIS_COFINS_MEDICAMENTOS = 'pis_cofins_medicamentos',
  PIS_COFINS_ALIMENTOS = 'pis_cofins_alimentos',
  PIS_COFINS_INSUMOS = 'pis_cofins_insumos',

  // PRECATÓRIOS
  PRECATORIO_ALIMENTAR = 'precatorio_alimentar',
  PRECATORIO_COMUM = 'precatorio_comum',
  PRECATORIO_FEDERAL = 'precatorio_federal',
  PRECATORIO_ESTADUAL = 'precatorio_estadual',
  PRECATORIO_MUNICIPAL = 'precatorio_municipal',

  // CPR
  CPR_FISICA = 'cpr_fisica',
  CPR_FINANCEIRA = 'cpr_financeira',
  CPR_SOJA = 'cpr_soja',
  CPR_MILHO = 'cpr_milho',
  CPR_ALGODAO = 'cpr_algodao',
  CPR_CAFE = 'cpr_cafe',

  // DUPLICATAS
  DUPLICATA_MERCANTIL = 'duplicata_mercantil',
  DUPLICATA_SERVICO = 'duplicata_servico',
  DUPLICATA_RURAL = 'duplicata_rural',

  // CARBONO
  CARBONO_FLORESTAL = 'carbono_florestal',
  CARBONO_ENERGIA = 'carbono_energia',
  CARBONO_INDUSTRIAL = 'carbono_industrial',
}

export enum TipoCredito {
  TRIBUTARIO = 'tributario',
  COMERCIAL = 'comercial',
  JUDICIAL = 'judicial',
  RURAL = 'rural',
  AMBIENTAL = 'ambiental',
  TRABALHISTA = 'trabalhista',
  FINANCEIRO = 'financeiro',
  OUTROS = 'outros',
}

export enum ClassificacaoCredito {
  // Baseado no sistema eBay de condições
  EXCELENTE = 'excelente', // Como novo, sem defeitos
  MUITO_BOM = 'muito_bom', // Ligeiros sinais de uso
  BOM = 'bom', // Sinais moderados de uso
  REGULAR = 'regular', // Sinais visíveis de uso
  RUIM = 'ruim', // Defeitos significativos
}

export enum QualidadeCredito {
  AAA = 'aaa', // Qualidade superior
  AA = 'aa', // Qualidade alta
  A = 'a', // Qualidade boa
  BBB = 'bbb', // Qualidade média
  BB = 'bb', // Qualidade baixa
  B = 'b', // Qualidade inferior
  CCC = 'ccc', // Qualidade muito baixa
  CC = 'cc', // Qualidade péssima
  C = 'c', // Qualidade crítica
  D = 'd', // Default/Inadimplente
}

export enum NivelRisco {
  MUITO_BAIXO = 'muito_baixo',
  BAIXO = 'baixo',
  MODERADO = 'moderado',
  ALTO = 'alto',
  MUITO_ALTO = 'muito_alto',
  EXTREMO = 'extremo',
}

export enum NivelLiquidez {
  MUITO_ALTA = 'muito_alta',
  ALTA = 'alta',
  MEDIA = 'media',
  BAIXA = 'baixa',
  MUITO_BAIXA = 'muito_baixa',
}

export enum CategoriaEmissor {
  PESSOA_FISICA = 'pessoa_fisica',
  MICROEMPRESA = 'microempresa',
  PEQUENA_EMPRESA = 'pequena_empresa',
  MEDIA_EMPRESA = 'media_empresa',
  GRANDE_EMPRESA = 'grande_empresa',
  MULTINACIONAL = 'multinacional',
  ORGAO_PUBLICO = 'orgao_publico',
  INSTITUICAO_FINANCEIRA = 'instituicao_financeira',
  COOPERATIVA = 'cooperativa',
  ASSOCIACAO = 'associacao',
  FUNDACAO = 'fundacao',
  ONG = 'ong',
}

export enum PorteEmpresa {
  MEI = 'mei',
  MICRO = 'micro',
  PEQUENA = 'pequena',
  MEDIA = 'media',
  GRANDE = 'grande',
}

export enum SetorEconomico {
  AGRONEGOCIO = 'agronegocio',
  INDUSTRIA = 'industria',
  COMERCIO = 'comercio',
  SERVICOS = 'servicos',
  CONSTRUCAO = 'construcao',
  TECNOLOGIA = 'tecnologia',
  FINANCEIRO = 'financeiro',
  SAUDE = 'saude',
  EDUCACAO = 'educacao',
  TRANSPORTE = 'transporte',
  ENERGIA = 'energia',
  MINERACAO = 'mineracao',
  TELECOMUNICACOES = 'telecomunicacoes',
  TURISMO = 'turismo',
  ALIMENTICIO = 'alimenticio',
  TEXTIL = 'textil',
  QUIMICO = 'quimico',
  FARMACEUTICO = 'farmaceutico',
  AUTOMOTIVO = 'automotivo',
  OUTROS = 'outros',
}

export enum RegiaoGeografica {
  NORTE = 'norte',
  NORDESTE = 'nordeste',
  CENTRO_OESTE = 'centro_oeste',
  SUDESTE = 'sudeste',
  SUL = 'sul',
}

export enum ModalidadeVenda {
  VENDA_DIRETA = 'venda_direta',
  LEILAO = 'leilao',
  PROPOSTA = 'proposta',
  OFERTA = 'oferta',
  NEGOCIACAO = 'negociacao',
  LEILAO_REVERSO = 'leilao_reverso',
}

export enum StatusTitulo {
  DISPONIVEL = 'disponivel',
  EM_LEILAO = 'em_leilao',
  EM_NEGOCIACAO = 'em_negociacao',
  RESERVADO = 'reservado',
  VENDIDO = 'vendido',
  CANCELADO = 'cancelado',
  SUSPENSO = 'suspenso',
  EXPIRADO = 'expirado',
}

export enum TipoGarantia {
  FIANCA_BANCARIA = 'fianca_bancaria',
  SEGURO_GARANTIA = 'seguro_garantia',
  DEPOSITO_JUDICIAL = 'deposito_judicial',
  PENHOR = 'penhor',
  HIPOTECA = 'hipoteca',
  ALIENACAO_FIDUCIARIA = 'alienacao_fiduciaria',
  AVAL = 'aval',
  FIANCA_PESSOAL = 'fianca_pessoal',
  CARTA_FIANCA = 'carta_fianca',
  GARANTIA_REAL = 'garantia_real',
  GARANTIA_PESSOAL = 'garantia_pessoal',
  SEM_GARANTIA = 'sem_garantia',
}

export enum TipoSeguro {
  SEGURO_CREDITO = 'seguro_credito',
  SEGURO_GARANTIA = 'seguro_garantia',
  SEGURO_PERFORMANCE = 'seguro_performance',
  SEGURO_JUDICIAL = 'seguro_judicial',
  SEGURO_TITULO = 'seguro_titulo',
  SEM_SEGURO = 'sem_seguro',
}

export enum FaseProcessual {
  ADMINISTRATIVA = 'administrativa',
  PRIMEIRA_INSTANCIA = 'primeira_instancia',
  SEGUNDA_INSTANCIA = 'segunda_instancia',
  TRIBUNAIS_SUPERIORES = 'tribunais_superiores',
  EXECUCAO = 'execucao',
  TRANSITADO_JULGADO = 'transitado_julgado',
  LIQUIDACAO = 'liquidacao',
  CUMPRIMENTO = 'cumprimento',
  ARQUIVADO = 'arquivado',
}

export interface DocumentoCredito {
  id: string;
  tipo: TipoDocumento;
  nome: string;
  url: string;
  dataUpload: Date;
  tamanho: number;
  formato: string;
  verificado: boolean;
  assinado: boolean;
  hash?: string;
}

export enum TipoDocumento {
  TITULO_ORIGINAL = 'titulo_original',
  CERTIDAO_DEBITO = 'certidao_debito',
  DECISAO_JUDICIAL = 'decisao_judicial',
  LAUDO_PERICIAL = 'laudo_pericial',
  CONTRATO = 'contrato',
  NOTA_FISCAL = 'nota_fiscal',
  COMPROVANTE_PAGAMENTO = 'comprovante_pagamento',
  PROCURACAO = 'procuracao',
  ESTATUTO_SOCIAL = 'estatuto_social',
  BALANCO_PATRIMONIAL = 'balanco_patrimonial',
  DEMONSTRATIVO_RESULTADO = 'demonstrativo_resultado',
  CERTIDAO_NEGATIVA = 'certidao_negativa',
  ALVARA_FUNCIONAMENTO = 'alvara_funcionamento',
  LICENCA_AMBIENTAL = 'licenca_ambiental',
  OUTROS = 'outros',
}

export interface CertificacaoCredito {
  id: string;
  tipo: TipoCertificacao;
  orgao: string;
  numero: string;
  dataEmissao: Date;
  dataVencimento?: Date;
  status: StatusCertificacao;
  url?: string;
}

export enum TipoCertificacao {
  AUDITORIA_INDEPENDENTE = 'auditoria_independente',
  CERTIFICACAO_DIGITAL = 'certificacao_digital',
  SELO_QUALIDADE = 'selo_qualidade',
  RATING_AGENCIA = 'rating_agencia',
  VERIFICACAO_JURIDICA = 'verificacao_juridica',
  ANALISE_TECNICA = 'analise_tecnica',
  COMPLIANCE = 'compliance',
  ESG = 'esg',
  ISO = 'iso',
  OUTROS = 'outros',
}

export enum StatusCertificacao {
  ATIVO = 'ativo',
  EXPIRADO = 'expirado',
  SUSPENSO = 'suspenso',
  CANCELADO = 'cancelado',
  PENDENTE = 'pendente',
}

export interface HistoricoCredito {
  id: string;
  data: Date;
  evento: TipoEvento;
  descricao: string;
  valor?: number;
  usuario?: string;
  detalhes?: Record<string, any>;
}

export enum TipoEvento {
  CRIACAO = 'criacao',
  ATUALIZACAO = 'atualizacao',
  LANCE = 'lance',
  OFERTA = 'oferta',
  VENDA = 'venda',
  CANCELAMENTO = 'cancelamento',
  SUSPENSAO = 'suspensao',
  REATIVACAO = 'reativacao',
  VISUALIZACAO = 'visualizacao',
  FAVORITO = 'favorito',
  COMPARTILHAMENTO = 'compartilhamento',
  TOKENIZACAO = 'tokenizacao',
  TRANSFERENCIA = 'transferencia',
  VENCIMENTO = 'vencimento',
  PAGAMENTO = 'pagamento',
  OUTROS = 'outros',
}

export interface CondicaoNegociacao {
  aceitaNegociacao: boolean;
  precoMinimo?: number;
  precoMaximo?: number;
  prazoNegociacao?: number; // dias
  condicoesPagamento: CondicaoPagamento[];
  observacoes?: string;
}

export enum CondicaoPagamento {
  A_VISTA = 'a_vista',
  PARCELADO = 'parcelado',
  PIX = 'pix',
  TRANSFERENCIA = 'transferencia',
  BOLETO = 'boleto',
  CARTAO_CREDITO = 'cartao_credito',
  CARTAO_DEBITO = 'cartao_debito',
  BLOCKCHAIN = 'blockchain',
  CRIPTOMOEDA = 'criptomoeda',
  PERMUTA = 'permuta',
  OUTROS = 'outros',
}

// === INTERFACES DE FILTROS ===

export interface FiltrosMarketplace {
  // Filtros Básicos
  categoria?: CategoriaCredito[];
  subcategoria?: SubcategoriaCredito[];
  tipo?: TipoCredito[];

  // Filtros Financeiros
  valorMinimo?: number;
  valorMaximo?: number;
  descontoMinimo?: number;
  descontoMaximo?: number;

  // Filtros de Qualidade
  ratingMinimo?: number;
  qualidade?: QualidadeCredito[];
  risco?: NivelRisco[];
  liquidez?: NivelLiquidez[];

  // Filtros de Localização
  estados?: string[];
  cidades?: string[];
  regioes?: RegiaoGeografica[];

  // Filtros de Emissor
  categoriaEmissor?: CategoriaEmissor[];
  porteEmpresa?: PorteEmpresa[];
  setorEconomico?: SetorEconomico[];
  emissoresVerificados?: boolean;

  // Filtros de Modalidade
  modalidade?: ModalidadeVenda[];
  status?: StatusTitulo[];

  // Filtros de Garantia
  garantias?: TipoGarantia[];
  seguros?: TipoSeguro[];

  // Filtros de Prazo
  vencimentoMinimo?: Date;
  vencimentoMaximo?: Date;
  prazoMedioMinimo?: number;
  prazoMedioMaximo?: number;

  // Filtros Especiais
  destaque?: boolean;
  premium?: boolean;
  urgente?: boolean;
  exclusivo?: boolean;
  tokenizado?: boolean;

  // Filtros de Busca
  palavraChave?: string;
  tags?: string[];

  // Filtros de Ordenação
  ordenarPor?: OrdenacaoMarketplace;
  direcao?: 'asc' | 'desc';

  // Paginação
  pagina?: number;
  itensPorPagina?: number;
}

export enum OrdenacaoMarketplace {
  RELEVANCIA = 'relevancia',
  PRECO_MENOR = 'preco_menor',
  PRECO_MAIOR = 'preco_maior',
  DESCONTO_MAIOR = 'desconto_maior',
  DESCONTO_MENOR = 'desconto_menor',
  VENCIMENTO_PROXIMO = 'vencimento_proximo',
  VENCIMENTO_DISTANTE = 'vencimento_distante',
  RATING_MAIOR = 'rating_maior',
  RATING_MENOR = 'rating_menor',
  MAIS_VISUALIZADOS = 'mais_visualizados',
  MAIS_FAVORITADOS = 'mais_favoritados',
  MAIS_RECENTES = 'mais_recentes',
  MAIS_ANTIGOS = 'mais_antigos',
  LIQUIDEZ_MAIOR = 'liquidez_maior',
  LIQUIDEZ_MENOR = 'liquidez_menor',
  RISCO_MENOR = 'risco_menor',
  RISCO_MAIOR = 'risco_maior',
}

// === INTERFACES DE RESPOSTA ===

export interface ResultadoMarketplace {
  titulos: TituloCredito[];
  total: number;
  pagina: number;
  totalPaginas: number;
  filtrosAplicados: FiltrosMarketplace;
  estatisticas: EstatisticasMarketplace;
}

export interface EstatisticasMarketplace {
  totalTitulos: number;
  valorTotalMercado: number;
  valorMedioTitulo: number;
  descontoMedio: number;
  tempoMedioVenda: number;
  categoriasMaisNegociadas: { categoria: CategoriaCredito; quantidade: number }[];
  estadosMaisAtivos: { estado: string; quantidade: number }[];
  tendencias: TendenciaMarketplace[];
}

export interface TendenciaMarketplace {
  periodo: string;
  categoria: CategoriaCredito;
  variacao: number;
  direcao: 'alta' | 'baixa' | 'estavel';
  motivo?: string;
}

// === INTERFACES DE WORKFLOW ===

export interface WorkflowCompra {
  id: string;
  tituloId: string;
  compradorId: string;
  vendedorId: string;
  etapa: EtapaWorkflow;
  status: StatusWorkflow;
  valor: number;
  dataInicio: Date;
  dataFim?: Date;
  historico: HistoricoWorkflow[];
  documentos: DocumentoWorkflow[];
  observacoes?: string;
}

export enum EtapaWorkflow {
  INICIADO = 'iniciado',
  VALIDACAO_COMPRADOR = 'validacao_comprador',
  VALIDACAO_TITULO = 'validacao_titulo',
  VALIDACAO_JURIDICA = 'validacao_juridica',
  VALIDACAO_FINANCEIRA = 'validacao_financeira',
  ASSINATURA_CONTRATO = 'assinatura_contrato',
  PAGAMENTO = 'pagamento',
  TRANSFERENCIA_TITULARIDADE = 'transferencia_titularidade',
  TOKENIZACAO = 'tokenizacao',
  CONCLUSAO = 'conclusao',
}

export enum StatusWorkflow {
  PENDENTE = 'pendente',
  EM_ANDAMENTO = 'em_andamento',
  AGUARDANDO_APROVACAO = 'aguardando_aprovacao',
  APROVADO = 'aprovado',
  REJEITADO = 'rejeitado',
  CANCELADO = 'cancelado',
  CONCLUIDO = 'concluido',
  ERRO = 'erro',
}

export interface HistoricoWorkflow {
  id: string;
  data: Date;
  etapa: EtapaWorkflow;
  status: StatusWorkflow;
  usuario: string;
  observacoes?: string;
  documentos?: string[];
}

export interface DocumentoWorkflow {
  id: string;
  tipo: TipoDocumentoWorkflow;
  nome: string;
  url: string;
  obrigatorio: boolean;
  status: StatusDocumentoWorkflow;
  dataUpload?: Date;
  dataValidacao?: Date;
  validadoPor?: string;
  observacoes?: string;
}

export enum TipoDocumentoWorkflow {
  IDENTIDADE_COMPRADOR = 'identidade_comprador',
  COMPROVANTE_RESIDENCIA = 'comprovante_residencia',
  COMPROVANTE_RENDA = 'comprovante_renda',
  CONTRATO_SOCIAL = 'contrato_social',
  PROCURACAO = 'procuracao',
  TITULO_ORIGINAL = 'titulo_original',
  CERTIDOES_NEGATIVAS = 'certidoes_negativas',
  TERMO_COMPRA = 'termo_compra',
  COMPROVANTE_PAGAMENTO = 'comprovante_pagamento',
  CONTRATO_TRANSFERENCIA = 'contrato_transferencia',
  OUTROS = 'outros',
}

export enum StatusDocumentoWorkflow {
  PENDENTE = 'pendente',
  ENVIADO = 'enviado',
  VALIDANDO = 'validando',
  APROVADO = 'aprovado',
  REJEITADO = 'rejeitado',
  EXPIRADO = 'expirado',
}

// === INTERFACES PARA COMPONENTES ===

export interface PropsComponenteMarketplace {
  filtros?: FiltrosMarketplace;
  onFiltroChange?: (filtros: FiltrosMarketplace) => void;
  onTituloSelect?: (titulo: TituloCredito) => void;
  onComprar?: (titulo: TituloCredito) => void;
  onFavoritar?: (titulo: TituloCredito) => void;
  loading?: boolean;
  error?: string;
}

export interface PropsCardTitulo {
  titulo: TituloCredito;
  onComprar?: (titulo: TituloCredito) => void;
  onFavoritar?: (titulo: TituloCredito) => void;
  onCompartilhar?: (titulo: TituloCredito) => void;
  onVerDetalhes?: (titulo: TituloCredito) => void;
  destacado?: boolean;
  compacto?: boolean;
}

export interface PropsFiltroMarketplace {
  filtros: FiltrosMarketplace;
  onFiltroChange: (filtros: FiltrosMarketplace) => void;
  estatisticas?: EstatisticasMarketplace;
  loading?: boolean;
}

// === CONFIGURAÇÕES ===

export const CONFIGURACOES_MARKETPLACE = {
  // Configurações de Workflow
  TEMPO_LIMITE_WORKFLOW: {
    INICIADO: 1, // 1 hora
    VALIDACAO_COMPRADOR: 24, // 24 horas
    VALIDACAO_TITULO: 48, // 48 horas
    VALIDACAO_JURIDICA: 72, // 72 horas
    VALIDACAO_FINANCEIRA: 24, // 24 horas
    ASSINATURA_CONTRATO: 48, // 48 horas
    PAGAMENTO: 72, // 72 horas
    TRANSFERENCIA_TITULARIDADE: 120, // 120 horas (5 dias)
    TOKENIZACAO: 24, // 24 horas
    CONCLUSAO: 1, // 1 hora
  },
  NOTIFICACOES: {
    EMAIL_ENABLED: true,
    SMS_ENABLED: true,
    PUSH_ENABLED: true,
    LEMBRETE_PRAZO_HORAS: 24,
  },
  VALIDACAO: {
    DOCUMENTOS_OBRIGATORIOS: true,
    KYC_OBRIGATORIO: true,
    ASSINATURA_DIGITAL: true,
    BACKUP_BLOCKCHAIN: true,
  },
  // Configurações de Marketplace
  ITENS_POR_PAGINA: 20,
  MAX_ITENS_POR_PAGINA: 100,
  TAXA_PLATAFORMA: 0.025, // 2.5%
  TEMPO_SESSAO_LEILAO: 300000, // 5 minutos em ms
  INCREMENTO_LANCE_MINIMO: 0.01, // 1%
  PRAZO_PAGAMENTO_PADRAO: 3, // dias
  PRAZO_TRANSFERENCIA_PADRAO: 5, // dias
  VALOR_MINIMO_TITULO: 1000, // R$ 1.000
  VALOR_MAXIMO_TITULO: 100000000, // R$ 100 milhões
  DESCONTO_MAXIMO_PERMITIDO: 0.5, // 50%
  RATING_MINIMO_VENDEDOR: 3.0,
  DOCUMENTOS_OBRIGATORIOS: [
    TipoDocumentoWorkflow.IDENTIDADE_COMPRADOR,
    TipoDocumentoWorkflow.TITULO_ORIGINAL,
    TipoDocumentoWorkflow.CERTIDOES_NEGATIVAS,
  ],
} as const;

export default TituloCredito;
