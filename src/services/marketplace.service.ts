import { api } from './api';
import {
  Anuncio,
  Proposta,
  Transacao,
  AvaliacaoNegociacao,
  EstatisticasMarketplace,
  StatusAnuncio,
  TipoNegociacao,
  MarketplaceItem,
  CarrinhoItem,
  Pedido,
  Avaliacao
} from '@/types/marketplace';

export interface MarketplaceFiltros {
  status?: StatusAnuncio;
  tipoNegociacao?: TipoNegociacao;
  valorMinimo?: number;
  valorMaximo?: number;
  dataPublicacaoInicio?: string;
  dataPublicacaoFim?: string;
  vendedorId?: string;
  setorAtividade?: string;
  regiao?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface MarketplacePaginado {
  items: Anuncio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class MarketplaceService {
  private static instance: MarketplaceService;
  private readonly baseUrl = '/marketplace';

  private constructor() {}

  public static getInstance(): MarketplaceService {
    if (!MarketplaceService.instance) {
      MarketplaceService.instance = new MarketplaceService();
    }
    return MarketplaceService.instance;
  }

  // Items
  async getItems(filters?: {
    categoria?: string;
    tipo?: MarketplaceItem['tipo'];
    tags?: string[];
    precoMin?: number;
    precoMax?: number;
    status?: MarketplaceItem['status'];
  }): Promise<MarketplaceItem[]> {
    return api.get<MarketplaceItem[]>(`${this.baseUrl}/items`, { params: filters });
  }

  async getItemById(id: string): Promise<MarketplaceItem> {
    return api.get<MarketplaceItem>(`${this.baseUrl}/items/${id}`);
  }

  async createItem(data: Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MarketplaceItem> {
    return api.post<MarketplaceItem>(`${this.baseUrl}/items`, data);
  }

  async updateItem(id: string, data: Partial<MarketplaceItem>): Promise<MarketplaceItem> {
    return api.put<MarketplaceItem>(`${this.baseUrl}/items/${id}`, data);
  }

  async deleteItem(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/items/${id}`);
  }

  // Carrinho
  async getCarrinho(): Promise<CarrinhoItem[]> {
    return api.get<CarrinhoItem[]>(`${this.baseUrl}/carrinho`);
  }

  async addToCarrinho(itemId: string, quantidade: number): Promise<CarrinhoItem> {
    return api.post<CarrinhoItem>(`${this.baseUrl}/carrinho`, { itemId, quantidade });
  }

  async updateCarrinhoItem(itemId: string, quantidade: number): Promise<CarrinhoItem> {
    return api.put<CarrinhoItem>(`${this.baseUrl}/carrinho/${itemId}`, { quantidade });
  }

  async removeFromCarrinho(itemId: string): Promise<void> {
    return api.delete(`${this.baseUrl}/carrinho/${itemId}`);
  }

  async clearCarrinho(): Promise<void> {
    return api.delete(`${this.baseUrl}/carrinho`);
  }

  // Pedidos
  async getPedidos(): Promise<Pedido[]> {
    return api.get<Pedido[]>(`${this.baseUrl}/pedidos`);
  }

  async getPedidoById(id: string): Promise<Pedido> {
    return api.get<Pedido>(`${this.baseUrl}/pedidos/${id}`);
  }

  async createPedido(data: {
    itens: { itemId: string; quantidade: number }[];
    enderecoEntrega?: Pedido['enderecoEntrega'];
    metodoPagamento: Pedido['metodoPagamento'];
  }): Promise<Pedido> {
    return api.post<Pedido>(`${this.baseUrl}/pedidos`, data);
  }

  async cancelPedido(id: string): Promise<Pedido> {
    return api.put<Pedido>(`${this.baseUrl}/pedidos/${id}/cancelar`);
  }

  // Avaliações
  async getAvaliacoes(itemId: string): Promise<Avaliacao[]> {
    return api.get<Avaliacao[]>(`${this.baseUrl}/items/${itemId}/avaliacoes`);
  }

  async createAvaliacao(itemId: string, data: { nota: number; comentario: string }): Promise<Avaliacao> {
    return api.post<Avaliacao>(`${this.baseUrl}/items/${itemId}/avaliacoes`, data);
  }

  async updateAvaliacao(itemId: string, avaliacaoId: string, data: { nota: number; comentario: string }): Promise<Avaliacao> {
    return api.put<Avaliacao>(`${this.baseUrl}/items/${itemId}/avaliacoes/${avaliacaoId}`, data);
  }

  async deleteAvaliacao(itemId: string, avaliacaoId: string): Promise<void> {
    return api.delete(`${this.baseUrl}/items/${itemId}/avaliacoes/${avaliacaoId}`);
  }

  // Operações de Anúncios
  public async listarAnuncios(filtros?: MarketplaceFiltros): Promise<MarketplacePaginado> {
    return api.get(`${this.baseUrl}/anuncios`, filtros);
  }

  public async obterAnuncio(id: string): Promise<Anuncio> {
    return api.get(`${this.baseUrl}/anuncios/${id}`);
  }

  public async criarAnuncio(anuncio: Omit<Anuncio, 'id' | 'createdAt' | 'updatedAt'>): Promise<Anuncio> {
    return api.post(`${this.baseUrl}/anuncios`, anuncio);
  }

  public async atualizarAnuncio(id: string, dados: Partial<Anuncio>): Promise<Anuncio> {
    return api.put(`${this.baseUrl}/anuncios/${id}`, dados);
  }

  public async excluirAnuncio(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/anuncios/${id}`);
  }

  public async destacarAnuncio(id: string, tipo: string, duracao: number): Promise<Anuncio> {
    return api.post(`${this.baseUrl}/anuncios/${id}/destaque`, { tipo, duracao });
  }

  // Operações de Propostas
  public async listarPropostas(anuncioId: string): Promise<Proposta[]> {
    return api.get(`${this.baseUrl}/anuncios/${anuncioId}/propostas`);
  }

  public async criarProposta(proposta: Omit<Proposta, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Proposta> {
    return api.post(`${this.baseUrl}/propostas`, proposta);
  }

  public async atualizarProposta(id: string, dados: Partial<Proposta>): Promise<Proposta> {
    return api.put(`${this.baseUrl}/propostas/${id}`, dados);
  }

  public async aceitarProposta(id: string): Promise<Transacao> {
    return api.post(`${this.baseUrl}/propostas/${id}/aceitar`);
  }

  public async recusarProposta(id: string, motivo: string): Promise<Proposta> {
    return api.post(`${this.baseUrl}/propostas/${id}/recusar`, { motivo });
  }

  // Operações de Transações
  public async listarTransacoes(filtros?: {
    vendedorId?: string;
    compradorId?: string;
    status?: string;
  }): Promise<Transacao[]> {
    return api.get(`${this.baseUrl}/transacoes`, filtros);
  }

  public async obterTransacao(id: string): Promise<Transacao> {
    return api.get(`${this.baseUrl}/transacoes/${id}`);
  }

  public async confirmarPagamento(id: string, comprovante: File): Promise<Transacao> {
    return api.upload(`${this.baseUrl}/transacoes/${id}/pagamento`, comprovante);
  }

  public async iniciarTransferencia(id: string): Promise<Transacao> {
    return api.post(`${this.baseUrl}/transacoes/${id}/transferencia`);
  }

  public async confirmarTransferencia(id: string, protocolo: string): Promise<Transacao> {
    return api.post(`${this.baseUrl}/transacoes/${id}/confirmar`, { protocolo });
  }

  public async cancelarTransacao(id: string, motivo: string): Promise<Transacao> {
    return api.post(`${this.baseUrl}/transacoes/${id}/cancelar`, { motivo });
  }

  public async uploadDocumento(
    transacaoId: string,
    tipo: string,
    arquivo: File,
    onProgress?: (progress: number) => void
  ): Promise<Transacao> {
    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('arquivo', arquivo);
    
    return api.upload(
      `${this.baseUrl}/transacoes/${transacaoId}/documentos`,
      arquivo,
      onProgress
    );
  }

  // Operações de Avaliação
  public async avaliarNegociacao(avaliacao: Omit<AvaliacaoNegociacao, 'id' | 'createdAt'>): Promise<AvaliacaoNegociacao> {
    return api.post(`${this.baseUrl}/avaliacoes`, avaliacao);
  }

  public async obterAvaliacoes(filtros: {
    transacaoId?: string;
    avaliadorId?: string;
    tipo?: 'vendedor' | 'comprador';
  }): Promise<AvaliacaoNegociacao[]> {
    return api.get(`${this.baseUrl}/avaliacoes`, filtros);
  }

  // Operações de Estatísticas
  public async obterEstatisticas(filtros?: {
    dataInicio?: string;
    dataFim?: string;
    vendedorId?: string;
    compradorId?: string;
  }): Promise<EstatisticasMarketplace> {
    return api.get(`${this.baseUrl}/estatisticas`, filtros);
  }

  public async obterRecomendacoes(tcId: string): Promise<{
    valorSugerido: number;
    descontoSugerido: number;
    tempoEstimadoVenda: number;
    compradorePotenciais: {
      id: string;
      nome: string;
      compatibilidade: number;
      motivoCompatibilidade: string[];
    }[];
  }> {
    return api.get(`${this.baseUrl}/recomendacoes/${tcId}`);
  }

  public async verificarElegibilidade(tcId: string): Promise<{
    elegivel: boolean;
    motivos: string[];
    restricoes: string[];
    documentosNecessarios: string[];
  }> {
    return api.get(`${this.baseUrl}/elegibilidade/${tcId}`);
  }

  public async simularNegociacao(dados: {
    tcId: string;
    valor: number;
    tipoNegociacao: TipoNegociacao;
    condicoes?: Record<string, unknown>;
  }): Promise<{
    custos: Record<string, number>;
    impostos: Record<string, number>;
    valorLiquido: number;
    tempoEstimado: number;
    riscos: string[];
  }> {
    return api.post(`${this.baseUrl}/simular`, dados);
  }
}

export const marketplaceService = MarketplaceService.getInstance(); 