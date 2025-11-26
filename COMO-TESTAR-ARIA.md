# 🧪 COMO TESTAR CHAT COM ARIA

## 🎯 O QUE FOI IMPLEMENTADO:

✅ **Chat funcional** em `http://localhost:5000/dashboard/aria`
✅ **Integração completa** com GENESIS Enterprise System
✅ **ARIA agente** responde via Claude 3 Sonnet
✅ **Modo Mock** (desenvolvimento sem custo) e **Modo API** (produção)

---

## 📋 PASSO A PASSO PARA TESTAR LOCALMENTE:

### **PASSO 1: Iniciar GENESIS (Backend)**

```bash
# Terminal 1 - Iniciar GENESIS Enterprise System
cd d:/tributa-ai/.lia/agents/genesis
node genesis-enterprise-system.js
```

**Aguarde ver:**
```
🚀 Inicializando Genesis Enterprise System v4.1...
✅ Genesis Enterprise System inicializado com sucesso
✅ ARIA Conversational Expert ativado
✅ HTTP Server rodando na porta 3003
📊 Dashboard disponível em: http://0.0.0.0:3003
```

---

### **PASSO 2: Verificar GENESIS está Online**

```bash
# Terminal 2 - Testar API
curl http://localhost:3003/api/health
```

**Resposta esperada:**
```json
{
  "status": "healthy",
  "uptime": 5000,
  "timestamp": "2025-11-26T..."
}
```

**Se retornar erro:**
- Verifique se porta 3003 está livre
- Verifique se `OPENROUTER_API_KEY` está configurada em `.env.development`

---

### **PASSO 3: Iniciar Frontend**

```bash
# Terminal 3 - Iniciar React
cd d:/tributa-ai
npm run dev
```

**Aguarde ver:**
```
VITE ready in 2500 ms
➜ Local: http://localhost:5000/
```

---

### **PASSO 4: Acessar Chat ARIA**

1. Abra navegador: **http://localhost:5000**
2. Faça login (se necessário)
3. Acesse: **http://localhost:5000/dashboard/aria**

**Você deve ver:**
- ✅ Interface de chat com ARIA
- ✅ Mensagem de boas-vindas da ARIA
- ✅ Campo de input para digitar mensagens
- ✅ Sidebar com capacidades da ARIA

---

### **PASSO 5: Testar Conversa**

Digite no chat:

```
1️⃣ Primeira mensagem: "Olá ARIA, você está online?"
```

**Comportamentos esperados:**

#### **MODO MOCK** (VITE_USE_MOCK_DATA=true):
- ARIA responde instantaneamente (1.5s)
- Mensagem: "Entendi sua pergunta sobre 'Olá ARIA...'. Esta é uma resposta simulada."
- ✅ Sem custo (modo desenvolvimento)

#### **MODO API** (VITE_USE_MOCK_DATA=false):
- ARIA demora ~10-30s (processa via Claude 3 Sonnet)
- Mensagem: Resposta real da IA
- 💰 Custo: ~$0.01 por mensagem

---

### **PASSO 6: Testar Pergunta Tributária**

```
2️⃣ Segunda mensagem: "Tenho direito a crédito PIS/COFINS sobre energia elétrica?"
```

**Modo API (real):**
- ARIA processa via GENESIS
- GENESIS chama OpenRouter API
- Claude 3 Sonnet analisa pergunta
- ARIA responde com análise tributária

---

## 🔍 TROUBLESHOOTING:

### **Problema 1: ARIA não responde (fica Loading...)**

**Causa**: GENESIS não está rodando ou API falhou

**Solução**:
```bash
# Verificar se GENESIS está rodando
curl http://localhost:3003/api/health

# Se retornar erro, reiniciar GENESIS
cd .lia/agents/genesis
node genesis-enterprise-system.js
```

---

### **Problema 2: Mensagem de erro "⚠️ Desculpe, não consegui me conectar com o sistema GENESIS"**

**Causa**: Variável `VITE_GENESIS_URL` não está configurada

**Solução**:
```bash
# Verificar .env.development
cat .env.development | grep VITE_GENESIS_URL

# Deve retornar:
VITE_GENESIS_URL=http://localhost:3003

# Se não existir, adicionar:
echo "VITE_GENESIS_URL=http://localhost:3003" >> .env.development

# Reiniciar frontend (Terminal 3):
# Ctrl+C para parar
npm run dev
```

---

### **Problema 3: GENESIS retorna 404 "Task not found"**

**Causa**: Agente ARIA não está ativado

**Solução**:
```bash
# Verificar se ARIA está ativa
curl http://localhost:3003/api/agents | grep aria

# Deve mostrar:
"aria": {
  "name": "ARIA Conversational Expert",
  "status": "active"
}

# Se não aparecer, verificar .env.development:
echo "ENABLE_ARIA=true" >> .lia/agents/genesis/.env
```

---

### **Problema 4: GENESIS não inicia - "OPENROUTER_API_KEY missing"**

**Causa**: Chave da API do OpenRouter não configurada

**Solução**:
```bash
# Adicionar em .env.development (raiz do projeto)
echo "OPENROUTER_API_KEY=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" >> .env.development

# Reiniciar GENESIS
cd .lia/agents/genesis
node genesis-enterprise-system.js
```

---

## 📊 MONITORAMENTO EM TEMPO REAL:

### **Ver logs do GENESIS**:
```bash
# Terminal onde GENESIS está rodando
# Você verá:
✅ Agente ARIA recebeu mensagem: "Olá ARIA..."
🔄 Processando com Claude 3 Sonnet...
✅ Resposta gerada (1250 tokens, $0.012)
✅ Tarefa completada
```

### **Ver métricas**:
```bash
curl http://localhost:3003/api/metrics
```

**Retorna:**
```json
{
  "agents": {
    "aria": {
      "tasksProcessed": 5,
      "averageResponseTime": 12500,
      "successRate": 100,
      "currentCost": 0.06
    }
  }
}
```

---

## 🎯 TESTES RECOMENDADOS:

### **Teste 1: Pergunta Simples**
```
"Olá, como você pode me ajudar?"
```
**Esperado**: ARIA explica suas capacidades

---

### **Teste 2: Pergunta Tributária**
```
"Posso recuperar crédito ICMS sobre energia elétrica?"
```
**Esperado**: ARIA explica elegibilidade para crédito ICMS

---

### **Teste 3: Upload de Documento** (futuro)
```
"Analise este documento fiscal: [arquivo]"
```
**Esperado**: ARIA coordena com ORACLE para análise

---

### **Teste 4: Consulta Legal** (futuro)
```
"Esta operação está em compliance com LGPD?"
```
**Esperado**: ARIA consulta THEMIS e responde sobre compliance

---

## 🌐 TESTAR EM PRODUÇÃO (Railway):

### **Problema Atual**: Railway retorna "Not Found"

**Investigação necessária**:
1. Verificar se deploy foi feito corretamente
2. Verificar logs do Railway
3. Verificar se serviço está rodando

**Quando funcionar:**
```
Frontend: https://tributa-ai.vercel.app/dashboard/aria
Backend: https://tributa-ai-production.railway.app/api/health
```

---

## 📝 CHECKLIST DE TESTE:

- [ ] GENESIS iniciado localmente (porta 3003)
- [ ] `curl http://localhost:3003/api/health` retorna `healthy`
- [ ] Frontend rodando (porta 5000)
- [ ] Acessar http://localhost:5000/dashboard/aria
- [ ] Ver interface do chat com ARIA
- [ ] Enviar mensagem "Olá ARIA"
- [ ] Receber resposta (mock ou real)
- [ ] Verificar logs no terminal GENESIS
- [ ] Testar pergunta tributária
- [ ] Verificar custos em `/api/metrics`

---

## 🚀 PRÓXIMOS PASSOS:

1. ✅ **Testar localmente** - Chat funcionando em dev
2. ⏳ **Investigar Railway** - Por que retorna "Not Found"?
3. ⏳ **Deploy frontend** - Conectar Vercel com Railway
4. ⏳ **Criar páginas** para outros agentes:
   - `/dashboard/oracle` - Validação de créditos
   - `/dashboard/themis` - Compliance
   - `/dashboard/nexus` - Coordenação

---

**Status Atual**: ✅ CHAT ARIA FUNCIONAL LOCALMENTE!

**Última Atualização**: 26/11/2025
