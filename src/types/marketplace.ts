import { TipoTitulo, TCStatus } from './tc';

export type OrigemTC = TipoTitulo;
export type StatusAnuncio = 'ativo' | 'pausado' | 'finalizado' | 'expirado';
export type TipoNegociacao = 'venda' | 'compensacao';
export type StatusProposta = 'pendente' | 'aceita' | 'rejeitada' | 'cancelada';
export type StatusTransacao = 'pendente' | 'concluida' | 'cancelada' | 'rejeitada';
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
    dataEmissao: string;
    dataVencimento: string;
    status: TCStatus;
  };
  vendedorId: string;
  titulo: string;
  descricao: string;
  valorOriginal: number;
  valorMinimo: number;
  valorSugerido: number;
  tipoNegociacao: TipoNegociacao;
  status: StatusAnuncio;
  dataPublicacao: string;
  dataExpiracao: string;
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
}

export interface Proposta {
  id: string;
  anuncioId: string;
  compradorId: string;
  valor: number;
  tipo: TipoNegociacao;
  status: StatusProposta;
  dataCriacao: string;
  dataAtualizacao: string;
  mensagem?: string;
  documentos?: string[];
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

export interface EstatisticasMarketplace {
  totalAnuncios: number;
  totalPropostas: number;
  totalTransacoes: number;
  valorTotalTransacionado: number;
  distribuicaoPorTipo: Record<TipoTitulo, number>;
  distribuicaoPorStatus: Record<TCStatus, number>;
  distribuicaoPorOrigem: Record<OrigemTC, number>;
  mediaValorAnuncio: number;
  mediaValorProposta: number;
  taxaSucesso: number;
}
