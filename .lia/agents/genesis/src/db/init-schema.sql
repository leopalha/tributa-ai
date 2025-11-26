-- ============================================
-- 🗄️ GENESIS ENTERPRISE SYSTEM - DATABASE SCHEMA
-- PostgreSQL Schema para Sistema de Agentes LIA v4.1
-- ============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para busca full-text

-- ============================================
-- TABELA: agent_tasks
-- Gerencia todas as tarefas dos agentes
-- ============================================
CREATE TABLE IF NOT EXISTS agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
    expected_output TEXT,
    result TEXT,
    assigned_agent VARCHAR(50),
    files_modified JSONB DEFAULT '[]',
    commit_hash VARCHAR(100),
    context JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    processing_time_ms INTEGER DEFAULT 0,
    tokens_used DECIMAL(12, 2) DEFAULT 0,
    cost_usd DECIMAL(10, 6) DEFAULT 0,
    error_message TEXT
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON agent_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON agent_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_agent ON agent_tasks(assigned_agent);
CREATE INDEX IF NOT EXISTS idx_tasks_type ON agent_tasks(type);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON agent_tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_status_priority ON agent_tasks(status, priority);

-- ============================================
-- TABELA: agent_logs
-- Logs de atividade dos agentes
-- ============================================
CREATE TABLE IF NOT EXISTS agent_logs (
    id BIGSERIAL PRIMARY KEY,
    agent_name VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}',
    level VARCHAR(20) DEFAULT 'info' CHECK (level IN ('debug', 'info', 'warn', 'error', 'critical')),
    task_id UUID REFERENCES agent_tasks(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para logs
CREATE INDEX IF NOT EXISTS idx_logs_agent ON agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_logs_level ON agent_logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_task ON agent_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_logs_created ON agent_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_agent_created ON agent_logs(agent_name, created_at DESC);

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função para obter próxima tarefa por prioridade
CREATE OR REPLACE FUNCTION get_next_task(p_agent_name VARCHAR DEFAULT NULL)
RETURNS UUID AS $$
DECLARE
    v_task_id UUID;
BEGIN
    SELECT id INTO v_task_id
    FROM agent_tasks
    WHERE status = 'pending'
      AND (p_agent_name IS NULL OR assigned_agent IS NULL OR assigned_agent = p_agent_name)
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
            assigned_agent = COALESCE(assigned_agent, p_agent_name)
        WHERE id = v_task_id;
    END IF;

    RETURN v_task_id;
END;
$$ LANGUAGE plpgsql;

-- Função para completar tarefa
CREATE OR REPLACE FUNCTION complete_task(
    p_task_id UUID,
    p_result TEXT,
    p_files_modified JSONB DEFAULT '[]',
    p_commit_hash VARCHAR DEFAULT NULL,
    p_tokens_used DECIMAL DEFAULT 0,
    p_cost_usd DECIMAL DEFAULT 0
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE agent_tasks
    SET status = 'completed',
        result = p_result,
        files_modified = p_files_modified,
        commit_hash = p_commit_hash,
        tokens_used = p_tokens_used,
        cost_usd = p_cost_usd,
        completed_at = NOW(),
        processing_time_ms = EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000
    WHERE id = p_task_id
      AND status = 'in_progress';

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Função para marcar tarefa como falhada
CREATE OR REPLACE FUNCTION fail_task(
    p_task_id UUID,
    p_error_message TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE agent_tasks
    SET status = 'failed',
        error_message = p_error_message,
        completed_at = NOW(),
        processing_time_ms = EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000
    WHERE id = p_task_id
      AND status = 'in_progress';

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEW: Status dos Agentes
-- ============================================
CREATE OR REPLACE VIEW v_agent_status AS
SELECT
    assigned_agent as agent_name,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_tasks,
    COUNT(*) FILTER (WHERE status = 'in_progress') as active_tasks,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_tasks,
    ROUND(AVG(processing_time_ms) FILTER (WHERE status = 'completed')) as avg_processing_ms,
    SUM(tokens_used) as total_tokens,
    SUM(cost_usd) as total_cost_usd,
    MAX(completed_at) as last_activity
FROM agent_tasks
WHERE assigned_agent IS NOT NULL
GROUP BY assigned_agent;

-- ============================================
-- DADOS INICIAIS (OPCIONAL)
-- ============================================

-- Inserir tarefa de teste (comentado por padrão)
-- INSERT INTO agent_tasks (title, description, type, priority, assigned_agent)
-- VALUES ('Sistema inicializado', 'Database schema criado com sucesso', 'system', 'low', 'SYSTEM');

-- ============================================
-- FIM DO SCHEMA
-- ============================================

-- Verificar criação
DO $$
BEGIN
    RAISE NOTICE '✅ Schema GENESIS criado com sucesso!';
    RAISE NOTICE '📊 Tabelas: agent_tasks, agent_logs';
    RAISE NOTICE '🔧 Funções: get_next_task, complete_task, fail_task';
    RAISE NOTICE '📈 View: v_agent_status';
END $$;
