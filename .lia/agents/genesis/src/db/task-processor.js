/**
 * 🔄 Task Processor - Processador de Tarefas do PostgreSQL
 * Integra o sistema de agentes com a fila de tarefas no banco
 *
 * @module TaskProcessor
 * @version 1.0.0
 */

const EventEmitter = require('events');
const PostgresClient = require('./postgres-client.js');

class TaskProcessor extends EventEmitter {
    constructor(config = {}) {
        super();

        this.config = {
            pollInterval: config.pollInterval || 5000, // 5 segundos
            maxConcurrentTasks: config.maxConcurrentTasks || 3,
            taskTimeout: config.taskTimeout || 300000, // 5 minutos
            ...config
        };

        this.db = null;
        this.isProcessing = false;
        this.pollTimer = null;
        this.activeTasks = new Map();
        this.agentHandlers = new Map();
    }

    /**
     * Inicializa o processador
     */
    async initialize(databaseUrl = null) {
        console.log('🔄 Inicializando Task Processor...');

        try {
            // Conectar ao PostgreSQL
            this.db = new PostgresClient({
                connectionString: databaseUrl || process.env.DATABASE_URL
            });

            await this.db.connect();

            // Configurar event listeners
            this.setupEventListeners();

            console.log('✅ Task Processor inicializado');
            return true;

        } catch (error) {
            console.error('❌ Erro ao inicializar Task Processor:', error.message);
            throw error;
        }
    }

    /**
     * Configura listeners de eventos
     */
    setupEventListeners() {
        this.db.on('taskCreated', (task) => {
            console.log(`📋 Nova tarefa criada: ${task.title}`);
            this.emit('taskCreated', task);

            // Dispara processamento se não estiver rodando
            if (!this.isProcessing) {
                this.processNextTask();
            }
        });

        this.db.on('taskCompleted', (task) => {
            console.log(`✅ Tarefa concluída: ${task.title}`);
            this.activeTasks.delete(task.id);
            this.emit('taskCompleted', task);
        });

        this.db.on('taskFailed', (task) => {
            console.warn(`❌ Tarefa falhou: ${task.title}`);
            this.activeTasks.delete(task.id);
            this.emit('taskFailed', task);
        });
    }

    /**
     * Registra handler para um tipo de agente
     */
    registerAgentHandler(agentName, handler) {
        this.agentHandlers.set(agentName.toUpperCase(), handler);
        console.log(`🤖 Handler registrado para agente: ${agentName}`);
    }

    /**
     * Inicia o processamento de tarefas
     */
    async startProcessing() {
        if (this.isProcessing) {
            console.log('⚠️ Processamento já está ativo');
            return;
        }

        console.log('🚀 Iniciando processamento de tarefas...');
        this.isProcessing = true;

        // Inicia poll timer
        this.pollTimer = setInterval(() => {
            this.processNextTask();
        }, this.config.pollInterval);

        // Processa primeira tarefa imediatamente
        await this.processNextTask();

        this.emit('processingStarted');
    }

    /**
     * Para o processamento
     */
    async stopProcessing() {
        console.log('🛑 Parando processamento de tarefas...');

        this.isProcessing = false;

        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }

        // Aguarda tarefas ativas finalizarem (com timeout)
        const timeout = 30000; // 30 segundos
        const start = Date.now();

        while (this.activeTasks.size > 0 && Date.now() - start < timeout) {
            console.log(`⏳ Aguardando ${this.activeTasks.size} tarefas ativas...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.emit('processingStopped');
        console.log('✅ Processamento parado');
    }

    /**
     * Processa próxima tarefa da fila
     */
    async processNextTask() {
        // Verifica se pode processar mais
        if (this.activeTasks.size >= this.config.maxConcurrentTasks) {
            return;
        }

        try {
            // Busca próxima tarefa
            const task = await this.db.getNextTask();

            if (!task) {
                return; // Nenhuma tarefa pendente
            }

            console.log(`🎯 Processando tarefa: ${task.title} (${task.type})`);

            // Marca como ativa
            this.activeTasks.set(task.id, {
                task,
                startTime: Date.now()
            });

            // Processa a tarefa
            this.executeTask(task);

        } catch (error) {
            console.error('❌ Erro ao buscar próxima tarefa:', error.message);
        }
    }

    /**
     * Executa uma tarefa
     */
    async executeTask(task) {
        const startTime = Date.now();

        try {
            // Determina qual agente deve processar
            const agentName = task.assigned_agent || this.selectAgentForTask(task);

            // Busca handler do agente
            const handler = this.agentHandlers.get(agentName);

            if (!handler) {
                throw new Error(`Nenhum handler registrado para agente: ${agentName}`);
            }

            // Executa com timeout
            const result = await Promise.race([
                handler(task),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), this.config.taskTimeout)
                )
            ]);

            // Completa tarefa
            const processingTime = Date.now() - startTime;
            await this.db.completeTask(
                task.id,
                typeof result === 'string' ? result : JSON.stringify(result),
                result.filesModified || [],
                result.commitHash || null,
                result.tokensUsed || 0,
                result.costUsd || 0
            );

            console.log(`✅ Tarefa completada em ${processingTime}ms: ${task.title}`);

        } catch (error) {
            console.error(`❌ Erro na tarefa ${task.id}:`, error.message);

            await this.db.failTask(task.id, error.message);
        }

        // Remove das ativas
        this.activeTasks.delete(task.id);

        // Processa próxima
        if (this.isProcessing) {
            setImmediate(() => this.processNextTask());
        }
    }

    /**
     * Seleciona agente baseado no tipo de tarefa
     */
    selectAgentForTask(task) {
        const typeToAgent = {
            'code': 'EXECUTOR',
            'design': 'ATLAS',
            'test': 'ORACLE',
            'refactor': 'THANOS',
            'security': 'HELIOS',
            'architecture': 'NEXUS',
            'performance': 'AETHER',
            'coordination': 'LIA',
            'general': 'GENESIS'
        };

        return typeToAgent[task.type] || 'GENESIS';
    }

    // ==========================================
    // MÉTODOS PÚBLICOS PARA CRIAR TAREFAS
    // ==========================================

    /**
     * Cria nova tarefa
     */
    async createTask(task) {
        return await this.db.createTask(task);
    }

    /**
     * Lista tarefas
     */
    async listTasks(filters = {}) {
        return await this.db.listTasks(filters);
    }

    /**
     * Obtém tarefa por ID
     */
    async getTask(taskId) {
        return await this.db.getTask(taskId);
    }

    /**
     * Cancela tarefa
     */
    async cancelTask(taskId) {
        return await this.db.cancelTask(taskId);
    }

    /**
     * Obtém contagem de tarefas pendentes
     */
    async getPendingCount() {
        return await this.db.countPendingTasks();
    }

    /**
     * Obtém resumo do sistema
     */
    async getSystemSummary() {
        const summary = await this.db.getSystemSummary();
        summary.processor = {
            isProcessing: this.isProcessing,
            activeTasks: this.activeTasks.size,
            maxConcurrent: this.config.maxConcurrentTasks,
            registeredAgents: Array.from(this.agentHandlers.keys())
        };
        return summary;
    }

    /**
     * Cria log
     */
    async log(agentName, action, details = {}, level = 'info', taskId = null) {
        return await this.db.createLog(agentName, action, details, level, taskId);
    }

    /**
     * Lista logs
     */
    async listLogs(filters = {}) {
        return await this.db.listLogs(filters);
    }

    /**
     * Health check
     */
    async healthCheck() {
        const dbHealth = await this.db.healthCheck();

        return {
            processor: {
                isProcessing: this.isProcessing,
                activeTasks: this.activeTasks.size,
                maxConcurrent: this.config.maxConcurrentTasks
            },
            database: dbHealth,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Fecha conexões
     */
    async close() {
        await this.stopProcessing();

        if (this.db) {
            await this.db.disconnect();
        }
    }
}

module.exports = TaskProcessor;
