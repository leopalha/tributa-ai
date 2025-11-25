-- ============================================
-- TRIBUTA.AI - AGENT SYSTEM DATABASE SCHEMA
-- Sistema de Agentes LIA v4.1 na Nuvem
-- ============================================
-- Execute este SQL no Railway PostgreSQL
-- Projeto: b1386c63-0ba1-4c4e-aaaf-79cf4c70e4b3
-- ============================================

-- Habilitar extensão UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: agent_tasks
-- Fila de tarefas para os 9 agentes processarem
-- ============================================
CREATE TABLE IF NOT EXISTS agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Identificação da tarefa
    title TEXT NOT NULL,
    description TEXT NOT NULL,

    -- Tipo de tarefa (determina qual agente processa)
    type TEXT NOT NULL CHECK (type IN (
        'code',           -- EXECUTOR, GENESIS
        'design',         -- ATLAS
        'test',           -- ORACLE
        'refactor',       -- THANOS
        'security',       -- HELIOS
        'architecture',   -- NEXUS
        'performance',    -- AETHER
        'coordination',   -- LIA
        'general'         -- Qualquer agente
    )),

    -- Prioridade
    priority TEXT DEFAULT 'medium' CHECK (priority IN (
        'critical',   -- Processar imediatamente
        'high',       -- Processar em até 5 minutos
        'medium',     -- Processar em até 30 minutos
        'low'         -- Processar quando possível
    )),

    -- Status do processamento
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Aguardando processamento
        'in_progress',  -- Sendo processado por um agente
        'completed',    -- Concluído com sucesso
        'failed',       -- Falhou (ver result para erro)
        'cancelled'     -- Cancelado pelo usuário
    )),

    -- Agente designado/que processou
    assigned_agent TEXT CHECK (assigned_agent IN (
        'LIA', 'NEXUS', 'EXECUTOR', 'HELIOS', 'ATLAS',
        'THANOS', 'GENESIS', 'ORACLE', 'AETHER', NULL
    )),

    -- Input/Output
    expected_output TEXT,           -- O que se espera como resultado
    result TEXT,                    -- Resultado do processamento
    files_modified TEXT[],          -- Lista de arquivos modificados

    -- Git integration
    commit_hash TEXT,               -- Hash do commit se houve
    branch_name TEXT,               -- Branch onde foi feito

    -- Contexto adicional
    context JSONB DEFAULT '{}',     -- Contexto extra (arquivos, configs, etc)

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Métricas
    tokens_used INTEGER DEFAULT 0,
    cost_usd DECIMAL(10, 6) DEFAULT 0,
    processing_time_ms INTEGER
);

-- ============================================
-- TABELA: agent_logs
-- Logs de atividade dos agentes
-- ============================================
CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Identificação
    agent_name TEXT NOT NULL CHECK (agent_name IN (
        'LIA', 'NEXUS', 'EXECUTOR', 'HELIOS', 'ATLAS',
        'THANOS', 'GENESIS', 'ORACLE', 'AETHER', 'SYSTEM'
    )),

    -- Tipo de ação
    action TEXT NOT NULL,

    -- Detalhes em JSON
    details JSONB DEFAULT '{}',

    -- Nível de log
    level TEXT DEFAULT 'info' CHECK (level IN (
        'debug',    -- Debugging detalhado
        'info',     -- Informação geral
        'warn',     -- Aviso (não crítico)
        'error',    -- Erro (requer atenção)
        'critical'  -- Crítico (sistema parou)
    )),

    -- Referência à tarefa (se aplicável)
    task_id UUID REFERENCES agent_tasks(id) ON DELETE SET NULL,

    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: agent_metrics
-- Métricas de performance dos agentes
-- ============================================
CREATE TABLE IF NOT EXISTS agent_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Identificação
    agent_name TEXT NOT NULL,

    -- Período
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Métricas
    tasks_completed INTEGER DEFAULT 0,
    tasks_failed INTEGER DEFAULT 0,
    avg_processing_time_ms INTEGER,
    total_tokens_used INTEGER DEFAULT 0,
    total_cost_usd DECIMAL(10, 6) DEFAULT 0,
    success_rate DECIMAL(5, 2),

    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- agent_tasks
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_priority ON agent_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_type ON agent_tasks(type);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_assigned ON agent_tasks(assigned_agent);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_created ON agent_tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_pending ON agent_tasks(status, priority)
    WHERE status = 'pending';

-- agent_logs
CREATE INDEX IF NOT EXISTS idx_agent_logs_agent ON agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_logs_level ON agent_logs(level);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created ON agent_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_logs_task ON agent_logs(task_id);

-- agent_metrics
CREATE INDEX IF NOT EXISTS idx_agent_metrics_agent ON agent_metrics(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_period ON agent_metrics(period_start, period_end);

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função para obter próxima tarefa por prioridade
CREATE OR REPLACE FUNCTION get_next_task(p_agent_name TEXT DEFAULT NULL)
RETURNS UUID AS $$
DECLARE
    v_task_id UUID;
BEGIN
    -- Seleciona tarefa pendente de maior prioridade
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

    -- Marca como em progresso
    IF v_task_id IS NOT NULL THEN
        UPDATE agent_tasks
        SET status = 'in_progress',
            started_at = NOW(),
            assigned_agent = COALESCE(p_agent_name, assigned_agent)
        WHERE id = v_task_id;
    END IF;

    RETURN v_task_id;
END;
$$ LANGUAGE plpgsql;

-- Função para completar tarefa
CREATE OR REPLACE FUNCTION complete_task(
    p_task_id UUID,
    p_result TEXT,
    p_files_modified TEXT[] DEFAULT NULL,
    p_commit_hash TEXT DEFAULT NULL,
    p_tokens_used INTEGER DEFAULT 0,
    p_cost_usd DECIMAL DEFAULT 0
)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql;

-- Função para falhar tarefa
CREATE OR REPLACE FUNCTION fail_task(
    p_task_id UUID,
    p_error TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE agent_tasks
    SET status = 'failed',
        completed_at = NOW(),
        result = p_error,
        processing_time_ms = EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000
    WHERE id = p_task_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View de tarefas pendentes com prioridade
CREATE OR REPLACE VIEW v_pending_tasks AS
SELECT
    id,
    title,
    type,
    priority,
    assigned_agent,
    created_at,
    CASE priority
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
    END as priority_order
FROM agent_tasks
WHERE status = 'pending'
ORDER BY priority_order, created_at;

-- View de status dos agentes
CREATE OR REPLACE VIEW v_agent_status AS
SELECT
    agent_name,
    COUNT(*) FILTER (WHERE status = 'completed') as tasks_completed,
    COUNT(*) FILTER (WHERE status = 'failed') as tasks_failed,
    COUNT(*) FILTER (WHERE status = 'in_progress') as tasks_in_progress,
    ROUND(AVG(processing_time_ms)::numeric, 2) as avg_processing_ms,
    SUM(tokens_used) as total_tokens,
    SUM(cost_usd) as total_cost_usd
FROM agent_tasks
WHERE assigned_agent IS NOT NULL
GROUP BY agent_name;

-- View de logs recentes
CREATE OR REPLACE VIEW v_recent_logs AS
SELECT
    l.id,
    l.agent_name,
    l.action,
    l.level,
    l.details,
    l.created_at,
    t.title as task_title
FROM agent_logs l
LEFT JOIN agent_tasks t ON l.task_id = t.id
ORDER BY l.created_at DESC
LIMIT 100;

-- ============================================
-- DADOS INICIAIS (Opcional)
-- ============================================

-- Inserir tarefa de teste
INSERT INTO agent_tasks (title, description, type, priority, expected_output)
VALUES (
    'Tarefa de Teste - Sistema Iniciado',
    'Esta é uma tarefa de teste para verificar se o sistema de agentes está funcionando corretamente.',
    'general',
    'low',
    'Confirmação de que o sistema está operacional'
) ON CONFLICT DO NOTHING;

-- Log de inicialização
INSERT INTO agent_logs (agent_name, action, level, details)
VALUES (
    'SYSTEM',
    'DATABASE_INITIALIZED',
    'info',
    '{"message": "Schema de agentes criado com sucesso", "version": "1.0.0", "tables": ["agent_tasks", "agent_logs", "agent_metrics"]}'::jsonb
);

-- ============================================
-- COMENTÁRIOS NAS TABELAS
-- ============================================

COMMENT ON TABLE agent_tasks IS 'Fila de tarefas para os 9 agentes do sistema LIA v4.1';
COMMENT ON TABLE agent_logs IS 'Logs de atividade e eventos dos agentes';
COMMENT ON TABLE agent_metrics IS 'Métricas agregadas de performance dos agentes';

COMMENT ON COLUMN agent_tasks.type IS 'Tipo de tarefa: code, design, test, refactor, security, architecture, performance, coordination, general';
COMMENT ON COLUMN agent_tasks.priority IS 'Prioridade: critical (imediato), high (5min), medium (30min), low (quando possível)';
COMMENT ON COLUMN agent_tasks.status IS 'Status: pending, in_progress, completed, failed, cancelled';

-- ============================================
-- FIM DO SCHEMA
-- ============================================
