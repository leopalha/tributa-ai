# 🧠 GENESIS Enterprise System - Como Funciona

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Os 11 Agentes de IA](#os-11-agentes-de-ia)
3. [Componentes Principais](#componentes-principais)
4. [Como os Agentes se Comunicam](#como-os-agentes-se-comunicam)
5. [Como Desenvolvedores Interagem](#como-desenvolvedores-interagem)
6. [Como Usuários/Clientes Interagem](#como-usuáriosclientes-interagem)
7. [Fluxos de Trabalho Práticos](#fluxos-de-trabalho-práticos)
8. [API Endpoints Disponíveis](#api-endpoints-disponíveis)

---

## 🎯 Visão Geral da Arquitetura

O GENESIS Enterprise System v4.1 é um **sistema multi-agente autônomo** que utiliza **11 agentes especializados** de IA para executar tarefas complexas de forma coordenada.

### Arquitetura em Camadas:

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (React/Vite)                  │
│              https://tributa-ai.vercel.app              │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│           GENESIS ENTERPRISE SYSTEM v4.1                │
│        https://tributa-ai-production.railway.app        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         HTTP Server (Express-like)              │   │
│  │  • Dashboard HTML                               │   │
│  │  • API REST Endpoints                           │   │
│  │  • WebSocket Server                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         5 COMPONENTES PRINCIPAIS                │   │
│  │  1️⃣  WorkflowEngine - Orquestração             │   │
│  │  2️⃣  AgentBus - Comunicação Real-time          │   │
│  │  3️⃣  RealTimeMetrics - Monitoramento           │   │
│  │  4️⃣  AutoOptimizer - ML Otimização             │   │
│  │  5️⃣  TaskProcessor - Fila PostgreSQL           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         11 AGENTES ESPECIALIZADOS               │   │
│  │                                                  │   │
│  │  PRODUÇÃO (24/7):                               │   │
│  │  • ARIA - Atendimento Cliente                   │   │
│  │  • ORACLE - Validação Tributária                │   │
│  │  • THEMIS - Compliance LGPD                     │   │
│  │  • AETHER - Performance                         │   │
│  │  • NEXUS - Coordenação                          │   │
│  │                                                  │   │
│  │  DESENVOLVIMENTO (Local):                       │   │
│  │  • LIA - Orquestrador Supreme                   │   │
│  │  • EXECUTOR - Correções Frontend                │   │
│  │  • HELIOS - Segurança & Build                   │   │
│  │  • ATLAS - UI/UX Designer                       │   │
│  │  • GENESIS - Geração de Código                  │   │
│  │  • THANOS - Limpeza de Código                   │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ PostgreSQL Connection
                     ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL DATABASE                        │
│  • agent_tasks (fila de tarefas)                       │
│  • agent_logs (logs de execução)                       │
│  • metrics (métricas de performance)                    │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              OpenRouter API (LLMs)                      │
│  • Claude 3 Opus/Sonnet/Haiku                          │
│  • GPT-4/GPT-4-turbo                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🤖 Os 11 Agentes de IA

### **AGENTES DE PRODUÇÃO** (Atendem clientes 24/7)

#### 1. 🎤 **ARIA - Conversational Expert**
- **Função**: Atendimento ao cliente
- **Modelo**: Claude 3 Sonnet
- **Prioridade**: 1 (Máxima)
- **Quando Ativa**: Cliente envia mensagem, faz pergunta, precisa de suporte
- **Capacidades**:
  - Suporte ao cliente via chat
  - Responder dúvidas sobre créditos tributários
  - Onboarding de novos usuários
  - Educação tributária com empatia
- **Custo Limite**: $10/dia

#### 2. 🔮 **ORACLE - Quality Guardian**
- **Função**: Validação de créditos tributários
- **Modelo**: GPT-4
- **Prioridade**: 2
- **Quando Ativa**: Cliente solicita análise de crédito, upload de documentos fiscais
- **Capacidades**:
  - Análise automática de documentos fiscais
  - Validação de elegibilidade para créditos
  - Testes de qualidade de dados
  - Debugging de processos tributários
- **Custo Limite**: $3/dia

#### 3. ⚖️ **THEMIS - Compliance Master**
- **Função**: Garantir conformidade legal
- **Modelo**: GPT-4
- **Prioridade**: 2
- **Quando Ativa**: Operações que envolvem dados pessoais, auditorias, validações legais
- **Capacidades**:
  - Compliance LGPD automático
  - Validação de regulamentações fiscais
  - Audit trail (trilha de auditoria)
  - Monitoramento de riscos legais
  - Privacidade de dados
- **Custo Limite**: $8/dia

#### 4. ⚡ **AETHER - Performance Guru**
- **Função**: Otimização de performance
- **Modelo**: Claude 3 Haiku (rápido e barato)
- **Prioridade**: 5
- **Quando Ativa**: Continuamente monitorando performance do sistema
- **Capacidades**:
  - Otimização de velocidade de resposta
  - Bundle optimization
  - Caching inteligente
  - Lazy loading
  - Redução de latência
- **Custo Limite**: $2/dia

#### 5. 🧠 **NEXUS - CTO-AI Coordenador**
- **Função**: Coordenar todos os agentes de produção
- **Modelo**: Claude 3 Sonnet
- **Prioridade**: 2
- **Quando Ativa**: Sempre que múltiplos agentes precisam trabalhar juntos
- **Capacidades**:
  - Coordenação técnica entre agentes
  - Arquitetura de soluções
  - Planejamento de integrações
  - Decisões técnicas estratégicas
- **Custo Limite**: $5/dia

---

### **AGENTES DE DESENVOLVIMENTO** (Rodam localmente quando necessário)

#### 6. 👑 **LIA - Coordenadora Supreme**
- **Função**: Orquestração máxima de desenvolvimento
- **Modelo**: Claude 3 Opus (mais poderoso)
- **Prioridade**: 1
- **Quando Ativa**: Tarefas complexas que exigem coordenação de múltiplos agentes dev
- **Capacidades**:
  - Delegação inteligente de tarefas
  - Monitoramento de progresso
  - Estratégia de desenvolvimento
  - Coordenação suprema
- **Custo Limite**: $10/dia

#### 7. 🔧 **EXECUTOR - Frontend Specialist**
- **Função**: Correções rápidas de código frontend
- **Modelo**: Claude 3 Haiku (rápido)
- **Prioridade**: 3
- **Quando Ativa**: Erros de syntax, bugs simples de React/TypeScript
- **Capacidades**:
  - Correção de erros React
  - Fixes TypeScript
  - Debugging de UI
  - Correções de syntax
- **Custo Limite**: $2/dia

#### 8. 🛡️ **HELIOS - Security Master**
- **Função**: Segurança e builds
- **Modelo**: GPT-4
- **Prioridade**: 3
- **Quando Ativa**: Validar builds, checks de segurança, monitoring
- **Capacidades**:
  - Validação de builds
  - Security audits
  - Health checks
  - Compliance de código
- **Custo Limite**: $4/dia

#### 9. 🎨 **ATLAS - UI/UX Perfectionist**
- **Função**: Design de interfaces Bloomberg-level
- **Modelo**: GPT-4 Turbo
- **Prioridade**: 4
- **Quando Ativa**: Criar/melhorar componentes UI, design system
- **Capacidades**:
  - Design de interfaces profissionais
  - Otimização de UX
  - Styling e acessibilidade
  - User experience
- **Custo Limite**: $3/dia

#### 🌱 **GENESIS - Code Architect**
- **Função**: Geração de código enterprise
- **Modelo**: Claude 3 Sonnet
- **Prioridade**: 4
- **Quando Ativa**: Criar novos componentes, arquitetura, templates
- **Capacidades**:
  - Geração de código de alta qualidade
  - Arquitetura de componentes
  - Design patterns
  - Scaffolding de projetos
- **Custo Limite**: $4/dia

#### 🧹 **THANOS - Code Cleaner Supreme**
- **Função**: Limpeza de código
- **Modelo**: Claude 3 Haiku
- **Prioridade**: 6
- **Quando Ativa**: Remover código morto, otimizar imports, refatoração
- **Capacidades**:
  - Remoção de dead code
  - Otimização de imports
  - Refatoração de código
  - Limpeza de dependencies
- **Custo Limite**: $1/dia

---

## 🔧 Componentes Principais

### 1️⃣ **WorkflowEngine** (Orquestração)

**Responsabilidade**: Coordenar workflows complexos entre múltiplos agentes.

**Como funciona**:
```javascript
// Exemplo: Quando cliente solicita análise de crédito
WorkflowEngine.execute({
  type: 'credit_analysis',
  steps: [
    { agent: 'aria', action: 'greet_customer' },
    { agent: 'oracle', action: 'validate_documents' },
    { agent: 'themis', action: 'check_lgpd_compliance' },
    { agent: 'aria', action: 'send_results' }
  ]
})
```

**Recursos**:
- Execução paralela de tarefas independentes
- Retry automático em caso de falha
- Timeout configurável (300s default)
- Priorização de tarefas
- Fila de execução

---

### 2️⃣ **AgentBus** (Comunicação Real-time)

**Responsabilidade**: Comunicação WebSocket entre agentes em tempo real.

**Como funciona**:
```javascript
// ARIA envia mensagem para ORACLE
AgentBus.send({
  from: 'aria',
  to: 'oracle',
  channel: 'coordination',
  type: 'validate_credit',
  data: { documentId: '123', customerId: '456' }
})

// ORACLE responde
AgentBus.subscribe('aria', (message) => {
  if (message.type === 'validation_complete') {
    // Processar resultado
  }
})
```

**Canais de Comunicação**:
- `system` - Mensagens globais de sistema
- `coordination` - Coordenação LIA/NEXUS
- `frontend` - Tarefas UI (EXECUTOR, ATLAS)
- `backend` - Tarefas API/Backend
- `security` - HELIOS (segurança e builds)
- `testing` - ORACLE (testes e validação)
- `performance` - AETHER (otimizações)
- `cleanup` - THANOS (limpeza de código)
- `customer_service` - ARIA (atendimento)
- `compliance` - THEMIS (legal e LGPD)

**Recursos**:
- WebSocket para comunicação bidirecional
- Message queuing (fila de mensagens)
- Heartbeat automático (30s)
- Retry em caso de falha (3x)
- Histórico de mensagens
- Estado compartilhado entre agentes

---

### 3️⃣ **RealTimeMetrics** (Monitoramento)

**Responsabilidade**: Coletar e expor métricas em tempo real.

**Métricas Coletadas**:
```json
{
  "system": {
    "uptime": 3600000,
    "totalTasks": 150,
    "activeTasks": 5,
    "completedTasks": 145,
    "failedTasks": 0
  },
  "agents": {
    "aria": {
      "status": "active",
      "tasksProcessed": 45,
      "averageResponseTime": 1200,
      "successRate": 98.5,
      "totalCost": 4.32
    },
    "oracle": {
      "status": "active",
      "tasksProcessed": 30,
      "averageResponseTime": 2500,
      "successRate": 100,
      "totalCost": 2.15
    }
  },
  "costs": {
    "today": 15.47,
    "thisMonth": 234.56,
    "limit": 50.0
  }
}
```

**Alertas Automáticos**:
- Custo diário ultrapassando limite
- Taxa de erro acima de 5%
- Tempo de resposta > 10s
- Agente offline/travado
- Fila de tarefas > 50

---

### 4️⃣ **AutoOptimizer** (ML Otimização)

**Responsabilidade**: Aprendizado de máquina para otimizar performance dos agentes.

**Como funciona**:
1. Coleta dados de performance de cada agente
2. Identifica padrões de uso e gargalos
3. Ajusta automaticamente:
   - Modelo de IA usado (Claude vs GPT-4)
   - Concorrência máxima
   - Prioridades de tarefas
   - Cache strategies

**Exemplo**:
```javascript
// AutoOptimizer detecta que ORACLE está lento
AutoOptimizer.analyze('oracle')
// Resultado: "Oracle está usando GPT-4 para tarefas simples"
// Ação: Switch para Claude Haiku em 70% das tarefas
// Resultado: Tempo reduzido de 2.5s → 0.8s, custo reduzido 60%
```

---

### 5️⃣ **TaskProcessor** (Fila PostgreSQL)

**Responsabilidade**: Gerenciar fila de tarefas persistente no banco de dados.

**Schema**:
```sql
CREATE TABLE agent_tasks (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),          -- 'credit_analysis', 'customer_support', etc
    priority VARCHAR(20),      -- 'high', 'medium', 'low'
    status VARCHAR(20),        -- 'pending', 'processing', 'completed', 'failed'
    assigned_agent VARCHAR(50), -- 'aria', 'oracle', etc
    created_at TIMESTAMP,
    completed_at TIMESTAMP,
    tokens_used DECIMAL,
    cost_usd DECIMAL
);
```

**Como funciona**:
1. Tarefa criada via API POST /api/tasks
2. TaskProcessor coloca na fila PostgreSQL
3. WorkflowEngine pega próxima tarefa pendente
4. Delega para agente apropriado via AgentBus
5. Agente executa e atualiza status
6. Métricas salvas no banco

---

## 💬 Como os Agentes se Comunicam

### **Fluxo de Comunicação Interna**:

```
1. TAREFA ENTRA NO SISTEMA
   │
   ▼
2. TaskProcessor → PostgreSQL (persiste tarefa)
   │
   ▼
3. WorkflowEngine → Analisa tipo da tarefa
   │
   ▼
4. WorkflowEngine → Decide quais agentes precisam atuar
   │
   ▼
5. AgentBus.send() → Envia mensagem para agente(s)
   │
   ├─▶ ARIA (se atendimento)
   ├─▶ ORACLE (se validação)
   ├─▶ THEMIS (se compliance)
   └─▶ Etc...
   │
   ▼
6. Agente RECEBE via WebSocket
   │
   ▼
7. Agente PROCESSA (chama OpenRouter API)
   │
   ▼
8. Agente RESPONDE via AgentBus
   │
   ▼
9. RealTimeMetrics → Registra métricas
   │
   ▼
10. AutoOptimizer → Aprende com resultado
   │
   ▼
11. TaskProcessor → Atualiza status no PostgreSQL
   │
   ▼
12. RESULTADO RETORNADO AO CLIENTE
```

### **Exemplo Prático: Cliente Pergunta sobre Crédito**

```javascript
// 1. Cliente envia mensagem via frontend
POST /api/tasks
{
  "type": "customer_question",
  "description": "Tenho direito a crédito PIS/COFINS?"
}

// 2. Sistema identifica que precisa de ARIA
WorkflowEngine.assign({
  taskId: 'uuid-123',
  agent: 'aria',
  priority: 'high'
})

// 3. ARIA recebe via AgentBus
AgentBus.subscribe('aria', (message) => {
  // ARIA processa com Claude 3 Sonnet
  const response = await callOpenRouter({
    model: 'claude-3-sonnet',
    prompt: `Cliente perguntou: ${message.data.description}`
  })

  // ARIA responde
  AgentBus.send({
    from: 'aria',
    to: 'system',
    type: 'response',
    data: {
      answer: response,
      confidence: 0.95
    }
  })
})

// 4. Se ARIA tem dúvida, consulta ORACLE
if (confidence < 0.8) {
  AgentBus.send({
    from: 'aria',
    to: 'oracle',
    channel: 'coordination',
    type: 'validate_answer',
    data: { answer, question }
  })
}

// 5. ORACLE valida tecnicamente
AgentBus.subscribe('oracle', (message) => {
  if (message.type === 'validate_answer') {
    // ORACLE usa GPT-4 para validação técnica
    const validation = await validateTaxCredit(message.data)

    AgentBus.send({
      from: 'oracle',
      to: 'aria',
      type: 'validation_result',
      data: validation
    })
  }
})

// 6. ARIA envia resposta final ao cliente
```

---

## 👨‍💻 Como Desenvolvedores Interagem

### **1. Via API REST**

```bash
# Listar todos os agentes
curl https://tributa-ai-production.railway.app/api/agents

# Ver status do sistema
curl https://tributa-ai-production.railway.app/api/status

# Ver métricas
curl https://tributa-ai-production.railway.app/api/metrics

# Criar nova tarefa
curl -X POST https://tributa-ai-production.railway.app/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Analisar documento fiscal",
    "type": "document_analysis",
    "priority": "high",
    "data": {
      "documentId": "123",
      "customerId": "456"
    }
  }'

# Buscar tarefa específica
curl https://tributa-ai-production.railway.app/api/tasks/uuid-123

# Listar tarefas pendentes
curl https://tributa-ai-production.railway.app/api/tasks/pending

# Cancelar tarefa
curl -X DELETE https://tributa-ai-production.railway.app/api/tasks/uuid-123
```

### **2. Via Dashboard Web**

Acesse: https://tributa-ai-production.railway.app/dashboard

**Recursos do Dashboard**:
- ✅ Visualização em tempo real de todos os 5 agentes de produção
- ✅ Métricas de performance (response time, success rate)
- ✅ Custos acumulados (diário e mensal)
- ✅ Status de cada agente (active, idle, error)
- ✅ Gráficos de atividade
- ✅ Logs de execução
- ✅ Alertas e otimizações

### **3. Via WebSocket (Real-time)**

```javascript
// Frontend conecta ao WebSocket
const ws = new WebSocket('wss://tributa-ai-production.railway.app');

ws.onopen = () => {
  console.log('Conectado ao GENESIS');

  // Subscrever a updates de um agente específico
  ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'customer_service', // Canal da ARIA
    agentId: 'aria'
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'agent:status_update') {
    console.log(`ARIA está ${message.data.status}`);
  }

  if (message.type === 'task:completed') {
    console.log('Tarefa completada:', message.data);
  }
};
```

### **4. Via Código Local (SDK)**

```javascript
// Importar o sistema GENESIS localmente
const GenesisSystem = require('./.lia/agents/genesis/genesis-enterprise-system.js');

// Inicializar sistema local (agentes de DEV)
const genesis = new GenesisSystem({
  projectPath: 'D:/tributa-ai',
  port: 3003,

  // Ativar apenas agentes de desenvolvimento
  agents: {
    lia: true,
    executor: true,
    helios: true,
    atlas: true,
    genesis: true,
    thanos: true,

    // Desativar agentes de produção localmente
    aria: false,
    oracle: false,
    themis: false,
    aether: false,
    nexus: false
  }
});

await genesis.start();

// Criar tarefa programaticamente
const task = await genesis.createTask({
  title: 'Corrigir bug no componente Header',
  type: 'bug_fix',
  priority: 'high',
  assignedAgent: 'executor'
});

// Monitorar progresso
genesis.on('task:completed', (result) => {
  console.log('Tarefa completada:', result);
});
```

---

## 👥 Como Usuários/Clientes Interagem

### **1. Via Interface Web (React Frontend)**

```
Cliente acessa: https://tributa-ai.vercel.app
│
├─ Login/Cadastro
│
├─ Dashboard do Cliente
│  ├─ Meus Créditos Tributários
│  ├─ Análises em Andamento
│  └─ Histórico de Recuperações
│
├─ Chat com ARIA (Atendimento 24/7)
│  ├─ Cliente: "Tenho direito a crédito ICMS?"
│  └─ ARIA: "Vou analisar sua situação..." → Consulta ORACLE
│
├─ Upload de Documentos Fiscais
│  └─ ORACLE valida automaticamente
│  └─ THEMIS verifica compliance LGPD
│
└─ Relatórios e Resultados
   └─ Créditos identificados
   └─ Valor estimado de recuperação
   └─ Status de cada processo
```

### **2. Fluxo Completo de Interação**

**Exemplo: Cliente quer recuperar crédito tributário**

```
PASSO 1: Cliente faz upload de notas fiscais
│
▼
FRONTEND (React)
├─ Valida arquivos (XML, PDF)
├─ Upload para storage
└─ POST /api/tasks { type: 'document_analysis' }
│
▼
GENESIS SYSTEM
├─ TaskProcessor recebe tarefa
├─ WorkflowEngine coordena agentes
│
├─▶ THEMIS valida LGPD
│   ├─ Dados pessoais anonimizados?
│   ├─ Consentimento do cliente?
│   └─ ✅ Compliance OK
│
├─▶ ORACLE analisa documentos
│   ├─ Identifica tipo de crédito (PIS, COFINS, ICMS)
│   ├─ Calcula valor elegível
│   ├─ Verifica inconsistências
│   └─ ✅ Análise completa
│
├─▶ ARIA prepara relatório humanizado
│   ├─ Traduz termos técnicos
│   ├─ Explica oportunidades
│   └─ ✅ Relatório pronto
│
├─▶ AETHER otimiza envio
│   └─ ✅ Cache de resultados similares
│
▼
RESULTADO RETORNA AO CLIENTE
├─ Notificação em tempo real (WebSocket)
├─ Email com relatório detalhado
└─ Dashboard atualizado
```

### **3. Chat em Tempo Real com ARIA**

```javascript
// Frontend conecta WebSocket
const chatWs = new WebSocket('wss://tributa-ai-production.railway.app');

// Cliente digita mensagem
function sendMessage(message) {
  chatWs.send(JSON.stringify({
    type: 'customer_message',
    customerId: 'cliente-123',
    message: message,
    channel: 'customer_service'
  }));
}

// ARIA responde em tempo real
chatWs.onmessage = (event) => {
  const response = JSON.parse(event.data);

  if (response.type === 'aria:response') {
    displayMessage(response.data.message);
  }
};

// Exemplo de conversa:
Cliente: "Quanto posso recuperar de ICMS?"
ARIA: "Vou analisar seus documentos. Um momento..."
[ARIA consulta ORACLE internamente]
ARIA: "Identifiquei R$ 45.320,00 em créditos ICMS elegíveis..."
```

---

## 🔄 Fluxos de Trabalho Práticos

### **Fluxo 1: Atendimento ao Cliente (ARIA)**

```
1. Cliente envia mensagem
   ↓
2. Frontend → POST /api/tasks { type: 'customer_support' }
   ↓
3. TaskProcessor → PostgreSQL (persist)
   ↓
4. WorkflowEngine → Assign to ARIA
   ↓
5. AgentBus → Send to ARIA channel
   ↓
6. ARIA → Process with Claude 3 Sonnet
   ↓
7. ARIA → Check if needs specialist
   ├─ Se pergunta técnica → Consulta ORACLE
   ├─ Se questão legal → Consulta THEMIS
   └─ Se dúvida simples → Responde direto
   ↓
8. ARIA → Send response via AgentBus
   ↓
9. WebSocket → Push to frontend
   ↓
10. Cliente vê resposta em tempo real
```

### **Fluxo 2: Validação de Crédito Tributário (ORACLE)**

```
1. Cliente upload documentos
   ↓
2. Frontend → POST /api/tasks { type: 'credit_validation' }
   ↓
3. WorkflowEngine coordena 3 agentes em paralelo:
   ├─ THEMIS: Valida LGPD compliance
   ├─ ORACLE: Analisa documentos fiscais
   └─ AETHER: Prepara cache para futuras consultas
   ↓
4. ORACLE usa GPT-4 para:
   ├─ Extrair dados dos XMLs/PDFs
   ├─ Identificar tipos de crédito
   ├─ Calcular valores elegíveis
   ├─ Detectar inconsistências
   └─ Gerar relatório técnico
   ↓
5. ARIA "traduz" relatório técnico para linguagem cliente
   ↓
6. Resultado enviado ao cliente
   ↓
7. Métricas salvas (RealTimeMetrics)
   ↓
8. AutoOptimizer aprende com o processo
```

### **Fluxo 3: Otimização Contínua (AETHER + AutoOptimizer)**

```
[Background Process - 24/7]

1. AETHER monitora performance
   ├─ Tempo de resposta de cada agente
   ├─ Taxa de sucesso
   ├─ Custo por tarefa
   └─ Uso de recursos
   ↓
2. RealTimeMetrics coleta dados
   ↓
3. AutoOptimizer analisa patterns
   ├─ "ORACLE está lento em análises simples"
   ├─ "70% das tarefas poderiam usar modelo mais barato"
   ├─ "Cache hit rate baixo"
   ↓
4. AutoOptimizer aplica otimizações
   ├─ Switch ORACLE para Claude Haiku em tasks simples
   ├─ Aumenta cache TTL
   ├─ Ajusta concorrência de ARIA (3 → 5)
   ↓
5. RealTimeMetrics monitora impacto
   ├─ Response time: 2.5s → 0.8s ✅
   ├─ Cost: $3.50/dia → $1.20/dia ✅
   ├─ Success rate: 98% → 99.5% ✅
   ↓
6. AutoOptimizer mantém otimizações ou reverte
```

---

## 📡 API Endpoints Disponíveis

### **Base URL**: `https://tributa-ai-production.railway.app`

### **1. Health & Status**

#### `GET /api/health`
Verifica se sistema está online.

**Response**:
```json
{
  "status": "healthy",
  "uptime": 3600000,
  "timestamp": "2025-11-26T10:30:00Z"
}
```

#### `GET /api/status`
Status completo do sistema.

**Response**:
```json
{
  "system": {
    "version": "4.1.0",
    "environment": "production",
    "uptime": 3600000
  },
  "components": {
    "workflowEngine": "active",
    "agentBus": "active",
    "realTimeMetrics": "active",
    "autoOptimizer": "active",
    "taskProcessor": "active"
  },
  "database": {
    "status": "connected",
    "latency": 15
  }
}
```

---

### **2. Agents**

#### `GET /api/agents`
Lista todos os agentes e seus status.

**Response**:
```json
{
  "aria": {
    "name": "ARIA Conversational Expert",
    "role": "customer_service",
    "status": "active",
    "model": "claude-3-sonnet",
    "tasksProcessed": 45,
    "averageResponseTime": 1200,
    "successRate": 98.5,
    "currentCost": 4.32
  },
  "oracle": {
    "name": "ORACLE Quality Guardian",
    "role": "testing",
    "status": "active",
    "model": "gpt-4",
    "tasksProcessed": 30,
    "averageResponseTime": 2500,
    "successRate": 100,
    "currentCost": 2.15
  },
  "themis": { ... },
  "aether": { ... },
  "nexus": { ... }
}
```

---

### **3. Métricas**

#### `GET /api/metrics`
Métricas detalhadas do sistema.

**Response**:
```json
{
  "performance": {
    "averageResponseTime": 1850,
    "totalRequests": 1234,
    "successRate": 99.2
  },
  "costs": {
    "today": 15.47,
    "thisWeek": 98.32,
    "thisMonth": 234.56,
    "dailyLimit": 50.0
  },
  "agents": {
    "aria": {
      "utilization": 0.75,
      "queueSize": 2,
      "activeChats": 3
    }
  }
}
```

---

### **4. Tasks (Tarefas)**

#### `GET /api/tasks`
Lista todas as tarefas (limit 50).

**Query Parameters**:
- `status` - Filtrar por status (pending, processing, completed, failed)
- `limit` - Máximo de resultados (default: 50)
- `offset` - Offset para paginação

**Response**:
```json
{
  "tasks": [
    {
      "id": "uuid-123",
      "title": "Análise de crédito ICMS",
      "type": "credit_analysis",
      "status": "completed",
      "assignedAgent": "oracle",
      "createdAt": "2025-11-26T10:00:00Z",
      "completedAt": "2025-11-26T10:02:30Z",
      "tokensUsed": 1250,
      "costUsd": 0.045
    }
  ],
  "total": 150,
  "page": 1
}
```

#### `POST /api/tasks`
Cria nova tarefa.

**Request Body**:
```json
{
  "title": "Validar nota fiscal",
  "description": "Cliente enviou NF-e para validação",
  "type": "document_validation",
  "priority": "high",
  "data": {
    "documentId": "nfe-456",
    "customerId": "cliente-789"
  }
}
```

**Response**:
```json
{
  "id": "uuid-new-task",
  "status": "pending",
  "createdAt": "2025-11-26T10:30:00Z",
  "estimatedCompletion": "2025-11-26T10:32:00Z"
}
```

#### `GET /api/tasks/:taskId`
Busca tarefa específica.

**Response**:
```json
{
  "id": "uuid-123",
  "title": "Análise de crédito",
  "status": "completed",
  "result": {
    "creditType": "ICMS",
    "amount": 45320.00,
    "confidence": 0.95
  },
  "timeline": [
    { "timestamp": "10:00:00", "event": "created" },
    { "timestamp": "10:00:15", "event": "assigned to oracle" },
    { "timestamp": "10:02:30", "event": "completed" }
  ]
}
```

#### `DELETE /api/tasks/:taskId`
Cancela tarefa pendente.

**Response**:
```json
{
  "id": "uuid-123",
  "status": "cancelled",
  "cancelledAt": "2025-11-26T10:35:00Z"
}
```

#### `GET /api/tasks/pending`
Lista apenas tarefas pendentes.

---

### **5. Workflows**

#### `GET /api/workflows`
Lista workflows ativos.

**Response**:
```json
{
  "workflows": [
    {
      "id": "workflow-1",
      "type": "customer_onboarding",
      "status": "running",
      "steps": [
        { "agent": "aria", "status": "completed" },
        { "agent": "themis", "status": "running" },
        { "agent": "oracle", "status": "pending" }
      ]
    }
  ]
}
```

---

### **6. Otimizações**

#### `GET /api/optimizations`
Lista otimizações aplicadas pelo AutoOptimizer.

**Response**:
```json
{
  "optimizations": [
    {
      "timestamp": "2025-11-26T09:00:00Z",
      "type": "model_switch",
      "agent": "oracle",
      "change": "gpt-4 → claude-haiku (70% tasks)",
      "impact": {
        "responseTime": "-68%",
        "cost": "-65%",
        "accuracy": "+2%"
      }
    }
  ]
}
```

---

## 🎯 Resumo Executivo

### **Para Desenvolvedores**:
- Use `/api/tasks` para criar tarefas programaticamente
- Use WebSocket para comunicação real-time
- Use Dashboard para monitorar sistema
- Rode GENESIS localmente para desenvolvimento

### **Para Clientes/Usuários**:
- Chat com ARIA 24/7 via interface web
- Upload de documentos para análise automática
- Acompanhe análises em tempo real
- Receba notificações de resultados

### **Como Agentes Trabalham**:
- Comunicação via AgentBus (WebSocket)
- Coordenados pelo WorkflowEngine
- Monitorados por RealTimeMetrics
- Otimizados continuamente por AutoOptimizer
- Persistência via PostgreSQL (TaskProcessor)

---

**Última Atualização**: 26/11/2025
**Versão GENESIS**: 4.1.0
**Status**: ✅ Produção (Railway)
