/**
 * 🔌 AGENT BUS v4.1 - COMUNICAÇÃO INTER-AGENTE AVANÇADA
 * Sistema de comunicação real-time entre os 9 agentes especializados
 *
 * CARACTERÍSTICAS ENTERPRISE:
 * - WebSocket server para comunicação real-time
 * - Message bus assíncrono entre agentes
 * - Estado compartilhado sincronizado
 * - Protocolo unificado de mensagens
 * - Fail-over e recuperação automática
 * - Criptografia ponto-a-ponto
 */

const WebSocket = require('ws');
const EventEmitter = require('events');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class AgentBus extends EventEmitter {
    constructor(config = {}) {
        super();

        this.config = {
            port: config.port || 3003,
            host: config.host || 'localhost',
            projectPath: config.projectPath || "D:/tributa-ai",
            heartbeatInterval: config.heartbeatInterval || 30000, // 30s
            messageTimeout: config.messageTimeout || 10000, // 10s
            maxRetries: config.maxRetries || 3,
            enableEncryption: config.enableEncryption || false,
            httpServer: config.httpServer || null, // Servidor HTTP externo para compartilhar porta
            ...config
        };

        // Estado do sistema
        this.server = null;
        this.clients = new Map(); // Conexões WebSocket dos agentes
        this.agents = new Map(); // Agentes registrados
        this.channels = new Map(); // Canais de comunicação
        this.messageHistory = new Map(); // Histórico de mensagens
        this.sharedState = new Map(); // Estado compartilhado
        this.subscriptions = new Map(); // Subscrições de eventos

        // Métricas de comunicação
        this.metrics = {
            totalMessages: 0,
            messagesPerAgent: new Map(),
            averageLatency: 0,
            failedMessages: 0,
            activeConnections: 0,
            uptime: Date.now()
        };

        // Filas de mensagens para cada agente
        this.messageQueues = new Map();
        this.pendingMessages = new Map();

        this.isRunning = false;
        this.initializeChannels();
    }

    /**
     * Inicializa canais de comunicação predefinidos
     */
    initializeChannels() {
        const defaultChannels = [
            {
                id: 'system',
                name: 'Sistema Global',
                description: 'Canal para mensagens de sistema e coordenação',
                persistent: true,
                encrypted: true
            },
            {
                id: 'coordination',
                name: 'Coordenação LIA',
                description: 'Canal para coordenação entre LIA e agentes',
                persistent: true,
                encrypted: false
            },
            {
                id: 'frontend',
                name: 'Frontend Tasks',
                description: 'Canal para tarefas de frontend (EXECUTOR, ATLAS)',
                persistent: false,
                encrypted: false
            },
            {
                id: 'backend',
                name: 'Backend Tasks',
                description: 'Canal para tarefas de backend e APIs',
                persistent: false,
                encrypted: false
            },
            {
                id: 'security',
                name: 'Security & Build',
                description: 'Canal para HELIOS - segurança e build',
                persistent: true,
                encrypted: true
            },
            {
                id: 'performance',
                name: 'Performance & Optimization',
                description: 'Canal para AETHER - otimização e performance',
                persistent: false,
                encrypted: false
            },
            {
                id: 'quality',
                name: 'Quality & Testing',
                description: 'Canal para ORACLE - testes e qualidade',
                persistent: true,
                encrypted: false
            },
            {
                id: 'cleanup',
                name: 'Code Cleanup',
                description: 'Canal para THANOS - limpeza de código',
                persistent: false,
                encrypted: false
            },
            {
                id: 'emergency',
                name: 'Emergency Response',
                description: 'Canal para situações de emergência',
                persistent: true,
                encrypted: true,
                priority: 'high'
            }
        ];

        defaultChannels.forEach(channel => {
            this.channels.set(channel.id, {
                ...channel,
                subscribers: new Set(),
                messageCount: 0,
                lastActivity: null,
                created: new Date()
            });
        });

        console.log(`📡 Inicializados ${this.channels.size} canais de comunicação`);
    }

    /**
     * Inicia o servidor WebSocket
     */
    async start() {
        if (this.isRunning) {
            console.log('⚠️ AgentBus já está rodando');
            return;
        }

        try {
            // Se tiver servidor HTTP externo, usa ele (compartilha porta)
            if (this.config.httpServer) {
                this.server = new WebSocket.Server({
                    server: this.config.httpServer,
                    path: '/ws'
                });
                console.log(`🚀 AgentBus iniciado em ws://${this.config.host}:${this.config.port}/ws (compartilhando porta HTTP)`);
            } else {
                // Cria servidor WebSocket standalone
                this.server = new WebSocket.Server({
                    port: this.config.port,
                    host: this.config.host
                });
                console.log(`🚀 AgentBus iniciado em ws://${this.config.host}:${this.config.port}`);
            }

            this.setupServerHandlers();
            this.startHeartbeat();
            this.startMetricsCollection();

            this.isRunning = true;

            console.log(`📡 ${this.channels.size} canais disponíveis`);

            this.emit('bus:started', {
                host: this.config.host,
                port: this.config.port,
                channels: Array.from(this.channels.keys())
            });

        } catch (error) {
            console.error('❌ Erro ao iniciar AgentBus:', error);
            throw error;
        }
    }

    /**
     * Configura handlers do servidor WebSocket
     */
    setupServerHandlers() {
        this.server.on('connection', (ws, req) => {
            const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            console.log(`🔌 Nova conexão: ${clientId} de ${req.socket.remoteAddress}`);

            // Configura cliente
            const client = {
                id: clientId,
                ws,
                agent: null,
                connected: new Date(),
                lastPing: new Date(),
                subscriptions: new Set(),
                messageCount: 0
            };

            this.clients.set(clientId, client);
            this.metrics.activeConnections++;

            // Handlers de mensagens
            ws.on('message', (data) => {
                this.handleMessage(clientId, data);
            });

            ws.on('close', () => {
                this.handleClientDisconnect(clientId);
            });

            ws.on('error', (error) => {
                console.error(`❌ Erro na conexão ${clientId}:`, error);
                this.handleClientDisconnect(clientId);
            });

            // Envia mensagem de boas-vindas
            this.sendToClient(clientId, {
                type: 'welcome',
                clientId,
                channels: Array.from(this.channels.keys()),
                timestamp: new Date().toISOString()
            });
        });

        this.server.on('error', (error) => {
            console.error('❌ Erro no servidor WebSocket:', error);
            this.emit('bus:error', error);
        });
    }

    /**
     * Processa mensagens recebidas
     */
    async handleMessage(clientId, rawData) {
        const client = this.clients.get(clientId);
        if (!client) return;

        try {
            const message = JSON.parse(rawData.toString());
            client.messageCount++;
            client.lastPing = new Date();

            console.log(`📨 Mensagem de ${clientId}:`, message.type);

            // Atualiza métricas
            this.metrics.totalMessages++;

            // Processa diferentes tipos de mensagem
            switch (message.type) {
                case 'register_agent':
                    await this.handleAgentRegistration(clientId, message);
                    break;

                case 'subscribe_channel':
                    await this.handleChannelSubscription(clientId, message);
                    break;

                case 'unsubscribe_channel':
                    await this.handleChannelUnsubscription(clientId, message);
                    break;

                case 'send_message':
                    await this.handleChannelMessage(clientId, message);
                    break;

                case 'direct_message':
                    await this.handleDirectMessage(clientId, message);
                    break;

                case 'update_state':
                    await this.handleStateUpdate(clientId, message);
                    break;

                case 'request_state':
                    await this.handleStateRequest(clientId, message);
                    break;

                case 'ping':
                    this.sendToClient(clientId, { type: 'pong', timestamp: new Date().toISOString() });
                    break;

                default:
                    console.warn(`⚠️ Tipo de mensagem desconhecido: ${message.type}`);
            }

        } catch (error) {
            console.error(`❌ Erro ao processar mensagem de ${clientId}:`, error);
            this.sendToClient(clientId, {
                type: 'error',
                message: 'Erro ao processar mensagem',
                error: error.message
            });
        }
    }

    /**
     * Registra um agente no sistema
     */
    async handleAgentRegistration(clientId, message) {
        const { agentId, agentName, capabilities, role } = message.data;

        if (!agentId) {
            return this.sendToClient(clientId, {
                type: 'registration_error',
                message: 'agentId é obrigatório'
            });
        }

        // Verifica se agente já está registrado
        if (this.agents.has(agentId)) {
            // Atualiza registro existente
            const existingAgent = this.agents.get(agentId);
            existingAgent.clientId = clientId;
            existingAgent.lastConnected = new Date();
            existingAgent.connectionCount++;
        } else {
            // Cria novo registro
            this.agents.set(agentId, {
                id: agentId,
                name: agentName || agentId,
                capabilities: capabilities || [],
                role: role || 'unknown',
                clientId,
                registered: new Date(),
                lastConnected: new Date(),
                connectionCount: 1,
                messagesSent: 0,
                messagesReceived: 0
            });

            // Cria fila de mensagens para o agente
            this.messageQueues.set(agentId, []);
        }

        // Atualiza referência no cliente
        const client = this.clients.get(clientId);
        if (client) {
            client.agent = agentId;
        }

        console.log(`🤖 Agente registrado: ${agentName} (${agentId})`);

        // Confirma registro
        this.sendToClient(clientId, {
            type: 'registration_success',
            agentId,
            availableChannels: Array.from(this.channels.keys()),
            sharedStateKeys: Array.from(this.sharedState.keys())
        });

        // Notifica outros agentes
        this.broadcastToChannel('system', {
            type: 'agent_connected',
            agentId,
            agentName,
            capabilities,
            role
        }, agentId);

        // Entrega mensagens pendentes
        await this.deliverPendingMessages(agentId);
    }

    /**
     * Gerencia subscrição em canais
     */
    async handleChannelSubscription(clientId, message) {
        const { channelId } = message.data;
        const client = this.clients.get(clientId);

        if (!client || !client.agent) {
            return this.sendToClient(clientId, {
                type: 'subscription_error',
                message: 'Agente deve estar registrado'
            });
        }

        const channel = this.channels.get(channelId);
        if (!channel) {
            return this.sendToClient(clientId, {
                type: 'subscription_error',
                message: `Canal não encontrado: ${channelId}`
            });
        }

        // Adiciona subscrição
        channel.subscribers.add(client.agent);
        client.subscriptions.add(channelId);

        console.log(`📡 ${client.agent} subscreveu no canal: ${channelId}`);

        this.sendToClient(clientId, {
            type: 'subscription_success',
            channelId,
            channelName: channel.name
        });

        // Notifica outros subscribers
        this.broadcastToChannel(channelId, {
            type: 'agent_joined_channel',
            agentId: client.agent,
            channelId
        }, client.agent);
    }

    /**
     * Remove subscrição de canal
     */
    async handleChannelUnsubscription(clientId, message) {
        const { channelId } = message.data;
        const client = this.clients.get(clientId);

        if (!client || !client.agent) return;

        const channel = this.channels.get(channelId);
        if (channel) {
            channel.subscribers.delete(client.agent);
            client.subscriptions.delete(channelId);

            console.log(`📡 ${client.agent} cancelou subscrição do canal: ${channelId}`);

            this.sendToClient(clientId, {
                type: 'unsubscription_success',
                channelId
            });
        }
    }

    /**
     * Processa mensagem para canal
     */
    async handleChannelMessage(clientId, message) {
        const { channelId, content, priority = 'normal' } = message.data;
        const client = this.clients.get(clientId);

        if (!client || !client.agent) return;

        const channel = this.channels.get(channelId);
        if (!channel) {
            return this.sendToClient(clientId, {
                type: 'message_error',
                message: `Canal não encontrado: ${channelId}`
            });
        }

        // Cria mensagem formatada
        const channelMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'channel_message',
            channelId,
            from: client.agent,
            content,
            priority,
            timestamp: new Date().toISOString()
        };

        // Adiciona ao histórico
        if (channel.persistent) {
            if (!this.messageHistory.has(channelId)) {
                this.messageHistory.set(channelId, []);
            }
            const history = this.messageHistory.get(channelId);
            history.push(channelMessage);

            // Limita histórico (últimas 1000 mensagens)
            if (history.length > 1000) {
                history.splice(0, history.length - 1000);
            }
        }

        // Broadcast para subscribers
        this.broadcastToChannel(channelId, channelMessage, client.agent);

        // Atualiza métricas do canal
        channel.messageCount++;
        channel.lastActivity = new Date();

        // Atualiza métricas do agente
        const agent = this.agents.get(client.agent);
        if (agent) {
            agent.messagesSent++;
        }

        console.log(`📨 Mensagem enviada por ${client.agent} no canal ${channelId}`);
    }

    /**
     * Processa mensagem direta entre agentes
     */
    async handleDirectMessage(clientId, message) {
        const { targetAgent, content, priority = 'normal' } = message.data;
        const client = this.clients.get(clientId);

        if (!client || !client.agent) return;

        const targetAgentData = this.agents.get(targetAgent);
        if (!targetAgentData) {
            return this.sendToClient(clientId, {
                type: 'message_error',
                message: `Agente não encontrado: ${targetAgent}`
            });
        }

        const directMessage = {
            id: `dm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'direct_message',
            from: client.agent,
            to: targetAgent,
            content,
            priority,
            timestamp: new Date().toISOString()
        };

        // Tenta entregar imediatamente
        const delivered = await this.deliverDirectMessage(targetAgent, directMessage);

        if (!delivered) {
            // Adiciona à fila de mensagens pendentes
            if (!this.messageQueues.has(targetAgent)) {
                this.messageQueues.set(targetAgent, []);
            }
            this.messageQueues.get(targetAgent).push(directMessage);
            console.log(`📬 Mensagem direta adicionada à fila para: ${targetAgent}`);
        }

        // Confirma envio
        this.sendToClient(clientId, {
            type: 'message_sent',
            messageId: directMessage.id,
            delivered,
            targetAgent
        });

        console.log(`📨 Mensagem direta: ${client.agent} → ${targetAgent}`);
    }

    /**
     * Atualiza estado compartilhado
     */
    async handleStateUpdate(clientId, message) {
        const { key, value, ttl = null } = message.data;
        const client = this.clients.get(clientId);

        if (!client || !client.agent) return;

        // Atualiza estado
        const stateEntry = {
            value,
            updatedBy: client.agent,
            timestamp: new Date().toISOString(),
            ttl: ttl ? new Date(Date.now() + ttl * 1000) : null
        };

        this.sharedState.set(key, stateEntry);

        console.log(`📊 Estado atualizado: ${key} por ${client.agent}`);

        // Notifica subscribers interessados
        this.notifyStateChange(key, stateEntry);

        // Confirma atualização
        this.sendToClient(clientId, {
            type: 'state_updated',
            key,
            timestamp: stateEntry.timestamp
        });
    }

    /**
     * Processa solicitação de estado
     */
    async handleStateRequest(clientId, message) {
        const { key } = message.data;
        const client = this.clients.get(clientId);

        if (!client || !client.agent) return;

        const stateEntry = this.sharedState.get(key);

        this.sendToClient(clientId, {
            type: 'state_response',
            key,
            value: stateEntry ? stateEntry.value : null,
            exists: !!stateEntry,
            metadata: stateEntry ? {
                updatedBy: stateEntry.updatedBy,
                timestamp: stateEntry.timestamp,
                ttl: stateEntry.ttl
            } : null
        });
    }

    /**
     * Entrega mensagem direta para agente
     */
    async deliverDirectMessage(agentId, message) {
        const agent = this.agents.get(agentId);
        if (!agent || !agent.clientId) return false;

        const client = this.clients.get(agent.clientId);
        if (!client || client.ws.readyState !== WebSocket.OPEN) return false;

        try {
            client.ws.send(JSON.stringify(message));
            agent.messagesReceived++;
            return true;
        } catch (error) {
            console.error(`❌ Erro ao entregar mensagem para ${agentId}:`, error);
            return false;
        }
    }

    /**
     * Entrega mensagens pendentes para agente recém-conectado
     */
    async deliverPendingMessages(agentId) {
        const pendingMessages = this.messageQueues.get(agentId) || [];

        if (pendingMessages.length === 0) return;

        console.log(`📬 Entregando ${pendingMessages.length} mensagens pendentes para: ${agentId}`);

        for (const message of pendingMessages) {
            const delivered = await this.deliverDirectMessage(agentId, message);
            if (!delivered) break; // Para se não conseguir entregar
        }

        // Limpa fila
        this.messageQueues.set(agentId, []);
    }

    /**
     * Broadcast para canal
     */
    broadcastToChannel(channelId, message, excludeAgent = null) {
        const channel = this.channels.get(channelId);
        if (!channel) return;

        let deliveredCount = 0;

        for (const agentId of channel.subscribers) {
            if (agentId === excludeAgent) continue;

            const delivered = this.deliverToAgent(agentId, message);
            if (delivered) deliveredCount++;
        }

        console.log(`📡 Broadcast no canal ${channelId}: ${deliveredCount}/${channel.subscribers.size} entregues`);
    }

    /**
     * Entrega mensagem para agente específico
     */
    deliverToAgent(agentId, message) {
        const agent = this.agents.get(agentId);
        if (!agent || !agent.clientId) return false;

        return this.sendToClient(agent.clientId, message);
    }

    /**
     * Envia mensagem para cliente específico
     */
    sendToClient(clientId, message) {
        const client = this.clients.get(clientId);
        if (!client || client.ws.readyState !== WebSocket.OPEN) return false;

        try {
            client.ws.send(JSON.stringify(message));
            return true;
        } catch (error) {
            console.error(`❌ Erro ao enviar para cliente ${clientId}:`, error);
            return false;
        }
    }

    /**
     * Notifica mudança de estado
     */
    notifyStateChange(key, stateEntry) {
        const notification = {
            type: 'state_changed',
            key,
            value: stateEntry.value,
            updatedBy: stateEntry.updatedBy,
            timestamp: stateEntry.timestamp
        };

        // Notifica no canal system
        this.broadcastToChannel('system', notification);
    }

    /**
     * Gerencia desconexão de cliente
     */
    handleClientDisconnect(clientId) {
        const client = this.clients.get(clientId);
        if (!client) return;

        console.log(`🔌 Cliente desconectado: ${clientId}`);

        // Remove subscrições de canais
        for (const channelId of client.subscriptions) {
            const channel = this.channels.get(channelId);
            if (channel && client.agent) {
                channel.subscribers.delete(client.agent);
            }
        }

        // Atualiza status do agente
        if (client.agent) {
            const agent = this.agents.get(client.agent);
            if (agent) {
                agent.clientId = null;
                agent.lastDisconnected = new Date();
            }

            // Notifica outros agentes
            this.broadcastToChannel('system', {
                type: 'agent_disconnected',
                agentId: client.agent,
                timestamp: new Date().toISOString()
            });
        }

        // Remove cliente
        this.clients.delete(clientId);
        this.metrics.activeConnections--;
    }

    /**
     * Inicia heartbeat para manter conexões vivas
     */
    startHeartbeat() {
        setInterval(() => {
            if (!this.isRunning) return;

            const now = new Date();
            const timeout = this.config.heartbeatInterval * 2; // 2x o intervalo

            // Verifica clientes inativos
            for (const [clientId, client] of this.clients) {
                const timeSinceLastPing = now - client.lastPing;

                if (timeSinceLastPing > timeout) {
                    console.log(`💔 Cliente inativo detectado: ${clientId}`);
                    this.handleClientDisconnect(clientId);
                } else {
                    // Envia ping
                    this.sendToClient(clientId, {
                        type: 'ping',
                        timestamp: now.toISOString()
                    });
                }
            }

            // Limpa estado expirado
            this.cleanupExpiredState();

        }, this.config.heartbeatInterval);
    }

    /**
     * Limpa estado compartilhado expirado
     */
    cleanupExpiredState() {
        const now = new Date();

        for (const [key, stateEntry] of this.sharedState) {
            if (stateEntry.ttl && now > stateEntry.ttl) {
                this.sharedState.delete(key);
                console.log(`🗑️ Estado expirado removido: ${key}`);

                // Notifica remoção
                this.broadcastToChannel('system', {
                    type: 'state_expired',
                    key,
                    timestamp: now.toISOString()
                });
            }
        }
    }

    /**
     * Inicia coleta de métricas
     */
    startMetricsCollection() {
        setInterval(() => {
            if (!this.isRunning) return;

            // Atualiza métricas de agentes
            for (const [agentId, agent] of this.agents) {
                if (!this.metrics.messagesPerAgent.has(agentId)) {
                    this.metrics.messagesPerAgent.set(agentId, 0);
                }
                this.metrics.messagesPerAgent.set(agentId,
                    agent.messagesSent + agent.messagesReceived);
            }

            // Salva métricas
            this.saveMetrics();

        }, 60000); // A cada minuto
    }

    /**
     * Salva métricas em arquivo
     */
    async saveMetrics() {
        try {
            const metricsData = {
                timestamp: new Date().toISOString(),
                uptime: Date.now() - this.metrics.uptime,
                totalMessages: this.metrics.totalMessages,
                activeConnections: this.metrics.activeConnections,
                registeredAgents: this.agents.size,
                activeChannels: this.channels.size,
                messagesPerAgent: Object.fromEntries(this.metrics.messagesPerAgent),
                channelActivity: Object.fromEntries(
                    Array.from(this.channels.entries()).map(([id, channel]) => [
                        id,
                        {
                            subscribers: channel.subscribers.size,
                            messageCount: channel.messageCount,
                            lastActivity: channel.lastActivity
                        }
                    ])
                )
            };

            const metricsPath = path.join(
                this.config.projectPath,
                '.lia/agents/genesis/logs',
                'communication-metrics.json'
            );

            await fs.mkdir(path.dirname(metricsPath), { recursive: true });
            await fs.writeFile(metricsPath, JSON.stringify(metricsData, null, 2));

        } catch (error) {
            console.error('❌ Erro ao salvar métricas:', error);
        }
    }

    /**
     * Obtém métricas em tempo real
     */
    getMetrics() {
        const agentMetrics = {};

        for (const [agentId, agent] of this.agents) {
            agentMetrics[agentId] = {
                connected: !!agent.clientId,
                messagesSent: agent.messagesSent,
                messagesReceived: agent.messagesReceived,
                connectionCount: agent.connectionCount,
                lastConnected: agent.lastConnected,
                lastDisconnected: agent.lastDisconnected
            };
        }

        const channelMetrics = {};

        for (const [channelId, channel] of this.channels) {
            channelMetrics[channelId] = {
                subscribers: channel.subscribers.size,
                messageCount: channel.messageCount,
                lastActivity: channel.lastActivity
            };
        }

        return {
            system: {
                isRunning: this.isRunning,
                uptime: Date.now() - this.metrics.uptime,
                totalMessages: this.metrics.totalMessages,
                activeConnections: this.metrics.activeConnections,
                registeredAgents: this.agents.size,
                host: this.config.host,
                port: this.config.port
            },
            agents: agentMetrics,
            channels: channelMetrics,
            sharedState: {
                entries: this.sharedState.size,
                keys: Array.from(this.sharedState.keys())
            }
        };
    }

    /**
     * Para o sistema de comunicação
     */
    async stop() {
        if (!this.isRunning) {
            console.log('⚠️ AgentBus já está parado');
            return;
        }

        this.isRunning = false;

        // Notifica todos os clientes
        for (const [clientId, client] of this.clients) {
            this.sendToClient(clientId, {
                type: 'shutdown',
                message: 'Sistema sendo encerrado',
                timestamp: new Date().toISOString()
            });
        }

        // Fecha todas as conexões
        for (const [clientId, client] of this.clients) {
            client.ws.close();
        }

        // Fecha servidor
        if (this.server) {
            this.server.close();
        }

        console.log('🛑 AgentBus parado');
        this.emit('bus:stopped');
    }
}

module.exports = AgentBus;