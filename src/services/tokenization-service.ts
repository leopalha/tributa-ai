import { api } from './api';

// Tipos de Títulos de Crédito suportados
export enum TCType {
  // Tributários
  TRIBUTARIO_FEDERAL = 'TRIBUTARIO_FEDERAL',
  TRIBUTARIO_ESTADUAL = 'TRIBUTARIO_ESTADUAL',
  TRIBUTARIO_MUNICIPAL = 'TRIBUTARIO_MUNICIPAL',

  // Comerciais
  DUPLICATA_MERCANTIL = 'DUPLICATA_MERCANTIL',
  DUPLICATA_SERVICO = 'DUPLICATA_SERVICO',
  NOTA_PROMISSORIA = 'NOTA_PROMISSORIA',

  // Judiciais
  PRECATORIO = 'PRECATORIO',
  HONORARIO_ADVOCATICIO = 'HONORARIO_ADVOCATICIO',

  // Rurais
  CCR = 'CCR', // Cédula Crédito Rural
  CPR = 'CPR', // Cédula Produto Rural

  // Ambientais
  CREDITO_CARBONO = 'CREDITO_CARBONO',
}

export enum TCStatus {
  DRAFT = 'DRAFT',
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  ACTIVE = 'ACTIVE',
  TRADING = 'TRADING',
  SETTLED = 'SETTLED',
}

export enum AuctionType {
  FIXED_PRICE = 'FIXED_PRICE',
  TRADITIONAL = 'TRADITIONAL',
  REVERSE = 'REVERSE',
  DUTCH = 'DUTCH',
}

export interface TokenizedTC {
  id: string;
  tcId: string;
  type: TCType;
  title: string;
  description: string;
  originalValue: number;
  currentValue: number;
  discountRate: number;
  tokenSupply: number;
  tokenPrice: number;
  status: TCStatus;
  auctionType: AuctionType;
  issuerName: string;
  createdAt: Date;
}

class TokenizationService {
  async listTokenizedTCs(): Promise<TokenizedTC[]> {
    try {
      const response = await api.get('/api/tokenization/list');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar TCs:', error);
      return this.getMockData();
    }
  }

  private getMockData(): TokenizedTC[] {
    return [
      {
        id: 'tc_001',
        tcId: 'TT-2024-001',
        type: TCType.TRIBUTARIO_FEDERAL,
        title: 'Crédito PIS/COFINS - Energia',
        description: 'Recuperação PIS/COFINS energia elétrica',
        originalValue: 500000,
        currentValue: 425000,
        discountRate: 15,
        tokenSupply: 1000,
        tokenPrice: 425,
        status: TCStatus.ACTIVE,
        auctionType: AuctionType.TRADITIONAL,
        issuerName: 'Indústria ABC Ltda',
        createdAt: new Date(),
      },
    ];
  }
}

export const tokenizationService = new TokenizationService();
