#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando saúde do projeto Tributa.AI...\n');

// Verificar arquivos de lock
const hasYarnLock = fs.existsSync('yarn.lock');
const hasPackageLock = fs.existsSync('package-lock.json');

console.log('📦 Gerenciadores de Pacotes:');
if (hasYarnLock && hasPackageLock) {
  console.log('❌ PROBLEMA: Ambos yarn.lock e package-lock.json existem');
  console.log('   Solução: Remova yarn.lock e use apenas npm');
} else if (hasYarnLock) {
  console.log('⚠️  AVISO: Apenas yarn.lock encontrado');
  console.log('   Recomendação: Use npm para consistência');
} else if (hasPackageLock) {
  console.log('✅ OK: Usando npm (package-lock.json)');
} else {
  console.log('❌ PROBLEMA: Nenhum arquivo de lock encontrado');
  console.log('   Solução: Execute npm install');
}

// Verificar configuração de fontes
const fontsPath = 'src/lib/fonts.ts';
const hasFontsConfig = fs.existsSync(fontsPath);

console.log('\n🔤 Configuração de Fontes:');
if (hasFontsConfig) {
  console.log('✅ OK: Arquivo de configuração de fontes existe');
  
  const fontsContent = fs.readFileSync(fontsPath, 'utf8');
  if (fontsContent.includes('Inter')) {
    console.log('✅ OK: Fonte Inter configurada');
  } else {
    console.log('❌ PROBLEMA: Fonte Inter não encontrada na configuração');
  }
} else {
  console.log('❌ PROBLEMA: Arquivo de configuração de fontes não encontrado');
  console.log('   Solução: Crie src/lib/fonts.ts');
}

// Verificar dependências do toast
const packageJsonPath = 'package.json';
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  console.log('\n📢 Sistema de Toast:');
  const hasSonner = deps.sonner;
  const hasReactHotToast = deps['react-hot-toast'];
  
  if (hasSonner && !hasReactHotToast) {
    console.log('✅ OK: Usando apenas Sonner para toast');
  } else if (hasSonner && hasReactHotToast) {
    console.log('❌ PROBLEMA: Ambos sonner e react-hot-toast instalados');
    console.log('   Solução: npm uninstall react-hot-toast');
  } else if (!hasSonner) {
    console.log('❌ PROBLEMA: Sonner não instalado');
    console.log('   Solução: npm install sonner');
  }
}

// Verificar estrutura de pastas
const requiredDirs = [
  'src/app',
  'src/components',
  'src/lib',
  'prisma'
];

console.log('\n📁 Estrutura de Pastas:');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ OK: ${dir} existe`);
  } else {
    console.log(`❌ PROBLEMA: ${dir} não encontrado`);
  }
});

// Verificar arquivos de configuração importantes
const configFiles = [
  'tailwind.config.ts',
  'next.config.js',
  'tsconfig.json',
  'prisma/schema.prisma'
];

console.log('\n⚙️  Arquivos de Configuração:');
configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ OK: ${file} existe`);
  } else {
    console.log(`❌ PROBLEMA: ${file} não encontrado`);
  }
});

console.log('\n🎯 Resumo:');
console.log('- Use apenas npm como gerenciador de pacotes');
console.log('- Fonte Inter configurada centralmente em src/lib/fonts.ts');
console.log('- Sistema de toast unificado com Sonner');
console.log('- Estrutura de pastas Next.js 14 com App Router');

console.log('\n✨ Para executar o projeto:');
console.log('1. npm install');
console.log('2. npm run prisma:generate');
console.log('3. npm run dev');

console.log('\n🔧 Em caso de problemas:');
console.log('- Remova yarn.lock se existir');
console.log('- Execute npm install --force se necessário');
console.log('- Verifique as variáveis de ambiente (.env.local)'); 