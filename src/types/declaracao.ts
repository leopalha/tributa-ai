import { BaseStatus } from './common/status';
import {
  Periodicidade,
  NivelComplexidade,
  AnexoObrigacao,
  HistoricoObrigacao,
  ValidacaoObrigacao,
} from './obrigacao';

// Re-export types for external use
export type {
  Periodicidade,
  NivelComplexidade,
  AnexoObrigacao,
  HistoricoObrigacao,
  ValidacaoObrigacao,
};

export type TipoDeclaracao =
  | 'ICMS'
  | 'IPI'
  | 'PIS'
  | 'COFINS'
  | 'IRPJ'
  | 'CSLL'
  | 'ISS'
  | 'INSS'
  | 'FGTS'
  | 'SIMPLES';

export type StatusDeclaracao =
  | 'declaracao_rascunho'
  | 'declaracao_pendente'
  | 'declaracao_enviada'
  | 'declaracao_processando'
  | 'declaracao_aceita'
  | 'declaracao_rejeitada'
  | 'declaracao_cancelada'
  | 'declaracao_em_andamento'
  | 'declaracao_concluida'
  | 'declaracao_atrasada';

export type TipoTributo =
  | 'IRPJ'
  | 'CSLL'
  | 'PIS'
  | 'COFINS'
  | 'ICMS'
  | 'IPI'
  | 'ISS'
  | 'INSS'
  | 'FGTS'
  | 'SIMPLES'
  | 'SIMPLES_NACIONAL'
  | 'SIMPLES_NACIONAL_EXCESSO'
  | 'SIMPLES_NACIONAL_EXCESSO_SALARIO'
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA'
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA_BRUTA'
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA_BRUTA_ANUAL'
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA_BRUTA_ANUAL_ANTERIOR'
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA_BRUTA_ANUAL_ATUAL'
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA_BRUTA_ANUAL_PROJETADA'
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA_BRUTA_ANUAL_REALIZADA'
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA_BRUTA_ANUAL_ESTIMADA'
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA_BRUTA_ANUAL_PREVISTA'
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA_BRUTA_ANUAL_PROJETADA'
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA_BRUTA_ANUAL_REALIZADA'
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA_BRUTA_ANUAL_ESTIMADA'
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA_BRUTA_ANUAL_PREVISTA';

export interface BaseCalculo {
  valor: number;
  aliquota: number;
  reducao?: number;
  adicional?: number;
}

export interface Retificacao {
  id: string;
  dataRetificacao: string;
  motivo: string;
  usuario: string;
  declaracaoOriginalId: string;
}

export interface ComprovantePagamento {
  id: string;
  declaracaoId: string;
  data: string;
  valor: number;
  formaPagamento: string;
  numeroDocumento: string;
  observacoes?: string;
  arquivoUrl?: string;
}

export interface AnexoDeclaracao {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  dataUpload: string;
  usuarioId: string;
}

export interface HistoricoDeclaracao {
  id: string;
  data: string;
  status: StatusDeclaracao;
  usuario: string;
  observacoes: string;
}

export interface DeclaracaoFiltros {
  tipo?: TipoDeclaracao;
  status?: StatusDeclaracao;
  dataInicio?: string;
  dataFim?: string;
  empresaId?: string;
  responsavel?: string;
  valorMin?: number;
  valorMax?: number;
}

export interface DeclaracaoCreate {
  tipo: TipoDeclaracao;
  dataVencimento: string;
  valor: number;
  descricao?: string;
  observacoes?: string;
  responsavel?: string;
  empresaId: string;
  obrigacaoId?: string;
}

export interface DeclaracaoUpdate {
  tipo?: TipoDeclaracao;
  dataVencimento?: string;
  valor?: number;
  descricao?: string;
  observacoes?: string;
  responsavel?: string;
  obrigacaoId?: string;
}

export interface DeclaracaoEstatisticas {
  totalDeclaracoes: number;
  declaracoesPorStatus: Record<StatusDeclaracao, number>;
  declaracoesPorTipo: Record<TipoDeclaracao, number>;
  prazoMedioEntrega: number;
  taxaCumprimento: number;
}

export interface DeclaracaoPendencias {
  temPendencias: boolean;
  declaracoesPendentes: {
    id: string;
    tipo: TipoDeclaracao;
    vencimento: string;
    diasAtraso: number;
  }[];
}

export interface DeclaracaoCalendario {
  data: string;
  declaracoes: {
    id: string;
    tipo: TipoDeclaracao;
    descricao: string;
    status: StatusDeclaracao;
  }[];
}

export interface ObrigacaoFiscal {
  id: string;
  declaracaoId?: string;
  titulo: string;
  descricao: string;
  tipo: TipoDeclaracao;
  status: StatusDeclaracao;
  valor: number;
  moeda: string;
  dataVencimento: string;
  codigoTributo?: string;
  nomeTributo?: string;
  tipoTributo?: TipoTributo;
  periodoTributo?: string;
  baseCalculo?: number;
  aliquota?: number;
  valorTributo?: number;
  juros?: number;
  multa?: number;
  total?: number;
  empresaId: string;
  periodicidade: Periodicidade;
  complexidade: NivelComplexidade;
  responsavel?: string;
  anexos: AnexoObrigacao[];
  historico: HistoricoObrigacao[];
  createdAt: string;
  updatedAt: string;
}

// Declaracao interface for backward compatibility
export interface Declaracao {
  id: string;
  tipo: TipoDeclaracao;
  status: StatusDeclaracao;
  dataVencimento: string;
  valor: number;
  descricao?: string;
  observacoes?: string;
  responsavel?: string;
  empresaId: string;
  dataCriacao: string;
  dataAtualizacao: string;
  anexos: AnexoDeclaracao[];
  historico: HistoricoDeclaracao[];
}
