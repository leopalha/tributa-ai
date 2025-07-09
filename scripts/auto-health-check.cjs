#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');

// === SISTEMA DE AUTO-DIAGNÓSTICO TRIBUTA.AI ===

class HealthChecker {
  constructor() {
    this.isRunning = false;
    this.errorCount = 0;
    this.fixesApplied = 0;
  }

  async start() {
    console.log('🏥 Iniciando Sistema de Saúde da Plataforma Tributa.AI');
    console.log('⏰ Verificações automáticas a cada 30 minutos\n');
    
    this.isRunning = true;
    
    // Verificação inicial
    await this.performCheck();
    
    // Verificações periódicas
    setInterval(() => this.performCheck(), 30 * 60 * 1000);
  }

  async performCheck() {
    const timestamp = new Date().toLocaleString('pt-BR');
    console.log(`🔍 [${timestamp}] Verificando saúde da plataforma...`);
    
    try {
      // 1. Verificar erros TypeScript
      const tsErrors = await this.checkTypeScript();
      
      // 2. Verificar tipos duplicados
      const duplicates = await this.checkDuplicates();
      
      // 3. Aplicar correções automáticas
      const fixes = await this.autoFix();
      
      // 4. Gerar relatório
      this.displayReport(tsErrors, duplicates, fixes, timestamp);
      
    } catch (error) {
      console.error('❌ Erro na verificação:', error.message);
    }
  }

  async checkTypeScript() {
    return new Promise((resolve) => {
      exec('npx tsc --noEmit', (error, stdout, stderr) => {
        if (!error) {
          resolve(0);
          return;
        }
        
        const output = stdout || stderr || '';
        const match = output.match(/Found (\d+) error/);
        resolve(match ? parseInt(match[1]) : 0);
      });
    });
  }

  async checkDuplicates() {
    const duplicates = [];
    
    // Verificar duplicações conhecidas
    const issues = [
      { name: 'TituloCredito', files: ['tc.ts', 'titulo-credito.ts'] },
      { name: 'BotProfile', files: ['bots.ts', 'enhanced-bots.ts'] },
      { name: 'Analytics', files: ['analytics.ts', 'analytics-advanced.ts'] }
    ];
    
    try {
      const typesDir = 'src/types';
      const files = fs.readdirSync(typesDir);
      
      for (const issue of issues) {
        const existing = issue.files.filter(f => files.includes(f));
        if (existing.length > 1) {
          duplicates.push({ type: issue.name, files: existing });
        }
      }
    } catch (error) {
      console.warn('⚠️ Erro ao verificar duplicatas:', error.message);
    }
    
    return duplicates;
  }

  async autoFix() {
    let fixes = 0;
    
    try {
      // Auto-formatação com Prettier
      await new Promise((resolve) => {
        exec('npx prettier --write "src/**/*.{ts,tsx}" --silent', (error) => {
          if (!error) {
            fixes++;
            console.log('✅ Formatação automática aplicada');
          }
          resolve();
        });
      });
      
    } catch (error) {
      console.warn('⚠️ Erro nas correções automáticas:', error.message);
    }
    
    return fixes;
  }

  displayReport(tsErrors, duplicates, fixes, timestamp) {
    // Determinar status
    let status = '🟢 SAUDÁVEL';
    let recommendations = [];
    
    if (tsErrors > 100) {
      status = '🔴 CRÍTICO';
      recommendations.push('URGENTE: Reduzir erros TypeScript massivamente');
    } else if (tsErrors > 50) {
      status = '🟡 ATENÇÃO';
      recommendations.push('Trabalhar na redução de erros TypeScript');
    }
    
    if (duplicates.length > 3) {
      recommendations.push('Consolidar tipos duplicados');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Sistema funcionando bem - manter monitoramento');
    }

    // Exibir relatório
    console.log('\n' + '='.repeat(50));
    console.log(`STATUS: ${status}`);
    console.log('='.repeat(50));
    console.log(`📊 Erros TypeScript: ${tsErrors}`);
    console.log(`🔄 Tipos Duplicados: ${duplicates.length}`);
    console.log(`🔧 Correções Aplicadas: ${fixes}`);
    
    if (duplicates.length > 0) {
      console.log('\n📋 Duplicações Detectadas:');
      duplicates.forEach(dup => {
        console.log(`   • ${dup.type}: ${dup.files.join(', ')}`);
      });
    }
    
    console.log('\n💡 Recomendações:');
    recommendations.forEach(rec => {
      console.log(`   • ${rec}`);
    });
    
    console.log('='.repeat(50));
    
    this.errorCount = tsErrors;
    this.fixesApplied += fixes;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      errorCount: this.errorCount,
      fixesApplied: this.fixesApplied
    };
  }
}

// === EXECUÇÃO ===

if (require.main === module) {
  const checker = new HealthChecker();
  const args = process.argv.slice(2);
  
  if (args.includes('--once')) {
    checker.performCheck().then(() => {
      console.log('\n✅ Verificação única concluída');
      process.exit(0);
    });
  } else if (args.includes('--start')) {
    checker.start();
  } else {
    console.log(`
🏥 Sistema de Auto-Diagnóstico Tributa.AI

Uso:
  node scripts/auto-health-check.js --once    # Verificação única
  node scripts/auto-health-check.js --start   # Monitoramento contínuo

Funcionalidades:
  ✅ Detecta erros TypeScript
  ✅ Identifica tipos duplicados  
  ✅ Aplica correções automáticas
  ✅ Gera relatórios de saúde
  ✅ Recomendações inteligentes
`);
  }
}

module.exports = HealthChecker; 