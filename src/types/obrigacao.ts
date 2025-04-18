export type TipoObrigacao = 
  | 'DCTF' 
  | 'EFD_CONTRIBUICOES' 
  | 'EFD_ICMS_IPI' 
  | 'ECD' 
  | 'ECF' 
  | 'SPED_FISCAL' 
  | 'GIA' 
  | 'DEFIS' 
  | 'PGDAS';

export type StatusObrigacao = 
  | 'pendente'
  | 'em_andamento'
  | 'concluida'
  | 'atrasada'
  | 'dispensada'
  | 'cancelada';

export type Periodicidade = 
  | 'mensal'
  | 'trimestral'
  | 'semestral'
  | 'anual';

export type NivelComplexidade = 
  | 'baixa'
  | 'media'
  | 'alta';

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
  status: StatusObrigacao;
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

export type ObrigacaoStatus = 'pendente' | 'em_andamento' | 'concluida' | 'atrasada';

export interface Obrigacao {
  id: string;
  nome: string;
  descricao: string;
  status: ObrigacaoStatus;
  dataVencimento: string;
  dataConclusao?: string;
  empresaId: string;
  valor?: number;
  observacoes?: string;
  documentos?: {
    id: string;
    nome: string;
    url: string;
  }[];
  tipo: string;
  periodicidade: string;
  periodoReferencia: string;
  dataProrrogacao?: string;
  complexidade: string;
  responsavel?: string;
  anexos: {
    id: string;
    nome: string;
    url: string;
    tipo: string;
  }[];
  historico: {
    id: string;
    data: string;
    status: ObrigacaoStatus;
    observacao: string;
    usuario: string;
  }[];
} 