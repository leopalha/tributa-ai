// API para teste de coleta de dados do roadmap
interface ApiRequest {
  method: string;
  body: {
    cnpj: string;
    sources?: string[];
  };
}

interface ApiResponse {
  status: (code: number) => { json: (data: any) => void };
}

// Simular dados de resposta das fontes
const MOCK_DATA_SOURCES = {
  'pgfn-fazenda-nacional': {
    name: 'PGFN - Procuradoria Fazenda Nacional',
    status: 'IMPLEMENTADO',
    generateData: (cnpj: string) => ({
      success: true,
      recordsFound: Math.floor(Math.random() * 5) + 1,
      totalValue: Math.floor(Math.random() * 500000) + 50000,
      opportunities: Math.floor(Math.random() * 3) + 1,
      data: {
        devedores: [
          {
            documento: cnpj,
            nome: 'Empresa Exemplo LTDA',
            valorDivida: Math.floor(Math.random() * 200000) + 50000,
            situacao: 'ATIVA',
            dataInscricao: '2023-01-15',
          },
        ],
      },
    }),
  },
  'receita-federal-empresas': {
    name: 'Receita Federal - Dados Empresariais',
    status: 'FÁCIL',
    generateData: (cnpj: string) => ({
      success: true,
      recordsFound: 1,
      totalValue: 0,
      opportunities: 0,
      data: {
        cnpj: cnpj,
        razaoSocial: 'EMPRESA EXEMPLO LTDA',
        situacao: 'ATIVA',
        capitalSocial: 100000,
        regimeTributario: 'Lucro Presumido',
      },
    }),
  },
  'sefaz-sp': {
    name: 'SEFAZ-SP - Secretaria Fazenda SP',
    status: 'MÉDIO',
    generateData: (cnpj: string) => ({
      success: true,
      recordsFound: Math.floor(Math.random() * 3) + 1,
      totalValue: Math.floor(Math.random() * 300000) + 75000,
      opportunities: Math.floor(Math.random() * 2) + 1,
      data: {
        creditosICMS: [
          {
            documento: cnpj,
            valorCredito: Math.floor(Math.random() * 150000) + 25000,
            periodo: '2023-2024',
            situacao: 'DISPONIVEL',
          },
        ],
      },
    }),
  },
  'cnj-precatorios': {
    name: 'CNJ - Precatórios Nacionais',
    status: 'FÁCIL',
    generateData: (cnpj: string) => ({
      success: true,
      recordsFound: Math.floor(Math.random() * 2) + 1,
      totalValue: Math.floor(Math.random() * 800000) + 100000,
      opportunities: Math.floor(Math.random() * 2) + 1,
      data: {
        precatorios: [
          {
            numero: `CNJ-${Date.now()}`,
            beneficiario: cnpj,
            valor: Math.floor(Math.random() * 400000) + 50000,
            tribunal: 'TJSP',
            situacao: 'AGUARDANDO_PAGAMENTO',
          },
        ],
      },
    }),
  },
  'cvm-debentures': {
    name: 'CVM - Debêntures e Bonds',
    status: 'FÁCIL',
    generateData: (cnpj: string) => ({
      success: true,
      recordsFound: Math.floor(Math.random() * 2),
      totalValue: Math.floor(Math.random() * 2000000) + 200000,
      opportunities: Math.floor(Math.random() * 2),
      data: {
        debentures: [
          {
            emissor: cnpj,
            serie: 'DEB001',
            valorNominal: Math.floor(Math.random() * 1000000) + 100000,
            vencimento: '2025-12-31',
            situacao: 'ATIVA',
          },
        ],
      },
    }),
  },
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cnpj, sources } = req.body;

  if (!cnpj) {
    return res.status(400).json({ error: 'CNPJ é obrigatório' });
  }

  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  if (cnpjLimpo.length !== 14) {
    return res.status(400).json({ error: 'CNPJ deve ter 14 dígitos' });
  }

  try {
    console.log(`🔍 Iniciando coleta para CNPJ: ${cnpj}`);

    const results = [];
    const sourcesToCollect = sources || Object.keys(MOCK_DATA_SOURCES);

    for (const sourceId of sourcesToCollect) {
      const source = MOCK_DATA_SOURCES[sourceId];

      if (!source) {
        console.warn(`Fonte não encontrada: ${sourceId}`);
        continue;
      }

      console.log(`📊 Coletando dados de: ${source.name}`);

      // Simular tempo de processamento
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

      try {
        const sourceResult = source.generateData(cnpj);

        results.push({
          sourceId,
          sourceName: source.name,
          status: source.status,
          ...sourceResult,
          processingTime: Math.floor(Math.random() * 2000) + 500,
          timestamp: new Date(),
        });

        console.log(`✅ ${source.name}: ${sourceResult.recordsFound} registros encontrados`);
      } catch (error) {
        console.error(`❌ Erro em ${source.name}:`, error);
        results.push({
          sourceId,
          sourceName: source.name,
          status: source.status,
          success: false,
          recordsFound: 0,
          totalValue: 0,
          opportunities: 0,
          error: error.message,
          processingTime: Math.floor(Math.random() * 1000) + 200,
          timestamp: new Date(),
        });
      }
    }

    // Calcular estatísticas totais
    const totalRecords = results.reduce((sum, r) => sum + (r.success ? r.recordsFound : 0), 0);
    const totalValue = results.reduce((sum, r) => sum + (r.success ? r.totalValue : 0), 0);
    const totalOpportunities = results.reduce(
      (sum, r) => sum + (r.success ? r.opportunities : 0),
      0
    );
    const successfulSources = results.filter(r => r.success).length;
    const totalProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0);

    console.log(
      `🎯 Coleta concluída: ${totalRecords} registros, R$ ${totalValue.toLocaleString('pt-BR')}, ${totalOpportunities} oportunidades`
    );

    res.status(200).json({
      success: true,
      cnpj,
      summary: {
        totalSources: sourcesToCollect.length,
        successfulSources,
        totalRecords,
        totalValue,
        totalOpportunities,
        totalProcessingTime,
        successRate: (successfulSources / sourcesToCollect.length) * 100,
      },
      results,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('❌ Erro na coleta de dados:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date(),
    });
  }
}
