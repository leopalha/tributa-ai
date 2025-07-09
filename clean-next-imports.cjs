const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando limpeza de imports Next.js...');

// Mapeamento de substituições
const replacements = [
  // Hooks
  {
    from: `import { useRouter } from 'next/navigation'`,
    to: `import { useRouter } from '@/lib/router-utils'`
  },
  {
    from: `import { useRouter } from "next/navigation"`,
    to: `import { useRouter } from '@/lib/router-utils'`
  },
  {
    from: `import { usePathname } from 'next/navigation'`,
    to: `import { usePathname } from '@/lib/router-utils'`
  },
  {
    from: `import { usePathname } from "next/navigation"`,
    to: `import { usePathname } from '@/lib/router-utils'`
  },
  {
    from: `import { useSearchParams } from 'next/navigation'`,
    to: `import { useSearchParams } from '@/lib/router-utils'`
  },
  {
    from: `import { useSearchParams } from "next/navigation"`,
    to: `import { useSearchParams } from '@/lib/router-utils'`
  },
  {
    from: `import { useRouter, useSearchParams } from "next/navigation"`,
    to: `import { useRouter, useSearchParams } from '@/lib/router-utils'`
  },
  {
    from: `import { useRouter, usePathname } from "next/navigation"`,
    to: `import { useRouter, usePathname } from '@/lib/router-utils'`
  },
  
  // Components
  {
    from: `import Link from 'next/link'`,
    to: `import Link from '@/components/ui/custom-link'`
  },
  {
    from: `import Link from "next/link"`,
    to: `import Link from '@/components/ui/custom-link'`
  },
  {
    from: `import Image from 'next/image'`,
    to: `import Image from '@/components/ui/custom-image'`
  },
  {
    from: `import Image from "next/image"`,
    to: `import Image from '@/components/ui/custom-image'`
  },
  
  // NextAuth
  {
    from: `import { useSession } from 'next-auth/react'`,
    to: `// TODO: Replace with custom auth\n// import { useSession } from 'next-auth/react'`
  },
  {
    from: `import { signOut } from 'next-auth/react'`,
    to: `// TODO: Replace with custom auth\n// import { signOut } from 'next-auth/react'`
  },
  {
    from: `import { useSession, signOut } from 'next-auth/react'`,
    to: `// TODO: Replace with custom auth\n// import { useSession, signOut } from 'next-auth/react'`
  },
  
  // Themes
  {
    from: `import { useTheme } from 'next-themes'`,
    to: `// TODO: Replace with custom theme\n// import { useTheme } from 'next-themes'`
  },
  {
    from: `import { useTheme } from "next-themes"`,
    to: `// TODO: Replace with custom theme\n// import { useTheme } from 'next-themes'`
  },
  
  // Env vars
  {
    from: /process\.env\.NEXT_PUBLIC_/g,
    to: 'import.meta.env.VITE_'
  },
  {
    from: /process\.env\.NEXTAUTH_/g,
    to: 'import.meta.env.VITE_AUTH_'
  }
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    replacements.forEach(({ from, to }) => {
      if (typeof from === 'string') {
        if (content.includes(from)) {
          content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
          modified = true;
        }
      } else {
        // Regex
        if (from.test(content)) {
          content = content.replace(from, to);
          modified = true;
        }
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erro em ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  let processedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      processedCount += walkDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (processFile(filePath)) {
        processedCount++;
      }
    }
  });
  
  return processedCount;
}

// Executar limpeza
const srcDir = path.join(__dirname, 'src');
const processedFiles = walkDirectory(srcDir);

console.log(`\n🎯 Limpeza concluída! ${processedFiles} arquivos modificados.`);
console.log('🔄 Execute "npm run dev" para testar as mudanças.');
