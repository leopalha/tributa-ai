/**
 * Mock API for blockchain services
 * This file provides mock data when the real blockchain service is not available
 * Used primarily for development and testing purposes
 */

// Mock blockchain status response
export const mockBlockchainStatus = {
  status: 'online',
  message: 'Blockchain service is running',
  networkInfo: {
    name: 'TributaAINetwork',
    version: '2.2.0',
    channel: 'tributa-channel',
    peers: [
      { id: 'peer0.org1.example.com', status: 'active' },
      { id: 'peer0.org2.example.com', status: 'active' },
    ],
    orderers: [{ id: 'orderer.example.com', status: 'active' }],
  },
};

// Mock blockchain query response
export const mockBlockchainQuery = (funcao: string, args: string[]) => {
  switch (funcao) {
    case 'consultarInfo':
      return {
        result: {
          networkName: 'TributaAINetwork',
          version: '2.2.0',
          timestamp: new Date().toISOString(),
          status: 'active',
        },
      };
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

// Mock blockchain invoke response
export const mockBlockchainInvoke = (funcao: string, args: string[]) => {
  return {
    success: true,
    transactionId: `tx-${Math.random().toString(36).substring(2, 10)}`,
    message: `Successfully executed ${funcao}`,
    timestamp: new Date().toISOString(),
  };
};

// Mock blockchain history response
export const mockBlockchainHistory = (chave: string) => {
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
