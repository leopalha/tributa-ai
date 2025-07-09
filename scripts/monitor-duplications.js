#!/usr/bin/env node

/**
 * 🔍 SISTEMA DE MONITORAMENTO CONTÍNUO DE DUPLICAÇÕES - TRIBUTA.AI
 * 
 * Este script monitora em tempo real:
 * - Criação de imports duplicados
 * - Definição de componentes conflitantes
 * - Código redundante sendo adicionado
 * - Arquivos similares sendo criados
 * 
 * Autor: Sistema de Monitoramento Contínuo Tributa.AI
 * Data: 2024
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const DuplicationDetector = require('./detect-duplications');

class ContinuousMonitor {
  constructor() {
    this.detector = new DuplicationDetector();
    this.watchedFiles = new Set();
    this.alertThreshold = 2; // Alerta após 2 duplicações
    this.isMonitoring = false;
    this.stats = {
      filesWatched: 0,
      duplicationsDetected: 0,
      alertsSent: 0,
      lastCheck: null
    };
  }

  /**
   * 🎯 Inicia monitoramento contínuo
   */
  async startMonitoring() {
    console.log('🔍 Iniciando monitoramento contínuo de duplicações...\n');
    
    this.isMonitoring = true;
    const srcDir = path.join(process.cwd(), 'src');
    
    // Configura watcher
    const watcher = chokidar.watch(srcDir, {
      ignored: /node_modules/,
      persistent: true,
      ignoreInitial: false
    });
    
    // Eventos do watcher
    watcher
      .on('add', (filePath) => this.onFileAdded(filePath))
      .on('change', (filePath) => this.onFileChanged(filePath))
      .on('unlink', (filePath) => this.onFileDeleted(filePath))
      .on('ready', () => {
        console.log('👀 Monitoramento ativo! Observando arquivos...');
        this.startPeriodicCheck();
      });
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Parando monitoramento...');
      watcher.close();
      this.generateMonitoringReport();
      process.exit(0);
    });
  }

  /**
   * 📁 Arquivo adicionado
   */
  async onFileAdded(filePath) {
    if (this.isSourceFile(filePath)) {
      console.log(`📁 Novo arquivo: ${path.relative(process.cwd(), filePath)}`);
      this.watchedFiles.add(filePath);
      this.stats.filesWatched++;
      
      // Verifica duplicações no novo arquivo
      await this.checkFileForDuplications(filePath);
    }
  }

  /**
   * ✏️ Arquivo modificado
   */
  async onFileChanged(filePath) {
    if (this.isSourceFile(filePath)) {
      console.log(`✏️  Arquivo modificado: ${path.relative(process.cwd(), filePath)}`);
      
      // Verifica duplicações no arquivo modificado
      await this.checkFileForDuplications(filePath);
    }
  }

  /**
   * 🗑️ Arquivo deletado
   */
  onFileDeleted(filePath) {
    if (this.watchedFiles.has(filePath)) {
      console.log(`🗑️ Arquivo removido: ${path.relative(process.cwd(), filePath)}`);
      this.watchedFiles.delete(filePath);
      this.stats.filesWatched--;
    }
  }

  /**
   * 🔍 Verifica duplicações em arquivo específico
   */
  async checkFileForDuplications(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      // Verifica imports duplicados
      const duplicateImports = this.checkDuplicateImports(content);
      if (duplicateImports.length > 0) {
        this.alertDuplication('import', relativePath, duplicateImports);
      }
      
      // Verifica componentes duplicados
      const duplicateComponents = this.checkDuplicateComponents(content);
      if (duplicateComponents.length > 0) {
        this.alertDuplication('component', relativePath, duplicateComponents);
      }
      
      // Verifica funções duplicadas
      const duplicateFunctions = this.checkDuplicateFunctions(content);
      if (duplicateFunctions.length > 0) {
        this.alertDuplication('function', relativePath, duplicateFunctions);
      }
      
    } catch (error) {
      console.error(`❌ Erro ao verificar ${filePath}:`, error.message);
    }
  }

  /**
   * 📥 Verifica imports duplicados
   */
  checkDuplicateImports(content) {
    const imports = [];
    const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    // Encontra duplicados
    const duplicates = [];
    const seen = new Set();
    
    imports.forEach(imp => {
      if (seen.has(imp)) {
        duplicates.push(imp);
      } else {
        seen.add(imp);
      }
    });
    
    return duplicates;
  }

  /**
   * 🧩 Verifica componentes duplicados
   */
  checkDuplicateComponents(content) {
    const components = [];
    const componentRegex = /(?:const|function|class)\s+(\w+)\s*[=:]/g;
    let match;
    
    while ((match = componentRegex.exec(content)) !== null) {
      const name = match[1];
      if (name[0] === name[0].toUpperCase()) {
        components.push(name);
      }
    }
    
    // Encontra duplicados
    const duplicates = [];
    const seen = new Set();
    
    components.forEach(comp => {
      if (seen.has(comp)) {
        duplicates.push(comp);
      } else {
        seen.add(comp);
      }
    });
    
    return duplicates;
  }

  /**
   * 🔧 Verifica funções duplicadas
   */
  checkDuplicateFunctions(content) {
    const functions = [];
    const functionRegex = /(?:const|function)\s+(\w+)\s*[=:]/g;
    let match;
    
    while ((match = functionRegex.exec(content)) !== null) {
      const name = match[1];
      if (name[0] !== name[0].toUpperCase()) {
        functions.push(name);
      }
    }
    
    // Encontra duplicados
    const duplicates = [];
    const seen = new Set();
    
    functions.forEach(func => {
      if (seen.has(func)) {
        duplicates.push(func);
      } else {
        seen.add(func);
      }
    });
    
    return duplicates;
  }

  /**
   * 🚨 Alerta de duplicação
   */
  alertDuplication(type, filePath, duplicates) {
    this.stats.duplicationsDetected++;
    this.stats.alertsSent++;
    
    console.log(`\n🚨 ALERTA DE DUPLICAÇÃO DETECTADA!`);
    console.log(`📁 Arquivo: ${filePath}`);
    console.log(`🔍 Tipo: ${type.toUpperCase()}`);
    console.log(`📋 Duplicados: ${duplicates.join(', ')}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    // Sugere correção automática
    console.log(`💡 Sugestão: Execute 'npm run fix-duplications' para corrigir`);
    console.log('-'.repeat(50));
  }

  /**
   * ⏰ Verificação periódica
   */
  startPeriodicCheck() {
    setInterval(async () => {
      if (this.isMonitoring) {
        console.log(`\n⏰ Verificação periódica - ${new Date().toLocaleTimeString()}`);
        
        // Executa detecção completa
        const duplicates = await this.detector.detectAllDuplications();
        
        const totalIssues = duplicates.imports.length + 
                           duplicates.components.length + 
                           duplicates.functions.length + 
                           duplicates.files.length;
        
        if (totalIssues > 0) {
          console.log(`⚠️  ${totalIssues} duplicações detectadas na verificação completa`);
        } else {
          console.log('✅ Nenhuma duplicação detectada - código limpo!');
        }
        
        this.stats.lastCheck = new Date();
      }
    }, 300000); // 5 minutos
  }

  /**
   * 📊 Gera relatório de monitoramento
   */
  generateMonitoringReport() {
    console.log('\n📋 RELATÓRIO DE MONITORAMENTO - TRIBUTA.AI\n');
    console.log('=' .repeat(60));
    
    console.log(`📊 Estatísticas de Monitoramento:`);
    console.log(`   - Arquivos observados: ${this.stats.filesWatched}`);
    console.log(`   - Duplicações detectadas: ${this.stats.duplicationsDetected}`);
    console.log(`   - Alertas enviados: ${this.stats.alertsSent}`);
    console.log(`   - Última verificação: ${this.stats.lastCheck || 'N/A'}`);
    
    const efficiency = this.stats.duplicationsDetected > 0 ? 
      ((this.stats.alertsSent / this.stats.duplicationsDetected) * 100).toFixed(1) : 100;
    
    console.log(`   - Eficiência de detecção: ${efficiency}%`);
    
    console.log('\n📝 Recomendações:');
    if (this.stats.duplicationsDetected > 0) {
      console.log('   ⚠️  Execute correção automática regularmente');
      console.log('   📚 Considere criar guias de boas práticas');
      console.log('   🔧 Configure hooks de pre-commit para prevenir duplicações');
    } else {
      console.log('   ✅ Excelente! Nenhuma duplicação detectada');
      console.log('   🎯 Continue seguindo as boas práticas');
    }
  }

  /**
   * 🔍 Verifica se é arquivo de código fonte
   */
  isSourceFile(filePath) {
    const ext = path.extname(filePath);
    return ['.ts', '.tsx', '.js', '.jsx'].includes(ext);
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  const monitor = new ContinuousMonitor();
  monitor.startMonitoring().catch(console.error);
}

module.exports = ContinuousMonitor; 