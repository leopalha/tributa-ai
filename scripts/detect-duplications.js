#!/usr/bin/env node

/**
 * 🔍 SISTEMA DE DETECÇÃO DE DUPLICAÇÕES - TRIBUTA.AI
 * 
 * Este script detecta e previne:
 * - Imports duplicados
 * - Componentes conflitantes
 * - Funções redundantes
 * - Arquivos similares
 * - Código duplicado
 * 
 * Autor: Sistema de Monitoramento Tributa.AI
 * Data: 2024
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class DuplicationDetector {
  constructor() {
    this.duplicates = {
      imports: [],
      components: [],
      functions: [],
      files: [],
      variables: []
    };
    this.fileHashes = new Map();
    this.componentRegistry = new Map();
    this.importRegistry = new Map();
    this.functionRegistry = new Map();
    this.variableRegistry = new Map();
  }

  /**
   * 🎯 Função principal de detecção
   */
  async detectAllDuplications() {
    console.log('🔍 Iniciando detecção de duplicações...\n');
    
    const srcDir = path.join(process.cwd(), 'src');
    await this.scanDirectory(srcDir);
    
    this.analyzeResults();
    this.generateReport();
    
    return this.duplicates;
  }

  /**
   * 📁 Escaneia diretório recursivamente
   */
  async scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        await this.scanDirectory(filePath);
      } else if (this.isSourceFile(filePath)) {
        await this.analyzeFile(filePath);
      }
    }
  }

  /**
   * 🔍 Verifica se é arquivo de código fonte
   */
  isSourceFile(filePath) {
    const ext = path.extname(filePath);
    return ['.ts', '.tsx', '.js', '.jsx'].includes(ext);
  }

  /**
   * 📄 Analisa arquivo individual
   */
  async analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      // Gera hash do arquivo
      const hash = crypto.createHash('md5').update(content).digest('hex');
      if (this.fileHashes.has(hash)) {
        this.duplicates.files.push({
          file1: this.fileHashes.get(hash),
          file2: relativePath,
          similarity: 100
        });
      } else {
        this.fileHashes.set(hash, relativePath);
      }
      
      // Analisa imports
      this.analyzeImports(content, relativePath);
      
      // Analisa componentes
      this.analyzeComponents(content, relativePath);
      
      // Analisa funções
      this.analyzeFunctions(content, relativePath);
      
      // Analisa variáveis
      this.analyzeVariables(content, relativePath);
      
    } catch (error) {
      console.error(`❌ Erro ao analisar ${filePath}:`, error.message);
    }
  }

  /**
   * 📥 Analisa imports duplicados
   */
  analyzeImports(content, filePath) {
    const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      const fullImport = match[0];
      
      imports.push({
        path: importPath,
        statement: fullImport,
        line: this.getLineNumber(content, match.index)
      });
    }
    
    // Detecta imports duplicados no mesmo arquivo
    const importCounts = {};
    imports.forEach(imp => {
      const key = `${filePath}:${imp.path}`;
      if (!importCounts[key]) {
        importCounts[key] = [];
      }
      importCounts[key].push(imp);
    });
    
    Object.entries(importCounts).forEach(([key, imps]) => {
      if (imps.length > 1) {
        this.duplicates.imports.push({
          file: filePath,
          import: imps[0].path,
          occurrences: imps.length,
          lines: imps.map(i => i.line)
        });
      }
    });
    
    // Registra imports globalmente
    imports.forEach(imp => {
      const globalKey = imp.path;
      if (!this.importRegistry.has(globalKey)) {
        this.importRegistry.set(globalKey, []);
      }
      this.importRegistry.get(globalKey).push({
        file: filePath,
        ...imp
      });
    });
  }

  /**
   * 🧩 Analisa componentes duplicados
   */
  analyzeComponents(content, filePath) {
    // Componentes React
    const componentRegex = /(?:const|function|class)\s+(\w+)\s*[=:]\s*(?:\([^)]*\)\s*=>|function|\{)/g;
    const exportRegex = /export\s+(?:default\s+)?(?:const|function|class)\s+(\w+)/g;
    
    let match;
    
    // Detecta definições de componentes
    while ((match = componentRegex.exec(content)) !== null) {
      const componentName = match[1];
      
      // Verifica se é um componente React (começa com maiúscula)
      if (componentName[0] === componentName[0].toUpperCase()) {
        this.registerComponent(componentName, filePath, match.index, content);
      }
    }
    
    // Detecta exports
    while ((match = exportRegex.exec(content)) !== null) {
      const componentName = match[1];
      if (componentName[0] === componentName[0].toUpperCase()) {
        this.registerComponent(componentName, filePath, match.index, content);
      }
    }
  }

  /**
   * 📝 Registra componente
   */
  registerComponent(name, filePath, index, content) {
    if (!this.componentRegistry.has(name)) {
      this.componentRegistry.set(name, []);
    }
    
    this.componentRegistry.get(name).push({
      file: filePath,
      line: this.getLineNumber(content, index),
      name: name
    });
  }

  /**
   * 🔧 Analisa funções duplicadas
   */
  analyzeFunctions(content, filePath) {
    const functionRegex = /(?:const|function)\s+(\w+)\s*[=:]\s*(?:\([^)]*\)\s*=>|function)/g;
    let match;
    
    while ((match = functionRegex.exec(content)) !== null) {
      const functionName = match[1];
      
      // Ignora componentes React (começam com maiúscula)
      if (functionName[0] !== functionName[0].toUpperCase()) {
        if (!this.functionRegistry.has(functionName)) {
          this.functionRegistry.set(functionName, []);
        }
        
        this.functionRegistry.get(functionName).push({
          file: filePath,
          line: this.getLineNumber(content, match.index),
          name: functionName
        });
      }
    }
  }

  /**
   * 🏷️ Analisa variáveis duplicadas
   */
  analyzeVariables(content, filePath) {
    const variableRegex = /(?:const|let|var)\s+(\w+)\s*=/g;
    let match;
    
    while ((match = variableRegex.exec(content)) !== null) {
      const variableName = match[1];
      
      // Ignora componentes e funções
      if (variableName[0] !== variableName[0].toUpperCase() && 
          !variableName.includes('Handler') && 
          !variableName.includes('Function')) {
        
        if (!this.variableRegistry.has(variableName)) {
          this.variableRegistry.set(variableName, []);
        }
        
        this.variableRegistry.get(variableName).push({
          file: filePath,
          line: this.getLineNumber(content, match.index),
          name: variableName
        });
      }
    }
  }

  /**
   * 📊 Analisa resultados
   */
  analyzeResults() {
    // Componentes duplicados
    this.componentRegistry.forEach((occurrences, name) => {
      if (occurrences.length > 1) {
        this.duplicates.components.push({
          name: name,
          occurrences: occurrences.length,
          files: occurrences
        });
      }
    });
    
    // Funções duplicadas
    this.functionRegistry.forEach((occurrences, name) => {
      if (occurrences.length > 1) {
        this.duplicates.functions.push({
          name: name,
          occurrences: occurrences.length,
          files: occurrences
        });
      }
    });
    
    // Variáveis duplicadas
    this.variableRegistry.forEach((occurrences, name) => {
      if (occurrences.length > 1) {
        this.duplicates.variables.push({
          name: name,
          occurrences: occurrences.length,
          files: occurrences
        });
      }
    });
  }

  /**
   * 📋 Gera relatório
   */
  generateReport() {
    console.log('📋 RELATÓRIO DE DUPLICAÇÕES - TRIBUTA.AI\n');
    console.log('=' .repeat(60));
    
    // Imports duplicados
    if (this.duplicates.imports.length > 0) {
      console.log('\n🔴 IMPORTS DUPLICADOS:');
      this.duplicates.imports.forEach(dup => {
        console.log(`  ❌ ${dup.file}`);
        console.log(`     Import: ${dup.import}`);
        console.log(`     Ocorrências: ${dup.occurrences} (linhas: ${dup.lines.join(', ')})`);
      });
    }
    
    // Componentes duplicados
    if (this.duplicates.components.length > 0) {
      console.log('\n🔴 COMPONENTES DUPLICADOS:');
      this.duplicates.components.forEach(dup => {
        console.log(`  ❌ Componente: ${dup.name}`);
        console.log(`     Ocorrências: ${dup.occurrences}`);
        dup.files.forEach(file => {
          console.log(`     - ${file.file}:${file.line}`);
        });
      });
    }
    
    // Funções duplicadas
    if (this.duplicates.functions.length > 0) {
      console.log('\n🔴 FUNÇÕES DUPLICADAS:');
      this.duplicates.functions.forEach(dup => {
        console.log(`  ❌ Função: ${dup.name}`);
        console.log(`     Ocorrências: ${dup.occurrences}`);
        dup.files.forEach(file => {
          console.log(`     - ${file.file}:${file.line}`);
        });
      });
    }
    
    // Arquivos duplicados
    if (this.duplicates.files.length > 0) {
      console.log('\n🔴 ARQUIVOS DUPLICADOS:');
      this.duplicates.files.forEach(dup => {
        console.log(`  ❌ Similaridade: ${dup.similarity}%`);
        console.log(`     - ${dup.file1}`);
        console.log(`     - ${dup.file2}`);
      });
    }
    
    // Resumo
    const totalIssues = this.duplicates.imports.length + 
                       this.duplicates.components.length + 
                       this.duplicates.functions.length + 
                       this.duplicates.files.length;
    
    console.log('\n' + '=' .repeat(60));
    console.log(`📊 RESUMO: ${totalIssues} problemas detectados`);
    console.log(`   - Imports duplicados: ${this.duplicates.imports.length}`);
    console.log(`   - Componentes duplicados: ${this.duplicates.components.length}`);
    console.log(`   - Funções duplicadas: ${this.duplicates.functions.length}`);
    console.log(`   - Arquivos duplicados: ${this.duplicates.files.length}`);
    
    if (totalIssues === 0) {
      console.log('\n✅ Nenhuma duplicação detectada! Código limpo.');
    } else {
      console.log('\n⚠️  Recomenda-se refatorar os itens duplicados.');
    }
  }

  /**
   * 📍 Obtém número da linha
   */
  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  const detector = new DuplicationDetector();
  detector.detectAllDuplications().catch(console.error);
}

module.exports = DuplicationDetector; 