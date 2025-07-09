import { api } from '@/lib/api';

export interface TokenData {
  id: string;
  nome: string;
  tipo: string;
  subtipo: string;
  valor: number;
  dataEmissao: Date;
  dataVencimento: Date;
  status: 'ativo' | 'listado' | 'vendido' | 'liquidado' | 'expirado';
  transactionHash: string;
  emissor: string;
  detentor: string;
  documentos: number;
  desconto: number;
  rendimento: number;
  rating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C';
  blockchain: {
    rede: string;
    contrato: string;
    tokenId: string;
    confirmacoes: number;
  };
  marketplace: {
    listado: boolean;
    preco: number;
    visualizacoes: number;
    interessados: number;
    ofertasRecebidas: number;
  };
}

export interface TokenFilters {
  tipo?: string;
  subtipo?: string;
  status?: string;
  rating?: string;
  valorMin?: number;
  valorMax?: number;
  dataInicio?: Date;
  dataFim?: Date;
}

export interface CreateTokenRequest {
  nome: string;
  tipo: string;
  subtipo: string;
  valor: number;
  dataVencimento: Date;
  emissor: string;
  documentos: File[];
  descricao?: string;
}

export interface ListTokenRequest {
  tokenId: string;
  preco: number;
  descricao?: string;
  categoria: string;
}

class TokenService {
  private baseUrl = '/api/tokens';

  async getTokens(filters?: TokenFilters): Promise<TokenData[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (value instanceof Date) {
              params.append(key, value.toISOString());
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }

      const response = await api.get(`${this.baseUrl}?${params.toString()}`);
      return response.data.map((token: any) => ({
        ...token,
        dataEmissao: new Date(token.dataEmissao),
        dataVencimento: new Date(token.dataVencimento),
      }));
    } catch (error) {
      console.error('Erro ao buscar tokens:', error);
      throw new Error('Falha ao carregar tokens');
    }
  }

  async getTokenById(id: string): Promise<TokenData> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return {
        ...response.data,
        dataEmissao: new Date(response.data.dataEmissao),
        dataVencimento: new Date(response.data.dataVencimento),
      };
    } catch (error) {
      console.error('Erro ao buscar token:', error);
      throw new Error('Falha ao carregar token');
    }
  }

  async createToken(tokenData: CreateTokenRequest): Promise<TokenData> {
    try {
      const formData = new FormData();
      
      // Adicionar dados do token
      Object.entries(tokenData).forEach(([key, value]) => {
        if (key !== 'documentos') {
          if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Adicionar documentos
      tokenData.documentos.forEach((file, index) => {
        formData.append(`documento_${index}`, file);
      });

      const response = await api.post(`${this.baseUrl}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        ...response.data,
        dataEmissao: new Date(response.data.dataEmissao),
        dataVencimento: new Date(response.data.dataVencimento),
      };
    } catch (error) {
      console.error('Erro ao criar token:', error);
      throw new Error('Falha ao criar token');
    }
  }

  async listTokenOnMarketplace(listData: ListTokenRequest): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${listData.tokenId}/list`, {
        preco: listData.preco,
        descricao: listData.descricao,
        categoria: listData.categoria,
      });
    } catch (error) {
      console.error('Erro ao listar token no marketplace:', error);
      throw new Error('Falha ao listar token no marketplace');
    }
  }

  async removeFromMarketplace(tokenId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${tokenId}/list`);
    } catch (error) {
      console.error('Erro ao remover token do marketplace:', error);
      throw new Error('Falha ao remover token do marketplace');
    }
  }

  async downloadCertificate(tokenId: string): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/${tokenId}/certificate`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao baixar certificado:', error);
      throw new Error('Falha ao baixar certificado');
    }
  }

  async getTokenDocuments(tokenId: string): Promise<any[]> {
    try {
      const response = await api.get(`${this.baseUrl}/${tokenId}/documents`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar documentos do token:', error);
      throw new Error('Falha ao carregar documentos');
    }
  }

  async downloadDocument(tokenId: string, documentId: string): Promise<Blob> {
    try {
      const response = await api.get(
        `${this.baseUrl}/${tokenId}/documents/${documentId}`,
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao baixar documento:', error);
      throw new Error('Falha ao baixar documento');
    }
  }

  async getTokenHistory(tokenId: string): Promise<any[]> {
    try {
      const response = await api.get(`${this.baseUrl}/${tokenId}/history`);
      return response.data.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));
    } catch (error) {
      console.error('Erro ao buscar histórico do token:', error);
      throw new Error('Falha ao carregar histórico');
    }
  }

  async transferToken(tokenId: string, newOwner: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${tokenId}/transfer`, {
        newOwner,
      });
    } catch (error) {
      console.error('Erro ao transferir token:', error);
      throw new Error('Falha ao transferir token');
    }
  }

  async liquidateToken(tokenId: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${tokenId}/liquidate`);
    } catch (error) {
      console.error('Erro ao liquidar token:', error);
      throw new Error('Falha ao liquidar token');
    }
  }

  async getTokenStats(): Promise<{
    total: number;
    valorTotal: number;
    porStatus: Record<string, number>;
    porTipo: Record<string, number>;
    crescimentoMensal: number;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw new Error('Falha ao carregar estatísticas');
    }
  }

  async generateReport(filters?: TokenFilters): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (value instanceof Date) {
              params.append(key, value.toISOString());
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }

      const response = await api.get(`${this.baseUrl}/report?${params.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw new Error('Falha ao gerar relatório');
    }
  }

  async validateToken(tokenId: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/${tokenId}/validate`);
      return response.data;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      throw new Error('Falha ao validar token');
    }
  }
}

export const tokenService = new TokenService(); 