-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'EMPRESA', 'PROFISSIONAL_TRIBUTARIO', 'INVESTIDOR_QUALIFICADO');

-- CreateEnum
CREATE TYPE "CreditCategory" AS ENUM ('TRIBUTARIO', 'COMERCIAL', 'FINANCEIRO', 'JUDICIAL', 'RURAL', 'IMOBILIARIO', 'AMBIENTAL', 'ESPECIAL');

-- CreateEnum
CREATE TYPE "CreditStatus" AS ENUM ('DRAFT', 'PENDING_VALIDATION', 'VALIDATED', 'REJECTED', 'PENDING_TOKENIZATION', 'TOKENIZED', 'LISTED_FOR_SALE', 'IN_NEGOTIATION', 'NEGOTIATED', 'SETTLEMENT_PENDING', 'SETTLED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TCTributarioFederal" AS ENUM ('IRPJ', 'CSLL', 'PIS_PASEP', 'COFINS', 'IPI', 'IOF');

-- CreateEnum
CREATE TYPE "TCTributarioEstadual" AS ENUM ('ICMS', 'IPVA', 'ITCMD');

-- CreateEnum
CREATE TYPE "TCTributarioMunicipal" AS ENUM ('ISSQN', 'IPTU', 'ITBI', 'TAXAS_MUNICIPAIS');

-- CreateEnum
CREATE TYPE "TCComercial" AS ENUM ('DUPLICATA_MERCANTIL', 'DUPLICATA_SERVICO', 'NOTA_PROMISSORIA', 'LETRA_CAMBIO');

-- CreateEnum
CREATE TYPE "TCFinanceiro" AS ENUM ('DEBENTURE_SIMPLES', 'DEBENTURE_INCENTIVADA', 'CCB', 'CRI', 'CRA');

-- CreateEnum
CREATE TYPE "TCJudicial" AS ENUM ('PRECATORIO_COMUM', 'PRECATORIO_ALIMENTAR', 'CREDITORIO_PRE_JUDICIAL', 'HONORARIO_ADVOCATICIO', 'HONORARIO_PERICIAL', 'HONORARIO_MEDICO', 'HONORARIO_ENGENHARIA');

-- CreateEnum
CREATE TYPE "TCRural" AS ENUM ('CCR_CUSTEIO', 'CCR_INVESTIMENTO', 'CPR_FISICA', 'CPR_FINANCEIRA', 'CPR_ELETRONICA', 'NCR');

-- CreateEnum
CREATE TYPE "TCImobiliario" AS ENUM ('FINANCIAMENTO_SBPE', 'FINANCIAMENTO_PMCMV', 'CONTRATO_GARANTIA_HIPOTECA', 'CONTRATO_GARANTIA_ALIENACAO');

-- CreateEnum
CREATE TYPE "TCAmbiental" AS ENUM ('CREDITO_CARBONO_VOLUNTARIO', 'CREDITO_CARBONO_REGULATORIO', 'CREDITO_BIODIVERSIDADE', 'CREDITO_HIDRICO');

-- CreateEnum
CREATE TYPE "TCEspecial" AS ENUM ('RECUPERACAO_JUDICIAL_TRABALHISTA', 'RECUPERACAO_JUDICIAL_FISCAL', 'RECUPERACAO_JUDICIAL_BANCARIO', 'CONSORCIO_NAO_CONTEMPLADO', 'CONSORCIO_SALDO_RESIDUAL', 'PLANO_ECONOMICO_RESSARCIMENTO', 'ROYALTY_PROPRIEDADE_INTELECTUAL', 'ROYALTY_RECURSOS_NATURAIS', 'SEGURO_SINISTRO', 'SEGURO_INDENIZACAO', 'BENEFICIO_PREVIDENCIARIO', 'FRETE_RODOVIARIO', 'FRETE_MARITIMO', 'FRETE_AEREO', 'ENERGIA_GERACAO_DISTRIBUIDA', 'LEASING_ARRENDAMENTO');

-- CreateEnum
CREATE TYPE "OfferType" AS ENUM ('DIRECT', 'AUCTION', 'NEGOTIABLE');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('ACTIVE', 'PAUSED', 'EXPIRED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED', 'FAILED', 'DISPUTE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DIRECT', 'MARKETPLACE', 'AUCTION', 'OTC', 'SYSTEM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,
    "nome_fantasia" TEXT,
    "cnpj" TEXT NOT NULL,
    "insc_estadual" TEXT,
    "insc_municipal" TEXT,
    "endereco" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "status" TEXT NOT NULL,
    "representante_principal_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "credit_titles" (
    "id" TEXT NOT NULL,
    "category" "CreditCategory" NOT NULL,
    "value_nominal" DOUBLE PRECISION NOT NULL,
    "value_current" DOUBLE PRECISION NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "expiry_date" TIMESTAMP(3),
    "issuer_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "status" "CreditStatus" NOT NULL DEFAULT 'DRAFT',
    "token_id" TEXT,
    "token_standard" TEXT,
    "blockchain_tx_hash" TEXT,
    "is_listed" BOOLEAN NOT NULL DEFAULT false,
    "listing_price" DOUBLE PRECISION,
    "listing_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_title_tributario" (
    "id" TEXT NOT NULL,
    "credit_title_id" TEXT NOT NULL,
    "subtype_federal" "TCTributarioFederal",
    "subtype_estadual" "TCTributarioEstadual",
    "subtype_municipal" "TCTributarioMunicipal",
    "esfera" TEXT NOT NULL,
    "nome_tributo" TEXT NOT NULL,
    "periodo_apuracao_inicio" TIMESTAMP(3) NOT NULL,
    "periodo_apuracao_fim" TIMESTAMP(3) NOT NULL,
    "numero_processo_administrativo" TEXT,
    "numero_processo_judicial" TEXT,

    CONSTRAINT "credit_title_tributario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_title_comercial" (
    "id" TEXT NOT NULL,
    "credit_title_id" TEXT NOT NULL,
    "subtype" "TCComercial" NOT NULL,
    "sacado_nome" TEXT NOT NULL,
    "sacado_documento" TEXT NOT NULL,

    CONSTRAINT "credit_title_comercial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_title_financeiro" (
    "id" TEXT NOT NULL,
    "credit_title_id" TEXT NOT NULL,
    "subtype" "TCFinanceiro" NOT NULL,
    "indexador" TEXT,
    "taxa_juros_anual" DOUBLE PRECISION,
    "rating" TEXT,

    CONSTRAINT "credit_title_financeiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_title_judicial" (
    "id" TEXT NOT NULL,
    "credit_title_id" TEXT NOT NULL,
    "subtype" "TCJudicial" NOT NULL,
    "numero_processo" TEXT NOT NULL,
    "tribunal_origem" TEXT NOT NULL,
    "vara_origem" TEXT,
    "natureza" TEXT NOT NULL,
    "ente_devedor" TEXT,

    CONSTRAINT "credit_title_judicial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_title_rural" (
    "id" TEXT NOT NULL,
    "credit_title_id" TEXT NOT NULL,
    "subtype" "TCRural" NOT NULL,
    "safra" TEXT,
    "produto_agricola" TEXT,
    "area_financiada_hectares" DOUBLE PRECISION,
    "registro_imovel_rural" TEXT,

    CONSTRAINT "credit_title_rural_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_title_imobiliario" (
    "id" TEXT NOT NULL,
    "credit_title_id" TEXT NOT NULL,
    "subtype" "TCImobiliario" NOT NULL,
    "matricula_imovel" TEXT NOT NULL,
    "endereco_logradouro" TEXT NOT NULL,
    "endereco_numero" TEXT NOT NULL,
    "endereco_complemento" TEXT,
    "endereco_bairro" TEXT NOT NULL,
    "endereco_cidade" TEXT NOT NULL,
    "endereco_estado" TEXT NOT NULL,
    "endereco_cep" TEXT NOT NULL,
    "tipo_garantia" TEXT,

    CONSTRAINT "credit_title_imobiliario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_title_ambiental" (
    "id" TEXT NOT NULL,
    "credit_title_id" TEXT NOT NULL,
    "subtype" "TCAmbiental" NOT NULL,
    "projeto_vinculado" TEXT,
    "metodologia_certificacao" TEXT,
    "toneladas_co2_equivalente" DOUBLE PRECISION,
    "hectares_conservados" DOUBLE PRECISION,
    "volume_agua_economizado_m3" DOUBLE PRECISION,

    CONSTRAINT "credit_title_ambiental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_title_especial" (
    "id" TEXT NOT NULL,
    "credit_title_id" TEXT NOT NULL,
    "subtype" "TCEspecial" NOT NULL,
    "processo_recuperacao_judicial" TEXT,
    "credor_original" TEXT,
    "classe_credito_rj" TEXT,
    "administradora_consorcio" TEXT,
    "grupo_consorcio" TEXT,
    "cota_consorcio" TEXT,

    CONSTRAINT "credit_title_especial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "storageLocation" TEXT NOT NULL,
    "hash" TEXT,
    "creditTitleId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "creditTitleId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "terms" TEXT,
    "quantityAvailable" INTEGER NOT NULL DEFAULT 1,
    "offerType" "OfferType" NOT NULL DEFAULT 'DIRECT',
    "minBidIncrement" DOUBLE PRECISION,
    "reservePrice" DOUBLE PRECISION,
    "allowPartialPurchase" BOOLEAN NOT NULL DEFAULT false,
    "status" "OfferStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "bidderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "status" "BidStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "creditTitleId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "offerId" TEXT,
    "bidId" TEXT,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "blockchainData" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction" (
    "id" TEXT NOT NULL,
    "creditId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startPrice" DOUBLE PRECISION NOT NULL,
    "minPrice" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "winnerId" TEXT,
    "finalPrice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementParticipant" (
    "id" TEXT NOT NULL,
    "settlementId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "SettlementParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiscalObligation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "taxCode" TEXT,
    "taxName" TEXT,
    "taxType" TEXT,
    "taxPeriod" TEXT,
    "taxBase" DOUBLE PRECISION,
    "taxRate" DOUBLE PRECISION,
    "taxValue" DOUBLE PRECISION,
    "taxInterest" DOUBLE PRECISION,
    "taxFine" DOUBLE PRECISION,
    "taxTotal" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FiscalObligation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_email_key" ON "empresas"("email");

-- CreateIndex
CREATE INDEX "empresas_representante_principal_id_idx" ON "empresas"("representante_principal_id");

-- CreateIndex
CREATE INDEX "empresas_status_idx" ON "empresas"("status");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "credit_titles_token_id_key" ON "credit_titles"("token_id");

-- CreateIndex
CREATE INDEX "credit_titles_issuer_id_idx" ON "credit_titles"("issuer_id");

-- CreateIndex
CREATE INDEX "credit_titles_owner_id_idx" ON "credit_titles"("owner_id");

-- CreateIndex
CREATE INDEX "credit_titles_category_idx" ON "credit_titles"("category");

-- CreateIndex
CREATE INDEX "credit_titles_status_idx" ON "credit_titles"("status");

-- CreateIndex
CREATE INDEX "credit_titles_is_listed_idx" ON "credit_titles"("is_listed");

-- CreateIndex
CREATE UNIQUE INDEX "credit_title_tributario_credit_title_id_key" ON "credit_title_tributario"("credit_title_id");

-- CreateIndex
CREATE INDEX "credit_title_tributario_credit_title_id_idx" ON "credit_title_tributario"("credit_title_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_title_comercial_credit_title_id_key" ON "credit_title_comercial"("credit_title_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_title_financeiro_credit_title_id_key" ON "credit_title_financeiro"("credit_title_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_title_judicial_credit_title_id_key" ON "credit_title_judicial"("credit_title_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_title_rural_credit_title_id_key" ON "credit_title_rural"("credit_title_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_title_imobiliario_credit_title_id_key" ON "credit_title_imobiliario"("credit_title_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_title_ambiental_credit_title_id_key" ON "credit_title_ambiental"("credit_title_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_title_especial_credit_title_id_key" ON "credit_title_especial"("credit_title_id");

-- CreateIndex
CREATE INDEX "Document_creditTitleId_idx" ON "Document"("creditTitleId");

-- CreateIndex
CREATE INDEX "Document_uploadedById_idx" ON "Document"("uploadedById");

-- CreateIndex
CREATE INDEX "Offer_creditTitleId_idx" ON "Offer"("creditTitleId");

-- CreateIndex
CREATE INDEX "Offer_sellerId_idx" ON "Offer"("sellerId");

-- CreateIndex
CREATE INDEX "Offer_status_idx" ON "Offer"("status");

-- CreateIndex
CREATE INDEX "Bid_offerId_idx" ON "Bid"("offerId");

-- CreateIndex
CREATE INDEX "Bid_bidderId_idx" ON "Bid"("bidderId");

-- CreateIndex
CREATE INDEX "Transaction_creditTitleId_idx" ON "Transaction"("creditTitleId");

-- CreateIndex
CREATE INDEX "Transaction_sellerId_idx" ON "Transaction"("sellerId");

-- CreateIndex
CREATE INDEX "Transaction_buyerId_idx" ON "Transaction"("buyerId");

-- CreateIndex
CREATE INDEX "Transaction_offerId_idx" ON "Transaction"("offerId");

-- CreateIndex
CREATE INDEX "Transaction_bidId_idx" ON "Transaction"("bidId");

-- CreateIndex
CREATE INDEX "Auction_creditId_idx" ON "Auction"("creditId");

-- CreateIndex
CREATE INDEX "Auction_sellerId_idx" ON "Auction"("sellerId");

-- CreateIndex
CREATE INDEX "Auction_winnerId_idx" ON "Auction"("winnerId");

-- CreateIndex
CREATE INDEX "SettlementParticipant_settlementId_idx" ON "SettlementParticipant"("settlementId");

-- CreateIndex
CREATE INDEX "SettlementParticipant_userId_idx" ON "SettlementParticipant"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "FiscalObligation_userId_idx" ON "FiscalObligation"("userId");

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_representante_principal_id_fkey" FOREIGN KEY ("representante_principal_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_titles" ADD CONSTRAINT "credit_titles_issuer_id_fkey" FOREIGN KEY ("issuer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_titles" ADD CONSTRAINT "credit_titles_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_title_tributario" ADD CONSTRAINT "credit_title_tributario_credit_title_id_fkey" FOREIGN KEY ("credit_title_id") REFERENCES "credit_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_title_comercial" ADD CONSTRAINT "credit_title_comercial_credit_title_id_fkey" FOREIGN KEY ("credit_title_id") REFERENCES "credit_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_title_financeiro" ADD CONSTRAINT "credit_title_financeiro_credit_title_id_fkey" FOREIGN KEY ("credit_title_id") REFERENCES "credit_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_title_judicial" ADD CONSTRAINT "credit_title_judicial_credit_title_id_fkey" FOREIGN KEY ("credit_title_id") REFERENCES "credit_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_title_rural" ADD CONSTRAINT "credit_title_rural_credit_title_id_fkey" FOREIGN KEY ("credit_title_id") REFERENCES "credit_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_title_imobiliario" ADD CONSTRAINT "credit_title_imobiliario_credit_title_id_fkey" FOREIGN KEY ("credit_title_id") REFERENCES "credit_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_title_ambiental" ADD CONSTRAINT "credit_title_ambiental_credit_title_id_fkey" FOREIGN KEY ("credit_title_id") REFERENCES "credit_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_title_especial" ADD CONSTRAINT "credit_title_especial_credit_title_id_fkey" FOREIGN KEY ("credit_title_id") REFERENCES "credit_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_creditTitleId_fkey" FOREIGN KEY ("creditTitleId") REFERENCES "credit_titles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_creditTitleId_fkey" FOREIGN KEY ("creditTitleId") REFERENCES "credit_titles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_bidderId_fkey" FOREIGN KEY ("bidderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_creditTitleId_fkey" FOREIGN KEY ("creditTitleId") REFERENCES "credit_titles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "Bid"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "credit_titles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementParticipant" ADD CONSTRAINT "SettlementParticipant_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementParticipant" ADD CONSTRAINT "SettlementParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiscalObligation" ADD CONSTRAINT "FiscalObligation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
