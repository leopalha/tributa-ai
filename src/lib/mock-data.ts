// Mock data para demonstração das funcionalidades da plataforma Tributa.AI

export const mockCreditTitles = [
  {
    id: 'ct1',
    title: 'Crédito ICMS São Paulo - Empresa ABC Ltda',
    value: 125000,
    category: 'TRIBUTARIO',
    status: 'VALIDATED',
    issueDate: '2024-01-15',
    dueDate: '2024-12-31',
    issuerName: 'Secretaria da Fazenda - SP',
    debtorName: 'Empresa ABC Ltda',
    description: 'Crédito de ICMS referente ao período de janeiro/2024',
  },
  {
    id: 'ct2',
    title: 'Precatório Federal - TRF-3',
    value: 280000,
    category: 'JUDICIAL',
    status: 'VALIDATED',
    issueDate: '2023-11-20',
    dueDate: '2025-06-30',
    issuerName: 'Tribunal Regional Federal da 3ª Região',
    debtorName: 'União Federal',
    description: 'Precatório judicial referente a processo tributário',
  },
  {
    id: 'ct3',
    title: 'Crédito PIS/COFINS - Recuperação',
    value: 95000,
    category: 'TRIBUTARIO',
    status: 'VALIDATED',
    issueDate: '2024-02-10',
    dueDate: '2024-11-15',
    issuerName: 'Receita Federal do Brasil',
    debtorName: 'Empresa XYZ S.A.',
    description: 'Crédito de PIS/COFINS para recuperação',
  },
];

export const mockAnuncios = [
  {
    id: 'anuncio1',
    creditTitleId: 'ct1',
    sellerId: 'user-1',
    type: 'VENDA_DIRETA',
    askingPrice: 106250, // 15% de desconto
    discount: 15,
    status: 'ACTIVE',
    createdAt: '2024-01-20T10:00:00Z',
    creditTitle: {
      title: 'Crédito ICMS São Paulo - Empresa ABC Ltda',
      category: 'TRIBUTARIO',
      value: 125000,
    },
    seller: {
      name: 'João Silva',
      email: 'joao@empresa.com',
    },
  },
  {
    id: 'anuncio2',
    creditTitleId: 'ct2',
    sellerId: 'user-2',
    type: 'LEILAO',
    askingPrice: 252000, // 10% de desconto
    discount: 10,
    status: 'ACTIVE',
    createdAt: '2024-01-18T14:30:00Z',
    creditTitle: {
      title: 'Precatório Federal - TRF-3',
      category: 'JUDICIAL',
      value: 280000,
    },
    seller: {
      name: 'Maria Santos',
      email: 'maria@consultoria.com',
    },
  },
  {
    id: 'anuncio3',
    creditTitleId: 'ct3',
    sellerId: 'user-3',
    type: 'OFERTA',
    askingPrice: 90250, // 5% de desconto
    discount: 5,
    status: 'ACTIVE',
    createdAt: '2024-01-22T09:15:00Z',
    creditTitle: {
      title: 'Crédito PIS/COFINS - Recuperação',
      category: 'TRIBUTARIO',
      value: 95000,
    },
    seller: {
      name: 'Carlos Oliveira',
      email: 'carlos@financeira.com',
    },
  },
];

export const mockPropostas = [
  {
    id: 'prop1',
    anuncioId: 'anuncio1',
    compradorId: 'user-2',
    vendedorId: 'user-1',
    valorProposta: 100000,
    quantidade: 1,
    status: 'PENDENTE',
    mensagem: 'Gostaria de adquirir este crédito. Podemos negociar o valor?',
    dataCriacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dataExpiracao: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    anuncio: {
      id: 'anuncio1',
      titulo: 'Crédito ICMS São Paulo - Empresa ABC Ltda',
      valorOriginal: 125000,
      valorAnuncio: 106250,
    },
    comprador: {
      id: 'user-2',
      nome: 'Maria Santos',
    },
    vendedor: {
      id: 'user-1',
      nome: 'João Silva',
    },
  },
  {
    id: 'prop2',
    anuncioId: 'anuncio2',
    compradorId: 'user-3',
    vendedorId: 'user-2',
    valorProposta: 240000,
    quantidade: 1,
    status: 'ACEITA',
    mensagem: 'Proposta para aquisição do precatório.',
    dataCriacao: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    dataExpiracao: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    anuncio: {
      id: 'anuncio2',
      titulo: 'Precatório Federal - TRF-3',
      valorOriginal: 280000,
      valorAnuncio: 252000,
    },
    comprador: {
      id: 'user-3',
      nome: 'Carlos Oliveira',
    },
    vendedor: {
      id: 'user-2',
      nome: 'Maria Santos',
    },
  },
];

export const mockTokens = [
  {
    id: 'token_1',
    creditTitleId: 'ct1',
    tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
    tokenId: 123456,
    quantidade: 1,
    status: 'TOKENIZADO',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    transactionHash: '0xabcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    blockchainNetwork: 'Hyperledger Fabric',
    creditTitle: {
      title: 'Crédito ICMS São Paulo - Empresa ABC Ltda',
      value: 125000,
      category: 'TRIBUTARIO',
    },
  },
  {
    id: 'token_2',
    creditTitleId: 'ct2',
    tokenAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    tokenId: 789012,
    quantidade: 1,
    status: 'TOKENIZADO',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    transactionHash: '0x1234abcd567890ef1234abcd567890ef1234abcd567890ef1234abcd567890ef',
    blockchainNetwork: 'Hyperledger Fabric',
    creditTitle: {
      title: 'Precatório Federal - TRF-3',
      value: 280000,
      category: 'JUDICIAL',
    },
  },
];

export const mockTransacoes = [
  {
    id: 'tx1',
    tipo: 'COMPRA',
    anuncioId: 'anuncio1',
    compradorId: 'user-2',
    vendedorId: 'user-1',
    valor: 106250,
    status: 'CONCLUIDA',
    dataTransacao: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    hashTransacao: '0xdef123456789abcdef123456789abcdef123456789abcdef123456789abcdef12',
  },
  {
    id: 'tx2',
    tipo: 'TOKENIZACAO',
    creditTitleId: 'ct2',
    userId: 'user-2',
    valor: 280000,
    status: 'CONCLUIDA',
    dataTransacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    hashTransacao: '0x789abcdef123456789abcdef123456789abcdef123456789abcdef123456789abc',
  },
];

export const mockUsuarios = [
  {
    id: 'user-1',
    nome: 'João Silva',
    email: 'joao@empresa.com',
    role: 'USER',
    emailVerified: true,
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'user-2',
    nome: 'Maria Santos',
    email: 'maria@consultoria.com',
    role: 'USER',
    emailVerified: true,
    createdAt: '2024-01-12T14:30:00Z',
  },
  {
    id: 'user-3',
    nome: 'Carlos Oliveira',
    email: 'carlos@financeira.com',
    role: 'USER',
    emailVerified: true,
    createdAt: '2024-01-15T09:15:00Z',
  },
];

// Funções auxiliares para trabalhar com os dados mockados
export const getMockAnuncioById = (id: string) => {
  return mockAnuncios.find(anuncio => anuncio.id === id);
};

export const getMockPropostasByUserId = (userId: string) => {
  return mockPropostas.filter(
    proposta => proposta.compradorId === userId || proposta.vendedorId === userId
  );
};

export const getMockTokensByUserId = (userId: string) => {
  // Simular que o usuário atual possui todos os tokens
  return mockTokens;
};

export const getMockCreditTitlesByStatus = (status: string) => {
  return mockCreditTitles.filter(ct => ct.status === status);
};

// Estatísticas mockadas do marketplace
export const mockMarketplaceStats = {
  totalTCs: 156,
  valorTotalEmCarteira: 45750000,
  valorTotalNegociado: 12850000,
  tcsAtivos: 89,
  tcsPorTipo: {
    tributario: 67,
    comercial: 34,
    financeiro: 21,
    judicial: 18,
    rural: 8,
    imobiliario: 5,
    ambiental: 2,
    especial: 1,
  },
  tcsPorStatus: {
    disponivel: 89,
    reservado: 12,
    vendido: 28,
    tokenizado: 15,
    compensado: 8,
    vencido: 3,
    cancelado: 1,
  },
  volumeNegociacaoPeriodo: {
    diario: 450000,
    semanal: 2800000,
    mensal: 12850000,
    anual: 98500000,
  },
  transacoesRecentes: {
    quantidade: 47,
    valorMedio: 273400,
    variacaoPercentual: 15.3,
  },
  topEmissores: [
    {
      id: 'emissor1',
      nome: 'Secretaria da Fazenda - SP',
      quantidade: 45,
      valorTotal: 18750000,
    },
    {
      id: 'emissor2',
      nome: 'Tribunal Regional Federal',
      quantidade: 28,
      valorTotal: 12300000,
    },
    {
      id: 'emissor3',
      nome: 'Receita Federal do Brasil',
      quantidade: 34,
      valorTotal: 9850000,
    },
  ],
  tendenciaPrecos: [
    {
      data: new Date('2024-01-01'),
      valorMedio: 250000,
      volume: 1200000,
    },
    {
      data: new Date('2024-01-15'),
      valorMedio: 265000,
      volume: 1450000,
    },
    {
      data: new Date('2024-01-30'),
      valorMedio: 273400,
      volume: 1680000,
    },
  ],
  liquidezPorTipo: {
    tributario: { tempoMedioNegociacao: 12, volumeDiario: 180000, spread: 2.5 },
    comercial: { tempoMedioNegociacao: 8, volumeDiario: 120000, spread: 1.8 },
    financeiro: { tempoMedioNegociacao: 15, volumeDiario: 85000, spread: 3.2 },
    judicial: { tempoMedioNegociacao: 25, volumeDiario: 95000, spread: 4.1 },
    rural: { tempoMedioNegociacao: 18, volumeDiario: 45000, spread: 2.9 },
    imobiliario: { tempoMedioNegociacao: 22, volumeDiario: 35000, spread: 3.5 },
    ambiental: { tempoMedioNegociacao: 30, volumeDiario: 25000, spread: 5.2 },
    especial: { tempoMedioNegociacao: 35, volumeDiario: 15000, spread: 6.8 },
  },
};
