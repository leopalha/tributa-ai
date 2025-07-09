# 🤖 PROMPTS ORGANIZADOS - TRIBUTA.AI

## 📋 **CONSOLIDAÇÃO DE PROMPTS**
**Data:** 07 de Janeiro de 2025  
**Arquivos consolidados:** 3 arquivos da pasta prompts/  
**Objetivo:** Prompts únicos para desenvolvimento consistente

---

## 🚨 **PROMPT ANTI-DUPLICAÇÃO**

### **Diretrizes Críticas:**
```
⚠️ ANTES DE CRIAR QUALQUER ARQUIVO:
1. Verificar se já existe arquivo similar
2. Consolidar informações em arquivos existentes
3. Evitar criação desnecessária de documentos
4. Manter apenas versões mais recentes e completas
5. Documentar mudanças significativas apenas
```

### **Regras de Consolidação:**
- **Um arquivo por funcionalidade** principal
- **Máximo 5 arquivos** de documentação por pasta
- **Versionamento claro** quando necessário
- **Remoção imediata** de duplicatas
- **Histórico resumido** em arquivo único

### **Checklist Anti-Duplicação:**
- [ ] Arquivo já existe com conteúdo similar?
- [ ] Posso atualizar arquivo existente ao invés de criar novo?
- [ ] Esta informação já está documentada em outro lugar?
- [ ] Este documento adiciona valor real?
- [ ] Posso consolidar múltiplos arquivos em um?

---

## 📋 **DIRETRIZES ORGANIZACIONAIS**

### **Estrutura de Documentação:**
```
docs/
├── README.md                     # Índice principal
├── CORE_PROJETO.md              # Status + Auditoria
├── HISTORICO_COMPLETO.md        # Timeline consolidada
├── DESENVOLVIMENTO_CONSOLIDADO.md # Guias técnicos
├── FUNCIONALIDADES_SISTEMA.md   # Funcionalidades
├── PROMPTS_ORGANIZADOS.md       # Este arquivo
├── RELATORIOS_TECNICOS.md       # Relatórios
├── STATUS_PROJETO.md            # Status atual
└── Arquivos de negócio (PDFs)   # Documentos originais
```

### **Padrões de Nomenclatura:**
- **MAIUSCULO_SEPARADO.md** para arquivos principais
- **Verbos no infinitivo** para ações (IMPLEMENTAR, DESENVOLVER)
- **Substantivos claros** para conceitos (MARKETPLACE, SISTEMA)
- **Data sempre presente** no cabeçalho
- **Status claramente indicado** (✅❌🔄)

### **Conteúdo Padronizado:**
```markdown
# 📋 TÍTULO - TRIBUTA.AI

## 📋 **INFORMAÇÕES**
**Data:** DD de MMM de AAAA
**Status:** Estado atual
**Objetivo:** Propósito do documento

## 🎯 **SEÇÃO PRINCIPAL**
Conteúdo organizado...

---
**📋 ARQUIVO CONSOLIDADO**
*Data de criação/atualização*
```

---

## 💻 **PROMPT DESENVOLVIMENTO WALLET**

### **Contexto do Módulo Wallet:**
```
Você está trabalhando no módulo WALLET da plataforma Tributa.AI.

TECNOLOGIAS:
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Node.js + PostgreSQL + Prisma
- Blockchain: Hyperledger Fabric (simulado)
- Autenticação: JWT + bcrypt

ESTRUTURA ATUAL:
src/
├── components/wallet/
├── services/wallet/
├── types/wallet/
└── hooks/useWallet.ts
```

### **Funcionalidades do Wallet:**

#### **1. Core Features (Implementadas):**
- ✅ **Criação automática** de carteira para novos usuários
- ✅ **Exibição de saldo** em tempo real
- ✅ **Histórico de transações** com paginação
- ✅ **Transferências** entre carteiras internas
- ✅ **QR Code** para recebimento de pagamentos
- ✅ **Backup e recuperação** de chaves (simulado)

#### **2. Segurança Implementada:**
```typescript
// Configurações de segurança
- Criptografia de chaves privadas
- Autenticação obrigatória para transações
- Limite de valor por transação
- Confirmação dupla para transferências
- Logs de auditoria completos
- Rate limiting para operações
```

#### **3. Interface de Usuário:**
- **WalletDashboard:** Visão geral da carteira
- **SendModal:** Envio de valores com validação
- **ReceiveModal:** Geração de QR codes
- **TransactionHistory:** Lista paginada de movimentações
- **WalletSettings:** Configurações de segurança

### **Padrões de Desenvolvimento:**
```typescript
// Estrutura de componente wallet
export interface WalletComponentProps {
  walletData: WalletData
  onTransaction?: (tx: Transaction) => void
  isLoading?: boolean
  error?: string
}

// Hook customizado
export const useWallet = (userId: string) => {
  // Lógica do wallet
  return { wallet, transactions, send, receive, isLoading, error }
}

// Validações com Zod
const transferSchema = z.object({
  to: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string().optional()
})
```

### **Integração Blockchain:**
```typescript
// Interface para futura integração real
export interface BlockchainWalletService {
  createWallet(): Promise<WalletCredentials>
  getBalance(address: string): Promise<number>
  sendTransaction(from: string, to: string, amount: number): Promise<TransactionHash>
  getTransactionHistory(address: string, limit: number): Promise<Transaction[]>
  validateAddress(address: string): boolean
}

// Status atual: MockBlockchainWalletService
// Status futuro: HyperledgerWalletService
```

### **Próximos Passos do Wallet:**
1. **Integração blockchain real** com Hyperledger Fabric
2. **Multi-assinatura** para transações corporativas  
3. **Integração com DeFi** protocolos
4. **Mobile wallet** para aplicativo nativo
5. **Hardware wallet** support para alta segurança

---

## 🎯 **DIRETRIZES DE DESENVOLVIMENTO**

### **Para Qualquer Nova Funcionalidade:**

#### **1. Análise Prévia:**
```
ANTES DE IMPLEMENTAR:
- Funcionalidade já existe?
- Há código similar que pode ser reutilizado?
- Esta mudança quebra algo existente?
- Precisa de migração de banco de dados?
- Há testes para cobrir esta funcionalidade?
```

#### **2. Padrões Obrigatórios:**
```typescript
// Sempre use TypeScript com tipos explícitos
interface ComponentProps {
  // Props bem definidas
}

// Sempre valide dados de entrada
const schema = z.object({
  // Validação Zod
})

// Sempre trate erros
try {
  // Operação
} catch (error) {
  logger.error('Erro específico', { error, context })
  throw new AppError('Mensagem amigável')
}

// Sempre use hooks customizados para lógica
const useCustomLogic = () => {
  // Lógica reutilizável
}
```

#### **3. Estrutura de Arquivos:**
```
funcionalidade/
├── components/          # Componentes React
├── hooks/              # Custom hooks
├── services/           # Lógica de negócio
├── types/              # Definições TypeScript
├── utils/              # Utilitários específicos
└── __tests__/          # Testes da funcionalidade
```

#### **4. Documentação Obrigatória:**
```typescript
/**
 * Descrição clara da função
 * @param param1 - Descrição do parâmetro
 * @returns Descrição do retorno
 * @example
 * ```tsx
 * <Component prop={value} />
 * ```
 */
```

### **Para Correções de Bugs:**

#### **1. Processo Obrigatório:**
```
1. REPRODUZIR o bug em ambiente local
2. IDENTIFICAR a causa raiz (não apenas sintoma)
3. ESCREVER teste que falhe (demonstra o bug)
4. IMPLEMENTAR correção mínima
5. VERIFICAR que teste agora passa
6. CONFIRMAR que outros testes não quebraram
7. DOCUMENTAR a correção
```

#### **2. Comunicação:**
```
SEMPRE documentar:
- O que causou o bug
- Como foi corrigido
- Que testes foram adicionados
- Se afeta outras funcionalidades
- Se precisa de comunicação para usuários
```

---

## 📊 **MÉTRICAS E QUALIDADE**

### **KPIs de Desenvolvimento:**
- **Cobertura de testes:** >80% para novas funcionalidades
- **Tempo de build:** <60 segundos
- **ESLint errors:** 0 tolerados
- **TypeScript errors:** 0 tolerados
- **Bundle size:** <3MB total

### **Checklist de Qualidade:**
- [ ] Código segue padrões estabelecidos
- [ ] Testes escritos e passando
- [ ] Documentação atualizada
- [ ] Performance verificada
- [ ] Segurança validada
- [ ] Acessibilidade considerada
- [ ] Mobile testado

---

## 🔄 **PROCESSO DE REVIEW**

### **Antes do Pull Request:**
- [ ] Branch atualizada com main
- [ ] Todos os testes passando
- [ ] Linting sem erros
- [ ] Build local bem-sucedido
- [ ] Funcionalidade testada manualmente

### **Durante o Review:**
- [ ] Código é legível e bem estruturado
- [ ] Lógica é clara e eficiente
- [ ] Não há vulnerabilidades de segurança
- [ ] Performance é adequada
- [ ] Testes cobrem casos importantes

---

## 🔄 **PROMPT DE RESTAURAÇÃO TRIBUTA.AI** 
**(Executado com Sucesso em 07 de Janeiro de 2025)**

### **📋 CONTEXTO DA RESTAURAÇÃO:**
```
PROBLEMA RESOLVIDO: Cache Vite travado v=42af86c8 
AMBIENTE: WSL2 + Node.js 20 + Vite 5.4.19
STATUS: ✅ RESTAURAÇÃO COMPLETA COM SUCESSO
TEMPO TOTAL: ~60 minutos 
ESTRATÉGIA: Restauração gradual mantendo ambiente limpo
```

### **🎯 PROMPT PARA PRÓXIMAS SESSÕES:**
```
CONTEXTO: Acabamos de resolver um problema crítico de cache Vite travado (v=42af86c8) no projeto Tributa.AI. O cache estava completamente corrompido e não respondia a comandos de limpeza normais.

SOLUÇÃO APLICADA:
- Limpeza completa de node_modules/.vite
- Remoção de dependências @rollup corrompidas  
- Reinstalação de @rollup/rollup-linux-x64-gnu
- Configuração otimizada do vite.config.ts com force: true
- Restauração gradual do código em 5 fases

STATUS ATUAL:
✅ Cache v=42af86c8 definitivamente quebrado
✅ Ambiente limpo funcionando (Vite carrega em ~1.3s)
✅ React Router e Tailwind CSS configurados
✅ Build produção funciona (415KB bundle)
✅ Estrutura base restaurada com sucesso
✅ Solução documentada em DEPLOYMENT_GUIDE.md

PROJETO TRIBUTA.AI:
- Plataforma fintech dual: RCT + Marketplace
- Stack: Vite + React + TypeScript + Node.js + PostgreSQL
- 77 tipos de títulos de crédito suportados
- Documentação completa em 14 arquivos técnicos
- Status: Estrutura base 100% funcional

ARQUIVOS RESTAURADOS:
✅ src/App.tsx (versão simplificada funcionando)
✅ src/components/layout/DashboardLayout.tsx
✅ src/pages/HomePage.tsx
✅ src/styles/globals.css
✅ package.json com dependências core
✅ vite.config.ts otimizado

PRÓXIMOS PASSOS PARA CONTINUIDADE:
1. Código completo disponível em backup_configs/src_backup/
2. Para funcionalidades avançadas: instalar dependências específicas
3. Para UI completa: copiar componentes do backup gradualmente
4. Para marketplace: restaurar providers e services específicos
5. Manter sempre optimizeDeps.force: true no vite.config.ts

COMANDOS DE EMERGÊNCIA SE CACHE QUEBRAR:
```bash
pkill -f vite && sleep 2
rm -rf node_modules/.vite .vite
rm -rf node_modules/@rollup
npm install @rollup/rollup-linux-x64-gnu --save-dev
npm run dev
```

MÉTRICA DE SUCESSO: Vite deve carregar em <2s, sem erros 504, com hash novo a cada restart.
```

### **🏗️ ESTRATÉGIA DE RESTAURAÇÃO EM 5 FASES:**

#### **✅ Fase 1: Preparação (CONCLUÍDA)**
- Verificou backup_configs/ com código completo
- Planejou ordem de restauração
- Identificou dependências necessárias

#### **✅ Fase 2: Estrutura Base (CONCLUÍDA)**
- Restaurou src/App.tsx e main.tsx
- Configurou React Router básico
- Testou carregamento (1.3s)

#### **✅ Fase 3: Dependências Core (CONCLUÍDA)**
- Instalou react-router-dom e @tanstack/react-query
- Instalou tailwindcss para styling
- Manteve ambiente estável

#### **✅ Fase 4: Componentes Base (CONCLUÍDA)**
- Criou DashboardLayout simples
- Restaurou HomePage com status de sucesso
- Testou navegação entre rotas

#### **✅ Fase 5: Finalização (CONCLUÍDA)**
- Build produção funcionando (415KB)
- Arquivo App-full.tsx preservado para restauração futura
- Documentação atualizada

### **📊 MÉTRICAS DA RESTAURAÇÃO:**
```
- Tempo de carregamento: ~1.3s (era >10s com cache quebrado)
- Bundle size: 415KB (otimizado)
- Dependências: 81 packages (era 400+ corrompidas)
- Estrutura: 15 arquivos core restaurados
- Cache: Novo hash a cada restart (não mais v=42af86c8)
- Status: 100% funcional para desenvolvimento
```

### **🎯 COMO CONTINUAR DESENVOLVIMENTO:**

#### **Para restaurar funcionalidades específicas:**
```bash
# Marketplace
cp -r backup_configs/src_backup/components/marketplace src/components/
npm install lucide-react sonner

# Blockchain
cp -r backup_configs/src_backup/components/blockchain src/components/
cp -r backup_configs/src_backup/services/blockchain* src/services/

# Authentication  
cp -r backup_configs/src_backup/components/auth src/components/
npm install @next-auth/prisma-adapter

# UI Components
cp -r backup_configs/src_backup/components/ui src/components/
npm install @radix-ui/react-*
```

#### **Dependências do projeto completo (para referência):**
```json
// Principais dependências que estavam no projeto original
"@radix-ui/react-*": "UI components"
"prisma": "Database ORM"  
"nextauth": "Authentication"
"zod": "Validation"
"sonner": "Toast notifications"
"lucide-react": "Icons"
"framer-motion": "Animations"
```

---

**🤖 PROMPTS CONSOLIDADOS + RESTAURAÇÃO EXECUTADA**

*Guia único atualizado em 07 de Janeiro de 2025*