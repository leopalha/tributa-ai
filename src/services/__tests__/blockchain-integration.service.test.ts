import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BlockchainIntegrationService } from '../blockchain-integration.service';

// Mock do ethers
vi.mock('ethers', () => {
  const originalModule = vi.importActual('ethers');
  
  const mockSigner = {
    getAddress: vi.fn().mockResolvedValue('0x1234567890abcdef1234567890abcdef12345678'),
  };
  
  const mockProvider = {
    getSigner: vi.fn().mockReturnValue(mockSigner),
    getNetwork: vi.fn().mockResolvedValue({ chainId: 1 }),
  };
  
  const mockContract = {
    balanceOf: vi.fn().mockResolvedValue('1000000000000000000'),
    decimals: vi.fn().mockResolvedValue(18),
    tokenize: vi.fn().mockResolvedValue({
      wait: vi.fn().mockResolvedValue({
        events: [
          {
            event: 'AssetTokenized',
            args: {
              tokenId: '1',
              assetType: 'CREDITO_FISCAL',
              assetValue: '1000000000000000000000',
            },
          },
        ],
        transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      }),
    }),
    getAmountsOut: vi.fn().mockResolvedValue(['1000000000000000000', '5000000000000000000']),
    approve: vi.fn().mockResolvedValue({
      wait: vi.fn().mockResolvedValue({}),
    }),
    swapExactTokensForTokens: vi.fn().mockResolvedValue({
      wait: vi.fn().mockResolvedValue({
        transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      }),
    }),
  };
  
  return {
    ...originalModule,
    ethers: {
      Contract: vi.fn().mockImplementation(() => mockContract),
      providers: {
        Web3Provider: vi.fn().mockImplementation(() => mockProvider),
      },
      utils: {
        parseUnits: vi.fn().mockImplementation((value, decimals) => value + '0'.repeat(decimals)),
        formatUnits: vi.fn().mockImplementation((value) => '1.0'),
      },
    },
  };
});

// Mock do window.ethereum
const mockEthereum = {
  request: vi.fn().mockResolvedValue([]),
};

global.window = {
  ...global.window,
  ethereum: mockEthereum,
};

describe('BlockchainIntegrationService', () => {
  let service: BlockchainIntegrationService;
  
  beforeEach(() => {
    service = new BlockchainIntegrationService();
    vi.clearAllMocks();
  });
  
  it('deve conectar à carteira com sucesso', async () => {
    const result = await service.connect();
    expect(result).toBe(true);
    expect(mockEthereum.request).toHaveBeenCalledWith({ method: 'eth_requestAccounts' });
  });
  
  it('deve verificar se está conectado', async () => {
    await service.connect();
    const result = service.isWalletConnected();
    expect(result).toBe(true);
  });
  
  it('deve obter o endereço da carteira', async () => {
    await service.connect();
    const address = await service.getWalletAddress();
    expect(address).toBe('0x1234567890abcdef1234567890abcdef12345678');
  });
  
  it('deve obter o saldo de um token', async () => {
    await service.connect();
    const balance = await service.getTokenBalance('0x1234567890123456789012345678901234567890');
    expect(balance).toBe('1.0');
  });
  
  it('deve tokenizar um ativo', async () => {
    await service.connect();
    const request = await service.tokenizeAsset('CREDITO_FISCAL', 1000, 'Crédito ICMS');
    
    expect(request.assetType).toBe('CREDITO_FISCAL');
    expect(request.assetValue).toBe(1000);
    expect(request.assetDescription).toBe('Crédito ICMS');
    expect(request.status).toBe('COMPLETED');
    expect(request.tokenId).toBeDefined();
    expect(request.transactionHash).toBeDefined();
    expect(request.progress).toBe(100);
  });
  
  it('deve obter cotação para swap', async () => {
    await service.connect();
    const quote = await service.getSwapQuote(
      '0x1234567890123456789012345678901234567890',
      '0x2345678901234567890123456789012345678901',
      '1.0'
    );
    
    expect(quote.fromAmount).toBeDefined();
    expect(quote.toAmount).toBeDefined();
    expect(quote.exchangeRate).toBeDefined();
    expect(quote.priceImpact).toBeDefined();
    expect(quote.fee).toBeDefined();
    expect(quote.minReceived).toBeDefined();
    expect(quote.route).toBeDefined();
    expect(quote.estimatedTime).toBeDefined();
  });
  
  it('deve executar swap', async () => {
    await service.connect();
    const result = await service.executeSwap(
      '0x1234567890123456789012345678901234567890',
      '0x2345678901234567890123456789012345678901',
      '1.0',
      '4.9'
    );
    
    expect(result.success).toBe(true);
    expect(result.transactionHash).toBeDefined();
  });
  
  it('deve obter transações da blockchain', async () => {
    await service.connect();
    const transactions = await service.getTransactions();
    
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0].hash).toBeDefined();
    expect(transactions[0].from).toBeDefined();
    expect(transactions[0].to).toBeDefined();
    expect(transactions[0].value).toBeDefined();
  });
}); 