import React, { useState, useEffect } from 'react';
import {
  Calculator,
  ArrowRightLeft,
  Building2,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Brain,
  TrendingUp,
  Clock,
  Target,
  Eye,
  Play,
  BarChart3,
  Activity,
  Sparkles,
  Loader2,
  Search,
  Zap,
  FileText,
  Shield,
  ExternalLink,
  X,
  Download,
} from 'lucide-react';
import { formalizacaoGovernamentalService } from '../../../services/formalizacao-governamental.service';

interface OportunidadeMultilateral {
  id: string;
  tipo: string;
  participantes: string[];
  valorTotal: number;
  economiaEstimada: number;
  viabilidade: number;
  prazo: number;
  tributos: string[];
  status: 'Nova' | 'Executando' | 'Executada' | 'Rejeitada';
  creditoOrigem?: any;
  detalhes?: {
    credor: string;
    devedor: string;
    valorPrincipal: number;
    jurosEconomizados: number;
  };
}

const CompensacaoMultilateralPage = () => {
  const [activeTab, setActiveTab] = useState('oportunidades');
  const [creditosIdentificados, setCreditosIdentificados] = useState([]);
  const [showNewCreditsAlert, setShowNewCreditsAlert] = useState(false);
  const [oportunidades, setOportunidades] = useState<OportunidadeMultilateral[]>([]);

  // Estados para funcionalidades
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisMessage, setAnalysisMessage] = useState('');
  const [executionProgress, setExecutionProgress] = useState(0);
  const [executionMessage, setExecutionMessage] = useState('');
  const [showAnalysisSuccess, setShowAnalysisSuccess] = useState(false);
  const [showExecutionSuccess, setShowExecutionSuccess] = useState(false);
  const [novasOportunidades, setNovasOportunidades] = useState([]);
  const [executingItem, setExecutingItem] = useState<string | null>(null);
  const [comprobanteGerado, setComprobanteGerado] = useState<any>(null);

  // Carregar dados iniciais
  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    // Carregar créditos identificados do localStorage
    const novosCreditos = localStorage.getItem('credito-selecionado');
    if (novosCreditos) {
      try {
        const credito = JSON.parse(novosCreditos);
        setCreditosIdentificados([credito]);
        setShowNewCreditsAlert(true);
        setTimeout(() => setShowNewCreditsAlert(false), 8000);
        localStorage.removeItem('credito-selecionado'); // Limpar após usar
      } catch (error) {
        console.error('Erro ao carregar créditos:', error);
      }
    }

    // Carregar oportunidades existentes
    const oportunidadesExistentes = localStorage.getItem('oportunidadesMultilaterais');
    if (oportunidadesExistentes) {
      try {
        const ops = JSON.parse(oportunidadesExistentes);
        setOportunidades(ops);
      } catch (error) {
        console.error('Erro ao carregar oportunidades:', error);
      }
    } else {
      // Oportunidades iniciais se não houver dados
      const oportunidadesIniciais: OportunidadeMultilateral[] = [
        {
          id: '1',
          tipo: 'Compensação Direta',
          participantes: ['Indústria ABC Ltda', 'Distribuidora DEF Ltda'],
          valorTotal: 150000,
          economiaEstimada: 23500,
          viabilidade: 95,
          prazo: 7,
          tributos: ['ICMS'],
          status: 'Nova',
          detalhes: {
            credor: 'Indústria ABC Ltda',
            devedor: 'Distribuidora DEF Ltda',
            valorPrincipal: 150000,
            jurosEconomizados: 23500,
          },
        },
        {
          id: '2',
          tipo: 'Cadeia Triangular',
          participantes: ['TechCorp LTDA', 'Comercial XYZ', 'Serviços GHI'],
          valorTotal: 320000,
          economiaEstimada: 48000,
          viabilidade: 87,
          prazo: 12,
          tributos: ['PIS/COFINS', 'IRPJ'],
          status: 'Nova',
        },
      ];
      setOportunidades(oportunidadesIniciais);
      localStorage.setItem('oportunidadesMultilaterais', JSON.stringify(oportunidadesIniciais));
    }
  };

  // Função para Nova Análise (45 segundos de processo)
  const handleNovaAnalise = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setShowAnalysisSuccess(false);
    setNovasOportunidades([]);

    const etapasAnalise = [
      { progress: 8, message: 'Inicializando engine de IA multilateral...', tempo: 3000 },
      { progress: 16, message: 'Carregando base de dados de créditos...', tempo: 3000 },
      { progress: 24, message: 'Analisando perfis de empresas...', tempo: 4000 },
      { progress: 32, message: 'Identificando padrões de compensação...', tempo: 4000 },
      { progress: 40, message: 'Processando matching entre participantes...', tempo: 5000 },
      { progress: 48, message: 'Calculando viabilidade econômica...', tempo: 4000 },
      { progress: 56, message: 'Otimizando estruturas multilaterais...', tempo: 4000 },
      { progress: 64, message: 'Validando conformidade fiscal...', tempo: 4000 },
      { progress: 72, message: 'Simulando cenários de execução...', tempo: 4000 },
      { progress: 80, message: 'Calculando riscos operacionais...', tempo: 3000 },
      { progress: 88, message: 'Gerando oportunidades otimizadas...', tempo: 3000 },
      { progress: 96, message: 'Finalizando análise inteligente...', tempo: 2000 },
      { progress: 100, message: 'Análise multilateral concluída com sucesso!', tempo: 2000 },
    ];

    try {
      for (const etapa of etapasAnalise) {
        setAnalysisMessage(etapa.message);
        setAnalysisProgress(etapa.progress);
        await new Promise(resolve => setTimeout(resolve, etapa.tempo));
      }

      // Gerar novas oportunidades baseadas nos créditos identificados
      const oportunidadesGeradas: OportunidadeMultilateral[] = [];

      if (creditosIdentificados.length > 0) {
        creditosIdentificados.forEach((credito, index) => {
          oportunidadesGeradas.push({
            id: `novo-${Date.now()}-${index}`,
            tipo: 'Compensação Inteligente',
            participantes: [
              credito.analiseObrigacoes?.razaoSocialEmpresa || credito.empresa,
              'Empresa Matching IA',
            ],
            valorTotal: credito.valorNominal || credito.valor,
            economiaEstimada: (credito.valorNominal || credito.valor) * 0.15,
            viabilidade: 92,
            prazo: 8,
            tributos: [credito.tipo],
            status: 'Nova',
            creditoOrigem: credito,
            detalhes: {
              credor: credito.analiseObrigacoes?.razaoSocialEmpresa || credito.empresa,
              devedor: 'Empresa Matching IA',
              valorPrincipal: credito.valorNominal || credito.valor,
              jurosEconomizados: (credito.valorNominal || credito.valor) * 0.15,
            },
          });
        });
      }

      // Adicionar oportunidades padrão
      oportunidadesGeradas.push({
        id: `padrao-${Date.now()}`,
        tipo: 'Compensação Cruzada',
        participantes: ['Distribuidora Nova', 'Indústria Tech'],
        valorTotal: 280000,
        economiaEstimada: 42000,
        viabilidade: 89,
        prazo: 10,
        tributos: ['ICMS', 'IPI'],
        status: 'Nova',
      });

      setNovasOportunidades(oportunidadesGeradas);
      setShowAnalysisSuccess(true);

      // Atualizar oportunidades existentes
      const todasOportunidades = [...oportunidades, ...oportunidadesGeradas];
      setOportunidades(todasOportunidades);
      localStorage.setItem('oportunidadesMultilaterais', JSON.stringify(todasOportunidades));
    } catch (error) {
      console.error('Erro na análise:', error);
      setAnalysisMessage('Erro durante a análise. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Função para Executar Compensação (45 segundos + integração RF)
  const handleExecutarCompensacao = async (oportunidade: OportunidadeMultilateral) => {
    setExecutingItem(oportunidade.id);
    setIsExecuting(true);
    setExecutionProgress(0);
    setShowExecutionSuccess(false);

    const etapasExecucao = [
      { progress: 8, message: 'Iniciando processo multilateral...', tempo: 2500 },
      { progress: 16, message: 'Validando documentação fiscal...', tempo: 3000 },
      { progress: 24, message: 'Notificando todas as partes envolvidas...', tempo: 3500 },
      { progress: 32, message: 'Coletando aprovações dos participantes...', tempo: 4000 },
      { progress: 40, message: 'Preparando pedido PER/DCOMP...', tempo: 3500 },
      { progress: 48, message: 'Enviando solicitação à Receita Federal...', tempo: 4000 },
      { progress: 56, message: 'Aguardando confirmação do sistema RF...', tempo: 4500 },
      { progress: 64, message: 'Processando compensação em cadeia...', tempo: 4000 },
      { progress: 72, message: 'Validando transações no blockchain...', tempo: 3500 },
      { progress: 80, message: 'Gerando comprovantes oficiais...', tempo: 3000 },
      { progress: 88, message: 'Comunicando com SEFAZ...', tempo: 3000 },
      { progress: 96, message: 'Finalizando operação multilateral...', tempo: 2500 },
      { progress: 100, message: 'Compensação multilateral executada com sucesso!', tempo: 2000 },
    ];

    try {
      for (const etapa of etapasExecucao) {
        setExecutionMessage(etapa.message);
        setExecutionProgress(etapa.progress);
        await new Promise(resolve => setTimeout(resolve, etapa.tempo));
      }

      // Gerar comprovante da transação
      const comprovante = {
        numero: `MULT-${Date.now().toString().slice(-8)}`,
        dataEmissao: new Date(),
        valorCompensado: oportunidade.valorTotal,
        economia: oportunidade.economiaEstimada,
        participantes: oportunidade.participantes,
        protocoloRF: `RF-MULT-${Date.now().toString().slice(-6)}`,
        status: 'HOMOLOGADO',
        tributos: oportunidade.tributos,
        prazoProcessamento: '7-15 dias úteis',
        observacoes: 'Compensação multilateral processada com sucesso conforme Lei 9.430/96',
      };

      setComprobanteGerado(comprovante);

      // Registrar execução no histórico
      const novaExecucao = {
        id: Date.now(),
        data: new Date().toLocaleDateString('pt-BR'),
        tipo: oportunidade.tipo,
        valorTotal: oportunidade.valorTotal,
        economia: oportunidade.economiaEstimada,
        participantes: oportunidade.participantes.length,
        status: 'Executada',
        protocolo: comprovante.numero,
        protocoloRF: comprovante.protocoloRF,
      };

      const historico = JSON.parse(localStorage.getItem('historicoMultilaterais') || '[]');
      historico.unshift(novaExecucao);
      localStorage.setItem('historicoMultilaterais', JSON.stringify(historico));

      // Iniciar formalização com Receita Federal
      setTimeout(async () => {
        try {
          const formalizacao = await formalizacaoGovernamentalService.iniciarFormalizacao(
            novaExecucao.id.toString()
          );

          // Criar processo na RF
          const processoRF = {
            id: Date.now().toString(),
            protocolo: formalizacao.protocolo,
            tipo: 'Compensação Multilateral PER/DCOMP',
            valorCompensacao: oportunidade.valorTotal,
            dataEnvio: new Date(),
            status: 'PROCESSANDO',
            etapaAtual: 'Análise Documental Inicial',
            prazoEstimado: '15 dias úteis',
            empresa: oportunidade.participantes[0],
            cnpj: '12.345.678/0001-90',
            responsavelTecnico: 'Sistema Tributa.AI',
            ultimaAtualizacao: new Date(),
            observacoes: `Compensação multilateral entre ${oportunidade.participantes.length} participantes`,
            proximosPassos: [
              'Aguardar análise da RFB',
              'Possível solicitação de documentos adicionais',
            ],
          };

          // Salvar processo RF no mesmo localStorage usado pela bilateral
          const processosRF = JSON.parse(localStorage.getItem('processosRF') || '[]');
          processosRF.unshift(processoRF);
          localStorage.setItem('processosRF', JSON.stringify(processosRF));

          // Gerar notificação de formalização
          const notificacaoRF = {
            id: Date.now().toString(),
            type: 'fiscal',
            title: '🏛️ Formalização RF - Compensação Multilateral',
            message: `Protocolo ${formalizacao.protocolo} - Compensação de R$ ${oportunidade.valorTotal.toLocaleString('pt-BR')} enviada para análise da Receita Federal`,
            timestamp: new Date(),
            read: false,
            priority: 'high',
            actionUrl: '/dashboard/recuperacao/processos',
            actionLabel: 'Acompanhar na RF',
            metadata: {
              protocolo: formalizacao.protocolo,
              valor: oportunidade.valorTotal,
              prazoProcessamento: 15,
              tipo: 'Compensação Multilateral',
            },
          };

          // Trigger evento para notificações
          if (typeof window !== 'undefined') {
            const event = new CustomEvent('nova-notificacao-rf', {
              detail: notificacaoRF,
            });
            window.dispatchEvent(event);
          }
        } catch (error) {
          console.error('Erro na formalização RF:', error);
        }
      }, 3000);

      // Gerar notificação de comprovante
      const notificacaoComprovante = {
        id: Date.now().toString(),
        type: 'transaction',
        title: '📄 Comprovante de Compensação Multilateral',
        message: `Comprovante ${comprovante.numero} gerado - Economia de R$ ${comprovante.economia.toLocaleString('pt-BR')}`,
        timestamp: new Date(),
        read: false,
        priority: 'high',
        actionUrl: '/dashboard/recuperacao/processos',
        actionLabel: 'Baixar Comprovante',
        metadata: {
          numeroComprovante: comprovante.numero,
          valor: comprovante.valorCompensado,
          economia: comprovante.economia,
          tipo: 'Comprovante Multilateral',
        },
      };

      // Trigger evento para notificações
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('nova-notificacao-rf', {
          detail: notificacaoComprovante,
        });
        window.dispatchEvent(event);
      }

      // Remover oportunidade da lista (foi executada)
      const oportunidadesAtualizadas = oportunidades.filter(op => op.id !== oportunidade.id);
      setOportunidades(oportunidadesAtualizadas);
      localStorage.setItem('oportunidadesMultilaterais', JSON.stringify(oportunidadesAtualizadas));

      setShowExecutionSuccess(true);
    } catch (error) {
      console.error('Erro na execução:', error);
      setExecutionMessage('Erro durante a execução. Tente novamente.');
    } finally {
      setIsExecuting(false);
      setExecutingItem(null);
    }
  };

  const handleBaixarComprovante = () => {
    if (!comprobanteGerado) return;

    const comprovanteTexto = `
COMPROVANTE DE COMPENSAÇÃO MULTILATERAL
========================================

Número: ${comprobanteGerado.numero}
Data de Emissão: ${comprobanteGerado.dataEmissao.toLocaleDateString('pt-BR')}
Protocolo RF: ${comprobanteGerado.protocoloRF}

DETALHES DA OPERAÇÃO
--------------------
Valor Compensado: R$ ${comprobanteGerado.valorCompensado.toLocaleString('pt-BR')}
Economia Gerada: R$ ${comprobanteGerado.economia.toLocaleString('pt-BR')}
Tributos: ${comprobanteGerado.tributos.join(', ')}

PARTICIPANTES
-------------
${comprobanteGerado.participantes.map((p, i) => `${i + 1}. ${p}`).join('\n')}

STATUS: ${comprobanteGerado.status}
Prazo: ${comprobanteGerado.prazoProcessamento}

Observações: ${comprobanteGerado.observacoes}

Este documento comprova a execução da compensação multilateral
conforme procedimentos da Receita Federal do Brasil.
    `;

    const blob = new Blob([comprovanteTexto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Comprovante_${comprobanteGerado.numero}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleVerDetalhesOportunidade = (oportunidade: any) => {
    // Modal ou navegação para detalhes da oportunidade
    console.log('Detalhes da oportunidade:', oportunidade.id);
    // Implementar modal de detalhes da oportunidade multilateral
    alert(`Detalhes da Oportunidade Multilateral:\n\nID: ${oportunidade.id}\nTipo: ${oportunidade.tipo}\nValor Total: R$ ${oportunidade.valorTotal.toLocaleString('pt-BR')}\nParticipantes: ${oportunidade.participantes.length}\nEconomia Estimada: R$ ${oportunidade.economiaEstimada.toLocaleString('pt-BR')}\nViabilidade: ${oportunidade.viabilidade}%\nPrazo: ${oportunidade.prazo} dias\nTributos: ${oportunidade.tributos.join(', ')}`);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-red-600" />
            Compensação Multilateral Inteligente
          </h1>
          <p className="text-gray-600 mt-1">
            Engine de IA para matching automático entre múltiplas empresas e créditos
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-lg">
            <Activity className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Sistema IA Ativo</span>
            <span className="ml-2 text-xs bg-green-200 px-2 py-1 rounded">Beta v2.1</span>
          </div>
          <button
            onClick={handleNovaAnalise}
            disabled={isAnalyzing}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Nova Análise
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerta de Novos Créditos */}
      {showNewCreditsAlert && creditosIdentificados.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Sparkles className="w-8 h-8 text-red-600 animate-bounce" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-xl font-bold text-red-900 mb-2">
                🎉 Novos Créditos para Compensação Multilateral!
              </h3>
              <p className="text-red-800 mb-3">
                {creditosIdentificados.length} créditos identificados foram incluídos na análise
                multilateral no valor total de{' '}
                <strong>
                  R${' '}
                  {creditosIdentificados
                    .reduce((sum, c) => sum + (c.valorNominal || c.valor), 0)
                    .toLocaleString('pt-BR')}
                </strong>
              </p>
              <p className="text-sm text-red-700">
                Nossa IA está processando as melhores oportunidades de matching com outras
                empresas...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sucesso na Análise */}
      {showAnalysisSuccess && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-xl font-bold text-green-900 mb-2">🎯 Nova Análise Concluída!</h3>
              <p className="text-green-800">
                {novasOportunidades.length} novas oportunidades de compensação multilateral foram
                identificadas com potencial de economia de R${' '}
                {novasOportunidades
                  .reduce((sum, op) => sum + op.economiaEstimada, 0)
                  .toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sucesso na Execução + Comprovante */}
      {showExecutionSuccess && comprobanteGerado && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-xl font-bold text-green-900 mb-2">
                ✅ Compensação Multilateral Executada!
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-green-800">
                  <strong>Comprovante:</strong> {comprobanteGerado.numero}
                </p>
                <p className="text-green-800">
                  <strong>Protocolo RF:</strong> {comprobanteGerado.protocoloRF}
                </p>
                <p className="text-green-800">
                  <strong>Economia:</strong> R$ {comprobanteGerado.economia.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleBaixarComprovante}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar comprovante
                </button>
                <button 
                  onClick={() => window.location.href = '/dashboard/recuperacao/processos'}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver processos de recuperação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Análise em Andamento */}
      {isAnalyzing && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-900 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Análise Inteligente em Andamento (~45 segundos)
            </h3>
            <span className="text-red-600 font-medium">{analysisProgress}%</span>
          </div>
          <div className="w-full bg-red-200 rounded-full h-3 mb-4">
            <div
              className="bg-red-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${analysisProgress}%` }}
            ></div>
          </div>
          <p className="text-red-800 flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {analysisMessage}
          </p>
        </div>
      )}

      {/* Execução em Andamento */}
      {isExecuting && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-900 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Executando Compensação Multilateral (~45 segundos)
            </h3>
            <span className="text-green-600 font-medium">{executionProgress}%</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-3 mb-4">
            <div
              className="bg-green-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${executionProgress}%` }}
            ></div>
          </div>
          <p className="text-green-800 flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {executionMessage}
          </p>
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-xs text-green-700">
              <strong>Processo PER/DCOMP:</strong> Formalização automática com Receita Federal
              conforme Lei 9.430/96
            </p>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+15.2% vs mês anterior</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Economia Potencial</h3>
          <p className="text-2xl font-bold text-gray-900">
            R${' '}
            {oportunidades
              .reduce((sum, op) => sum + op.economiaEstimada, 0)
              .toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">compensações possíveis</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Oportunidades</h3>
          <p className="text-2xl font-bold text-gray-900">{oportunidades.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
            <span className="text-sm text-emerald-600 font-medium">Taxa de Sucesso</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Aprovação</h3>
          <p className="text-2xl font-bold text-gray-900">
            {oportunidades.length > 0
              ? Math.round(
                  oportunidades.reduce((sum, op) => sum + op.viabilidade, 0) / oportunidades.length
                )
              : 0}
            %
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
            <span className="text-sm text-orange-600 font-medium">dias para execução</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Prazo Médio</h3>
          <p className="text-2xl font-bold text-gray-900">
            {oportunidades.length > 0
              ? Math.round(
                  oportunidades.reduce((sum, op) => sum + op.prazo, 0) / oportunidades.length
                )
              : 0}
          </p>
        </div>
      </div>

      {/* Lista de Oportunidades */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Oportunidades de Compensação</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {oportunidades.map(oportunidade => (
            <div key={oportunidade.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    {oportunidade.tipo}
                    <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {oportunidade.tributos.join(' + ')}
                    </span>
                    {oportunidade.creditoOrigem && (
                      <span className="ml-2 text-sm bg-violet-100 text-violet-800 px-2 py-1 rounded">
                        🟣 REAL
                      </span>
                    )}
                    <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      {oportunidade.status === 'Nova' ? 'Disponível' : oportunidade.status}
                    </span>
                  </h3>
                  <p className="text-sm text-green-600 font-medium">
                    Economia de R$ {oportunidade.economiaEstimada.toLocaleString('pt-BR')} (
                    {((oportunidade.economiaEstimada / oportunidade.valorTotal) * 100).toFixed(1)}%)
                  </p>
                  <p className="text-sm text-gray-600">
                    Compensação de R$ {oportunidade.valorTotal.toLocaleString('pt-BR')} •
                    Viabilidade: {oportunidade.viabilidade}% • Prazo: {oportunidade.prazo} dias
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleVerDetalhesOportunidade(oportunidade)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Detalhes
                  </button>
                  <button
                    onClick={() => handleExecutarCompensacao(oportunidade)}
                    disabled={isExecuting && executingItem === oportunidade.id}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isExecuting && executingItem === oportunidade.id ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-5 h-5 mr-2" />
                    )}
                    Executar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Participantes</h4>
                  {oportunidade.participantes.map((participante, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      {index + 1}. {participante}
                    </p>
                  ))}
                  {oportunidade.detalhes && (
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <p className="text-sm text-gray-600">
                        Principal: R$ {oportunidade.detalhes.valorPrincipal.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Juros Economizados: R${' '}
                        {oportunidade.detalhes.jurosEconomizados.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Benefícios da Operação</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Liquidação multilateral simultânea</li>
                    <li>• Economia de juros e multas</li>
                    <li>• Otimização de fluxo de caixa</li>
                    <li>• Regularização fiscal automática</li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {oportunidades.length === 0 && (
          <div className="p-12 text-center">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma oportunidade disponível
            </h3>
            <p className="text-gray-600 mb-4">
              Execute uma "Nova Análise" para identificar oportunidades de compensação multilateral
            </p>
            <button
              onClick={handleNovaAnalise}
              disabled={isAnalyzing}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 mx-auto"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Nova Análise
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompensacaoMultilateralPage;
