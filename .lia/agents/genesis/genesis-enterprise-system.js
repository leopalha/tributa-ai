/**
 * 🚀 GENESIS ENTERPRISE SYSTEM v4.1 - SISTEMA INTEGRADO COMPLETO
 * Sistema enterprise completo integrando todos os componentes avançados da Fase 2
 *
 * COMPONENTES INTEGRADOS:
 * - WorkflowEngine: Coordenação automática entre os 9 agentes
 * - AgentBus: Comunicação real-time via WebSocket
 * - RealTimeMetrics: Monitoramento enterprise com alertas
 * - AutoOptimizer: Auto-otimização inteligente com ML
 * - Dashboard: Interface Bloomberg-level funcional
 * - OpenRouter Integration: Conexão real com todos os modelos
 */

const WorkflowEngine = require('./src/workflows/WorkflowEngine.js');
const AgentBus = require('./src/communication/AgentBus.js');
const RealTimeMetrics = require('./src/monitoring/RealTimeMetrics.js');
const AutoOptimizer = require('./src/optimization/AutoOptimizer.js');
const TaskProcessor = require('./src/db/task-processor.js');
const EventEmitter = require('events');
const fs = require('fs').promises;
const path = require('path');
const http = require('http');

class GenesisEnterpriseSystem extends EventEmitter {
    constructor(config = {}) {
        super();

        this.config = {
            projectPath: config.projectPath || "D:/tributa-ai",
            port: config.port || process.env.PORT || 3003,
            host: config.host || 'localhost',
            openRouterApiKey: config.openRouterApiKey || process.env.OPENROUTER_API_KEY,
            enableMetrics: config.enableMetrics !== false,
            enableOptimization: config.enableOptimization !== false,
            enableDashboard: config.enableDashboard !== false,
            autoStart: config.autoStart !== false,
            ...config
        };

        // Componentes principais
        this.workflowEngine = null;
        this.agentBus = null;
        this.realTimeMetrics = null;
        this.autoOptimizer = null;
        this.httpServer = null;
        this.taskProcessor = null; // Novo: Processador de tarefas PostgreSQL

        // Estado do sistema
        this.isRunning = false;
        this.startTime = null;
        this.components = new Map();

        // Configuração dos 9 agentes especializados
        this.agentConfigurations = new Map([
            ['lia', {
                name: 'LIA Coordenadora Supreme',
                role: 'orchestrator',
                model: 'claude-3-opus',
                maxConcurrency: 1,
                priority: 1,
                systemPrompt: 'Você é LIA, a coordenadora supreme. Sua função é orquestrar os outros agentes para máxima eficiência.',
                capabilities: ['coordination', 'delegation', 'monitoring', 'strategy'],
                costLimit: 10.0
            }],
            ['nexus', {
                name: 'NEXUS CTO-AI Coordenador',
                role: 'coordinator',
                model: 'claude-3-sonnet',
                maxConcurrency: 2,
                priority: 2,
                systemPrompt: 'Você é NEXUS, o CTO-AI coordenador técnico. Especialista em arquitetura e coordenação técnica.',
                capabilities: ['technical_coordination', 'architecture', 'integration', 'planning'],
                costLimit: 5.0
            }],
            ['executor', {
                name: 'EXECUTOR Frontend Specialist',
                role: 'frontend',
                model: 'claude-3-haiku',
                maxConcurrency: 3,
                priority: 3,
                systemPrompt: 'Você é EXECUTOR, especialista em frontend. Foque em correções rápidas e precisas de código.',
                capabilities: ['react', 'typescript', 'ui_fixes', 'syntax_errors', 'debugging'],
                costLimit: 2.0
            }],
            ['helios', {
                name: 'HELIOS Security Master',
                role: 'security',
                model: 'gpt-4',
                maxConcurrency: 2,
                priority: 3,
                systemPrompt: 'Você é HELIOS, o guardian de segurança. Foque em builds, validação e monitoramento.',
                capabilities: ['security', 'build_validation', 'monitoring', 'health_checks', 'compliance'],
                costLimit: 4.0
            }],
            ['atlas', {
                name: 'ATLAS UI/UX Perfectionist',
                role: 'design',
                model: 'gpt-4-turbo',
                maxConcurrency: 2,
                priority: 4,
                systemPrompt: 'Você é ATLAS, o perfeccionista de UI/UX. Crie interfaces Bloomberg-level profissionais.',
                capabilities: ['ui_design', 'ux_optimization', 'styling', 'accessibility', 'user_experience'],
                costLimit: 3.0
            }],
            ['genesis', {
                name: 'GENESIS Code Architect',
                role: 'generation',
                model: 'claude-3-sonnet',
                maxConcurrency: 2,
                priority: 4,
                systemPrompt: 'Você é GENESIS, o arquiteto de código. Gere código enterprise de alta qualidade.',
                capabilities: ['code_generation', 'architecture', 'patterns', 'templates', 'scaffolding'],
                costLimit: 4.0
            }],
            ['aether', {
                name: 'AETHER Performance Guru',
                role: 'performance',
                model: 'claude-3-haiku',
                maxConcurrency: 2,
                priority: 5,
                systemPrompt: 'Você é AETHER, o guru de performance. Otimize velocidade e eficiência.',
                capabilities: ['performance', 'optimization', 'bundling', 'caching', 'lazy_loading'],
                costLimit: 2.0
            }],
            ['oracle', {
                name: 'ORACLE Quality Guardian',
                role: 'testing',
                model: 'gpt-4',
                maxConcurrency: 3,
                priority: 5,
                systemPrompt: 'Você é ORACLE, o guardian da qualidade. Teste e valide tudo meticulosamente.',
                capabilities: ['testing', 'validation', 'quality_assurance', 'debugging', 'analysis'],
                costLimit: 3.0
            }],
            ['thanos', {
                name: 'THANOS Code Cleaner Supreme',
                role: 'cleanup',
                model: 'claude-3-haiku',
                maxConcurrency: 2,
                priority: 6,
                systemPrompt: 'Você é THANOS, o limpador supremo. Remova código desnecessário com precisão.',
                capabilities: ['cleanup', 'dead_code_removal', 'imports', 'refactoring', 'optimization'],
                costLimit: 1.0
            }]
        ]);

        this.initialize();
    }

    /**
     * Inicializa o sistema enterprise
     */
    async initialize() {
        console.log('🚀 Inicializando Genesis Enterprise System v4.1...');

        try {
            // Cria diretórios necessários
            await this.createDirectories();

            // Inicializa componentes principais
            await this.initializeComponents();

            // Configura integração entre componentes
            this.setupComponentIntegration();

            console.log('✅ Genesis Enterprise System inicializado com sucesso');

            if (this.config.autoStart) {
                await this.start();
            }

        } catch (error) {
            console.error('❌ Erro na inicialização do sistema:', error);
            throw error;
        }
    }

    /**
     * Cria estrutura de diretórios
     */
    async createDirectories() {
        const directories = [
            '.lia/agents/genesis/logs',
            '.lia/agents/genesis/status',
            '.lia/agents/genesis/config',
            '.lia/agents/genesis/reports',
            '.lia/agents/genesis/dashboard'
        ];

        for (const dir of directories) {
            const fullPath = path.join(this.config.projectPath, dir);
            await fs.mkdir(fullPath, { recursive: true });
        }
    }

    /**
     * Inicializa todos os componentes principais
     */
    async initializeComponents() {
        console.log('🔧 Inicializando componentes do sistema...');

        // 1. WorkflowEngine - Coordenação de workflows
        this.workflowEngine = new WorkflowEngine({
            projectPath: this.config.projectPath,
            maxConcurrentAgents: 9,
            timeoutMs: 300000
        });

        this.components.set('workflowEngine', {
            instance: this.workflowEngine,
            status: 'initialized',
            startTime: null
        });

        // 2. HTTP Server para Dashboard (criar ANTES do AgentBus para compartilhar porta)
        if (this.config.enableDashboard) {
            await this.initializeHttpServer();
        }

        // 3. AgentBus - Comunicação real-time (usa HTTP server para compartilhar porta)
        this.agentBus = new AgentBus({
            port: this.config.port,
            host: this.config.host,
            projectPath: this.config.projectPath,
            httpServer: this.httpServer // Passa o servidor HTTP para compartilhar porta
        });

        this.components.set('agentBus', {
            instance: this.agentBus,
            status: 'initialized',
            startTime: null
        });

        // 4. RealTimeMetrics - Monitoramento
        if (this.config.enableMetrics) {
            this.realTimeMetrics = new RealTimeMetrics({
                projectPath: this.config.projectPath,
                collectionInterval: 10000
            });

            this.components.set('realTimeMetrics', {
                instance: this.realTimeMetrics,
                status: 'initialized',
                startTime: null
            });
        }

        // 5. AutoOptimizer - Otimização inteligente
        if (this.config.enableOptimization) {
            this.autoOptimizer = new AutoOptimizer({
                projectPath: this.config.projectPath,
                enableAutoApply: false, // Segurança - aprovação manual
                optimizationInterval: 60000
            });

            this.components.set('autoOptimizer', {
                instance: this.autoOptimizer,
                status: 'initialized',
                startTime: null
            });
        }

        // NOTA: HTTP Server já inicializado no passo 2
        }

        // 6. TaskProcessor - Integração com PostgreSQL
        if (process.env.DATABASE_URL) {
            this.taskProcessor = new TaskProcessor({
                pollInterval: 5000,
                maxConcurrentTasks: 3,
                taskTimeout: 300000
            });

            this.components.set('taskProcessor', {
                instance: this.taskProcessor,
                status: 'initialized',
                startTime: null
            });
        } else {
            console.log('⚠️ DATABASE_URL não configurada - TaskProcessor desabilitado');
        }

        console.log(`✅ ${this.components.size} componentes inicializados`);
    }

    /**
     * Inicializa servidor HTTP para dashboard
     */
    async initializeHttpServer() {
        this.httpServer = http.createServer((req, res) => {
            this.handleHttpRequest(req, res);
        });

        this.components.set('httpServer', {
            instance: this.httpServer,
            status: 'initialized',
            startTime: null
        });
    }

    /**
     * Configura integração entre componentes
     */
    setupComponentIntegration() {
        console.log('🔗 Configurando integração entre componentes...');

        // Integração WorkflowEngine <-> AgentBus
        if (this.workflowEngine && this.agentBus) {
            this.workflowEngine.on('step:completed', (data) => {
                this.agentBus.broadcastToChannel('system', {
                    type: 'workflow_step_completed',
                    data
                });
            });

            this.workflowEngine.on('workflow:completed', (data) => {
                this.agentBus.broadcastToChannel('coordination', {
                    type: 'workflow_completed',
                    data
                });
            });
        }

        // Integração RealTimeMetrics <-> AgentBus
        if (this.realTimeMetrics && this.agentBus) {
            this.realTimeMetrics.on('metrics:update', (metrics) => {
                this.agentBus.broadcastToChannel('system', {
                    type: 'metrics_update',
                    data: metrics
                });
            });

            this.realTimeMetrics.on('metrics:alert:created', (alert) => {
                this.agentBus.broadcastToChannel('emergency', {
                    type: 'alert_created',
                    data: alert,
                    priority: 'high'
                });
            });
        }

        // Integração AutoOptimizer <-> AgentBus
        if (this.autoOptimizer && this.agentBus) {
            this.autoOptimizer.on('optimizer:optimization_generated', (optimization) => {
                this.agentBus.broadcastToChannel('system', {
                    type: 'optimization_available',
                    data: optimization
                });
            });

            this.autoOptimizer.on('optimizer:optimization_applied', (optimization) => {
                this.agentBus.broadcastToChannel('coordination', {
                    type: 'optimization_applied',
                    data: optimization
                });
            });
        }

        // Integração RealTimeMetrics <-> AutoOptimizer
        if (this.realTimeMetrics && this.autoOptimizer) {
            this.realTimeMetrics.on('metrics:agent:activity', (data) => {
                this.autoOptimizer.recordAgentPerformance(data.agentId, {
                    responseTime: data.activity.responseTime,
                    success: data.activity.success,
                    cost: data.activity.cost,
                    model: data.activity.model,
                    tokensUsed: data.activity.tokensUsed,
                    taskType: data.activity.type
                });
            });
        }

        console.log('✅ Integração entre componentes configurada');
    }

    /**
     * Inicia todo o sistema enterprise
     */
    async start() {
        if (this.isRunning) {
            console.log('⚠️ Sistema já está rodando');
            return;
        }

        console.log('🚀 Iniciando Genesis Enterprise System...');

        try {
            this.isRunning = true;
            this.startTime = Date.now();

            // Inicia componentes em ordem específica
            // IMPORTANTE: HTTP Server primeiro, depois AgentBus (usa mesmo servidor)
            if (this.config.enableDashboard) {
                await this.startComponent('httpServer');
            }

            await this.startComponent('agentBus');
            await this.startComponent('workflowEngine');

            if (this.config.enableMetrics) {
                await this.startComponent('realTimeMetrics');
            }

            if (this.config.enableOptimization) {
                await this.startComponent('autoOptimizer');
            }

            // Inicia TaskProcessor se disponível
            if (this.taskProcessor) {
                await this.startComponent('taskProcessor');
            }

            // Registra agentes no sistema
            await this.registerAgents();

            // Inicia monitoramento de saúde
            this.startHealthMonitoring();

            console.log('🎉 Genesis Enterprise System iniciado com sucesso!');
            console.log(`📊 Dashboard disponível em: http://${this.config.host}:${this.config.port}`);
            console.log(`🌐 WebSocket disponível em: ws://${this.config.host}:${this.config.port}`);

            this.emit('system:started');

            // Salva status do sistema
            await this.saveSystemStatus();

        } catch (error) {
            console.error('❌ Erro ao iniciar sistema:', error);
            this.isRunning = false;
            throw error;
        }
    }

    /**
     * Inicia um componente específico
     */
    async startComponent(componentName) {
        const component = this.components.get(componentName);
        if (!component) {
            throw new Error(`Componente não encontrado: ${componentName}`);
        }

        try {
            console.log(`🔧 Iniciando ${componentName}...`);

            component.startTime = Date.now();

            switch (componentName) {
                case 'agentBus':
                    await component.instance.start();
                    break;
                case 'workflowEngine':
                    await component.instance.start();
                    break;
                case 'realTimeMetrics':
                    await component.instance.start();
                    break;
                case 'autoOptimizer':
                    await component.instance.start();
                    break;
                case 'httpServer':
                    await this.startHttpServer();
                    break;
                case 'taskProcessor':
                    await component.instance.initialize();
                    await component.instance.startProcessing();
                    // Registra handlers dos agentes
                    this.registerAgentHandlers();
                    break;
                default:
                    throw new Error(`Tipo de componente desconhecido: ${componentName}`);
            }

            component.status = 'running';
            console.log(`✅ ${componentName} iniciado com sucesso`);

        } catch (error) {
            component.status = 'error';
            console.error(`❌ Erro ao iniciar ${componentName}:`, error);
            throw error;
        }
    }

    /**
     * Inicia servidor HTTP
     */
    async startHttpServer() {
        return new Promise((resolve, reject) => {
            this.httpServer.listen(this.config.port, this.config.host, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Processa requisições HTTP
     */
    async handleHttpRequest(req, res) {
        try {
            const url = req.url;

            // Serve dashboard principal
            if (url === '/' || url === '/dashboard') {
                await this.serveDashboard(res);
                return;
            }

            // API endpoints
            if (url.startsWith('/api/')) {
                await this.handleApiRequest(req, res);
                return;
            }

            // Recursos estáticos
            if (url.startsWith('/static/')) {
                await this.serveStaticFile(req, res);
                return;
            }

            // 404
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Não encontrado');

        } catch (error) {
            console.error('❌ Erro ao processar requisição HTTP:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro interno do servidor');
        }
    }

    /**
     * Serve dashboard principal
     */
    async serveDashboard(res) {
        try {
            const dashboardPath = path.join(
                this.config.projectPath,
                '.lia/agents/genesis/dashboard/advanced-dashboard.html'
            );

            const dashboardContent = await fs.readFile(dashboardPath, 'utf8');

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(dashboardContent);

        } catch (error) {
            console.error('❌ Erro ao servir dashboard:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro ao carregar dashboard');
        }
    }

    /**
     * Processa requisições da API
     */
    async handleApiRequest(req, res) {
        const url = req.url;
        const method = req.method;

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        try {
            if (method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            // Health check endpoint
            if (url === '/api/health') {
                res.writeHead(200);
                res.end(JSON.stringify({
                    status: 'healthy',
                    uptime: this.startTime ? Date.now() - this.startTime : 0,
                    timestamp: new Date().toISOString()
                }));
                return;
            }

            switch (url) {
                case '/api/status':
                    res.writeHead(200);
                    res.end(JSON.stringify(await this.getFullSystemStatus()));
                    break;

                case '/api/metrics':
                    res.writeHead(200);
                    res.end(JSON.stringify(await this.getSystemMetrics()));
                    break;

                case '/api/agents':
                    res.writeHead(200);
                    res.end(JSON.stringify(this.getAgentsStatus()));
                    break;

                case '/api/workflows':
                    res.writeHead(200);
                    res.end(JSON.stringify(this.getWorkflowsStatus()));
                    break;

                case '/api/optimizations':
                    res.writeHead(200);
                    res.end(JSON.stringify(this.getOptimizationsStatus()));
                    break;

                // Endpoints de Tarefas (PostgreSQL)
                case '/api/tasks':
                    if (method === 'GET') {
                        const tasks = await this.listTasks({ limit: 50 });
                        res.writeHead(200);
                        res.end(JSON.stringify(tasks));
                    } else if (method === 'POST') {
                        let body = '';
                        req.on('data', chunk => body += chunk);
                        req.on('end', async () => {
                            try {
                                const taskData = JSON.parse(body);
                                const task = await this.createTask(taskData);
                                res.writeHead(201);
                                res.end(JSON.stringify(task));
                            } catch (error) {
                                res.writeHead(400);
                                res.end(JSON.stringify({ error: error.message }));
                            }
                        });
                        return;
                    } else {
                        res.writeHead(405);
                        res.end(JSON.stringify({ error: 'Método não permitido' }));
                    }
                    break;

                case '/api/tasks/pending':
                    const pendingTasks = await this.listTasks({ status: 'pending' });
                    res.writeHead(200);
                    res.end(JSON.stringify(pendingTasks));
                    break;

                default:
                    // Verifica se é um endpoint de tarefa específica
                    if (url.startsWith('/api/tasks/') && url.length > 12) {
                        const taskId = url.substring(12);
                        if (method === 'GET') {
                            const task = await this.getTask(taskId);
                            if (task) {
                                res.writeHead(200);
                                res.end(JSON.stringify(task));
                            } else {
                                res.writeHead(404);
                                res.end(JSON.stringify({ error: 'Tarefa não encontrada' }));
                            }
                        } else if (method === 'DELETE') {
                            const cancelled = await this.cancelTask(taskId);
                            if (cancelled) {
                                res.writeHead(200);
                                res.end(JSON.stringify(cancelled));
                            } else {
                                res.writeHead(404);
                                res.end(JSON.stringify({ error: 'Tarefa não encontrada' }));
                            }
                        }
                        return;
                    }
                    res.writeHead(404);
                    res.end(JSON.stringify({ error: 'Endpoint não encontrado' }));
            }

        } catch (error) {
            console.error('❌ Erro na API:', error);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Erro interno da API' }));
        }
    }

    /**
     * Registra todos os agentes no sistema
     */
    async registerAgents() {
        console.log('🤖 Registrando agentes especializados...');

        for (const [agentId, config] of this.agentConfigurations) {
            try {
                // Salva configuração do agente
                const agentConfigPath = path.join(
                    this.config.projectPath,
                    '.lia/agents/genesis/config',
                    `${agentId}-config.json`
                );

                await fs.writeFile(agentConfigPath, JSON.stringify({
                    ...config,
                    registered: new Date().toISOString(),
                    openRouterIntegration: true,
                    systemVersion: '4.1'
                }, null, 2));

                console.log(`✅ Agente registrado: ${config.name}`);

            } catch (error) {
                console.error(`❌ Erro ao registrar agente ${agentId}:`, error);
            }
        }

        console.log(`🎉 ${this.agentConfigurations.size} agentes registrados com sucesso`);
    }

    /**
     * Inicia monitoramento de saúde do sistema
     */
    startHealthMonitoring() {
        setInterval(() => {
            if (!this.isRunning) return;

            this.performHealthCheck();
        }, 30000); // A cada 30 segundos
    }

    /**
     * Executa verificação de saúde
     */
    async performHealthCheck() {
        try {
            const healthStatus = {
                timestamp: Date.now(),
                system: 'healthy',
                components: {}
            };

            for (const [componentName, component] of this.components) {
                const componentHealth = await this.checkComponentHealth(componentName, component);
                healthStatus.components[componentName] = componentHealth;

                if (componentHealth.status !== 'healthy') {
                    healthStatus.system = 'degraded';
                }
            }

            // Salva status de saúde
            const healthPath = path.join(
                this.config.projectPath,
                '.lia/agents/genesis/status/health-status.json'
            );

            await fs.writeFile(healthPath, JSON.stringify(healthStatus, null, 2));

            // Emite evento se houver problemas
            if (healthStatus.system !== 'healthy') {
                this.emit('system:health_warning', healthStatus);
            }

        } catch (error) {
            console.error('❌ Erro na verificação de saúde:', error);
        }
    }

    /**
     * Verifica saúde de um componente específico
     */
    async checkComponentHealth(componentName, component) {
        try {
            const health = {
                status: 'healthy',
                uptime: component.startTime ? Date.now() - component.startTime : 0,
                lastCheck: Date.now()
            };

            // Verificações específicas por componente
            switch (componentName) {
                case 'agentBus':
                    const busMetrics = component.instance.getMetrics();
                    health.activeConnections = busMetrics.system.activeConnections;
                    health.totalMessages = busMetrics.system.totalMessages;
                    break;

                case 'workflowEngine':
                    const workflowMetrics = component.instance.getMetrics();
                    health.activeWorkflows = workflowMetrics.workflows.active;
                    health.totalWorkflows = workflowMetrics.workflows.total;
                    break;

                case 'realTimeMetrics':
                    const metrics = component.instance.getRealtimeMetrics();
                    health.uptime = metrics.uptime;
                    health.alertsActive = metrics.alerts.active;
                    break;

                case 'autoOptimizer':
                    const optMetrics = component.instance.getOptimizationMetrics();
                    health.optimizationsApplied = optMetrics.system.appliedOptimizations;
                    health.optimizationsPending = optMetrics.system.pendingOptimizations;
                    break;
            }

            return health;

        } catch (error) {
            return {
                status: 'error',
                error: error.message,
                lastCheck: Date.now()
            };
        }
    }

    /**
     * Obtém status geral do sistema
     */
    getSystemStatus() {
        const componentStatus = {};

        for (const [componentName, component] of this.components) {
            componentStatus[componentName] = {
                status: component.status,
                uptime: component.startTime ? Date.now() - component.startTime : 0,
                running: component.status === 'running'
            };
        }

        return {
            system: {
                isRunning: this.isRunning,
                uptime: this.startTime ? Date.now() - this.startTime : 0,
                version: '4.1',
                startTime: this.startTime,
                totalComponents: this.components.size,
                runningComponents: Array.from(this.components.values())
                    .filter(c => c.status === 'running').length
            },
            components: componentStatus,
            agents: {
                total: this.agentConfigurations.size,
                configured: this.agentConfigurations.size,
                openRouterIntegration: true
            }
        };
    }

    /**
     * Obtém métricas do sistema
     */
    async getSystemMetrics() {
        const metrics = {
            timestamp: Date.now(),
            system: this.getSystemStatus()
        };

        if (this.realTimeMetrics) {
            metrics.performance = this.realTimeMetrics.getRealtimeMetrics();
        }

        if (this.autoOptimizer) {
            metrics.optimization = this.autoOptimizer.getOptimizationMetrics();
        }

        if (this.agentBus) {
            metrics.communication = this.agentBus.getMetrics();
        }

        if (this.workflowEngine) {
            metrics.workflows = this.workflowEngine.getMetrics();
        }

        return metrics;
    }

    /**
     * Obtém status dos agentes
     */
    getAgentsStatus() {
        const agentsStatus = {};

        for (const [agentId, config] of this.agentConfigurations) {
            agentsStatus[agentId] = {
                name: config.name,
                role: config.role,
                model: config.model,
                maxConcurrency: config.maxConcurrency,
                priority: config.priority,
                capabilities: config.capabilities,
                costLimit: config.costLimit,
                status: 'ready', // Placeholder - integrar com dados reais
                registered: true
            };
        }

        return agentsStatus;
    }

    /**
     * Obtém status dos workflows
     */
    getWorkflowsStatus() {
        if (!this.workflowEngine) {
            return { error: 'WorkflowEngine não inicializado' };
        }

        return this.workflowEngine.getMetrics();
    }

    /**
     * Obtém status das otimizações
     */
    getOptimizationsStatus() {
        if (!this.autoOptimizer) {
            return { error: 'AutoOptimizer não inicializado' };
        }

        return this.autoOptimizer.getOptimizationMetrics();
    }

    /**
     * Salva status do sistema
     */
    async saveSystemStatus() {
        try {
            const status = {
                timestamp: Date.now(),
                status: this.getSystemStatus(),
                metrics: await this.getSystemMetrics()
            };

            const statusPath = path.join(
                this.config.projectPath,
                '.lia/agents/genesis/status/system-status.json'
            );

            await fs.writeFile(statusPath, JSON.stringify(status, null, 2));

        } catch (error) {
            console.error('❌ Erro ao salvar status do sistema:', error);
        }
    }

    /**
     * Executa um workflow específico
     */
    async executeWorkflow(workflowDefinition, context = {}) {
        if (!this.workflowEngine) {
            throw new Error('WorkflowEngine não inicializado');
        }

        // Adiciona contexto de agentes
        const enhancedContext = {
            ...context,
            agentConfigurations: Object.fromEntries(this.agentConfigurations),
            openRouterApiKey: this.config.openRouterApiKey,
            systemVersion: '4.1'
        };

        const workflowId = await this.workflowEngine.createWorkflow(workflowDefinition);
        return await this.workflowEngine.executeWorkflow(workflowId, enhancedContext);
    }

    /**
     * Para todo o sistema enterprise
     */
    async stop() {
        if (!this.isRunning) {
            console.log('⚠️ Sistema já está parado');
            return;
        }

        console.log('🛑 Parando Genesis Enterprise System...');

        try {
            this.isRunning = false;

            // Para componentes em ordem reversa
            const componentOrder = ['httpServer', 'autoOptimizer', 'realTimeMetrics', 'workflowEngine', 'agentBus'];

            for (const componentName of componentOrder) {
                await this.stopComponent(componentName);
            }

            // Salva status final
            await this.saveSystemStatus();

            console.log('✅ Genesis Enterprise System parado com sucesso');
            this.emit('system:stopped');

        } catch (error) {
            console.error('❌ Erro ao parar sistema:', error);
            throw error;
        }
    }

    /**
     * Para um componente específico
     */
    async stopComponent(componentName) {
        const component = this.components.get(componentName);
        if (!component || component.status !== 'running') {
            return;
        }

        try {
            console.log(`🔧 Parando ${componentName}...`);

            switch (componentName) {
                case 'agentBus':
                    await component.instance.stop();
                    break;
                case 'workflowEngine':
                    await component.instance.stop();
                    break;
                case 'realTimeMetrics':
                    await component.instance.stop();
                    break;
                case 'autoOptimizer':
                    await component.instance.stop();
                    break;
                case 'httpServer':
                    component.instance.close();
                    break;
            }

            component.status = 'stopped';
            console.log(`✅ ${componentName} parado com sucesso`);

        } catch (error) {
            component.status = 'error';
            console.error(`❌ Erro ao parar ${componentName}:`, error);
        }
    }

    /**
     * Executa tarefa específica através de um agente
     */
    async executeAgentTask(agentId, task, options = {}) {
        if (!this.agentConfigurations.has(agentId)) {
            throw new Error(`Agente não encontrado: ${agentId}`);
        }

        const agentConfig = this.agentConfigurations.get(agentId);

        // Cria workflow para a tarefa específica
        const workflowDefinition = {
            name: `Task for ${agentConfig.name}`,
            description: `Executa tarefa específica através do agente ${agentId}`,
            steps: [{
                id: 'main_task',
                name: task.name || 'Main Task',
                agent: agentId,
                type: task.type || 'general',
                capabilities: task.capabilities || agentConfig.capabilities,
                files: task.files || [],
                actions: task.actions || [],
                context: task.context || {}
            }],
            metadata: {
                agentId,
                taskType: task.type,
                priority: options.priority || 'normal',
                source: 'direct_execution'
            }
        };

        return await this.executeWorkflow(workflowDefinition, options.context || {});
    }

    /**
     * Obtém informações sobre um agente específico
     */
    getAgentInfo(agentId) {
        const config = this.agentConfigurations.get(agentId);
        if (!config) {
            return null;
        }

        let performance = null;
        if (this.realTimeMetrics) {
            // Obter métricas reais do agente
            performance = this.realTimeMetrics.getRealtimeMetrics().agents[agentId];
        }

        let optimization = null;
        if (this.autoOptimizer) {
            // Obter dados de otimização do agente
            optimization = this.autoOptimizer.getOptimizationMetrics().agents[agentId];
        }

        return {
            configuration: config,
            performance,
            optimization,
            lastUpdated: Date.now()
        };
    }

    /**
     * Registra handlers para processar tarefas do PostgreSQL
     */
    registerAgentHandlers() {
        if (!this.taskProcessor) {
            console.log('⚠️ TaskProcessor não disponível para registrar handlers');
            return;
        }

        console.log('🤖 Registrando handlers dos agentes no TaskProcessor...');

        // Handler genérico para todos os agentes
        const createAgentHandler = (agentId) => {
            return async (task) => {
                console.log(`🎯 ${agentId} processando: ${task.title}`);

                try {
                    // Executa via workflow engine
                    const result = await this.executeAgentTask(agentId, {
                        name: task.title,
                        type: task.type,
                        context: task.context || {}
                    });

                    return {
                        success: true,
                        result: result,
                        filesModified: result?.filesModified || [],
                        commitHash: result?.commitHash || null,
                        tokensUsed: result?.tokensUsed || 0,
                        costUsd: result?.costUsd || 0
                    };

                } catch (error) {
                    console.error(`❌ Erro no agente ${agentId}:`, error.message);
                    throw error;
                }
            };
        };

        // Registra handler para cada agente
        for (const [agentId] of this.agentConfigurations) {
            this.taskProcessor.registerAgentHandler(
                agentId.toUpperCase(),
                createAgentHandler(agentId)
            );
        }

        console.log(`✅ ${this.agentConfigurations.size} handlers registrados`);
    }

    // ==========================================
    // MÉTODOS PARA API DE TAREFAS
    // ==========================================

    /**
     * Cria nova tarefa via API
     */
    async createTask(taskData) {
        if (!this.taskProcessor) {
            throw new Error('TaskProcessor não disponível');
        }
        return await this.taskProcessor.createTask(taskData);
    }

    /**
     * Lista tarefas
     */
    async listTasks(filters = {}) {
        if (!this.taskProcessor) {
            return [];
        }
        return await this.taskProcessor.listTasks(filters);
    }

    /**
     * Obtém tarefa por ID
     */
    async getTask(taskId) {
        if (!this.taskProcessor) {
            return null;
        }
        return await this.taskProcessor.getTask(taskId);
    }

    /**
     * Cancela tarefa
     */
    async cancelTask(taskId) {
        if (!this.taskProcessor) {
            throw new Error('TaskProcessor não disponível');
        }
        return await this.taskProcessor.cancelTask(taskId);
    }

    /**
     * Obtém resumo do sistema com tarefas
     */
    async getFullSystemStatus() {
        const baseStatus = this.getSystemStatus();

        if (this.taskProcessor) {
            try {
                const taskSummary = await this.taskProcessor.getSystemSummary();
                baseStatus.tasks = taskSummary;
            } catch (error) {
                baseStatus.tasks = { error: error.message };
            }
        }

        return baseStatus;
    }
}

module.exports = GenesisEnterpriseSystem;

// Exemplo de uso se executado diretamente
if (require.main === module) {
    const system = new GenesisEnterpriseSystem({
        projectPath: "D:/tributa-ai",
        enableMetrics: true,
        enableOptimization: true,
        enableDashboard: true,
        autoStart: true
    });

    // Handlers de eventos
    system.on('system:started', () => {
        console.log('🎉 Sistema enterprise iniciado e pronto para uso!');
    });

    system.on('system:health_warning', (status) => {
        console.log('⚠️ Aviso de saúde do sistema:', status);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n🛑 Recebido SIGINT, parando sistema...');
        await system.stop();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('\n🛑 Recebido SIGTERM, parando sistema...');
        await system.stop();
        process.exit(0);
    });
}