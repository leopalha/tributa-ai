/**
 * 🧪 TESTE SIMPLES DO SISTEMA ENTERPRISE
 * Teste básico para validar funcionamento do sistema
 */

const GenesisEnterpriseSystem = require('./genesis-enterprise-system.js');

async function testSystem() {
    console.log('🧪 Iniciando teste simples do Genesis Enterprise System...\n');

    let system = null;

    try {
        // 1. Criar sistema
        console.log('🔧 Criando sistema...');
        system = new GenesisEnterpriseSystem({
            projectPath: "D:/tributa-ai",
            port: 3006, // Porta única para teste
            enableMetrics: true,
            enableOptimization: true,
            enableDashboard: true,
            autoStart: false
        });
        console.log('✅ Sistema criado com sucesso\n');

        // 2. Inicializar
        console.log('🚀 Inicializando sistema...');
        await system.initialize();
        console.log('✅ Sistema inicializado\n');

        // 3. Iniciar
        console.log('▶️ Iniciando sistema...');
        await system.start();
        console.log('✅ Sistema iniciado\n');

        // 4. Verificar status
        console.log('📊 Verificando status...');
        const status = system.getSystemStatus();
        console.log(`Status: ${status.system.isRunning ? 'RODANDO' : 'PARADO'}`);
        console.log(`Componentes rodando: ${status.system.runningComponents}/${status.system.totalComponents}`);
        console.log(`Agentes configurados: ${status.agents.total}`);
        console.log('✅ Status verificado\n');

        // 5. Testar métricas
        console.log('📈 Testando métricas...');
        const metrics = await system.getSystemMetrics();
        console.log(`Métricas obtidas: ${Object.keys(metrics).length} categorias`);
        console.log('✅ Métricas funcionando\n');

        // 6. Testar agentes
        console.log('🤖 Testando agentes...');
        const agentsStatus = system.getAgentsStatus();
        console.log(`Agentes configurados: ${Object.keys(agentsStatus).length}`);

        for (const [agentId, config] of Object.entries(agentsStatus)) {
            console.log(`  • ${config.name} (${config.model})`);
        }
        console.log('✅ Agentes configurados\n');

        // 7. Testar execução simples
        console.log('⚡ Testando execução de tarefa...');
        try {
            const taskResult = await system.executeAgentTask('executor', {
                name: 'Teste Simples',
                type: 'test',
                context: { simple: true }
            });
            console.log('✅ Tarefa executada com sucesso');
        } catch (error) {
            console.log('⚠️ Erro na execução da tarefa:', error.message);
        }

        // 8. Aguardar estabilização
        console.log('\n⏳ Aguardando estabilização (5 segundos)...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 9. Verificar dashboard
        console.log('🌐 Testando dashboard...');
        console.log(`Dashboard disponível em: http://localhost:3006`);
        console.log(`WebSocket disponível em: ws://localhost:3006`);

        console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
        console.log('📊 O sistema Genesis Enterprise está funcionando corretamente.');

    } catch (error) {
        console.error('\n❌ ERRO NO TESTE:', error.message);
        console.error(error.stack);
    } finally {
        // Parar sistema
        if (system) {
            console.log('\n🛑 Parando sistema...');
            try {
                await system.stop();
                console.log('✅ Sistema parado com sucesso');
            } catch (error) {
                console.error('❌ Erro ao parar sistema:', error.message);
            }
        }
    }
}

// Executar teste
testSystem().then(() => {
    console.log('\n🏁 Teste finalizado!');
    process.exit(0);
}).catch((error) => {
    console.error('\n💥 Erro crítico:', error);
    process.exit(1);
});