#!/usr/bin/env node

/**
 * 🚀 GENESIS BACKGROUND SERVICE - Tributa.AI
 * 
 * Script para rodar o Genesis LIA em background através do Cursor
 * Integra com o repositório remoto e executa tarefas autônomas
 * 
 * @version 1.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const { RealGenesisAgent } = require('./real-genesis.js');

class GenesisBackgroundService {
  constructor() {
    this.serviceName = 'GENESIS-BACKGROUND';
    this.version = '1.0.0';
    this.projectRoot = path.resolve(__dirname, '../../..');
    this.serviceFile = path.join(__dirname, 'status', 'background-service.json');
    this.logFile = path.join(__dirname, 'logs', 'background-service.log');
    this.pidFile = path.join(__dirname, 'status', 'service.pid');
    
    this.isRunning = false;
    this.genesisAgent = null;
    this.healthCheckInterval = null;
    this.taskProcessorInterval = null;
  }

  async initialize() {
    try {
      console.log('🚀 GENESIS BACKGROUND SERVICE: Inicializando...');
      
      // Criar diretórios necessários
      await this.ensureDirectories();
      
      // Inicializar agente Genesis
      this.genesisAgent = new RealGenesisAgent();
      const genesisInitialized = await this.genesisAgent.initialize();
      
      if (!genesisInitialized) {
        throw new Error('Falha ao inicializar Genesis Agent');
      }
      
      // Salvar PID do processo
      await this.savePID();
      
      // Configurar handlers de sinal
      this.setupSignalHandlers();
      
      // Inicializar status do serviço
      await this.updateServiceStatus('initialized', 'Serviço inicializado com sucesso');
      
      console.log('✅ GENESIS BACKGROUND SERVICE: Inicialização completa');
      return true;
      
    } catch (error) {
      console.error('❌ GENESIS BACKGROUND SERVICE: Erro na inicialização:', error);
      return false;
    }
  }

  async ensureDirectories() {
    const dirs = [
      path.join(__dirname, 'logs'),
      path.join(__dirname, 'status'),
      path.join(__dirname, 'tasks'),
      path.join(__dirname, 'backups'),
      path.join(__dirname, 'config')
    ];

    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
        console.log(`📁 Diretório criado: ${dir}`);
      }
    }
  }

  async savePID() {
    const pidData = {
      pid: process.pid,
      startTime: new Date().toISOString(),
      service: this.serviceName,
      version: this.version
    };
    
    await fs.writeFile(this.pidFile, JSON.stringify(pidData, null, 2));
    console.log(`📝 PID salvo: ${process.pid}`);
  }

  setupSignalHandlers() {
    process.on('SIGINT', async () => {
      console.log('\n🛑 SIGINT recebido, parando serviço...');
      await this.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 SIGTERM recebido, parando serviço...');
      await this.stop();
      process.exit(0);
    });

    process.on('uncaughtException', async (error) => {
      console.error('❌ Erro não capturado:', error);
      await this.log(`FATAL ERROR: ${error.message}`, 'FATAL');
      await this.stop();
      process.exit(1);
    });

    process.on('unhandledRejection', async (reason, promise) => {
      console.error('❌ Promise rejeitada:', reason);
      await this.log(`UNHANDLED REJECTION: ${reason}`, 'ERROR');
    });
  }

  async log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] [${this.serviceName}] ${message}\n`;
    
    try {
      await fs.appendFile(this.logFile, logEntry);
      console.log(`📝 ${this.serviceName} [${level}]: ${message}`);
    } catch (error) {
      console.error('❌ Erro ao escrever log:', error);
    }
  }

  async updateServiceStatus(status, message, additionalData = {}) {
    const serviceData = {
      serviceName: this.serviceName,
      version: this.version,
      status: status,
      message: message,
      timestamp: new Date().toISOString(),
      pid: process.pid,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      ...additionalData
    };

    try {
      await fs.writeFile(this.serviceFile, JSON.stringify(serviceData, null, 2));
      await this.log(`Status atualizado: ${status} - ${message}`);
    } catch (error) {
      console.error('❌ Erro ao atualizar status do serviço:', error);
    }
  }

  async startBackgroundService() {
    if (this.isRunning) {
      await this.log('⚠️ Serviço já está executando', 'WARN');
      return;
    }

    this.isRunning = true;
    await this.updateServiceStatus('running', 'Serviço em execução em background');
    await this.log('🚀 Iniciando execução em background...');

    // Iniciar Genesis Agent
    if (this.genesisAgent && typeof this.genesisAgent.start === 'function') {
      try {
        // Executar Genesis em background (não await para não bloquear)
        this.genesisAgent.start().catch(error => {
          this.log(`❌ Erro no Genesis Agent: ${error.message}`, 'ERROR');
        });
      } catch (error) {
        await this.log(`❌ Erro ao iniciar Genesis Agent: ${error.message}`, 'ERROR');
      }
    }

    // Health check a cada 30 segundos
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30000);

    // Processar tarefas a cada 10 segundos
    this.taskProcessorInterval = setInterval(async () => {
      await this.processBackgroundTasks();
    }, 10000);

    await this.log('✅ Serviço em background iniciado com sucesso');
  }

  async performHealthCheck() {
    try {
      const health = {
        timestamp: new Date().toISOString(),
        status: 'healthy',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        genesisAgentRunning: this.genesisAgent && this.genesisAgent.isRunning,
        checks: {
          configAccessible: await this.checkConfigAccess(),
          logsWritable: await this.checkLogAccess(),
          taskQueueAccessible: await this.checkTaskQueueAccess()
        }
      };

      await fs.writeFile(
        path.join(__dirname, 'status', 'health.json'),
        JSON.stringify(health, null, 2)
      );

      // Log apenas se houver problemas
      const hasIssues = Object.values(health.checks).some(check => !check);
      if (hasIssues) {
        await this.log('⚠️ Problemas detectados no health check', 'WARN');
      }

    } catch (error) {
      await this.log(`❌ Erro no health check: ${error.message}`, 'ERROR');
    }
  }

  async checkConfigAccess() {
    try {
      await fs.access(path.join(__dirname, 'config'));
      return true;
    } catch {
      return false;
    }
  }

  async checkLogAccess() {
    try {
      await fs.access(this.logFile);
      return true;
    } catch {
      return false;
    }
  }

  async checkTaskQueueAccess() {
    try {
      await fs.access(path.join(__dirname, 'tasks'));
      return true;
    } catch {
      return false;
    }
  }

  async processBackgroundTasks() {
    try {
      // Verificar se há tarefas pendentes para o Genesis
      const taskQueueFile = path.join(__dirname, 'tasks', 'task-queue.json');
      
      try {
        const queueData = await fs.readFile(taskQueueFile, 'utf8');
        const queue = JSON.parse(queueData);
        
        if (queue.tasks && queue.tasks.length > 0) {
          const pendingTasks = queue.tasks.filter(task => task.status === 'pending');
          
          if (pendingTasks.length > 0) {
            await this.log(`📋 ${pendingTasks.length} tarefas pendentes encontradas`);
            
            // Processar através do Genesis Agent
            if (this.genesisAgent && typeof this.genesisAgent.processTaskQueue === 'function') {
              await this.genesisAgent.processTaskQueue();
            }
          }
        }
      } catch (error) {
        // Arquivo não existe ou está vazio, criar um vazio
        await fs.writeFile(taskQueueFile, JSON.stringify({ tasks: [] }, null, 2));
      }

    } catch (error) {
      await this.log(`❌ Erro ao processar tarefas em background: ${error.message}`, 'ERROR');
    }
  }

  async addTask(task) {
    try {
      const taskQueueFile = path.join(__dirname, 'tasks', 'task-queue.json');
      
      let queue = { tasks: [] };
      try {
        const queueData = await fs.readFile(taskQueueFile, 'utf8');
        queue = JSON.parse(queueData);
      } catch {
        // Arquivo não existe, usar queue vazia
      }

      // Adicionar nova tarefa
      const newTask = {
        id: `task-${Date.now()}`,
        ...task,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      queue.tasks.push(newTask);
      
      await fs.writeFile(taskQueueFile, JSON.stringify(queue, null, 2));
      await this.log(`📝 Tarefa adicionada à fila: ${newTask.type} - ${newTask.description}`);
      
      return newTask.id;
    } catch (error) {
      await this.log(`❌ Erro ao adicionar tarefa: ${error.message}`, 'ERROR');
      return null;
    }
  }

  async stop() {
    if (!this.isRunning) {
      await this.log('⚠️ Serviço já está parado', 'WARN');
      return;
    }

    await this.log('🛑 Parando serviço em background...');
    this.isRunning = false;

    // Parar intervalos
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    if (this.taskProcessorInterval) {
      clearInterval(this.taskProcessorInterval);
      this.taskProcessorInterval = null;
    }

    // Parar Genesis Agent
    if (this.genesisAgent && typeof this.genesisAgent.stop === 'function') {
      await this.genesisAgent.stop();
    }

    // Remover PID file
    try {
      await fs.unlink(this.pidFile);
    } catch {
      // Arquivo pode não existir
    }

    await this.updateServiceStatus('stopped', 'Serviço parado pelo usuário');
    await this.log('✅ Serviço parado com sucesso');
  }

  // Métodos de conveniência para adicionar tarefas específicas
  async addErrorCorrectionTask(description, data = {}) {
    return await this.addTask({
      type: 'error_correction',
      description: description,
      data: data
    });
  }

  async addOptimizationTask(description, data = {}) {
    return await this.addTask({
      type: 'performance_optimization',
      description: description,
      data: data
    });
  }

  async addCodeGenerationTask(description, data = {}) {
    return await this.addTask({
      type: 'code_generation',
      description: description,
      data: data
    });
  }

  async addStyleFixTask(description, data = {}) {
    return await this.addTask({
      type: 'style_fix',
      description: description,
      data: data
    });
  }

  async getServiceStatus() {
    try {
      const statusData = await fs.readFile(this.serviceFile, 'utf8');
      return JSON.parse(statusData);
    } catch {
      return null;
    }
  }

  async getServiceHealth() {
    try {
      const healthData = await fs.readFile(
        path.join(__dirname, 'status', 'health.json'),
        'utf8'
      );
      return JSON.parse(healthData);
    } catch {
      return null;
    }
  }
}

// Função principal para iniciar o serviço
async function startService() {
  const service = new GenesisBackgroundService();
  
  const initialized = await service.initialize();
  if (!initialized) {
    console.error('❌ Falha na inicialização do serviço');
    process.exit(1);
  }

  await service.startBackgroundService();
  
  // Manter o processo vivo
  console.log('🔄 Serviço em execução. Pressione Ctrl+C para parar.');
  
  // Adicionar algumas tarefas de exemplo
  setTimeout(async () => {
    await service.addErrorCorrectionTask('Verificar erros TypeScript');
    await service.addOptimizationTask('Otimizar bundle size');
    await service.addStyleFixTask('Corrigir problemas de CSS');
  }, 5000);
}

// Função para parar o serviço
async function stopService() {
  try {
    const pidFile = path.join(__dirname, 'status', 'service.pid');
    const pidData = JSON.parse(await fs.readFile(pidFile, 'utf8'));
    
    console.log(`🛑 Parando serviço PID: ${pidData.pid}`);
    process.kill(pidData.pid, 'SIGTERM');
    
  } catch (error) {
    console.error('❌ Erro ao parar serviço:', error.message);
  }
}

// Executar baseado nos argumentos
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      startService().catch(console.error);
      break;
    case 'stop':
      stopService().catch(console.error);
      break;
    case 'status':
      // Implementar comando de status
      console.log('📊 Verificando status do serviço...');
      break;
    default:
      console.log(`
🚀 GENESIS BACKGROUND SERVICE

Uso:
  node start-genesis-background.js start   - Iniciar serviço em background
  node start-genesis-background.js stop    - Parar serviço
  node start-genesis-background.js status  - Verificar status

Exemplos:
  # Iniciar em background
  node .lia/cloud/genesis/start-genesis-background.js start

  # Parar serviço
  node .lia/cloud/genesis/start-genesis-background.js stop
      `);
  }
}

module.exports = { GenesisBackgroundService };
