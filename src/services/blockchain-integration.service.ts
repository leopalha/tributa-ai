import { ethers } from 'ethers';
import { TokenizationRequest } from '@/types/wallet';

// ABI simplificado para um contrato ERC20 básico
const ERC20_ABI = [
  // Funções de leitura
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  // Funções de escrita
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  // Eventos
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// ABI para o contrato de tokenização
const TOKENIZATION_ABI = [
  "function tokenize(string assetType, uint256 assetValue, string assetDescription) returns (uint256 tokenId)",
  "function getTokenDetails(uint256 tokenId) view returns (string assetType, uint256 assetValue, string assetDescription, address owner)",
  "event AssetTokenized(address indexed owner, uint256 indexed tokenId, string assetType, uint256 assetValue)"
];

// ABI para o contrato de swap
const SWAP_ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] path) view returns (uint[] amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline) returns (uint[] amounts)",
  "function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] path, address to, uint deadline) returns (uint[] amounts)"
];

export class BlockchainIntegrationService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private tokenizationContract: ethers.Contract | null = null;
  private swapRouterContract: ethers.Contract | null = null;
  private chainId: number | null = null;
  private isConnected: boolean = false;
  private tokenContracts: Map<string, ethers.Contract> = new Map();

  // Endereços dos contratos (seriam diferentes para cada ambiente/rede)
  private contractAddresses = {
    tokenization: {
      1: '0x1234567890123456789012345678901234567890', // Ethereum Mainnet
      137: '0x2345678901234567890123456789012345678901', // Polygon
      56: '0x3456789012345678901234567890123456789012', // BSC
      // Adicionar outras redes conforme necessário
    },
    swapRouter: {
      1: '0x4567890123456789012345678901234567890123', // Ethereum Mainnet
      137: '0x5678901234567890123456789012345678901234', // Polygon
      56: '0x6789012345678901234567890123456789012345', // BSC
      // Adicionar outras redes conforme necessário
    }
  };

  /**
   * Conectar à carteira do usuário
   */
  async connect(): Promise<boolean> {
    try {
      // Verificar se o navegador tem suporte a Ethereum
      if (typeof window !== 'undefined' && window.ethereum) {
        // Solicitar acesso à carteira do usuário
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Criar provider e signer
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        
        // Obter chainId
        const network = await this.provider.getNetwork();
        this.chainId = network.chainId;
        
        // Inicializar contratos
        this.initializeContracts();
        
        this.isConnected = true;
        return true;
      } else {
        console.error('Navegador não suporta Ethereum');
        return false;
      }
    } catch (error) {
      console.error('Erro ao conectar à carteira:', error);
      return false;
    }
  }

  /**
   * Inicializar contratos com base na rede atual
   */
  private initializeContracts() {
    if (!this.chainId || !this.signer) {
      console.error('Chain ID ou Signer não disponíveis');
      return;
    }

    // Inicializar contrato de tokenização
    const tokenizationAddress = this.contractAddresses.tokenization[this.chainId];
    if (tokenizationAddress) {
      this.tokenizationContract = new ethers.Contract(
        tokenizationAddress,
        TOKENIZATION_ABI,
        this.signer
      );
    }

    // Inicializar contrato de swap
    const swapRouterAddress = this.contractAddresses.swapRouter[this.chainId];
    if (swapRouterAddress) {
      this.swapRouterContract = new ethers.Contract(
        swapRouterAddress,
        SWAP_ROUTER_ABI,
        this.signer
      );
    }
  }

  /**
   * Verificar se está conectado à blockchain
   */
  isWalletConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Obter endereço da carteira conectada
   */
  async getWalletAddress(): Promise<string | null> {
    if (!this.signer) return null;
    try {
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Erro ao obter endereço da carteira:', error);
      return null;
    }
  }

  /**
   * Obter saldo de um token
   */
  async getTokenBalance(tokenAddress: string): Promise<string> {
    if (!this.signer || !this.provider) return '0';
    
    try {
      const userAddress = await this.signer.getAddress();
      
      // Obter ou criar contrato do token
      let tokenContract = this.tokenContracts.get(tokenAddress);
      if (!tokenContract) {
        tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
        this.tokenContracts.set(tokenAddress, tokenContract);
      }
      
      // Obter saldo e decimais
      const balance = await tokenContract.balanceOf(userAddress);
      const decimals = await tokenContract.decimals();
      
      // Formatar saldo
      return ethers.utils.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Erro ao obter saldo do token:', error);
      return '0';
    }
  }

  /**
   * Tokenizar um ativo
   */
  async tokenizeAsset(
    assetType: string,
    assetValue: number,
    assetDescription: string
  ): Promise<TokenizationRequest> {
    if (!this.tokenizationContract || !this.signer) {
      throw new Error('Contrato de tokenização não inicializado ou carteira não conectada');
    }

    try {
      // Criar solicitação de tokenização
      const request: TokenizationRequest = {
        id: `request-${Date.now()}`,
        assetType: assetType as any,
        assetValue,
        assetDescription,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        progress: 0
      };

      // Enviar transação para o contrato
      const tx = await this.tokenizationContract.tokenize(
        assetType,
        ethers.utils.parseUnits(assetValue.toString(), 18),
        assetDescription
      );

      // Atualizar status
      request.status = 'PROCESSING';
      request.progress = 25;

      // Aguardar confirmação da transação
      const receipt = await tx.wait();
      
      // Extrair tokenId do evento
      const event = receipt.events?.find(e => e.event === 'AssetTokenized');
      if (event && event.args) {
        const tokenId = event.args.tokenId.toString();
        
        // Atualizar solicitação
        request.status = 'COMPLETED';
        request.tokenId = tokenId;
        request.tokenAddress = this.contractAddresses.tokenization[this.chainId!];
        request.transactionHash = receipt.transactionHash;
        request.completedAt = new Date().toISOString();
        request.progress = 100;
      }

      return request;
    } catch (error) {
      console.error('Erro ao tokenizar ativo:', error);
      throw error;
    }
  }

  /**
   * Obter cotação para swap
   */
  async getSwapQuote(
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string
  ) {
    if (!this.swapRouterContract || !this.provider) {
      throw new Error('Contrato de swap não inicializado ou provider não disponível');
    }

    try {
      // Obter decimais dos tokens
      const fromTokenContract = new ethers.Contract(fromTokenAddress, ERC20_ABI, this.provider);
      const toTokenContract = new ethers.Contract(toTokenAddress, ERC20_ABI, this.provider);
      
      const fromDecimals = await fromTokenContract.decimals();
      const toDecimals = await toTokenContract.decimals();
      
      // Converter amount para unidades do token
      const amountIn = ethers.utils.parseUnits(amount, fromDecimals);
      
      // Obter cotação
      const path = [fromTokenAddress, toTokenAddress];
      const amounts = await this.swapRouterContract.getAmountsOut(amountIn, path);
      
      // Converter resultado para unidades decimais
      const amountOut = ethers.utils.formatUnits(amounts[1], toDecimals);
      
      // Calcular taxa e impacto de preço (simplificado)
      const fee = parseFloat(amount) * 0.003; // 0.3% fee
      const priceImpact = parseFloat(amount) > 1000 ? 1.5 : parseFloat(amount) > 100 ? 0.8 : 0.2;
      
      return {
        fromAmount: parseFloat(amount),
        toAmount: parseFloat(amountOut),
        exchangeRate: parseFloat(amountOut) / parseFloat(amount),
        priceImpact,
        fee,
        minReceived: parseFloat(amountOut) * 0.995, // 0.5% slippage
        route: path,
        estimatedTime: 30 // segundos
      };
    } catch (error) {
      console.error('Erro ao obter cotação para swap:', error);
      throw error;
    }
  }

  /**
   * Executar swap de tokens
   */
  async executeSwap(
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string,
    minAmountOut: string,
    deadline: number = Math.floor(Date.now() / 1000) + 20 * 60 // 20 minutos
  ) {
    if (!this.swapRouterContract || !this.signer) {
      throw new Error('Contrato de swap não inicializado ou carteira não conectada');
    }

    try {
      const userAddress = await this.signer.getAddress();
      
      // Obter decimais dos tokens
      const fromTokenContract = new ethers.Contract(fromTokenAddress, ERC20_ABI, this.signer);
      const fromDecimals = await fromTokenContract.decimals();
      const toTokenContract = new ethers.Contract(toTokenAddress, ERC20_ABI, this.signer);
      const toDecimals = await toTokenContract.decimals();
      
      // Converter valores para unidades do token
      const amountIn = ethers.utils.parseUnits(amount, fromDecimals);
      const amountOutMin = ethers.utils.parseUnits(minAmountOut, toDecimals);
      
      // Aprovar o router para gastar tokens
      const approveTx = await fromTokenContract.approve(
        this.contractAddresses.swapRouter[this.chainId!],
        amountIn
      );
      await approveTx.wait();
      
      // Executar swap
      const path = [fromTokenAddress, toTokenAddress];
      const tx = await this.swapRouterContract.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        userAddress,
        deadline
      );
      
      // Aguardar confirmação
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash
      };
    } catch (error) {
      console.error('Erro ao executar swap:', error);
      throw error;
    }
  }

  /**
   * Obter transações da blockchain
   */
  async getTransactions() {
    if (!this.provider || !this.signer) {
      throw new Error('Provider não inicializado ou carteira não conectada');
    }

    try {
      const userAddress = await this.signer.getAddress();
      
      // Em um ambiente real, isso usaria uma API de indexação como Etherscan, Moralis, etc.
      // para obter o histórico de transações
      
      // Para desenvolvimento, retornamos dados simulados
      return [
        {
          id: `tx-${Date.now()}-1`,
          hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          blockNumber: 12345678,
          timestamp: new Date().toISOString(),
          from: userAddress,
          to: '0xabcdef1234567890abcdef1234567890abcdef12',
          value: 0.5,
          fee: 0.002,
          status: 'SUCCESS',
          type: 'SEND'
        },
        {
          id: `tx-${Date.now()}-2`,
          hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          blockNumber: 12345670,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          from: '0x7890abcdef1234567890abcdef1234567890abcd',
          to: userAddress,
          value: 1.2,
          fee: 0.003,
          status: 'SUCCESS',
          type: 'RECEIVE'
        }
      ];
    } catch (error) {
      console.error('Erro ao obter transações da blockchain:', error);
      throw error;
    }
  }
}

// Criar instância global para uso em toda a aplicação
export const blockchainIntegrationService = new BlockchainIntegrationService(); 