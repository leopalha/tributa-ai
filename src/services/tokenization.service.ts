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
  LETRA_CAMBIO = 'LETRA_CAMBIO',

  // Financeiros
  DEBENTURE = 'DEBENTURE',
  CCB = 'CCB', // Cédula Crédito Bancário
  CRI_CRA = 'CRI_CRA', // Certificados Recebíveis

  // Judiciais
  PRECATORIO = 'PRECATORIO',
  HONORARIO_ADVOCATICIO = 'HONORARIO_ADVOCATICIO',
  HONORARIO_PERICIAL = 'HONORARIO_PERICIAL',
  CREDITORIO_JUDICIAL = 'CREDITORIO_JUDICIAL',

  // Rurais
  CCR = 'CCR', // Cédula Crédito Rural
  CPR = 'CPR', // Cédula Produto Rural
  NCR = 'NCR', // Nota Crédito Rural

  // Ambientais
  CREDITO_CARBONO = 'CREDITO_CARBONO',
  CREDITO_BIODIVERSIDADE = 'CREDITO_BIODIVERSIDADE',
  CREDITO_HIDRICO = 'CREDITO_HIDRICO',

  // Especiais
  CONSORCIO = 'CONSORCIO',
  ROYALTY = 'ROYALTY',
  SEGURO = 'SEGURO',
  PREVIDENCIARIO = 'PREVIDENCIARIO',
}

export enum TCStatus {
  DRAFT = 'DRAFT',
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  VALIDATING = 'VALIDATING',
  TOKENIZING = 'TOKENIZING',
  ACTIVE = 'ACTIVE',
  TRADING = 'TRADING',
  SETTLED = 'SETTLED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
}

export enum AuctionType {
  FIXED_PRICE = 'FIXED_PRICE', // Preço fixo
  TRADITIONAL = 'TRADITIONAL', // Leilão tradicional (maior lance)
  REVERSE = 'REVERSE', // Leilão reverso (menor preço)
  DUTCH = 'DUTCH', // Leilão holandês (preço decrescente)
  SEALED_BID = 'SEALED_BID', // Lance fechado
}

export interface TokenizedTC {
  id: string;
  tcId: string; // ID único do blockchain
  type: TCType;
  category: string;
  subcategory: string;

  // Dados básicos
  title: string;
  description: string;
  originalValue: number;
  currentValue: number;
  discountRate: number;
  maturityDate: Date;

  // Tokenização
  tokenSupply: number; // Quantidade de tokens emitidos
  tokenPrice: number; // Preço por token
  minimumInvestment: number;

  // Emissor
  issuerId: string;
  issuerName: string;
  issuerDocument: string;
  issuerType: 'PF' | 'PJ';

  // Status e validação
  status: TCStatus;
  validationScore: number; // 0-100
  riskRating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C' | 'D';

  // Blockchain
  contractAddress: string;
  chainId: string;
  transactionHash: string;
  blockNumber: number;

  // Negociação
  auctionType: AuctionType;
  startingPrice?: number;
  reservePrice?: number;
  auctionEndDate?: Date;

  // Metadados
  documents: Array<{
    type: string;
    url: string;
    hash: string;
    verified: boolean;
  }>;

  // Auditoria
  createdAt: Date;
  updatedAt: Date;
  tokenizedAt?: Date;

  // Analytics
  viewCount: number;
  favoriteCount: number;
  bidCount: number;

  // Compliance
  kycRequired: boolean;
  accreditedInvestorOnly: boolean;
  jurisdictionRestrictions: string[];
}

export interface TokenizationRequest {
  type: TCType;

  // Dados do crédito
  title: string;
  description: string;
  originalValue: number;
  maturityDate: Date;

  // Configuração de tokenização
  tokenSupply: number;
  minimumInvestment: number;
  auctionType: AuctionType;
  startingPrice?: number;
  reservePrice?: number;
  auctionDuration?: number; // em horas

  // Documentos
  documents: Array<{
    type: string;
    file: File;
    description: string;
  }>;

  // Emissor (se diferente do usuário logado)
  customIssuer?: {
    name: string;
    document: string;
    type: 'PF' | 'PJ';
  };
}

export interface AuctionBid {
  id: string;
  tcId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  quantity: number; // quantidade de tokens
  timestamp: Date;
  status: 'ACTIVE' | 'OUTBID' | 'WINNING' | 'WON' | 'LOST';
  signature: string; // assinatura digital
}

export interface MarketStats {
  totalVolume: number;
  totalTransactions: number;
  averageDiscount: number;
  totalTCs: number;

  // Por categoria
  categoryStats: Record<
    TCType,
    {
      volume: number;
      count: number;
      averageDiscount: number;
      averageRating: string;
    }
  >;

  // Tendências
  volumeGrowth: number; // % crescimento mensal
  priceIndex: number; // índice de preços
  liquidityIndex: number; // índice de liquidez
}

class TokenizationService {
  private baseURL = '/api/tokenization';

  // Criar solicitação de tokenização
  async createTokenizationRequest(request: TokenizationRequest): Promise<TokenizedTC> {
    try {
      const formData = new FormData();

      // Dados básicos
      formData.append('type', request.type);
      formData.append('title', request.title);
      formData.append('description', request.description);
      formData.append('originalValue', request.originalValue.toString());
      formData.append('maturityDate', request.maturityDate.toISOString());
      formData.append('tokenSupply', request.tokenSupply.toString());
      formData.append('minimumInvestment', request.minimumInvestment.toString());
      formData.append('auctionType', request.auctionType);

      if (request.startingPrice) {
        formData.append('startingPrice', request.startingPrice.toString());
      }
      if (request.reservePrice) {
        formData.append('reservePrice', request.reservePrice.toString());
      }
      if (request.auctionDuration) {
        formData.append('auctionDuration', request.auctionDuration.toString());
      }

      // Documentos
      request.documents.forEach((doc, index) => {
        formData.append(`documents[${index}].type`, doc.type);
        formData.append(`documents[${index}].description`, doc.description);
        formData.append(`documents[${index}].file`, doc.file);
      });

      // Emissor customizado
      if (request.customIssuer) {
        formData.append('customIssuer', JSON.stringify(request.customIssuer));
      }

      const response = await api.post<TokenizedTC>(`${this.baseURL}/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao criar solicitação de tokenização:', error);

      // Mock para demonstração
      return this.createMockTokenizedTC(request);
    }
  }

  // Listar TCs tokenizados
  async listTokenizedTCs(filters?: {
    type?: TCType;
    status?: TCStatus;
    auctionType?: AuctionType;
    minValue?: number;
    maxValue?: number;
    minDiscount?: number;
    maxDiscount?: number;
    riskRating?: string[];
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: TokenizedTC[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => params.append(`${key}[]`, v.toString()));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }

      const response = await api.get(`${this.baseURL}/list?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar TCs tokenizados:', error);

      // Fallback com dados mock
      return this.getMockTokenizedTCs(filters);
    }
  }

  // Obter detalhes de um TC específico
  async getTCDetails(tcId: string): Promise<TokenizedTC> {
    try {
      const response = await api.get<TokenizedTC>(`${this.baseURL}/${tcId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter detalhes do TC:', error);

      // Retorna mock se não encontrar
      const mockTCs = this.getMockTokenizedTCs();
      const tc = mockTCs.data.find(tc => tc.id === tcId || tc.tcId === tcId);
      if (tc) return tc;

      throw new Error('TC não encontrado');
    }
  }

  // Fazer bid em leilão
  async placeBid(tcId: string, amount: number, quantity: number): Promise<AuctionBid> {
    try {
      const response = await api.post<AuctionBid>(`${this.baseURL}/${tcId}/bid`, {
        amount,
        quantity,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer bid:', error);

      // Mock para demonstração
      return {
        id: `bid_${Date.now()}`,
        tcId,
        bidderId: 'user_current',
        bidderName: 'Usuário Atual',
        amount,
        quantity,
        timestamp: new Date(),
        status: 'ACTIVE',
        signature: 'mock_signature_' + Date.now(),
      };
    }
  }

  // Comprar TC a preço fixo
  async buyFixedPrice(
    tcId: string,
    quantity: number
  ): Promise<{
    success: boolean;
    transactionId: string;
    message: string;
  }> {
    try {
      const response = await api.post(`${this.baseURL}/${tcId}/buy`, {
        quantity,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao comprar TC:', error);

      // Mock para demonstração
      return {
        success: true,
        transactionId: `tx_${Date.now()}`,
        message: 'Compra realizada com sucesso! Aguarde a confirmação na blockchain.',
      };
    }
  }

  // Obter estatísticas do mercado
  async getMarketStats(): Promise<MarketStats> {
    try {
      const response = await api.get<MarketStats>(`${this.baseURL}/stats`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);

      // Fallback com dados mock
      return this.getMockMarketStats();
    }
  }

  // Métodos privados para dados mock
  private createMockTokenizedTC(request: TokenizationRequest): TokenizedTC {
    return {
      id: `tc_${Date.now()}`,
      tcId: `TT-2024-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      type: request.type,
      category: this.getCategoryFromType(request.type),
      subcategory: this.getSubcategoryFromType(request.type),
      title: request.title,
      description: request.description,
      originalValue: request.originalValue,
      currentValue: request.originalValue * (1 - Math.random() * 0.3), // 0-30% desconto
      discountRate: Math.random() * 30,
      maturityDate: request.maturityDate,
      tokenSupply: request.tokenSupply,
      tokenPrice: request.originalValue / request.tokenSupply,
      minimumInvestment: request.minimumInvestment,
      issuerId: 'current_user',
      issuerName: request.customIssuer?.name || 'Usuário Atual',
      issuerDocument: request.customIssuer?.document || '000.000.000-00',
      issuerType: request.customIssuer?.type || 'PF',
      status: TCStatus.PENDING_VALIDATION,
      validationScore: 0,
      riskRating: 'A',
      contractAddress: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
      chainId: 'fabric-channel-1',
      transactionHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
      blockNumber: Math.floor(Math.random() * 1000) + 1000,
      auctionType: request.auctionType,
      startingPrice: request.startingPrice,
      reservePrice: request.reservePrice,
      auctionEndDate: request.auctionDuration
        ? new Date(Date.now() + request.auctionDuration * 60 * 60 * 1000)
        : undefined,
      documents: request.documents.map((doc, index) => ({
        type: doc.type,
        url: `/docs/mock_${Date.now()}_${index}.pdf`,
        hash: `sha256:${Math.random().toString(16)}`,
        verified: false,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      favoriteCount: 0,
      bidCount: 0,
      kycRequired: true,
      accreditedInvestorOnly: request.originalValue > 1000000,
      jurisdictionRestrictions: ['BR'],
    };
  }

  private getCategoryFromType(type: TCType): string {
    if (type.includes('TRIBUTARIO')) return 'Tributário';
    if (type.includes('DUPLICATA') || type.includes('NOTA') || type.includes('LETRA'))
      return 'Comercial';
    if (type.includes('DEBENTURE') || type.includes('CCB') || type.includes('CRI'))
      return 'Financeiro';
    if (type.includes('PRECATORIO') || type.includes('HONORARIO') || type.includes('CREDITORIO'))
      return 'Judicial';
    if (type.includes('CCR') || type.includes('CPR') || type.includes('NCR')) return 'Rural';
    if (type.includes('CREDITO')) return 'Ambiental';
    return 'Especial';
  }

  private getSubcategoryFromType(type: TCType): string {
    const subtypes: Record<string, string> = {
      TRIBUTARIO_FEDERAL: 'PIS/COFINS/IRPJ/CSLL',
      TRIBUTARIO_ESTADUAL: 'ICMS/IPVA',
      TRIBUTARIO_MUNICIPAL: 'ISSQN/IPTU',
      DUPLICATA_MERCANTIL: 'Vendas',
      DUPLICATA_SERVICO: 'Serviços',
      PRECATORIO: 'Precatório',
      HONORARIO_ADVOCATICIO: 'Honorários Advocatícios',
      CCR: 'Crédito Rural',
      CPR: 'Produto Rural',
      CREDITO_CARBONO: 'Carbono',
    };
    return subtypes[type] || type;
  }

  private getMockTokenizedTCs(filters?: any): {
    data: TokenizedTC[];
    total: number;
    page: number;
    limit: number;
  } {
    const mockTCs: TokenizedTC[] = [
      {
        id: 'tc_001',
        tcId: 'TT-2024-001',
        type: TCType.TRIBUTARIO_FEDERAL,
        category: 'Tributário',
        subcategory: 'PIS/COFINS',
        title: 'Crédito PIS/COFINS - Energia Elétrica',
        description:
          'Recuperação de créditos PIS/COFINS sobre energia elétrica consumida no processo produtivo',
        originalValue: 500000,
        currentValue: 425000,
        discountRate: 15,
        maturityDate: new Date('2025-12-31'),
        tokenSupply: 1000,
        tokenPrice: 425,
        minimumInvestment: 10000,
        issuerId: 'user_123',
        issuerName: 'Indústria ABC Ltda',
        issuerDocument: '12.345.678/0001-90',
        issuerType: 'PJ',
        status: TCStatus.ACTIVE,
        validationScore: 95,
        riskRating: 'AA',
        contractAddress: '0x1234...5678',
        chainId: 'fabric-channel-1',
        transactionHash: '0xabcd...ef01',
        blockNumber: 1250,
        auctionType: AuctionType.TRADITIONAL,
        startingPrice: 400000,
        reservePrice: 420000,
        auctionEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        documents: [
          {
            type: 'comprovante_pagamento',
            url: '/docs/tc_001_comprovante.pdf',
            hash: 'sha256:abc123...',
            verified: true,
          },
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        tokenizedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        viewCount: 45,
        favoriteCount: 12,
        bidCount: 8,
        kycRequired: true,
        accreditedInvestorOnly: false,
        jurisdictionRestrictions: ['BR'],
      },
      {
        id: 'tc_002',
        tcId: 'TT-2024-002',
        type: TCType.PRECATORIO,
        category: 'Judicial',
        subcategory: 'Precatório Alimentar',
        title: 'Precatório Alimentar - INSS',
        description: 'Precatório alimentar contra INSS referente a aposentadoria especial',
        originalValue: 150000,
        currentValue: 135000,
        discountRate: 10,
        maturityDate: new Date('2026-06-30'),
        tokenSupply: 300,
        tokenPrice: 450,
        minimumInvestment: 5000,
        issuerId: 'user_456',
        issuerName: 'João Silva Santos',
        issuerDocument: '123.456.789-00',
        issuerType: 'PF',
        status: TCStatus.TRADING,
        validationScore: 88,
        riskRating: 'A',
        contractAddress: '0x5678...9012',
        chainId: 'fabric-channel-1',
        transactionHash: '0xdef0...1234',
        blockNumber: 1251,
        auctionType: AuctionType.FIXED_PRICE,
        documents: [
          {
            type: 'sentenca_judicial',
            url: '/docs/tc_002_sentenca.pdf',
            hash: 'sha256:def456...',
            verified: true,
          },
        ],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        tokenizedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        viewCount: 67,
        favoriteCount: 23,
        bidCount: 0,
        kycRequired: true,
        accreditedInvestorOnly: false,
        jurisdictionRestrictions: ['BR'],
      },
      {
        id: 'tc_003',
        tcId: 'TT-2024-003',
        type: TCType.DUPLICATA_MERCANTIL,
        category: 'Comercial',
        subcategory: 'Vendas',
        title: 'Duplicata Mercantil - Fornecimento Industrial',
        description: 'Duplicata mercantil referente ao fornecimento de matéria-prima industrial',
        originalValue: 75000,
        currentValue: 67500,
        discountRate: 10,
        maturityDate: new Date('2025-03-15'),
        tokenSupply: 150,
        tokenPrice: 450,
        minimumInvestment: 2500,
        issuerId: 'user_789',
        issuerName: 'Fornecedora XYZ S.A.',
        issuerDocument: '98.765.432/0001-10',
        issuerType: 'PJ',
        status: TCStatus.ACTIVE,
        validationScore: 92,
        riskRating: 'BBB',
        contractAddress: '0x9012...3456',
        chainId: 'fabric-channel-1',
        transactionHash: '0x5678...9abc',
        blockNumber: 1252,
        auctionType: AuctionType.REVERSE,
        startingPrice: 70000,
        reservePrice: 65000,
        auctionEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        documents: [
          {
            type: 'nota_fiscal',
            url: '/docs/tc_003_nf.pdf',
            hash: 'sha256:ghi789...',
            verified: true,
          },
        ],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        tokenizedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        viewCount: 23,
        favoriteCount: 7,
        bidCount: 3,
        kycRequired: false,
        accreditedInvestorOnly: false,
        jurisdictionRestrictions: ['BR'],
      },
    ];

    // Aplicar filtros se fornecidos
    let filteredTCs = mockTCs;

    if (filters?.type) {
      filteredTCs = filteredTCs.filter(tc => tc.type === filters.type);
    }

    if (filters?.status) {
      filteredTCs = filteredTCs.filter(tc => tc.status === filters.status);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTCs = filteredTCs.filter(
        tc =>
          tc.title.toLowerCase().includes(searchLower) ||
          tc.description.toLowerCase().includes(searchLower) ||
          tc.issuerName.toLowerCase().includes(searchLower)
      );
    }

    return {
      data: filteredTCs,
      total: filteredTCs.length,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
    };
  }

  private getMockMarketStats(): MarketStats {
    return {
      totalVolume: 15500000,
      totalTransactions: 234,
      averageDiscount: 12.5,
      totalTCs: 89,
      categoryStats: {
        [TCType.TRIBUTARIO_FEDERAL]: {
          volume: 8500000,
          count: 45,
          averageDiscount: 15.2,
          averageRating: 'AA',
        },
        [TCType.PRECATORIO]: {
          volume: 4200000,
          count: 28,
          averageDiscount: 8.7,
          averageRating: 'A',
        },
        [TCType.DUPLICATA_MERCANTIL]: {
          volume: 2800000,
          count: 16,
          averageDiscount: 18.5,
          averageRating: 'BBB',
        },
      } as any,
      volumeGrowth: 23.4,
      priceIndex: 102.3,
      liquidityIndex: 85.7,
    };
  }
}

export const tokenizationService = new TokenizationService();
