# 🚀 TRIBUTA.AI - Guia Completo de Deployment

## 🎯 Visão Geral da Arquitetura

Tributa.AI é uma **plataforma SaaS vertical de IA** para créditos tributários.

### Componentes do Sistema:

```
1. FRONTEND (React/TypeScript)
   └─ Interface web para clientes

2. BACKEND API + AGENTES DE PRODUÇÃO (Node.js)
   └─ 5 agentes IA rodando 24/7

3. DATABASE (PostgreSQL)
   └─ Dados dos clientes e análises

4. AGENTES DE DESENVOLVIMENTO (Local)
   └─ 6 agentes para desenvolver o produto
```

---

## 🏗️ SEPARAÇÃO: Produção vs Desenvolvimento

### **AGENTES DE PRODUÇÃO** (24/7 na nuvem - Railway)

Atendem seus clientes pagantes:

| Agente | Função | Por que 24/7? |
|--------|--------|---------------|
| 🎤 **ARIA** | Atendimento | Clientes precisam de suporte a qualquer hora |
| 🔮 **ORACLE** | Validação | Análise de créditos tributários automática |
| ⚖️ **THEMIS** | Compliance | Monitoramento LGPD e legal contínuo |
| ⚡ **AETHER** | Performance | Otimização em tempo real do sistema |
| 🧠 **NEXUS** | Coordenação | Orquestra todos os agentes de produção |

**Custo:** $100-200/mês (Railway + OpenRouter)
**Retorno:** Seus clientes PAGAM por isso!

---

### **AGENTES DE DESENVOLVIMENTO** (Local - seu PC)

Ajudam VOCÊ a desenvolver:

| Agente | Função | Por que local? |
|--------|--------|----------------|
| 🔧 **EXECUTOR** | Correções | Edita código local no seu PC |
| 🛡️ **HELIOS** | Build/Segurança | Valida builds no seu ambiente |
| 🎨 **ATLAS** | UI/UX | Cria interfaces localmente |
| 🧹 **THANOS** | Limpeza | Refatora código local |
| 🌱 **GENESIS** | Geração | Gera código novo localmente |
| 👑 **LIA** | Coordenação Dev | Orquestra desenvolvimento |

**Custo:** $0/mês (roda quando você precisar)
**Retorno:** Você desenvolve mais rápido!

---

## 📋 DEPLOYMENT COMPLETO

### **1️⃣ FRONTEND → Vercel (GRÁTIS)**

#### Passo a Passo:

1. Acesse https://vercel.com
2. Conecte o GitHub (leopalha/tributa-ai)
3. Configure:
   ```
   Framework Preset: Vite
   Root Directory: /
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
4. Environment Variables:
   ```
   VITE_API_URL=https://tributa-api.railway.app
   VITE_ENV=production
   ```
5. Deploy!

**URL Final:** https://tributa-ai.vercel.app

---

### **2️⃣ BACKEND + AGENTES → Railway (PAGO)**

#### Passo a Passo:

1. **Criar PostgreSQL:**
   - Railway Dashboard → "+ New"
   - "Database" → "PostgreSQL"
   - Aguardar criação

2. **Executar Schema SQL:**
   - PostgreSQL → "Data" → "Query"
   - Cole `.lia/agents/genesis/src/db/init-schema.sql`
   - Execute

3. **Criar Serviço GENESIS:**
   - "+ New" → "GitHub Repo"
   - Escolha "leopalha/tributa-ai"

4. **Configurar ANTES do primeiro deploy:**

   **Settings → Source:**
   ```
   Root Directory: .lia/agents/genesis
   ```

   **Settings → Deploy:**
   ```
   Start Command: node genesis-enterprise-system.js
   ```

   **Variables:**
   ```bash
   NODE_ENV=production
   PORT=3003

   # OpenRouter API
   OPENROUTER_API_KEY=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

   # Agentes de Produção (ativados)
   ENABLE_ARIA=true
   ENABLE_ORACLE=true
   ENABLE_THEMIS=true
   ENABLE_AETHER=true
   ENABLE_NEXUS=true

   # Agentes de Dev (desativados em prod)
   ENABLE_EXECUTOR=false
   ENABLE_HELIOS=false
   ENABLE_ATLAS=false
   ENABLE_THANOS=false
   ENABLE_GENESIS_AGENT=false
   ENABLE_LIA=false
   ```

   **Database Reference:**
   - Variables → "+ New Variable" → "Add Reference"
   - Escolha PostgreSQL
   - Marque `DATABASE_URL`

5. **Deploy!**
   - Deployments → aguardar build (~3 min)
   - Verificar logs

**URL Final:** https://tributa-api.railway.app

---

### **3️⃣ AGENTES DE DEV → Seu PC (LOCAL)**

#### Como usar:

1. **No terminal local:**
   ```bash
   cd d:/tributa-ai
   npm install
   ```

2. **Rodar GENESIS localmente:**
   ```bash
   # Opção 1: Via bat
   .lia/agents/genesis/start-local.bat

   # Opção 2: Direto
   node .lia/agents/genesis/genesis-enterprise-system.js
   ```

3. **Environment variables locais** (`.env`):
   ```bash
   NODE_ENV=development
   OPENROUTER_API_KEY=sua-chave

   # Agentes de Dev (ativados local)
   ENABLE_EXECUTOR=true
   ENABLE_HELIOS=true
   ENABLE_ATLAS=true
   ENABLE_THANOS=true
   ENABLE_GENESIS_AGENT=true
   ENABLE_LIA=true

   # Agentes de Prod (desativados local)
   ENABLE_ARIA=false
   ENABLE_ORACLE=false
   ENABLE_THEMIS=false
   ENABLE_AETHER=false
   ENABLE_NEXUS=false
   ```

4. **Acessar:**
   - Dashboard: http://localhost:3003/dashboard
   - API: http://localhost:3003/api/health

---

## 💰 CUSTOS DETALHADOS

### **Opção Atual (Recomendada):**

```
Vercel:
├─ Frontend hosting: $0/mês
└─ 100GB bandwidth: $0/mês
                             SUBTOTAL: $0/mês

Railway Pro Plan:
├─ Plano fixo: $20/mês
├─ PostgreSQL: $5-10/mês
├─ GENESIS service: $10-20/mês (compute)
└─ Bandwidth: $5-10/mês
                             SUBTOTAL: $40-60/mês

OpenRouter API (variável):
├─ ARIA (atendimento): $20-50/mês
├─ ORACLE (validação): $30-70/mês
├─ THEMIS (compliance): $10-20/mês
├─ AETHER (performance): $5-15/mês
└─ NEXUS (coordenação): $10-25/mês
                             SUBTOTAL: $75-180/mês

Agentes Dev (local): $0/mês
                             SUBTOTAL: $0/mês

───────────────────────────────────────
TOTAL MENSAL: $115-240/mês
```

### **Modelo de Negócio (como cobrar clientes):**

```
Plano Básico: $97/mês
├─ 100 análises de crédito/mês
├─ Suporte ARIA 24/7
└─ Compliance automático

Plano Pro: $297/mês
├─ 500 análises/mês
├─ Suporte prioritário
└─ Relatórios avançados

Plano Enterprise: $997/mês
├─ Análises ilimitadas
├─ API dedicada
└─ SLA 99.9%

───────────────────────────────────────
Com 5 clientes Pro: $1,485/mês de receita
Custo operacional: -$200/mês
LUCRO: $1,285/mês (642% ROI)
```

---

## 🔍 MONITORAMENTO

### **Verificar se está funcionando:**

1. **Frontend:**
   ```bash
   curl https://tributa-ai.vercel.app
   # Deve retornar HTML
   ```

2. **Backend:**
   ```bash
   curl https://tributa-api.railway.app/api/health
   # Deve retornar JSON com status healthy
   ```

3. **Agentes:**
   ```bash
   curl https://tributa-api.railway.app/api/agents
   # Deve mostrar 5 agentes ativos (ARIA, ORACLE, THEMIS, AETHER, NEXUS)
   ```

### **Logs no Railway:**

- Deployments → Logs
- Procure por:
  ```
  ✅ PostgreSQL conectado
  ✅ Agentes de produção inicializados
  ✅ ARIA ativo
  ✅ ORACLE ativo
  ✅ THEMIS ativo
  ✅ AETHER ativo
  ✅ NEXUS ativo
  ✅ HTTP Server rodando na porta 3003
  ```

---

## 🚨 TROUBLESHOOTING

### Deploy falha no Railway:

1. **Verifique Root Directory:**
   - Deve ser exatamente: `.lia/agents/genesis`

2. **Verifique Start Command:**
   - Deve ser: `node genesis-enterprise-system.js`

3. **Verifique variáveis:**
   - `DATABASE_URL` deve estar conectada ao Postgres
   - `OPENROUTER_API_KEY` deve estar preenchida

### Agentes não ativam:

1. Verifique variáveis `ENABLE_*=true`
2. Veja logs: `❌ Agente X desabilitado`
3. Force redeploy

### Custo muito alto:

1. Verifique quantos clientes estão usando
2. Configure `maxDailyCost` em `production-agents.json`
3. Otimize prompts dos agentes
4. Use modelos mais baratos (haiku vs opus)

---

## 📊 PRÓXIMOS PASSOS

Depois do deploy inicial:

1. ✅ Configurar domínio customizado (tributa.ai)
2. ✅ Configurar SSL/HTTPS automático
3. ✅ Integrar frontend com backend
4. ✅ Implementar autenticação (JWT)
5. ✅ Configurar alertas de custo
6. ✅ Implementar rate limiting
7. ✅ Adicionar métricas de uso
8. ✅ Criar dashboard de admin

---

**Última Atualização:** 25/11/2025
**Versão:** 1.0.0
**Autor:** Leonardo Palha
