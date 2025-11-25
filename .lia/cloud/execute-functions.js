#!/usr/bin/env node
/**
 * 🗄️ Executa Funções PostgreSQL para Sistema de Agentes
 * Cria as funções PL/pgSQL que precisam de tratamento especial
 */

const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL ||
    'postgresql://postgres:ySVNPPKGdyfvBbHFIhVNWwQIaFLYikXu@switchyard.proxy.rlwy.net:59812/railway';

async function executeFunctions() {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║  🗄️ TRIBUTA.AI - Function Executor                           ║');
    console.log('║  Criando funções PL/pgSQL para agentes                       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');

    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();
        console.log('🔌 Conectado ao Railway PostgreSQL');
        console.log('');

        // Função get_next_task
        console.log('📝 Criando função get_next_task...');
        await client.query(`
            CREATE OR REPLACE FUNCTION get_next_task(p_agent_name TEXT DEFAULT NULL)
            RETURNS UUID AS $func$
            DECLARE
                v_task_id UUID;
            BEGIN
                SELECT id INTO v_task_id
                FROM agent_tasks
                WHERE status = 'pending'
                  AND (p_agent_name IS NULL OR
                       assigned_agent IS NULL OR
                       assigned_agent = p_agent_name)
                ORDER BY
                    CASE priority
                        WHEN 'critical' THEN 1
                        WHEN 'high' THEN 2
                        WHEN 'medium' THEN 3
                        WHEN 'low' THEN 4
                    END,
                    created_at ASC
                LIMIT 1
                FOR UPDATE SKIP LOCKED;

                IF v_task_id IS NOT NULL THEN
                    UPDATE agent_tasks
                    SET status = 'in_progress',
                        started_at = NOW(),
                        assigned_agent = COALESCE(p_agent_name, assigned_agent)
                    WHERE id = v_task_id;
                END IF;

                RETURN v_task_id;
            END;
            $func$ LANGUAGE plpgsql;
        `);
        console.log('  ✅ get_next_task criada');

        // Função complete_task
        console.log('📝 Criando função complete_task...');
        await client.query(`
            CREATE OR REPLACE FUNCTION complete_task(
                p_task_id UUID,
                p_result TEXT,
                p_files_modified TEXT[] DEFAULT NULL,
                p_commit_hash TEXT DEFAULT NULL,
                p_tokens_used INTEGER DEFAULT 0,
                p_cost_usd DECIMAL DEFAULT 0
            )
            RETURNS BOOLEAN AS $func$
            BEGIN
                UPDATE agent_tasks
                SET status = 'completed',
                    completed_at = NOW(),
                    result = p_result,
                    files_modified = COALESCE(p_files_modified, files_modified),
                    commit_hash = COALESCE(p_commit_hash, commit_hash),
                    tokens_used = p_tokens_used,
                    cost_usd = p_cost_usd,
                    processing_time_ms = EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000
                WHERE id = p_task_id;

                RETURN FOUND;
            END;
            $func$ LANGUAGE plpgsql;
        `);
        console.log('  ✅ complete_task criada');

        // Função fail_task
        console.log('📝 Criando função fail_task...');
        await client.query(`
            CREATE OR REPLACE FUNCTION fail_task(
                p_task_id UUID,
                p_error TEXT
            )
            RETURNS BOOLEAN AS $func$
            BEGIN
                UPDATE agent_tasks
                SET status = 'failed',
                    completed_at = NOW(),
                    result = p_error,
                    processing_time_ms = EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000
                WHERE id = p_task_id;

                RETURN FOUND;
            END;
            $func$ LANGUAGE plpgsql;
        `);
        console.log('  ✅ fail_task criada');

        // View v_agent_status corrigida
        console.log('📝 Criando view v_agent_status...');
        await client.query(`
            CREATE OR REPLACE VIEW v_agent_status AS
            SELECT
                assigned_agent as agent_name,
                COUNT(*) FILTER (WHERE status = 'completed') as tasks_completed,
                COUNT(*) FILTER (WHERE status = 'failed') as tasks_failed,
                COUNT(*) FILTER (WHERE status = 'in_progress') as tasks_in_progress,
                ROUND(AVG(processing_time_ms)::numeric, 2) as avg_processing_ms,
                SUM(tokens_used) as total_tokens,
                SUM(cost_usd) as total_cost_usd
            FROM agent_tasks
            WHERE assigned_agent IS NOT NULL
            GROUP BY assigned_agent;
        `);
        console.log('  ✅ v_agent_status criada');

        client.release();

        console.log('');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('✅ Todas as funções criadas com sucesso!');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('');

        // Testar funções
        console.log('🧪 Testando funções...');

        // Testar criação de tarefa
        const insertResult = await pool.query(`
            INSERT INTO agent_tasks (title, description, type, priority, expected_output)
            VALUES (
                'Teste de Função - Sistema Operacional',
                'Tarefa de teste para verificar funções PL/pgSQL',
                'general',
                'low',
                'Confirmação de que funções estão funcionando'
            )
            RETURNING id, title
        `);
        console.log(`  ✅ Tarefa criada: ${insertResult.rows[0].id}`);

        // Testar get_next_task
        const nextResult = await pool.query(`SELECT get_next_task('GENESIS') as task_id`);
        console.log(`  ✅ get_next_task retornou: ${nextResult.rows[0].task_id}`);

        // Testar complete_task
        if (nextResult.rows[0].task_id) {
            const completeResult = await pool.query(
                `SELECT complete_task($1, 'Teste completado com sucesso', ARRAY['test.js'], 'abc123', 100, 0.001)`,
                [nextResult.rows[0].task_id]
            );
            console.log(`  ✅ complete_task executada`);
        }

        // Verificar v_agent_status
        const statusResult = await pool.query(`SELECT * FROM v_agent_status`);
        console.log(`  ✅ v_agent_status retornou ${statusResult.rows.length} agentes`);

        console.log('');
        console.log('🎉 Sistema de agentes totalmente configurado no PostgreSQL!');
        console.log('');

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

executeFunctions();
