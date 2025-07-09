import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  recuperacaoCreditosService,
  CreditoIdentificado,
  ProcessoRecuperacao,
  AnaliseIA,
  ArquivoFiscal,
  EstatisticasRecuperacao,
} from '@/services/recuperacao-creditos.service';

export function useRecuperacaoCreditos(empresaId?: string) {
  const [loading, setLoading] = useState(false);
  const [creditos, setCreditos] = useState<CreditoIdentificado[]>([]);
  const [processos, setProcessos] = useState<ProcessoRecuperacao[]>([]);
  const [arquivos, setArquivos] = useState<ArquivoFiscal[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasRecuperacao | null>(null);
  const [analiseAtual, setAnaliseAtual] = useState<AnaliseIA | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Carregar dados iniciais
  useEffect(() => {
    if (empresaId) {
      carregarDados();
    }
  }, [empresaId]);

  const carregarDados = async () => {
    if (!empresaId) return;

    try {
      setLoading(true);

      // Carregar todos os dados em paralelo
      const [creditosData, processosData, arquivosData, estatisticasData] = await Promise.all([
        recuperacaoCreditosService.listarCreditosIdentificados(empresaId),
        recuperacaoCreditosService.listarProcessos(empresaId),
        recuperacaoCreditosService.listarArquivosFiscais(empresaId),
        recuperacaoCreditosService.obterEstatisticas(empresaId),
      ]);

      setCreditos(creditosData);
      setProcessos(processosData);
      setArquivos(arquivosData);
      setEstatisticas(estatisticasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados da recuperação de créditos');
    } finally {
      setLoading(false);
    }
  };

  // Upload de arquivo fiscal
  const uploadArquivo = async (arquivo: File, tipoDocumento: string, periodo: string) => {
    if (!empresaId) {
      toast.error('Empresa não selecionada');
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      const arquivoFiscal = await recuperacaoCreditosService.uploadArquivoFiscal(
        empresaId,
        arquivo,
        tipoDocumento,
        periodo,
        progress => setUploadProgress(progress)
      );

      setArquivos(prev => [...prev, arquivoFiscal]);
      toast.success('Arquivo enviado com sucesso!');

      return arquivoFiscal;
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar arquivo');
      throw error;
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Iniciar análise de IA
  const iniciarAnalise = async (
    tipoAnalise: 'completa' | 'federal' | 'estadual' | 'municipal' = 'completa',
    periodoInicial?: string,
    periodoFinal?: string
  ) => {
    if (!empresaId) {
      toast.error('Empresa não selecionada');
      return;
    }

    try {
      setLoading(true);

      const analise = await recuperacaoCreditosService.iniciarAnaliseIA(
        empresaId,
        tipoAnalise,
        periodoInicial,
        periodoFinal
      );

      setAnaliseAtual(analise);
      toast.success('Análise iniciada com sucesso!');

      // Polling para acompanhar o progresso
      const intervalo = setInterval(async () => {
        try {
          const analiseAtualizada = await recuperacaoCreditosService.obterStatusAnalise(analise.id);
          setAnaliseAtual(analiseAtualizada);

          if (analiseAtualizada.status === 'Concluida') {
            clearInterval(intervalo);
            toast.success('Análise concluída!');
            // Recarregar créditos identificados
            carregarCreditos();
          } else if (analiseAtualizada.status === 'Erro') {
            clearInterval(intervalo);
            toast.error('Erro na análise');
          }
        } catch (error) {
          clearInterval(intervalo);
          console.error('Erro ao verificar status da análise:', error);
        }
      }, 5000);

      return analise;
    } catch (error) {
      console.error('Erro ao iniciar análise:', error);
      toast.error('Erro ao iniciar análise');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Carregar apenas créditos
  const carregarCreditos = async () => {
    if (!empresaId) return;

    try {
      const creditosData = await recuperacaoCreditosService.listarCreditosIdentificados(empresaId);
      setCreditos(creditosData);
    } catch (error) {
      console.error('Erro ao carregar créditos:', error);
      toast.error('Erro ao carregar créditos');
    }
  };

  // Iniciar processo de recuperação
  const iniciarProcesso = async (creditoId: string) => {
    try {
      setLoading(true);

      const processo = await recuperacaoCreditosService.iniciarProcessoRecuperacao(creditoId);
      setProcessos(prev => [...prev, processo]);
      toast.success('Processo de recuperação iniciado!');

      return processo;
    } catch (error) {
      console.error('Erro ao iniciar processo:', error);
      toast.error('Erro ao iniciar processo de recuperação');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Deletar arquivo
  const deletarArquivo = async (arquivoId: string) => {
    try {
      await recuperacaoCreditosService.deletarArquivoFiscal(arquivoId);
      setArquivos(prev => prev.filter(arquivo => arquivo.id !== arquivoId));
      toast.success('Arquivo removido com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      toast.error('Erro ao remover arquivo');
      throw error;
    }
  };

  // Gerar relatório
  const gerarRelatorio = async (
    tipo: 'completo' | 'executivo' | 'planilha',
    formato: 'pdf' | 'xlsx' = 'pdf'
  ) => {
    if (!empresaId) {
      toast.error('Empresa não selecionada');
      return;
    }

    try {
      setLoading(true);

      const blob = await recuperacaoCreditosService.gerarRelatorio(empresaId, tipo, formato);

      // Criar URL para download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${tipo}-${new Date().toISOString().split('T')[0]}.${formato}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Tokenizar crédito - integração com blockchain
  const tokenizarCredito = async (creditoId: string, valor: number) => {
    try {
      setLoading(true);
      
      // Primeiro, tokeniza o crédito usando o serviço de recuperação
      const tokenizacaoResult = await recuperacaoCreditosService.tokenizarCredito(creditoId, valor);
      
      // Importa o serviço de integração blockchain
      const { blockchainIntegrationService } = await import('@/services/blockchain-integration.service');
      
      // Registra o token na blockchain
      const blockchainResult = await blockchainIntegrationService.registerAsset({
        assetId: tokenizacaoResult.tokenId,
        assetType: 'TAX_CREDIT',
        assetValue: valor,
        metadata: {
          creditoId: creditoId,
          origem: 'recuperacao-creditos',
          dataTokenizacao: new Date().toISOString()
        }
      });
      
      toast.success('Crédito tokenizado com sucesso!');
      
      // Atualiza a lista de créditos
      carregarCreditos();
      
      return {
        ...tokenizacaoResult,
        blockchainTxId: blockchainResult.transactionId,
        blockchainStatus: blockchainResult.status
      };
    } catch (error) {
      console.error('Erro ao tokenizar crédito:', error);
      toast.error('Erro ao tokenizar crédito');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estado
    loading,
    creditos,
    processos,
    arquivos,
    estatisticas,
    analiseAtual,
    uploadProgress,

    // Ações
    carregarDados,
    uploadArquivo,
    iniciarAnalise,
    iniciarProcesso,
    deletarArquivo,
    gerarRelatorio,
    tokenizarCredito,
    carregarCreditos,
  };
}
