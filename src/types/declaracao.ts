export type TipoDeclaracao = 
  | 'DARF'
  | 'GNRE'
  | 'GPS'
  | 'DAS';

export type StatusDeclaracao =
  | 'pendente_geracao'
  | 'gerada'
  | 'pendente_pagamento'
  | 'paga'
  | 'vencida'
  | 'cancelada';

export type TipoTributo =
  | 'ICMS'
  | 'IPI'
  | 'ISS'
  | 'PIS'
  | 'COFINS'
  | 'IRPJ'
  | 'CSLL'
  | 'INSS'
  | 'FGTS'
  | 'DAS';

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
  banco: string;
  agencia: string;
  conta: string;
  dataPagamento: string;
  valorPago: number;
  autenticacao: string;
  arquivo?: string;
}

export interface Declaracao {
  id: string;
  tipo: TipoDeclaracao;
  numero: string;
  empresaId: string;
  cnpj: string;
  periodoReferencia: string;
  dataVencimento: string;
  tributo: TipoTributo;
  baseCalculo: BaseCalculo;
  valorPrincipal: number;
  multa?: number;
  juros?: number;
  valorTotal: number;
  status: StatusDeclaracao;
  codigoBarras?: string;
  linhaDigitavel?: string;
  retificacao?: Retificacao;
  comprovante?: ComprovantePagamento;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
} 