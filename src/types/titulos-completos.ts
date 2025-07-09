// TIPOS COMPLETOS DE TÍTULOS DE CRÉDITO - TRIBUTA.AI
// Arquivo de referência com todos os tipos implementados

export const TIPOS_TITULOS_COMPLETOS = {
  // TRIBUTÁRIOS FEDERAIS
  IRPJ: 'IRPJ - Imposto de Renda Pessoa Jurídica',
  CSLL: 'CSLL - Contribuição Social sobre Lucro Líquido',
  PIS: 'PIS - Programa Integração Social',
  COFINS: 'COFINS - Contribuição Financiamento Seguridade Social',
  IPI: 'IPI - Imposto Produtos Industrializados',
  IOF: 'IOF - Imposto Operações Financeiras',
  INSS: 'INSS - Instituto Nacional Seguro Social',
  FGTS: 'FGTS - Fundo Garantia Tempo Serviço',
  CIDE: 'CIDE - Contribuição Intervenção Domínio Econômico',
  PASEP: 'PASEP - Programa Formação Patrimônio Servidor',

  // TRIBUTÁRIOS ESTADUAIS
  ICMS: 'ICMS - Imposto Circulação Mercadorias Serviços',
  IPVA: 'IPVA - Imposto Propriedade Veículos',
  ITCMD: 'ITCMD - Imposto Transmissão Causa Mortis',

  // TRIBUTÁRIOS MUNICIPAIS
  ISS: 'ISS/ISSQN - Imposto Serviços',
  IPTU: 'IPTU - Imposto Predial Territorial Urbano',
  ITBI: 'ITBI - Imposto Transmissão Bens Imóveis',

  // COMERCIAIS
  DUPLICATA_MERCANTIL: 'Duplicata Mercantil',
  DUPLICATA_SERVICO: 'Duplicata de Serviço',
  DUPLICATA_RURAL: 'Duplicata Rural',
  NOTA_PROMISSORIA: 'Nota Promissória',
  LETRA_CAMBIO: 'Letra de Câmbio',
  CHEQUE_PREDATADO: 'Cheque Pré-datado',
  WARRANT: 'Warrant',

  // JUDICIAIS
  PRECATORIO_COMUM: 'Precatório Comum',
  PRECATORIO_ALIMENTAR: 'Precatório Alimentar',
  PRECATORIO_SUPER_PRIVILEGIADO: 'Precatório Super Privilegiado',
  HONORARIO_ADVOCATICIO: 'Honorário Advocatício',
  HONORARIO_PERICIAL: 'Honorário Pericial',
  HONORARIO_MEDICO: 'Honorário Médico',
  HONORARIO_ENGENHARIA: 'Honorário Engenharia',
  EXECUCAO_TRABALHISTA: 'Execução Trabalhista',
  CREDITORIO_JUDICIAL: 'Creditório Judicial',
  SENTENCA_CONDENATORIA: 'Sentença Condenatória',

  // FINANCEIROS
  DEBENTURE_SIMPLES: 'Debênture Simples',
  DEBENTURE_INCENTIVADA: 'Debênture Incentivada',
  DEBENTURE_PERPETUA: 'Debênture Perpétua',
  CCB: 'CCB - Cédula Crédito Bancário',
  CCE: 'CCE - Cédula Crédito Exportação',
  CDCA: 'CDCA - Certificado Direitos Creditórios Agronegócio',
  CRI: 'CRI - Certificado Recebíveis Imobiliários',
  CRA: 'CRA - Certificado Recebíveis Agronegócio',
  FIDC: 'FIDC - Fundo Investimento Direitos Creditórios',

  // RURAIS
  CCR_CUSTEIO: 'CCR Custeio',
  CCR_INVESTIMENTO: 'CCR Investimento',
  CCR_COMERCIALIZACAO: 'CCR Comercialização',
  CPR_FISICA: 'CPR Física',
  CPR_FINANCEIRA: 'CPR Financeira',
  CPR_ELETRONICA: 'CPR Eletrônica',
  NCR: 'NCR - Nota Crédito Rural',
  LCA_RURAL: 'LCA Rural',
  CDA: 'CDA - Certificado Depósito Agropecuário',

  // IMOBILIÁRIOS
  FINANCIAMENTO_SBPE: 'Financiamento SBPE',
  FINANCIAMENTO_PMCMV: 'Financiamento PMCMV',
  FINANCIAMENTO_FGTS: 'Financiamento FGTS',
  HIPOTECA: 'Hipoteca',
  ALIENACAO_FIDUCIARIA: 'Alienação Fiduciária',
  PENHOR_IMOVEL: 'Penhor de Imóvel',
  COMPROMISSO_COMPRA_VENDA: 'Compromisso Compra e Venda',
  CONTRATO_GAVETA: 'Contrato de Gaveta',
  CESSAO_DIREITOS: 'Cessão de Direitos',

  // AMBIENTAIS
  CARBONO_VOLUNTARIO: 'Crédito Carbono Voluntário',
  CARBONO_REGULATORIO: 'Crédito Carbono Regulatório',
  CARBONO_FLORESTAL: 'Crédito Carbono Florestal',
  CREDITO_BIODIVERSIDADE: 'Crédito Biodiversidade',
  CREDITO_HIDRICO: 'Crédito Hídrico',
  CREDITO_RENOVAVEL: 'Crédito Renovável',

  // ESPECIAIS
  RJ_TRABALHISTA: 'Recuperação Judicial Trabalhista',
  RJ_FISCAL: 'Recuperação Judicial Fiscal',
  RJ_BANCARIO: 'Recuperação Judicial Bancário',
  RJ_QUIROGRAFARIO: 'Recuperação Judicial Quirografário',
  CONSORCIO_NAO_CONTEMPLADO: 'Consórcio Não Contemplado',
  CONSORCIO_SALDO_RESIDUAL: 'Consórcio Saldo Residual',
  CONSORCIO_DESISTENCIA: 'Consórcio Desistência',
  PLANO_ECONOMICO: 'Plano Econômico',
  ROYALTY_PI: 'Royalty Propriedade Intelectual',
  ROYALTY_MINERACAO: 'Royalty Mineração',
  SEGURO_SINISTRO: 'Seguro Sinistro',
  PREVIDENCIA_COMPLEMENTAR: 'Previdência Complementar',
  FRETE_RODOVIARIO: 'Frete Rodoviário',
  ENERGIA_DISTRIBUIDA: 'Energia Distribuída',
  LEASING: 'Leasing - Arrendamento Mercantil',
};

export const CATEGORIAS_TITULOS = {
  TRIBUTARIO: 'Tributário',
  COMERCIAL: 'Comercial',
  JUDICIAL: 'Judicial',
  FINANCEIRO: 'Financeiro',
  RURAL: 'Rural',
  IMOBILIARIO: 'Imobiliário',
  AMBIENTAL: 'Ambiental',
  ESPECIAL: 'Especial',
};

// Mapeamento tipo -> categoria
export const TIPO_PARA_CATEGORIA: Record<string, string> = {
  // Tributários
  IRPJ: 'TRIBUTARIO',
  CSLL: 'TRIBUTARIO',
  PIS: 'TRIBUTARIO',
  COFINS: 'TRIBUTARIO',
  ICMS: 'TRIBUTARIO',
  IPI: 'TRIBUTARIO',
  IOF: 'TRIBUTARIO',
  ISS: 'TRIBUTARIO',
  IPVA: 'TRIBUTARIO',
  IPTU: 'TRIBUTARIO',
  ITBI: 'TRIBUTARIO',
  INSS: 'TRIBUTARIO',
  FGTS: 'TRIBUTARIO',
  CIDE: 'TRIBUTARIO',

  // Comerciais
  DUPLICATA_MERCANTIL: 'COMERCIAL',
  DUPLICATA_SERVICO: 'COMERCIAL',
  DUPLICATA_RURAL: 'COMERCIAL',
  NOTA_PROMISSORIA: 'COMERCIAL',
  LETRA_CAMBIO: 'COMERCIAL',
  CHEQUE_PREDATADO: 'COMERCIAL',

  // Judiciais
  PRECATORIO_COMUM: 'JUDICIAL',
  PRECATORIO_ALIMENTAR: 'JUDICIAL',
  PRECATORIO_SUPER_PRIVILEGIADO: 'JUDICIAL',
  HONORARIO_ADVOCATICIO: 'JUDICIAL',
  HONORARIO_PERICIAL: 'JUDICIAL',
  HONORARIO_MEDICO: 'JUDICIAL',
  EXECUCAO_TRABALHISTA: 'JUDICIAL',

  // Financeiros
  DEBENTURE_SIMPLES: 'FINANCEIRO',
  DEBENTURE_INCENTIVADA: 'FINANCEIRO',
  CCB: 'FINANCEIRO',
  CCE: 'FINANCEIRO',
  CRI: 'FINANCEIRO',
  CRA: 'FINANCEIRO',
  FIDC: 'FINANCEIRO',

  // Rurais
  CCR_CUSTEIO: 'RURAL',
  CCR_INVESTIMENTO: 'RURAL',
  CPR_FISICA: 'RURAL',
  CPR_FINANCEIRA: 'RURAL',
  CPR_ELETRONICA: 'RURAL',
  NCR: 'RURAL',

  // Imobiliários
  FINANCIAMENTO_SBPE: 'IMOBILIARIO',
  FINANCIAMENTO_PMCMV: 'IMOBILIARIO',
  HIPOTECA: 'IMOBILIARIO',
  ALIENACAO_FIDUCIARIA: 'IMOBILIARIO',

  // Ambientais
  CARBONO_VOLUNTARIO: 'AMBIENTAL',
  CARBONO_REGULATORIO: 'AMBIENTAL',
  CREDITO_BIODIVERSIDADE: 'AMBIENTAL',
  CREDITO_HIDRICO: 'AMBIENTAL',

  // Especiais
  RJ_TRABALHISTA: 'ESPECIAL',
  RJ_FISCAL: 'ESPECIAL',
  CONSORCIO_NAO_CONTEMPLADO: 'ESPECIAL',
  PLANO_ECONOMICO: 'ESPECIAL',
  ROYALTY_PI: 'ESPECIAL',
  SEGURO_SINISTRO: 'ESPECIAL',
  PREVIDENCIA_COMPLEMENTAR: 'ESPECIAL',
  LEASING: 'ESPECIAL',
};

// Função para obter categoria automaticamente
export function obterCategoria(tipo: string): string {
  return TIPO_PARA_CATEGORIA[tipo] || 'COMERCIAL';
}

// Estatísticas
export const ESTATISTICAS_TIPOS = {
  total: Object.keys(TIPOS_TITULOS_COMPLETOS).length,
  porCategoria: {
    TRIBUTARIO: 13,
    COMERCIAL: 7,
    JUDICIAL: 10,
    FINANCEIRO: 9,
    RURAL: 9,
    IMOBILIARIO: 9,
    AMBIENTAL: 6,
    ESPECIAL: 15,
  },
};

console.log('📊 TRIBUTA.AI - Tipos de Títulos Implementados:');
console.log(`✅ Total: ${ESTATISTICAS_TIPOS.total} tipos diferentes`);
console.log('📋 Por categoria:', ESTATISTICAS_TIPOS.porCategoria);
