# 🚀 COMO USAR O SISTEMA REAL LIA + 9 AGENTES

## ✅ O QUE JÁ ESTÁ PRONTO:

1. **genesis-enterprise-system.js** - Sistema completo funcionando
2. **Dashboard** em `dashboard/advanced-dashboard.html`
3. **9 Agentes** configurados e prontos
4. **WorkflowEngine** para coordenação
5. **AgentBus** para comunicação real-time

## 🎯 HIERARQUIA CORRETA:

```
VOCÊ (Usuário)
     ↓
🧠 LIA (Coordenadora - NUNCA executa)
     ↓
[Delega para os agentes apropriados]
     ↓
┌────────────┬────────────┬──────────┐
GENESIS    NEXUS      EXECUTOR    (+ 6 outros)
(Executa)  (Executa)  (Executa)
```

## 📋 PASSO A PASSO PARA ATIVAR:

### 1️⃣ **CONFIGURE SUA API KEY OPENROUTER:**

```bash
# Windows:
set OPENROUTER_API_KEY=sk-or-v1-sua-chave-aqui

# Linux/Mac:
export OPENROUTER_API_KEY=sk-or-v1-sua-chave-aqui
```

**Onde conseguir:** https://openrouter.ai/keys

### 2️⃣ **INICIE O SISTEMA:**

**Opção A - Usar o .bat (Windows):**
```bash
cd .lia/agents/genesis
START-REAL-SYSTEM.bat
```

**Opção B - Direto com Node:**
```bash
cd .lia/agents/genesis
node genesis-enterprise-system.js
```

### 3️⃣ **ACESSE O DASHBOARD:**

Abra no navegador:
```
http://localhost:3003
```

## 🎮 COMO USAR:

### **PELO DASHBOARD (Visual):**

1. Acesse http://localhost:3003
2. Digite seu comando na caixa de texto
3. LIA analisa e delega automaticamente
4. Veja os agentes trabalhando em tempo real
5. Resultados aparecem na tela

### **POR API (Programático):**

```javascript
// POST para http://localhost:3003/api/request
{
  "text": "Corrija o bug no MarketplacePage",
  "priority": "high"
}

// LIA responde com:
{
  "coordinator": "LIA",
  "delegated_to": ["EXECUTOR", "HELIOS"],
  "results": [
    { "agent": "EXECUTOR", "success": true, "changes": [...] },
    { "agent": "HELIOS", "success": true, "validation": "passed" }
  ]
}
```

### **POR WEBSOCKET (Real-time):**

```javascript
const ws = new WebSocket('ws://localhost:3003');

ws.send(JSON.stringify({
  text: "Otimize o sistema"
}));

ws.onmessage = (event) => {
  const result = JSON.parse(event.data);
  console.log('LIA delegou para:', result.delegated_to);
};
```

## 🤖 O QUE CADA AGENTE FAZ (REAL):

| Agente | Função Real | O que modifica |
|--------|------------|----------------|
| **GENESIS** | Gera código novo | Cria/modifica arquivos .tsx/.ts |
| **EXECUTOR** | Corrige bugs | Edita código frontend |
| **HELIOS** | Valida segurança | Roda npm build/test real |
| **ATLAS** | Refina UI | Modifica CSS/componentes |
| **THANOS** | Limpa código | Remove arquivos/código morto |
| **NEXUS** | Coordena técnico | Cria arquiteturas/planos |
| **ORACLE** | Testa qualidade | Executa testes reais |
| **THEMIS** | Compliance | Verifica LGPD/regulações |
| **ARIA** | NLP/Interação | Processa linguagem natural |

## ⚠️ IMPORTANTE:

1. **COM API Key:** Sistema usa OpenRouter (pago, mais poderoso)
2. **SEM API Key:** Sistema usa execução local (grátis, limitado)
3. **Modificações são REAIS:** Os agentes modificam arquivos de verdade!
4. **LIA coordena tudo:** Você não fala direto com agentes

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO:

```bash
# Ver status:
curl http://localhost:3003/api/status

# Deve retornar:
{
  "coordinator": "LIA",
  "agents": [
    { "name": "GENESIS", "status": "ready" },
    { "name": "EXECUTOR", "status": "ready" },
    ...
  ]
}
```

## 💡 EXEMPLOS DE COMANDOS:

```
"Corrija o erro de compilação no MarketplacePage"
→ LIA delega para EXECUTOR + HELIOS

"Crie um novo componente de dashboard"
→ LIA delega para NEXUS → GENESIS → EXECUTOR

"Otimize a performance do sistema"
→ LIA delega para THANOS + ORACLE

"Melhore o design da página de login"
→ LIA delega para ATLAS → EXECUTOR
```

## 🚨 TROUBLESHOOTING:

**Porta 3003 já em uso:**
```bash
# Windows:
netstat -ano | findstr :3003
taskkill /PID [numero] /F

# Linux:
lsof -i :3003
kill -9 [PID]
```

**Sem OpenRouter Key:**
- Sistema funciona mas com capacidades limitadas
- Use o sistema interno (LIA no VS Code) para desenvolvimento

**Agentes não respondendo:**
- Verifique logs em `.lia/agents/genesis/logs/`
- Reinicie o sistema

---

## 🎯 RESUMO:

1. **Configure API Key** (opcional mas recomendado)
2. **Execute:** `node genesis-enterprise-system.js`
3. **Acesse:** http://localhost:3003
4. **Use:** Digite comandos, LIA coordena, agentes executam REAL!

**HIERARQUIA:** VOCÊ → LIA → 9 AGENTES → CÓDIGO REAL ✅