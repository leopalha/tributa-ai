# Guia de Desenvolvimento - Tributa.AI

## Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm (recomendado) - **NÃO USE YARN**

## Configuração do Ambiente

### 1. Instalação de Dependências

**IMPORTANTE**: Use apenas `npm`. O projeto foi configurado para usar npm como gerenciador de pacotes único.

```bash
# Instalar dependências
npm install

# NÃO use yarn install - isso pode causar conflitos
```

### 2. Configuração do Banco de Dados

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Seed do banco (opcional)
npm run db:seed
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tributaai"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Outros
NODE_ENV="development"
```

## Executando o Projeto

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Servidor alternativo (porta 3001)
npm run dev:alt

# Limpar porta e iniciar
npm run clean-dev
```

### Build e Produção

```bash
# Build do projeto
npm run build

# Iniciar em produção
npm run start
```

## Estrutura do Projeto

```
src/
├── app/                 # App Router do Next.js
├── components/          # Componentes React
│   ├── ui/             # Componentes base (shadcn/ui)
│   └── layout/         # Layouts da aplicação
├── lib/                # Utilitários e configurações
│   ├── fonts.ts        # Configuração centralizada de fontes
│   ├── prisma.ts       # Cliente Prisma
│   └── utils.ts        # Utilitários gerais
└── styles/             # Estilos globais
```

## Tecnologias Principais

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Banco**: PostgreSQL + Prisma
- **Auth**: NextAuth.js
- **Fontes**: Inter (Google Fonts)
- **Toast**: Sonner
- **Ícones**: Lucide React

## Comandos Úteis

```bash
# Linting e formatação
npm run lint
npm run format

# Testes
npm run test
npm run test:watch

# Prisma
npm run prisma:generate
npm run prisma:migrate
npm run prisma:reset

# Scripts de correção
npm run fix:all
```

## Padrões de Desenvolvimento

### Fontes
- Use apenas a fonte **Inter** configurada em `src/lib/fonts.ts`
- Todas as páginas devem manter consistência visual com a página inicial

### Toast/Notificações
- Use apenas `sonner` para notificações
- Importe de `src/lib/toast-transition.ts`

### Componentes
- Componentes UI em `src/components/ui/`
- Layouts em `src/components/layout/`
- Use TypeScript para todos os componentes

## Solução de Problemas

### Conflitos de Dependências
Se houver conflitos entre npm e yarn:

```bash
# Remover yarn.lock se existir
rm yarn.lock

# Limpar node_modules
rm -rf node_modules

# Reinstalar com npm
npm install
```

### Problemas de Fonte
Se as fontes não estiverem carregando:

1. Verifique se `src/lib/fonts.ts` está configurado corretamente
2. Confirme que o layout está importando as fontes
3. Verifique se as variáveis CSS estão no Tailwind config

### Problemas de Toast
Se as notificações não funcionarem:

1. Use apenas `sonner` - não use `react-hot-toast`
2. Importe de `src/lib/toast-transition.ts`
3. Verifique se o `<Toaster />` está no layout

## Status do Projeto

- ✅ Autenticação (95%)
- ✅ Dashboard com dados reais (90%)
- ✅ Sistema de compensação (85%)
- 🔄 Marketplace (60%)
- 🔄 Relatórios (40%)
- 🔄 Notificações (30%)
- 🔄 Blockchain (20%)

## Próximos Passos

1. **Marketplace**: Completar funcionalidades de compra/venda
2. **Notificações**: Sistema em tempo real
3. **Relatórios**: Dashboard avançado
4. **Testes**: Cobertura completa
5. **Performance**: Otimizações e cache 