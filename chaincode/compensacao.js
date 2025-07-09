'use strict';

const { Contract } = require('fabric-contract-api');

/**
 * Contrato inteligente para gerenciar o processo de compensação de créditos
 */
class CompensacaoContract extends Contract {
  
  /**
   * Inicializa o ledger com dados iniciais
   * @param {Context} ctx - O contexto da transação
   */
  async initLedger(ctx) {
    console.info('============= INICIANDO O LEDGER DE COMPENSAÇÃO =============');
    
    // Inicialização de dados pode ser feita aqui, se necessário
    const timestamp = new Date().toISOString();
    
    await ctx.stub.putState('INIT_COMPENSACAO', Buffer.from(JSON.stringify({
      status: 'LEDGER_INICIADO',
      mensagem: 'Ledger de compensação inicializado com sucesso',
      timestamp
    })));
    
    console.info('=============== LEDGER INICIALIZADO COM SUCESSO ===============');
    return 'Ledger de compensação inicializado com sucesso';
  }
  
  /**
   * Registra uma nova compensação no ledger
   * @param {Context} ctx - O contexto da transação
   * @param {string} compensacaoJson - Dados da compensação em formato JSON
   */
  async registrarCompensacao(ctx, compensacaoJson) {
    console.info('============= INICIANDO REGISTRO DE COMPENSAÇÃO =============');
    
    const compensacao = JSON.parse(compensacaoJson);
    
    // Validações básicas
    if (!compensacao.id) {
      throw new Error('ID da compensação é obrigatório');
    }
    
    if (!compensacao.valorTotal || compensacao.valorTotal <= 0) {
      throw new Error('Valor total da compensação deve ser maior que zero');
    }
    
    if (!compensacao.debitosIds || !Array.isArray(compensacao.debitosIds) || compensacao.debitosIds.length === 0) {
      throw new Error('Pelo menos um débito deve ser incluído na compensação');
    }
    
    if (!compensacao.creditosIds || !Array.isArray(compensacao.creditosIds) || compensacao.creditosIds.length === 0) {
      throw new Error('Pelo menos um crédito deve ser incluído na compensação');
    }
    
    // Verificar se já existe
    const existingCompensacaoBuffer = await ctx.stub.getState(compensacao.id);
    if (existingCompensacaoBuffer && existingCompensacaoBuffer.length > 0) {
      throw new Error(`Compensação com ID ${compensacao.id} já existe`);
    }
    
    // Adiciona metadados
    compensacao.docType = 'compensacao';
    compensacao.status = compensacao.status || 'PENDENTE';
    compensacao.timestamp = compensacao.timestamp || new Date().toISOString();
    compensacao.historico = [{
      status: compensacao.status,
      timestamp: compensacao.timestamp,
      mensagem: 'Compensação registrada'
    }];
    
    // Salvar no ledger
    await ctx.stub.putState(compensacao.id, Buffer.from(JSON.stringify(compensacao)));
    console.info('============= COMPENSAÇÃO REGISTRADA COM SUCESSO =============');
    
    return JSON.stringify({
      status: 'sucesso',
      mensagem: 'Compensação registrada com sucesso',
      id: compensacao.id
    });
  }
  
  /**
   * Atualiza o status de uma compensação
   * @param {Context} ctx - O contexto da transação
   * @param {string} compensacaoId - ID da compensação
   * @param {string} novoStatus - Novo status da compensação
   * @param {string} timestamp - Timestamp da atualização
   */
  async atualizarStatusCompensacao(ctx, compensacaoId, novoStatus, timestamp) {
    console.info('============= INICIANDO ATUALIZAÇÃO DE STATUS DA COMPENSAÇÃO =============');
    
    // Obter compensação existente
    const compensacaoBuffer = await ctx.stub.getState(compensacaoId);
    if (!compensacaoBuffer || compensacaoBuffer.length === 0) {
      throw new Error(`Compensação com ID ${compensacaoId} não encontrada`);
    }
    
    const compensacao = JSON.parse(compensacaoBuffer.toString());
    
    // Validar status
    const statusesValidos = ['PENDENTE', 'EXECUTADA', 'FALHOU', 'CANCELADA'];
    if (!statusesValidos.includes(novoStatus)) {
      throw new Error(`Status ${novoStatus} inválido. Status válidos: ${statusesValidos.join(', ')}`);
    }
    
    // Atualizar dados
    const statusAntigo = compensacao.status;
    compensacao.status = novoStatus;
    compensacao.ultimaAtualizacao = timestamp || new Date().toISOString();
    
    // Adicionar ao histórico
    compensacao.historico.push({
      status: novoStatus,
      timestamp: compensacao.ultimaAtualizacao,
      statusAntigo,
      mensagem: `Status atualizado de ${statusAntigo} para ${novoStatus}`
    });
    
    // Salvar no ledger
    await ctx.stub.putState(compensacaoId, Buffer.from(JSON.stringify(compensacao)));
    console.info('============= STATUS DA COMPENSAÇÃO ATUALIZADO COM SUCESSO =============');
    
    return JSON.stringify({
      status: 'sucesso',
      mensagem: 'Status da compensação atualizado com sucesso',
      id: compensacaoId,
      novoStatus
    });
  }
  
  /**
   * Consulta uma compensação por ID
   * @param {Context} ctx - O contexto da transação
   * @param {string} compensacaoId - ID da compensação
   */
  async consultarCompensacao(ctx, compensacaoId) {
    const compensacaoBuffer = await ctx.stub.getState(compensacaoId);
    if (!compensacaoBuffer || compensacaoBuffer.length === 0) {
      throw new Error(`Compensação com ID ${compensacaoId} não encontrada`);
    }
    
    return compensacaoBuffer.toString();
  }
  
  /**
   * Consulta o histórico de uma compensação
   * @param {Context} ctx - O contexto da transação
   * @param {string} compensacaoId - ID da compensação
   */
  async consultarHistoricoCompensacao(ctx, compensacaoId) {
    // Verificar se a compensação existe
    const compensacaoBuffer = await ctx.stub.getState(compensacaoId);
    if (!compensacaoBuffer || compensacaoBuffer.length === 0) {
      throw new Error(`Compensação com ID ${compensacaoId} não encontrada`);
    }
    
    // Obter histórico
    const iterator = await ctx.stub.getHistoryForKey(compensacaoId);
    const historico = [];
    
    let resultado = await iterator.next();
    while (!resultado.done) {
      const modificacao = resultado.value;
      
      // Conversão de timestamp do protobuf para ISO string
      const timestamp = new Date(modificacao.timestamp.seconds.low * 1000).toISOString();
      
      historico.push({
        txId: modificacao.txId,
        timestamp,
        valor: JSON.parse(modificacao.value.toString('utf8')),
        isDelete: modificacao.isDelete
      });
      
      resultado = await iterator.next();
    }
    
    await iterator.close();
    return JSON.stringify(historico);
  }
  
  /**
   * Verifica a validade de uma compensação
   * @param {Context} ctx - O contexto da transação
   * @param {string} compensacaoId - ID da compensação
   */
  async verificarCompensacao(ctx, compensacaoId) {
    // Obter compensação
    const compensacaoBuffer = await ctx.stub.getState(compensacaoId);
    if (!compensacaoBuffer || compensacaoBuffer.length === 0) {
      return JSON.stringify({
        valida: false,
        mensagem: `Compensação com ID ${compensacaoId} não encontrada`
      });
    }
    
    const compensacao = JSON.parse(compensacaoBuffer.toString());
    
    // Validações de integridade
    const validacoes = [];
    
    // Verificar se tem créditos e débitos
    if (!compensacao.debitosIds || compensacao.debitosIds.length === 0) {
      validacoes.push('Não há débitos associados à compensação');
    }
    
    if (!compensacao.creditosIds || compensacao.creditosIds.length === 0) {
      validacoes.push('Não há créditos associados à compensação');
    }
    
    // Verificar valor
    if (!compensacao.valorTotal || compensacao.valorTotal <= 0) {
      validacoes.push('Valor total da compensação inválido');
    }
    
    // Resultado da validação
    const valida = validacoes.length === 0;
    
    return JSON.stringify({
      valida,
      mensagem: valida ? 'Compensação válida' : 'Compensação inválida',
      validacoes: validacoes,
      compensacaoId
    });
  }
  
  /**
   * Consulta todas as compensações por usuário
   * @param {Context} ctx - O contexto da transação
   * @param {string} userId - ID do usuário
   */
  async consultarCompensacoesPorUsuario(ctx, userId) {
    const startKey = '';
    const endKey = '';
    const iterator = await ctx.stub.getStateByRange(startKey, endKey);
    
    const compensacoes = [];
    let resultado = await iterator.next();
    
    while (!resultado.done) {
      const compensacao = JSON.parse(resultado.value.toString('utf8'));
      
      // Filtrar pelo usuário e tipo de documento
      if (compensacao.docType === 'compensacao' && compensacao.userId === userId) {
        compensacoes.push(compensacao);
      }
      
      resultado = await iterator.next();
    }
    
    await iterator.close();
    return JSON.stringify(compensacoes);
  }
}

module.exports = CompensacaoContract; 