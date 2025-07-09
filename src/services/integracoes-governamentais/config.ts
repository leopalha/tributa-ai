/**
 * Configuração centralizada das APIs governamentais reais
 * Utilizando apenas APIs públicas, gratuitas e oficiais
 */

export const APIS_GOVERNAMENTAIS = {
  // RECEITA FEDERAL - APIs Públicas
  RECEITA_FEDERAL: {
    // ReceitaWS - API pública gratuita (limite: 3 consultas por minuto)
    CNPJ_RECEITAWS: {
      url: 'https://www.receitaws.com.br/v1/cnpj',
      limite: '3 consultas por minuto',
      documentacao: 'https://www.receitaws.com.br/api'
    },
    // CNPJ.ws - API pública gratuita
    CNPJ_PUBLIC: {
      url: 'https://publica.cnpj.ws/cnpj',
      limite: 'Consultas limitadas',
      documentacao: 'https://cnpj.ws'
    },
    // BrasilAPI - Agregador de APIs públicas
    BRASIL_API: {
      url: 'https://brasilapi.com.br/api/cnpj/v1',
      limite: 'Sem limites definidos',
      documentacao: 'https://brasilapi.com.br/docs'
    }
  },

  // BANCO CENTRAL - APIs Oficiais
  BANCO_CENTRAL: {
    // Taxa SELIC oficial
    SELIC: {
      url: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados',
      formato: 'json',
      documentacao: 'https://dadosabertos.bcb.gov.br/dataset/11-taxa-de-juros-selic'
    },
    // Taxa de câmbio oficial
    PTAX: {
      url: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados',
      formato: 'json',
      documentacao: 'https://dadosabertos.bcb.gov.br/dataset/dolar-americano-usd-todos-os-boletins-diarios'
    },
    // IPCA - Índice de Preços
    IPCA: {
      url: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados',
      formato: 'json',
      documentacao: 'https://dadosabertos.bcb.gov.br/dataset/433-indice-nacional-de-precos-ao-consumidor-amplo-ipca'
    },
    // IGP-M
    IGPM: {
      url: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados',
      formato: 'json',
      documentacao: 'https://dadosabertos.bcb.gov.br/dataset/189-indice-geral-de-precos-do-mercado-igp-m'
    }
  },

  // IBGE - APIs Oficiais
  IBGE: {
    // API de localidades
    LOCALIDADES: {
      estados: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      municipios: 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios',
      documentacao: 'https://servicodados.ibge.gov.br/api/docs/localidades'
    },
    // API de índices
    INDICES: {
      ipca: 'https://servicodados.ibge.gov.br/api/v1/conjunturais/ipca',
      documentacao: 'https://servicodados.ibge.gov.br/api/docs'
    }
  },

  // CORREIOS - APIs Públicas
  CORREIOS: {
    // ViaCEP - API gratuita e confiável
    VIACEP: {
      url: 'https://viacep.com.br/ws',
      formato: 'json',
      limite: 'Sem limites',
      documentacao: 'https://viacep.com.br'
    },
    // BrasilAPI CEP
    BRASILAPI_CEP: {
      url: 'https://brasilapi.com.br/api/cep/v2',
      limite: 'Sem limites',
      documentacao: 'https://brasilapi.com.br/docs#tag/CEP-V2'
    }
  },

  // APIs ESTADUAIS - NFe/NFCe
  SEFAZ: {
    // Consulta pública de NFe (QR Code)
    CONSULTA_NFE: {
      AC: 'http://www.sefaznet.ac.gov.br/nfce/consulta',
      AL: 'http://nfce.sefaz.al.gov.br/consultaNFCe.htm',
      AP: 'https://www.sefaz.ap.gov.br/nfce/consulta',
      AM: 'http://sistemas.sefaz.am.gov.br/nfceweb/consultarNFCe.jsp',
      BA: 'http://nfe.sefaz.ba.gov.br/servicos/nfce/modulos/geral/NFCEC_consulta_chave_acesso.aspx',
      CE: 'http://nfce.sefaz.ce.gov.br/pages/ShowNFCe.html',
      DF: 'http://dec.fazenda.df.gov.br/ConsultarNFCe.aspx',
      ES: 'http://app.sefaz.es.gov.br/ConsultaNFCe',
      GO: 'http://nfe.sefaz.go.gov.br/nfeweb/sites/nfce/danfeNFCe',
      MA: 'http://www.nfce.sefaz.ma.gov.br/portal/consultarNFCe.jsp',
      MT: 'http://www.sefaz.mt.gov.br/nfce/consultanfce',
      MS: 'http://www.dfe.ms.gov.br/nfce/consulta',
      MG: 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/consultaArgumento.xhtml',
      PA: 'https://appnfc.sefa.pa.gov.br/portal/view/consultas/nfce/consultanfce.seam',
      PB: 'https://www.sefaz.pb.gov.br/nfce',
      PR: 'http://www.fazenda.pr.gov.br/nfce/consulta',
      PE: 'http://nfce.sefaz.pe.gov.br/nfce/consulta',
      PI: 'http://webas.sefaz.pi.gov.br/nfceweb/consultarNFCe.jsf',
      RJ: 'http://www4.fazenda.rj.gov.br/consultaNFCe/QRCode',
      RN: 'http://nfce.set.rn.gov.br/consultarNFCe.aspx',
      RS: 'https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx',
      RO: 'http://www.nfce.sefin.ro.gov.br/consultanfce/consulta.jsp',
      RR: 'https://www.sefaz.rr.gov.br/nfce/servlet/wp_consulta_nfce',
      SC: 'https://sat.sef.sc.gov.br/nfce/consulta',
      SP: 'https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaQRCode.aspx',
      SE: 'http://www.nfce.se.gov.br/nfce/consulta',
      TO: 'http://www.sefaz.to.gov.br/nfce/consulta'
    }
  },

  // OUTRAS APIs ÚTEIS
  COMPLEMENTARES: {
    // API de feriados nacionais
    FERIADOS: {
      url: 'https://brasilapi.com.br/api/feriados/v1',
      documentacao: 'https://brasilapi.com.br/docs#tag/Feriados'
    },
    // API de bancos
    BANCOS: {
      url: 'https://brasilapi.com.br/api/banks/v1',
      documentacao: 'https://brasilapi.com.br/docs#tag/BANKS'
    },
    // API de DDD
    DDD: {
      url: 'https://brasilapi.com.br/api/ddd/v1',
      documentacao: 'https://brasilapi.com.br/docs#tag/DDD'
    }
  }
} as const;

// Configurações de rate limiting e cache
export const API_CONFIG = {
  // Timeouts padrão
  TIMEOUT: {
    DEFAULT: 15000, // 15 segundos
    LONG: 30000,    // 30 segundos
    SHORT: 5000     // 5 segundos
  },

  // Cache TTL (Time To Live)
  CACHE_TTL: {
    CNPJ: 24 * 60 * 60 * 1000,      // 24 horas
    CEP: 30 * 24 * 60 * 60 * 1000,  // 30 dias
    INDICES: 60 * 60 * 1000,         // 1 hora
    SELIC: 24 * 60 * 60 * 1000,      // 24 horas
    CAMBIO: 60 * 60 * 1000           // 1 hora
  },

  // Rate limiting
  RATE_LIMITS: {
    RECEITAWS: {
      requests: 3,
      window: 60000 // 1 minuto
    },
    DEFAULT: {
      requests: 60,
      window: 60000 // 1 minuto
    }
  },

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY: 1000,
    MAX_DELAY: 10000,
    BACKOFF_FACTOR: 2
  }
} as const;

// Headers padrão para as requisições
export const DEFAULT_HEADERS = {
  'User-Agent': 'TributaAI/2.0 (https://tributa.ai)',
  'Accept': 'application/json',
  'Accept-Language': 'pt-BR,pt;q=0.9',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
} as const;

// Lista de estados brasileiros
export const ESTADOS_BRASIL = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
] as const;