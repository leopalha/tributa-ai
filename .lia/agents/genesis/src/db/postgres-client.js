/**
 * 🗄️ PostgreSQL Client para Sistema de Agentes LIA v4.1
 * Gerencia conexão com Railway PostgreSQL para task queue e logs
 *
 * @module PostgresClient
 * @version 1.0.0
 */

const { Pool } = require('pg');
const EventEmitter = require('events');

class PostgresClient extends EventEmitter {
    constructor(config = {}) {
        super();

        this.config = {
            connectionString: config.connectionString || process.env.DATABASE_URL,
            max: config.max || 10, // máximo de conexões no pool
            idleTimeoutMillis: config.idleTimeoutMillis || 30000,
            connectionTimeoutMillis: config.connectionTimeoutMillis || 5000,
            ...config
        };

        this.pool = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    /**
     * Inicializa conexão com o banco
     */
    async connect() {
        try {
            console.log('🗄️ Conectando ao PostgreSQL Railway...');

            // Configuração SSL para Railway
            const poolConfig = {
                connectionString: this.config.connectionString,
                max: this.config.max,
                idleTimeoutMillis: this.config.idleTimeoutMillis,
                connectionTimeoutMillis: this.config.connectionTimeoutMillis,
                ssl: {
                    rejectUnauthorized: false // Railway requer isso
                }
            };

            this.pool = new Pool(poolConfig);

            // Testar conexão
            const client = await this.pool.connect();
            const result = await client.query('SELECT NOW() as now');
            client.release();

            this.isConnected = true;
            this.reconnectAttempts = 0;

            console.log(`✅ PostgreSQL conectado: ${result.rows[0].now}`);

            // Event handlers
            this.pool.on('error', (err) => {
                console.error('❌ Erro no pool PostgreSQL:', err);
                this.emit('error', err);
                this.handleDisconnect();
            });

            this.pool.on('connect', () => {
                console.log('🔌 Nova conexão estabelecida no pool');
            });

            this.emit('connected');
            return true;

        } catch (error) {
            console.error('❌ Erro ao conectar PostgreSQL:', error.message);
            this.isConnected = false;
            this.emit('error', error);
            throw error;
        }
    }

    /**
     * Tenta reconectar em caso de desconexão
     */
    async handleDisconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('❌ Máximo de tentativas de reconexão atingido');
            this.emit('maxReconnectAttemptsReached');
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

        console.log(`🔄 Tentando reconectar em ${delay / 1000}s (tentativa ${this.reconnectAttempts})...`);

        setTimeout(async () => {
            try {
                await this.connect();
            } catch (error) {
                this.handleDisconnect();
            }
        }, delay);
    }

    /**
     * Fecha conexão
     */
    async disconnect() {
        if (this.pool) {
            await this.pool.end();
            this.isConnected = false;
            console.log('🔌 PostgreSQL desconectado');
            this.emit('disconnected');
        }
    }

    /**
     * Executa query genérica
     */
    async query(text, params = []) {
        if (!this.isConnected) {
            throw new Error('PostgreSQL não conectado');
        }

        try {
            const start = Date.now();
            const result = await this.pool.query(text, params);
            const duration = Date.now() - start;

            if (duration > 1000) {
                console.warn(`⚠️ Query lenta (${duration}ms):`, text.substring(0, 100));
            }

            return result;
        } catch (error) {
            console.error('❌ Erro na query:', error.message);
            throw error;
        }
    }

    // ==========================================
    // MÉTODOS PARA TASKS
    // ==========================================

    /**
     * Cria nova tarefa
     */
    async createTask(task) {
        const {
            title,
            description,
            type = 'general',
            priority = 'medium',
            expectedOutput = null,
            assignedAgent = null,
            context = {}
        } = task;

        // Validação: title é obrigatório, usar description como fallback
        const taskTitle = title || description || 'Tarefa sem título';

        // Garantir que description não seja null
        const taskDescription = description || title || 'Sem descrição';

        const result = await this.query(`
            INSERT INTO agent_tasks
                (title, description, type, priority, expected_output, assigned_agent, context)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [taskTitle, taskDescription, type, priority, expectedOutput, assignedAgent, JSON.stringify(context)]);

        const newTask = result.rows[0];

        // Log da criação
        await this.createLog('SYSTEM', 'TASK_CREATED', {
            taskId: newTask.id,
            title: newTask.title,
            type: newTask.type,
            priority: newTask.priority
        }, 'info', newTask.id);

        this.emit('taskCreated', newTask);
        return newTask;
    }

    /**
     * Obtém próxima tarefa pendente (por prioridade)
     */
    async getNextTask(agentName = null) {
        const result = await this.query('SELECT get_next_task($1)', [agentName]);
        const taskId = result.rows[0]?.get_next_task;

        if (!taskId) {
            return null;
        }

        // Busca tarefa completa
        const taskResult = await this.query('SELECT * FROM agent_tasks WHERE id = $1', [taskId]);
        const task = taskResult.rows[0];

        if (task) {
            this.emit('taskStarted', task);
        }

        return task;
    }

    /**
     * Completa uma tarefa
     */
    async completeTask(taskId, result, filesModified = [], commitHash = null, tokensUsed = 0, costUsd = 0) {
        const success = await this.query(
            'SELECT complete_task($1, $2, $3, $4, $5, $6)',
            [taskId, result, filesModified, commitHash, tokensUsed, costUsd]
        );

        // Busca tarefa atualizada
        const taskResult = await this.query('SELECT * FROM agent_tasks WHERE id = $1', [taskId]);
        const task = taskResult.rows[0];

        if (task) {
            // Log da conclusão
            await this.createLog(task.assigned_agent || 'SYSTEM', 'TASK_COMPLETED', {
                taskId: task.id,
                title: task.title,
                processingTimeMs: task.processing_time_ms,
                tokensUsed,
                costUsd
            }, 'info', taskId);

            this.emit('taskCompleted', task);
        }

        return task;
    }

    /**
     * Falha uma tarefa
     */
    async failTask(taskId, error) {
        await this.query('SELECT fail_task($1, $2)', [taskId, error]);

        // Busca tarefa atualizada
        const taskResult = await this.query('SELECT * FROM agent_tasks WHERE id = $1', [taskId]);
        const task = taskResult.rows[0];

        if (task) {
            // Log do erro
            await this.createLog(task.assigned_agent || 'SYSTEM', 'TASK_FAILED', {
                taskId: task.id,
                title: task.title,
                error
            }, 'error', taskId);

            this.emit('taskFailed', task);
        }

        return task;
    }

    /**
     * Lista tarefas com filtros
     */
    async listTasks(filters = {}) {
        const {
            status = null,
            type = null,
            priority = null,
            agent = null,
            limit = 50,
            offset = 0
        } = filters;

        let query = 'SELECT * FROM agent_tasks WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (status) {
            query += ` AND status = $${paramIndex++}`;
            params.push(status);
        }

        if (type) {
            query += ` AND type = $${paramIndex++}`;
            params.push(type);
        }

        if (priority) {
            query += ` AND priority = $${paramIndex++}`;
            params.push(priority);
        }

        if (agent) {
            query += ` AND assigned_agent = $${paramIndex++}`;
            params.push(agent);
        }

        query += ` ORDER BY
            CASE priority
                WHEN 'critical' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                WHEN 'low' THEN 4
            END,
            created_at DESC
            LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
        params.push(limit, offset);

        const result = await this.query(query, params);
        return result.rows;
    }

    /**
     * Obtém tarefa por ID
     */
    async getTask(taskId) {
        // Validar formato UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (!taskId || !uuidRegex.test(taskId)) {
            console.error(`❌ UUID inválido recebido: "${taskId}"`);
            return null;
        }

        const result = await this.query('SELECT * FROM agent_tasks WHERE id = $1', [taskId]);
        return result.rows[0] || null;
    }

    /**
     * Cancela uma tarefa
     */
    async cancelTask(taskId) {
        const result = await this.query(`
            UPDATE agent_tasks
            SET status = 'cancelled', completed_at = NOW()
            WHERE id = $1 AND status IN ('pending', 'in_progress')
            RETURNING *
        `, [taskId]);

        const task = result.rows[0];

        if (task) {
            await this.createLog('SYSTEM', 'TASK_CANCELLED', {
                taskId: task.id,
                title: task.title
            }, 'warn', taskId);

            this.emit('taskCancelled', task);
        }

        return task;
    }

    /**
     * Conta tarefas pendentes
     */
    async countPendingTasks() {
        const result = await this.query(`
            SELECT
                COUNT(*) FILTER (WHERE status = 'pending') as pending,
                COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
                COUNT(*) FILTER (WHERE priority = 'critical' AND status = 'pending') as critical
            FROM agent_tasks
        `);
        return result.rows[0];
    }

    // ==========================================
    // MÉTODOS PARA LOGS
    // ==========================================

    /**
     * Cria log de atividade
     */
    async createLog(agentName, action, details = {}, level = 'info', taskId = null) {
        const result = await this.query(`
            INSERT INTO agent_logs (agent_name, action, details, level, task_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [agentName, action, JSON.stringify(details), level, taskId]);

        const log = result.rows[0];
        this.emit('logCreated', log);
        return log;
    }

    /**
     * Lista logs com filtros
     */
    async listLogs(filters = {}) {
        const {
            agent = null,
            level = null,
            taskId = null,
            limit = 100,
            offset = 0,
            since = null
        } = filters;

        let query = 'SELECT * FROM agent_logs WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (agent) {
            query += ` AND agent_name = $${paramIndex++}`;
            params.push(agent);
        }

        if (level) {
            query += ` AND level = $${paramIndex++}`;
            params.push(level);
        }

        if (taskId) {
            query += ` AND task_id = $${paramIndex++}`;
            params.push(taskId);
        }

        if (since) {
            query += ` AND created_at >= $${paramIndex++}`;
            params.push(since);
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
        params.push(limit, offset);

        const result = await this.query(query, params);
        return result.rows;
    }

    // ==========================================
    // MÉTODOS PARA MÉTRICAS
    // ==========================================

    /**
     * Obtém status de todos os agentes
     */
    async getAgentStatus() {
        const result = await this.query('SELECT * FROM v_agent_status');
        return result.rows;
    }

    /**
     * Obtém métricas de um agente específico
     */
    async getAgentMetrics(agentName, periodHours = 24) {
        const result = await this.query(`
            SELECT
                $1 as agent_name,
                COUNT(*) FILTER (WHERE status = 'completed') as tasks_completed,
                COUNT(*) FILTER (WHERE status = 'failed') as tasks_failed,
                COUNT(*) FILTER (WHERE status = 'in_progress') as tasks_in_progress,
                ROUND(AVG(processing_time_ms)::numeric, 2) as avg_processing_ms,
                SUM(tokens_used) as total_tokens,
                SUM(cost_usd) as total_cost_usd,
                ROUND(
                    (COUNT(*) FILTER (WHERE status = 'completed')::decimal /
                    NULLIF(COUNT(*) FILTER (WHERE status IN ('completed', 'failed')), 0) * 100)::numeric,
                    2
                ) as success_rate
            FROM agent_tasks
            WHERE assigned_agent = $1
              AND created_at >= NOW() - INTERVAL '1 hour' * $2
        `, [agentName, periodHours]);

        return result.rows[0];
    }

    /**
     * Obtém resumo geral do sistema
     */
    async getSystemSummary() {
        const [tasks, agents, recentLogs] = await Promise.all([
            this.countPendingTasks(),
            this.getAgentStatus(),
            this.listLogs({ limit: 10 })
        ]);

        return {
            tasks,
            agents,
            recentLogs,
            timestamp: new Date().toISOString()
        };
    }

    // ==========================================
    // MÉTODOS PARA HEALTH CHECK
    // ==========================================

    /**
     * Verifica saúde da conexão
     */
    async healthCheck() {
        try {
            const start = Date.now();
            await this.query('SELECT 1');
            const latency = Date.now() - start;

            return {
                healthy: true,
                latency,
                poolSize: this.pool.totalCount,
                idleConnections: this.pool.idleCount,
                waitingConnections: this.pool.waitingCount
            };
        } catch (error) {
            return {
                healthy: false,
                error: error.message
            };
        }
    }
}

module.exports = PostgresClient;
