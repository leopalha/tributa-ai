import { BaseStatus } from './common/status';

export type TipoObrigacaoFiscal =
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
  | 'declaracao_pendente'
  | 'declaracao_em_andamento'
  | 'declaracao_concluida'
  | 'declaracao_atrasada'
  | 'declaracao_cancelada';

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
  | 'SIMPLES_NACIONAL_EXCESSO_RECEITA_BRUTA_ANUAL_PREVISTA';

export type Periodicidade = 'mensal' | 'trimestral' | 'semestral' | 'anual';

export type NivelComplexidade = 'baixa' | 'media' | 'alta';

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
  obrigacaoOriginalId: string;
}

export interface ComprovantePagamento {
  id: string;
  obrigacaoId: string;
  data: string;
  valor: number;
  formaPagamento: string;
  numeroDocumento: string;
  observacoes?: string;
  arquivoUrl?: string;
}

export interface AnexoObrigacao {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  dataUpload: string;
}

export interface HistoricoObrigacao {
  id: string;
  data: string;
  status: StatusDeclaracao;
  descricao: string;
  usuario: string;
}

export interface ValidacaoObrigacao {
  id: string;
  tipo: 'aviso' | 'erro' | 'info';
  mensagem: string;
  campo?: string;
  valor?: string;
  regraValidacao?: string;
}

export interface ObrigacaoFiscal {
  id: string;
  tipo: TipoObrigacaoFiscal;
  status: StatusDeclaracao;
  dataVencimento: string;
  valor: number;
  descricao?: string;
  observacoes?: string;
  responsavel?: string;
  empresaId: string;
  obrigacaoId?: string;
  anexos?: AnexoObrigacao[];
  historico?: HistoricoObrigacao[];
  createdAt: string;
  updatedAt: string;
}

export interface AnexoObrigacao {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  dataUpload: string;
  usuarioId: string;
}

export interface HistoricoObrigacao {
  id: string;
  data: string;
  status: StatusDeclaracao;
  usuario: string;
  observacoes: string;
}

export interface ObrigacaoFiscalFiltros {
  tipo?: TipoObrigacaoFiscal;
  status?: StatusDeclaracao;
  dataInicio?: string;
  dataFim?: string;
  empresaId?: string;
  responsavel?: string;
  valorMin?: number;
  valorMax?: number;
  searchTerm?: string;
}

export interface ObrigacaoFiscalCreate {
  tipo: TipoObrigacaoFiscal;
  dataVencimento: string;
  valor: number;
  descricao?: string;
  observacoes?: string;
  responsavel?: string;
  empresaId: string;
  obrigacaoId?: string;
}

export interface ObrigacaoFiscalUpdate {
  tipo?: TipoObrigacaoFiscal;
  dataVencimento?: string;
  valor?: number;
  descricao?: string;
  observacoes?: string;
  responsavel?: string;
  obrigacaoId?: string;
}

export interface ObrigacaoFiscalEstatisticas {
  totalObrigacoes: number;
  obrigacoesPorStatus: Record<StatusDeclaracao, number>;
  obrigacoesPorTipo: Record<TipoObrigacaoFiscal, number>;
  prazoMedioEntrega: number;
  taxaCumprimento: number;
}

export interface ObrigacaoFiscalPendencias {
  temPendencias: boolean;
  obrigacoesPendentes: {
    id: string;
    tipo: TipoObrigacaoFiscal;
    vencimento: string;
    diasAtraso: number;
  }[];
}

export interface ObrigacaoFiscalCalendario {
  data: string;
  obrigacoes: {
    tipo: TipoObrigacaoFiscal;
    descricao: string;
    status: StatusDeclaracao;
  }[];
}
