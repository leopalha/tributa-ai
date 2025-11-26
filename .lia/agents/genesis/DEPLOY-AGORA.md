# ✅ DEPLOY RAILWAY - PASSO A PASSO AGORA

## 🎯 OBJETIVO
Deploy dos 5 agentes de produção no Railway para atender clientes 24/7

---

## ☑️ PASSO 1: Criar Serviço (AGORA)

No Railway Dashboard:

1. [ ] Clique **"+ New"**
2. [ ] Selecione **"GitHub Repo"**
3. [ ] Escolha **"leopalha/tributa-ai"**
4. [ ] Aguarde criar

**⏸️ PARE AQUI! Antes do primeiro deploy, configure tudo abaixo!**

---

## ☑️ PASSO 2: Configurar Root Directory (CRÍTICO!)

**Clique no serviço que acabou de criar**

1. [ ] Vá em **"Settings"** (menu lateral)
2. [ ] Procure seção **"Source"**
3. [ ] Clique em **"Add Root Directory"**
4. [ ] Digite: `.lia/agents/genesis`
5. [ ] Clique **"Save"** ou Enter

**✅ Root Directory configurado!**

---

## ☑️ PASSO 3: Configurar Start Command

Ainda em **Settings**:

1. [ ] Procure seção **"Deploy"**
2. [ ] Procure **"Start Command"**
3. [ ] Digite: `node genesis-enterprise-system.js`
4. [ ] Clique **"Save"**

**✅ Start Command configurado!**

---

## ☑️ PASSO 4: Adicionar Variáveis (Uma por uma)

Vá em **"Variables"** (menu lateral):

### Variables Simples (copie e cole):

1. [ ] Clique **"+ New Variable"**
   - Name: `NODE_ENV`
   - Value: `production`

2. [ ] Clique **"+ New Variable"**
   - Name: `PORT`
   - Value: `3003`

3. [ ] Clique **"+ New Variable"**
   - Name: `OPENROUTER_API_KEY`
   - Value: `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`

### Agentes de Produção (ativar):

4. [ ] `ENABLE_ARIA` = `true`
5. [ ] `ENABLE_ORACLE` = `true`
6. [ ] `ENABLE_THEMIS` = `true`
7. [ ] `ENABLE_AETHER` = `true`
8. [ ] `ENABLE_NEXUS` = `true`

### Agentes de Dev (desativar):

9. [ ] `ENABLE_EXECUTOR` = `false`
10. [ ] `ENABLE_HELIOS` = `false`
11. [ ] `ENABLE_ATLAS` = `false`
12. [ ] `ENABLE_THANOS` = `false`
13. [ ] `ENABLE_GENESIS_AGENT` = `false`
14. [ ] `ENABLE_LIA` = `false`

### Features:

15. [ ] `ENABLE_DASHBOARD` = `true`
16. [ ] `ENABLE_METRICS` = `true`
17. [ ] `ENABLE_OPTIMIZATION` = `true`

**✅ Variáveis configuradas!**

---

## ☑️ PASSO 5: Conectar ao PostgreSQL

Ainda em **Variables**:

1. [ ] Clique **"+ New Variable"**
2. [ ] Selecione **"Add Reference"**
3. [ ] Escolha o **PostgreSQL** (service que você manteve)
4. [ ] Marque **`DATABASE_URL`**
5. [ ] Clique **"Add"**

**✅ Banco conectado!**

---

## ☑️ PASSO 6: Fazer Deploy

Agora sim, deixe deployar:

1. [ ] O Railway vai detectar mudanças automaticamente
2. [ ] Ou vá em **"Deployments"** → **"Deploy"**
3. [ ] Aguarde build (~2-3 minutos)

---

## ☑️ PASSO 7: Monitorar Logs

Durante o deploy:

1. [ ] Vá em **"Deployments"**
2. [ ] Clique no deployment ativo
3. [ ] Clique em **"Logs"**

**Procure por:**

```
✅ PostgreSQL conectado
✅ GENESIS Enterprise System inicializado
✅ Agente ARIA ativado
✅ Agente ORACLE ativado
✅ Agente THEMIS ativado
✅ Agente AETHER ativado
✅ Agente NEXUS ativado
✅ HTTP Server rodando na porta 3003
```

**NÃO deve aparecer:**

```
❌ null value in column 'title'
❌ invalid input syntax for type uuid
❌ Agente EXECUTOR ativado (deve estar desativado!)
```

---

## ☑️ PASSO 8: Testar API

Quando deploy finalizar com sucesso:

1. [ ] Copie a URL do serviço (ex: `https://genesis-production.railway.app`)
2. [ ] Teste healthcheck:
   ```bash
   curl https://SUA-URL.railway.app/api/health
   ```
3. [ ] Deve retornar JSON:
   ```json
   {
     "status": "healthy",
     "timestamp": "...",
     "uptime": "...",
     "components": {
       "postgres": "connected",
       "aria": "active",
       "oracle": "active",
       "themis": "active",
       "aether": "active",
       "nexus": "active"
     }
   }
   ```

---

## ☑️ PASSO 9: Verificar Custos

No Railway:

1. [ ] Vá em **"Usage"** ou **"Billing"**
2. [ ] Verifique consumo atual
3. [ ] Configure alertas (recomendado):
   - Settings → Alerts
   - Email quando atingir $30/mês

---

## ✅ CHECKLIST FINAL

Antes de considerar concluído:

- [ ] Root Directory = `.lia/agents/genesis`
- [ ] Start Command configurado
- [ ] 19 variáveis de ambiente configuradas
- [ ] DATABASE_URL conectada ao Postgres
- [ ] Deploy com status SUCCESS
- [ ] Logs sem erros críticos
- [ ] 5 agentes de produção ativos
- [ ] 6 agentes de dev desativados
- [ ] API respondendo em `/api/health`
- [ ] Custos monitorados

---

## 🚨 SE DER ERRO

### Build falha:
- Verifique Root Directory
- Verifique que `genesis-enterprise-system.js` existe em `.lia/agents/genesis/`

### "PostgreSQL não conectado":
- Verifique se DATABASE_URL está nas variáveis
- Verifique se referência está correta

### Custos muito altos:
- Verifique se agentes de dev estão desativados (false)
- Só 5 agentes devem estar ativos

### Logs mostram erros de UUID/NULL:
- Isso significa que está usando código antigo
- Force redeploy: Settings → Redeploy

---

## 📞 PRÓXIMOS PASSOS

Depois que funcionar:

1. Anotar URL do Railway
2. Configurar CORS para frontend
3. Deploy do frontend no Vercel
4. Testar integração completa
5. Configurar domínio customizado

---

**Última Atualização:** 25/11/2025
**Status:** Pronto para deploy
