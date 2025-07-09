import { z } from 'zod';

// Define credit category enum
export enum CreditCategory {
  TRIBUTARIO = 'TRIBUTARIO',
  COMERCIAL = 'COMERCIAL',
  FINANCEIRO = 'FINANCEIRO',
  JUDICIAL = 'JUDICIAL',
  RURAL = 'RURAL',
  IMOBILIARIO = 'IMOBILIARIO',
  AMBIENTAL = 'AMBIENTAL',
  ESPECIAL = 'ESPECIAL',
}

// Define structure for credit types
export interface CreditTypeDefinition {
  category: CreditCategory;
  label: string;
  color: string;
  icon: string;
  description: string;
  subtypes: { id: string; label: string; description: string }[];
}

// Define credit status enum
export enum CreditStatus {
  DRAFT = 'DRAFT',
  VALIDATING = 'VALIDATING',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  TOKENIZING = 'TOKENIZING',
  TOKENIZED = 'TOKENIZED',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
}

// --- Sub-types for each Category ---

// 1. TCs Tributários
export enum TCTributarioFederal {
  IRPJ = 'IRPJ',
  CSLL = 'CSLL',
  PIS_PASEP = 'PIS_PASEP',
  COFINS = 'COFINS',
  IPI = 'IPI',
  IOF = 'IOF',
}

export enum TCTributarioEstadual {
  ICMS = 'ICMS',
  IPVA = 'IPVA',
  ITCMD = 'ITCMD',
}

export enum TCTributarioMunicipal {
  ISSQN = 'ISSQN',
  IPTU = 'IPTU',
  ITBI = 'ITBI',
  TAXAS_MUNICIPAIS = 'TAXAS_MUNICIPAIS',
}

export type TCTributarioSubType =
  | TCTributarioFederal
  | TCTributarioEstadual
  | TCTributarioMunicipal;

// 2. TCs Comerciais
export enum TCComercial {
  DUPLICATA_MERCANTIL = 'DUPLICATA_MERCANTIL',
  DUPLICATA_SERVICO = 'DUPLICATA_SERVICO',
  NOTA_PROMISSORIA = 'NOTA_PROMISSORIA',
  LETRA_CAMBIO = 'LETRA_CAMBIO',
}

// 3. TCs Financeiros
export enum TCFinanceiro {
  DEBENTURE_SIMPLES = 'DEBENTURE_SIMPLES',
  DEBENTURE_INCENTIVADA = 'DEBENTURE_INCENTIVADA',
  CCB = 'CCB', // Cédula de Crédito Bancário
  CRI = 'CRI', // Certificado de Recebíveis Imobiliários
  CRA = 'CRA', // Certificado de Recebíveis do Agronegócio
}

// 4. TCs Judiciais
export enum TCJudicial {
  PRECATORIO_COMUM = 'PRECATORIO_COMUM',
  PRECATORIO_ALIMENTAR = 'PRECATORIO_ALIMENTAR',
  CREDITORIO_PRE_JUDICIAL = 'CREDITORIO_PRE_JUDICIAL', // Acordos administrativos
  HONORARIO_ADVOCATICIO = 'HONORARIO_ADVOCATICIO',
  HONORARIO_PERICIAL = 'HONORARIO_PERICIAL',
  HONORARIO_MEDICO = 'HONORARIO_MEDICO',
  HONORARIO_ENGENHARIA = 'HONORARIO_ENGENHARIA',
}

// 5. TCs Rurais
export enum TCRural {
  CCR_CUSTEIO = 'CCR_CUSTEIO', // Cédula de Crédito Rural
  CCR_INVESTIMENTO = 'CCR_INVESTIMENTO',
  CPR_FISICA = 'CPR_FISICA', // Cédula de Produto Rural
  CPR_FINANCEIRA = 'CPR_FINANCEIRA',
  CPR_ELETRONICA = 'CPR_ELETRONICA',
  NCR = 'NCR', // Nota de Crédito Rural
}

// 6. TCs Imobiliários
export enum TCImobiliario {
  FINANCIAMENTO_SBPE = 'FINANCIAMENTO_SBPE',
  FINANCIAMENTO_PMCMV = 'FINANCIAMENTO_PMCMV',
  CONTRATO_GARANTIA_HIPOTECA = 'CONTRATO_GARANTIA_HIPOTECA',
  CONTRATO_GARANTIA_ALIENACAO = 'CONTRATO_GARANTIA_ALIENACAO',
}

// 7. TCs Ambientais
export enum TCAmbiental {
  CREDITO_CARBONO_VOLUNTARIO = 'CREDITO_CARBONO_VOLUNTARIO',
  CREDITO_CARBONO_REGULATORIO = 'CREDITO_CARBONO_REGULATORIO',
  CREDITO_BIODIVERSIDADE = 'CREDITO_BIODIVERSIDADE',
  CREDITO_HIDRICO = 'CREDITO_HIDRICO',
}

// 8. TCs Especiais
export enum TCEspecial {
  RECUPERACAO_JUDICIAL_TRABALHISTA = 'RECUPERACAO_JUDICIAL_TRABALHISTA',
  RECUPERACAO_JUDICIAL_FISCAL = 'RECUPERACAO_JUDICIAL_FISCAL',
  RECUPERACAO_JUDICIAL_BANCARIO = 'RECUPERACAO_JUDICIAL_BANCARIO',
  CONSORCIO_NAO_CONTEMPLADO = 'CONSORCIO_NAO_CONTEMPLADO',
  CONSORCIO_SALDO_RESIDUAL = 'CONSORCIO_SALDO_RESIDUAL',
  PLANO_ECONOMICO_RESSARCIMENTO = 'PLANO_ECONOMICO_RESSARCIMENTO',
  ROYALTY_PROPRIEDADE_INTELECTUAL = 'ROYALTY_PROPRIEDADE_INTELECTUAL',
  ROYALTY_RECURSOS_NATURAIS = 'ROYALTY_RECURSOS_NATURAIS',
  SEGURO_SINISTRO = 'SEGURO_SINISTRO',
  SEGURO_INDENIZACAO = 'SEGURO_INDENIZACAO',
  BENEFICIO_PREVIDENCIARIO = 'BENEFICIO_PREVIDENCIARIO',
  FRETE_RODOVIARIO = 'FRETE_RODOVIARIO',
  FRETE_MARITIMO = 'FRETE_MARITIMO',
  FRETE_AEREO = 'FRETE_AEREO',
  ENERGIA_GERACAO_DISTRIBUIDA = 'ENERGIA_GERACAO_DISTRIBUIDA',
  LEASING_ARRENDAMENTO = 'LEASING_ARRENDAMENTO',
}

// Union type for all possible sub-types
export type CreditSubType =
  | TCTributarioSubType
  | TCComercial
  | TCFinanceiro
  | TCJudicial
  | TCRural
  | TCImobiliario
  | TCAmbiental
  | TCEspecial;

// Schema for validation (optional, using Zod for example)
export const CreditCategorySchema = z.nativeEnum(CreditCategory);

// Example of how to potentially structure the detailed TC type
// This might live elsewhere, e.g., in prisma schema or a dedicated types file
export const BaseCreditTitleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, 'Título é obrigatório'),
  description: z.string().optional(),
  category: CreditCategorySchema,
  // subType will depend on the category chosen
  // This requires more complex validation logic, maybe discriminated union
  value: z.number().positive('Valor deve ser positivo'),
  issueDate: z.date(),
  expiryDate: z.date().optional(),
  issuerId: z.string().uuid(), // Link to User/Company issuing the TC
  // ... other common fields: status, createdAt, updatedAt
});

// --- Discriminated Union Example for SubType Validation (Conceptual) ---

// Define schemas for each category including its specific subType
const TributarioSchema = BaseCreditTitleSchema.extend({
  category: z.literal(CreditCategory.TRIBUTARIO),
  subType: z.nativeEnum({
    ...TCTributarioFederal,
    ...TCTributarioEstadual,
    ...TCTributarioMunicipal,
  }),
});

const ComercialSchema = BaseCreditTitleSchema.extend({
  category: z.literal(CreditCategory.COMERCIAL),
  subType: z.nativeEnum(TCComercial),
});

// ... schemas for other categories ...

// Combine them into a discriminated union
export const CreditTitleSchema = z.discriminatedUnion('category', [
  TributarioSchema,
  ComercialSchema,
  // ... other category schemas
]);

export type DetailedCreditTitle = z.infer<typeof CreditTitleSchema>;

// Note: The Zod schemas are examples for validation and might need adjustments
// based on the actual Prisma model and application requirements.
