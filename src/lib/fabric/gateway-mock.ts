// Mock do fabric-network para compatibilidade com Vite
// Em produção, este seria substituído pela implementação real

interface MockWallet {
  get(label: string): Promise<any>;
}

interface MockGateway {
  identityContext?: { label: string };
  connect(ccp: any, options: any): Promise<void>;
  disconnect(): Promise<void>;
  getNetwork(channelName: string): Promise<any>;
}

interface MockContract {
  submitTransaction(name: string, ...args: string[]): Promise<Buffer>;
  evaluateTransaction(name: string, ...args: string[]): Promise<Buffer>;
}

// Mock implementations
const mockWallet: MockWallet = {
  async get(label: string) {
    console.log(`[FABRIC MOCK] Getting identity: ${label}`);
    return { type: 'mock', label };
  },
};

const mockContract: MockContract = {
  async submitTransaction(name: string, ...args: string[]): Promise<Buffer> {
    console.log(`[FABRIC MOCK] Submit transaction: ${name}(${args.join(', ')})`);

    // Simular diferentes tipos de resposta baseado no nome da transação
    let mockResponse: any = {
      success: true,
      transaction: name,
      args,
      timestamp: new Date().toISOString(),
    };

    switch (name) {
      case 'CreateCreditToken':
        mockResponse = {
          tokenId: `token_${Date.now()}`,
          creditValue: args[1] || '0',
          owner: args[0] || 'unknown',
          status: 'CREATED',
        };
        break;
      case 'TransferToken':
        mockResponse = {
          from: args[0],
          to: args[1],
          tokenId: args[2],
          status: 'TRANSFERRED',
        };
        break;
      case 'CompensateCredit':
        mockResponse = {
          compensationId: `comp_${Date.now()}`,
          creditTokenId: args[0],
          debtValue: args[1],
          status: 'COMPENSATED',
        };
        break;
      default:
        mockResponse = { success: true, message: `Transaction ${name} executed successfully` };
    }

    return Buffer.from(JSON.stringify(mockResponse));
  },

  async evaluateTransaction(name: string, ...args: string[]): Promise<Buffer> {
    console.log(`[FABRIC MOCK] Evaluate transaction: ${name}(${args.join(', ')})`);

    let mockResponse: any = { result: 'mock-result', transaction: name, args };

    switch (name) {
      case 'GetCreditToken':
        mockResponse = {
          tokenId: args[0],
          creditValue: '50000',
          owner: 'user123',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        };
        break;
      case 'GetUserTokens':
        mockResponse = [
          { tokenId: 'token1', creditValue: '25000', status: 'ACTIVE' },
          { tokenId: 'token2', creditValue: '35000', status: 'LISTED' },
        ];
        break;
      case 'GetNetworkStatus':
        mockResponse = {
          networkId: 'tributa-network',
          status: 'ACTIVE',
          blockHeight: 12345,
          peersOnline: 4,
        };
        break;
      default:
        mockResponse = { data: `Query ${name} result`, timestamp: new Date().toISOString() };
    }

    return Buffer.from(JSON.stringify(mockResponse));
  },
};

const mockNetwork = {
  getContract(chaincodeName: string) {
    console.log(`[FABRIC MOCK] Getting contract: ${chaincodeName}`);
    return mockContract;
  },
};

const mockGateway: MockGateway = {
  identityContext: undefined,

  async connect(ccp: any, options: any) {
    console.log(`[FABRIC MOCK] Connecting gateway with identity: ${options.identity}`);
    this.identityContext = { label: options.identity };
  },

  async disconnect() {
    console.log('[FABRIC MOCK] Disconnecting gateway');
    this.identityContext = undefined;
  },

  async getNetwork(channelName: string) {
    console.log(`[FABRIC MOCK] Getting network: ${channelName}`);
    return mockNetwork;
  },
};

// Mock do módulo Wallets
const Wallets = {
  async newFileSystemWallet(path: string): Promise<MockWallet> {
    console.log(`[FABRIC MOCK] Creating wallet at: ${path}`);
    return mockWallet;
  },
};

// Constantes
const CHANNEL_NAME = 'tributachannel';
const CHAINCODE_NAME = 'tributatoken';

// Singleton para o Gateway e Wallet
let gateway: MockGateway | null = null;
let wallet: MockWallet | null = null;

async function getWallet(): Promise<MockWallet> {
  if (!wallet) {
    wallet = await Wallets.newFileSystemWallet('/mock/wallet/path');
    console.log(`[FABRIC MOCK] Wallet initialized`);
  }
  return wallet;
}

async function getConnectedGateway(userIdentityLabel: string): Promise<MockGateway> {
  if (gateway && gateway.identityContext) {
    if (gateway.identityContext.label === userIdentityLabel) {
      console.log('[FABRIC MOCK] Reusing existing gateway connection');
      return gateway;
    }
    console.log(
      `[FABRIC MOCK] Switching identity from ${gateway.identityContext.label} to ${userIdentityLabel}`
    );
    await gateway.disconnect();
    gateway = null;
  }

  console.log(`[FABRIC MOCK] Connecting to gateway as ${userIdentityLabel}`);
  gateway = mockGateway;
  const walletInstance = await getWallet();

  // Mock connection
  await gateway.connect(
    {},
    {
      wallet: walletInstance,
      identity: userIdentityLabel,
    }
  );

  console.log(`[FABRIC MOCK] Connected to gateway as ${userIdentityLabel}`);
  return gateway;
}

async function disconnectGateway(): Promise<void> {
  if (gateway) {
    console.log('[FABRIC MOCK] Disconnecting gateway');
    await gateway.disconnect();
    gateway = null;
    console.log('[FABRIC MOCK] Gateway disconnected');
  }
}

export { getConnectedGateway, disconnectGateway, getWallet };

export async function getContract(gateway: MockGateway) {
  const network = await gateway.getNetwork(CHANNEL_NAME);
  const contract = network.getContract(CHAINCODE_NAME);
  return contract;
}

export async function submitTransaction(
  userId: string,
  transactionName: string,
  ...args: string[]
): Promise<Buffer> {
  let gatewayInstance: MockGateway | null = null;
  try {
    gatewayInstance = await getConnectedGateway(userId);
    const contract = await getContract(gatewayInstance);
    console.log(`[FABRIC MOCK] --> Submitting Transaction: ${transactionName}(${args.join(', ')})`);
    const result = await contract.submitTransaction(transactionName, ...args);
    console.log(`[FABRIC MOCK] <-- Transaction Result: ${result.toString()}`);
    return result;
  } catch (error) {
    console.error(`[FABRIC MOCK] Erro ao submeter transação ${transactionName}:`, error);
    throw error;
  } finally {
    await disconnectGateway();
  }
}

export async function evaluateTransaction(
  userId: string,
  transactionName: string,
  ...args: string[]
): Promise<Buffer> {
  let gatewayInstance: MockGateway | null = null;
  try {
    gatewayInstance = await getConnectedGateway(userId);
    const contract = await getContract(gatewayInstance);
    console.log(`[FABRIC MOCK] --> Evaluating Transaction: ${transactionName}(${args.join(', ')})`);
    const result = await contract.evaluateTransaction(transactionName, ...args);
    console.log(`[FABRIC MOCK] <-- Transaction Result: ${result.toString()}`);
    return result;
  } catch (error) {
    console.error(`[FABRIC MOCK] Erro ao avaliar transação ${transactionName}:`, error);
    throw error;
  } finally {
    await disconnectGateway();
  }
}
