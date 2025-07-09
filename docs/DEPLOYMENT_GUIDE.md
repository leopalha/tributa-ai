# 🚀 DEPLOYMENT GUIDE - TRIBUTA.AI

## 📋 **INFORMAÇÕES DE DEPLOY**
**Versão:** 1.0  
**Stack:** Vite + React + Node.js + PostgreSQL  
**Infraestrutura:** AWS EKS + Docker + CI/CD  
**Status:** Produção-ready (75% funcional)

---

## 📖 **ÍNDICE**
1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Local](#configuração-local)
3. [Docker & Containers](#docker-containers)
4. [Deploy AWS](#deploy-aws)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoramento](#monitoramento)
7. [Backup & Recovery](#backup-recovery)
8. [Troubleshooting](#troubleshooting)
9. [Segurança](#segurança)
10. [Manutenção](#manutenção)

---

## 📋 **PRÉ-REQUISITOS** {#pré-requisitos}

### **Ferramentas Necessárias:**
```bash
# Node.js e package manager
node >= 20.x
npm >= 10.x (ou yarn >= 1.22.x)

# Docker
docker >= 24.x
docker-compose >= 2.x

# AWS CLI
aws-cli >= 2.x
kubectl >= 1.28.x

# Git
git >= 2.40.x
```

### **Contas e Acessos:**
- ✅ **AWS Account** com billing configurado
- ✅ **IAM User** com permissões EKS/EC2/RDS
- ✅ **Domain** registrado (tributa.ai)
- ✅ **SSL Certificate** (AWS Certificate Manager)
- ✅ **Container Registry** (AWS ECR)

---

## 💻 **CONFIGURAÇÃO LOCAL** {#configuração-local}

### **1. Clone e Setup Inicial**
```bash
# Clone do repositório
git clone https://github.com/tributa-ai/tributa-ai-web-new.git
cd tributa-ai-web-new

# Instalar dependências
npm install
# ou
yarn install

# Configurar variáveis de ambiente
cp .env.example .env.local
```

### **2. Variáveis de Ambiente (.env.local)**
```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tributaai_dev"

# API URLs
VITE_API_URL="http://localhost:3000/api"
VITE_WS_URL="ws://localhost:3000"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-change-in-production"

# Blockchain (Simulated)
BLOCKCHAIN_NETWORK="tributa-testnet"
BLOCKCHAIN_RPC_URL="http://localhost:7051"

# AWS (Development)
AWS_REGION="us-east-1"
AWS_S3_BUCKET="tributa-ai-dev-storage"

# External APIs (Mock em dev)
RECEITA_FEDERAL_API_URL="https://api.receitafederal.gov.br"
SEFAZ_API_URL="https://nfe.fazenda.gov.br"
BACEN_API_URL="https://api.bcb.gov.br"

# Monitoring
SENTRY_DSN="https://your-sentry-dsn"
LOG_LEVEL="info"
```

### **3. Banco de Dados Local**
```bash
# Iniciar PostgreSQL via Docker
docker-compose up -d db

# Rodar migrações
npx prisma migrate dev
npx prisma db push

# Seed inicial
npx prisma db seed
```

### **4. Desenvolvimento**
```bash
# Iniciar aplicação
npm run dev
# ou
yarn dev

# Acessar
http://localhost:3000     # Frontend
http://localhost:8080     # Adminer (DB)
```

---

## 🐳 **DOCKER & CONTAINERS** {#docker-containers}

### **1. Docker Compose - Desenvolvimento**
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/tributaai_dev
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: tributaai_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  adminer:
    image: adminer
    ports:
      - "8080:8080"

volumes:
  postgres_data:
  redis_data:
```

### **2. Dockerfile de Produção**
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependências
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Runtime
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]
```

### **3. Comandos Docker**
```bash
# Build da imagem
docker build -t tributa-ai:latest .

# Run local
docker run -p 3000:3000 tributa-ai:latest

# Compose up/down
docker-compose up -d
docker-compose down

# Logs
docker-compose logs -f app
```

---

## ☁️ **DEPLOY AWS** {#deploy-aws}

### **1. Arquitetura AWS**
```
Internet Gateway
    ↓
Application Load Balancer (ALB)
    ↓
EKS Cluster (3 AZs)
├── Frontend Pods (Vite/React)
├── Backend Pods (Node.js API)
└── Workers (Background jobs)
    ↓
RDS PostgreSQL (Multi-AZ)
ElastiCache Redis (Cluster)
S3 (Storage + CDN)
```

### **2. Configuração EKS**
```bash
# Criar cluster EKS
eksctl create cluster \
  --name tributa-ai-prod \
  --region us-east-1 \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 10 \
  --node-type m5.large \
  --managed

# Configurar kubectl
aws eks update-kubeconfig --region us-east-1 --name tributa-ai-prod
```

### **3. Kubernetes Manifests**

#### **Namespace**
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: tributa-ai
```

#### **ConfigMap**
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: tributa-ai-config
  namespace: tributa-ai
data:
  NODE_ENV: "production"
  API_URL: "https://api.tributa.ai"
  BLOCKCHAIN_NETWORK: "tributa-mainnet"
```

#### **Secret**
```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: tributa-ai-secrets
  namespace: tributa-ai
type: Opaque
data:
  DATABASE_URL: <base64-encoded-url>
  NEXTAUTH_SECRET: <base64-encoded-secret>
  JWT_SECRET: <base64-encoded-jwt>
```

#### **Deployment**
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tributa-ai-app
  namespace: tributa-ai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tributa-ai
  template:
    metadata:
      labels:
        app: tributa-ai
    spec:
      containers:
      - name: app
        image: 123456789.dkr.ecr.us-east-1.amazonaws.com/tributa-ai:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: tributa-ai-config
              key: NODE_ENV
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: tributa-ai-secrets
              key: DATABASE_URL
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### **Service & Ingress**
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: tributa-ai-service
  namespace: tributa-ai
spec:
  selector:
    app: tributa-ai
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tributa-ai-ingress
  namespace: tributa-ai
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/ssl-redirect: '443'
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:123456789:certificate/your-cert-id
spec:
  rules:
  - host: tributa.ai
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: tributa-ai-service
            port:
              number: 80
```

### **4. Deploy para AWS**
```bash
# 1. Build e push da imagem
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker build -t tributa-ai .
docker tag tributa-ai:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/tributa-ai:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/tributa-ai:latest

# 2. Deploy no Kubernetes
kubectl apply -f k8s/

# 3. Verificar deploy
kubectl get pods -n tributa-ai
kubectl get services -n tributa-ai
kubectl get ingress -n tributa-ai
```

---

## 🔄 **CI/CD PIPELINE** {#cicd-pipeline}

### **1. GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: tributa-ai

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Build application
      run: npm run build

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}

    - name: Login to ECR
      uses: aws-actions/amazon-ecr-login@v2

    - name: Build and push Docker image
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$GITHUB_SHA .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$GITHUB_SHA
        docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$GITHUB_SHA $ECR_REGISTRY/$ECR_REPOSITORY:latest
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

    - name: Deploy to EKS
      run: |
        aws eks update-kubeconfig --region $AWS_REGION --name tributa-ai-prod
        kubectl set image deployment/tributa-ai-app app=$ECR_REGISTRY/$ECR_REPOSITORY:$GITHUB_SHA -n tributa-ai
        kubectl rollout status deployment/tributa-ai-app -n tributa-ai
```

### **2. Scripts de Deploy**
```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Iniciando deploy do Tributa.AI..."

# Variáveis
ENVIRONMENT=${1:-production}
IMAGE_TAG=${2:-latest}
ECR_REGISTRY="123456789.dkr.ecr.us-east-1.amazonaws.com"
ECR_REPOSITORY="tributa-ai"

echo "📋 Environment: $ENVIRONMENT"
echo "🏷️ Image Tag: $IMAGE_TAG"

# Build e push
echo "🔨 Building Docker image..."
docker build -t $ECR_REPOSITORY:$IMAGE_TAG .

echo "📤 Pushing to ECR..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker tag $ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

# Deploy
echo "🚀 Deploying to Kubernetes..."
kubectl set image deployment/tributa-ai-app app=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -n tributa-ai

# Verificar deploy
echo "✅ Waiting for rollout..."
kubectl rollout status deployment/tributa-ai-app -n tributa-ai

echo "🎉 Deploy completed successfully!"
```

---

## 📊 **MONITORAMENTO** {#monitoramento}

### **1. Health Checks**
```typescript
// src/api/health.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    externalApis: await checkExternalApis(),
    blockchain: await checkBlockchain()
  };

  const isHealthy = Object.values(checks).every(check => check.status === 'ok');

  return Response.json({
    status: isHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    checks
  }, {
    status: isHealthy ? 200 : 503
  });
}
```

### **2. Métricas Prometheus**
```yaml
# k8s/monitoring.yaml
apiVersion: v1
kind: Service
metadata:
  name: tributa-ai-metrics
  namespace: tributa-ai
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "3000"
    prometheus.io/path: "/metrics"
spec:
  selector:
    app: tributa-ai
  ports:
  - port: 3000
    name: metrics
```

### **3. Alertas**
```yaml
# alerting/rules.yml
groups:
- name: tributa-ai
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"

  - alert: DatabaseDown
    expr: up{job="postgres"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Database is down"
```

---

## 💾 **BACKUP & RECOVERY** {#backup-recovery}

### **1. Backup Automatizado**
```bash
#!/bin/bash
# scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
S3_BUCKET="tributa-ai-backups"

# Database backup
kubectl exec -n tributa-ai $(kubectl get pods -n tributa-ai | grep postgres | awk '{print $1}') -- \
  pg_dump -U postgres tributaai_prod > backup_${DATE}.sql

# Upload para S3
aws s3 cp backup_${DATE}.sql s3://${S3_BUCKET}/database/

# Cleanup local
rm backup_${DATE}.sql

echo "✅ Backup completed: backup_${DATE}.sql"
```

### **2. Disaster Recovery**
```bash
#!/bin/bash
# scripts/restore.sh

BACKUP_FILE=${1}
S3_BUCKET="tributa-ai-backups"

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ Usage: ./restore.sh backup_20250107_120000.sql"
  exit 1
fi

# Download backup
aws s3 cp s3://${S3_BUCKET}/database/${BACKUP_FILE} .

# Restore database
kubectl exec -i -n tributa-ai $(kubectl get pods -n tributa-ai | grep postgres | awk '{print $1}') -- \
  psql -U postgres -d tributaai_prod < ${BACKUP_FILE}

echo "✅ Database restored from ${BACKUP_FILE}"
```

---

## 🔧 **TROUBLESHOOTING** {#troubleshooting}

### **Problemas Comuns**

#### **⚡ Cache Vite Travado (v=42af86c8)**
**Sintomas:**
- Servidor inicia mas página não carrega
- Erros `504 Outdated Optimize Dep`
- Hash `v=42af86c8` não muda mesmo forçando
- `ERR_EMPTY_RESPONSE` ou `ERR_SOCKET_NOT_CONNECTED`

**Solução Definitiva:**
```bash
# 1. Parar todos processos
pkill -f vite && sleep 2

# 2. Remover cache completamente
rm -rf node_modules/.vite
rm -rf .vite

# 3. Limpar dependências corrompidas
rm -rf node_modules/@rollup

# 4. Reinstalar dependências críticas
npm install @rollup/rollup-linux-x64-gnu --save-dev

# 5. Configurar vite.config.ts com força
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react'
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: { overlay: false }
  },
  optimizeDeps: {
    force: true
  }
})
EOF

# 6. Iniciar com força máxima
npm run dev
```

**Teste Alternativo WSL (se localhost não funcionar):**
```bash
# Criar build estático
npm run build

# Copiar para Windows
cp -r dist/* /mnt/c/temp/

# Abrir diretamente: C:\temp\index.html
```

#### **🚫 Pod não inicia**
```bash
# Verificar logs
kubectl logs -f deployment/tributa-ai-app -n tributa-ai

# Verificar eventos
kubectl describe pod <pod-name> -n tributa-ai

# Verificar recursos
kubectl top pods -n tributa-ai
```

#### **🔌 Erro de conexão com banco**
```bash
# Testar conectividade
kubectl exec -it deployment/tributa-ai-app -n tributa-ai -- ping postgres-service

# Verificar secrets
kubectl get secret tributa-ai-secrets -n tributa-ai -o yaml
```

#### **📊 Performance issues**
```bash
# Métricas de recursos
kubectl top pods -n tributa-ai
kubectl top nodes

# Horizontal Pod Autoscaler
kubectl get hpa -n tributa-ai
```

### **Rollback**
```bash
# Ver histórico de deploys
kubectl rollout history deployment/tributa-ai-app -n tributa-ai

# Rollback para versão anterior
kubectl rollout undo deployment/tributa-ai-app -n tributa-ai

# Rollback para versão específica
kubectl rollout undo deployment/tributa-ai-app --to-revision=2 -n tributa-ai
```

---

## 🔒 **SEGURANÇA** {#segurança}

### **1. Network Policies**
```yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: tributa-ai-network-policy
  namespace: tributa-ai
spec:
  podSelector:
    matchLabels:
      app: tributa-ai
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000
```

### **2. Pod Security Standards**
```yaml
# k8s/pod-security.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: tributa-ai
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### **3. Secrets Management**
```bash
# Criar secrets via AWS Secrets Manager
aws secretsmanager create-secret \
  --name tributa-ai/database-url \
  --description "Database URL for Tributa.AI" \
  --secret-string "postgresql://user:pass@host:5432/db"

# External Secrets Operator para sync
kubectl apply -f https://raw.githubusercontent.com/external-secrets/external-secrets/main/deploy/crds/bundle.yaml
```

---

## 🛠️ **MANUTENÇÃO** {#manutenção}

### **1. Atualizações Regulares**
```bash
# Atualizar dependências
npm audit fix
npm update

# Atualizar imagens base
docker pull node:20-alpine
docker pull postgres:15-alpine

# Rebuild e redeploy
./scripts/deploy.sh production
```

### **2. Cleanup**
```bash
# Remover imagens antigas do ECR
aws ecr list-images --repository-name tributa-ai --filter tagStatus=UNTAGGED --query 'imageIds[*]' --output json | \
jq '.[] | select(.imageDigest != null)' | \
xargs -I {} aws ecr batch-delete-image --repository-name tributa-ai --image-ids '{}'

# Cleanup de pods antigos
kubectl delete pods --field-selector=status.phase=Succeeded -n tributa-ai
```

### **3. Monitoramento de Custos**
```bash
# Ver custos por tag
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

---

## 📞 **CONTATOS DE EMERGÊNCIA**

### **Equipe DevOps:**
- 📧 **DevOps Lead:** devops@tributa.ai
- 📱 **On-call:** +55 11 99999-9999
- 🚨 **PagerDuty:** https://tributa-ai.pagerduty.com

### **Escalation:**
1. **L1:** DevOps Engineer (0-15 min)
2. **L2:** Tech Lead (15-30 min)  
3. **L3:** CTO (30+ min)

---

**📌 Este guia é atualizado constantemente. Versão atual: 1.0 (Janeiro 2025)**