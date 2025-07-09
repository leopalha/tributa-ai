# 🚀 Tributa.AI - Plataforma de Tokenização de Créditos Tributários

## 📋 Visão Geral

**Tributa.AI** é uma plataforma revolucionária que combina:
- ✅ **Sistema RCT** (Recuperação de Créditos Tributários)
- ✅ **Marketplace Universal** de Títulos de Crédito tokenizados
- ✅ **Blockchain Hyperledger Fabric** para segurança e transparência
- ✅ **IA ARIA** para assistência inteligente

## 🏗️ Arquitetura Técnica

### **Stack Principal**
- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: PostgreSQL
- **Blockchain**: Hyperledger Fabric (mock para desenvolvimento)
- **UI/UX**: Tailwind CSS + shadcn/ui + Radix UI

### **Funcionalidades Implementadas**

#### ✅ **Dashboard Executivo**
- Métricas em tempo real
- KPIs do marketplace
- Navegação completa
- ARIA IA integrada

#### ✅ **Marketplace Universal**
- Trading de TCs tokenizados
- Sistema de propostas
- Leilões em tempo real
- Analytics avançados

#### ✅ **Tokenização Avançada**
- Wizard de 6 etapas
- IA de precificação
- Upload de documentos
- Blockchain integration

#### ✅ **Compensação Multilateral**
- Engine de matching automático
- Análise de viabilidade
- Execução em blockchain
- Economia de custos

#### ✅ **KYC/Compliance**
- Verificação automatizada
- Score de risco
- Processo de 5 etapas
- Documentação completa

## 🚀 Setup e Instalação

### **Pré-requisitos**
```bash
# Node.js 18+
node --version

# PostgreSQL 14+
psql --version

# Git
git --version
```

### **1. Clone e Instale**
```bash
git clone [repository-url]
cd tributa-ai-web-new
npm install
```

### **2. Configure o Banco**
```bash
# Configure DATABASE_URL no .env
echo "DATABASE_URL=postgresql://user:password@localhost:5432/tributa_ai" > .env

# Sincronize o banco
npm run db:push

# Popule com dados de demonstração
npm run db:seed
```

### **3. Execute a Aplicação**
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🌐 URLs e Acesso

### **Aplicação Principal**
- **Homepage**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Marketplace**: http://localhost:3000/dashboard/marketplace
- **Tokenização**: http://localhost:3000/dashboard/marketplace/tokenizar
- **Compensação**: http://localhost:3000/dashboard/compensacao/multilateral
- **KYC**: http://localhost:3000/dashboard/kyc

### **Credenciais de Demonstração**
```
Administrador:
• Email: admin@tributa.ai
• Senha: admin123

Empresa 1:
• Email: joao@metalurgicaabc.com.br
• Senha: demo123

Empresa 2:
• Email: maria@energiaxyz.com.br
• Senha: demo123

Investidor:
• Email: carlos@fundotribut.com.br
• Senha: demo123

Profissional:
• Email: ana@contabeis.com.br
• Senha: demo123
```

## 🔧 APIs Implementadas

### **Marketplace**
```
GET    /api/marketplace/anuncios     # Listar anúncios
POST   /api/marketplace/anuncios     # Criar anúncio
GET    /api/marketplace/stats        # Estatísticas
```

### **Compensação**
```
POST   /api/compensacao/simular      # Simular compensação
GET    /api/compensacao/oportunidades # Listar oportunidades
```

### **Tokenização**
```
POST   /api/tokenization/create      # Tokenizar crédito
GET    /api/tokenization/status      # Status tokenização
```

### **Blockchain**
```
GET    /api/blockchain/status        # Status da rede
POST   /api/blockchain/invoke        # Invocar chaincode
```

### **Autenticação**
```
POST   /api/auth/login              # Login
POST   /api/auth/logout             # Logout
GET    /api/auth/me                 # Dados do usuário
```

## 📊 Banco de Dados

### **Scripts Úteis**
```bash
# Visualizar dados
npm run db:studio

# Reset completo
npm run db:reset

# Apenas seed
npm run db:seed

# Push schema
npm run db:push
```

### **Modelos Principais**
- **User**: Usuários do sistema
- **Empresa**: Empresas cadastradas
- **CreditTitle**: Títulos de crédito
- **CreditTitleTributario**: Detalhes tributários
- **Offer**: Ofertas de venda
- **Transaction**: Transações realizadas
- **Document**: Documentos anexados

## 🧪 Testes e Qualidade

### **Executar Testes**
```bash
# Testes unitários
npm test

# Testes com UI
npm run test:ui

# Verificação de tipos
npm run type-check

# Linting
npm run lint

# Formatação
npm run format
```

### **Coverage**
- Target: 80%+ cobertura
- Foco: Componentes críticos
- CI/CD: Automático

## 🚀 Deploy e Produção

### **Variáveis de Ambiente**
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/db

# JWT
JWT_SECRET=your-secret-key

# Blockchain
HYPERLEDGER_NETWORK_URL=grpc://localhost:7051
HYPERLEDGER_WALLET_PATH=./wallet

# APIs Governamentais
RECEITA_FEDERAL_API_KEY=your-key
SEFAZ_API_KEY=your-key
```

### **Docker (Planejado)**
```bash
# Build image
docker build -t tributa-ai .

# Run container
docker run -p 3000:3000 tributa-ai
```

## 📈 Roadmap de Desenvolvimento

### **✅ Fase 1 - Concluída (Q4 2024)**
- MVP completo funcional
- Frontend 100% implementado
- Backend APIs básicas
- Banco de dados estruturado
- Demo operacional

### **🚧 Fase 2 - Em Desenvolvimento (Q1 2025)**
- Hyperledger Fabric real
- APIs governamentais oficiais
- KYC automatizado completo
- Testes automatizados
- CI/CD pipeline

### **📋 Fase 3 - Planejado (Q2-Q4 2025)**
- Mobile app React Native
- IA pricing em tempo real
- Marketplace internacional
- DeFi integration
- Certificações de segurança

## 🎯 Status Atual

### **✅ Funcionalidades Operacionais**
- [x] Dashboard executivo com métricas
- [x] Marketplace com trading de TCs
- [x] Tokenização wizard completo
- [x] Compensação multilateral
- [x] KYC automatizado
- [x] ARIA IA assistente
- [x] Blockchain dashboard
- [x] Sistema de autenticação
- [x] Banco de dados populado

### **⚠️ Em Desenvolvimento**
- [ ] APIs governamentais reais
- [ ] Blockchain Hyperledger real
- [ ] Testes automatizados completos
- [ ] Deploy em produção
- [ ] Documentação completa

## 📞 Suporte e Contato

### **Desenvolvimento**
- Email: dev@tributa.ai
- GitHub: [Repository URL]
- Documentação: [Docs URL]

### **Business**
- Email: contato@tributa.ai
- Website: https://tributa.ai
- LinkedIn: [Company Page]

---

**🎉 Tributa.AI - Revolucionando o mercado de créditos tributários!**

*Desenvolvido com excelência técnica e visão de futuro.* 🇧🇷✨
