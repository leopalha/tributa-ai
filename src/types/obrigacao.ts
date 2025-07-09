import { StatusObrigacao } from './common/status';

export type TipoObrigacao =
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

export type Periodicidade = 'mensal' | 'trimestral' | 'semestral' | 'anual';

export type NivelComplexidade = 'baixa' | 'media' | 'alta';

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
  status: StatusObrigacao;
  data: string;
  usuario: string;
  observacao?: string;
}

export interface ValidacaoObrigacao {
  id: string;
  tipo: 'aviso' | 'erro' | 'info';
  mensagem: string;
  campo?: string;
  valor?: string;
  regraValidacao?: string;
}

export interface Obrigacao {
  id: string;
  tipo: TipoObrigacao;
  status: StatusObrigacao;
  dataVencimento: string;
  valor: number;
  descricao?: string;
  observacoes?: string;
  responsavel?: string;
  empresaId: string;
  dataCriacao: string;
  dataAtualizacao: string;
  dataConclusao?: string;
  dataDispensa?: string;
  motivoDispensa?: string;
  anexos: AnexoObrigacao[];
  historico: HistoricoObrigacao[];
}

export interface ObrigacaoFiltros {
  tipo?: TipoObrigacao;
  status?: StatusObrigacao;
  dataInicio?: string;
  dataFim?: string;
  empresaId?: string;
  responsavel?: string;
}

export interface ObrigacaoCreate {
  tipo: TipoObrigacao;
  dataVencimento: string;
  valor: number;
  descricao?: string;
  observacoes?: string;
  responsavel?: string;
  empresaId: string;
}

export interface ObrigacaoUpdate {
  tipo?: TipoObrigacao;
  dataVencimento?: string;
  valor?: number;
  descricao?: string;
  observacoes?: string;
  responsavel?: string;
}

export interface ObrigacaoEstatisticas {
  total: number;
  porStatus: Record<StatusObrigacao, number>;
  porTipo: Record<TipoObrigacao, number>;
  valorTotal: number;
  valorPendente: number;
  valorPago: number;
}

export interface ObrigacaoPendencias {
  total: number;
  atrasadas: number;
  proximas: number;
  obrigacoes: Obrigacao[];
}

export interface ObrigacaoCalendario {
  mes: number;
  ano: number;
  obrigacoes: Array<{
    data: string;
    obrigacoes: Obrigacao[];
  }>;
}

// Aliases for backward compatibility
export type ObrigacaoStatus = StatusObrigacao;
