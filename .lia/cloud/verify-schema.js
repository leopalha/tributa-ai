#!/usr/bin/env node
/**
 * 🔍 Verifica Schema do Sistema de Agentes
 */

const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL ||
    'postgresql://postgres:ySVNPPKGdyfvBbHFIhVNWwQIaFLYikXu@switchyard.proxy.rlwy.net:59812/railway';

async function verify() {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║  🔍 TRIBUTA.AI - Schema Verification                         ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');

    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        // Tabelas
        console.log('📋 TABELAS:');
        const tables = await pool.query(`
            SELECT table_name,
                   (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns
            FROM information_schema.tables t
            WHERE table_schema = 'public'
            AND table_name LIKE 'agent_%'
            ORDER BY table_name
        `);
        for (const row of tables.rows) {
            const count = await pool.query(`SELECT COUNT(*) as c FROM ${row.table_name}`);
            console.log(`  ✅ ${row.table_name} (${row.columns} colunas, ${count.rows[0].c} registros)`);
        }

        // Funções
        console.log('');
        console.log('📋 FUNÇÕES:');
        const functions = await pool.query(`
            SELECT routine_name
            FROM information_schema.routines
            WHERE routine_schema = 'public'
            AND routine_name IN ('get_next_task', 'complete_task', 'fail_task')
        `);
        for (const row of functions.rows) {
            console.log(`  ✅ ${row.routine_name}()`);
        }

        // Views
        console.log('');
        console.log('📋 VIEWS:');
        const views = await pool.query(`
            SELECT table_name
            FROM information_schema.views
            WHERE table_schema = 'public'
            AND table_name LIKE 'v_%'
        `);
        for (const row of views.rows) {
            console.log(`  ✅ ${row.table_name}`);
        }

        // Índices
        console.log('');
        console.log('📋 ÍNDICES:');
        const indexes = await pool.query(`
            SELECT indexname
            FROM pg_indexes
            WHERE schemaname = 'public'
            AND indexname LIKE 'idx_agent%'
            ORDER BY indexname
        `);
        console.log(`  ✅ ${indexes.rows.length} índices criados`);

        // Tarefas atuais
        console.log('');
        console.log('📋 TAREFAS NO BANCO:');
        const tasks = await pool.query(`
            SELECT id, title, status, priority, assigned_agent, created_at
            FROM agent_tasks
            ORDER BY created_at DESC
            LIMIT 5
        `);
        for (const row of tasks.rows) {
            console.log(`  • [${row.status}] ${row.title.substring(0, 40)}... (${row.assigned_agent || 'não atribuído'})`);
        }

        // Status dos agentes
        console.log('');
        console.log('📋 STATUS DOS AGENTES:');
        const agentStatus = await pool.query(`SELECT * FROM v_agent_status`);
        if (agentStatus.rows.length === 0) {
            console.log('  ℹ️  Nenhum agente processou tarefas ainda');
        } else {
            for (const row of agentStatus.rows) {
                console.log(`  • ${row.agent_name}: ${row.tasks_completed} completadas, ${row.tasks_failed} falhas`);
            }
        }

        console.log('');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('✅ Schema verificado com sucesso!');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('');

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await pool.end();
    }
}

verify();
