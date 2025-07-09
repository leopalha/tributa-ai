// Mock para API de recuperação de créditos durante desenvolvimento
import {
  ArquivoFiscal,
  CreditoIdentificado,
  ProcessoRecuperacao,
  AnaliseIA,
  EstatisticasRecuperacao,
} from '@/services/recuperacao-creditos.service';

// Simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dados mockados
let mockArquivos: ArquivoFiscal[] = [];
let mockCreditos: CreditoIdentificado[] = [
  {
    id: '1',
    tipo: 'PIS/COFINS',
    periodo: '2020-2023',
    valor: 850000,
    probabilidade: 95,
    status: 'Identificado',
    prazoRecuperacao: '3-6 meses',
    complexidade: 'Baixa',
    documentosNecessarios: ['DCTF', 'EFD-Contribuições', 'Livro Caixa'],
    descricao: 'Créditos de PIS/COFINS sobre insumos não aproveitados adequadamente',
    empresaId: '1',
    dataIdentificacao: new Date(),
  },
  {
    id: '2',
    tipo: 'ICMS',
    periodo: '2021-2023',
    valor: 1200000,
    probabilidade: 78,
    status: 'Em análise',
    prazoRecuperacao: '6-12 meses',
    complexidade: 'Média',
    documentosNecessarios: ['Livros Fiscais', 'SPED Fiscal', 'GIA'],
    descricao: 'Créditos acumulados de ICMS em operações interestaduais',
    empresaId: '1',
    dataIdentificacao: new Date(),
  },
];

let mockProcessos: ProcessoRecuperacao[] = [
  {
    id: 'PROC001',
    tipo: 'PIS/COFINS',
    valor: 850000,
    status: 'Em andamento',
    protocolo: 'RF-2024-001234',
    dataInicio: '15/01/2024',
    prazoEstimado: '15/04/2024',
    etapaAtual: 'Análise documental',
    progresso: 65,
    proximaAcao: 'Aguardando resposta da Receita Federal',
    responsavel: 'João Silva - Especialista Tributário',
    empresaId: '1',
    creditoId: '1',
    documentos: [],
  },
];

const mockEstatisticas: EstatisticasRecuperacao = {
  totalIdentificado: 2700000,
  emProcesso: 2050000,
  recuperado: 450000,
  taxaSucesso: 87,
  tempoMedio: '5.2 meses',
  processosAtivos: 15,
  creditosPorTipo: {
    'PIS/COFINS': 65,
    ICMS: 25,
    'IRPJ/CSLL': 10,
  },
  performanceMensal: [
    { mes: 'Jan/2024', valor: 850000, processos: 3 },
    { mes: 'Dez/2023', valor: 720000, processos: 2 },
    { mes: 'Nov/2023', valor: 680000, processos: 4 },
  ],
};

// Mock das funções da API
export const apiMock = {
  // Upload de arquivo fiscal
  uploadArquivoFiscal: async (
    empresaId: string,
    arquivo: File,
    tipoDocumento: string,
    periodo: string,
    onProgress?: (progress: number) => void
  ): Promise<ArquivoFiscal> => {
    // Simular progresso de upload
    if (onProgress) {
      for (let i = 0; i <= 100; i += 10) {
        await delay(100);
        onProgress(i);
      }
    }

    const novoArquivo: ArquivoFiscal = {
      id: Date.now().toString(),
      nome: arquivo.name,
      tipo: arquivo.type,
      tamanho: arquivo.size,
      empresaId,
      dataUpload: new Date(),
      status: 'Processado',
      tipoDocumento: tipoDocumento as any,
      periodo,
      observacoes: 'Arquivo processado com sucesso',
    };

    mockArquivos.push(novoArquivo);
    return novoArquivo;
  },

  // Iniciar análise de IA
  iniciarAnaliseIA: async (
    empresaId: string,
    tipoAnalise: string,
    periodoInicial?: string,
    periodoFinal?: string
  ): Promise<AnaliseIA> => {
    await delay(1000);

    const analise: AnaliseIA = {
      id: Date.now().toString(),
      empresaId,
      status: 'Processando',
      progresso: 0,
      etapaAtual: 'Iniciando análise...',
      tempoEstimado: 300, // 5 minutos
      creditosEncontrados: 0,
      valorTotal: 0,
      dataInicio: new Date(),
      detalhes: {
        documentosAnalisados: 0,
        paginasProcessadas: 0,
        alertas: [],
      },
    };

    return analise;
  },

  // Obter status da análise
  obterStatusAnalise: async (analiseId: string): Promise<AnaliseIA> => {
    await delay(500);

    // Simular análise concluída
    const analise: AnaliseIA = {
      id: analiseId,
      empresaId: '1',
      status: 'Concluida',
      progresso: 100,
      etapaAtual: 'Análise concluída',
      tempoEstimado: 0,
      creditosEncontrados: 3,
      valorTotal: 2700000,
      dataInicio: new Date(Date.now() - 300000), // 5 minutos atrás
      dataFim: new Date(),
      detalhes: {
        documentosAnalisados: mockArquivos.length,
        paginasProcessadas: 1250,
        alertas: ['Possível duplicidade em crédito PIS/COFINS'],
      },
    };

    return analise;
  },

  // Listar créditos identificados
  listarCreditosIdentificados: async (empresaId: string): Promise<CreditoIdentificado[]> => {
    await delay(800);
    return mockCreditos.filter(c => c.empresaId === empresaId);
  },

  // Iniciar processo de recuperação
  iniciarProcessoRecuperacao: async (creditoId: string): Promise<ProcessoRecuperacao> => {
    await delay(1200);

    const credito = mockCreditos.find(c => c.id === creditoId);
    if (!credito) {
      throw new Error('Crédito não encontrado');
    }

    const novoProcesso: ProcessoRecuperacao = {
      id: `PROC${Date.now()}`,
      tipo: credito.tipo,
      valor: credito.valor,
      status: 'Em andamento',
      protocolo: `RF-2024-${Math.random().toString().substr(2, 6)}`,
      dataInicio: new Date().toLocaleDateString('pt-BR'),
      prazoEstimado: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      etapaAtual: 'Preparação de documentos',
      progresso: 10,
      proximaAcao: 'Aguardando documentação complementar',
      responsavel: 'Maria Silva - Especialista Tributário',
      empresaId: credito.empresaId,
      creditoId: creditoId,
      documentos: [],
    };

    mockProcessos.push(novoProcesso);
    return novoProcesso;
  },

  // Listar processos
  listarProcessos: async (empresaId: string): Promise<ProcessoRecuperacao[]> => {
    await delay(600);
    return mockProcessos.filter(p => p.empresaId === empresaId);
  },

  // Obter estatísticas
  obterEstatisticas: async (empresaId: string): Promise<EstatisticasRecuperacao> => {
    await delay(400);
    return mockEstatisticas;
  },

  // Listar arquivos fiscais
  listarArquivosFiscais: async (empresaId: string): Promise<ArquivoFiscal[]> => {
    await delay(300);
    return mockArquivos.filter(a => a.empresaId === empresaId);
  },

  // Deletar arquivo fiscal
  deletarArquivoFiscal: async (arquivoId: string): Promise<void> => {
    await delay(500);
    mockArquivos = mockArquivos.filter(a => a.id !== arquivoId);
  },

  // Gerar relatório
  gerarRelatorio: async (
    empresaId: string,
    tipo: string,
    formato: string = 'pdf'
  ): Promise<Blob> => {
    await delay(2000);

    // Simular geração de arquivo
    const content = `Relatório ${tipo} - Empresa ${empresaId}\nGerado em: ${new Date().toLocaleString('pt-BR')}`;
    return new Blob([content], {
      type:
        formato === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  },

  // Tokenizar crédito
  tokenizarCredito: async (creditoId: string, valor: number): Promise<any> => {
    await delay(1500);

    return {
      id: Date.now().toString(),
      creditoId,
      valor,
      tokenId: `TKN${Math.random().toString().substr(2, 8)}`,
      blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      status: 'Tokenizado',
      dataTokenizacao: new Date(),
    };
  },
};

// Interceptar chamadas da API para usar o mock durante desenvolvimento
export const setupApiMock = () => {
  // Esta função pode ser usada para interceptar chamadas reais da API
  // e redirecioná-las para o mock durante o desenvolvimento
  console.log('🚀 API Mock configurado para desenvolvimento');
};
