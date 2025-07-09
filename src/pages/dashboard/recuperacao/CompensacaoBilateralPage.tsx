import React, { useState, useEffect } from 'react';
import {
  ArrowRightLeft,
  Building2,
  DollarSign,
  CheckCircle,
  Clock,
  Calculator,
  Eye,
  Play,
  FileText,
  Users,
  Target,
  Sparkles,
  Loader2,
  AlertTriangle,
  Search,
  RefreshCw,
  Shield,
  ExternalLink,
  X,
  Download,
} from 'lucide-react';
import RefreshButton from '../../../components/ui/refresh-button';
import { StandardFilters, COMPENSATION_FILTERS, FilterValue } from '../../../components/ui/standard-filters';
import { simpleNotificationService } from '../../../services/notification-simple.service';
import { formalizacaoGovernamentalService } from '../../../services/formalizacao-governamental.service';

// Hook para carregar créditos identificados do banco de dados
const useCreditosFromDB = () => {
  const [creditosDB, setCreditosDB] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscarCreditosDB = async () => {
    try {
      // Usar dados mockados em vez de API
      const mockData = [
        {
          id: '1',
          tipo: 'ICMS',
          descricao: 'Crédito de ICMS - Exportação',
          valorNominal: 150000,
          valorAtual: 95.5,
          valorEconomia: 22500,
          periodoInicio: '2024-01-01',
          periodoFim: '2024-12-31',
          statusCredito: 'IDENTIFICADO',
          podeCompensar: true,
          tribunalOrigem: 'TJ-SP',
          numeroProcesso: '1234567-89.2024.8.26.0001',
          analiseObrigacoes: {
            id: '1',
            cnpjEmpresa: '12.345.678/0001-90',
            razaoSocialEmpresa: 'Empresa Exemplo LTDA',
            nomeFantasiaEmpresa: 'Empresa Exemplo',
            regimeTributario: 'LUCRO_REAL',
            criadoEm: '2024-01-01T00:00:00.000Z',
          },
          criadoEm: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          tipo: 'PIS/COFINS',
          descricao: 'Crédito de PIS/COFINS - Insumos',
          valorNominal: 85000,
          valorAtual: 92.3,
          valorEconomia: 12750,
          periodoInicio: '2024-01-01',
          periodoFim: '2024-12-31',
          statusCredito: 'IDENTIFICADO',
          podeCompensar: true,
          tribunalOrigem: 'TRF-3',
          numeroProcesso: '5678901-23.2024.4.03.0001',
          analiseObrigacoes: {
            id: '2',
            cnpjEmpresa: '98.765.432/0001-10',
            razaoSocialEmpresa: 'Indústria ABC S.A.',
            nomeFantasiaEmpresa: 'ABC Industrial',
            regimeTributario: 'LUCRO_REAL',
            criadoEm: '2024-01-01T00:00:00.000Z',
          },
          criadoEm: '2024-01-01T00:00:00.000Z',
        },
      ];

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));

      // Converter formato do banco para formato da compensação
      const creditosFormatados = mockData.map(credito => ({
        id: `db-${credito.id}`,
        tipo: credito.tipo,
        descricao: credito.descricao,
        valor: credito.valorNominal,
        empresa: credito.analiseObrigacoes.razaoSocialEmpresa,
        vencimento: new Date(credito.periodoFim).toLocaleDateString('pt-BR'),
        isNew: true,
        isFromDB: true,
        original: credito,
      }));
      setCreditosDB(creditosFormatados);
    } catch (error) {
      console.error('Erro ao buscar créditos do BD:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarCreditosDB();
  }, []);

  return { creditosDB, loading, buscarCreditosDB };
};

const CompensacaoBilateralPage = () => {
  const [selectedCredito, setSelectedCredito] = useState(null);
  const [selectedDebito, setSelectedDebito] = useState(null);
  const [creditosIdentificados, setCreditosIdentificados] = useState([]);
  const [showNewCreditsAlert, setShowNewCreditsAlert] = useState(false);
  const { creditosDB, loading: loadingCreditosDB, buscarCreditosDB } = useCreditosFromDB();

  // Estados para as funcionalidades
  const [isSimulating, setIsSimulating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationMessage, setSimulationMessage] = useState('');
  const [executionProgress, setExecutionProgress] = useState(0);
  const [executionMessage, setExecutionMessage] = useState('');
  const [showExecutionSuccess, setShowExecutionSuccess] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValue>({});
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');

  // Estados para formalização governamental
  const [isFormalizando, setIsFormalizando] = useState(false);
  const [formalizacaoProgress, setFormalizacaoProgress] = useState(0);
  const [formalizacaoMessage, setFormalizacaoMessage] = useState('');
  const [showFormalizacaoSuccess, setShowFormalizacaoSuccess] = useState(false);
  const [protocoloRF, setProtocoloRF] = useState('');
  const [statusRF, setStatusRF] = useState('');

  // Estados para modal de seleção
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [modalSelectedCredito, setModalSelectedCredito] = useState(null);
  const [modalSelectedDebito, setModalSelectedDebito] = useState(null);

  // Carregar créditos identificados do localStorage (compatibilidade)
  useEffect(() => {
    const creditoSelecionado = localStorage.getItem('credito-selecionado');
    if (creditoSelecionado) {
      try {
        const credito = JSON.parse(creditoSelecionado);
        // Converter para formato da compensação
        const creditoFormatado = {
          id: `selected-${credito.id}`,
          tipo: credito.tipo,
          descricao: credito.descricao,
          valor: credito.valorNominal || credito.valor,
          empresa: credito.analiseObrigacoes?.razaoSocialEmpresa || credito.empresa,
          vencimento: credito.periodoFim
            ? new Date(credito.periodoFim).toLocaleDateString('pt-BR')
            : 'N/A',
          isNew: true,
          isSelected: true,
        };
        setCreditosIdentificados([creditoFormatado]);
        setSelectedCredito(creditoFormatado);
        setShowNewCreditsAlert(true);
        // Limpar após usar
        localStorage.removeItem('credito-selecionado');
        setTimeout(() => setShowNewCreditsAlert(false), 5000);
      } catch (error) {
        console.error('Erro ao carregar crédito selecionado:', error);
      }
    }

    // Carregar créditos da página anterior
    const creditosCompensacao = localStorage.getItem('creditosCompensacao');
    if (creditosCompensacao) {
      try {
        const creditos = JSON.parse(creditosCompensacao);
        if (Array.isArray(creditos) && creditos.length > 0) {
          setCreditosIdentificados(prevCreditos => [
            ...prevCreditos,
            ...creditos.map(c => ({
              ...c,
              id: `comp-${c.id}`,
              isNew: true,
              isSelected: true
            }))
          ]);
          // Se só tiver um crédito, já seleciona ele
          if (creditos.length === 1) {
            setSelectedCredito({
              ...creditos[0],
              id: `comp-${creditos[0].id}`,
              isNew: true,
              isSelected: true
            });
          }
          setShowNewCreditsAlert(true);
          setTimeout(() => setShowNewCreditsAlert(false), 5000);
        }
        // Limpar após usar
        localStorage.removeItem('creditosCompensacao');
      } catch (error) {
        console.error('Erro ao carregar créditos para compensação:', error);
      }
    }
  }, []);

  // O restante do código permanece o mesmo, apenas mudando o nome da função de exportação
  
  // Aqui continuaria o resto do código do CompensacaoPage.tsx...
  
  // Função para simular compensação
  const handleSimularCompensacao = async () => {
    if (!selectedCredito || !selectedDebito) {
      simpleNotificationService.show({
        type: 'error',
        message: 'Selecione um crédito e um débito para simular a compensação'
      });
      return;
    }

    setIsSimulating(true);
    setSimulationProgress(0);
    setSimulationMessage('Iniciando simulação...');

    try {
      // Simular progresso
      const steps = [
        { message: 'Validando crédito...', progress: 20 },
        { message: 'Validando débito...', progress: 40 },
        { message: 'Calculando valores...', progress: 60 },
        { message: 'Verificando compatibilidade...', progress: 80 },
        { message: 'Finalizando simulação...', progress: 100 }
      ];

      for (const step of steps) {
        setSimulationMessage(step.message);
        setSimulationProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Calcular resultado da simulação
      const valorCredito = selectedCredito.valor;
      const valorDebito = selectedDebito.valor;
      const valorCompensacao = Math.min(valorCredito, valorDebito);
      const saldoCredito = valorCredito - valorCompensacao;
      const saldoDebito = valorDebito - valorCompensacao;
      const economia = valorCompensacao * 0.15; // 15% de economia

      const result = {
        valorCredito,
        valorDebito,
        valorCompensacao,
        saldoCredito,
        saldoDebito,
        economia,
        viabilidade: 98.5,
        prazoExecucao: '15 dias úteis',
        compatibilidade: 'Alta',
        riscos: ['Baixo risco fiscal', 'Documentação completa']
      };

      setSimulationResult(result);
      simpleNotificationService.show({
        type: 'success',
        message: 'Simulação concluída com sucesso!'
      });

    } catch (error) {
      console.error('Erro na simulação:', error);
      simpleNotificationService.show({
        type: 'error',
        message: 'Erro ao simular compensação'
      });
    } finally {
      setIsSimulating(false);
    }
  };
  
  // Função para processar compensação
  const handleProcessarCompensacao = async () => {
    if (!simulationResult) {
      simpleNotificationService.show({
        type: 'error',
        message: 'Execute a simulação primeiro'
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingMessage('Iniciando processamento...');

    try {
      const steps = [
        { message: 'Validando dados...', progress: 20 },
        { message: 'Gerando DCOMP...', progress: 40 },
        { message: 'Validando com RFB...', progress: 60 },
        { message: 'Criando processo...', progress: 80 },
        { message: 'Finalizando...', progress: 100 }
      ];

      for (const step of steps) {
        setProcessingMessage(step.message);
        setProcessingProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      simpleNotificationService.show({
        type: 'success',
        message: 'Compensação processada com sucesso!'
      });

    } catch (error) {
      console.error('Erro no processamento:', error);
      simpleNotificationService.show({
        type: 'error',
        message: 'Erro ao processar compensação'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Função para executar compensação
  const handleExecutarCompensacao = async () => {
    if (!simulationResult) {
      simpleNotificationService.show({
        type: 'error',
        message: 'Execute a simulação primeiro'
      });
      return;
    }

    setIsExecuting(true);
    setExecutionProgress(0);
    setExecutionMessage('Iniciando execução...');

    try {
      const steps = [
        { message: 'Enviando para RFB...', progress: 25 },
        { message: 'Aguardando processamento...', progress: 50 },
        { message: 'Confirmando compensação...', progress: 75 },
        { message: 'Atualizando registros...', progress: 100 }
      ];

      for (const step of steps) {
        setExecutionMessage(step.message);
        setExecutionProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setShowExecutionSuccess(true);
      setProtocoloRF(`RFB${Date.now()}`);
      setStatusRF('PROCESSADO');

      simpleNotificationService.show({
        type: 'success',
        message: 'Compensação executada com sucesso!'
      });

    } catch (error) {
      console.error('Erro na execução:', error);
      simpleNotificationService.show({
        type: 'error',
        message: 'Erro ao executar compensação'
      });
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Função para executar compensação bilateral
  const handleExecutarCompensacaoBilateral = async () => {
    if (!selectedCredito || !selectedDebito) {
      simpleNotificationService.show({
        type: 'error',
        message: 'Selecione um crédito e um débito para executar a compensação'
      });
      return;
    }

    // Executar simulação primeiro se não foi feita
    if (!simulationResult) {
      await handleSimularCompensacao();
    }

    // Depois processar
    await handleProcessarCompensacao();

    // Finalmente executar
    await handleExecutarCompensacao();
  };
  
  // Função para processar compensação bilateral
  const handleProcessarCompensacaoBilateral = async () => {
    if (!selectedCredito || !selectedDebito) {
      simpleNotificationService.show({
        type: 'error',
        message: 'Selecione um crédito e um débito para processar'
      });
      return;
    }

    await handleProcessarCompensacao();
  };
  
  // Funções para os botões não funcionais
  const handleBaixarComprovante = () => {
    if (simulationResult?.protocoloRFB) {
      // Simular download do comprovante
      const element = document.createElement('a');
      const file = new Blob([
        `COMPROVANTE DE COMPENSAÇÃO BILATERAL\n\n` +
        `Protocolo RFB: ${simulationResult.protocoloRFB}\n` +
        `Valor Compensado: R$ ${simulationResult.valorCompensado.toLocaleString('pt-BR')}\n` +
        `Data: ${new Date().toLocaleDateString('pt-BR')}\n` +
        `Crédito: ${selectedCredito?.descricao}\n` +
        `Débito: ${selectedDebito?.descricao}`
      ], { type: 'text/plain' });
      
      element.href = URL.createObjectURL(file);
      element.download = `comprovante-compensacao-${simulationResult.protocoloRFB}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      simpleNotificationService.show({
        type: 'success',
        message: 'Comprovante baixado com sucesso!'
      });
    } else {
      simpleNotificationService.show({
        type: 'error',
        message: 'Nenhuma compensação para baixar comprovante'
      });
    }
  };
  
  const handleVerNaRFB = () => {
    if (simulationResult?.protocoloRFB) {
      // Simular abertura do portal da RFB
      const url = `https://www.gov.br/receitafederal/pt-br/servicos/protocolo/${simulationResult.protocoloRFB}`;
      window.open(url, '_blank');
      
      simpleNotificationService.show({
        type: 'info',
        message: 'Abrindo protocolo na Receita Federal...'
      });
    } else {
      simpleNotificationService.show({
        type: 'error',
        message: 'Nenhuma compensação para visualizar na RFB'
      });
    }
  };
  
  const handleVerDetalhesHistorico = (compensacao: any) => {
    // Simular abertura de modal com detalhes
    simpleNotificationService.show({
      type: 'info',
      message: `Detalhes da compensação: ${compensacao.credito} vs ${compensacao.debito}`
    });
  };
  
  // Função para formalizar compensação
  const handleFormalizarCompensacao = async (compensacao: any) => {
    if (!compensacao) {
      simpleNotificationService.show({
        type: 'error',
        message: 'Dados da compensação não encontrados'
      });
      return;
    }

    setIsFormalizando(true);
    setFormalizacaoProgress(0);
    setFormalizacaoMessage('Iniciando formalização...');

    try {
      const resultado = await formalizacaoGovernamentalService.formalizarCompensacao(compensacao);
      
      if (resultado.sucesso) {
        setProtocoloRF(resultado.protocolo);
        setStatusRF(resultado.status);
        setShowFormalizacaoSuccess(true);
        
        simpleNotificationService.show({
          type: 'success',
          message: `Compensação formalizada! Protocolo: ${resultado.protocolo}`
        });
      } else {
        throw new Error(resultado.erro || 'Erro na formalização');
      }

    } catch (error) {
      console.error('Erro na formalização:', error);
      simpleNotificationService.show({
        type: 'error',
        message: 'Erro ao formalizar compensação'
      });
    } finally {
      setIsFormalizando(false);
    }
  };
  
  // Renderização do componente
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ArrowRightLeft className="w-8 h-8 mr-3 text-blue-600" />
            Compensação Bilateral
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema de compensação direta entre créditos e débitos específicos
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <RefreshButton
            category="compensacao"
            onRefreshComplete={() => {
              buscarCreditosDB();
              setShowNewCreditsAlert(true);
              setTimeout(() => setShowNewCreditsAlert(false), 5000);
            }}
            variant="outline"
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          />
          <button
            onClick={handleExecutarCompensacaoBilateral}
            disabled={isExecuting || isProcessing}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isExecuting || isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Executando...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Executar Compensação Bilateral
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Alertas de novos créditos */}
      {showNewCreditsAlert && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">
              Novos créditos identificados adicionados para compensação!
            </span>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <StandardFilters
          filters={COMPENSATION_FILTERS}
          onFilterChange={setFilterValues}
          values={filterValues}
        />
      </div>

      {/* Seleção de Créditos e Débitos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Créditos */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 text-green-600 mr-2" />
            Créditos Disponíveis
          </h3>
          <div className="space-y-3">
            {[...creditosIdentificados, ...creditosDB].map((credito, index) => (
              <div
                key={credito.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedCredito?.id === credito.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${credito.isNew ? 'ring-2 ring-blue-200' : ''}`}
                onClick={() => setSelectedCredito(credito)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{credito.tipo}</div>
                    <div className="text-sm text-gray-600">{credito.descricao}</div>
                    <div className="text-sm text-gray-500">{credito.empresa}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      R$ {credito.valor?.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-gray-500">
                      Venc: {credito.vencimento}
                    </div>
                  </div>
                </div>
                {credito.isNew && (
                  <div className="mt-2 text-xs text-blue-600 font-medium">
                    ● Novo crédito identificado
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Débitos */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            Débitos Disponíveis
          </h3>
          <div className="space-y-3">
            {[
              {
                id: 'deb-1',
                tipo: 'IRPJ',
                descricao: 'Imposto de Renda Pessoa Jurídica',
                valor: 120000,
                empresa: 'Empresa Exemplo LTDA',
                vencimento: '15/12/2024'
              },
              {
                id: 'deb-2',
                tipo: 'CSLL',
                descricao: 'Contribuição Social sobre Lucro Líquido',
                valor: 80000,
                empresa: 'Indústria ABC S.A.',
                vencimento: '20/12/2024'
              }
            ].map((debito) => (
              <div
                key={debito.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedDebito?.id === debito.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDebito(debito)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{debito.tipo}</div>
                    <div className="text-sm text-gray-600">{debito.descricao}</div>
                    <div className="text-sm text-gray-500">{debito.empresa}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-600">
                      R$ {debito.valor?.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-sm text-gray-500">
                      Venc: {debito.vencimento}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ações de Compensação */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calculator className="w-5 h-5 text-blue-600 mr-2" />
          Ações de Compensação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleSimularCompensacao}
            disabled={isSimulating || !selectedCredito || !selectedDebito}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Simulando...
              </>
            ) : (
              <>
                <Eye className="w-5 h-5 mr-2" />
                Simular Compensação
              </>
            )}
          </button>
          
          <button
            onClick={handleProcessarCompensacao}
            disabled={isProcessing || !simulationResult}
            className="flex items-center justify-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 mr-2" />
                Processar DCOMP
              </>
            )}
          </button>
          
          <button
            onClick={handleExecutarCompensacao}
            disabled={isExecuting || !simulationResult}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Executando...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Executar Compensação
              </>
            )}
          </button>
        </div>
      </div>

      {/* Resultado da Simulação */}
      {(isSimulating || simulationResult) && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 text-blue-600 mr-2" />
            Resultado da Simulação
          </h3>
          
          {isSimulating && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{simulationMessage}</span>
                <span className="text-sm font-medium text-blue-600">{simulationProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${simulationProgress}%` }}
                />
              </div>
            </div>
          )}
          
          {simulationResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Valor do Crédito</div>
                <div className="text-2xl font-bold text-green-700">
                  R$ {simulationResult.valorCredito?.toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-red-600 font-medium">Valor do Débito</div>
                <div className="text-2xl font-bold text-red-700">
                  R$ {simulationResult.valorDebito?.toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Valor da Compensação</div>
                <div className="text-2xl font-bold text-blue-700">
                  R$ {simulationResult.valorCompensacao?.toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-yellow-600 font-medium">Economia Estimada</div>
                <div className="text-2xl font-bold text-yellow-700">
                  R$ {simulationResult.economia?.toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progresso de Processamento */}
      {isProcessing && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 text-yellow-600 mr-2" />
            Processamento DCOMP
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{processingMessage}</span>
              <span className="text-sm font-medium text-yellow-600">{processingProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Progresso de Execução */}
      {isExecuting && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Play className="w-5 h-5 text-green-600 mr-2" />
            Execução da Compensação
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{executionMessage}</span>
              <span className="text-sm font-medium text-green-600">{executionProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${executionProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sucesso da Execução */}
      {showExecutionSuccess && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-green-900">
              Compensação Executada com Sucesso!
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Protocolo RFB:</div>
              <div className="font-mono text-sm bg-gray-100 p-2 rounded">{protocoloRF}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Status:</div>
              <div className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {statusRF}
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => handleFormalizarCompensacao(simulationResult)}
              disabled={isFormalizando}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isFormalizando ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Formalizando...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Formalizar
                </>
              )}
            </button>
            <button 
              onClick={handleBaixarComprovante}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Comprovante
            </button>
            <button 
              onClick={handleVerNaRFB}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver na RFB
            </button>
          </div>
        </div>
      )}

      {/* Histórico de Compensações */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 text-gray-600 mr-2" />
          Histórico de Compensações Bilaterais
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-gray-900">Data</th>
                <th className="text-left p-3 font-medium text-gray-900">Crédito</th>
                <th className="text-left p-3 font-medium text-gray-900">Débito</th>
                <th className="text-left p-3 font-medium text-gray-900">Valor</th>
                <th className="text-left p-3 font-medium text-gray-900">Status</th>
                <th className="text-left p-3 font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-600">15/12/2024</td>
                <td className="p-3 text-sm text-gray-900">ICMS - Exportação</td>
                <td className="p-3 text-sm text-gray-900">IRPJ</td>
                <td className="p-3 text-sm font-medium text-green-600">R$ 120.000</td>
                <td className="p-3">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Processado
                  </span>
                </td>
                <td className="p-3">
                  <button 
                    onClick={() => handleVerDetalhesHistorico({ credito: 'ICMS - Exportação', debito: 'IRPJ' })}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Ver detalhes
                  </button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-600">10/12/2024</td>
                <td className="p-3 text-sm text-gray-900">PIS/COFINS</td>
                <td className="p-3 text-sm text-gray-900">CSLL</td>
                <td className="p-3 text-sm font-medium text-green-600">R$ 80.000</td>
                <td className="p-3">
                  <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Pendente
                  </span>
                </td>
                <td className="p-3">
                  <button 
                    onClick={() => handleVerDetalhesHistorico({ credito: 'ICMS - Exportação', debito: 'IRPJ' })}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Ver detalhes
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompensacaoBilateralPage; 