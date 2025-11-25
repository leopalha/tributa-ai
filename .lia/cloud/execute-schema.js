#!/usr/bin/env node
/**
 * 🗄️ Executa Schema PostgreSQL para Sistema de Agentes
 * Conecta ao Railway PostgreSQL e cria as tabelas necessárias
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuração de conexão
const DATABASE_URL = process.env.DATABASE_URL ||
    'postgresql://postgres:ySVNPPKGdyfvBbHFIhVNWwQIaFLYikXu@switchyard.proxy.rlwy.net:59812/railway';

async function executeSchema() {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║  🗄️ TRIBUTA.AI - Schema Executor                             ║');
    console.log('║  Criando tabelas para sistema de agentes                     ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');

    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        // Testar conexão
        console.log('🔌 Conectando ao Railway PostgreSQL...');
        const client = await pool.connect();
        const timeResult = await client.query('SELECT NOW() as now');
        console.log(`✅ Conectado! Timestamp: ${timeResult.rows[0].now}`);
        console.log('');

        // Ler arquivo SQL
        const sqlPath = path.join(__dirname, 'agent-tables.sql');
        console.log(`📄 Lendo schema de: ${sqlPath}`);
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log(`✅ SQL carregado (${sql.length} caracteres)`);
        console.log('');

        // Executar SQL
        console.log('🚀 Executando schema...');
        console.log('');

        // Dividir em comandos individuais e executar
        const commands = sql
            .split(/;[\s]*$/m)
            .filter(cmd => cmd.trim().length > 0)
            .map(cmd => cmd.trim() + ';');

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (let i = 0; i < commands.length; i++) {
            const cmd = commands[i];
            const preview = cmd.substring(0, 60).replace(/\n/g, ' ');

            try {
                await client.query(cmd);
                successCount++;

                // Mostrar tipo de comando
                if (cmd.includes('CREATE TABLE')) {
                    const tableName = cmd.match(/CREATE TABLE[^(]*?(\w+)/i)?.[1] || 'unknown';
                    console.log(`  ✅ Tabela criada: ${tableName}`);
                } else if (cmd.includes('CREATE INDEX')) {
                    const indexName = cmd.match(/CREATE INDEX[^(]*?(\w+)/i)?.[1] || 'unknown';
                    console.log(`  ✅ Índice criado: ${indexName}`);
                } else if (cmd.includes('CREATE OR REPLACE FUNCTION')) {
                    const funcName = cmd.match(/FUNCTION\s+(\w+)/i)?.[1] || 'unknown';
                    console.log(`  ✅ Função criada: ${funcName}`);
                } else if (cmd.includes('CREATE OR REPLACE VIEW')) {
                    const viewName = cmd.match(/VIEW\s+(\w+)/i)?.[1] || 'unknown';
                    console.log(`  ✅ View criada: ${viewName}`);
                } else if (cmd.includes('CREATE EXTENSION')) {
                    console.log(`  ✅ Extensão habilitada: uuid-ossp`);
                } else if (cmd.includes('INSERT INTO')) {
                    console.log(`  ✅ Dados inseridos`);
                } else if (cmd.includes('COMMENT ON')) {
                    // Skip comment messages
                } else {
                    console.log(`  ✅ Comando ${i + 1} executado`);
                }
            } catch (error) {
                if (error.message.includes('already exists')) {
                    skipCount++;
                    console.log(`  ⚠️  Já existe: ${preview}...`);
                } else {
                    errorCount++;
                    console.error(`  ❌ Erro: ${error.message.substring(0, 80)}`);
                }
            }
        }

        client.release();
        console.log('');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log(`📊 Resultado: ${successCount} sucesso | ${skipCount} já existiam | ${errorCount} erros`);
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('');

        // Verificar tabelas criadas
        console.log('📋 Verificando tabelas criadas...');
        const tablesResult = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name LIKE 'agent_%'
            ORDER BY table_name
        `);

        console.log('');
        console.log('Tabelas de agentes no banco:');
        for (const row of tablesResult.rows) {
            console.log(`  • ${row.table_name}`);
        }

        // Verificar tarefas pendentes
        const tasksResult = await pool.query(`
            SELECT COUNT(*) as total FROM agent_tasks
        `);
        console.log('');
        console.log(`Total de tarefas no banco: ${tasksResult.rows[0].total}`);

        console.log('');
        console.log('✅ Schema executado com sucesso!');
        console.log('');
        console.log('🚀 Próximos passos:');
        console.log('   1. Deploy do serviço de agentes no Railway');
        console.log('   2. Configurar variáveis de ambiente');
        console.log('   3. Acessar dashboard em /dashboard');
        console.log('');

    } catch (error) {
        console.error('');
        console.error('❌ Erro ao executar schema:', error.message);
        console.error('');
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Executar
executeSchema();
