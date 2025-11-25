/**
 * 🧠 OpenRouter Service - Integração com LLMs
 * Permite que os agentes pensem de verdade usando Claude, GPT, etc.
 *
 * @module OpenRouterService
 * @version 1.0.0
 */

const EventEmitter = require('events');

class OpenRouterService extends EventEmitter {
    constructor(config = {}) {
        super();

        this.apiKey = config.apiKey || process.env.OPENROUTER_API_KEY;
        this.baseUrl = config.baseUrl || 'https://openrouter.ai/api/v1';
        this.defaultModel = config.defaultModel || 'anthropic/claude-3-haiku';

        // Configuração de modelos por agente
        this.agentModels = {
            'LIA': 'anthropic/claude-3-opus-20240229',      // Coordenadora - modelo mais inteligente
            'NEXUS': 'anthropic/claude-3-sonnet-20240229', // CTO - modelo balanceado
            'EXECUTOR': 'anthropic/claude-3-haiku-20240307', // Dev - rápido para código
            'HELIOS': 'openai/gpt-4-turbo',                 // Security - análise profunda
            'ATLAS': 'openai/gpt-4-turbo',                  // UI/UX - criativo
            'GENESIS': 'anthropic/claude-3-sonnet-20240229', // Arquiteto - técnico
            'AETHER': 'anthropic/claude-3-haiku-20240307',   // Performance - rápido
            'ORACLE': 'openai/gpt-4-turbo',                  // QA - análise
            'THANOS': 'anthropic/claude-3-haiku-20240307'    // Cleanup - rápido
        };

        // System prompts por agente
        this.agentPrompts = {
            'LIA': `Você é LIA, a Coordenadora Supreme do sistema TRIBUTA.AI.
Sua função é orquestrar 9 agentes especializados para máxima eficiência.
Você NUNCA executa tarefas diretamente - SEMPRE delega para o agente correto.
Analise a tarefa e determine qual agente deve executá-la, ou coordene múltiplos agentes se necessário.`,

            'NEXUS': `Você é NEXUS, o CTO-AI do TRIBUTA.AI.
Especialista em arquitetura de software, decisões técnicas e coordenação de desenvolvimento.
Foque em soluções escaláveis, clean code e boas práticas.
Projeto: Sistema de recuperação de créditos tributários com marketplace de tokens.`,

            'EXECUTOR': `Você é EXECUTOR, o Especialista Frontend do TRIBUTA.AI.
Expert em React, TypeScript, Tailwind CSS e desenvolvimento de interfaces.
Corrija erros de código, implemente features e otimize componentes.
Sempre forneça código completo e funcional.`,

            'HELIOS': `Você é HELIOS, o Guardian de Segurança do TRIBUTA.AI.
Especialista em segurança, validação de builds, LGPD, OWASP e compliance.
Analise vulnerabilidades, configure CSP, valide autenticação e proteja dados sensíveis.`,

            'ATLAS': `Você é ATLAS, o Perfeccionista de UI/UX do TRIBUTA.AI.
Expert em design de interfaces, experiência do usuário e acessibilidade.
Crie interfaces Bloomberg-level: profissionais, elegantes e funcionais.
Foque em usabilidade, consistência visual e feedback do usuário.`,

            'GENESIS': `Você é GENESIS, o Arquiteto de Código do TRIBUTA.AI.
Especialista em geração de código, arquitetura de sistemas e padrões de projeto.
Crie estruturas robustas, componentes reutilizáveis e código enterprise-grade.`,

            'AETHER': `Você é AETHER, o Guru de Performance do TRIBUTA.AI.
Expert em otimização, lazy loading, code splitting e performance web.
Analise gargalos, reduza bundle size, otimize renders e melhore Core Web Vitals.`,

            'ORACLE': `Você é ORACLE, o Guardian de Qualidade do TRIBUTA.AI.
Especialista em testes, validação, debugging e análise de código.
Identifique bugs, crie testes, valide fluxos e garanta qualidade enterprise.`,

            'THANOS': `Você é THANOS, o Limpador de Código Supreme do TRIBUTA.AI.
Expert em refatoração, remoção de código morto, organização de imports e limpeza.
Elimine redundâncias, simplifique lógica e mantenha o código limpo e eficiente.`
        };

        // Métricas
        this.metrics = {
            totalCalls: 0,
            totalTokens: 0,
            totalCost: 0,
            callsByAgent: {}
        };

        if (!this.apiKey) {
            console.warn('⚠️ OpenRouter API key não configurada - agentes não poderão pensar');
        } else {
            console.log('✅ OpenRouter Service inicializado');
        }
    }

    /**
     * Envia prompt para LLM e retorna resposta
     */
    async chat(agentName, userMessage, options = {}) {
        if (!this.apiKey) {
            throw new Error('OpenRouter API key não configurada');
        }

        const model = options.model || this.agentModels[agentName.toUpperCase()] || this.defaultModel;
        const systemPrompt = options.systemPrompt || this.agentPrompts[agentName.toUpperCase()] || '';
        const temperature = options.temperature ?? 0.7;
        const maxTokens = options.maxTokens || 4096;

        console.log(`🧠 ${agentName}: Processando com ${model}...`);

        const startTime = Date.now();

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://tributa.ai',
                    'X-Title': 'TRIBUTA.AI Genesis System'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    temperature: temperature,
                    max_tokens: maxTokens
                })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`OpenRouter error: ${response.status} - ${error}`);
            }

            const data = await response.json();
            const processingTime = Date.now() - startTime;

            // Atualiza métricas
            const tokensUsed = data.usage?.total_tokens || 0;
            const costUsd = this.calculateCost(model, tokensUsed);

            this.metrics.totalCalls++;
            this.metrics.totalTokens += tokensUsed;
            this.metrics.totalCost += costUsd;
            this.metrics.callsByAgent[agentName] = (this.metrics.callsByAgent[agentName] || 0) + 1;

            const result = {
                success: true,
                content: data.choices[0]?.message?.content || '',
                model: model,
                tokensUsed: tokensUsed,
                costUsd: costUsd,
                processingTimeMs: processingTime,
                agent: agentName
            };

            console.log(`✅ ${agentName}: Resposta em ${processingTime}ms (${tokensUsed} tokens, $${costUsd.toFixed(4)})`);

            this.emit('completion', result);
            return result;

        } catch (error) {
            console.error(`❌ ${agentName}: Erro ao processar:`, error.message);
            this.emit('error', { agent: agentName, error: error.message });
            throw error;
        }
    }

    /**
     * Processa uma tarefa completa com contexto
     */
    async processTask(task, agentName, context = {}) {
        const prompt = this.buildTaskPrompt(task, context);
        return await this.chat(agentName, prompt, {
            temperature: task.type === 'code' ? 0.3 : 0.7 // Menos criativo para código
        });
    }

    /**
     * Constrói prompt estruturado para tarefa
     */
    buildTaskPrompt(task, context = {}) {
        let prompt = `## TAREFA\n`;
        prompt += `**Título:** ${task.title}\n`;
        prompt += `**Descrição:** ${task.description}\n`;
        prompt += `**Tipo:** ${task.type}\n`;
        prompt += `**Prioridade:** ${task.priority}\n\n`;

        if (task.expected_output) {
            prompt += `**Resultado Esperado:** ${task.expected_output}\n\n`;
        }

        if (context.files && context.files.length > 0) {
            prompt += `## ARQUIVOS RELEVANTES\n`;
            context.files.forEach(file => {
                prompt += `### ${file.path}\n\`\`\`${file.language || ''}\n${file.content}\n\`\`\`\n\n`;
            });
        }

        if (context.codebase) {
            prompt += `## CONTEXTO DO PROJETO\n${context.codebase}\n\n`;
        }

        prompt += `## INSTRUÇÕES\n`;
        prompt += `1. Analise a tarefa cuidadosamente\n`;
        prompt += `2. Forneça uma solução completa e funcional\n`;
        prompt += `3. Se for código, forneça o código completo pronto para usar\n`;
        prompt += `4. Explique brevemente suas decisões\n`;

        return prompt;
    }

    /**
     * Calcula custo aproximado
     */
    calculateCost(model, tokens) {
        // Preços aproximados por 1M tokens (input + output médio)
        const prices = {
            'anthropic/claude-3-opus-20240229': 0.015,
            'anthropic/claude-3-sonnet-20240229': 0.003,
            'anthropic/claude-3-haiku-20240307': 0.00025,
            'openai/gpt-4-turbo': 0.01,
            'openai/gpt-4': 0.03,
            'openai/gpt-3.5-turbo': 0.0005
        };

        const pricePerToken = (prices[model] || 0.001) / 1000000;
        return tokens * pricePerToken;
    }

    /**
     * Retorna métricas do serviço
     */
    getMetrics() {
        return {
            ...this.metrics,
            avgTokensPerCall: this.metrics.totalCalls > 0
                ? Math.round(this.metrics.totalTokens / this.metrics.totalCalls)
                : 0,
            avgCostPerCall: this.metrics.totalCalls > 0
                ? this.metrics.totalCost / this.metrics.totalCalls
                : 0
        };
    }

    /**
     * Verifica se o serviço está configurado
     */
    isConfigured() {
        return !!this.apiKey;
    }
}

module.exports = OpenRouterService;
