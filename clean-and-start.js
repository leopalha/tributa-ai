const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Limpando o ambiente...');

// Limpar cache do Next.js
try {
  if (fs.existsSync(path.join(__dirname, '.next'))) {
    console.log('Removendo pasta .next...');
    fs.rmSync(path.join(__dirname, '.next'), { recursive: true, force: true });
  }
} catch (error) {
  console.error('Erro ao remover pasta .next:', error);
}

// Remover cache do Node
try {
  if (fs.existsSync(path.join(__dirname, 'node_modules', '.cache'))) {
    console.log('Removendo cache de node_modules...');
    fs.rmSync(path.join(__dirname, 'node_modules', '.cache'), { recursive: true, force: true });
  }
} catch (error) {
  console.error('Erro ao remover cache de node_modules:', error);
}

console.log('✅ Ambiente limpo com sucesso!');
console.log('🔄 Verificando dependências...');

try {
  // Garantir que todas as dependências estão instaladas
  execSync('yarn install', { stdio: 'inherit' });
  
  console.log('🚀 Iniciando o aplicativo...');
  // Iniciar o aplicativo
  execSync('yarn dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Erro:', error);
  process.exit(1);
} 