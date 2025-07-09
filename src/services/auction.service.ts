import { api } from './api';
import { TCType, AuctionType } from './tokenization-service';

export enum BidStatus {
  ACTIVE = 'ACTIVE',
  OUTBID = 'OUTBID',
  WINNING = 'WINNING',
  WON = 'WON',
  LOST = 'LOST',
  CANCELLED = 'CANCELLED',
}

export enum AuctionStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  ENDING_SOON = 'ENDING_SOON', // últimos 5 minutos
  ENDED = 'ENDED',
  SETTLED = 'SETTLED',
  CANCELLED = 'CANCELLED',
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  quantity: number;
  timestamp: Date;
  status: BidStatus;
  isWinning: boolean;
  signature?: string;
}

export interface AuctionDetails {
  id: string;
  tcId: string;
  type: AuctionType;
  title: string;
  description: string;

  // Valores
  startingPrice: number;
  currentPrice: number;
  reservePrice?: number;
  minimumBid: number;
  bidIncrement: number;

  // Timing
  startTime: Date;
  endTime: Date;
  timeRemaining: number; // em segundos
  status: AuctionStatus;

  // Participação
  totalBids: number;
  totalBidders: number;
  winningBid?: AuctionBid;
  recentBids: AuctionBid[];

  // Configurações
  allowedBidders: 'PUBLIC' | 'QUALIFIED' | 'ACCREDITED';
  autoExtension: boolean; // estende se bid nos últimos minutos
  extensionTime: number; // tempo de extensão em minutos

  // Metadados
  createdBy: string;
  category: string;
  tags: string[];
}

export interface CreateAuctionRequest {
  tcId: string;
  type: AuctionType;
  startingPrice: number;
  reservePrice?: number;
  duration: number; // em horas
  minimumBid?: number;
  bidIncrement?: number;
  allowedBidders?: 'PUBLIC' | 'QUALIFIED' | 'ACCREDITED';
  autoExtension?: boolean;
  extensionTime?: number;
  scheduledStart?: Date;
}

export interface PlaceBidRequest {
  auctionId: string;
  amount: number;
  quantity?: number;
  maxAutoBid?: number; // para proxy bidding
}

export interface AuctionListFilters {
  type?: AuctionType;
  status?: AuctionStatus;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  endingSoon?: boolean; // próximas 24h
  search?: string;
  page?: number;
  limit?: number;
}

class AuctionService {
  private baseURL = '/api/auctions';

  // Criar novo leilão
  async createAuction(request: CreateAuctionRequest): Promise<AuctionDetails> {
    try {
      const response = await api.post<AuctionDetails>(`${this.baseURL}/create`, request);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar leilão:', error);

      // Mock para demonstração
      return this.createMockAuction(request);
    }
  }

  // Listar leilões ativos
  async listAuctions(filters?: AuctionListFilters): Promise<{
    data: AuctionDetails[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await api.get(`${this.baseURL}/list?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar leilões:', error);

      // Fallback com dados mock
      return this.getMockAuctions(filters);
    }
  }

  // Obter detalhes de um leilão
  async getAuctionDetails(auctionId: string): Promise<AuctionDetails> {
    try {
      const response = await api.get<AuctionDetails>(`${this.baseURL}/${auctionId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter detalhes do leilão:', error);

      // Retorna mock se não encontrar
      const mockAuctions = this.getMockAuctions();
      const auction = mockAuctions.data.find(a => a.id === auctionId);
      if (auction) return auction;

      throw new Error('Leilão não encontrado');
    }
  }

  // Fazer lance
  async placeBid(request: PlaceBidRequest): Promise<AuctionBid> {
    try {
      const response = await api.post<AuctionBid>(`${this.baseURL}/${request.auctionId}/bid`, {
        amount: request.amount,
        quantity: request.quantity || 1,
        maxAutoBid: request.maxAutoBid,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer lance:', error);

      // Mock para demonstração
      return {
        id: `bid_${Date.now()}`,
        auctionId: request.auctionId,
        bidderId: 'current_user',
        bidderName: 'Usuário Atual',
        amount: request.amount,
        quantity: request.quantity || 1,
        timestamp: new Date(),
        status: BidStatus.ACTIVE,
        isWinning: true,
      };
    }
  }

  // Obter histórico de lances
  async getBidHistory(auctionId: string): Promise<AuctionBid[]> {
    try {
      const response = await api.get<AuctionBid[]>(`${this.baseURL}/${auctionId}/bids`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter histórico de lances:', error);
      return this.getMockBidHistory(auctionId);
    }
  }

  // Cancelar lance (se permitido)
  async cancelBid(bidId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`${this.baseURL}/bids/${bidId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar lance:', error);
      throw new Error('Não foi possível cancelar o lance');
    }
  }

  // Configurar proxy bid (lance automático)
  async setProxyBid(auctionId: string, maxAmount: number): Promise<{ success: boolean }> {
    try {
      const response = await api.post(`${this.baseURL}/${auctionId}/proxy-bid`, {
        maxAmount,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao configurar proxy bid:', error);
      throw new Error('Não foi possível configurar lance automático');
    }
  }

  // Obter leilões que estão terminando em breve
  async getEndingSoonAuctions(): Promise<AuctionDetails[]> {
    try {
      const response = await api.get(`${this.baseURL}/ending-soon`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter leilões terminando:', error);
      return this.getMockEndingSoonAuctions();
    }
  }

  // Obter estatísticas de leilões
  async getAuctionStats(): Promise<{
    totalAuctions: number;
    activeAuctions: number;
    totalVolume: number;
    averageBids: number;
    successRate: number;
    topCategories: Array<{ category: string; count: number; volume: number }>;
  }> {
    try {
      const response = await api.get(`${this.baseURL}/stats`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return this.getMockAuctionStats();
    }
  }

  // Métodos privados para dados mock
  private createMockAuction(request: CreateAuctionRequest): AuctionDetails {
    const now = new Date();
    const startTime = request.scheduledStart || now;
    const endTime = new Date(startTime.getTime() + request.duration * 60 * 60 * 1000);

    return {
      id: `auction_${Date.now()}`,
      tcId: request.tcId,
      type: request.type,
      title: `Leilão ${this.getAuctionTypeName(request.type)} - TC ${request.tcId}`,
      description: 'Leilão criado via marketplace Tributa.AI',
      startingPrice: request.startingPrice,
      currentPrice: request.startingPrice,
      reservePrice: request.reservePrice,
      minimumBid: request.minimumBid || request.startingPrice * 0.05,
      bidIncrement: request.bidIncrement || request.startingPrice * 0.01,
      startTime,
      endTime,
      timeRemaining: Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000)),
      status: now >= startTime ? AuctionStatus.ACTIVE : AuctionStatus.SCHEDULED,
      totalBids: 0,
      totalBidders: 0,
      recentBids: [],
      allowedBidders: request.allowedBidders || 'PUBLIC',
      autoExtension: request.autoExtension || false,
      extensionTime: request.extensionTime || 5,
      createdBy: 'current_user',
      category: 'Tributário',
      tags: ['novo', 'destaque'],
    };
  }

  private getAuctionTypeName(type: AuctionType): string {
    const names = {
      [AuctionType.TRADITIONAL]: 'Tradicional',
      [AuctionType.REVERSE]: 'Reverso',
      [AuctionType.DUTCH]: 'Holandês',
      [AuctionType.FIXED_PRICE]: 'Preço Fixo',
    };
    return names[type] || type;
  }

  private getMockAuctions(filters?: AuctionListFilters): {
    data: AuctionDetails[];
    total: number;
    page: number;
    limit: number;
  } {
    const now = new Date();

    const mockAuctions: AuctionDetails[] = [
      {
        id: 'auction_001',
        tcId: 'TT-2024-001',
        type: AuctionType.TRADITIONAL,
        title: 'Leilão Tradicional - Crédito PIS/COFINS',
        description: 'Leilão de crédito tributário PIS/COFINS com garantia governamental',
        startingPrice: 400000,
        currentPrice: 445000,
        reservePrice: 420000,
        minimumBid: 20000,
        bidIncrement: 5000,
        startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2h atrás
        endTime: new Date(now.getTime() + 5 * 60 * 60 * 1000), // 5h à frente
        timeRemaining: 5 * 60 * 60, // 5h em segundos
        status: AuctionStatus.ACTIVE,
        totalBids: 12,
        totalBidders: 8,
        winningBid: {
          id: 'bid_win_001',
          auctionId: 'auction_001',
          bidderId: 'user_456',
          bidderName: 'Investidor XYZ',
          amount: 445000,
          quantity: 1,
          timestamp: new Date(now.getTime() - 15 * 60 * 1000),
          status: BidStatus.WINNING,
          isWinning: true,
        },
        recentBids: [
          {
            id: 'bid_001',
            auctionId: 'auction_001',
            bidderId: 'user_456',
            bidderName: 'Investidor XYZ',
            amount: 445000,
            quantity: 1,
            timestamp: new Date(now.getTime() - 15 * 60 * 1000),
            status: BidStatus.WINNING,
            isWinning: true,
          },
          {
            id: 'bid_002',
            auctionId: 'auction_001',
            bidderId: 'user_789',
            bidderName: 'Fundo ABC',
            amount: 440000,
            quantity: 1,
            timestamp: new Date(now.getTime() - 25 * 60 * 1000),
            status: BidStatus.OUTBID,
            isWinning: false,
          },
        ],
        allowedBidders: 'PUBLIC',
        autoExtension: true,
        extensionTime: 5,
        createdBy: 'user_123',
        category: 'Tributário',
        tags: ['popular', 'garantido'],
      },
      {
        id: 'auction_002',
        tcId: 'TT-2024-002',
        type: AuctionType.REVERSE,
        title: 'Leilão Reverso - Precatório INSS',
        description: 'Leilão reverso para precatório alimentar, menor desconto vence',
        startingPrice: 150000,
        currentPrice: 138000,
        minimumBid: 2000,
        bidIncrement: 1000,
        startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1h atrás
        endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2h à frente
        timeRemaining: 2 * 60 * 60,
        status: AuctionStatus.ACTIVE,
        totalBids: 6,
        totalBidders: 4,
        winningBid: {
          id: 'bid_win_002',
          auctionId: 'auction_002',
          bidderId: 'user_555',
          bidderName: 'Family Office DEF',
          amount: 138000,
          quantity: 1,
          timestamp: new Date(now.getTime() - 8 * 60 * 1000),
          status: BidStatus.WINNING,
          isWinning: true,
        },
        recentBids: [],
        allowedBidders: 'QUALIFIED',
        autoExtension: false,
        extensionTime: 0,
        createdBy: 'user_456',
        category: 'Judicial',
        tags: ['alimentar', 'prioritário'],
      },
      {
        id: 'auction_003',
        tcId: 'TT-2024-003',
        type: AuctionType.DUTCH,
        title: 'Leilão Holandês - Duplicata Mercantil',
        description: 'Preço inicia alto e vai diminuindo, primeiro a aceitar vence',
        startingPrice: 75000,
        currentPrice: 68500,
        minimumBid: 60000,
        bidIncrement: 500,
        startTime: new Date(now.getTime() - 30 * 60 * 1000), // 30min atrás
        endTime: new Date(now.getTime() + 90 * 60 * 1000), // 1.5h à frente
        timeRemaining: 90 * 60,
        status: AuctionStatus.ACTIVE,
        totalBids: 0, // Holandês não tem lances, só aceites
        totalBidders: 0,
        recentBids: [],
        allowedBidders: 'PUBLIC',
        autoExtension: false,
        extensionTime: 0,
        createdBy: 'user_789',
        category: 'Comercial',
        tags: ['dinâmico', 'rápido'],
      },
    ];

    return {
      data: mockAuctions,
      total: mockAuctions.length,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
    };
  }

  private getMockBidHistory(auctionId: string): AuctionBid[] {
    return [
      {
        id: 'bid_h_001',
        auctionId,
        bidderId: 'user_456',
        bidderName: 'Investidor XYZ',
        amount: 445000,
        quantity: 1,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: BidStatus.WINNING,
        isWinning: true,
      },
      {
        id: 'bid_h_002',
        auctionId,
        bidderId: 'user_789',
        bidderName: 'Fundo ABC',
        amount: 440000,
        quantity: 1,
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        status: BidStatus.OUTBID,
        isWinning: false,
      },
      {
        id: 'bid_h_003',
        auctionId,
        bidderId: 'user_123',
        bidderName: 'Empresa DEF',
        amount: 435000,
        quantity: 1,
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: BidStatus.OUTBID,
        isWinning: false,
      },
    ];
  }

  private getMockEndingSoonAuctions(): AuctionDetails[] {
    const mockAuctions = this.getMockAuctions();
    return mockAuctions.data.filter(
      auction => auction.timeRemaining <= 24 * 60 * 60 && auction.timeRemaining > 0
    );
  }

  private getMockAuctionStats() {
    return {
      totalAuctions: 157,
      activeAuctions: 23,
      totalVolume: 8750000,
      averageBids: 8.3,
      successRate: 87.5,
      topCategories: [
        { category: 'Tributário', count: 89, volume: 5200000 },
        { category: 'Judicial', count: 45, volume: 2800000 },
        { category: 'Comercial', count: 23, volume: 750000 },
      ],
    };
  }
}

export const auctionService = new AuctionService();
