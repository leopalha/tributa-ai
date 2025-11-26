# ✅ CHECKLIST: Configuração Railway - Passo a Passo

## 📌 Status Atual
- ✅ Serviço antigo "triumphant-youth" deletado (ou será)
- ✅ Novo serviço "illustrious-courtesy" criado
- ✅ Sistema PAUSADO (`numReplicas: 0`)
- ✅ Código com correções de UUID e NULL commitado

---

## 🔥 PASSO A PASSO - SIGA ESTA ORDEM

### ☐ 1. CRIAR POSTGRESQL

**No Railway Dashboard:**

```
1. Abra o projeto
2. Clique "+ New"
3. Selecione "Database" → "PostgreSQL"
4. Aguarde criação (1-2 min)
```

**Verificar:** ✅ Banco apareceu na lista de services

---

### ☐ 2. EXECUTAR SCHEMA SQL

**Copie o SQL:**
- Arquivo: `.lia/agents/genesis/src/db/init-schema.sql`

**Execute no Railway:**

```
1. Clique no PostgreSQL service
2. Vá em "Data" ou "Query"
3. Cole TODO o conteúdo do init-schema.sql
4. Clique "Execute" ou "Run"
```

**Verificar:** ✅ Mensagem "Schema GENESIS criado com sucesso!"

---

### ☐ 3. CONFIGURAR VARIÁVEIS

**No serviço "illustrious-courtesy" → Variables:**

#### Adicionar manualmente:
```bash
NODE_ENV=production
PORT=3003
OPENROUTER_API_KEY=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
```

#### Adicionar referência do banco:
```
1. Clique "+ New Variable"
2. Selecione "Add Reference"
3. Escolha o PostgreSQL service
4. Marque "DATABASE_URL"
5. Salve
```

**Verificar:** ✅ 4 variáveis configuradas (NODE_ENV, PORT, OPENROUTER_API_KEY, DATABASE_URL)

---

### ☐ 4. CONFIGURAR ROOT DIRECTORY

**No serviço "illustrious-courtesy" → Settings:**

```
1. Procure "Source" ou "Build"
2. Clique "Add Root Directory"
3. Digite: .lia/agents/genesis
4. Salve
```

**Verificar:** ✅ Root Directory = `.lia/agents/genesis`

---

### ☐ 5. VERIFICAR START COMMAND

**No serviço "illustrious-courtesy" → Settings → Deploy:**

```
Start Command: node genesis-enterprise-system.js
```

Se não estiver, adicione.

**Verificar:** ✅ Start Command configurado

---

### ☐ 6. CONFIGURAR HEALTHCHECK (OPCIONAL)

**No Settings → Deploy:**

```
Healthcheck Path: /api/health
Healthcheck Timeout: 30
```

**Verificar:** ✅ Healthcheck configurado

---

### ☐ 7. ATIVAR O SERVIÇO

**No seu computador, edite o arquivo:**

Arquivo: `.lia/cloud/railway.json`

Mude:
```json
"numReplicas": 0   →   "numReplicas": 1
```

**Depois faça commit:**
```bash
cd d:/tributa-ai
git add .lia/cloud/railway.json
git commit -m "🚀 Ativa GENESIS no Railway"
git push
```

**Verificar:** ✅ Commit enviado ao GitHub

---

### ☐ 8. MONITORAR DEPLOY

**No Railway → Deployments:**

```
1. Aguarde o build (2-3 min)
2. Verifique status: "SUCCESS"
3. Vá em "Logs" e procure:
   ✅ "PostgreSQL conectado"
   ✅ "GENESIS Enterprise System inicializado"
   ✅ "HTTP Server rodando na porta 3003"
```

**Verificar:** ✅ Deploy com sucesso + Logs OK

---

### ☐ 9. TESTAR O SISTEMA

**Obtenha a URL do Railway:**
- Exemplo: `https://illustrious-courtesy.up.railway.app`

**Teste o healthcheck:**
```bash
curl https://SEU-DOMINIO.railway.app/api/health
```

**Deve retornar:**
```json
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": "...",
  "components": {...}
}
```

**Verificar:** ✅ API respondendo corretamente

---

### ☐ 10. VERIFICAR CUSTOS

**No Railway → Usage/Billing:**

```
- Verifique consumo atual
- Confirme que está dentro do plano Pro
- Configure alertas de custo (recomendado)
```

**Verificar:** ✅ Custos monitorados

---

## 🎯 CHECKLIST FINAL

Antes de considerar concluído, confirme:

- [ ] PostgreSQL criado e rodando
- [ ] Schema SQL executado (tabelas criadas)
- [ ] 4 variáveis de ambiente configuradas
- [ ] Root Directory = `.lia/agents/genesis`
- [ ] Start Command configurado
- [ ] Deploy com sucesso
- [ ] Logs sem erros críticos
- [ ] API respondendo em `/api/health`
- [ ] Custos monitorados

---

## 🚨 TROUBLESHOOTING RÁPIDO

### Deploy falha no build:
- Verifique Root Directory (deve ser `.lia/agents/genesis`)
- Verifique se `genesis-enterprise-system.js` existe

### "PostgreSQL não conectado":
- Verifique se DATABASE_URL está nas variáveis
- Teste conexão no PostgreSQL Dashboard

### Erros "NULL title" ou "invalid UUID":
- Execute o schema SQL novamente (Passo 2)
- Verifique se está usando o último commit (7e47e7b)

### Deploy fica travado:
- Verifique se `numReplicas: 1` no railway.json
- Force novo deploy: Settings → Redeploy

---

## 📞 ARQUIVOS DE REFERÊNCIA

- **Guia completo:** `.lia/agents/genesis/RAILWAY-SETUP.md`
- **Schema SQL:** `.lia/agents/genesis/src/db/init-schema.sql`
- **Config Railway:** `.lia/cloud/railway.json`
- **Teste local:** `.lia/agents/genesis/start-local.bat`

---

**Última Atualização:** 25/11/2025
**Status:** Sistema pausado, pronto para ativação
