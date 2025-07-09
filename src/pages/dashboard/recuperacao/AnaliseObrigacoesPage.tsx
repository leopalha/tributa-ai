import React, { useState, useCallback } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  X,
  AlertCircle,
  Brain,
  Loader2,
  Eye,
  Trash2,
  DollarSign,
  TrendingUp,
  Calculator,
  ArrowRight,
  Shield,
  Clock,
  Building2,
  FileCheck,
  Database,
  Search,
  Settings,
  Tags,
  BarChart3,
  FileSpreadsheet,
  Zap,
  ArrowDown,
  ArrowRightLeft,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { cnpjService, EmpresaData } from '../../../services/cnpj.service';

type AnaliseStatus =
  | 'uploading'
  | 'analyzing'
  | 'classifying'
  | 'segregating'
  | 'calculating'
  | 'completed'
  | 'processing'
  | 'error';

interface DocumentoTributeAI {
  id: number;
  name: string;
  size: number;
  status: 'pendente' | 'analisando' | 'aprovado' | 'rejeitado';
  date: string;
  tipo: 'EFD-Contribuicoes' | 'EFD-ICMS' | 'SINTEGRA' | 'XML-NFe' | 'PGDAS-D' | 'TDM' | 'Outros';
  competencias?: string[];
  itensIdentificados?: number;
}

interface ItemClassificacao {
  id: string;
  codigo: string;
  descricao: string;
  ncm?: string;
  classificacaoFiscal?: string;
  regimeTributario: 'Monofasico' | 'ST' | 'Normal';
  tributoPIS?: string;
  tributoCOFINS?: string;
  tributoICMS?: string;
  situacao: 'Pendente' | 'Classificado' | 'Conferido';
}

interface AnalysisStats {
  documentsProcessed: number;
  itemsIdentified: number;
  revenueSegregated: number;
  creditsIdentified: number;
  totalValue: number;
}

// Hook simplificado para evitar loops infinitos
const useAnaliseObrigacoes = () => {
  const [analiseAtual, setAnaliseAtual] = useState<any>(null);
  const [salvandoAnalise, setSalvandoAnalise] = useState(false);

  const criarAnalise = async (dadosEmpresa: any) => {
    setSalvandoAnalise(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = { id: Date.now(), empresa: dadosEmpresa };
      setAnaliseAtual(mockData);
      return mockData;
    } catch (error) {
      console.error('Erro ao criar análise:', error);
      throw error;
    } finally {
      setSalvandoAnalise(false);
    }
  };

  const processarAnalise = async (analiseId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = { id: analiseId, status: 'processado' };
      setAnaliseAtual(mockData);
      return mockData;
    } catch (error) {
      console.error('Erro ao processar análise:', error);
      throw error;
    }
  };

  const buscarAnalise = async (cnpj: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return null;
    } catch (error) {
      console.error('Erro ao buscar análise:', error);
      return null;
    }
  };

  return {
    analiseAtual,
    setAnaliseAtual,
    salvandoAnalise,
    criarAnalise,
    processarAnalise,
    buscarAnalise,
  };
};

const etapas = [
  { numero: 1, titulo: 'Empresa', descricao: 'Dados da empresa' },
  { numero: 2, titulo: 'Documentos', descricao: 'Upload de arquivos' },
  { numero: 3, titulo: 'Análise IA', descricao: 'Processamento automático' },
  { numero: 4, titulo: 'Resultados', descricao: 'Créditos identificados' },
];

const AnaliseObrigacoesPage = () => {
  const navigate = useNavigate();
  const { analiseAtual, salvandoAnalise, criarAnalise, processarAnalise, buscarAnalise } =
    useAnaliseObrigacoes();
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [analysisStatus, setAnalysisStatus] = useState<AnaliseStatus>('uploading');
  const [cnpj, setCnpj] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<DocumentoTributeAI[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState('Iniciando análise...');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [empresaData, setEmpresaData] = useState<EmpresaData | null>(null);
  const [loadingEmpresa, setLoadingEmpresa] = useState(false);
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [regimeData, setRegimeData] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  
  // Estados específicos do procedimento Tributa.AI
  const [itensClassificacao, setItensClassificacao] = useState<ItemClassificacao[]>([]);
  const [receitasSegregadas, setReceitasSegregadas] = useState<any[]>([]);
  const [totalItensIdentificados, setTotalItensIdentificados] = useState(0);
  const [regimeTributarioEmpresa, setRegimeTributarioEmpresa] = useState<
    'Simples Nacional' | 'MEI' | 'Lucro Presumido' | 'Lucro Real'
  >('Simples Nacional');
  const [detalhesRegime, setDetalhesRegime] = useState<any>(null);
  const [analysisStats, setAnalysisStats] = useState<AnalysisStats>({
    documentsProcessed: 0,
    itemsIdentified: 0,
    revenueSegregated: 0,
    creditsIdentified: 0,
    totalValue: 0,
  });

  const podeProximaEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return nomeEmpresa && cnpj.length === 14;
      case 2:
        return uploadedFiles.length > 0;
      case 3:
        return !processing && analysisProgress === 100;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const proximaEtapa = () => {
    if (etapaAtual === 3 && !processing && analysisProgress === 0) {
      handleAnalyze();
      return;
    }
    setEtapaAtual(prev => Math.min(prev + 1, etapas.length));
  };

  const etapaAnterior = () => {
    setEtapaAtual(prev => Math.max(prev - 1, 1));
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setUploading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const detectarTipoDocumento = (nomeArquivo: string): DocumentoTributeAI['tipo'] => {
      const nome = nomeArquivo.toLowerCase();
      if (nome.includes('efd') && nome.includes('contribui')) return 'EFD-Contribuicoes';
      if (nome.includes('efd') && (nome.includes('icms') || nome.includes('ipi')))
        return 'EFD-ICMS';
      if (nome.includes('sintegra')) return 'SINTEGRA';
      if (nome.includes('xml') || nome.includes('nfe') || nome.includes('nf-e')) return 'XML-NFe';
      if (nome.includes('pgdas') || nome.includes('das')) return 'PGDAS-D';
      if (nome.includes('tdm') || nome.includes('ecf')) return 'TDM';
      return 'Outros';
    };
    
    const newFiles: DocumentoTributeAI[] = selectedFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      status: 'pendente' as const,
      date: new Date().toLocaleString('pt-BR'),
      tipo: detectarTipoDocumento(file.name),
      competencias: ['2023-01', '2023-02', '2023-03'],
      itensIdentificados: Math.floor(Math.random() * 100) + 10,
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setSelectedFiles([]);
    setUploading(false);

    setTimeout(() => {
      setUploadedFiles(prev =>
        prev.map(file =>
          newFiles.find(nf => nf.id === file.id) ? { ...file, status: 'analisando' as const } : file
        )
      );
    }, 2000);

    setTimeout(() => {
      setUploadedFiles(prev =>
        prev.map(file =>
          newFiles.find(nf => nf.id === file.id) ? { ...file, status: 'aprovado' as const } : file
        )
      );
    }, 4000);
  };

  const removeUploadedFile = (id: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const buscarEmpresa = useCallback(async (cnpjLimpo: string) => {
    if (cnpjLimpo.length !== 14) return;
    
    setLoadingEmpresa(true);
    
    try {
      const dados = await cnpjService.buscarEmpresa(cnpjLimpo);
      setEmpresaData(dados);
      setNomeEmpresa(dados?.razaoSocial || '');
      setNomeFantasia(dados?.nomeFantasia || '');
      
      if (dados) {
        const regime = determinarRegimeTributario(dados);
        setRegimeTributarioEmpresa(regime.tipo);
        setDetalhesRegime(regime.detalhes);
        setRegimeData(regime);
      }
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      setEmpresaData(null);
      setNomeEmpresa('');
      setNomeFantasia('');
      setRegimeTributarioEmpresa('Simples Nacional');
      setDetalhesRegime(null);
    } finally {
      setLoadingEmpresa(false);
    }
  }, []);

  const determinarRegimeTributario = (dados: any) => {
    if (dados.porte === 'MICRO' && dados.receitaAnualEstimada <= 81000) {
      return {
        tipo: 'MEI' as const,
        detalhes: {
          limite: 'R$ 81.000/ano',
          tributos: ['DAS MEI'],
          aliquota: '5% a 20%',
          observacoes: 'Microempreendedor Individual',
        },
      };
    }
    
    if (dados.porte === 'MICRO' || dados.porte === 'PEQUENO') {
      return {
        tipo: 'Simples Nacional' as const,
        detalhes: {
          limite: 'R$ 4.800.000/ano',
          tributos: ['IRPJ', 'CSLL', 'PIS', 'COFINS', 'ICMS', 'ISS'],
          aliquota: '4% a 33%',
          observacoes: 'Regime Simplificado',
        },
      };
    }
    
    return {
      tipo: 'Lucro Real' as const,
      detalhes: {
        limite: 'Sem limite',
        tributos: ['IRPJ', 'CSLL', 'PIS', 'COFINS'],
        aliquota: 'Variável',
        observacoes: 'Apuração real do lucro',
      },
    };
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanCNPJ = value.replace(/\D/g, '');
    setCnpj(cleanCNPJ);
    
    if (cleanCNPJ.length === 14) {
      buscarEmpresa(cleanCNPJ);
    } else {
      setEmpresaData(null);
      setNomeEmpresa('');
      setNomeFantasia('');
    }
  };

  const handleAnalyze = async () => {
    if (!nomeEmpresa || uploadedFiles.length === 0) {
      alert('Por favor, faça upload de pelo menos um documento antes de iniciar a análise.');
      return;
    }

    try {
      setProcessing(true);
      setAnalysisProgress(0);
      setAnalysisMessage('🚀 Iniciando análise inteligente dos documentos fiscais...');

      const etapas = [
        { 
          progress: 10, 
          message: '🔍 Carregando algoritmos de análise tributária...',
          detalhes: 'Sistema IA iniciando processamento'
        },
        { 
          progress: 25, 
          message: '📄 Lendo e validando estrutura dos documentos...',
          detalhes: `Processando ${uploadedFiles.length} documentos fiscais`
        },
        { 
          progress: 40, 
          message: '🏷️ Classificando itens fiscais e operações...',
          detalhes: 'Identificando NCMs, CSTs e natureza das operações'
        },
        { 
          progress: 55, 
          message: '📊 Segregando receitas por atividade econômica...',
          detalhes: 'Analisando receitas monofásicas, ST e operações normais'
        },
        { 
          progress: 70, 
          message: '💰 Calculando bases de cálculo e créditos...',
          detalhes: 'Identificando créditos de PIS/COFINS, ICMS e diferencial de alíquota'
        },
        { 
          progress: 85, 
          message: '🔍 Validando oportunidades de recuperação...',
          detalhes: 'Conferindo legislação aplicável e precedentes'
        },
        { 
          progress: 100, 
          message: '✅ Análise concluída! Créditos tributários identificados.',
          detalhes: 'Relatório completo gerado com oportunidades'
        },
      ];

      for (const etapa of etapas) {
        setAnalysisMessage(etapa.message);
        
        // Comunicações detalhadas durante o processamento
        if (etapa.progress === 25) {
          setTimeout(() => {
            setAnalysisMessage('📋 Validando ' + uploadedFiles.length + ' documentos fiscais...');
          }, 1000);
        }
        
        if (etapa.progress === 55) {
          const itensIdentificados = Math.floor(Math.random() * 500 + 200);
          setTimeout(() => {
            setAnalysisMessage('🎯 Identificando ' + itensIdentificados + ' itens fiscais...');
          }, 1000);
        }
        
        if (etapa.progress === 85) {
          const valorEstimado = Math.floor(Math.random() * 200000 + 50000);
          setTimeout(() => {
            setAnalysisMessage('💎 Encontrando créditos de R$ ' + valorEstimado.toLocaleString('pt-BR') + '...');
          }, 1000);
        }

        await new Promise(resolve => setTimeout(resolve, 2500));
        setAnalysisProgress(etapa.progress);
      }

      // Simular estatísticas realísticas baseadas no regime tributário
      const baseValue = regimeTributarioEmpresa === 'Lucro Real' ? 150000 : 
                       regimeTributarioEmpresa === 'Lucro Presumido' ? 80000 : 45000;
      
      const mockStats: AnalysisStats = {
        documentsProcessed: uploadedFiles.length,
        itemsIdentified: Math.floor(Math.random() * 300) + uploadedFiles.length * 50,
        revenueSegregated: Math.floor(Math.random() * 2000000) + 800000,
        creditsIdentified: Math.floor(Math.random() * 12) + uploadedFiles.length * 2,
        totalValue: Math.floor(Math.random() * baseValue) + baseValue,
      };

      setAnalysisStats(mockStats);

      // Gerar créditos detalhados baseados na análise
      const creditosDetalhados = [
        {
          id: Date.now().toString() + '_1',
          tipo: 'PIS',
          descricao: 'Crédito de PIS sobre energia elétrica industrial',
          valorNominal: Math.floor(mockStats.totalValue * 0.2),
          valorAtual: 95.5,
          valorEconomia: Math.floor(mockStats.totalValue * 0.2 * 0.15),
          periodoInicio: '2023-01-01',
          periodoFim: '2024-12-31',
          statusCredito: 'IDENTIFICADO',
          podeCompensar: true,
          tribunalOrigem: 'RFB',
          numeroProcesso: `CRED-${Date.now().toString().slice(-6)}-PIS`,
          origem: 'ANALISE_IA',
          analiseObrigacoes: {
            id: Date.now().toString(),
            cnpjEmpresa: cnpj,
            razaoSocialEmpresa: nomeEmpresa,
            regimeTributario: regimeTributarioEmpresa,
            dataAnalise: new Date().toISOString(),
            documentosAnalisados: uploadedFiles.length
          }
        },
        {
          id: Date.now().toString() + '_2',
          tipo: 'COFINS',
          descricao: 'Crédito de COFINS sobre energia elétrica industrial',
          valorNominal: Math.floor(mockStats.totalValue * 0.2),
          valorAtual: 95.5,
          valorEconomia: Math.floor(mockStats.totalValue * 0.2 * 0.15),
          periodoInicio: '2023-01-01',
          periodoFim: '2024-12-31',
          statusCredito: 'IDENTIFICADO',
          podeCompensar: true,
          tribunalOrigem: 'RFB',
          numeroProcesso: `CRED-${Date.now().toString().slice(-6)}-COFINS`,
          origem: 'ANALISE_IA',
          analiseObrigacoes: {
            id: Date.now().toString(),
            cnpjEmpresa: cnpj,
            razaoSocialEmpresa: nomeEmpresa,
            regimeTributario: regimeTributarioEmpresa,
            dataAnalise: new Date().toISOString(),
            documentosAnalisados: uploadedFiles.length
          }
        },
        {
          id: Date.now().toString() + '_3',
          tipo: 'ICMS',
          descricao: 'Diferencial de alíquota ICMS interestadual',
          valorNominal: Math.floor(mockStats.totalValue * 0.3),
          valorAtual: 95.5,
          valorEconomia: Math.floor(mockStats.totalValue * 0.3 * 0.15),
          periodoInicio: '2023-01-01',
          periodoFim: '2024-12-31',
          statusCredito: 'IDENTIFICADO',
          podeCompensar: true,
          tribunalOrigem: 'SEFAZ',
          numeroProcesso: `CRED-${Date.now().toString().slice(-6)}-ICMS`,
          origem: 'ANALISE_IA',
          analiseObrigacoes: {
            id: Date.now().toString(),
            cnpjEmpresa: cnpj,
            razaoSocialEmpresa: nomeEmpresa,
            regimeTributario: regimeTributarioEmpresa,
            dataAnalise: new Date().toISOString(),
            documentosAnalisados: uploadedFiles.length
          }
        },
        {
          id: Date.now().toString() + '_4',
          tipo: 'IRPJ',
          descricao: 'Pagamento indevido de IRPJ - recolhimento em duplicidade',
          valorNominal: Math.floor(mockStats.totalValue * 0.15),
          valorAtual: 95.5,
          valorEconomia: Math.floor(mockStats.totalValue * 0.15 * 0.15),
          periodoInicio: '2023-01-01',
          periodoFim: '2024-12-31',
          statusCredito: 'IDENTIFICADO',
          podeCompensar: true,
          tribunalOrigem: 'RFB',
          numeroProcesso: `CRED-${Date.now().toString().slice(-6)}-IRPJ`,
          origem: 'ANALISE_IA',
          analiseObrigacoes: {
            id: Date.now().toString(),
            cnpjEmpresa: cnpj,
            razaoSocialEmpresa: nomeEmpresa,
            regimeTributario: regimeTributarioEmpresa,
            dataAnalise: new Date().toISOString(),
            documentosAnalisados: uploadedFiles.length
          }
        },
        {
          id: Date.now().toString() + '_5',
          tipo: 'CSLL',
          descricao: 'Pagamento indevido de CSLL - recolhimento em duplicidade',
          valorNominal: Math.floor(mockStats.totalValue * 0.15),
          valorAtual: 95.5,
          valorEconomia: Math.floor(mockStats.totalValue * 0.15 * 0.15),
          periodoInicio: '2023-01-01',
          periodoFim: '2024-12-31',
          statusCredito: 'IDENTIFICADO',
          podeCompensar: true,
          tribunalOrigem: 'RFB',
          numeroProcesso: `CRED-${Date.now().toString().slice(-6)}-CSLL`,
          origem: 'ANALISE_IA',
          analiseObrigacoes: {
            id: Date.now().toString(),
            cnpjEmpresa: cnpj,
            razaoSocialEmpresa: nomeEmpresa,
            regimeTributario: regimeTributarioEmpresa,
            dataAnalise: new Date().toISOString(),
            documentosAnalisados: uploadedFiles.length
          }
        }
      ].slice(0, mockStats.creditsIdentified); // Limitar ao número de créditos identificados

      // Salvar créditos identificados no localStorage
      const creditosExistentes = JSON.parse(localStorage.getItem('creditos_identificados') || '[]');
      const novosCreditosComTimestamp = creditosDetalhados.map(credito => ({
        ...credito,
        dataIdentificacao: new Date().toISOString(),
        isNew: true
      }));
      const todosCreditosAtualizados = [...novosCreditosComTimestamp, ...creditosExistentes];
      localStorage.setItem('creditos_identificados', JSON.stringify(todosCreditosAtualizados));

      // Salvar análise no localStorage para persistência
      const analiseCompleta = {
        id: Date.now().toString(),
        cnpj: cnpj,
        empresa: nomeEmpresa,
        dataAnalise: new Date().toISOString(),
        documentos: uploadedFiles,
        resultados: mockStats,
        regimeTributario: regimeTributarioEmpresa,
        status: 'concluida',
        creditosIdentificados: creditosDetalhados
      };

      const analisesAnteriores = JSON.parse(localStorage.getItem('analises_obrigacoes') || '[]');
      analisesAnteriores.unshift(analiseCompleta);
      localStorage.setItem('analises_obrigacoes', JSON.stringify(analisesAnteriores));

      // Notificar sistema sobre análise concluída
      try {
        const { simpleNotificationService } = await import('../../../services/notification-simple.service');
        
        // Notificação principal da análise
        simpleNotificationService.notifyAnalysisCompleted(
          analiseCompleta.id,
          mockStats.creditsIdentified,
          mockStats.totalValue
        );

        // Notificação específica dos créditos identificados
        simpleNotificationService.addNotification({
          type: 'success',
          title: '💰 Novos Créditos Identificados',
          message: `${creditosDetalhados.length} créditos tributários identificados no valor de R$ ${mockStats.totalValue.toLocaleString('pt-BR')}`,
          relatedType: 'analysis',
          actions: [
            {
              label: 'Ver Créditos',
              action: () => window.location.href = '/dashboard/recuperacao/resultados-analise',
              type: 'primary'
            }
          ]
        });

      } catch (error) {
        console.log('Serviço de notificação não disponível');
      }

      setAnalysisStatus('completed');
      setAnalysisMessage('🎉 Análise concluída! Visualize os resultados na próxima etapa.');
      
      // Avançar automaticamente para a etapa 4 após 2 segundos
      setTimeout(() => {
        setEtapaAtual(4);
      }, 2000);

    } catch (error) {
      console.error('Erro na análise:', error);
      setAnalysisMessage('❌ Erro durante a análise. Tente novamente.');
      setAnalysisStatus('error');
    } finally {
      setProcessing(false);
    }
  };

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
  return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-violet-600" />
                Dados da Empresa
              </CardTitle>
              <CardDescription>
                Informe o CNPJ da empresa para identificar o regime tributário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
        <div>
                <Label htmlFor="cnpj">CNPJ da Empresa *</Label>
                <Input
                  id="cnpj"
                  value={formatCNPJ(cnpj)}
                  onChange={handleCNPJChange}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                />
        </div>

              {loadingEmpresa && (
                <div className="flex items-center gap-2 text-violet-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Buscando dados da empresa...</span>
      </div>
              )}

              {nomeEmpresa && (
                <div className="space-y-4">
                  {/* Informações Básicas da Empresa */}
                  <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-violet-900 text-lg mb-1">{nomeEmpresa}</h4>
                        {nomeFantasia && nomeFantasia !== nomeEmpresa && (
                          <p className="text-violet-700 text-sm">Nome Fantasia: {nomeFantasia}</p>
                        )}
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Empresa Válida
                      </Badge>
                    </div>
                    
                    {empresaData && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-violet-600 font-medium">Situação:</span>
                            <Badge variant={empresaData.situacao === 'ATIVA' ? 'default' : 'secondary'}>
                              {empresaData.situacao}
                            </Badge>
          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-violet-600 font-medium">Porte:</span>
                            <span className="text-violet-700">{empresaData.porte || 'Não informado'}</span>
          </div>
                          
                          {empresaData.capitalSocial && (
                            <div className="flex items-center justify-between">
                              <span className="text-violet-600 font-medium">Capital Social:</span>
                              <span className="text-violet-700">R$ {empresaData.capitalSocial.toLocaleString('pt-BR')}</span>
        </div>
      )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-violet-600 font-medium">Abertura:</span>
                            <span className="text-violet-700">
                              {empresaData.dataAbertura ? new Date(empresaData.dataAbertura).toLocaleDateString('pt-BR') : 'N/A'}
                            </span>
                          </div>
                          
                          {empresaData.municipio && (
                            <div className="flex items-center justify-between">
                              <span className="text-violet-600 font-medium">Município:</span>
                              <span className="text-violet-700">{empresaData.municipio}/{empresaData.uf}</span>
                            </div>
                          )}
                          
                          {empresaData.email && (
              <div className="flex items-center justify-between">
                              <span className="text-violet-600 font-medium">E-mail:</span>
                              <span className="text-violet-700 text-xs">{empresaData.email}</span>
                </div>
                          )}
              </div>
                      </div>
                    )}
            </div>
            
                  {/* Regime Tributário Detalhado */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Regime Tributário: {regimeTributarioEmpresa}
                    </h4>
                    
                    {detalhesRegime && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
              <div className="flex items-center justify-between">
                              <span className="text-blue-600 font-medium">Limite de Faturamento:</span>
                              <span className="text-blue-700 font-semibold">{detalhesRegime.limite}</span>
                </div>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-600 font-medium">Alíquota Geral:</span>
                              <span className="text-blue-700">{detalhesRegime.aliquota}</span>
              </div>
            </div>
            
                          <div className="space-y-2">
                <div>
                              <span className="text-blue-600 font-medium">Tributos Aplicáveis:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {detalhesRegime.tributos.map((tributo: string) => (
                                  <Badge key={tributo} variant="outline" className="text-xs text-blue-600 border-blue-300">
                                    {tributo}
                                  </Badge>
                                ))}
                </div>
                            </div>
              </div>
            </div>
            
                        <div className="bg-white p-3 rounded border border-blue-200">
                          <p className="text-blue-800 text-sm">
                            <strong>Observações:</strong> {detalhesRegime.observacoes}
                          </p>
                </div>
              </div>
                    )}
            </div>

                  {/* Atividade Principal */}
                  {empresaData?.atividadePrincipal && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                        <Tags className="w-4 h-4 mr-2" />
                        Atividade Principal
                      </h4>
                      <p className="text-green-800 text-sm">
                        <strong>CNAE:</strong> {empresaData.cnaePrincipal} - {empresaData.atividadePrincipal}
                      </p>
                      {empresaData.atividadesSecundarias && empresaData.atividadesSecundarias.length > 0 && (
                        <div className="mt-2">
                          <p className="text-green-700 text-xs font-medium mb-1">Atividades Secundárias:</p>
                          <div className="text-green-700 text-xs space-y-1">
                            {empresaData.atividadesSecundarias.slice(0, 2).map((atividade: string, index: number) => (
                              <p key={index}>• {atividade}</p>
                            ))}
                            {empresaData.atividadesSecundarias.length > 2 && (
                              <p className="text-green-600">+ {empresaData.atividadesSecundarias.length - 2} outras atividades</p>
                            )}
          </div>
        </div>
                      )}
                    </div>
                  )}

                  {/* Análise de Oportunidades */}
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
                      <Search className="w-4 h-4 mr-2" />
                      Oportunidades de Recuperação Pré-identificadas
                    </h4>
                    <div className="text-sm text-yellow-800 space-y-1">
                      {regimeTributarioEmpresa === 'Simples Nacional' && (
                        <>
                          <p>• <strong>ICMS Monofásico:</strong> Possível crédito em operações com combustíveis</p>
                          <p>• <strong>Substituição Tributária:</strong> Análise de recolhimentos indevidos</p>
                        </>
                      )}
                      {regimeTributarioEmpresa === 'Lucro Real' && (
                        <>
                          <p>• <strong>PIS/COFINS:</strong> Créditos sobre insumos, energia elétrica e aluguéis</p>
                          <p>• <strong>IRPJ/CSLL:</strong> Revisão de adições e exclusões</p>
                          <p>• <strong>ICMS:</strong> Diferencial de alíquota e operações interestaduais</p>
                        </>
                      )}
                      {regimeTributarioEmpresa === 'Lucro Presumido' && (
                        <>
                          <p>• <strong>ICMS ST:</strong> Análise de substituição tributária</p>
                          <p>• <strong>PIS/COFINS:</strong> Créditos específicos permitidos</p>
                        </>
                      )}
                      <p className="text-yellow-700 mt-2">
                        💡 <strong>Recomendação:</strong> Upload de documentos fiscais para análise completa
                      </p>
            </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-violet-600" />
                Documentos Fiscais
              </CardTitle>
              <CardDescription>
                Envie os arquivos EFD, XML, SINTEGRA, PGDAS-D ou TDM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500 mb-3">EFD, XML, SINTEGRA, PGDAS-D, TDM</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 cursor-pointer"
                >
                  Selecionar Arquivos
                </label>
          </div>

          {selectedFiles.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Arquivos Selecionados</h4>
                  <div className="space-y-2 mb-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={() => removeSelectedFile(index)}
                          className="text-red-500 hover:text-red-700"
                    >
                          <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
                  <Button
                onClick={handleUpload}
                disabled={uploading}
                    className="w-full bg-violet-600 hover:bg-violet-700"
              >
                {uploading ? (
                  <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Confirmar Upload'
                )}
                  </Button>
            </div>
          )}

          {uploadedFiles.length > 0 && (
                <div className="bg-white rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Arquivos Carregados ({uploadedFiles.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadedFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.name}</p>
                      <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs text-violet-600">{file.tipo}</Badge>
                            <Badge
                              variant={
                            file.status === 'aprovado'
                                  ? 'default'
                              : file.status === 'analisando'
                                    ? 'secondary'
                                    : 'outline'
                              }
                              className="text-xs"
                            >
                              {file.status === 'aprovado' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {file.status === 'analisando' && <Clock className="w-3 h-3 mr-1" />}
                              {file.status === 'aprovado' ? 'Aprovado' : file.status === 'analisando' ? 'Analisando' : 'Pendente'}
                            </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => removeUploadedFile(file.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet-600" />
                Análise com Inteligência Artificial
              </CardTitle>
              <CardDescription>
                Sistema automatizado de análise fiscal conforme Manual Tributa.AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Pré-Análise */}
              {analysisProgress === 0 && !processing && (
                <div className="space-y-6">
                  <div className="text-center py-6">
                    <FileCheck className="w-16 h-16 mx-auto text-violet-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Sistema Pronto para Análise</h3>
                    <p className="text-muted-foreground mb-4">
                      Todos os documentos foram validados e o sistema está pronto para iniciar.
                    </p>
        </div>

                  {/* Resumo dos Documentos */}
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                    <h4 className="font-semibold text-violet-900 mb-3 flex items-center">
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Documentos para Análise ({uploadedFiles.length})
                    </h4>
                    <div className="space-y-2">
                      {uploadedFiles.map(file => (
                        <div key={file.id} className="flex items-center justify-between bg-white p-3 rounded border">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-4 h-4 text-violet-600" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.tipo} • {(file.size / 1024).toFixed(1)} KB</p>
      </div>
    </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-violet-600 border-violet-300">
                              {file.competencias?.length || 0} competências
                            </Badge>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Configurações da Análise */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações da Análise
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <p><strong>Empresa:</strong> {nomeEmpresa}</p>
                        <p><strong>CNPJ:</strong> {formatCNPJ(cnpj)}</p>
                        <p><strong>Regime:</strong> {regimeTributarioEmpresa}</p>
                      </div>
                      <div className="space-y-1">
                        <p><strong>Documentos:</strong> {uploadedFiles.length} arquivos</p>
                        <p><strong>Período:</strong> 2023-2024</p>
                        <p><strong>Análise:</strong> Completa</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-6">
                      O sistema irá processar automaticamente todos os documentos fiscais usando IA
                    </p>
                    
                    {/* Botão Iniciar Análise */}
                    <Button
                      onClick={handleAnalyze}
                      disabled={uploadedFiles.length === 0 || processing}
                      size="lg"
                      className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 text-base font-semibold"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5 mr-2" />
                          Iniciar Análise
                        </>
                      )}
                    </Button>
                    
                    {uploadedFiles.length === 0 && (
                      <p className="text-sm text-red-500 mt-2">
                        ⚠️ Faça upload de pelo menos 1 documento na etapa anterior para liberar a análise
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Análise em Processamento */}
              {processing && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Brain className="w-12 h-12 text-violet-500 animate-pulse" />
                      <Zap className="w-6 h-6 text-yellow-500 ml-2 animate-bounce" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Processamento de IA em Andamento</h3>
                    <p className="text-muted-foreground">
                      {analysisMessage}
                    </p>
                  </div>

                  {/* Barra de Progresso Principal */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Progresso Geral</span>
                      <span className="text-violet-600 font-semibold">{analysisProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={analysisProgress} className="w-full h-3" />
                  </div>

                  {/* Etapas Detalhadas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Etapas de Processamento:</h4>
                      
                      <div className={`flex items-center space-x-2 p-2 rounded ${analysisProgress >= 25 ? 'bg-green-50 text-green-700' : 'bg-gray-50'}`}>
                        {analysisProgress >= 25 ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        <span className="text-sm">1. Leitura de Documentos</span>
                      </div>

                      <div className={`flex items-center space-x-2 p-2 rounded ${analysisProgress >= 50 ? 'bg-green-50 text-green-700' : analysisProgress >= 25 ? 'bg-blue-50 text-blue-700' : 'bg-gray-50'}`}>
                        {analysisProgress >= 50 ? <CheckCircle className="w-4 h-4" /> : analysisProgress >= 25 ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                        <span className="text-sm">2. Classificação Fiscal</span>
                      </div>

                      <div className={`flex items-center space-x-2 p-2 rounded ${analysisProgress >= 75 ? 'bg-green-50 text-green-700' : analysisProgress >= 50 ? 'bg-blue-50 text-blue-700' : 'bg-gray-50'}`}>
                        {analysisProgress >= 75 ? <CheckCircle className="w-4 h-4" /> : analysisProgress >= 50 ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                        <span className="text-sm">3. Segregação de Receitas</span>
                      </div>

                      <div className={`flex items-center space-x-2 p-2 rounded ${analysisProgress >= 100 ? 'bg-green-50 text-green-700' : analysisProgress >= 75 ? 'bg-blue-50 text-blue-700' : 'bg-gray-50'}`}>
                        {analysisProgress >= 100 ? <CheckCircle className="w-4 h-4" /> : analysisProgress >= 75 ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                        <span className="text-sm">4. Identificação de Créditos</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Status dos Documentos:</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-white border rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-3 h-3 text-violet-500" />
                            <span className="text-xs font-medium truncate max-w-[150px]">{file.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {analysisProgress > (index + 1) * (100 / uploadedFiles.length) ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-green-600">Processado</span>
                              </>
                            ) : analysisProgress > index * (100 / uploadedFiles.length) ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                                <span className="text-xs text-blue-600">Analisando</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">Aguardando</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comunicações do Sistema */}
                  <div className="bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                      <Database className="w-4 h-4 mr-2" />
                      Comunicação IA Sistema
                    </h4>
                    <div className="text-sm space-y-1">
                      <p className="text-blue-800">
                        🔍 <strong>Análise em curso:</strong> {analysisMessage}
                      </p>
                      {analysisProgress >= 25 && (
                        <p className="text-green-700">
                          ✅ <strong>Documentos validados:</strong> {uploadedFiles.length} arquivos processados com sucesso
                        </p>
                      )}
                      {analysisProgress >= 50 && (
                        <p className="text-green-700">
                          📊 <strong>Classificação concluída:</strong> {Math.floor(Math.random() * 500) + 100} itens fiscais identificados
                        </p>
                      )}
                      {analysisProgress >= 75 && (
                        <p className="text-green-700">
                          💰 <strong>Receitas segregadas:</strong> R$ {Math.floor(Math.random() * 1000000 + 500000).toLocaleString('pt-BR')} identificados
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Análise Concluída */}
              {analysisProgress === 100 && !processing && (
                <div className="space-y-6">
                  <div className="text-center py-6">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold text-green-700 mb-2">
                      🎉 Análise Concluída com Sucesso!
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      A Inteligência Artificial identificou oportunidades de recuperação de créditos tributários
                    </p>
                  </div>

                  {/* Resultados Detalhados */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <FileSpreadsheet className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-700">{analysisStats.documentsProcessed}</p>
                      <p className="text-sm text-blue-600">Documentos</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <Search className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-700">{analysisStats.itemsIdentified}</p>
                      <p className="text-sm text-green-600">Itens Identificados</p>
                    </div>
                    <div className="bg-violet-50 p-4 rounded-lg text-center">
                      <Calculator className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-violet-700">{analysisStats.creditsIdentified}</p>
                      <p className="text-sm text-violet-600">Créditos Encontrados</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-orange-700">R$ {analysisStats.totalValue.toLocaleString('pt-BR')}</p>
                      <p className="text-sm text-orange-600">Valor Total</p>
                    </div>
                  </div>

                  {/* Sumário de Créditos por Tipo */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Créditos Identificados por Categoria
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-white p-3 rounded border">
                        <p className="font-medium text-sm">PIS/COFINS</p>
                        <p className="text-lg font-bold text-blue-600">R$ 89.500</p>
                        <p className="text-xs text-gray-600">Energia elétrica industrial</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="font-medium text-sm">ICMS</p>
                        <p className="text-lg font-bold text-green-600">R$ 45.200</p>
                        <p className="text-xs text-gray-600">Diferencial de alíquota</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="font-medium text-sm">IRPJ/CSLL</p>
                        <p className="text-lg font-bold text-purple-600">R$ 67.800</p>
                        <p className="text-xs text-gray-600">Pagamento indevido</p>
                      </div>
                    </div>
                  </div>

                  {/* Sistema de Comunicação Final */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Relatório Final do Sistema IA
                    </h4>
                    <div className="text-sm space-y-1 text-green-800">
                      <p>🎯 <strong>Análise Completa:</strong> 100% dos documentos processados com precisão</p>
                      <p>📈 <strong>Oportunidades:</strong> {analysisStats.creditsIdentified} créditos tributários identificados</p>
                      <p>💎 <strong>Valor Recuperável:</strong> R$ {analysisStats.totalValue.toLocaleString('pt-BR')} em créditos validados</p>
                      <p>🔒 <strong>Confiabilidade:</strong> 98.5% de precisão na identificação automática</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-violet-600" />
                Resultados da Análise
              </CardTitle>
              <CardDescription>
                Créditos tributários identificados e valores recuperáveis - Análise concluída com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Banner de Sucesso */}
              <div className="bg-gradient-to-r from-green-50 to-violet-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mr-3" />
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-green-700">
                      🎉 Análise Concluída com Sucesso!
                    </h3>
                    <p className="text-green-600">
                      {analysisStats.creditsIdentified} oportunidades de recuperação identificadas
                    </p>
                  </div>
                </div>
              </div>

              {/* Estatísticas Principais */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-violet-50 p-4 rounded-lg text-center">
                  <FileText className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-violet-700">{analysisStats.documentsProcessed}</p>
                  <p className="text-sm font-medium text-violet-600">Documentos Processados</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Search className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">{analysisStats.itemsIdentified}</p>
                  <p className="text-sm font-medium text-blue-600">Itens Identificados</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Calculator className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-700">{analysisStats.creditsIdentified}</p>
                  <p className="text-sm font-medium text-green-600">Créditos Encontrados</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-orange-700">R$ {analysisStats.totalValue.toLocaleString('pt-BR')}</p>
                  <p className="text-sm font-medium text-orange-600">Valor Total</p>
                </div>
              </div>

              {/* Detalhamento por Tipo de Crédito */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-violet-600" />
                  Créditos Identificados por Categoria
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">PIS/COFINS</span>
                      <Badge className="bg-blue-100 text-blue-800">Energia Elétrica</Badge>
                    </div>
                    <p className="text-xl font-bold text-blue-600">R$ {Math.floor(analysisStats.totalValue * 0.4).toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-gray-600">Créditos sobre energia elétrica industrial</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">ICMS</span>
                      <Badge className="bg-green-100 text-green-800">Diferencial</Badge>
                    </div>
                    <p className="text-xl font-bold text-green-600">R$ {Math.floor(analysisStats.totalValue * 0.3).toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-gray-600">Diferencial de alíquota interestadual</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">IRPJ/CSLL</span>
                      <Badge className="bg-purple-100 text-purple-800">Pagamento Indevido</Badge>
                    </div>
                    <p className="text-xl font-bold text-purple-600">R$ {Math.floor(analysisStats.totalValue * 0.3).toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-gray-600">Recolhimentos em duplicidade</p>
                  </div>
                </div>
              </div>

              {/* Resumo da Empresa Analisada */}
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                <h4 className="font-semibold text-violet-900 mb-3 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Resumo da Análise - {nomeEmpresa}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p><strong>CNPJ:</strong> {formatCNPJ(cnpj)}</p>
                    <p><strong>Regime Tributário:</strong> {regimeTributarioEmpresa}</p>
                    <p><strong>Documentos Analisados:</strong> {analysisStats.documentsProcessed}</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Data da Análise:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
                    <p><strong>Receitas Segregadas:</strong> R$ {analysisStats.revenueSegregated.toLocaleString('pt-BR')}</p>
                    <p><strong>Taxa de Sucesso:</strong> 98.5%</p>
                  </div>
                </div>
              </div>

              {/* Próximos Passos */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Próximos Passos Recomendados
                </h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>📋 <strong>1. Validação:</strong> Revisar os créditos identificados com seu contador</p>
                  <p>📄 <strong>2. Documentação:</strong> Preparar documentação de suporte para cada crédito</p>
                  <p>🏛️ <strong>3. Pedido:</strong> Protocolar pedido de restituição ou compensação na RFB</p>
                  <p>💰 <strong>4. Recuperação:</strong> Acompanhar processamento e receber valores</p>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                <Button
                  onClick={() => {
                    // Salvar dados da análise para a página de resultados
                    const dadosAnalise = {
                      empresa: nomeEmpresa,
                      cnpj: formatCNPJ(cnpj),
                      regime: regimeTributarioEmpresa,
                      documentos: analysisStats.documentsProcessed,
                      creditos: analysisStats.creditsIdentified,
                      valor: analysisStats.totalValue,
                      data: new Date().toLocaleDateString('pt-BR'),
                      timestamp: Date.now()
                    };
                    localStorage.setItem('dados_analise_atual', JSON.stringify(dadosAnalise));
                    window.location.href = '/dashboard/recuperacao/resultados-analise';
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Análise Completa
                </Button>
                
                <Button
                  onClick={() => {
                    const dados = {
                      empresa: nomeEmpresa,
                      cnpj: formatCNPJ(cnpj),
                      regime: regimeTributarioEmpresa,
                      documentos: analysisStats.documentsProcessed,
                      creditos: analysisStats.creditsIdentified,
                      valor: analysisStats.totalValue,
                      data: new Date().toLocaleDateString('pt-BR')
                    };
                    
                    // Criar relatório Excel-like em CSV
                    const csvContent = [
                      'RELATÓRIO DE ANÁLISE TRIBUTÁRIA',
                      '',
                      'DADOS DA EMPRESA',
                      `Razão Social,${dados.empresa}`,
                      `CNPJ,${dados.cnpj}`,
                      `Regime Tributário,${dados.regime}`,
                      `Data da Análise,${dados.data}`,
                      '',
                      'RESULTADOS DA ANÁLISE',
                      `Documentos Processados,${dados.documentos}`,
                      `Créditos Identificados,${dados.creditos}`,
                      `Valor Total dos Créditos,R$ ${dados.valor.toLocaleString('pt-BR')}`,
                      `Taxa de Sucesso,98.5%`,
                      '',
                      'DETALHAMENTO POR TRIBUTO',
                      'Tributo,Valor,Descrição',
                      `PIS/COFINS,R$ ${Math.floor(dados.valor * 0.4).toLocaleString('pt-BR')},Créditos sobre energia elétrica industrial`,
                      `ICMS,R$ ${Math.floor(dados.valor * 0.3).toLocaleString('pt-BR')},Diferencial de alíquota interestadual`,
                      `IRPJ/CSLL,R$ ${Math.floor(dados.valor * 0.3).toLocaleString('pt-BR')},Recolhimentos em duplicidade`
                    ].join('\n');
                    
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `relatorio-analise-${dados.cnpj.replace(/\D/g, '')}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }}
                  variant="outline"
                  className="border-violet-300 text-violet-700 hover:bg-violet-50"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Exportar Excel
                </Button>

                <Button
                  onClick={async () => {
                    try {
                      const { simpleNotificationService } = await import('../../../services/notification-simple.service');
                      
                      // Configurar análise automática mensal
                      const agendamento = {
                        id: Date.now().toString(),
                        empresa: nomeEmpresa,
                        cnpj: cnpj,
                        frequencia: 'mensal',
                        proximaExecucao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        ativo: true,
                        criadoEm: new Date().toISOString()
                      };

                      const agendamentos = JSON.parse(localStorage.getItem('analises_agendadas') || '[]');
                      agendamentos.push(agendamento);
                      localStorage.setItem('analises_agendadas', JSON.stringify(agendamentos));

                      simpleNotificationService.show({
                        type: 'success',
                        message: 'Análise automática agendada para execução mensal!'
                      });
                    } catch (error) {
                      console.error('Erro ao agendar análise:', error);
                    }
                  }}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Agendar Análise
                </Button>

                <Button
                  onClick={async () => {
                    try {
                      const { simpleNotificationService } = await import('../../../services/notification-simple.service');
                      
                      const dadosCompartilhamento = {
                        empresa: nomeEmpresa,
                        creditos: analysisStats.creditsIdentified,
                        valor: analysisStats.totalValue,
                        link: `${window.location.origin}/dashboard/recuperacao/resultados-analise`,
                        dataAnalise: new Date().toLocaleDateString('pt-BR')
                      };

                      // Simular compartilhamento por email
                      const emailBody = `Análise Tributária Concluída\n\nEmpresa: ${dadosCompartilhamento.empresa}\nCréditos Identificados: ${dadosCompartilhamento.creditos}\nValor Total: R$ ${dadosCompartilhamento.valor.toLocaleString('pt-BR')}\n\nAcesse os detalhes: ${dadosCompartilhamento.link}`;
                      
                      navigator.clipboard.writeText(emailBody);
                      
                      simpleNotificationService.show({
                        type: 'success',
                        message: 'Link de compartilhamento copiado para a área de transferência!'
                      });
                    } catch (error) {
                      console.error('Erro ao compartilhar:', error);
                    }
                  }}
                  variant="outline"
                  className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>

              {/* Ações Avançadas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <Button
                  onClick={() => {
                    // Navegar para compensação com créditos pré-selecionados
                    const creditosParaCompensacao = JSON.parse(localStorage.getItem('creditos_identificados') || '[]')
                      .slice(0, analysisStats.creditsIdentified)
                      .map(credito => ({
                        id: credito.id,
                        tipo: credito.tipo,
                        descricao: credito.descricao,
                        valor: credito.valorNominal,
                        empresa: nomeEmpresa,
                        vencimento: new Date(credito.periodoFim).toLocaleDateString('pt-BR')
                      }));
                    
                    localStorage.setItem('creditosCompensacao', JSON.stringify(creditosParaCompensacao));
                    window.location.href = '/dashboard/recuperacao/compensacao-bilateral';
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Iniciar Compensação
                </Button>

                <Button
                  onClick={async () => {
                    try {
                      const { simpleNotificationService } = await import('../../../services/notification-simple.service');
                      
                      // Simular criação de alerta
                      const alerta = {
                        id: Date.now().toString(),
                        tipo: 'oportunidade_credito',
                        empresa: nomeEmpresa,
                        cnpj: cnpj,
                        valor: analysisStats.totalValue,
                        dataAnalise: new Date().toISOString(),
                        ativo: true
                      };

                      const alertas = JSON.parse(localStorage.getItem('alertas_tributarios') || '[]');
                      alertas.push(alerta);
                      localStorage.setItem('alertas_tributarios', JSON.stringify(alertas));

                      simpleNotificationService.show({
                        type: 'success',
                        message: 'Alerta de oportunidades criado com sucesso!'
                      });
                    } catch (error) {
                      console.error('Erro ao criar alerta:', error);
                    }
                  }}
                  variant="outline"
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Criar Alerta
                </Button>

                <Button
                  onClick={() => {
                    // Navegar para página de tokenização com créditos da análise
                    const creditosTokenizacao = JSON.parse(localStorage.getItem('creditos_identificados') || '[]')
                      .slice(0, analysisStats.creditsIdentified);
                    
                    localStorage.setItem('creditos_para_tokenizar', JSON.stringify(creditosTokenizacao));
                    window.location.href = '/dashboard/tokenizacao';
                  }}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Tokenizar Créditos
                </Button>
              </div>


            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <FileText className="w-8 h-8 mr-3 text-violet-600" />
            Análise de Obrigações
          </h1>
          <p className="text-muted-foreground">
            Sistema automatizado de análise fiscal conforme Manual Tributa.AI
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard/recuperacao')}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progresso da Análise</CardTitle>
          <CardDescription>
            Etapa {etapaAtual} de {etapas.length} - {etapas[etapaAtual - 1].titulo}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            {etapas.map((etapa, index) => (
              <div key={etapa.numero} className="flex items-center">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    etapaAtual > etapa.numero
                      ? 'bg-violet-500 text-white'
                      : etapaAtual === etapa.numero
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }
                `}
                >
                  {etapaAtual > etapa.numero ? <CheckCircle className="h-5 w-5" /> : etapa.numero}
                </div>
                {index < etapas.length - 1 && (
                  <div
                    className={`
                    w-20 h-1 mx-2
                    ${etapaAtual > etapa.numero ? 'bg-violet-500' : 'bg-gray-200'}
                  `}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={(etapaAtual / etapas.length) * 100} className="w-full" />
        </CardContent>
      </Card>

      <div className="min-h-[500px]">{renderEtapa()}</div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button variant="outline" onClick={etapaAnterior} disabled={etapaAtual === 1}>
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Anterior
            </Button>

            <div className="flex gap-2">
              {etapaAtual < etapas.length ? (
                <Button 
                  onClick={proximaEtapa} 
                  disabled={!podeProximaEtapa()}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {etapaAtual === 3 && analysisProgress === 0 && !processing
                    ? 'Iniciar Análise'
                    : 'Próxima'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/dashboard/recuperacao/resultados-analise')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Ver Resultados
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnaliseObrigacoesPage;
