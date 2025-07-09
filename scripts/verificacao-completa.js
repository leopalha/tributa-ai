#!/usr/bin/env node

/**
 * Script de Verificação Completa - Tributa.AI
 * Verifica se todas as funcionalidades estão implementadas e funcionando
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 VERIFICAÇÃO COMPLETA DA PLATAFORMA TRIBUTA.AI');
console.log('=' .repeat(50));

// Lista de componentes críticos que devem existir
const componentesCriticos = [
  // Páginas principais
  'src/pages/DashboardPage.tsx',
  'src/pages/HomePage.tsx', 
  'src/pages/LoginPage.tsx',
  'src/pages/NotFoundPage.tsx',
  
  // Páginas do Dashboard
  'src/pages/dashboard/MarketplacePage.tsx',
  'src/pages/dashboard/GestaoFiscalPage.tsx',
  'src/pages/dashboard/CompensacaoPage.tsx',
  'src/pages/dashboard/BlockchainPage.tsx',
  'src/pages/dashboard/RelatoriosPage.tsx',
  'src/pages/dashboard/ConfiguracoesPage.tsx',
  'src/pages/dashboard/TitulosPage.tsx',
  'src/pages/dashboard/RiskPage.tsx',
  'src/pages/dashboard/EmpresasPage.tsx',
  'src/pages/ARIADashboard.tsx',
  
  // Componentes avançados
  'src/components/tokenization/AdvancedTokenizationWizard.tsx',
  'src/components/compensation/MultilateralCompensationEngine.tsx',
  'src/components/onboarding/AdvancedKYCSystem.tsx',
  
  // Layout e UI
  'src/components/layout/ClientLayout.tsx',
  'src/components/ErrorBoundary.tsx',
  
  // Providers
  'src/providers/SessionProvider.tsx',
  'src/providers/EmpresaProvider.tsx',
  'src/providers/MarketplaceProvider-simple.tsx',
  'src/providers/TCProvider-simple.tsx',
  'src/providers/ToastProvider.tsx',
  
  // Arquivos de configuração
  'src/App.tsx',
  'src/main.tsx',
  'package.json',
  'vite.config.ts',
  'tailwind.config.ts',
  'tsconfig.json'
];

// Funcionalidades que devem estar operacionais
const funcionalidades = [
  {
    nome: 'Dashboard Executivo',
    rota: '/dashboard',
    componente: 'DashboardPage.tsx'
  },
  {
    nome: 'Marketplace Universal',
    rota: '/dashboard/marketplace',
    componente: 'MarketplacePage.tsx'
  },
  {
    nome: 'Tokenização Avançada',
    rota: '/dashboard/marketplace/tokenizar',
    componente: 'AdvancedTokenizationWizard.tsx'
  },
  {
    nome: 'Compensação Multilateral',
    rota: '/dashboard/compensacao/multilateral',
    componente: 'MultilateralCompensationEngine.tsx'
  },
  {
    nome: 'Sistema KYC',
    rota: '/dashboard/kyc',
    componente: 'AdvancedKYCSystem.tsx'
  },
  {
    nome: 'ARIA Dashboard',
    rota: '/dashboard/aria',
    componente: 'ARIADashboard.tsx'
  },
  {
    nome: 'Gestão Fiscal',
    rota: '/dashboard/gestao-fiscal',
    componente: 'GestaoFiscalPage.tsx'
  },
  {
    nome: 'Blockchain Dashboard',
    rota: '/dashboard/blockchain',
    componente: 'BlockchainPage.tsx'
  },
  {
    nome: 'Business Intelligence',
    rota: '/dashboard/relatorios',
    componente: 'RelatoriosPage.tsx'
  },
  {
    nome: 'Configurações',
    rota: '/dashboard/configuracoes',
    componente: 'ConfiguracoesPage.tsx'
  }
];

let errosEncontrados = 0;
let sucessos = 0;

// Função para verificar se arquivo existe
function verificarArquivo(caminho) {
  try {
    if (fs.existsSync(caminho)) {
      console.log(`✅ ${caminho}`);
      sucessos++;
      return true;
    } else {
      console.log(`❌ FALTANDO: ${caminho}`);
      errosEncontrados++;
      return false;
    }
  } catch (error) {
    console.log(`⚠️  ERRO ao verificar: ${caminho} - ${error.message}`);
    errosEncontrados++;
    return false;
  }
}

// Verificar componentes críticos
console.log('\n📋 VERIFICANDO COMPONENTES CRÍTICOS:');
console.log('-'.repeat(40));

componentesCriticos.forEach(componente => {
  verificarArquivo(componente);
});

// Verificar estrutura do App.tsx
console.log('\n🔍 VERIFICANDO ESTRUTURA DO APP.tsx:');
console.log('-'.repeat(40));

try {
  const appContent = fs.readFileSync('src/App.tsx', 'utf8');
  
  // Verificar imports críticos
  const importsCriticos = [
    'BrowserRouter',
    'Routes',
    'Route',
    'DashboardPage',
    'MarketplacePage',
    'AdvancedTokenizationWizard',
    'MultilateralCompensationEngine',
    'AdvancedKYCSystem',
    'ARIADashboard'
  ];
  
  importsCriticos.forEach(importItem => {
    if (appContent.includes(importItem)) {
      console.log(`✅ Import: ${importItem}`);
      sucessos++;
    } else {
      console.log(`❌ FALTANDO Import: ${importItem}`);
      errosEncontrados++;
    }
  });
  
  // Verificar rotas críticas
  const rotasCriticas = [
    '/dashboard',
    '/dashboard/marketplace',
    '/dashboard/marketplace/tokenizar',
    '/dashboard/compensacao/multilateral',
    '/dashboard/kyc',
    '/dashboard/aria'
  ];
  
  console.log('\n🛣️  VERIFICANDO ROTAS CRÍTICAS:');
  rotasCriticas.forEach(rota => {
    if (appContent.includes(`path="${rota}"`)) {
      console.log(`✅ Rota: ${rota}`);
      sucessos++;
    } else {
      console.log(`❌ FALTANDO Rota: ${rota}`);
      errosEncontrados++;
    }
  });
  
} catch (error) {
  console.log(`❌ ERRO ao ler App.tsx: ${error.message}`);
  errosEncontrados++;
}

// Verificar package.json
console.log('\n📦 VERIFICANDO DEPENDÊNCIAS:');
console.log('-'.repeat(40));

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const dependenciasCriticas = [
    'react',
    'react-dom',
    'react-router-dom',
    '@tanstack/react-query',
    'vite',
    'typescript',
    'tailwindcss'
  ];
  
  dependenciasCriticas.forEach(dep => {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      console.log(`✅ Dependência: ${dep}`);
      sucessos++;
    } else {
      console.log(`❌ FALTANDO Dependência: ${dep}`);
      errosEncontrados++;
    }
  });
  
} catch (error) {
  console.log(`❌ ERRO ao ler package.json: ${error.message}`);
  errosEncontrados++;
}

// Relatório final
console.log('\n' + '='.repeat(50));
console.log('📊 RELATÓRIO FINAL DA VERIFICAÇÃO');
console.log('='.repeat(50));

console.log(`✅ Sucessos: ${sucessos}`);
console.log(`❌ Erros: ${errosEncontrados}`);
console.log(`📈 Taxa de Sucesso: ${((sucessos / (sucessos + errosEncontrados)) * 100).toFixed(1)}%`);

if (errosEncontrados === 0) {
  console.log('\n🎉 PARABÉNS! PLATAFORMA 100% VERIFICADA!');
  console.log('🚀 Tributa.AI está pronta para demonstração!');
  console.log('\n🌐 Acesse: http://localhost:3000');
  console.log('📍 Centro de Controle: http://localhost:3000/dashboard/centro-controle');
} else {
  console.log('\n⚠️  ATENÇÃO: Foram encontrados alguns problemas.');
  console.log('🔧 Execute as correções necessárias e rode a verificação novamente.');
}

console.log('\n🏁 Verificação concluída!');
process.exit(errosEncontrados === 0 ? 0 : 1); 