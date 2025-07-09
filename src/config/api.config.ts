// Configuração centralizada da API
// ================================

export const API_CONFIG = {
  // Base URLs
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  BLOCKCHAIN_URL: import.meta.env.VITE_BLOCKCHAIN_URL || 'http://localhost:3001/blockchain',

  // Feature Flags
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  USE_MOCK_BLOCKCHAIN: import.meta.env.VITE_USE_MOCK_BLOCKCHAIN === 'true',

  // API Endpoints
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      VERIFY: '/auth/verify',
      RESET_PASSWORD: '/auth/reset-password',
    },

    // Empresas
    EMPRESAS: {
      LIST: '/empresas',
      GET: (id: string) => `/empresas/${id}`,
      CREATE: '/empresas',
      UPDATE: (id: string) => `/empresas/${id}`,
      DELETE: (id: string) => `/empresas/${id}`,
      DASHBOARD: (id: string) => `/empresas/${id}/dashboard`,
    },

    // Títulos de Crédito
    TCS: {
      LIST: '/tcs',
      GET: (id: string) => `/tcs/${id}`,
      CREATE: '/tcs',
      UPDATE: (id: string) => `/tcs/${id}`,
      DELETE: (id: string) => `/tcs/${id}`,
      TOKENIZE: (id: string) => `/tcs/${id}/tokenize`,
      HISTORY: (id: string) => `/tcs/${id}/history`,
      VALIDATE: (id: string) => `/tcs/${id}/validate`,
    },

    // Compensações
    COMPENSACOES: {
      LIST: '/compensacoes',
      GET: (id: string) => `/compensacoes/${id}`,
      CREATE: '/compensacoes',
      UPDATE: (id: string) => `/compensacoes/${id}`,
      DELETE: (id: string) => `/compensacoes/${id}`,
      SIMULATE: '/compensacoes/simulate',
      PROCESS: (id: string) => `/compensacoes/${id}/process`,
      APPROVE: (id: string) => `/compensacoes/${id}/approve`,
      REJECT: (id: string) => `/compensacoes/${id}/reject`,
      REGISTER_BLOCKCHAIN: (id: string) => `/compensacoes/${id}/register-blockchain`,
    },

    // Marketplace
    MARKETPLACE: {
      LISTINGS: '/marketplace/listings',
      GET_LISTING: (id: string) => `/marketplace/listings/${id}`,
      CREATE_LISTING: '/marketplace/listings',
      UPDATE_LISTING: (id: string) => `/marketplace/listings/${id}`,
      DELETE_LISTING: (id: string) => `/marketplace/listings/${id}`,
      PLACE_BID: (listingId: string) => `/marketplace/listings/${listingId}/bids`,
      GET_BIDS: (listingId: string) => `/marketplace/listings/${listingId}/bids`,
      ACCEPT_BID: (listingId: string, bidId: string) =>
        `/marketplace/listings/${listingId}/bids/${bidId}/accept`,
      REJECT_BID: (listingId: string, bidId: string) =>
        `/marketplace/listings/${listingId}/bids/${bidId}/reject`,
      STATS: '/marketplace/stats',
      SEARCH: '/marketplace/search',
    },

    // Obrigações Fiscais
    OBRIGACOES: {
      LIST: '/obrigacoes',
      GET: (id: string) => `/obrigacoes/${id}`,
      CREATE: '/obrigacoes',
      UPDATE: (id: string) => `/obrigacoes/${id}`,
      DELETE: (id: string) => `/obrigacoes/${id}`,
      CALENDAR: '/obrigacoes/calendar',
      PENDING: '/obrigacoes/pending',
      CALCULATE: (id: string) => `/obrigacoes/${id}/calculate`,
      PAY: (id: string) => `/obrigacoes/${id}/pay`,
    },

    // Blockchain
    BLOCKCHAIN: {
      STATUS: '/blockchain/status',
      QUERY: '/blockchain/query',
      INVOKE: '/blockchain/invoke',
      HISTORY: (key: string) => `/blockchain/history/${key}`,
      PEERS: '/blockchain/peers',
      CHANNELS: '/blockchain/channels',
      CONTRACTS: '/blockchain/contracts',
      TRANSACTIONS: '/blockchain/transactions',
      BLOCKS: '/blockchain/blocks',
    },

    // Analytics
    ANALYTICS: {
      DASHBOARD: '/analytics/dashboard',
      METRICS: '/analytics/metrics',
      REPORTS: '/analytics/reports',
      EXPORT: '/analytics/export',
      INSIGHTS: '/analytics/insights',
      PREDICTIONS: '/analytics/predictions',
    },

    // Notificações
    NOTIFICATIONS: {
      LIST: '/notifications',
      GET: (id: string) => `/notifications/${id}`,
      MARK_READ: (id: string) => `/notifications/${id}/read`,
      MARK_ALL_READ: '/notifications/read-all',
      DELETE: (id: string) => `/notifications/${id}`,
      SETTINGS: '/notifications/settings',
    },

    // Integrações Governamentais
    GOV: {
      RECEITA_FEDERAL: {
        CONSULTA_CNPJ: '/gov/receita-federal/cnpj',
        CONSULTA_CPF: '/gov/receita-federal/cpf',
        SITUACAO_FISCAL: '/gov/receita-federal/situacao-fiscal',
      },
      SEFAZ: {
        CONSULTA_NFE: '/gov/sefaz/nfe',
        CONSULTA_CTE: '/gov/sefaz/cte',
        SALDO_CREDITOS: '/gov/sefaz/creditos',
      },
    },

    // Relatórios
    REPORTS: {
      GENERATE: '/reports/generate',
      LIST: '/reports',
      GET: (id: string) => `/reports/${id}`,
      DOWNLOAD: (id: string) => `/reports/${id}/download`,
      SCHEDULE: '/reports/schedule',
    },

    // Configurações
    SETTINGS: {
      GET: '/settings',
      UPDATE: '/settings',
      SECURITY: '/settings/security',
      NOTIFICATIONS: '/settings/notifications',
      INTEGRATIONS: '/settings/integrations',
    },
  },

  // Timeouts
  TIMEOUTS: {
    DEFAULT: 30000, // 30 segundos
    UPLOAD: 300000, // 5 minutos
    BLOCKCHAIN: 60000, // 1 minuto
    REPORT: 120000, // 2 minutos
  },

  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'X-App-Version': import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
};

// Helper para construir URLs completas
export const buildUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper para endpoints de blockchain
export const buildBlockchainUrl = (endpoint: string): string => {
  return `${API_CONFIG.BLOCKCHAIN_URL}${endpoint}`;
};

export default API_CONFIG;
