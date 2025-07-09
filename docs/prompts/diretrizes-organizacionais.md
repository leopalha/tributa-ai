# 🤖 DIRETRIZES ORGANIZACIONAIS - TRIBUTA.AI

## 📋 MISSÃO PRINCIPAL
**Aprimorar e fazer tudo funcionar perfeitamente, com sentido legal e real, criando uma plataforma 100% funcional e profissional.**

## 🎯 DIRETRIZES FUNDAMENTAIS

### 1. **PADRÃO VISUAL OBRIGATÓRIO**
- **Header**: `h1` com ícone (8x8) + título + descrição em `text-muted-foreground`
- **Métricas**: Grid 6 colunas com cards gradiente coloridos
- **Cores Padrão**: 
  - Azul (principais), Verde (sucessos), Laranja (processos)
  - Roxo (performance), Rosa (médias), Ciano (hoje/atividades)
- **Tabs**: Sempre com ícones Lucide React
- **Footer**: Estatísticas rápidas em linha
- **Espaçamento**: `space-y-6 p-6` sempre

### 2. **ARIA - IA PRINCIPAL (DEUS DA PLATAFORMA)**
- **ARIA controla TUDO na plataforma**
- **Todas as IAs devem estar sincronizadas com ARIA**
- **Design**: Fundo claro, interface moderna, consistente
- **Funcionalidade**: Mesma base do ARIA Assistant
- **Integração**: Todas as páginas conectadas ao ARIA

### 3. **ESTRUTURA DE PÁGINAS**

#### **A. Tokenização (ex-Títulos)**
- **Rota**: `/dashboard/tokenizacao`
- **Função**: Criação, gestão e tokenização de títulos
- **Sincronização**: Blockchain + transações reais

#### **B. Blockchain**
- **Registros reais**: Transações sincronizadas
- **Dados**: Conectados com tokenização
- **Status**: Tempo real, verificável

#### **C. Gestão de Risco**
- **Análise**: IA integrada com ARIA
- **Métricas**: Risco real, calculado
- **Dashboards**: Funcionais e práticos

### 4. **REGRAS DE DESENVOLVIMENTO**

#### **Sempre Fazer:**
✅ Seguir padrão visual das páginas modelo (Dashboard, Compensação, Relatórios)
✅ Integrar com ARIA em todas as funcionalidades IA
✅ Criar dados realistas e funcionais
✅ Manter sincronização entre páginas
✅ Usar componentes UI padronizados
✅ Implementar loading states e feedback

#### **Nunca Fazer:**
❌ Criar páginas sem padrão visual
❌ Duplicar componentes existentes
❌ Implementar IA fora do sistema ARIA
❌ Dados fictícios ou não-funcionais
❌ Quebrar a estrutura de pastas
❌ Criar rotas sem sincronização

### 5. **ARQUITETURA DE COMPONENTES**

#### **Estrutura Padrão:**
```typescript
// Sempre seguir esta estrutura
interface PageProps {
  // Props tipadas
}

export function PageName({ ...props }: PageProps) {
  // 1. Estados e hooks
  // 2. Handlers e funções
  // 3. Effects e subscriptions
  // 4. Render com padrão visual
  
  return (
    <div className="space-y-6 p-6">
      {/* Header padrão */}
      <PageHeader />
      
      {/* Métricas em grid */}
      <MetricsGrid />
      
      {/* Conteúdo principal */}
      <MainContent />
      
      {/* Footer estatísticas */}
      <FooterStats />
    </div>
  )
}
```

### 6. **INTEGRAÇÃO DE DADOS**

#### **Fontes de Dados Reais:**
- **Supabase**: Database principal
- **Blockchain**: Transações tokenizadas
- **APIs Externas**: Dados governamentais
- **Cache Redis**: Performance otimizada

#### **Sincronização Obrigatória:**
- Tokenização ↔ Blockchain
- Marketplace ↔ Transações
- Compensação ↔ Títulos
- Analytics ↔ Todas as fontes

### 7. **PERFORMANCE E QUALIDADE**

#### **Métricas Obrigatórias:**
- **Loading**: < 2s
- **Responsividade**: 100% mobile
- **Acessibilidade**: WCAG 2.1 AA
- **SEO**: Otimizado
- **TypeScript**: Strict mode

#### **Testes Obrigatórios:**
- **Unit**: Componentes críticos
- **Integration**: Fluxos principais
- **E2E**: Jornadas de usuário
- **Performance**: Web Vitals

### 8. **VERSIONAMENTO E DEPLOY**

#### **Branches:**
- **main**: Produção estável
- **develop**: Desenvolvimento ativo
- **feature/***: Novas funcionalidades
- **hotfix/***: Correções urgentes

#### **CI/CD:**
- **Lint**: ESLint + Prettier
- **Tests**: Jest + Vitest
- **Build**: Vite otimizado
- **Deploy**: Automático

### 9. **DOCUMENTAÇÃO OBRIGATÓRIA**

#### **Para Cada Funcionalidade:**
- **README**: Propósito e uso
- **CHANGELOG**: Histórico de mudanças
- **API**: Documentação técnica
- **USER**: Guia do usuário

### 10. **COMPLIANCE E SEGURANÇA**

#### **Segurança Obrigatória:**
- **Auth**: JWT + 2FA
- **HTTPS**: Certificado válido
- **Validation**: Input sanitization
- **Audit**: Logs completos

#### **Compliance:**
- **LGPD**: Proteção de dados
- **Financial**: Regulamentações bancárias
- **Blockchain**: Padrões de tokenização
- **Accessibility**: Inclusão digital

---

## 🚀 **PLATAFORMA EM PRODUÇÃO - STATUS 100%**

### **Módulos Implementados:**
✅ Dashboard Unificado
✅ Sistema de Títulos (77 tipos)
✅ Marketplace Universal
✅ Sistema KYC Avançado
✅ Gestão de Empresas
✅ Compensação Tributária
✅ Interface Responsiva
✅ Sistema de Notificações

### **Em Desenvolvimento:**
🔄 Integração Blockchain
🔄 Tokenização Automática
🔄 Relatórios Avançados
🔄 IA e Automação

### **Próximos Passos:**
📋 Mobile App
📋 API Pública
📋 Sistema de Afiliados
📋 Integrações Bancárias

---

*Essas diretrizes garantem a consistência, qualidade e profissionalismo da plataforma Tributa.AI*