// Mock API para desenvolvimento
const mockBlockchainInvoke = (funcao: string, args: string[]) => {
  return {
    success: true,
    transactionId: `tx-${Math.random().toString(36).substring(2, 10)}`,
    message: `Successfully executed ${funcao}`,
    timestamp: new Date().toISOString(),
  };
};

const mockBlockchainQuery = (funcao: string, args: string[]) => {
  switch (funcao) {
    case 'consultarCompensacao':
      return {
        result: {
          id: args[0] || 'comp-123',
          valor: 15000.0,
          status: 'COMPLETED',
          dataRegistro: new Date().toISOString(),
          documentos: ['doc1', 'doc2'],
          participantes: ['empresa1', 'empresa2'],
        },
      };
    default:
      return {
        result: {
          message: `Mock data for function ${funcao} with args ${JSON.stringify(args)}`,
          timestamp: new Date().toISOString(),
        },
      };
  }
};

const mockBlockchainHistory = (chave: string) => {
  return {
    key: chave,
    history: [
      {
        transactionId: 'tx1',
        value: { status: 'CREATED', valor: 12000.0 },
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        isDelete: false,
      },
      {
        transactionId: 'tx2',
        value: { status: 'PROCESSING', valor: 12000.0 },
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isDelete: false,
      },
      {
        transactionId: 'tx3',
        value: { status: 'COMPLETED', valor: 12000.0 },
        timestamp: new Date().toISOString(),
        isDelete: false,
      },
    ],
  };
};

// Interface para dados da compensação
export interface CompensacaoData {
  id: string;
  creditoId: string;
  debitoId: string;
  valor: number;
  dataCompensacao: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  protocolo?: string;
  detalhes?: {
    tipoCredito: string;
    tipoDebito: string;
    emissorCredito: string;
    emissorDebito: string;
    documentosId: string[];
  };
}

// Interface para resposta de consulta
export interface BlockchainQueryResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  transactionId?: string;
}

// Configurações do blockchain
const BLOCKCHAIN_CONFIG = {
  useMock: true, // Definir como false quando em produção
  apiUrl: process.env.BLOCKCHAIN_API_URL || 'http://localhost:3001/api/blockchain',
  timeout: 15000, // 15 segundos
};

/**
 * Serviço para interação com o blockchain para compensações
 */
class BlockchainCompensacaoService {
  /**
   * Registra uma nova compensação na blockchain
   */
  async registrarCompensacao(
    compensacao: Omit<CompensacaoData, 'id' | 'status' | 'protocolo'>
  ): Promise<BlockchainQueryResponse<{ id: string; protocolo: string }>> {
    try {
      if (BLOCKCHAIN_CONFIG.useMock) {
        // Usar dados mockados para desenvolvimento
        const mockResponse = mockBlockchainInvoke('registrarCompensacao', [
          JSON.stringify(compensacao),
        ]);

        return {
          success: true,
          data: {
            id: `comp-${Math.random().toString(36).substring(2, 10)}`,
            protocolo: `P${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(
              Math.random() * 10000
            )
              .toString()
              .padStart(4, '0')}`,
          },
          transactionId: mockResponse.transactionId,
        };
      }

      // Chamada real à API blockchain
      const response = await fetch(`${BLOCKCHAIN_CONFIG.apiUrl}/compensacao/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(compensacao),
        signal: AbortSignal.timeout(BLOCKCHAIN_CONFIG.timeout),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao registrar compensação na blockchain');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.result,
        transactionId: data.transactionId,
      };
    } catch (error) {
      console.error('Erro ao registrar compensação na blockchain:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Erro desconhecido ao registrar compensação',
      };
    }
  }

  /**
   * Consulta uma compensação na blockchain
   */
  async consultarCompensacao(id: string): Promise<BlockchainQueryResponse<CompensacaoData>> {
    try {
      if (BLOCKCHAIN_CONFIG.useMock) {
        // Usar dados mockados para desenvolvimento
        const mockResponse = mockBlockchainQuery('consultarCompensacao', [id]);

        // Converter resposta mockada para o formato esperado
        const mockData: CompensacaoData = {
          id: id,
          creditoId: `cred-${id.split('-')[1] || '123'}`,
          debitoId: `deb-${id.split('-')[1] || '123'}`,
          valor: mockResponse.result.valor,
          dataCompensacao: mockResponse.result.dataRegistro,
          status: mockResponse.result.status === 'COMPLETED' ? 'COMPLETED' : 'PROCESSING',
          protocolo: `P2024${Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, '0')}`,
          detalhes: {
            tipoCredito: 'ICMS',
            tipoDebito: 'ICMS',
            emissorCredito: 'Empresa A',
            emissorDebito: 'Empresa B',
            documentosId: mockResponse.result.documentos,
          },
        };

        return {
          success: true,
          data: mockData,
        };
      }

      // Chamada real à API blockchain
      const response = await fetch(`${BLOCKCHAIN_CONFIG.apiUrl}/compensacao/${id}`, {
        method: 'GET',
        signal: AbortSignal.timeout(BLOCKCHAIN_CONFIG.timeout),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao consultar compensação na blockchain');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.result,
      };
    } catch (error) {
      console.error('Erro ao consultar compensação na blockchain:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Erro desconhecido ao consultar compensação',
      };
    }
  }

  /**
   * Atualiza o status de uma compensação na blockchain
   */
  async atualizarStatusCompensacao(
    id: string,
    novoStatus: CompensacaoData['status'],
    detalhes?: string
  ): Promise<BlockchainQueryResponse<null>> {
    try {
      if (BLOCKCHAIN_CONFIG.useMock) {
        // Usar dados mockados para desenvolvimento
        const mockResponse = mockBlockchainInvoke('atualizarStatusCompensacao', [
          id,
          novoStatus,
          detalhes || '',
        ]);

        return {
          success: true,
          transactionId: mockResponse.transactionId,
        };
      }

      // Chamada real à API blockchain
      const response = await fetch(`${BLOCKCHAIN_CONFIG.apiUrl}/compensacao/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: novoStatus,
          detalhes,
        }),
        signal: AbortSignal.timeout(BLOCKCHAIN_CONFIG.timeout),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Erro ao atualizar status da compensação na blockchain'
        );
      }

      const data = await response.json();
      return {
        success: true,
        transactionId: data.transactionId,
      };
    } catch (error) {
      console.error('Erro ao atualizar status da compensação na blockchain:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar status',
      };
    }
  }

  /**
   * Consulta o histórico de uma compensação na blockchain
   */
  async consultarHistoricoCompensacao(id: string): Promise<BlockchainQueryResponse<any[]>> {
    try {
      if (BLOCKCHAIN_CONFIG.useMock) {
        // Usar dados mockados para desenvolvimento
        const mockResponse = mockBlockchainHistory(id);

        return {
          success: true,
          data: mockResponse.history,
        };
      }

      // Chamada real à API blockchain
      const response = await fetch(`${BLOCKCHAIN_CONFIG.apiUrl}/compensacao/${id}/historico`, {
        method: 'GET',
        signal: AbortSignal.timeout(BLOCKCHAIN_CONFIG.timeout),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao consultar histórico da compensação');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.result,
      };
    } catch (error) {
      console.error('Erro ao consultar histórico da compensação:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao consultar histórico',
      };
    }
  }

  /**
   * Valida uma compensação na blockchain
   */
  async validarCompensacao(
    id: string,
    validador: string,
    resultado: 'APPROVED' | 'REJECTED',
    comentario?: string
  ): Promise<BlockchainQueryResponse<null>> {
    try {
      if (BLOCKCHAIN_CONFIG.useMock) {
        // Usar dados mockados para desenvolvimento
        const mockResponse = mockBlockchainInvoke('validarCompensacao', [
          id,
          validador,
          resultado,
          comentario || '',
        ]);

        return {
          success: true,
          transactionId: mockResponse.transactionId,
        };
      }

      // Chamada real à API blockchain
      const response = await fetch(`${BLOCKCHAIN_CONFIG.apiUrl}/compensacao/${id}/validar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          validador,
          resultado,
          comentario,
        }),
        signal: AbortSignal.timeout(BLOCKCHAIN_CONFIG.timeout),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao validar compensação na blockchain');
      }

      const data = await response.json();
      return {
        success: true,
        transactionId: data.transactionId,
      };
    } catch (error) {
      console.error('Erro ao validar compensação na blockchain:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao validar compensação',
      };
    }
  }

  /**
   * Lista todas as compensações registradas na blockchain
   */
  async listarCompensacoes(filtros?: {
    status?: string;
    debitoId?: string;
    creditoId?: string;
  }): Promise<BlockchainQueryResponse<CompensacaoData[]>> {
    try {
      if (BLOCKCHAIN_CONFIG.useMock) {
        // Gerar dados mockados para simulação
        const mockCompensacoes: CompensacaoData[] = Array.from({ length: 5 }, (_, i) => ({
          id: `comp-${100 + i}`,
          creditoId: `cred-${200 + i}`,
          debitoId: `deb-${300 + i}`,
          valor: 10000 * (i + 1),
          dataCompensacao: new Date(Date.now() - i * 86400000).toISOString(),
          status: ['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED', 'COMPLETED'][
            i
          ] as CompensacaoData['status'],
          protocolo: `P2024${Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, '0')}`,
          detalhes: {
            tipoCredito: ['ICMS', 'PIS/COFINS', 'IPI', 'ISS', 'IRPJ'][i % 5],
            tipoDebito: ['ICMS', 'PIS/COFINS', 'IPI', 'ISS', 'IRPJ'][i % 5],
            emissorCredito: `Empresa ${String.fromCharCode(65 + i)}`,
            emissorDebito: `Empresa ${String.fromCharCode(70 + i)}`,
            documentosId: [`doc-${400 + i * 2}`, `doc-${401 + i * 2}`],
          },
        }));

        // Aplicar filtros se existirem
        let resultados = [...mockCompensacoes];
        if (filtros) {
          if (filtros.status) {
            resultados = resultados.filter(comp => comp.status === filtros.status);
          }
          if (filtros.creditoId) {
            resultados = resultados.filter(comp => comp.creditoId === filtros.creditoId);
          }
          if (filtros.debitoId) {
            resultados = resultados.filter(comp => comp.debitoId === filtros.debitoId);
          }
        }

        return {
          success: true,
          data: resultados,
        };
      }

      // Montando a query string com os filtros
      const queryParams = new URLSearchParams();
      if (filtros) {
        if (filtros.status) queryParams.append('status', filtros.status);
        if (filtros.creditoId) queryParams.append('creditoId', filtros.creditoId);
        if (filtros.debitoId) queryParams.append('debitoId', filtros.debitoId);
      }

      // Chamada real à API blockchain
      const response = await fetch(
        `${BLOCKCHAIN_CONFIG.apiUrl}/compensacoes?${queryParams.toString()}`,
        {
          method: 'GET',
          signal: AbortSignal.timeout(BLOCKCHAIN_CONFIG.timeout),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao listar compensações na blockchain');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.result,
      };
    } catch (error) {
      console.error('Erro ao listar compensações na blockchain:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao listar compensações',
      };
    }
  }
}

// Exportando o serviço como singleton
export const blockchainCompensacaoService = new BlockchainCompensacaoService();
