export interface CompensacaoRequest {
  id: string;
  solicitanteId: string;
  tipo: 'UNILATERAL' | 'MULTILATERAL' | 'CIRCULAR';
  status:
    | 'PENDENTE'
    | 'ANALISANDO'
    | 'APROVADA'
    | 'REJEITADA'
    | 'PROCESSANDO'
    | 'CONCLUIDA'
    | 'CANCELADA';
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';

  // Dados básicos
  descricao: string;
  observacoes?: string;
  dataLimite?: Date;

  // Créditos e débitos
  creditosCompensacao: CreditoCompensacao[];
  debitosCompensacao: DebitoCompensacao[];

  // Cálculos
  valorTotalCreditos: number;
  valorTotalDebitos: number;
  valorLiquidoCompensacao: number;
  economiaEstimada: number;

  // Processamento
  dataProcessamento?: Date;
  resultadoProcessamento?: ResultadoCompensacao;

  // Auditoria
  criadoEm: Date;
  atualizadoEm: Date;
  criadoPor: string;
  aprovadoPor?: string;
  processadoPor?: string;

  // Documentação
  documentosComprobatorios: DocumentoCompensacao[];
  relatorioPreliminar?: RelatorioCompensacao;
  relatorioFinal?: RelatorioCompensacao;
}

export interface CreditoCompensacao {
  id: string;
  tituloCredito: {
    id: string;
    nome: string;
    categoria: string;
    subcategoria: string;
    valor: number;
    vencimento: Date;
    origem: string;
    numeroDocumento: string;
  };
  valorUtilizado: number;
  percentualUtilizado: number;
  status: 'SELECIONADO' | 'VALIDADO' | 'UTILIZADO' | 'REJEITADO';
  validacao?: ValidacaoCredito;
  observacoes?: string;
}

export interface DebitoCompensacao {
  id: string;
  obrigacaoFiscal: {
    id: string;
    nome: string;
    codigo: string;
    orgao: string;
    valor: number;
    vencimento: Date;
    numeroDocumento: string;
  };
  valorCompensado: number;
  percentualCompensado: number;
  status: 'SELECIONADO' | 'VALIDADO' | 'COMPENSADO' | 'REJEITADO';
  validacao?: ValidacaoDebito;
  observacoes?: string;
}

export interface ValidacaoCredito {
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  validadoPor?: string;
  dataValidacao?: Date;
  observacoes?: string;
  documentosAnalisados: string[];
  criteriosAtendidos: CriterioValidacao[];
}

export interface ValidacaoDebito {
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  validadoPor?: string;
  dataValidacao?: Date;
  observacoes?: string;
  documentosAnalisados: string[];
  criteriosAtendidos: CriterioValidacao[];
}

export interface CriterioValidacao {
  criterio: string;
  atendido: boolean;
  observacoes?: string;
}

export interface ResultadoCompensacao {
  sucesso: boolean;
  valorCompensado: number;
  valorEconomizado: number;
  creditosUtilizados: number;
  debitosCompensados: number;

  // Detalhes por item
  creditosProcessados: CreditoProcessado[];
  debitosProcessados: DebitoProcessado[];

  // Informações adicionais
  protocoloCompensacao: string;
  dataEfetivacao: Date;
  orgaosEnvolvidos: string[];

  // Possíveis problemas
  alertas: AlertaCompensacao[];
  erros: ErroCompensacao[];
}

export interface CreditoProcessado {
  creditoId: string;
  valorOriginal: number;
  valorUtilizado: number;
  statusFinal: 'UTILIZADO' | 'PARCIALMENTE_UTILIZADO' | 'NAO_UTILIZADO';
  protocoloUtilizacao?: string;
}

export interface DebitoProcessado {
  debitoId: string;
  valorOriginal: number;
  valorCompensado: number;
  statusFinal: 'COMPENSADO' | 'PARCIALMENTE_COMPENSADO' | 'NAO_COMPENSADO';
  protocoloCompensacao?: string;
}

export interface AlertaCompensacao {
  tipo: 'PRAZO' | 'VALOR' | 'DOCUMENTACAO' | 'COMPATIBILIDADE';
  severidade: 'BAIXA' | 'MEDIA' | 'ALTA';
  mensagem: string;
  recomendacao?: string;
}

export interface ErroCompensacao {
  codigo: string;
  mensagem: string;
  detalhes?: string;
  itemAfetado?: string;
  solucaoSugerida?: string;
}

export interface DocumentoCompensacao {
  id: string;
  nome: string;
  tipo: 'COMPROVANTE_CREDITO' | 'COMPROVANTE_DEBITO' | 'PROCURACAO' | 'DECLARACAO' | 'OUTRO';
  arquivo: string;
  tamanho: number;
  uploadEm: Date;
  uploadPor: string;
  validado: boolean;
  observacoes?: string;
}

export interface RelatorioCompensacao {
  id: string;
  tipo: 'PRELIMINAR' | 'FINAL';
  geradoEm: Date;
  geradoPor: string;

  // Resumo executivo
  resumo: {
    totalCreditos: number;
    totalDebitos: number;
    valorLiquido: number;
    economia: number;
    eficiencia: number;
  };

  // Detalhamento
  analiseCreditos: AnaliseCreditos;
  analiseDebitos: AnaliseDebitos;
  analiseCompatibilidade: AnaliseCompatibilidade;

  // Recomendações
  recomendacoes: string[];
  proximosPassos: string[];

  // Anexos
  graficos: GraficoCompensacao[];
  tabelas: TabelaCompensacao[];
}

export interface AnaliseCreditos {
  totalAnalisados: number;
  totalValidados: number;
  totalRejeitados: number;
  valorTotal: number;
  categorias: { [categoria: string]: number };
  origens: { [origem: string]: number };
  vencimentos: { [periodo: string]: number };
}

export interface AnaliseDebitos {
  totalAnalisados: number;
  totalValidados: number;
  totalRejeitados: number;
  valorTotal: number;
  orgaos: { [orgao: string]: number };
  tipos: { [tipo: string]: number };
  vencimentos: { [periodo: string]: number };
}

export interface AnaliseCompatibilidade {
  score: number;
  fatores: FatorCompatibilidade[];
  recomendacoes: string[];
}

export interface FatorCompatibilidade {
  fator: string;
  peso: number;
  valor: number;
  impacto: 'POSITIVO' | 'NEGATIVO' | 'NEUTRO';
  descricao: string;
}

export interface GraficoCompensacao {
  tipo: 'PIZZA' | 'BARRAS' | 'LINHA' | 'AREA';
  titulo: string;
  dados: any[];
  configuracao: any;
}

export interface TabelaCompensacao {
  titulo: string;
  colunas: string[];
  dados: any[][];
}

// Tipos para simulação e otimização
export interface SimulacaoCompensacao {
  id: string;
  nome: string;
  parametros: ParametrosSimulacao;
  resultados: ResultadoSimulacao[];
  melhorCenario: ResultadoSimulacao;
  criadoEm: Date;
  criadoPor: string;
}

export interface ParametrosSimulacao {
  creditosDisponiveis: string[];
  debitosDisponiveis: string[];
  prioridadeMaximizacao: 'VALOR' | 'QUANTIDADE' | 'PRAZO' | 'ECONOMIA';
  restricoes: RestricaoSimulacao[];
}

export interface RestricaoSimulacao {
  tipo: 'PRAZO' | 'VALOR_MINIMO' | 'VALOR_MAXIMO' | 'CATEGORIA' | 'ORGAO';
  valor: any;
  descricao: string;
}

export interface ResultadoSimulacao {
  cenario: string;
  valorCompensado: number;
  economia: number;
  eficiencia: number;
  creditosUtilizados: number;
  debitosCompensados: number;
  score: number;
  observacoes: string[];
}

// Tipos para estatísticas e métricas
export interface EstatisticasCompensacao {
  periodo: {
    inicio: Date;
    fim: Date;
  };

  // Volumes
  totalSolicitacoes: number;
  totalProcessadas: number;
  totalValorCompensado: number;
  totalEconomia: number;

  // Taxas
  taxaSucesso: number;
  taxaEficiencia: number;
  tempoMedioProcessamento: number;

  // Distribuições
  porCategoria: { [categoria: string]: number };
  porMes: { [mes: string]: number };
  porStatus: { [status: string]: number };

  // Comparações
  comparacaoPeriodoAnterior: {
    crescimentoVolume: number;
    crescimentoValor: number;
    melhoriaEficiencia: number;
  };
}

export interface MetricasCompensacao {
  eficiencia: number;
  velocidade: number;
  qualidade: number;
  satisfacao: number;
  economia: number;

  detalhes: {
    tempoMedioProcessamento: number;
    taxaAprovacao: number;
    valorMedioCompensacao: number;
    economiaMedia: number;
  };
}

// Filtros e buscas
export interface FiltrosCompensacao {
  status?: string[];
  tipo?: string[];
  prioridade?: string[];
  dataInicio?: Date;
  dataFim?: Date;
  valorMinimo?: number;
  valorMaximo?: number;
  solicitante?: string;
  orgaos?: string[];
  categorias?: string[];
}

export interface BuscaCompensacao {
  query: string;
  filtros: FiltrosCompensacao;
  ordenacao: {
    campo: string;
    direcao: 'ASC' | 'DESC';
  };
  paginacao: {
    pagina: number;
    limite: number;
  };
}
