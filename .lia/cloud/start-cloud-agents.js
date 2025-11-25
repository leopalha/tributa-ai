#!/usr/bin/env node
/**
 * 🚀 TRIBUTA.AI - Cloud Agents Startup Script
 * Script de inicialização do sistema de agentes na nuvem
 *
 * @version 1.0.0
 * @description Inicia o Genesis Enterprise System conectado ao Railway PostgreSQL
 */

const path = require('path');

// Configurar paths para produção
const projectPath = process.env.PROJECT_PATH || path.resolve(__dirname, '../../..');

console.log('');
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║  🧠 TRIBUTA.AI - LIA CLOUD AGENTS SYSTEM                     ║');
console.log('║  Sistema de 9 Agentes Autônomos na Nuvem                     ║');
console.log('╠══════════════════════════════════════════════════════════════╣');
console.log('║  Version: 4.1                                                ║');
console.log('║  Mode: Cloud (Railway)                                       ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('');

// Verificar variáveis de ambiente obrigatórias
const requiredEnvVars = ['DATABASE_URL'];
const optionalEnvVars = ['OPENROUTER_API_KEY', 'GITHUB_TOKEN', 'PORT'];

console.log('🔍 Verificando variáveis de ambiente...');
console.log('');

let hasErrors = false;

for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
        console.log(`  ✅ ${envVar}: configurado`);
    } else {
        console.log(`  ❌ ${envVar}: FALTANDO (obrigatório)`);
        hasErrors = true;
    }
}

for (const envVar of optionalEnvVars) {
    if (process.env[envVar]) {
        console.log(`  ✅ ${envVar}: configurado`);
    } else {
        console.log(`  ⚠️  ${envVar}: não configurado (opcional)`);
    }
}

console.log('');

if (hasErrors) {
    console.error('❌ Variáveis de ambiente obrigatórias faltando!');
    console.error('Configure DATABASE_URL para conectar ao PostgreSQL.');
    process.exit(1);
}

// Mostrar configuração
console.log('📋 Configuração do Sistema:');
console.log(`  • Project Path: ${projectPath}`);
console.log(`  • Port: ${process.env.PORT || 3003}`);
console.log(`  • Node Env: ${process.env.NODE_ENV || 'development'}`);
console.log(`  • Database: ${process.env.DATABASE_URL ? 'Railway PostgreSQL' : 'Não configurado'}`);
console.log(`  • OpenRouter: ${process.env.OPENROUTER_API_KEY ? 'Configurado' : 'Não configurado'}`);
console.log(`  • GitHub: ${process.env.GITHUB_TOKEN ? 'Configurado' : 'Não configurado'}`);
console.log('');

// Carregar e iniciar o sistema
console.log('🚀 Iniciando Genesis Enterprise System...');
console.log('');

try {
    // Importar o sistema principal
    const GenesisEnterpriseSystem = require('../agents/genesis/genesis-enterprise-system.js');

    // Criar instância com configuração cloud
    const system = new GenesisEnterpriseSystem({
        projectPath: projectPath,
        port: parseInt(process.env.PORT) || 3003,
        host: '0.0.0.0', // Importante para Railway
        openRouterApiKey: process.env.OPENROUTER_API_KEY,
        enableMetrics: true,
        enableOptimization: true,
        enableDashboard: true,
        autoStart: true
    });

    // Event handlers
    system.on('system:started', () => {
        console.log('');
        console.log('╔══════════════════════════════════════════════════════════════╗');
        console.log('║  🎉 SISTEMA INICIADO COM SUCESSO!                            ║');
        console.log('╠══════════════════════════════════════════════════════════════╣');
        console.log(`║  📊 Dashboard: http://0.0.0.0:${process.env.PORT || 3003}/dashboard           ║`);
        console.log(`║  🌐 API: http://0.0.0.0:${process.env.PORT || 3003}/api/status              ║`);
        console.log(`║  🔌 WebSocket: ws://0.0.0.0:${process.env.PORT || 3003}                   ║`);
        console.log('╚══════════════════════════════════════════════════════════════╝');
        console.log('');
        console.log('📡 Endpoints disponíveis:');
        console.log('  GET  /api/health      - Health check');
        console.log('  GET  /api/status      - Status do sistema');
        console.log('  GET  /api/agents      - Status dos agentes');
        console.log('  GET  /api/tasks       - Lista tarefas');
        console.log('  POST /api/tasks       - Criar nova tarefa');
        console.log('  GET  /dashboard       - Dashboard Bloomberg-level');
        console.log('');
        console.log('🤖 Agentes prontos para processar tarefas...');
    });

    system.on('system:health_warning', (status) => {
        console.log('⚠️ Aviso de saúde do sistema:', JSON.stringify(status, null, 2));
    });

    system.on('error', (error) => {
        console.error('❌ Erro no sistema:', error.message);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
        console.log(`\n🛑 Recebido ${signal}, parando sistema...`);

        try {
            await system.stop();
            console.log('✅ Sistema parado com sucesso');
            process.exit(0);
        } catch (error) {
            console.error('❌ Erro ao parar sistema:', error);
            process.exit(1);
        }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // Tratamento de erros não capturados
    process.on('uncaughtException', (error) => {
        console.error('❌ Erro não capturado:', error);
        gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('❌ Promise rejeitada não tratada:', reason);
    });

} catch (error) {
    console.error('❌ Erro ao iniciar sistema:', error);
    process.exit(1);
}
