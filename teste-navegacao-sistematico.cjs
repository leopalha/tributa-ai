#!/usr/bin/env node

/**
 * TESTE SISTEMÁTICO DE NAVEGAÇÃO CRÍTICA
 * Como Controller, teste rigoroso de todas as rotas para garantir profissionalismo
 */

const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class NavigationTester {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];
    this.basePath = '/mnt/d/NEGÓCIOS/TRIBUT.AI/Plataforma/tributa-ai-web-new';
    this.routesFromApp = [];
    this.routesFromSidebar = [];
    this.pageFiles = [];
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  error(message) {
    this.issues.push(message);
    this.log(`❌ ERRO: ${message}`, 'red');
  }

  warning(message) {
    this.warnings.push(message);
    this.log(`⚠️  AVISO: ${message}`, 'yellow');
  }

  success(message) {
    this.passed.push(message);
    this.log(`✅ OK: ${message}`, 'green');
  }

  info(message) {
    this.log(`ℹ️  INFO: ${message}`, 'cyan');
  }

  // Extrair rotas do App.tsx
  extractRoutesFromApp() {
    try {
      const appContent = fs.readFileSync(path.join(this.basePath, 'src/App.tsx'), 'utf8');
      
      // Regex para encontrar rotas
      const routeRegex = /<Route\s+path="([^"]+)"\s+element={([^}]+)}/g;
      let match;
      
      while ((match = routeRegex.exec(appContent)) !== null) {
        const [, routePath, element] = match;
        this.routesFromApp.push({
          path: routePath,
          element: element.trim(),
          line: appContent.substring(0, match.index).split('\n').length
        });
      }
      
      this.success(`Extraídas ${this.routesFromApp.length} rotas do App.tsx`);
    } catch (error) {
      this.error(`Erro ao ler App.tsx: ${error.message}`);
    }
  }

  // Extrair links do Sidebar
  extractRoutesFromSidebar() {
    try {
      const sidebarContent = fs.readFileSync(path.join(this.basePath, 'src/components/layout/Sidebar.tsx'), 'utf8');
      
      // Regex para encontrar objetos com href
      const hrefRegex = /href:\s*['"]([^'"]+)['"]/g;
      let match;
      
      while ((match = hrefRegex.exec(sidebarContent)) !== null) {
        const [, href] = match;
        this.routesFromSidebar.push({
          href: href,
          line: sidebarContent.substring(0, match.index).split('\n').length
        });
      }
      
      this.success(`Extraídos ${this.routesFromSidebar.length} links do Sidebar`);
    } catch (error) {
      this.error(`Erro ao ler Sidebar.tsx: ${error.message}`);
    }
  }

  // Encontrar todos os arquivos de páginas
  findPageFiles() {
    const pagesDir = path.join(this.basePath, 'src/pages');
    
    const findFiles = (dir, files = []) => {
      if (!fs.existsSync(dir)) return files;
      
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          findFiles(fullPath, files);
        } else if (entry.endsWith('.tsx') || entry.endsWith('.ts')) {
          files.push(fullPath.replace(this.basePath + '/', ''));
        }
      }
      return files;
    };
    
    this.pageFiles = findFiles(pagesDir);
    this.success(`Encontrados ${this.pageFiles.length} arquivos de páginas`);
  }

  // Verificar se rota tem página correspondente
  verifyRouteHasPage(routePath, element) {
    // Remover parâmetros da rota
    const cleanPath = routePath.replace(/:\w+/g, '').replace(/\*/g, '');
    
    // Casos especiais
    if (routePath === '*') return true; // NotFound
    if (routePath === '/') return true; // Home
    if (element.includes('Navigate')) return true; // Redirect
    
    // Buscar arquivo correspondente
    const possiblePaths = [
      `src/pages${cleanPath}.tsx`,
      `src/pages${cleanPath}/index.tsx`,
      `src/pages${cleanPath}Page.tsx`,
      `src/pages${cleanPath.replace(/\/$/, '')}.tsx`,
    ];
    
    for (const possiblePath of possiblePaths) {
      if (this.pageFiles.includes(possiblePath)) {
        return true;
      }
    }
    
    return false;
  }

  // Verificar consistência entre rotas e sidebar
  verifyRoutesConsistency() {
    this.log('\n📊 VERIFICANDO CONSISTÊNCIA DE ROTAS', 'bold');
    
    // Verificar se todas as rotas do App têm páginas
    for (const route of this.routesFromApp) {
      if (this.verifyRouteHasPage(route.path, route.element)) {
        this.success(`Rota '${route.path}' tem página correspondente`);
      } else {
        this.error(`Rota '${route.path}' não tem página correspondente (elemento: ${route.element})`);
      }
    }
    
    // Verificar se links do sidebar têm rotas correspondentes
    for (const sidebarLink of this.routesFromSidebar) {
      const hasRoute = this.routesFromApp.some(route => 
        route.path === sidebarLink.href || 
        (route.path.includes(':') && sidebarLink.href.startsWith(route.path.split(':')[0]))
      );
      
      if (hasRoute) {
        this.success(`Link sidebar '${sidebarLink.href}' tem rota correspondente`);
      } else {
        this.error(`Link sidebar '${sidebarLink.href}' não tem rota correspondente`);
      }
    }
  }

  // Verificar padrões de URLs
  verifyUrlPatterns() {
    this.log('\n🔍 VERIFICANDO PADRÕES DE URLS', 'bold');
    
    const patterns = {
      dashboard: /^\/dashboard/,
      admin: /^\/dashboard\/admin/,
      marketplace: /^\/dashboard\/marketplace/,
      recuperacao: /^\/dashboard\/recuperacao/,
      blockchain: /^\/dashboard\/blockchain/,
      tokenizacao: /^\/dashboard\/tokenizacao/,
    };
    
    for (const route of this.routesFromApp) {
      let patternFound = false;
      
      for (const [patternName, regex] of Object.entries(patterns)) {
        if (regex.test(route.path)) {
          patternFound = true;
          break;
        }
      }
      
      if (!patternFound && route.path !== '*' && route.path !== '/' && !route.path.startsWith('/demo')) {
        this.warning(`Rota '${route.path}' não segue padrão estabelecido`);
      }
    }
  }

  // Verificar arquivos órfãos
  verifyOrphanFiles() {
    this.log('\n🔍 VERIFICANDO ARQUIVOS ÓRFÃOS', 'bold');
    
    const usedFiles = new Set();
    
    // Marcar arquivos usados nas rotas
    for (const route of this.routesFromApp) {
      const cleanPath = route.path.replace(/:\w+/g, '').replace(/\*/g, '');
      const possiblePaths = [
        `src/pages${cleanPath}.tsx`,
        `src/pages${cleanPath}/index.tsx`,
        `src/pages${cleanPath}Page.tsx`,
        `src/pages${cleanPath.replace(/\/$/, '')}.tsx`,
      ];
      
      for (const possiblePath of possiblePaths) {
        if (this.pageFiles.includes(possiblePath)) {
          usedFiles.add(possiblePath);
        }
      }
    }
    
    // Verificar arquivos não usados
    for (const pageFile of this.pageFiles) {
      if (!usedFiles.has(pageFile)) {
        this.warning(`Arquivo potencialmente órfão: ${pageFile}`);
      }
    }
  }

  // Verificar navegação hierárquica
  verifyNavigationHierarchy() {
    this.log('\n🌳 VERIFICANDO HIERARQUIA DE NAVEGAÇÃO', 'bold');
    
    const hierarchy = {};
    
    for (const route of this.routesFromApp) {
      const parts = route.path.split('/').filter(Boolean);
      let current = hierarchy;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = { routes: [], children: {} };
        }
        current[part].routes.push(route.path);
        current = current[part].children;
      }
    }
    
    // Verificar se hierarquia está consistente
    const checkHierarchy = (node, path = '') => {
      for (const [key, value] of Object.entries(node)) {
        const currentPath = path ? `${path}/${key}` : key;
        
        if (value.routes.length > 1) {
          this.info(`Namespace '${currentPath}' tem ${value.routes.length} rotas`);
        }
        
        if (Object.keys(value.children).length > 0) {
          checkHierarchy(value.children, currentPath);
        }
      }
    };
    
    checkHierarchy(hierarchy);
  }

  // Verificar redirects
  verifyRedirects() {
    this.log('\n🔄 VERIFICANDO REDIRECTS', 'bold');
    
    const redirects = this.routesFromApp.filter(route => 
      route.element.includes('Navigate') || route.element.includes('Redirect')
    );
    
    for (const redirect of redirects) {
      this.info(`Redirect encontrado: ${redirect.path} → ${redirect.element}`);
    }
    
    this.success(`Encontrados ${redirects.length} redirects`);
  }

  // Gerar relatório
  generateReport() {
    this.log('\n📋 RELATÓRIO FINAL DE NAVEGAÇÃO', 'bold');
    this.log('='.repeat(50), 'cyan');
    
    this.log(`\n✅ SUCESSOS: ${this.passed.length}`, 'green');
    this.log(`⚠️  AVISOS: ${this.warnings.length}`, 'yellow');
    this.log(`❌ ERROS: ${this.issues.length}`, 'red');
    
    if (this.issues.length > 0) {
      this.log('\n🚨 PROBLEMAS CRÍTICOS:', 'red');
      this.issues.forEach(issue => this.log(`   • ${issue}`, 'red'));
    }
    
    if (this.warnings.length > 0) {
      this.log('\n⚠️  AVISOS IMPORTANTES:', 'yellow');
      this.warnings.forEach(warning => this.log(`   • ${warning}`, 'yellow'));
    }
    
    // Recomendações
    this.log('\n💡 RECOMENDAÇÕES:', 'cyan');
    if (this.issues.length > 0) {
      this.log('   • Corrigir rotas quebradas imediatamente', 'cyan');
    }
    if (this.warnings.length > 0) {
      this.log('   • Revisar arquivos órfãos e padrões inconsistentes', 'cyan');
    }
    this.log('   • Implementar testes automatizados de navegação', 'cyan');
    this.log('   • Adicionar breadcrumbs para melhor UX', 'cyan');
    
    // Score final
    const total = this.passed.length + this.warnings.length + this.issues.length;
    const score = total > 0 ? ((this.passed.length / total) * 100).toFixed(1) : 0;
    
    this.log(`\n📊 SCORE DE NAVEGAÇÃO: ${score}%`, score > 80 ? 'green' : score > 60 ? 'yellow' : 'red');
    
    if (score > 90) {
      this.log('🏆 EXCELENTE - Navegação está profissional!', 'green');
    } else if (score > 70) {
      this.log('👍 BOM - Pequenos ajustes necessários', 'yellow');
    } else {
      this.log('🔧 NECESSITA CORREÇÃO - Problemas críticos encontrados', 'red');
    }
  }

  // Executar todos os testes
  async run() {
    this.log('🚀 INICIANDO TESTE SISTEMÁTICO DE NAVEGAÇÃO', 'bold');
    this.log('Perspectiva: Controller experiente - Zero tolerância para links quebrados\n', 'magenta');
    
    this.extractRoutesFromApp();
    this.extractRoutesFromSidebar();
    this.findPageFiles();
    this.verifyRoutesConsistency();
    this.verifyUrlPatterns();
    this.verifyOrphanFiles();
    this.verifyNavigationHierarchy();
    this.verifyRedirects();
    this.generateReport();
    
    // Retornar código de saída baseado nos resultados
    return this.issues.length === 0 ? 0 : 1;
  }
}

// Executar teste
const tester = new NavigationTester();
tester.run().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('Erro durante execução:', error);
  process.exit(1);
});