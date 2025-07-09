-- CreateTable
CREATE TABLE "analise_obrigacoes" (
    "id" TEXT NOT NULL,
    "cnpj_empresa" TEXT NOT NULL,
    "razao_social_empresa" TEXT NOT NULL,
    "nome_fantasia_empresa" TEXT,
    "regime_tributario" TEXT NOT NULL,
    "status_analise" TEXT NOT NULL DEFAULT 'PENDENTE',
    "data_inicio_analise" TIMESTAMP(3),
    "data_conclusao_analise" TIMESTAMP(3),
    "total_documentos" INTEGER NOT NULL DEFAULT 0,
    "total_itens_processados" INTEGER NOT NULL DEFAULT 0,
    "total_receitas_segregadas" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valor_total_creditos" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "criado_por_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analise_obrigacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credito_identificado" (
    "id" TEXT NOT NULL,
    "analise_obrigacoes_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor_nominal" DOUBLE PRECISION NOT NULL,
    "valor_atual" DOUBLE PRECISION NOT NULL,
    "valor_economia" DOUBLE PRECISION NOT NULL,
    "periodo_inicio" TIMESTAMP(3) NOT NULL,
    "periodo_fim" TIMESTAMP(3) NOT NULL,
    "status_credito" TEXT NOT NULL DEFAULT 'IDENTIFICADO',
    "pode_compensar" BOOLEAN NOT NULL DEFAULT true,
    "tribunal_origem" TEXT,
    "numero_processo" TEXT,
    "base_calculo_detalhada" TEXT,
    "credit_title_id" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credito_identificado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documento_analise" (
    "id" TEXT NOT NULL,
    "analise_obrigacoes_id" TEXT NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "tipo_documento" TEXT NOT NULL,
    "tamanho_bytes" INTEGER NOT NULL,
    "hash_arquivo" TEXT,
    "caminho_armazenamento" TEXT NOT NULL,
    "status_processamento" TEXT NOT NULL DEFAULT 'PENDENTE',
    "data_upload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_processamento" TIMESTAMP(3),
    "itens_encontrados" INTEGER NOT NULL DEFAULT 0,
    "creditos_identificados" INTEGER NOT NULL DEFAULT 0,
    "valor_total_encontrado" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "documento_analise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analise_obrigacoes_cnpj_empresa_idx" ON "analise_obrigacoes"("cnpj_empresa");

-- CreateIndex
CREATE INDEX "analise_obrigacoes_criado_por_id_idx" ON "analise_obrigacoes"("criado_por_id");

-- CreateIndex
CREATE INDEX "analise_obrigacoes_status_analise_idx" ON "analise_obrigacoes"("status_analise");

-- CreateIndex
CREATE UNIQUE INDEX "credito_identificado_credit_title_id_key" ON "credito_identificado"("credit_title_id");

-- CreateIndex
CREATE INDEX "credito_identificado_analise_obrigacoes_id_idx" ON "credito_identificado"("analise_obrigacoes_id");

-- CreateIndex
CREATE INDEX "credito_identificado_tipo_idx" ON "credito_identificado"("tipo");

-- CreateIndex
CREATE INDEX "credito_identificado_status_credito_idx" ON "credito_identificado"("status_credito");

-- CreateIndex
CREATE INDEX "documento_analise_analise_obrigacoes_id_idx" ON "documento_analise"("analise_obrigacoes_id");

-- CreateIndex
CREATE INDEX "documento_analise_tipo_documento_idx" ON "documento_analise"("tipo_documento");

-- CreateIndex
CREATE INDEX "documento_analise_status_processamento_idx" ON "documento_analise"("status_processamento");

-- AddForeignKey
ALTER TABLE "analise_obrigacoes" ADD CONSTRAINT "analise_obrigacoes_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credito_identificado" ADD CONSTRAINT "credito_identificado_analise_obrigacoes_id_fkey" FOREIGN KEY ("analise_obrigacoes_id") REFERENCES "analise_obrigacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credito_identificado" ADD CONSTRAINT "credito_identificado_credit_title_id_fkey" FOREIGN KEY ("credit_title_id") REFERENCES "credit_titles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento_analise" ADD CONSTRAINT "documento_analise_analise_obrigacoes_id_fkey" FOREIGN KEY ("analise_obrigacoes_id") REFERENCES "analise_obrigacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
