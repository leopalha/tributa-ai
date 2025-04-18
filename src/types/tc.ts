"use strict";

// Status Types
export type StatusTitulo = 'pendente' | 'validado' | 'em_negociação' | 'vendido' | 'compensado' | 'cancelado';
export type StatusTransacao = 'pendente' | 'concluída' | 'cancelada' | 'rejeitada';

// Title Types
export type TipoTitulo =
  | 'precatório'
  | 'honorários'
  | 'contrato_extrajudicial'
  | 'excedente_tributário'
  | 'crédito_tributário'
  | 'outros';

// Transaction Types
export type TipoTransacao = 'compensação' | 'transferência' | 'venda' | 'cancelamento';

// Main Interfaces
export interface TituloDeCredito {
  id: string;
  numeroTitulo: string;
  tipoTitulo: TipoTitulo;
  valorOriginal: number;
  valorDisponivel: number;
  dataEmissão: string;
  dataVencimento: string;
  statusTitulo: StatusTitulo;
  descricao?: string;
  documentos: string[];
  restricoes?: string[];
  garantias?: {
    tipo: string;
    descricao: string;
    valor: number;
  }[];
  historico?: {
    data: string;
    evento: string;
    descricao: string;
  }[];
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface Transacao {
  id: string;
  tipo: TipoTransacao;
  tituloId: string;
  valorTotal: number;
  valorDesconto: number;
  valorLiquido: number;
  comprador?: {
    id: string;
    nome: string;
    documento: string;
  };
  vendedor?: {
    id: string;
    nome: string;
    documento: string;
  };
  dataTransacao: Date;
  status: StatusTransacao;
  detalhesCompensacao?: {
    tipoTributo: string;
    numeroDebito?: string;
    valorDebito: number;
    dataVencimento: Date;
  };
}

// Filter and Form Interfaces
export interface FiltrosTitulo {
  tipoTitulo?: TipoTitulo;
  statusTitulo?: StatusTitulo;
  origem?: string;
  dataInicio?: string;
  dataFim?: string;
  valorMinimo?: number;
  valorMaximo?: number;
}

export interface FormularioTitulo {
  tipoTitulo: TipoTitulo;
  valorTotal: number;
  emissor: string;
  origemCredito: string;
  tipoTributo: string;
  processoAdministrativo?: string;
  processoJudicial?: string;
  documentos: File[];
}

// Pagination Interface
export interface TitulosPaginados {
  itens: TituloDeCredito[];
  total: number;
  pagina: number;
  porPagina: number;
}

// Keeping old interfaces for backward compatibility
export type TCStatus = StatusTitulo;
export type TCTransactionStatus = StatusTransacao;
export type TCTitleType = TipoTitulo;
export type TCTransactionType = TipoTransacao;
export type TCTitle = TituloDeCredito;
export type TCTransaction = Transacao;
export type TCFilters = FiltrosTitulo;
export type TCFormData = FormularioTitulo;
export type TCPaginated = TitulosPaginados;