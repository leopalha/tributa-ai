import { BaseStatus } from './common/status';

export type StatusTransacao =
  | 'transacao_pendente'
  | 'transacao_concluida'
  | 'transacao_erro'
  | 'transacao_cancelada';

export interface Transacao {
  id: string;
  tipo: 'CREDITO' | 'DEBITO';
  status: StatusTransacao;
  valor: number;
  dataTransacao: Date;
  dataProcessamento?: Date;
  descricao: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransacaoFiltros {
  tipo?: 'CREDITO' | 'DEBITO';
  status?: StatusTransacao;
  dataInicio?: Date;
  dataFim?: Date;
  valorMin?: number;
  valorMax?: number;
}

export interface TransacaoCreate {
  tipo: 'CREDITO' | 'DEBITO';
  valor: number;
  dataTransacao: Date;
  descricao: string;
  observacoes?: string;
}

export interface TransacaoUpdate {
  status?: StatusTransacao;
  dataProcessamento?: Date;
  observacoes?: string;
}
