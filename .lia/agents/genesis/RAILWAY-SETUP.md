# 🚂 RAILWAY SETUP GUIDE - GENESIS Enterprise System

## 📋 Configuração Completa do Railway

### 1️⃣ Criar Banco PostgreSQL

1. Acesse o projeto no Railway
2. Clique em **"+ New"**
3. Selecione **"Database"** → **"Add PostgreSQL"**
4. Aguarde a criação (1-2 minutos)

### 2️⃣ Executar Schema SQL

Você precisa criar as tabelas no banco. Existem 2 formas:

#### Opção A: Via Railway Dashboard (RECOMENDADO)

1. Clique no banco PostgreSQL criado
2. Vá em **"Data"** ou **"Query"** (depende da interface)
3. Cole o conteúdo do arquivo `.lia/agents/genesis/src/db/init-schema.sql`
4. Execute o SQL
5. Verifique se apareceu "✅ Schema GENESIS criado com sucesso!"

#### Opção B: Via psql local

```bash
# Obtenha a DATABASE_URL no Railway (Settings > Variables)
# Depois execute:
psql $DATABASE_URL -f .lia/agents/genesis/src/db/init-schema.sql
```

### 3️⃣ Configurar Serviço "illustrious-courtesy"

#### A. Variáveis de Ambiente

No Railway, vá em **Settings** → **Variables** e adicione:

```bash
NODE_ENV=production
PORT=3003
OPENROUTER_API_KEY=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
```

Depois, vincule o banco:
1. Clique em **"+ New Variable"** → **"Add Reference"**
2. Selecione o banco PostgreSQL
3. Marque **`DATABASE_URL`**
4. Salve

#### B. Root Directory

Em **Settings** → **Source/Build**:
- **Root Directory**: `.lia/agents/genesis`

#### C. Start Command

Em **Settings** → **Deploy**:
- **Start Command**: `node genesis-enterprise-system.js`

#### D. Healthcheck (Opcional mas Recomendado)

Em **Settings** → **Deploy**:
- **Healthcheck Path**: `/api/health`
- **Healthcheck Timeout**: `30`

### 4️⃣ Ativar o Serviço

O serviço está **pausado** (`numReplicas: 0` no railway.json).

Para ativar:

```bash
# Edite .lia/cloud/railway.json
# Mude "numReplicas": 0 para "numReplicas": 1

git add .lia/cloud/railway.json
git commit -m "🚀 Ativa GENESIS no Railway"
git push
```

Railway automaticamente detectará e fará o deploy!

### 5️⃣ Verificar Deploy

1. Acesse **Deployments** no Railway
2. Aguarde o build (~2-3 minutos)
3. Verifique os logs:
   - ✅ "PostgreSQL conectado"
   - ✅ "GENESIS Enterprise System inicializado"
   - ✅ "HTTP Server rodando na porta 3003"

4. Teste o healthcheck:
   ```bash
   curl https://SEU-DOMINIO.railway.app/api/health
   ```

## 📊 Endpoints Disponíveis

Uma vez ativo, você terá:

- **GET** `/api/health` - Health check
- **GET** `/api/status` - Status do sistema
- **GET** `/api/agents` - Status dos agentes
- **GET** `/api/tasks` - Lista de tarefas
- **POST** `/api/tasks` - Criar nova tarefa
- **GET** `/api/metrics` - Métricas do sistema
- **GET** `/dashboard` - Dashboard visual (HTML)

## 🔍 Troubleshooting

### Erro: "PostgreSQL não conectado"
- Verifique se a variável `DATABASE_URL` está configurada
- Teste a conexão no banco via Railway Dashboard

### Erro: "null value in column 'title'"
- Execute o schema SQL novamente (Passo 2)
- O código local já tem a correção para isso

### Erro: "invalid input syntax for type uuid"
- Execute o schema SQL para criar a extensão uuid-ossp
- O código local já tem validação UUID

### Deploy fica em "INITIALIZING"
- Verifique se o **Root Directory** está correto: `.lia/agents/genesis`
- Isso evita processar os 3921 arquivos desnecessários

## 💰 Custos Esperados

Com Railway Pro ($50/mês):
- PostgreSQL: ~$5-10/mês
- GENESIS Service: ~$5-15/mês (depende do uso)
- Total estimado: **$10-25/mês**

Para economizar:
- Deixe `numReplicas: 0` quando não estiver usando
- Use o plano Free do Render.com como alternativa

## 🎯 Próximos Passos

Depois que o sistema estiver rodando:

1. Teste criar uma tarefa via API
2. Verifique logs no Railway
3. Acesse o dashboard em `/dashboard`
4. Configure alertas de erro no Railway
5. Configure domínio customizado (opcional)

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Railway
2. Teste localmente com `.lia/agents/genesis/start-local.bat`
3. Compare configurações com este guia

---

**Última Atualização:** 25/11/2025
**Versão:** GENESIS v4.1
