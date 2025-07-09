import { Auction, AuctionStatus, AuctionType } from '@/components/marketplace/AdvancedMarketplace';

export interface CreateAuctionRequest {
  title: string;
  description: string;
  creditId: string;
  creditTitle: string;
  creditValue: number;
  creditType: string;
  initialPrice: number;
  minIncrement: number;
  startDate: Date;
  endDate: Date;
  type: AuctionType;
  category: string;
  location: string;
  issuer: {
    name: string;
    rating: number;
    transactions: number;
  };
  compliance: {
    kyc: boolean;
    aml: boolean;
    legal: boolean;
    fiscal: boolean;
  };
  documents: Array<{
    type: string;
    name: string;
    verified: boolean;
  }>;
}

export interface PlaceBidRequest {
  auctionId: string;
  amount: number;
  userId: string;
  userName: string;
}

export interface AuctionFilters {
  category?: string;
  status?: AuctionStatus;
  type?: AuctionType;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  search?: string;
}

class AuctionService {
  private baseUrl = '/api/auctions';

  // Listar todos os leilões
  async listAuctions(filters?: AuctionFilters): Promise<Auction[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar leilões:', error);
      // Retornar dados mockados em caso de erro
      return this.getMockAuctions();
    }
  }

  // Obter leilão por ID
  async getAuctionById(id: string): Promise<Auction | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter leilão:', error);
      return null;
    }
  }

  // Criar novo leilão
  async createAuction(data: CreateAuctionRequest): Promise<Auction> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar leilão:', error);
      throw error;
    }
  }

  // Dar lance em um leilão
  async placeBid(data: PlaceBidRequest): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${data.auctionId}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao dar lance:', error);
      throw error;
    }
  }

  // Acompanhar/desacompanhar leilão
  async toggleWatch(auctionId: string, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${auctionId}/watch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao alternar acompanhamento:', error);
      throw error;
    }
  }

  // Obter leilões acompanhados
  async getWatchedAuctions(userId: string): Promise<Auction[]> {
    try {
      const response = await fetch(`${this.baseUrl}/watched?userId=${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter leilões acompanhados:', error);
      return [];
    }
  }

  // Obter estatísticas do marketplace
  async getMarketplaceStats(): Promise<{
    totalAuctions: number;
    activeAuctions: number;
    totalParticipants: number;
    totalValue: number;
    endingToday: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      // Retornar dados mockados
      return {
        totalAuctions: 15,
        activeAuctions: 8,
        totalParticipants: 45,
        totalValue: 15000000,
        endingToday: 3,
      };
    }
  }

  // Dados mockados para desenvolvimento
  private getMockAuctions(): Auction[] {
    return [
      {
        id: '1',
        title: 'Crédito ICMS - Exportação Industrial',
        description:
          'Crédito tributário de ICMS da Indústria Metalúrgica ABC, validado e pronto para compensação.',
        creditId: 'cred-123',
        creditTitle: 'TC ICMS - Processo 1234/2023',
        creditValue: 2500000,
        creditType: 'TRIBUTARIO/ICMS',
        initialPrice: 2125000,
        currentPrice: 2250000,
        minIncrement: 50000,
        startDate: new Date(Date.now() - 3600000 * 24), // 24h atrás
        endDate: new Date(Date.now() + 3600000 * 48), // 48h à frente
        status: AuctionStatus.ACTIVE,
        type: AuctionType.TRADITIONAL,
        createdBy: 'user-123',
        bids: [
          {
            id: 'bid-1',
            auctionId: '1',
            userId: 'user-456',
            userName: 'João Silva',
            amount: 2200000,
            timestamp: new Date(Date.now() - 3600000 * 12),
          },
          {
            id: 'bid-2',
            auctionId: '1',
            userId: 'user-789',
            userName: 'Maria Souza',
            amount: 2250000,
            timestamp: new Date(Date.now() - 3600000 * 6),
          },
        ],
        totalBids: 2,
        watchCount: 15,
        participants: 8,
        viewCount: 234,
        category: 'TRIBUTARIO',
        location: 'São Paulo, SP',
        issuer: {
          name: 'Indústria Metalúrgica ABC S.A.',
          rating: 4.8,
          transactions: 47,
        },
        compliance: {
          kyc: true,
          aml: true,
          legal: true,
          fiscal: true,
        },
        documents: [
          { type: 'GIA', name: 'gia_2024_12.pdf', verified: true },
          { type: 'Declaração', name: 'declaracao_icms.pdf', verified: true },
        ],
      },
      {
        id: '2',
        title: 'Precatório Judicial - Desapropriação',
        description:
          'Precatório contra Município de São Paulo, processo de desapropriação validado.',
        creditId: 'cred-456',
        creditTitle: 'Precatório 456/2022',
        creditValue: 1800000,
        creditType: 'JUDICIAL/PRECATORIO',
        initialPrice: 1440000,
        currentPrice: 1500000,
        minIncrement: 25000,
        startDate: new Date(Date.now() - 3600000 * 48), // 48h atrás
        endDate: new Date(Date.now() + 3600000 * 24), // 24h à frente
        status: AuctionStatus.ENDING_SOON,
        type: AuctionType.TRADITIONAL,
        createdBy: 'user-456',
        bids: [
          {
            id: 'bid-3',
            auctionId: '2',
            userId: 'user-123',
            userName: 'Carlos Lima',
            amount: 1500000,
            timestamp: new Date(Date.now() - 3600000 * 2),
          },
        ],
        totalBids: 1,
        watchCount: 8,
        participants: 3,
        viewCount: 156,
        category: 'JUDICIAL',
        location: 'São Paulo, SP',
        issuer: {
          name: 'Construtora XYZ Ltda.',
          rating: 4.5,
          transactions: 23,
        },
        compliance: {
          kyc: true,
          aml: true,
          legal: true,
          fiscal: true,
        },
        documents: [
          { type: 'Certidão Judicial', name: 'certidao_judicial.pdf', verified: true },
          { type: 'Cálculo Atualizado', name: 'calculo_atualizado.pdf', verified: true },
        ],
      },
      {
        id: '3',
        title: 'Crédito PIS/COFINS - 2023',
        description: 'Créditos de PIS/COFINS validados e homologados pela Receita Federal.',
        creditId: 'cred-789',
        creditTitle: 'Crédito PIS/COFINS - Período 2023',
        creditValue: 800000,
        creditType: 'TRIBUTARIO/PIS_COFINS',
        initialPrice: 680000,
        currentPrice: 720000,
        minIncrement: 10000,
        startDate: new Date(Date.now() + 3600000 * 24), // 24h à frente
        endDate: new Date(Date.now() + 3600000 * 72), // 72h à frente
        status: AuctionStatus.UPCOMING,
        type: AuctionType.REVERSE,
        createdBy: 'user-789',
        bids: [],
        totalBids: 0,
        watchCount: 12,
        participants: 0,
        viewCount: 89,
        category: 'TRIBUTARIO',
        location: 'Rio de Janeiro, RJ',
        issuer: {
          name: 'Comércio ABC Ltda.',
          rating: 4.2,
          transactions: 15,
        },
        compliance: {
          kyc: true,
          aml: true,
          legal: true,
          fiscal: true,
        },
        documents: [
          { type: 'SPED Fiscal', name: 'sped_fiscal_2023.pdf', verified: true },
          { type: 'Declaração', name: 'declaracao_pis_cofins.pdf', verified: true },
        ],
      },
      {
        id: '4',
        title: 'Duplicata Mercantil - Exportação',
        description: 'Duplicata mercantil de exportação com garantia bancária.',
        creditId: 'cred-101',
        creditTitle: 'Duplicata Export 101/2024',
        creditValue: 1200000,
        creditType: 'COMERCIAL/DUPLICATA',
        initialPrice: 1080000,
        currentPrice: 1150000,
        minIncrement: 20000,
        startDate: new Date(Date.now() - 3600000 * 12), // 12h atrás
        endDate: new Date(Date.now() + 3600000 * 36), // 36h à frente
        status: AuctionStatus.ACTIVE,
        type: AuctionType.DUTCH,
        createdBy: 'user-101',
        bids: [
          {
            id: 'bid-4',
            auctionId: '4',
            userId: 'user-202',
            userName: 'Ana Costa',
            amount: 1150000,
            timestamp: new Date(Date.now() - 3600000 * 1),
          },
        ],
        totalBids: 1,
        watchCount: 6,
        participants: 2,
        viewCount: 78,
        category: 'COMERCIAL',
        location: 'Porto Alegre, RS',
        issuer: {
          name: 'Exportadora Sul Ltda.',
          rating: 4.6,
          transactions: 31,
        },
        compliance: {
          kyc: true,
          aml: true,
          legal: true,
          fiscal: true,
        },
        documents: [
          { type: 'Duplicata', name: 'duplicata_export.pdf', verified: true },
          { type: 'Garantia Bancária', name: 'garantia_bancaria.pdf', verified: true },
        ],
      },
    ];
  }
}

export const auctionService = new AuctionService();
