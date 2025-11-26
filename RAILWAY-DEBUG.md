# 🔍 RAILWAY DEBUGGING

## ❌ PROBLEMA:
`https://tributa-ai-production.railway.app` retorna "Not Found"

## 🎯 POSSÍVEIS CAUSAS:

### 1. **Build Falhando**
Railway pode estar tentando buildar e falhando.

**Como verificar:**
- Acesse Railway Dashboard
- Vá em "Deployments"
- Veja último deploy
- Clique em "View Logs"

**Procure por:**
```
❌ Build failed
❌ Error: Cannot find module
❌ npm ERR!
```

---

### 2. **Serviço Pausado (numReplicas=0)**
Já corrigimos isso (`numReplicas: 1`), mas Railway pode não ter feito redeploy.

**Solução:**
- Settings → "Redeploy"
- Ou force novo deploy via push Git

---

### 3. **Porta Errada**
GENESIS usa porta 3000 localmente, mas Railway pode esperar outra porta.

**Solução:**
Railway define `PORT` automaticamente. GENESIS já usa `process.env.PORT || 3000`, então deve funcionar.

---

### 4. **Root Directory Incorreto**
Railway pode estar tentando rodar de diretório errado.

**Verificar:**
- Settings → Source → Root Directory
- Deve estar: `.lia/agents/genesis`

---

### 5. **Start Command Errado**
**Verificar:**
- Settings → Deploy → Start Command
- Deve estar: `node genesis-enterprise-system.js`

---

### 6. **DATABASE_URL Faltando**
GENESIS precisa de `DATABASE_URL` conectado.

**Verificar:**
- Variables → `DATABASE_URL`
- Deve ser referência ao PostgreSQL service

---

### 7. **OPENROUTER_API_KEY Faltando**
GENESIS precisa dessa chave para funcionar.

**Verificar:**
- Variables → `OPENROUTER_API_KEY`
- Deve ter: `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`

---

## 🔧 CHECKLIST COMPLETO:

Vá no Railway Dashboard e verifique:

- [ ] Service: "tributa-ai" ou "illustrious-courtesy" está ativo?
- [ ] Deployments → Último deploy com status "SUCCESS"?
- [ ] Settings → Source → Root Directory = `.lia/agents/genesis`
- [ ] Settings → Deploy → Start Command = `node genesis-enterprise-system.js`
- [ ] Variables → `DATABASE_URL` (reference para Postgres)
- [ ] Variables → `OPENROUTER_API_KEY` configurada
- [ ] Variables → `NODE_ENV=production`
- [ ] Variables → `PORT` (Railway define automaticamente)
- [ ] Deployments → Logs → Sem erros

---

## 📝 LOGS ESPERADOS (Sucesso):

```
🚀 Inicializando Genesis Enterprise System v4.1...
✅ PostgreSQL conectado
✅ 11 agentes registrados
✅ ARIA Handler inteligente registrado
✅ THEMIS Handler inteligente registrado
🎉 Genesis Enterprise System iniciado com sucesso!
📊 Dashboard disponível em: http://0.0.0.0:PORT
```

**NÃO DEVE TER:**
```
❌ OPENROUTER_API_KEY missing
❌ Cannot connect to database
❌ Error: Cannot find module
❌ EADDRINUSE (porta já em uso)
```

---

## 🚀 PRÓXIMO DEPLOY:

Se nada acima resolver, tente:

```bash
# 1. Force novo deploy
git commit --allow-empty -m "chore: Force Railway redeploy"
git push

# 2. Aguarde 3-5 minutos
# 3. Teste novamente:
curl https://tributa-ai-production.railway.app/api/health
```

---

## 📞 SE CONTINUAR FALHANDO:

Me avise e vou:
1. Criar um Dockerfile específico para Railway
2. Ou criar um serviço separado só para GENESIS
3. Ou investigar logs completos do Railway

---

**Status Atual**: ⏳ Aguardando verificação Railway
**Última Tentativa**: numReplicas 0 → 1
**Próximo Passo**: Verificar logs no Railway Dashboard
