# ============================================
# TRIBUTA.AI - LIA Cloud Agents System
# Dockerfile para Railway - Sistema de Agentes
# ============================================

FROM node:20-alpine

WORKDIR /app

# Instalar apenas dependências necessárias para agentes
RUN npm init -y && npm install pg express ws

# Copiar apenas arquivos dos agentes
COPY .lia/cloud/ ./.lia/cloud/
COPY .lia/agents/ ./.lia/agents/

# Expor porta
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3003/api/health || exit 1

# Iniciar sistema de agentes
CMD ["node", ".lia/cloud/start-cloud-agents.js"]
