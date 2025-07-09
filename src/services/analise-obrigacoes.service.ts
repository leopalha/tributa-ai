import { prisma } from '@/lib/prisma';
import { AnaliseObrigacoes, CreditoIdentificado, DocumentoAnalise } from '@prisma/client';

export interface CriarAnaliseObrigacoesData {
  cnpjEmpresa: string;
  razaoSocialEmpresa: string;
  nomeFantasiaEmpresa?: string;
  regimeTributario: string;
  criadoPorId: string;
}

export interface DocumentoAnaliseData {
  nomeArquivo: string;
  tipoDocumento: string;
  tamanhoBytes: number;
  hashArquivo?: string;
  caminhoArmazenamento: string;
}

export interface CreditoIdentificadoData {
  tipo: string;
  descricao: string;
  valorNominal: number;
  valorAtual: number;
  valorEconomia: number;
  periodoInicio: Date;
  periodoFim: Date;
  tribunalOrigem?: string;
  numeroProcesso?: string;
  baseCalculoDetalhada?: string;
}

export class AnaliseObrigacoesService {
  /**
   * Criar uma nova análise de obrigações
   */
  static async criarAnalise(data: CriarAnaliseObrigacoesData): Promise<AnaliseObrigacoes> {
    return await prisma.analiseObrigacoes.create({
      data: {
        cnpjEmpresa: data.cnpjEmpresa,
        razaoSocialEmpresa: data.razaoSocialEmpresa,
        nomeFantasiaEmpresa: data.nomeFantasiaEmpresa,
        regimeTributario: data.regimeTributario,
        criadoPorId: data.criadoPorId,
        statusAnalise: 'PENDENTE',
      },
      include: {
        creditosIdentificados: true,
        documentosAnalise: true,
      },
    });
  }

  /**
   * Buscar análise por ID
   */
  static async buscarAnalise(id: string): Promise<AnaliseObrigacoes | null> {
    return await prisma.analiseObrigacoes.findUnique({
      where: { id },
      include: {
        creditosIdentificados: true,
        documentosAnalise: true,
        criadoPor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Buscar análises por usuário
   */
  static async buscarAnalisesPorUsuario(userId: string): Promise<AnaliseObrigacoes[]> {
    return await prisma.analiseObrigacoes.findMany({
      where: { criadoPorId: userId },
      include: {
        creditosIdentificados: true,
        documentosAnalise: true,
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  /**
   * Buscar análise por CNPJ
   */
  static async buscarAnalisePorCNPJ(cnpj: string): Promise<AnaliseObrigacoes | null> {
    return await prisma.analiseObrigacoes.findFirst({
      where: { cnpjEmpresa: cnpj },
      include: {
        creditosIdentificados: true,
        documentosAnalise: true,
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  /**
   * Iniciar análise (atualizar status)
   */
  static async iniciarAnalise(id: string): Promise<AnaliseObrigacoes> {
    return await prisma.analiseObrigacoes.update({
      where: { id },
      data: {
        statusAnalise: 'PROCESSANDO',
        dataInicioAnalise: new Date(),
      },
      include: {
        creditosIdentificados: true,
        documentosAnalise: true,
      },
    });
  }

  /**
   * Concluir análise
   */
  static async concluirAnalise(
    id: string,
    estatisticas: {
      totalDocumentos: number;
      totalItensProcessados: number;
      totalReceitasSegregadas: number;
      valorTotalCreditos: number;
    }
  ): Promise<AnaliseObrigacoes> {
    return await prisma.analiseObrigacoes.update({
      where: { id },
      data: {
        statusAnalise: 'CONCLUIDO',
        dataConclusaoAnalise: new Date(),
        totalDocumentos: estatisticas.totalDocumentos,
        totalItensProcessados: estatisticas.totalItensProcessados,
        totalReceitasSegregadas: estatisticas.totalReceitasSegregadas,
        valorTotalCreditos: estatisticas.valorTotalCreditos,
      },
      include: {
        creditosIdentificados: true,
        documentosAnalise: true,
      },
    });
  }

  /**
   * Adicionar documento à análise
   */
  static async adicionarDocumento(
    analiseId: string,
    documentoData: DocumentoAnaliseData
  ): Promise<DocumentoAnalise> {
    return await prisma.documentoAnalise.create({
      data: {
        analiseObrigacoesId: analiseId,
        nomeArquivo: documentoData.nomeArquivo,
        tipoDocumento: documentoData.tipoDocumento,
        tamanhoBytes: documentoData.tamanhoBytes,
        hashArquivo: documentoData.hashArquivo,
        caminhoArmazenamento: documentoData.caminhoArmazenamento,
        statusProcessamento: 'PENDENTE',
      },
    });
  }

  /**
   * Adicionar crédito identificado
   */
  static async adicionarCreditoIdentificado(
    analiseId: string,
    creditoData: CreditoIdentificadoData
  ): Promise<CreditoIdentificado> {
    return await prisma.creditoIdentificado.create({
      data: {
        analiseObrigacoesId: analiseId,
        tipo: creditoData.tipo,
        descricao: creditoData.descricao,
        valorNominal: creditoData.valorNominal,
        valorAtual: creditoData.valorAtual,
        valorEconomia: creditoData.valorEconomia,
        periodoInicio: creditoData.periodoInicio,
        periodoFim: creditoData.periodoFim,
        tribunalOrigem: creditoData.tribunalOrigem,
        numeroProcesso: creditoData.numeroProcesso,
        baseCalculoDetalhada: creditoData.baseCalculoDetalhada,
        statusCredito: 'IDENTIFICADO',
        podeCompensar: true,
      },
    });
  }

  /**
   * Buscar créditos identificados por análise
   */
  static async buscarCreditosIdentificados(analiseId: string): Promise<CreditoIdentificado[]> {
    return await prisma.creditoIdentificado.findMany({
      where: { analiseObrigacoesId: analiseId },
      include: {
        creditTitle: true,
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  /**
   * Buscar todos os créditos identificados de um usuário
   */
  static async buscarTodosCreditosUsuario(userId: string): Promise<CreditoIdentificado[]> {
    return await prisma.creditoIdentificado.findMany({
      where: {
        analiseObrigacoes: {
          criadoPorId: userId,
        },
      },
      include: {
        analiseObrigacoes: true,
        creditTitle: true,
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  /**
   * Atualizar status de crédito
   */
  static async atualizarStatusCredito(
    creditoId: string,
    status: string
  ): Promise<CreditoIdentificado> {
    return await prisma.creditoIdentificado.update({
      where: { id: creditoId },
      data: { statusCredito: status },
    });
  }

  /**
   * Processar análise completa (simular IA)
   */
  static async processarAnaliseCompleta(
    analiseId: string,
    documentos: DocumentoAnaliseData[]
  ): Promise<AnaliseObrigacoes> {
    // Simular processamento de documentos e identificação de créditos
    const creditosEncontrados: CreditoIdentificadoData[] = [
      {
        tipo: 'PIS/COFINS',
        descricao: 'Crédito de energia elétrica industrial',
        valorNominal: 89500.0,
        valorAtual: 89500.0,
        valorEconomia: 8950.0,
        periodoInicio: new Date('2023-01-01'),
        periodoFim: new Date('2023-12-31'),
        tribunalOrigem: 'Receita Federal',
        numeroProcesso: 'RF-2023-001',
        baseCalculoDetalhada: JSON.stringify({
          aliquota: 0.1,
          baseCalculo: 895000,
          detalhes: 'Energia elétrica consumida no processo industrial',
        }),
      },
      {
        tipo: 'ICMS',
        descricao: 'Diferencial de alíquota ICMS',
        valorNominal: 45200.0,
        valorAtual: 45200.0,
        valorEconomia: 4520.0,
        periodoInicio: new Date('2023-01-01'),
        periodoFim: new Date('2023-12-31'),
        tribunalOrigem: 'SEFAZ-SP',
        numeroProcesso: 'ICMS-2023-002',
        baseCalculoDetalhada: JSON.stringify({
          aliquota: 0.18,
          baseCalculo: 251111,
          detalhes: 'Diferencial de alíquota em operações interestaduais',
        }),
      },
      {
        tipo: 'IRPJ/CSLL',
        descricao: 'Pagamento indevido de impostos federais',
        valorNominal: 67800.0,
        valorAtual: 67800.0,
        valorEconomia: 6780.0,
        periodoInicio: new Date('2022-01-01'),
        periodoFim: new Date('2022-12-31'),
        tribunalOrigem: 'Receita Federal',
        numeroProcesso: 'IRPJ-2022-003',
        baseCalculoDetalhada: JSON.stringify({
          aliquota: 0.25,
          baseCalculo: 271200,
          detalhes: 'Pagamento a maior em apuração anual',
        }),
      },
    ];

    // Adicionar documentos
    for (const doc of documentos) {
      await this.adicionarDocumento(analiseId, doc);
    }

    // Adicionar créditos identificados
    for (const credito of creditosEncontrados) {
      await this.adicionarCreditoIdentificado(analiseId, credito);
    }

    // Calcular estatísticas
    const valorTotalCreditos = creditosEncontrados.reduce(
      (total, credito) => total + credito.valorNominal,
      0
    );

    const estatisticas = {
      totalDocumentos: documentos.length,
      totalItensProcessados: creditosEncontrados.length,
      totalReceitasSegregadas: valorTotalCreditos,
      valorTotalCreditos: valorTotalCreditos,
    };

    // Concluir análise
    return await this.concluirAnalise(analiseId, estatisticas);
  }

  /**
   * Obter estatísticas gerais
   */
  static async obterEstatisticasGerais(userId: string) {
    const analises = await prisma.analiseObrigacoes.findMany({
      where: { criadoPorId: userId },
      include: {
        creditosIdentificados: true,
        documentosAnalise: true,
      },
    });

    const totalAnalises = analises.length;
    const totalCreditos = analises.reduce(
      (total, analise) => total + analise.creditosIdentificados.length,
      0
    );
    const valorTotalIdentificado = analises.reduce(
      (total, analise) => total + analise.valorTotalCreditos,
      0
    );

    return {
      totalAnalises,
      totalCreditos,
      valorTotalIdentificado,
      analisesRecentes: analises.slice(0, 5),
    };
  }
}
