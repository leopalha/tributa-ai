import { api } from './api';
import { API_CONFIG } from '@/config/api.config';
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
  Avaliacao,
} from '@/types/marketplace';
import { Prisma } from '@prisma/client';

// Interfaces adicionais
interface ListagemMarketplace {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  categoria: string;
  tipo: string;
  status: 'ativa' | 'pausada' | 'vendida' | 'cancelada';
  visualizacoes: number;
  favoritado: number;
  criadoEm: Date;
  atualizadoEm: Date;
  tcId?: string;
  precoVenda?: number;
}

interface OfertaMarketplace {
  id: string;
  listagemId: string;
  valor: number;
  mensagem?: string;
  status: 'pendente' | 'aceita' | 'rejeitada';
  criadaEm: Date;
  compradorId?: string;
}

interface TransacaoMarketplace {
  id: string;
  listagemId: string;
  ofertaId: string;
  valor: number;
  status: 'pendente' | 'concluida' | 'cancelada';
  criadaEm: Date;
  vendedorId?: string;
}

interface FiltrosMarketplace {
  categoria?: string;
  tipo?: string;
  valorMin?: number;
  valorMax?: number;
  status?: string;
  precoMinimo?: number;
  precoMaximo?: number;
}

interface ResultadoBusca<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

interface ParametrosBusca {
  query?: string;
  filtros?: FiltrosMarketplace;
  ordenacao?: string;
  page?: number;
  limit?: number;
}

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

// Interface para tokenização
export interface TokenizacaoRequest {
  creditTitleId: string;
}

export interface TokenInfo {
  tokenId: string;
  ownerId: string;
  status: string;
  blockchain: string;
  createdAt: string;
  txId: string;
  explorerUrl?: string;
}

export class MarketplaceService {
  private static instance: MarketplaceService;
  private api = api;
  private baseUrl = '/api/marketplace';

  private constructor() {}

  public static getInstance(): MarketplaceService {
    if (!MarketplaceService.instance) {
      MarketplaceService.instance = new MarketplaceService();
    }
    return MarketplaceService.instance;
  }

  // Métodos de tokenização
  async tokenizarCredito(data: { creditTitleId: string }): Promise<TokenInfo> {
    return api.post<TokenInfo>('/marketplace/tokenizar', data);
  }

  async verificarStatusToken(
    tokenId: string
  ): Promise<{ status: string; owner: string; lastUpdated: string }> {
    return api.get<{ status: string; owner: string; lastUpdated: string }>(
      `/marketplace/token/${tokenId}/status`
    );
  }

  async transferirToken(
    tokenId: string,
    novoDonoId: string
  ): Promise<{ success: boolean; txId: string }> {
    return api.post<{ success: boolean; txId: string }>(
      `/marketplace/token/${tokenId}/transferir`,
      { novoDonoId }
    );
  }

  async listarTokensUsuario(userId: string): Promise<TokenInfo[]> {
    return api.get<TokenInfo[]>(`/marketplace/tokens/usuario/${userId}`);
  }

  async obterHistoricoToken(tokenId: string): Promise<Prisma.JsonValue[]> {
    return api.get<Prisma.JsonValue[]>(`/marketplace/token/${tokenId}/historico`);
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
    return api.get<MarketplaceItem[]>('/marketplace/items', { params: filters });
  }

  async getItemById(id: string): Promise<MarketplaceItem> {
    return api.get<MarketplaceItem>(`/marketplace/items/${id}`);
  }

  async createItem(
    data: Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<MarketplaceItem> {
    return api.post<MarketplaceItem>('/marketplace/items', data);
  }

  async updateItem(id: string, data: Partial<MarketplaceItem>): Promise<MarketplaceItem> {
    return api.put<MarketplaceItem>(`/marketplace/items/${id}`, data);
  }

  async deleteItem(id: string): Promise<void> {
    return api.delete(`/marketplace/items/${id}`);
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

  async createAvaliacao(
    itemId: string,
    data: { nota: number; comentario: string }
  ): Promise<Avaliacao> {
    return api.post<Avaliacao>(`${this.baseUrl}/items/${itemId}/avaliacoes`, data);
  }

  async updateAvaliacao(
    itemId: string,
    avaliacaoId: string,
    data: { nota: number; comentario: string }
  ): Promise<Avaliacao> {
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

  public async criarAnuncio(
    anuncio: Omit<Anuncio, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Anuncio> {
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

  public async criarProposta(
    proposta: Omit<Proposta, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<Proposta> {
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
    const formData = new FormData();
    formData.append('comprovante', comprovante);
    return api.upload(`${this.baseUrl}/transacoes/${id}/pagamento`, formData);
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

    return api.upload(`${this.baseUrl}/transacoes/${transacaoId}/documentos`, formData, onProgress);
  }

  // Operações de Avaliação
  public async avaliarNegociacao(
    avaliacao: Omit<AvaliacaoNegociacao, 'id' | 'createdAt'>
  ): Promise<AvaliacaoNegociacao> {
    return api.post(`${this.baseUrl}/avaliacoes`, avaliacao);
  }

  public async obterAvaliacoes(filtros: {
    transacaoId?: string;
    avaliadorId?: string;
    tipo?: 'vendedor' | 'comprador';
  }): Promise<AvaliacaoNegociacao[]> {
    return api.get(`${this.baseUrl}/avaliacoes`, filtros);
  }

  // Operações de Estatísticas (removido - método duplicado estava causando erro)

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

  // Listagens
  async criarListagem(
    dados: Omit<ListagemMarketplace, 'id' | 'criadoEm' | 'atualizadoEm'>
  ): Promise<ListagemMarketplace> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        // Criar listagem mockada
        const novaListagem: ListagemMarketplace = {
          ...dados,
          id: `list-${Date.now()}`,
          status: 'ativa',
          visualizacoes: 0,
          favoritado: 0,
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        };
        return novaListagem;
      }

      const response = await this.api.post<ListagemMarketplace>(
        API_CONFIG.ENDPOINTS.MARKETPLACE.CREATE_LISTING,
        dados
      );
      return response;
    } catch (error) {
      console.error('Erro ao criar listagem:', error);
      throw new Error('Falha ao criar listagem no marketplace');
    }
  }

  async obterListagem(id: string): Promise<ListagemMarketplace | null> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        return this.mockObterListagem(id);
      }

      const response = await this.api.get<ListagemMarketplace>(
        API_CONFIG.ENDPOINTS.MARKETPLACE.GET_LISTING(id)
      );
      return response;
    } catch (error) {
      console.error('Erro ao obter listagem:', error);
      return null;
    }
  }

  async listarListagens(
    filtros?: FiltrosMarketplace
  ): Promise<ResultadoBusca<ListagemMarketplace>> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        return this.mockListarListagens(filtros);
      }

      const response = await this.api.get<ResultadoBusca<ListagemMarketplace>>(
        API_CONFIG.ENDPOINTS.MARKETPLACE.LISTINGS,
        filtros
      );
      return response;
    } catch (error) {
      console.error('Erro ao listar listagens:', error);
      throw new Error('Falha ao listar listagens do marketplace');
    }
  }

  async atualizarListagem(
    id: string,
    dados: Partial<ListagemMarketplace>
  ): Promise<ListagemMarketplace> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        const listagem = await this.obterListagem(id);
        if (!listagem) throw new Error('Listagem não encontrada');

        return {
          ...listagem,
          ...dados,
          atualizadoEm: new Date(),
        };
      }

      const response = await this.api.patch<ListagemMarketplace>(
        API_CONFIG.ENDPOINTS.MARKETPLACE.UPDATE_LISTING(id),
        dados
      );
      return response;
    } catch (error) {
      console.error('Erro ao atualizar listagem:', error);
      throw new Error('Falha ao atualizar listagem');
    }
  }

  // Ofertas
  async fazerOferta(
    listagemId: string,
    oferta: Omit<OfertaMarketplace, 'id' | 'criadaEm' | 'status'>
  ): Promise<OfertaMarketplace> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        const novaOferta: OfertaMarketplace = {
          ...oferta,
          id: `offer-${Date.now()}`,
          listagemId,
          status: 'pendente',
          criadaEm: new Date(),
        };
        return novaOferta;
      }

      const response = await this.api.post<OfertaMarketplace>(
        API_CONFIG.ENDPOINTS.MARKETPLACE.PLACE_BID(listagemId),
        oferta
      );
      return response;
    } catch (error) {
      console.error('Erro ao fazer oferta:', error);
      throw new Error('Falha ao fazer oferta');
    }
  }

  async obterOfertas(listagemId: string): Promise<OfertaMarketplace[]> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        return this.mockObterOfertas(listagemId);
      }

      const response = await this.api.get<OfertaMarketplace[]>(
        API_CONFIG.ENDPOINTS.MARKETPLACE.GET_BIDS(listagemId)
      );
      return response;
    } catch (error) {
      console.error('Erro ao obter ofertas:', error);
      return [];
    }
  }

  async aceitarOferta(listagemId: string, ofertaId: string): Promise<TransacaoMarketplace> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        return this.mockProcessarTransacao(listagemId, ofertaId);
      }

      const response = await this.api.post<TransacaoMarketplace>(
        API_CONFIG.ENDPOINTS.MARKETPLACE.ACCEPT_BID(listagemId, ofertaId)
      );
      return response;
    } catch (error) {
      console.error('Erro ao aceitar oferta:', error);
      throw new Error('Falha ao aceitar oferta');
    }
  }

  async rejeitarOferta(listagemId: string, ofertaId: string, motivo?: string): Promise<void> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        // Simular rejeição
        console.log(`Oferta ${ofertaId} rejeitada`);
        return;
      }

      await this.api.post(API_CONFIG.ENDPOINTS.MARKETPLACE.REJECT_BID(listagemId, ofertaId), {
        motivo,
      });
    } catch (error) {
      console.error('Erro ao rejeitar oferta:', error);
      throw new Error('Falha ao rejeitar oferta');
    }
  }

  // Busca e filtros
  async buscarListagens(parametros: ParametrosBusca): Promise<ResultadoBusca<ListagemMarketplace>> {
    try {
      if (API_CONFIG.USE_MOCK_DATA) {
        return this.mockBuscarListagens(parametros);
      }

      const response = await this.api.post<ResultadoBusca<ListagemMarketplace>>(
        API_CONFIG.ENDPOINTS.MARKETPLACE.SEARCH,
        parametros
      );
      return response;
    } catch (error) {
      console.error('Erro ao buscar listagens:', error);
      throw new Error('Falha ao buscar listagens');
    }
  }

  // Estatísticas
  async obterEstatisticas(): Promise<EstatisticasMarketplace> {
    try {
      // Fazer chamada para o backend primeiro
      const response = await fetch('http://localhost:3001/marketplace/stats');

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return {
            volumeTotal: data.data.volumeTotal || 125000000,
            numeroTransacoes: data.data.transacoesHoje || 23,
            tcsAtivos: data.data.totalAnuncios || 156,
            precoMedio: data.data.tendencias?.precoMedio * 1000000 || 850000,
            volumeDiario: data.data.volumeMensal / 30 || 2100000,
            tendenciaPreco: data.data.tendencias?.crescimentoSemanal > 0 ? 'alta' : 'baixa',
          };
        }
      }

      // Fallback para dados mock se a API falhar
      return {
        volumeTotal: 125000000,
        numeroTransacoes: 23,
        tcsAtivos: 156,
        precoMedio: 850000,
        volumeDiario: 2100000,
        tendenciaPreco: 'alta' as const,
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);

      // Retornar dados mock em caso de erro
      return {
        volumeTotal: 125000000,
        numeroTransacoes: 23,
        tcsAtivos: 156,
        precoMedio: 850000,
        volumeDiario: 2100000,
        tendenciaPreco: 'alta' as const,
      };
    }
  }

  // Métodos de mock para desenvolvimento
  private mockObterListagem(id: string): ListagemMarketplace {
    return {
      id,
      titulo: 'Crédito ICMS - Janeiro 2024',
      descricao: 'Crédito tributário de ICMS disponível para compensação',
      valor: 150000,
      categoria: 'titulo-credito',
      tipo: 'tributario',
      status: 'ativa',
      tcId: 'tc-001',
      precoVenda: 150000,
      visualizacoes: 45,
      favoritado: 8,
      criadoEm: new Date('2024-01-15'),
      atualizadoEm: new Date('2024-01-15'),
    };
  }

  private mockListarListagens(filtros?: FiltrosMarketplace): ResultadoBusca<ListagemMarketplace> {
    const listagens = [
      this.mockObterListagem('list-001'),
      this.mockObterListagem('list-002'),
      this.mockObterListagem('list-003'),
    ];

    return {
      items: listagens,
      total: listagens.length,
      page: 1,
      limit: 10,
    };
  }

  private mockObterOfertas(listagemId: string): OfertaMarketplace[] {
    return [
      {
        id: 'offer-001',
        listagemId,
        valor: 140000,
        mensagem: 'Interessado no título',
        status: 'pendente',
        criadaEm: new Date(),
        compradorId: 'empresa-001',
      },
      {
        id: 'offer-002',
        listagemId,
        valor: 145000,
        status: 'pendente',
        criadaEm: new Date(),
        compradorId: 'empresa-002',
      },
    ];
  }

  private mockProcessarTransacao(listagemId: string, ofertaId: string): TransacaoMarketplace {
    return {
      id: `trans-${Date.now()}`,
      listagemId,
      ofertaId,
      valor: 145000,
      status: 'pendente',
      criadaEm: new Date(),
      vendedorId: 'empresa-001',
    };
  }

  private mockBuscarListagens(parametros: ParametrosBusca): ResultadoBusca<ListagemMarketplace> {
    const listagens = [this.mockObterListagem('list-001'), this.mockObterListagem('list-002')];

    const page = parametros.page || 1;
    const limit = parametros.limit || 10;
    const inicio = (page - 1) * limit;
    const fim = inicio + limit;

    return {
      items: listagens.slice(inicio, fim),
      total: listagens.length,
      page,
      limit,
    };
  }
}

export const marketplaceService = MarketplaceService.getInstance();
