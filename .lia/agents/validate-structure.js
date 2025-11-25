#!/usr/bin/env node

/**
 * 🔍 VALIDADOR DE ESTRUTURA LIA v4.1
 * Valida a estrutura física completa dos 5 agentes locais
 */

const fs = require('fs').promises;
const path = require('path');

class StructureValidator {
  constructor() {
    this.basePath = path.join(__dirname);
    this.agents = ['nexus', 'executor', 'helios', 'atlas', 'thanos'];
    this.requiredStructure = {
      'status': ['agent-status.json', 'health.json', 'metrics.json'],
      'tasks': ['task-queue.json', 'completed-tasks.json'],
      'config': ['agent-config.json'],
      'logs': ['execution.log', 'errors.log', 'performance.log'],
      'scripts': ['start-agent.js']
    };
    this.validationResults = {};
  }

  /**
   * 🔍 Validar estrutura completa
   */
  async validateCompleteStructure() {
    console.log('🔍 VALIDANDO ESTRUTURA FÍSICA LIA v4.1');
    console.log('=' .repeat(60));

    for (const agent of this.agents) {
      console.log(`\n🤖 Validando ${agent.toUpperCase()}...`);
      this.validationResults[agent] = await this.validateAgent(agent);
    }

    await this.generateValidationReport();
    return this.validationResults;
  }

  /**
   * 🤖 Validar agente individual
   */
  async validateAgent(agentName) {
    const agentPath = path.join(this.basePath, agentName);
    const results = {
      directories: {},
      files: {},
      json_validity: {},
      overall_status: 'unknown'
    };

    let totalChecks = 0;
    let passedChecks = 0;

    // Verificar diretórios
    for (const [dir, files] of Object.entries(this.requiredStructure)) {
      const dirPath = path.join(agentPath, dir);

      try {
        await fs.access(dirPath);
        results.directories[dir] = 'exists';
        console.log(`  ✅ ${dir}/`);
        totalChecks++;
        passedChecks++;

        // Verificar arquivos dentro do diretório
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          totalChecks++;

          try {
            await fs.access(filePath);
            results.files[`${dir}/${file}`] = 'exists';

            // Validar JSON se aplicável
            if (file.endsWith('.json')) {
              try {
                const content = await fs.readFile(filePath, 'utf8');
                JSON.parse(content);
                results.json_validity[`${dir}/${file}`] = 'valid';
                console.log(`    ✅ ${dir}/${file} (JSON válido)`);
                passedChecks++;
              } catch (error) {
                results.json_validity[`${dir}/${file}`] = 'invalid';
                console.log(`    ❌ ${dir}/${file} (JSON inválido)`);
              }
            } else {
              console.log(`    ✅ ${dir}/${file}`);
              passedChecks++;
            }

          } catch (error) {
            results.files[`${dir}/${file}`] = 'missing';
            console.log(`    ❌ ${dir}/${file} (não encontrado)`);
          }
        }

      } catch (error) {
        results.directories[dir] = 'missing';
        console.log(`  ❌ ${dir}/ (diretório não encontrado)`);
        totalChecks++;
      }
    }

    // Calcular status geral
    const successRate = Math.round((passedChecks / totalChecks) * 100);
    results.overall_status = successRate >= 90 ? 'excellent' :
                            successRate >= 75 ? 'good' :
                            successRate >= 50 ? 'acceptable' : 'poor';

    results.success_rate = successRate;
    results.passed_checks = passedChecks;
    results.total_checks = totalChecks;

    console.log(`  📊 Status: ${results.overall_status} (${successRate}%)`);

    return results;
  }

  /**
   * 📊 Gerar relatório de validação
   */
  async generateValidationReport() {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RELATÓRIO FINAL DE VALIDAÇÃO');
    console.log('=' .repeat(60));

    let totalAgents = this.agents.length;
    let excellentAgents = 0;
    let goodAgents = 0;
    let acceptableAgents = 0;
    let poorAgents = 0;

    for (const [agent, results] of Object.entries(this.validationResults)) {
      const statusIcon = results.overall_status === 'excellent' ? '🟢' :
                        results.overall_status === 'good' ? '🟡' :
                        results.overall_status === 'acceptable' ? '🟠' : '🔴';

      console.log(`${statusIcon} ${agent.toUpperCase()}: ${results.overall_status} (${results.success_rate}%)`);

      switch (results.overall_status) {
        case 'excellent': excellentAgents++; break;
        case 'good': goodAgents++; break;
        case 'acceptable': acceptableAgents++; break;
        case 'poor': poorAgents++; break;
      }
    }

    console.log('\n📈 RESUMO GERAL:');
    console.log(`🟢 Excellent: ${excellentAgents}/${totalAgents}`);
    console.log(`🟡 Good: ${goodAgents}/${totalAgents}`);
    console.log(`🟠 Acceptable: ${acceptableAgents}/${totalAgents}`);
    console.log(`🔴 Poor: ${poorAgents}/${totalAgents}`);

    const overallSuccess = excellentAgents + goodAgents;
    const systemStatus = overallSuccess >= 4 ? 'SISTEMA PRONTO' :
                        overallSuccess >= 3 ? 'SISTEMA QUASE PRONTO' : 'SISTEMA PRECISA AJUSTES';

    console.log(`\n🎯 STATUS GERAL: ${systemStatus}`);
    console.log(`⚡ EFICIÊNCIA: ${Math.round((overallSuccess / totalAgents) * 100)}%`);

    // Verificar coordenação
    await this.validateCoordination();

    console.log('=' .repeat(60));
  }

  /**
   * 🧠 Validar sistema de coordenação
   */
  async validateCoordination() {
    console.log('\n🧠 VALIDANDO SISTEMA DE COORDENAÇÃO LIA:');

    const coordinationPath = path.join(this.basePath, '..', 'coordination');
    const requiredCoordinationFiles = [
      'lia-master-coordination.json',
      'task-delegation.json',
      'lia-master-control.js'
    ];

    let coordinationOk = true;

    for (const file of requiredCoordinationFiles) {
      const filePath = path.join(coordinationPath, file);
      try {
        await fs.access(filePath);
        console.log(`  ✅ ${file}`);
      } catch (error) {
        console.log(`  ❌ ${file} (não encontrado)`);
        coordinationOk = false;
      }
    }

    console.log(`📡 Coordenação LIA: ${coordinationOk ? '✅ OPERACIONAL' : '❌ INCOMPLETA'}`);
  }

  /**
   * 🚀 Executar validação
   */
  async run() {
    try {
      const results = await this.validateCompleteStructure();

      const successfulAgents = Object.values(results).filter(r =>
        r.overall_status === 'excellent' || r.overall_status === 'good'
      ).length;

      if (successfulAgents >= 4) {
        console.log('\n🎉 ESTRUTURA LIA v4.1 IMPLEMENTADA COM SUCESSO!');
        console.log('🚀 Sistema pronto para integração e operação');
        return true;
      } else {
        console.log('\n⚠️ Estrutura parcialmente implementada');
        console.log(`🔧 ${5 - successfulAgents} agentes precisam de ajustes`);
        return false;
      }

    } catch (error) {
      console.error('❌ Erro na validação:', error);
      return false;
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const validator = new StructureValidator();

  validator.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Erro crítico:', error);
    process.exit(1);
  });
}

module.exports = StructureValidator;