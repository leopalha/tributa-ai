'use strict';

const { Contract } = require('fabric-contract-api');

class CreditTokenContract extends Contract {
  /**
   * Inicializa o contrato inteligente com dados default
   * @param {Context} ctx Contexto da transação
   */
  async initLedger(ctx) {
    console.info('=== CreditTokenContract:initLedger ===');
    // Nenhuma inicialização é necessária
    return { success: true, message: 'Ledger inicializado com sucesso.' };
  }

  /**
   * Cria um novo token para um crédito
   * @param {Context} ctx Contexto da transação
   * @param {String} creditId ID do crédito original
   * @param {String} creditData Dados do crédito em formato JSON
   * @returns {Object} Token criado
   */
  async createCreditToken(ctx, creditId, creditData) {
    console.info('=== CreditTokenContract:createCreditToken ===');
    
    // Verificar se o crédito já existe
    const creditAsBytes = await ctx.stub.getState(creditId);
    if (creditAsBytes && creditAsBytes.length > 0) {
      throw new Error(`O crédito com ID ${creditId} já está tokenizado.`);
    }
    
    // Parsear os dados do crédito
    const credit = JSON.parse(creditData);
    
    // Criar uma ID única para o token
    const tokenId = `TOKEN_${creditId}_${Date.now()}`;
    
    // Criar objeto de token
    const tokenizedCredit = {
      ...credit,
      tokenId: tokenId,
      createdAt: new Date().toISOString()
    };
    
    // Salvar o token no ledger
    await ctx.stub.putState(creditId, Buffer.from(JSON.stringify(tokenizedCredit)));
    
    // Criar um mapeamento por proprietário para consultas
    await this._createOwnerTokenMapping(ctx, tokenizedCredit.ownerId, creditId);
    
    return tokenizedCredit;
  }

  /**
   * Lê um token de crédito pelo ID
   * @param {Context} ctx Contexto da transação
   * @param {String} creditId ID do crédito
   * @returns {Object} Dados do token
   */
  async readCreditToken(ctx, creditId) {
    console.info('=== CreditTokenContract:readCreditToken ===');
    
    const creditAsBytes = await ctx.stub.getState(creditId);
    if (!creditAsBytes || creditAsBytes.length === 0) {
      throw new Error(`O crédito com ID ${creditId} não existe.`);
    }
    
    return JSON.parse(creditAsBytes.toString());
  }

  /**
   * Atualiza o status de um token de crédito
   * @param {Context} ctx Contexto da transação
   * @param {String} creditId ID do crédito
   * @param {String} newStatus Novo status
   * @returns {Object} Token atualizado
   */
  async updateCreditTokenStatus(ctx, creditId, newStatus) {
    console.info('=== CreditTokenContract:updateCreditTokenStatus ===');
    
    // Verificar se o status é válido
    const validStatuses = ['ACTIVE', 'LISTED', 'LOCKED', 'TRANSFERRED', 'EXPIRED'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Status inválido: ${newStatus}. Deve ser um dos seguintes: ${validStatuses.join(', ')}`);
    }
    
    // Obter o token
    const creditAsBytes = await ctx.stub.getState(creditId);
    if (!creditAsBytes || creditAsBytes.length === 0) {
      throw new Error(`O crédito com ID ${creditId} não existe.`);
    }
    
    // Atualizar o status
    const credit = JSON.parse(creditAsBytes.toString());
    credit.status = newStatus;
    credit.updatedAt = new Date().toISOString();
    
    // Salvar a atualização
    await ctx.stub.putState(creditId, Buffer.from(JSON.stringify(credit)));
    
    return credit;
  }

  /**
   * Transfere um token de crédito para outro usuário
   * @param {Context} ctx Contexto da transação
   * @param {String} creditId ID do crédito
   * @param {String} currentOwnerId ID do proprietário atual
   * @param {String} newOwnerId ID do novo proprietário
   * @param {String} newOwnerName Nome do novo proprietário
   * @returns {Object} Token transferido
   */
  async transferCreditToken(ctx, creditId, currentOwnerId, newOwnerId, newOwnerName) {
    console.info('=== CreditTokenContract:transferCreditToken ===');
    
    // Obter o token
    const creditAsBytes = await ctx.stub.getState(creditId);
    if (!creditAsBytes || creditAsBytes.length === 0) {
      throw new Error(`O crédito com ID ${creditId} não existe.`);
    }
    
    // Verificar o proprietário
    const credit = JSON.parse(creditAsBytes.toString());
    if (credit.ownerId !== currentOwnerId) {
      throw new Error(`O usuário ${currentOwnerId} não é o proprietário do token.`);
    }
    
    // Verificar se o token está disponível para transferência
    if (credit.status === 'LOCKED' || credit.status === 'EXPIRED') {
      throw new Error(`O token não pode ser transferido no estado atual: ${credit.status}.`);
    }
    
    // Remover o token do mapeamento do proprietário atual
    await this._removeOwnerTokenMapping(ctx, currentOwnerId, creditId);
    
    // Atualizar proprietário
    credit.ownerId = newOwnerId;
    credit.ownerName = newOwnerName;
    credit.status = 'TRANSFERRED';
    credit.updatedAt = new Date().toISOString();
    
    // Salvar a atualização
    await ctx.stub.putState(creditId, Buffer.from(JSON.stringify(credit)));
    
    // Adicionar o token ao mapeamento do novo proprietário
    await this._createOwnerTokenMapping(ctx, newOwnerId, creditId);
    
    return credit;
  }

  /**
   * Consulta tokens por proprietário
   * @param {Context} ctx Contexto da transação
   * @param {String} ownerId ID do proprietário
   * @returns {Array} Lista de tokens do proprietário
   */
  async queryTokensByOwner(ctx, ownerId) {
    console.info('=== CreditTokenContract:queryTokensByOwner ===');
    
    // Obter o mapeamento de tokens do proprietário
    const ownerKey = this._createOwnerKey(ownerId);
    const ownerTokensAsBytes = await ctx.stub.getState(ownerKey);
    
    // Se não houver mapeamento, retornar lista vazia
    if (!ownerTokensAsBytes || ownerTokensAsBytes.length === 0) {
      return [];
    }
    
    // Parsear o mapeamento
    const ownerTokens = JSON.parse(ownerTokensAsBytes.toString());
    
    // Buscar cada token pelo ID
    const tokensPromises = ownerTokens.map(async (creditId) => {
      const tokenAsBytes = await ctx.stub.getState(creditId);
      if (tokenAsBytes && tokenAsBytes.length > 0) {
        return JSON.parse(tokenAsBytes.toString());
      }
      return null;
    });
    
    // Resolver as promises e filtrar resultados nulos
    const tokens = await Promise.all(tokensPromises);
    return tokens.filter(token => token !== null);
  }

  /**
   * Obtém o histórico de transações de um token
   * @param {Context} ctx Contexto da transação
   * @param {String} creditId ID do crédito
   * @returns {Array} Histórico de transações
   */
  async getHistoryForCreditToken(ctx, creditId) {
    console.info('=== CreditTokenContract:getHistoryForCreditToken ===');
    
    // Obter o iterador do histórico
    const iterator = await ctx.stub.getHistoryForKey(creditId);
    
    const history = [];
    let result = await iterator.next();
    
    while (!result.done) {
      const stringValue = Buffer.from(result.value.value.toString()).toString('utf8');
      let record;
      
      try {
        record = JSON.parse(stringValue);
      } catch (err) {
        console.log(err);
        record = stringValue;
      }
      
      history.push({
        txId: result.value.txId,
        timestamp: new Date(result.value.timestamp.getSeconds() * 1000).toISOString(),
        isDelete: result.value.isDelete,
        value: record
      });
      
      result = await iterator.next();
    }
    
    await iterator.close();
    return history;
  }

  // Métodos auxiliares

  /**
   * Cria uma chave para o mapeamento de proprietário
   * @param {String} ownerId ID do proprietário
   * @returns {String} Chave do proprietário
   */
  _createOwnerKey(ownerId) {
    return `OWNER_${ownerId}`;
  }

  /**
   * Cria ou atualiza o mapeamento de tokens do proprietário
   * @param {Context} ctx Contexto da transação
   * @param {String} ownerId ID do proprietário
   * @param {String} creditId ID do crédito
   */
  async _createOwnerTokenMapping(ctx, ownerId, creditId) {
    const ownerKey = this._createOwnerKey(ownerId);
    const ownerTokensAsBytes = await ctx.stub.getState(ownerKey);
    
    let ownerTokens = [];
    if (ownerTokensAsBytes && ownerTokensAsBytes.length > 0) {
      ownerTokens = JSON.parse(ownerTokensAsBytes.toString());
    }
    
    // Adicionar o token se ele não existir no mapeamento
    if (!ownerTokens.includes(creditId)) {
      ownerTokens.push(creditId);
      await ctx.stub.putState(ownerKey, Buffer.from(JSON.stringify(ownerTokens)));
    }
  }

  /**
   * Remove um token do mapeamento do proprietário
   * @param {Context} ctx Contexto da transação
   * @param {String} ownerId ID do proprietário
   * @param {String} creditId ID do crédito
   */
  async _removeOwnerTokenMapping(ctx, ownerId, creditId) {
    const ownerKey = this._createOwnerKey(ownerId);
    const ownerTokensAsBytes = await ctx.stub.getState(ownerKey);
    
    if (ownerTokensAsBytes && ownerTokensAsBytes.length > 0) {
      let ownerTokens = JSON.parse(ownerTokensAsBytes.toString());
      
      // Remover o token
      ownerTokens = ownerTokens.filter(id => id !== creditId);
      
      // Atualizar o mapeamento
      await ctx.stub.putState(ownerKey, Buffer.from(JSON.stringify(ownerTokens)));
    }
  }
}

module.exports = CreditTokenContract; 