/**
 * 🤖 Intelligent Agent Handlers
 * Handlers que conectam tarefas aos agentes com inteligência real via LLM
 *
 * @module IntelligentHandlers
 * @version 1.0.0
 */

const OpenRouterService = require('../llm/openrouter-service.js');
const fs = require('fs').promises;
const path = require('path');

class IntelligentHandlers {
    constructor(config = {}) {
        this.projectPath = config.projectPath || process.cwd();
        this.llm = new OpenRouterService({
            apiKey: config.openRouterApiKey || process.env.OPENROUTER_API_KEY
        });

        // Registra handlers
        this.handlers = new Map();
        this.initializeHandlers();

        console.log('🤖 Intelligent Handlers inicializados');
    }

    /**
     * Inicializa handlers para todos os agentes
     */
    initializeHandlers() {
        // LIA - Coordenadora (delega, não executa)
        this.handlers.set('LIA', async (task) => {
            return await this.handleLIA(task);
        });

        // NEXUS - CTO/Arquiteto
        this.handlers.set('NEXUS', async (task) => {
            return await this.handleNEXUS(task);
        });

        // EXECUTOR - Frontend Developer
        this.handlers.set('EXECUTOR', async (task) => {
            return await this.handleEXECUTOR(task);
        });

        // HELIOS - Security
        this.handlers.set('HELIOS', async (task) => {
            return await this.handleHELIOS(task);
        });

        // ATLAS - UI/UX
        this.handlers.set('ATLAS', async (task) => {
            return await this.handleATLAS(task);
        });

        // GENESIS - Code Generation
        this.handlers.set('GENESIS', async (task) => {
            return await this.handleGENESIS(task);
        });

        // AETHER - Performance
        this.handlers.set('AETHER', async (task) => {
            return await this.handleAETHER(task);
        });

        // ORACLE - QA/Testing
        this.handlers.set('ORACLE', async (task) => {
            return await this.handleORACLE(task);
        });

        // THANOS - Cleanup
        this.handlers.set('THANOS', async (task) => {
            return await this.handleTHANOS(task);
        });
    }

    /**
     * Obtém handler para um agente
     */
    getHandler(agentName) {
        return this.handlers.get(agentName.toUpperCase());
    }

    /**
     * Lista todos os handlers disponíveis
     */
    getAvailableAgents() {
        return Array.from(this.handlers.keys());
    }

    // =====================================================
    // HANDLERS ESPECÍFICOS POR AGENTE
    // =====================================================

    /**
     * LIA - Coordenadora Supreme
     * Analisa tarefa e decide qual agente deve executar
     */
    async handleLIA(task) {
        const context = await this.getProjectContext();

        const response = await this.llm.chat('LIA', `
Analise esta tarefa e determine:
1. Qual agente deve executar (NEXUS, EXECUTOR, HELIOS, ATLAS, GENESIS, AETHER, ORACLE ou THANOS)
2. Se precisa de múltiplos agentes, qual a sequência
3. Prioridade e complexidade

## TAREFA
Título: ${task.title}
Descrição: ${task.description}
Tipo: ${task.type}
Prioridade: ${task.priority}

## AGENTES DISPONÍVEIS
- NEXUS: Arquitetura, decisões técnicas, coordenação
- EXECUTOR: Frontend, React, TypeScript, correção de bugs
- HELIOS: Segurança, LGPD, validação, builds
- ATLAS: UI/UX, design, interfaces, acessibilidade
- GENESIS: Geração de código, arquitetura de componentes
- AETHER: Performance, otimização, bundle, lazy loading
- ORACLE: Testes, QA, debugging, validação
- THANOS: Limpeza de código, refatoração, imports

Responda no formato JSON:
{
  "recommendation": {
    "primaryAgent": "NOME_DO_AGENTE",
    "secondaryAgents": [],
    "reasoning": "explicação"
  },
  "taskAnalysis": {
    "complexity": "low|medium|high",
    "estimatedTime": "X minutos",
    "riskLevel": "low|medium|high"
  },
  "executionPlan": "descrição do plano"
}
`, { temperature: 0.3 });

        return {
            success: true,
            result: response.content,
            agent: 'LIA',
            type: 'coordination',
            tokensUsed: response.tokensUsed,
            costUsd: response.costUsd
        };
    }

    /**
     * NEXUS - CTO/Arquiteto
     */
    async handleNEXUS(task) {
        const context = await this.getProjectContext();

        const response = await this.llm.chat('NEXUS', `
## PROJETO
${context}

## TAREFA
Título: ${task.title}
Descrição: ${task.description}

Como CTO-AI, analise e forneça:
1. Análise arquitetural
2. Recomendações técnicas
3. Decisões de design
4. Impacto no sistema
5. Plano de implementação

Se a tarefa requer código, forneça exemplos ou estrutura.
`);

        return {
            success: true,
            result: response.content,
            agent: 'NEXUS',
            type: 'architecture',
            tokensUsed: response.tokensUsed,
            costUsd: response.costUsd
        };
    }

    /**
     * EXECUTOR - Frontend Developer
     */
    async handleEXECUTOR(task) {
        // Tenta ler arquivos mencionados na tarefa
        const files = await this.extractAndReadFiles(task);

        const response = await this.llm.chat('EXECUTOR', `
## TAREFA
Título: ${task.title}
Descrição: ${task.description}

${files.length > 0 ? `## ARQUIVOS RELEVANTES\n${files.map(f => `### ${f.path}\n\`\`\`typescript\n${f.content}\n\`\`\``).join('\n\n')}` : ''}

## INSTRUÇÕES
1. Analise o código/problema
2. Forneça a SOLUÇÃO COMPLETA em código
3. Use React + TypeScript + Tailwind
4. Siga os padrões do projeto
5. Explique as mudanças brevemente

Forneça o código pronto para copiar e usar.
`, { temperature: 0.3 });

        return {
            success: true,
            result: response.content,
            agent: 'EXECUTOR',
            type: 'code',
            tokensUsed: response.tokensUsed,
            costUsd: response.costUsd,
            filesModified: files.map(f => f.path)
        };
    }

    /**
     * HELIOS - Security Master
     */
    async handleHELIOS(task) {
        const response = await this.llm.chat('HELIOS', `
## TAREFA DE SEGURANÇA
Título: ${task.title}
Descrição: ${task.description}

Como Guardian de Segurança, analise:
1. Vulnerabilidades potenciais
2. Conformidade LGPD
3. Configurações de CSP
4. Autenticação e autorização
5. Proteção de dados sensíveis

Forneça:
- Diagnóstico de segurança
- Recomendações de correção
- Código de configuração se necessário
- Checklist de validação
`);

        return {
            success: true,
            result: response.content,
            agent: 'HELIOS',
            type: 'security',
            tokensUsed: response.tokensUsed,
            costUsd: response.costUsd
        };
    }

    /**
     * ATLAS - UI/UX Perfectionist
     */
    async handleATLAS(task) {
        const response = await this.llm.chat('ATLAS', `
## TAREFA DE UI/UX
Título: ${task.title}
Descrição: ${task.description}

Como Especialista em UI/UX, forneça:
1. Análise de usabilidade
2. Sugestões de design (Bloomberg-level)
3. Componentes Tailwind CSS
4. Melhorias de acessibilidade
5. Feedback visual e microinterações

Objetivo: Interface profissional, elegante, funcional.
Forneça código React/Tailwind quando aplicável.
`);

        return {
            success: true,
            result: response.content,
            agent: 'ATLAS',
            type: 'design',
            tokensUsed: response.tokensUsed,
            costUsd: response.costUsd
        };
    }

    /**
     * GENESIS - Code Architect
     */
    async handleGENESIS(task) {
        const response = await this.llm.chat('GENESIS', `
## TAREFA DE ARQUITETURA/GERAÇÃO
Título: ${task.title}
Descrição: ${task.description}

Como Arquiteto de Código, forneça:
1. Estrutura de componentes/módulos
2. Código completo e funcional
3. Tipos TypeScript
4. Padrões de projeto aplicados
5. Documentação inline

Gere código enterprise-grade, limpo e bem estruturado.
`, { temperature: 0.4 });

        return {
            success: true,
            result: response.content,
            agent: 'GENESIS',
            type: 'generation',
            tokensUsed: response.tokensUsed,
            costUsd: response.costUsd
        };
    }

    /**
     * AETHER - Performance Guru
     */
    async handleAETHER(task) {
        const response = await this.llm.chat('AETHER', `
## TAREFA DE PERFORMANCE
Título: ${task.title}
Descrição: ${task.description}

Como Guru de Performance, analise e forneça:
1. Gargalos identificados
2. Otimizações de bundle
3. Lazy loading strategies
4. Memoização e caching
5. Code splitting recommendations
6. Core Web Vitals improvements

Forneça código otimizado quando aplicável.
`);

        return {
            success: true,
            result: response.content,
            agent: 'AETHER',
            type: 'performance',
            tokensUsed: response.tokensUsed,
            costUsd: response.costUsd
        };
    }

    /**
     * ORACLE - Quality Guardian
     */
    async handleORACLE(task) {
        const response = await this.llm.chat('ORACLE', `
## TAREFA DE QUALIDADE
Título: ${task.title}
Descrição: ${task.description}

Como Guardian de Qualidade, forneça:
1. Análise do problema/bug
2. Casos de teste sugeridos
3. Código de testes (Jest/Vitest)
4. Validação de fluxos
5. Debugging steps
6. Quality checklist

Identifique problemas e forneça soluções verificáveis.
`);

        return {
            success: true,
            result: response.content,
            agent: 'ORACLE',
            type: 'testing',
            tokensUsed: response.tokensUsed,
            costUsd: response.costUsd
        };
    }

    /**
     * THANOS - Code Cleaner Supreme
     */
    async handleTHANOS(task) {
        const files = await this.extractAndReadFiles(task);

        const response = await this.llm.chat('THANOS', `
## TAREFA DE LIMPEZA
Título: ${task.title}
Descrição: ${task.description}

${files.length > 0 ? `## CÓDIGO PARA LIMPAR\n${files.map(f => `### ${f.path}\n\`\`\`typescript\n${f.content}\n\`\`\``).join('\n\n')}` : ''}

Como Limpador de Código Supreme, forneça:
1. Código morto identificado
2. Imports não utilizados
3. Código refatorado e limpo
4. Simplificações de lógica
5. Antes vs Depois

Elimine redundâncias sem quebrar funcionalidade.
`, { temperature: 0.2 });

        return {
            success: true,
            result: response.content,
            agent: 'THANOS',
            type: 'cleanup',
            tokensUsed: response.tokensUsed,
            costUsd: response.costUsd,
            filesModified: files.map(f => f.path)
        };
    }

    // =====================================================
    // UTILITÁRIOS
    // =====================================================

    /**
     * Obtém contexto do projeto
     */
    async getProjectContext() {
        return `
PROJETO: TRIBUTA.AI
Sistema de recuperação de créditos tributários com marketplace de tokens blockchain.

TECNOLOGIAS:
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + PostgreSQL (Railway)
- AI: 9 Agentes autônomos via OpenRouter
- Blockchain: Hyperledger para tokenização de créditos

MÓDULOS PRINCIPAIS:
- Dashboard executivo
- Recuperação de créditos (análise fiscal)
- Marketplace de tokens
- Carteira digital
- Compliance LGPD
- Relatórios e analytics
`;
    }

    /**
     * Extrai e lê arquivos mencionados na tarefa
     */
    async extractAndReadFiles(task) {
        const files = [];
        const description = task.description || '';

        // Procura padrões de arquivos
        const filePatterns = [
            /src\/[\w\/\-\.]+\.(tsx?|jsx?|css|json)/g,
            /[\w\/\-]+\.(tsx?|jsx?)/g
        ];

        const foundPaths = new Set();
        for (const pattern of filePatterns) {
            const matches = description.match(pattern);
            if (matches) {
                matches.forEach(m => foundPaths.add(m));
            }
        }

        // Lê arquivos encontrados
        for (const filePath of foundPaths) {
            try {
                const fullPath = path.join(this.projectPath, filePath);
                const content = await fs.readFile(fullPath, 'utf-8');
                files.push({
                    path: filePath,
                    content: content.slice(0, 5000), // Limita tamanho
                    language: filePath.endsWith('.tsx') || filePath.endsWith('.ts') ? 'typescript' : 'javascript'
                });
            } catch (e) {
                // Arquivo não encontrado, ignora
            }
        }

        return files;
    }
}

module.exports = IntelligentHandlers;
