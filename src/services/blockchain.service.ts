import { submitTransaction, evaluateTransaction } from '@/lib/fabric/gateway';
import { CreditTitle, TokenizationDetails } from '@/types/prisma';

/**
 * Serviço para interação com a blockchain Hyperledger Fabric
 */
export class BlockchainService {
  private static instance: BlockchainService;

  private constructor() {}

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  /**
   * Tokeniza um título de crédito na blockchain
   * @param creditTitle Título de crédito a ser tokenizado
   * @param userId ID do usuário proprietário do token
   */
  public async tokenizeCredit(
    creditTitle: CreditTitle,
    userId: string
  ): Promise<TokenizationDetails> {
    try {
      // Preparar os dados para o chaincode
      const tokenId = creditTitle.id;
      const ownerId = userId;
      const originalValue = creditTitle.value.toString();
      const category = creditTitle.category;
      const subtype = creditTitle.subtype;
      const issuerName = creditTitle.issuerName;

      // Opcional: criar um hash dos metadados para referência cruzada
      const metadataHash = this.createMetadataHash(creditTitle);

      // Chamar o smart contract para criar o token
      const result = await submitTransaction(
        userId, // ID do usuário para autenticação na rede
        'CreateCreditToken',
        tokenId,
        ownerId,
        originalValue,
        category,
        subtype,
        issuerName,
        metadataHash
      );

      // Extrair o hash da transação do resultado
      const txId = result.toString();

      // Retornar os detalhes da tokenização
      return {
        blockchainPlatform: 'Hyperledger Fabric',
        tokenStandard: 'Tributa.AI Token',
        transactionHash: txId,
        tokenAddress: tokenId, // No Fabric, o ID do token serve como "endereço"
        tokenizedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erro ao tokenizar crédito na blockchain:', error);
      throw new Error(`Falha na tokenização: ${error.message}`);
    }
  }

  /**
   * Tokeniza um ativo na blockchain (método alias para compatibilidade)
   */
  public async tokenizarAtivo(ativo: any): Promise<string> {
    try {
      const result = await this.tokenizeCredit(ativo, ativo.userId || 'system');
      return result.tokenAddress;
    } catch (error) {
      console.error('Erro ao tokenizar ativo:', error);
      throw error;
    }
  }

  /**
   * Atualiza um ativo na blockchain
   */
  public async atualizarAtivo(tokenId: string, dados: any): Promise<void> {
    try {
      await this.updateTokenStatus(tokenId, dados.userId || 'system', dados.status || 'updated');
    } catch (error) {
      console.error('Erro ao atualizar ativo:', error);
      throw error;
    }
  }

  /**
   * Cancela um ativo na blockchain
   */
  public async cancelarAtivo(tokenId: string): Promise<void> {
    try {
      await this.updateTokenStatus(tokenId, 'system', 'cancelled');
    } catch (error) {
      console.error('Erro ao cancelar ativo:', error);
      throw error;
    }
  }

  /**
   * Transfere um ativo na blockchain
   */
  public async transferirAtivo(transferencia: {
    tokenId: string;
    de: string;
    para: string;
    valor: number;
  }): Promise<string> {
    try {
      const result = await submitTransaction(
        transferencia.de,
        'TransferirToken',
        transferencia.tokenId,
        transferencia.para,
        transferencia.valor.toString()
      );

      return result.toString();
    } catch (error) {
      console.error('Erro ao transferir ativo na blockchain:', error);
      throw new Error(`Falha na transferência: ${error.message}`);
    }
  }

  /**
   * Consulta um token na blockchain
   * @param tokenId ID do token a ser consultado
   * @param userId ID do usuário fazendo a consulta
   */
  public async queryToken(tokenId: string, userId: string): Promise<any> {
    try {
      const result = await evaluateTransaction(userId, 'QueryCreditToken', tokenId);

      return JSON.parse(result.toString());
    } catch (error) {
      console.error('Erro ao consultar token na blockchain:', error);
      throw new Error(`Falha na consulta: ${error.message}`);
    }
  }

  /**
   * Transfere um token para um novo proprietário
   * @param tokenId ID do token a ser transferido
   * @param currentOwnerId ID do proprietário atual
   * @param newOwnerId ID do novo proprietário
   */
  public async transferToken(
    tokenId: string,
    currentOwnerId: string,
    newOwnerId: string
  ): Promise<any> {
    try {
      const result = await submitTransaction(
        currentOwnerId, // Apenas o proprietário atual pode transferir
        'TransferCreditToken',
        tokenId,
        newOwnerId
      );

      return result.toString();
    } catch (error) {
      console.error('Erro ao transferir token na blockchain:', error);
      throw new Error(`Falha na transferência: ${error.message}`);
    }
  }

  /**
   * Atualiza o status de um token na blockchain
   * @param tokenId ID do token
   * @param userId ID do usuário proprietário
   * @param newStatus Novo status do token
   */
  public async updateTokenStatus(tokenId: string, userId: string, newStatus: string): Promise<any> {
    try {
      const result = await submitTransaction(userId, 'UpdateCreditTokenStatus', tokenId, newStatus);

      return result.toString();
    } catch (error) {
      console.error('Erro ao atualizar status do token na blockchain:', error);
      throw new Error(`Falha na atualização de status: ${error.message}`);
    }
  }

  /**
   * Cria um hash dos metadados do título de crédito para referência cruzada
   * @param creditTitle Título de crédito
   * @returns Hash dos metadados
   */
  private createMetadataHash(creditTitle: CreditTitle): string {
    // Implementação simplificada - em produção, usar uma função hash criptográfica adequada
    const metadataStr = JSON.stringify({
      id: creditTitle.id,
      title: creditTitle.title,
      value: creditTitle.value,
      category: creditTitle.category,
      subtype: creditTitle.subtype,
      issueDate: creditTitle.issueDate,
      timestamp: new Date().toISOString(),
    });

    // Simulação de hash - em produção, usar crypto.createHash
    return `meta-${Buffer.from(metadataStr).toString('base64').substring(0, 32)}`;
  }

  /**
   * Lista todos os tokens de crédito
   * @param userId ID do usuário fazendo a consulta (opcional para filtrar apenas os tokens do usuário)
   */
  public async listTokens(userId?: string): Promise<any[]> {
    try {
      const result = await evaluateTransaction(
        userId || 'system',
        'ListCreditTokens',
        userId || ''
      );

      return JSON.parse(result.toString());
    } catch (error) {
      console.error('Erro ao listar tokens na blockchain:', error);
      throw new Error(`Falha na listagem: ${error.message}`);
    }
  }

  /**
   * Registra uma operação genérica na blockchain para auditoria
   * @param operacao Dados da operação a ser registrada
   */
  public async registrarOperacao(operacao: {
    tipo: string;
    operacao: string;
    dados: any;
    timestamp: Date;
  }): Promise<string> {
    try {
      const result = await submitTransaction(
        'system',
        'RegistrarOperacao',
        operacao.tipo,
        operacao.operacao,
        JSON.stringify(operacao.dados),
        operacao.timestamp.toISOString()
      );

      return result.toString();
    } catch (error) {
      console.error('Erro ao registrar operação na blockchain:', error);
      throw new Error(`Falha no registro: ${error.message}`);
    }
  }

  /**
   * Processa uma compensação na blockchain
   * @param compensacao Dados da compensação
   */
  public async processarCompensacao(compensacao: {
    solicitacaoId: string;
    creditos: any[];
    debitos: any[];
  }): Promise<any> {
    try {
      const result = await submitTransaction(
        'system',
        'ProcessarCompensacao',
        compensacao.solicitacaoId,
        JSON.stringify(compensacao.creditos),
        JSON.stringify(compensacao.debitos)
      );

      return {
        sucesso: true,
        protocolo: result.toString(),
        creditosProcessados: compensacao.creditos.map(c => ({
          creditoId: c.id,
          valorUtilizado: c.valor,
          status: 'PROCESSADO',
        })),
        debitosProcessados: compensacao.debitos.map(d => ({
          debitoId: d.id,
          valorCompensado: d.valor,
          status: 'COMPENSADO',
        })),
        alertas: [],
        erros: [],
      };
    } catch (error) {
      console.error('Erro ao processar compensação na blockchain:', error);
      return {
        sucesso: false,
        erros: [error.message],
        alertas: [],
        creditosProcessados: [],
        debitosProcessados: [],
      };
    }
  }
}

// Export singleton instance for compatibility
export const blockchainService = BlockchainService.getInstance();
