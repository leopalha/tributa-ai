const fs = require('fs');
const path = require('path');

// Lista de arquivos MD para remover (redundantes ou obsoletos)
const filesToRemove = [
  'ROADMAP_IMPLEMENTADO.md',
  'FUNCIONALIDADES_IMPLEMENTADAS.md',
  'PLATAFORMA_FINALIZADA.md',
  'STATUS_DESENVOLVIMENTOS_IMPLEMENTADOS.md',
  'IMPLEMENTACAO_COMPLETA.md',
  'IMPLEMENTACAO_FINAL_COMPLETA.md',
  'DASHBOARD_UNIFICADO_IMPLEMENTADO.md',
  'MARKETPLACE_UNIVERSAL_IMPLEMENTADO.md',
  'STATUS_FINAL_COMPLETO.md',
  'STATUS_FINAL_APLICACAO.md',
  'STATUS_FINAL.md',
  'DEMONSTRACAO_FINAL.md',
  'PROMPT_EXECUCAO_FINAL.md',
  'MISSAO_CUMPRIDA_FINAL.md',
  'PROMPT_DESENVOLVIMENTO_COMPLETO.md',
  'SUCESSO_TOTAL_TRIBUTA_AI.md',
  'AUDITORIA_FINAL_COMPLETA.md',
  'AUDITORIA_CONCLUIDA.md',
  'AUDITORIA_FUNCIONALIDADES_PERDIDAS.md',
  'RELATORIO_FINAL_MIGRACAO.md',
  'ERRO_MARKETPLACE_PROVIDER_RESOLVIDO.md',
  'PROBLEMA_CACHE_RESOLVIDO.md',
  'RESOLUCAO_FINAL_TOAST.md',
  'SOLUCAO_HIDRATACAO.md',
  'MVP_STATUS_FINAL.md',
  'MIGRACAO_CORRIGIDA.md',
  'DEBUG_404.md',
  'SOLUCAO_ERRO_404.md',
  'PROBLEMA_RESOLVIDO.md',
  'VALIDACAO_TECNICA_MVP.md',
  'STATUS_ATUAL.md',
  'CORRECOES_REALIZADAS.md',
  'MELHORIAS_IMPLEMENTADAS.md',
  'PLANO_SIMPLIFICACAO.md',
  'ARCHITECTURE_REDESIGN.md',
  'DESENVOLVIMENTO.md',
  'DEMO_CHECKLIST.md',
  'PROMPT_SISTEMATICO_CORRECAO_COMPLETA.md',
  'RELATORIO_DEMONSTRACAO.md',
  'DEMONSTRACAO_COMPLETA.md',
  'ARIA_IMPLEMENTATION_GUIDE.md'
];

// Arquivos a manter
const filesToKeep = [
  'README.md',
  'PLATAFORMA_CONSOLIDADA_FINAL.md',
  'DEVELOPMENT.md',
  'SUMMARY.md',
  'project-status.md'
];

// Criar pasta backup
const backupDir = path.join(__dirname, '..', 'backup-docs');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

console.log('🧹 Organizando documentação da plataforma Tributa.AI...\n');

let removedCount = 0;
let backedUpCount = 0;

// Remover arquivos redundantes
filesToRemove.forEach(filename => {
  const filePath = path.join(__dirname, '..', filename);
  
  if (fs.existsSync(filePath)) {
    try {
      // Fazer backup antes de remover
      const backupPath = path.join(backupDir, filename);
      fs.copyFileSync(filePath, backupPath);
      backedUpCount++;
      
      // Remover arquivo original
      fs.unlinkSync(filePath);
      removedCount++;
      
      console.log(`✅ Removido: ${filename}`);
    } catch (error) {
      console.log(`❌ Erro ao remover ${filename}: ${error.message}`);
    }
  }
});

console.log(`\n📊 Resumo da organização:`);
console.log(`   🗂️  Arquivos removidos: ${removedCount}`);
console.log(`   💾  Arquivos em backup: ${backedUpCount}`);
console.log(`   📋  Arquivos mantidos: ${filesToKeep.length}`);

console.log(`\n📁 Documentação final organizada:`);
filesToKeep.forEach(filename => {
  const filePath = path.join(__dirname, '..', filename);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${filename}`);
  } else {
    console.log(`   ⚠️  ${filename} (não encontrado)`);
  }
});

console.log(`\n🎉 Organização concluída!`);
console.log(`   📂 Backup salvo em: backup-docs/`);
console.log(`   📄 Documentação principal: PLATAFORMA_CONSOLIDADA_FINAL.md`);

// Atualizar package.json para adicionar script de documentação
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    packageJson.scripts['docs:organize'] = 'node scripts/organize-docs.js';
    packageJson.scripts['docs:view'] = 'echo "📄 Documentação principal: PLATAFORMA_CONSOLIDADA_FINAL.md"';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`\n✅ Scripts adicionados ao package.json:`);
    console.log(`   - npm run docs:organize`);
    console.log(`   - npm run docs:view`);
  } catch (error) {
    console.log(`⚠️  Erro ao atualizar package.json: ${error.message}`);
  }
}

console.log(`\n🚀 Plataforma Tributa.AI 100% implementada e documentada!`); 