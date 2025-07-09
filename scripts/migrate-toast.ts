#!/usr/bin/env tsx

/**
 * Script para migrar de react-hot-toast para o sistema de toast padronizado
 * Execução: npx tsx scripts/migrate-toast.ts
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Padrões de importação a serem substituídos
const IMPORT_PATTERNS = [
  // Importação simples
  {
    from: /import\s+toast\s+from\s+['"]react-hot-toast['"];?/g, 
    to: `import toast from '@/lib/toast-transition';`
  },
  // Importação com chaves
  {
    from: /import\s+{\s*toast\s*}\s+from\s+['"]react-hot-toast['"];?/g,
    to: `import toast from '@/lib/toast-transition';`
  },
  // Importação multilinha com toast entre outras importações
  {
    from: /import\s+{\s*([^}]*,)?\s*toast\s*(,[^}]*)?\s*}\s+from\s+['"]react-hot-toast['"];?/g,
    to: (match: string, before?: string, after?: string) => {
      const otherImports = (before || '') + (after || '');
      if (otherImports.trim()) {
        return `import ${otherImports.includes(',') ? otherImports : `{ ${otherImports.trim()} }`} from 'react-hot-toast';\nimport toast from '@/lib/toast-transition';`;
      }
      return `import toast from '@/lib/toast-transition';`;
    }
  }
];

// Padrões de uso a serem substituídos (quando necessário)
const USAGE_PATTERNS = [
  // toast("mensagem") -> não precisa mudar, já funciona
  // toast.success e toast.error já funcionam com a library de transição
  // Detecta toast.custom e outros métodos que precisam ser ajustados
  {
    from: /toast\.(custom|loading|dismiss|remove)\(/g,
    to: (match: string, method: string) => {
      if (method === 'custom') {
        return 'toast.custom(';
      }
      // Avisar sobre métodos não suportados diretamente
      console.log(`⚠️ Método 'toast.${method}' encontrado - pode precisar de ajuste manual`);
      return match;
    }
  }
];

// Arquivos a serem processados
async function getFilesToProcess(): Promise<string[]> {
  return await glob('src/**/*.{ts,tsx}', { ignore: ['**/*.d.ts', '**/node_modules/**', '**/.next/**'] });
}

// Verificar se um arquivo usa react-hot-toast
function usesReactHotToast(content: string): boolean {
  return /['"]react-hot-toast['"]/.test(content);
}

// Migrar o arquivo
function migrateFile(filePath: string): void {
  console.log(`Processando ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!usesReactHotToast(content)) {
    console.log(`  Nenhuma referência a react-hot-toast encontrada`);
    return;
  }
  
  // Substituir importações
  let modified = false;
  for (const pattern of IMPORT_PATTERNS) {
    if (typeof pattern.to === 'string') {
      if (pattern.from.test(content)) {
        content = content.replace(pattern.from, pattern.to);
        modified = true;
      }
    } else if (typeof pattern.to === 'function') {
      content = content.replace(pattern.from, pattern.to);
      if (content.includes('@/lib/toast-transition')) {
        modified = true;
      }
    }
  }
  
  // Substituir padrões de uso, se necessário
  for (const pattern of USAGE_PATTERNS) {
    if (pattern.from.test(content)) {
      if (typeof pattern.to === 'string') {
        content = content.replace(pattern.from, pattern.to);
      } else if (typeof pattern.to === 'function') {
        content = content.replace(pattern.from, pattern.to);
      }
      modified = true;
    }
  }
  
  // Se o arquivo foi modificado, salvá-lo
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Arquivo migrado com sucesso`);
  } else {
    console.log(`  ⚠️ Encontrou react-hot-toast mas não conseguiu migrar automaticamente`);
    // Analisar problemas específicos
    if (content.includes('from "react-hot-toast"') || content.includes("from 'react-hot-toast'")) {
      console.log(`    - Importação encontrada mas não corresponde aos padrões conhecidos`);
      // Mostrar a linha de importação para diagnóstico
      const importLine = content.match(/.*from ['"]react-hot-toast['"]/g);
      if (importLine) console.log(`    - Importação atual: ${importLine[0]}`);
    }
  }
}

// Função para migrar manualmente componentes específicos
async function migrateSpecificComponents() {
  // Lista de componentes que sabemos que precisam de migração
  const specificComponents = [
    'src/components/tc/TCDetalhes.tsx',
    'src/components/debitos/DebitoList.tsx',
    'src/components/marketplace/AnuncioForm.tsx',
    'src/components/marketplace/AnuncioDetalhes.tsx'
  ];
  
  let count = 0;
  
  for (const filePath of specificComponents) {
    if (fs.existsSync(filePath)) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Substituir a importação
        if (content.includes('react-hot-toast')) {
          content = content.replace(/import\s+.*from\s+['"]react-hot-toast['"];?/g, 
                                   `import toast from '@/lib/toast-transition';`);
          
          // Salvar o arquivo
          fs.writeFileSync(filePath, content);
          console.log(`✅ Componente específico migrado: ${filePath}`);
          count++;
        }
      } catch (error) {
        console.error(`Erro ao processar componente específico ${filePath}:`, error);
      }
    } else {
      console.log(`⚠️ Componente não encontrado: ${filePath}`);
    }
  }
  
  return count;
}

// Função principal
async function main() {
  console.log('Iniciando migração de react-hot-toast para toast-transition...');
  
  // Processar todos os arquivos
  const files = await getFilesToProcess();
  let count = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (usesReactHotToast(content)) {
        migrateFile(file);
        count++;
      }
    } catch (error) {
      console.error(`Erro ao processar ${file}:`, error);
    }
  }
  
  // Tentar migrar componentes específicos manualmente
  console.log('\nTentando migrar componentes específicos conhecidos...');
  const specificCount = await migrateSpecificComponents();
  
  console.log(`\nMigração concluída. Processados ${count} arquivos de ${files.length}.`);
  console.log(`Adicionalmente, ${specificCount} componentes específicos foram migrados manualmente.`);
  console.log('Nota: Verifique manualmente se todas as chamadas de toast foram atualizadas corretamente.');
}

main().catch(error => {
  console.error('Erro durante a migração:', error);
  process.exit(1);
}); 