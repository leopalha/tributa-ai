#!/usr/bin/env node

/**
 * 🧪 TESTE DE TIPOS DE TASK - GENESIS
 *
 * Este script testa se o GENESIS consegue processar todos os tipos
 * de task suportados sem erro "Unknown task type"
 */

const fs = require('fs').promises;
const path = require('path');

class GenesisTaskTester {
  constructor() {
    this.taskQueueFile = path.join(__dirname, 'tasks', 'task-queue.json');
    this.testResults = [];
  }

  async createTestTasks() {
    const testTasks = [
      {
        id: 'test-001',
        type: 'error_correction',
        description: 'Teste de correção de erros',
        status: 'pending',
        data: { test: true },
        priority: 'high',
        createdAt: new Date().toISOString()
      },
      {
        id: 'test-002',
        type: 'performance_optimization',
        description: 'Teste de otimização de performance',
        status: 'pending',
        data: { test: true },
        priority: 'medium',
        createdAt: new Date().toISOString()
      },
      {
        id: 'test-003',
        type: 'optimization',
        description: 'Teste de otimização (nome alternativo)',
        status: 'pending',
        data: { test: true },
        priority: 'medium',
        createdAt: new Date().toISOString()
      },
      {
        id: 'test-004',
        type: 'code_generation',
        description: 'Teste de geração de código',
        status: 'pending',
        data: { test: true },
        priority: 'medium',
        createdAt: new Date().toISOString()
      },
      {
        id: 'test-005',
        type: 'style_fix',
        description: 'Teste de correção de estilos',
        status: 'pending',
        data: { test: true },
        priority: 'low',
        createdAt: new Date().toISOString()
      },
      {
        id: 'test-006',
        type: 'ui_improvement',
        description: 'Teste de melhoria de UI',
        status: 'pending',
        data: { test: true },
        priority: 'medium',
        createdAt: new Date().toISOString()
      },
      {
        id: 'test-007',
        type: 'security_audit',
        description: 'Teste de auditoria de segurança',
        status: 'pending',
        data: { test: true },
        priority: 'high',
        createdAt: new Date().toISOString()
      },
      {
        id: 'test-008',
        type: 'file_cleanup',
        description: 'Teste de limpeza de arquivos',
        status: 'pending',
        data: { test: true },
        priority: 'low',
        createdAt: new Date().toISOString()
      },
      {
        id: 'test-009',
        type: 'analysis',
        description: 'Teste de análise de codebase',
        status: 'pending',
        data: { test: true },
        priority: 'medium',
        createdAt: new Date().toISOString()
      }
    ];

    const taskQueue = {
      tasks: testTasks,
      lastUpdated: new Date().toISOString(),
      totalTasks: testTasks.length,
      pendingTasks: testTasks.length,
      completedTasks: 0,
      failedTasks: 0
    };

    await fs.writeFile(this.taskQueueFile, JSON.stringify(taskQueue, null, 2));
    console.log(`✅ ${testTasks.length} tarefas de teste criadas na fila`);

    return testTasks;
  }

  async testWithStartGenesis() {
    console.log('\n🧪 TESTANDO start-genesis.js...');

    try {
      const GenesisAgent = require('./start-genesis.js');
      const genesis = new GenesisAgent();

      await genesis.initialize();

      // Simular execução de cada tipo de task
      const testTasks = await this.createTestTasks();

      for (const task of testTasks) {
        try {
          console.log(`🎯 Testando tipo: ${task.type}`);
          await genesis.executeTask(task);
          this.testResults.push({
            agent: 'start-genesis',
            taskType: task.type,
            status: 'success',
            error: null
          });
          console.log(`✅ ${task.type}: SUCESSO`);
        } catch (error) {
          this.testResults.push({
            agent: 'start-genesis',
            taskType: task.type,
            status: 'error',
            error: error.message
          });
          console.log(`❌ ${task.type}: ERRO - ${error.message}`);
        }
      }

    } catch (error) {
      console.error(`❌ Erro ao testar start-genesis: ${error.message}`);
    }
  }

  async testWithRealGenesis() {
    console.log('\n🧪 TESTANDO real-genesis.js...');

    try {
      const { RealGenesisAgent } = require('./real-genesis.js');
      const genesis = new RealGenesisAgent();

      await genesis.initialize();

      // Simular execução de cada tipo de task
      const testTasks = await this.createTestTasks();

      for (const task of testTasks) {
        try {
          console.log(`🎯 Testando tipo: ${task.type}`);
          const result = await genesis.executeTask(task);
          this.testResults.push({
            agent: 'real-genesis',
            taskType: task.type,
            status: result ? 'success' : 'failed',
            error: null
          });
          console.log(`✅ ${task.type}: ${result ? 'SUCESSO' : 'FALHOU'}`);
        } catch (error) {
          this.testResults.push({
            agent: 'real-genesis',
            taskType: task.type,
            status: 'error',
            error: error.message
          });
          console.log(`❌ ${task.type}: ERRO - ${error.message}`);
        }
      }

    } catch (error) {
      console.error(`❌ Erro ao testar real-genesis: ${error.message}`);
    }
  }

  async generateReport() {
    console.log('\n📊 RELATÓRIO DE TESTES:');
    console.log('='.repeat(50));

    const taskTypes = [...new Set(this.testResults.map(r => r.taskType))];

    for (const taskType of taskTypes) {
      console.log(`\n🎯 ${taskType}:`);

      const startGenesisResult = this.testResults.find(r =>
        r.agent === 'start-genesis' && r.taskType === taskType
      );
      const realGenesisResult = this.testResults.find(r =>
        r.agent === 'real-genesis' && r.taskType === taskType
      );

      console.log(`  start-genesis: ${startGenesisResult ?
        (startGenesisResult.status === 'success' ? '✅ SUCESSO' :
         startGenesisResult.status === 'failed' ? '⚠️ FALHOU' : '❌ ERRO') :
        '❓ NÃO TESTADO'}`);

      console.log(`  real-genesis:  ${realGenesisResult ?
        (realGenesisResult.status === 'success' ? '✅ SUCESSO' :
         realGenesisResult.status === 'failed' ? '⚠️ FALHOU' : '❌ ERRO') :
        '❓ NÃO TESTADO'}`);
    }

    // Estatísticas
    const totalTests = this.testResults.length;
    const successTests = this.testResults.filter(r => r.status === 'success').length;
    const errorTests = this.testResults.filter(r => r.status === 'error').length;

    console.log('\n📈 ESTATÍSTICAS:');
    console.log(`Total de testes: ${totalTests}`);
    console.log(`Sucessos: ${successTests} (${((successTests/totalTests)*100).toFixed(1)}%)`);
    console.log(`Erros: ${errorTests} (${((errorTests/totalTests)*100).toFixed(1)}%)`);

    // Salvar relatório
    const reportPath = path.join(__dirname, 'reports', `task-types-test-${Date.now()}.json`);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      results: this.testResults,
      statistics: {
        total: totalTests,
        success: successTests,
        error: errorTests,
        successRate: ((successTests/totalTests)*100).toFixed(1)
      }
    }, null, 2));

    console.log(`\n📄 Relatório salvo em: ${reportPath}`);

    if (errorTests === 0) {
      console.log('\n🎉 TODOS OS TIPOS DE TASK FUNCIONAM CORRETAMENTE!');
      return true;
    } else {
      console.log(`\n⚠️ ${errorTests} tipos de task ainda têm problemas.`);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 INICIANDO TESTE DE TIPOS DE TASK DO GENESIS...');

    await this.testWithStartGenesis();
    await this.testWithRealGenesis();

    const allPassed = await this.generateReport();

    return allPassed;
  }
}

// Executar testes se chamado diretamente
async function main() {
  const tester = new GenesisTaskTester();

  try {
    const success = await tester.runAllTests();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Erro fatal nos testes:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = GenesisTaskTester;