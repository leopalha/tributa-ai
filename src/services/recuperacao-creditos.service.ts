import api from '@/lib/api';
import { apiMock } from '@/lib/api-mock';

export interface CreditoIdentificado {
  id: string;
  tipo: 'PIS/COFINS' | 'ICMS' | 'IRPJ/CSLL' | 'IPI' | 'ISS' | 'INSS';
  periodo: string;
  valor: number;
  probabilidade: number;
  status: 'Identificado' | 'Em análise' | 'Validado' | 'Rejeitado';
  prazoRecuperacao: string;
  complexidade: 'Baixa' | 'Média' | 'Alta';
  documentosNecessarios: string[];
  descricao: string;
  empresaId: string;
  dataIdentificacao: Date;
  observacoes?: string;
}

export interface ProcessoRecuperacao {
  id: string;
  tipo: string;
  valor: number;
  status: 'Em andamento' | 'Documentação' | 'Finalizado' | 'Cancelado';
  protocolo: string;
  dataInicio: string;
  prazoEstimado: string;
  etapaAtual: string;
  progresso: number;
  proximaAcao: string;
  responsavel: string;
  empresaId: string;
  creditoId: string;
  documentos: DocumentoProcesso[];
}

export interface DocumentoProcesso {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  dataUpload: Date;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
}

export interface AnaliseIA {
  id: string;
  empresaId: string;
  status: 'Processando' | 'Concluida' | 'Erro';
  progresso: number;
  etapaAtual: string;
  tempoEstimado: number;
  creditosEncontrados: number;
  valorTotal: number;
  dataInicio: Date;
  dataFim?: Date;
  detalhes: {
    documentosAnalisados: number;
    paginasProcessadas: number;
    alertas: string[];
  };
}

export interface ArquivoFiscal {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  empresaId: string;
  dataUpload: Date;
  status: 'Processando' | 'Processado' | 'Erro';
  tipoDocumento: 'DCTF' | 'EFD-Contribuições' | 'SPED Fiscal' | 'GIA' | 'ECF' | 'LALUR' | 'Outros';
  periodo: string;
  observacoes?: string;
}

export interface EstatisticasRecuperacao {
  totalIdentificado: number;
  emProcesso: number;
  recuperado: number;
  taxaSucesso: number;
  tempoMedio: string;
  processosAtivos: number;
  creditosPorTipo: Record<string, number>;
  performanceMensal: Array<{
    mes: string;
    valor: number;
    processos: number;
  }>;
}

export class RecuperacaoCreditosService {
  private baseUrl = '/api/recuperacao-creditos';
  private useMock = import.meta.env.DEV; // Usar mock apenas em desenvolvimento

  // Upload de arquivos fiscais
  async uploadArquivoFiscal(
    empresaId: string,
    arquivo: File,
    tipoDocumento: string,
    periodo: string,
    onProgress?: (progress: number) => void
  ): Promise<ArquivoFiscal> {
    if (this.useMock) {
      return apiMock.uploadArquivoFiscal(empresaId, arquivo, tipoDocumento, periodo, onProgress);
    }

    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('empresaId', empresaId);
    formData.append('tipoDocumento', tipoDocumento);
    formData.append('periodo', periodo);

    try {
      const response = await api.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      throw new Error('Falha no upload do arquivo');
    }
  }

  // Iniciar análise automática
  async iniciarAnaliseIA(
    empresaId: string,
    tipoAnalise: 'completa' | 'federal' | 'estadual' | 'municipal' = 'completa',
    periodoInicial?: string,
    periodoFinal?: string
  ): Promise<AnaliseIA> {
    if (this.useMock) {
      return apiMock.iniciarAnaliseIA(empresaId, tipoAnalise, periodoInicial, periodoFinal);
    }

    try {
      const response = await api.post(`${this.baseUrl}/analise`, {
        empresaId,
        tipoAnalise,
        periodoInicial,
        periodoFinal,
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao iniciar análise:', error);
      throw new Error('Falha ao iniciar análise');
    }
  }

  // Obter status da análise
  async obterStatusAnalise(analiseId: string): Promise<AnaliseIA> {
    try {
      const response = await api.get(`${this.baseUrl}/analise/${analiseId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status da análise:', error);
      throw new Error('Falha ao obter status da análise');
    }
  }

  // Listar créditos identificados
  async listarCreditosIdentificados(empresaId: string): Promise<CreditoIdentificado[]> {
    if (this.useMock) {
      return apiMock.listarCreditosIdentificados(empresaId);
    }

    try {
      const response = await api.get(`${this.baseUrl}/creditos/${empresaId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar créditos:', error);
      throw new Error('Falha ao carregar créditos identificados');
    }
  }

  // Iniciar processo de recuperação
  async iniciarProcessoRecuperacao(creditoId: string): Promise<ProcessoRecuperacao> {
    try {
      const response = await api.post(`${this.baseUrl}/processos`, {
        creditoId,
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao iniciar processo:', error);
      throw new Error('Falha ao iniciar processo de recuperação');
    }
  }

  // Listar processos de recuperação
  async listarProcessos(empresaId: string): Promise<ProcessoRecuperacao[]> {
    if (this.useMock) {
      return apiMock.listarProcessos(empresaId);
    }

    try {
      const response = await api.get(`${this.baseUrl}/processos/${empresaId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar processos:', error);
      throw new Error('Falha ao carregar processos');
    }
  }

  // Obter estatísticas
  async obterEstatisticas(empresaId: string): Promise<EstatisticasRecuperacao> {
    if (this.useMock) {
      return apiMock.obterEstatisticas(empresaId);
    }

    try {
      const response = await api.get(`${this.baseUrl}/estatisticas/${empresaId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw new Error('Falha ao carregar estatísticas');
    }
  }

  // Upload de documento para processo
  async uploadDocumentoProcesso(
    processoId: string,
    arquivo: File,
    tipo: string,
    onProgress?: (progress: number) => void
  ): Promise<DocumentoProcesso> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('tipo', tipo);

    try {
      const response = await api.post(
        `${this.baseUrl}/processos/${processoId}/documentos`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: progressEvent => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(progress);
            }
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload do documento:', error);
      throw new Error('Falha no upload do documento');
    }
  }

  // Listar arquivos fiscais
  async listarArquivosFiscais(empresaId: string): Promise<ArquivoFiscal[]> {
    if (this.useMock) {
      return apiMock.listarArquivosFiscais(empresaId);
    }

    try {
      const response = await api.get(`${this.baseUrl}/arquivos/${empresaId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      throw new Error('Falha ao carregar arquivos');
    }
  }

  // Deletar arquivo fiscal
  async deletarArquivoFiscal(arquivoId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/arquivos/${arquivoId}`);
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      throw new Error('Falha ao deletar arquivo');
    }
  }

  // Gerar relatório
  async gerarRelatorio(
    empresaId: string,
    tipo: 'completo' | 'executivo' | 'planilha',
    formato: 'pdf' | 'xlsx' = 'pdf'
  ): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/relatorios/${empresaId}`, {
        params: { tipo, formato },
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw new Error('Falha ao gerar relatório');
    }
  }

  // Tokenizar crédito recuperado
  async tokenizarCredito(creditoId: string, valor: number): Promise<any> {
    try {
      // 1. Tokeniza o crédito usando a API
      const response = await api.post(`${this.baseUrl}/tokenizar`, {
        creditoId,
        valor,
      });
      
      // 2. Importa o serviço de integração blockchain
      const { blockchainIntegrationService } = await import('@/services/blockchain-integration.service');
      
      // 3. Registra o token na blockchain
      const blockchainResult = await blockchainIntegrationService.tokenizeAsset(
        'TAX_CREDIT',
        valor,
        `Crédito Fiscal ID: ${creditoId}`
      );
      
      // 4. Retorna o resultado combinado
      return {
        ...response.data,
        blockchainTxId: blockchainResult.transactionHash,
        blockchainStatus: blockchainResult.status,
        tokenId: blockchainResult.tokenId
      };
    } catch (error) {
      console.error('Erro ao tokenizar crédito:', error);
      throw new Error('Falha ao tokenizar crédito');
    }
  }
}

export const recuperacaoCreditosService = new RecuperacaoCreditosService();
