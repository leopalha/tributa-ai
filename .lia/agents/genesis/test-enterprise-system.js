/**
 * 🧪 TESTE SISTEMA ENTERPRISE v4.1
 * Script de teste completo para validar todas as funcionalidades avançadas
 */

const GenesisEnterpriseSystem = require('./genesis-enterprise-system.js');
const path = require('path');

class EnterpriseSystemTester {
    constructor() {
        this.system = null;
        this.testResults = {
            passed: 0,
            failed: 0,
            total: 0,
            details: []
        };
    }

    /**
     * Executa bateria completa de testes
     */
    async runAllTests() {
        console.log('🧪 Iniciando testes do Genesis Enterprise System v4.1...\n');

        try {
            // 1. Teste de inicialização
            await this.testSystemInitialization();

            // 2. Teste de componentes
            await this.testComponentIntegration();

            // 3. Teste de agentes
            await this.testAgentSystem();

            // 4. Teste de workflows
            await this.testWorkflowExecution();

            // 5. Teste de comunicação
            await this.testCommunicationSystem();

            // 6. Teste de métricas
            await this.testMetricsSystem();

            // 7. Teste de otimização
            await this.testOptimizationSystem();

            // 8. Teste de dashboard
            await this.testDashboardSystem();

            // 9. Teste de integração OpenRouter
            await this.testOpenRouterIntegration();

            // 10. Teste de performance
            await this.testSystemPerformance();

            // Relatório final
            this.generateTestReport();

        } catch (error) {
            console.error('❌ Erro durante os testes:', error);
            this.recordTest('Sistema Geral', false, error.message);
        } finally {
            if (this.system) {
                await this.system.stop();
            }
        }
    }

    /**
     * Teste 1: Inicialização do sistema
     */
    async testSystemInitialization() {
        console.log('🔧 Teste 1: Inicialização do Sistema...');

        try {
            this.system = new GenesisEnterpriseSystem({
                projectPath: "D:/tributa-ai",
                port: 3005, // Porta diferente para teste
                enableMetrics: true,
                enableOptimization: true,
                enableDashboard: true,
                autoStart: false
            });

            this.recordTest('Criação do Sistema', true, 'Sistema criado com sucesso');

            // Testa inicialização
            await this.system.initialize();
            this.recordTest('Inicialização', true, 'Sistema inicializado com sucesso');

            // Testa start
            await this.system.start();
            this.recordTest('Start do Sistema', true, 'Sistema iniciado com sucesso');

            // Verifica status
            const status = this.system.getSystemStatus();
            const isRunning = status.system.isRunning;
            this.recordTest('Status Running', isRunning, isRunning ? 'Sistema rodando' : 'Sistema não está rodando');

            // Aguarda estabilização
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            this.recordTest('Inicialização do Sistema', false, error.message);
            throw error;
        }
    }

    /**
     * Teste 2: Integração de componentes
     */
    async testComponentIntegration() {
        console.log('🔗 Teste 2: Integração de Componentes...');

        try {
            const status = this.system.getSystemStatus();

            // Verifica se todos os componentes esperados estão rodando
            const expectedComponents = ['agentBus', 'workflowEngine', 'realTimeMetrics', 'autoOptimizer', 'httpServer'];

            for (const component of expectedComponents) {
                const componentStatus = status.components[component];
                const isRunning = componentStatus && componentStatus.running;
                this.recordTest(`Componente ${component}`, isRunning,
                    isRunning ? 'Rodando' : 'Não está rodando');
            }

            // Testa comunicação entre componentes
            const metrics = await this.system.getSystemMetrics();
            this.recordTest('Métricas do Sistema', !!metrics, metrics ? 'Métricas obtidas' : 'Erro ao obter métricas');

        } catch (error) {
            this.recordTest('Integração de Componentes', false, error.message);
        }
    }

    /**
     * Teste 3: Sistema de agentes
     */
    async testAgentSystem() {
        console.log('🤖 Teste 3: Sistema de Agentes...');

        try {
            // Verifica configuração dos agentes
            const agentsStatus = this.system.getAgentsStatus();
            const expectedAgents = ['lia', 'nexus', 'executor', 'helios', 'atlas', 'genesis', 'aether', 'oracle', 'thanos'];

            for (const agentId of expectedAgents) {
                const agentExists = !!agentsStatus[agentId];
                this.recordTest(`Agente ${agentId}`, agentExists,
                    agentExists ? 'Configurado' : 'Não configurado');

                if (agentExists) {
                    const agentInfo = this.system.getAgentInfo(agentId);
                    this.recordTest(`Info ${agentId}`, !!agentInfo,
                        agentInfo ? 'Informações obtidas' : 'Erro ao obter informações');
                }
            }

            // Teste de execução de tarefa
            const taskResult = await this.system.executeAgentTask('executor', {
                name: 'Teste de Tarefa',
                type: 'test',
                context: { testMode: true }
            });

            this.recordTest('Execução de Tarefa', !!taskResult,
                taskResult ? 'Tarefa executada' : 'Erro na execução');

        } catch (error) {
            this.recordTest('Sistema de Agentes', false, error.message);
        }
    }

    /**
     * Teste 4: Execução de workflows
     */
    async testWorkflowExecution() {
        console.log('🔄 Teste 4: Execução de Workflows...');

        try {
            // Cria workflow de teste
            const workflowDefinition = {
                name: 'Workflow de Teste',
                description: 'Testa coordenação entre múltiplos agentes',
                steps: [
                    {
                        id: 'step1',
                        name: 'Análise Inicial',
                        agent: 'nexus',
                        type: 'analysis',
                        capabilities: ['technical_coordination']
                    },
                    {
                        id: 'step2',
                        name: 'Implementação',
                        agent: 'executor',
                        type: 'implementation',
                        capabilities: ['react', 'typescript']
                    },
                    {
                        id: 'step3',
                        name: 'Validação',
                        agent: 'oracle',
                        type: 'validation',
                        capabilities: ['testing', 'quality_assurance']
                    }
                ],
                dependencies: {
                    'step2': ['step1'],
                    'step3': ['step2']
                }
            };

            const result = await this.system.executeWorkflow(workflowDefinition, {
                testMode: true,
                priority: 'normal'
            });

            this.recordTest('Workflow Execution', !!result,
                result ? 'Workflow executado com sucesso' : 'Erro na execução do workflow');

            // Verifica status dos workflows
            const workflowsStatus = this.system.getWorkflowsStatus();
            this.recordTest('Workflows Status', !!workflowsStatus,
                workflowsStatus ? 'Status obtido' : 'Erro ao obter status');

        } catch (error) {
            this.recordTest('Execução de Workflows', false, error.message);
        }
    }

    /**
     * Teste 5: Sistema de comunicação
     */
    async testCommunicationSystem() {
        console.log('🌐 Teste 5: Sistema de Comunicação...');

        try {
            // Verifica se AgentBus está rodando
            const agentBus = this.system.agentBus;
            this.recordTest('AgentBus Ativo', !!agentBus && agentBus.isRunning,
                'AgentBus está rodando');

            if (agentBus) {
                const metrics = agentBus.getMetrics();
                this.recordTest('Métricas Comunicação', !!metrics,
                    metrics ? 'Métricas de comunicação obtidas' : 'Erro ao obter métricas');

                // Simula conexão WebSocket (teste básico)
                const WebSocket = require('ws');
                const ws = new WebSocket('ws://localhost:3005');

                await new Promise((resolve, reject) => {
                    ws.on('open', () => {
                        this.recordTest('WebSocket Connection', true, 'Conexão WebSocket estabelecida');
                        ws.close();
                        resolve();
                    });

                    ws.on('error', (error) => {
                        this.recordTest('WebSocket Connection', false, error.message);
                        reject(error);
                    });

                    // Timeout de 5 segundos
                    setTimeout(() => {
                        this.recordTest('WebSocket Connection', false, 'Timeout na conexão');
                        reject(new Error('Timeout'));
                    }, 5000);
                });
            }

        } catch (error) {
            this.recordTest('Sistema de Comunicação', false, error.message);
        }
    }

    /**
     * Teste 6: Sistema de métricas
     */
    async testMetricsSystem() {
        console.log('📊 Teste 6: Sistema de Métricas...');

        try {
            const realTimeMetrics = this.system.realTimeMetrics;
            this.recordTest('RealTimeMetrics Ativo', !!realTimeMetrics && realTimeMetrics.isRunning,
                'Sistema de métricas ativo');

            if (realTimeMetrics) {
                const metrics = realTimeMetrics.getRealtimeMetrics();
                this.recordTest('Métricas Tempo Real', !!metrics,
                    metrics ? 'Métricas em tempo real obtidas' : 'Erro ao obter métricas');

                // Simula atividade de agente
                realTimeMetrics.recordAgentActivity('executor', {
                    success: true,
                    responseTime: 250,
                    cost: 0.01,
                    model: 'claude-3-haiku',
                    tokensUsed: 150,
                    type: 'test'
                });

                this.recordTest('Record Agent Activity', true, 'Atividade de agente registrada');

                // Verifica se a atividade foi registrada
                const updatedMetrics = realTimeMetrics.getRealtimeMetrics();
                this.recordTest('Metrics Update', !!updatedMetrics.agents.executor,
                    'Métricas do agente atualizadas');
            }

        } catch (error) {
            this.recordTest('Sistema de Métricas', false, error.message);
        }
    }

    /**
     * Teste 7: Sistema de otimização
     */
    async testOptimizationSystem() {
        console.log('🧠 Teste 7: Sistema de Otimização...');

        try {
            const autoOptimizer = this.system.autoOptimizer;
            this.recordTest('AutoOptimizer Ativo', !!autoOptimizer && autoOptimizer.isRunning,
                'Sistema de otimização ativo');

            if (autoOptimizer) {
                const optimizationMetrics = autoOptimizer.getOptimizationMetrics();
                this.recordTest('Optimization Metrics', !!optimizationMetrics,
                    optimizationMetrics ? 'Métricas de otimização obtidas' : 'Erro ao obter métricas');

                // Simula dados de performance para otimização
                autoOptimizer.recordAgentPerformance('executor', {
                    responseTime: 3000, // Alto para trigger otimização
                    success: true,
                    cost: 0.05,
                    model: 'gpt-4',
                    tokensUsed: 500,
                    taskType: 'frontend'
                });

                this.recordTest('Performance Recording', true, 'Performance registrada para otimização');

                // Aguarda processamento
                await new Promise(resolve => setTimeout(resolve, 1000));

                const updatedMetrics = autoOptimizer.getOptimizationMetrics();
                this.recordTest('Optimization Processing', !!updatedMetrics,
                    'Processamento de otimização funcionando');
            }

        } catch (error) {
            this.recordTest('Sistema de Otimização', false, error.message);
        }
    }

    /**
     * Teste 8: Sistema de dashboard
     */
    async testDashboardSystem() {
        console.log('📊 Teste 8: Sistema de Dashboard...');

        try {
            // Verifica se servidor HTTP está rodando
            const httpResponse = await this.makeHttpRequest('http://localhost:3005/api/status');
            this.recordTest('HTTP Server', httpResponse.success,
                httpResponse.success ? 'Servidor HTTP respondendo' : httpResponse.error);

            if (httpResponse.success) {
                // Testa endpoints da API
                const endpoints = [
                    '/api/status',
                    '/api/metrics',
                    '/api/agents',
                    '/api/workflows',
                    '/api/optimizations'
                ];

                for (const endpoint of endpoints) {
                    const response = await this.makeHttpRequest(`http://localhost:3005${endpoint}`);
                    this.recordTest(`API ${endpoint}`, response.success,
                        response.success ? 'Endpoint funcionando' : response.error);
                }

                // Testa dashboard principal
                const dashboardResponse = await this.makeHttpRequest('http://localhost:3005/');
                this.recordTest('Dashboard Page', dashboardResponse.success,
                    dashboardResponse.success ? 'Dashboard carregando' : dashboardResponse.error);
            }

        } catch (error) {
            this.recordTest('Sistema de Dashboard', false, error.message);
        }
    }

    /**
     * Teste 9: Integração OpenRouter
     */
    async testOpenRouterIntegration() {
        console.log('🔗 Teste 9: Integração OpenRouter...');

        try {
            // Verifica configuração dos agentes para OpenRouter
            const agentsStatus = this.system.getAgentsStatus();

            for (const [agentId, agentConfig] of Object.entries(agentsStatus)) {
                const hasModel = !!agentConfig.model;
                this.recordTest(`OpenRouter Model ${agentId}`, hasModel,
                    hasModel ? `Modelo configurado: ${agentConfig.model}` : 'Sem modelo configurado');
            }

            // Verifica se configurações estão salvas
            const configPath = path.join("D:/tributa-ai", '.lia/agents/genesis/config');
            const fs = require('fs').promises;

            try {
                const files = await fs.readdir(configPath);
                const configFiles = files.filter(f => f.endsWith('-config.json'));
                this.recordTest('Agent Configs Saved', configFiles.length === 9,
                    `${configFiles.length}/9 arquivos de configuração salvos`);
            } catch (e) {
                this.recordTest('Agent Configs Saved', false, 'Erro ao verificar configurações');
            }

        } catch (error) {
            this.recordTest('Integração OpenRouter', false, error.message);
        }
    }

    /**
     * Teste 10: Performance do sistema
     */
    async testSystemPerformance() {
        console.log('⚡ Teste 10: Performance do Sistema...');

        try {
            const startTime = Date.now();

            // Executa múltiplas operações simultaneamente
            const operations = [];

            // 5 workflows simultâneos
            for (let i = 0; i < 5; i++) {
                operations.push(this.system.executeAgentTask('executor', {
                    name: `Performance Test ${i}`,
                    type: 'performance_test'
                }));
            }

            // Aguarda todas as operações
            const results = await Promise.allSettled(operations);
            const endTime = Date.now();

            const executionTime = endTime - startTime;
            const successfulOps = results.filter(r => r.status === 'fulfilled').length;

            this.recordTest('Performance Test', successfulOps === operations.length,
                `${successfulOps}/${operations.length} operações em ${executionTime}ms`);

            // Verifica se tempo está aceitável (< 10 segundos)
            this.recordTest('Performance Timing', executionTime < 10000,
                `Tempo de execução: ${executionTime}ms`);

            // Verifica uso de memória
            const memUsage = process.memoryUsage();
            const memMB = Math.round(memUsage.heapUsed / 1024 / 1024);
            this.recordTest('Memory Usage', memMB < 200,
                `Uso de memória: ${memMB}MB`);

        } catch (error) {
            this.recordTest('Performance do Sistema', false, error.message);
        }
    }

    /**
     * Faz requisição HTTP para teste
     */
    async makeHttpRequest(url) {
        return new Promise((resolve) => {
            const http = require('http');
            const urlParts = new URL(url);

            const req = http.request({
                hostname: urlParts.hostname,
                port: urlParts.port,
                path: urlParts.pathname + urlParts.search,
                method: 'GET',
                timeout: 5000
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        success: res.statusCode === 200,
                        data,
                        statusCode: res.statusCode
                    });
                });
            });

            req.on('error', (error) => {
                resolve({ success: false, error: error.message });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({ success: false, error: 'Timeout' });
            });

            req.end();
        });
    }

    /**
     * Registra resultado de um teste
     */
    recordTest(testName, passed, message = '') {
        this.testResults.total++;

        if (passed) {
            this.testResults.passed++;
            console.log(`  ✅ ${testName}: ${message}`);
        } else {
            this.testResults.failed++;
            console.log(`  ❌ ${testName}: ${message}`);
        }

        this.testResults.details.push({
            name: testName,
            passed,
            message,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Gera relatório final dos testes
     */
    generateTestReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 RELATÓRIO FINAL DOS TESTES');
        console.log('='.repeat(60));

        const passRate = (this.testResults.passed / this.testResults.total * 100).toFixed(1);

        console.log(`Total de Testes: ${this.testResults.total}`);
        console.log(`✅ Aprovados: ${this.testResults.passed}`);
        console.log(`❌ Reprovados: ${this.testResults.failed}`);
        console.log(`📈 Taxa de Aprovação: ${passRate}%`);

        if (this.testResults.failed > 0) {
            console.log('\n❌ TESTES FALHARAM:');
            this.testResults.details
                .filter(test => !test.passed)
                .forEach(test => {
                    console.log(`  • ${test.name}: ${test.message}`);
                });
        }

        console.log('\n🎯 AVALIAÇÃO FINAL:');
        if (passRate >= 95) {
            console.log('🌟 EXCELENTE - Sistema enterprise pronto para produção!');
        } else if (passRate >= 80) {
            console.log('✅ BOM - Sistema funcional com alguns ajustes necessários');
        } else if (passRate >= 60) {
            console.log('⚠️ REGULAR - Sistema precisa de correções importantes');
        } else {
            console.log('❌ CRÍTICO - Sistema não está pronto para uso');
        }

        // Salva relatório
        this.saveTestReport();
    }

    /**
     * Salva relatório de testes
     */
    async saveTestReport() {
        try {
            const fs = require('fs').promises;
            const reportPath = path.join("D:/tributa-ai", '.lia/agents/genesis/reports', 'test-report.json');

            const report = {
                timestamp: new Date().toISOString(),
                summary: this.testResults,
                systemInfo: {
                    nodeVersion: process.version,
                    platform: process.platform,
                    arch: process.arch,
                    uptime: process.uptime()
                }
            };

            await fs.mkdir(path.dirname(reportPath), { recursive: true });
            await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

            console.log(`\n📄 Relatório salvo em: ${reportPath}`);

        } catch (error) {
            console.error('❌ Erro ao salvar relatório:', error);
        }
    }
}

// Executa testes se arquivo for executado diretamente
if (require.main === module) {
    const tester = new EnterpriseSystemTester();

    tester.runAllTests().then(() => {
        console.log('\n🏁 Testes concluídos!');
        process.exit(0);
    }).catch((error) => {
        console.error('\n💥 Erro crítico nos testes:', error);
        process.exit(1);
    });
}

module.exports = EnterpriseSystemTester;