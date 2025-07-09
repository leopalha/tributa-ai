import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  ExternalLink,
  Shield,
  Calendar,
  User,
  Building,
  DollarSign,
  RefreshCw,
  Bell,
  Search,
  Filter,
  MapPin,
  Phone,
  Globe,
  X,
  ChevronDown,
  Play,
  Pause,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import RefreshButton from '../../../components/ui/refresh-button';
import { formalizacaoGovernamentalService } from '../../../services/formalizacao-governamental.service';
import { StandardFilters, COMPENSATION_FILTERS, FilterValue } from '../../../components/ui/standard-filters';
import { simpleNotificationService } from '../../../services/notification-simple.service';

interface ProcessoRF {
  id: string;
  protocolo: string;
  tipo: string;
  valorCompensacao: number;
  dataEnvio: Date;
  status: 'PENDENTE' | 'PROCESSANDO' | 'APROVADO' | 'REJEITADO' | 'ANALISE_ADICIONAL';
  etapaAtual: string;
  prazoEstimado: string;
  empresa: string;
  cnpj: string;
  responsavelTecnico: string;
  ultimaAtualizacao: Date;
  observacoes?: string;
  documentosPendentes?: string[];
  proximosPassos?: string[];
}

const ProcessosRecuperacaoPage = () => {
  const [processos, setProcessos] = useState<ProcessoRF[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProcesso, setSelectedProcesso] = useState<ProcessoRF | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetails, setShowDetails] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValue>({});
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Carrega processos mockados
  useEffect(() => {
    loadProcessosRF();
    // Iniciar monitoramento de notificações
    simpleNotificationService.startProcessMonitoring();
    setIsMonitoring(true);
  }, []);

  const loadProcessosRF = async () => {
    setLoading(true);
    setLastUpdate(new Date());

    // Carregar processos do localStorage primeiro
    const processosSalvos = localStorage.getItem('processosRF');
    let processosCarregados: ProcessoRF[] = [];

    if (processosSalvos) {
      try {
        processosCarregados = JSON.parse(processosSalvos).map((p: any) => ({
          ...p,
          dataEnvio: new Date(p.dataEnvio),
          ultimaAtualizacao: new Date(p.ultimaAtualizacao)
        }));
      } catch (error) {
        console.error('Erro ao carregar processos salvos:', error);
      }
    }

    // Processos padrão para demonstração
    const processosRF: ProcessoRF[] = [
      {
        id: '1',
        protocolo: 'RF-45123890',
        tipo: 'PER/DCOMP - Compensação Tributária',
        valorCompensacao: 125000,
        dataEnvio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'APROVADO',
        etapaAtual: 'Compensação Homologada',
        prazoEstimado: 'Concluído',
        empresa: 'TechCorp LTDA',
        cnpj: '12.345.678/0001-90',
        responsavelTecnico: 'João Silva Santos',
        ultimaAtualizacao: new Date(Date.now() - 1 * 60 * 60 * 1000),
        observacoes:
          'Compensação aprovada e processada com sucesso conforme análise da equipe técnica.',
        proximosPassos: [
          'Emitir comprovante final',
          'Atualizar sistema contábil',
          'Arquivar documentos',
        ],
      },
      {
        id: '2',
        protocolo: 'RF-45123855',
        tipo: 'PER/DCOMP - Compensação Tributária',
        valorCompensacao: 89000,
        dataEnvio: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'PROCESSANDO',
        etapaAtual: 'Análise Documental',
        prazoEstimado: '7 dias úteis',
        empresa: 'Indústria ABC S/A',
        cnpj: '98.765.432/0001-10',
        responsavelTecnico: 'Maria Costa Lima',
        ultimaAtualizacao: new Date(Date.now() - 3 * 60 * 60 * 1000),
        observacoes:
          'Documentos em análise pela equipe técnica da RFB. Processo dentro do prazo normal.',
        proximosPassos: ['Aguardar análise da RFB', 'Acompanhar status pelo e-CAC'],
      },
      {
        id: '3',
        protocolo: 'RF-45123830',
        tipo: 'PER/DCOMP - Compensação Tributária',
        valorCompensacao: 234000,
        dataEnvio: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'ANALISE_ADICIONAL',
        etapaAtual: 'Solicitação de Documentos Adicionais',
        prazoEstimado: '15 dias úteis',
        empresa: 'Comercial XYZ LTDA',
        cnpj: '45.678.901/0001-23',
        responsavelTecnico: 'Pedro Oliveira Santos',
        ultimaAtualizacao: new Date(Date.now() - 2 * 60 * 60 * 1000),
        observacoes:
          'Necessário envio de documentos complementares para prosseguimento da análise.',
        documentosPendentes: ['Balancete Analítico', 'Livro Razão', 'Demonstrativo de Cálculo'],
        proximosPassos: ['Enviar documentos solicitados', 'Aguardar nova análise'],
      },
      {
        id: '4',
        protocolo: 'RF-45123808',
        tipo: 'Processo Administrativo',
        valorCompensacao: 156000,
        dataEnvio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'PROCESSANDO',
        etapaAtual: 'Validação pela Receita Federal',
        prazoEstimado: '30 dias úteis',
        empresa: 'Serviços GHI LTDA',
        cnpj: '78.901.234/0001-56',
        responsavelTecnico: 'Ana Paula Silva',
        ultimaAtualizacao: new Date(Date.now() - 12 * 60 * 60 * 1000),
        observacoes:
          'Processo administrativo em análise. Empresa em situação especial conforme IN RFB 1.717/2017.',
        proximosPassos: ['Aguardar decisão da RFB', 'Possível solicitação de esclarecimentos'],
      },
      {
        id: '5',
        protocolo: 'RF-45123785',
        tipo: 'PER/DCOMP - Compensação Tributária',
        valorCompensacao: 67000,
        dataEnvio: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        status: 'REJEITADO',
        etapaAtual: 'Processo Rejeitado',
        prazoEstimado: 'Encerrado',
        empresa: 'Consultoria JKL LTDA',
        cnpj: '34.567.890/0001-78',
        responsavelTecnico: 'Carlos Mendes',
        ultimaAtualizacao: new Date(Date.now() - 6 * 60 * 60 * 1000),
        observacoes: 'Processo rejeitado devido inconsistências nos documentos apresentados.',
        proximosPassos: [
          'Corrigir documentos',
          'Apresentar novo pedido',
          'Considerar recurso administrativo',
        ],
      },
    ];

    // Combinar processos salvos + processos padrão (evitar duplicatas)
    const processosExistentes = processosCarregados.map(p => p.id);
    const processosNovos = processosRF.filter(p => !processosExistentes.includes(p.id));
    const todosProcessos = [...processosCarregados, ...processosNovos];
    
    setProcessos(todosProcessos);
    
    // Salvar processos atualizados
    localStorage.setItem('processosRF', JSON.stringify(todosProcessos));
    
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROVADO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PROCESSANDO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ANALISE_ADICIONAL':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJEITADO':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APROVADO':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PROCESSANDO':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'ANALISE_ADICIONAL':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'REJEITADO':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredProcessos = processos.filter(processo => {
    // Filtro de busca geral
    const searchValue = filterValues.search || searchTerm;
    const matchesSearch = !searchValue || 
      processo.protocolo.toLowerCase().includes(searchValue.toLowerCase()) ||
      processo.empresa.toLowerCase().includes(searchValue.toLowerCase()) ||
      processo.cnpj.toLowerCase().includes(searchValue.toLowerCase());
    
    // Filtro de status
    const statusValue = filterValues.status || statusFilter;
    const matchesStatus = statusValue === 'all' || !statusValue || processo.status === statusValue;
    
    // Filtro de tipo
    const matchesType = !filterValues.type || processo.tipo.includes(filterValues.type);
    
    // Filtro de data
    const matchesDate = !filterValues.dateRange || 
      (!filterValues.dateRange.start || new Date(processo.dataEnvio) >= new Date(filterValues.dateRange.start)) &&
      (!filterValues.dateRange.end || new Date(processo.dataEnvio) <= new Date(filterValues.dateRange.end));
    
    // Filtro de valor
    const matchesValue = 
      (!filterValues.valueMin || processo.valorCompensacao >= Number(filterValues.valueMin)) &&
      (!filterValues.valueMax || processo.valorCompensacao <= Number(filterValues.valueMax));
    
    return matchesSearch && matchesStatus && matchesType && matchesDate && matchesValue;
  });

  const handleViewDetails = (processo: ProcessoRF) => {
    setSelectedProcesso(processo);
    setShowDetails(true);
  };

  const handleConsultarStatusRF = async (protocolo: string) => {
    // Redirecionar para o e-CAC oficial
    window.open('https://cav.receita.fazenda.gov.br/autenticacao/login', '_blank');
  };

  const handleAtualizarProcessos = async () => {
    await loadProcessosRF();
    // Simular notificação de atualização
    simpleNotificationService.addNotification({
      type: 'info',
      title: 'Processos Atualizados',
      message: `Última atualização: ${new Date().toLocaleString('pt-BR')}`,
      relatedType: 'process'
    });
  };

  const handleAcessarECAC = () => {
    window.open('https://cav.receita.fazenda.gov.br/autenticacao/login', '_blank');
  };

  // Função para adicionar processo de compensação
  const addCompensationProcess = (type: 'bilateral' | 'multilateral', data: any) => {
    const newProcess: ProcessoRF = {
      id: Date.now().toString(),
      protocolo: `RF-${Date.now().toString().slice(-8)}`,
      tipo: type === 'bilateral' ? 'PER/DCOMP - Compensação Bilateral' : 'PER/DCOMP - Compensação Multilateral',
      valorCompensacao: data.valor,
      dataEnvio: new Date(),
      status: 'PROCESSANDO',
      etapaAtual: 'Análise Inicial',
      prazoEstimado: '15 dias úteis',
      empresa: data.empresa || 'Empresa Não Informada',
      cnpj: data.cnpj || '00.000.000/0000-00',
      responsavelTecnico: 'Sistema Tributa.AI',
      ultimaAtualizacao: new Date(),
      observacoes: `Compensação ${type} iniciada automaticamente pelo sistema.`,
      proximosPassos: ['Aguardar análise da RFB', 'Acompanhar status pelo e-CAC']
    };

    const processosAtualizados = [newProcess, ...processos];
    setProcessos(processosAtualizados);
    localStorage.setItem('processosRF', JSON.stringify(processosAtualizados));

    // Enviar notificação
    simpleNotificationService.notifyCompensationStarted(newProcess.id, type, data.valor);
  };

  // Expor função globalmente para ser chamada pelas páginas de compensação
  useEffect(() => {
    (window as any).addCompensationProcess = addCompensationProcess;
    return () => {
      delete (window as any).addCompensationProcess;
    };
  }, [processos]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            Processos Receita Federal
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe o status dos processos de compensação na Receita Federal
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              {isMonitoring ? (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Monitorando</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Offline</span>
                </div>
              )}
            </div>
            <span>•</span>
            <span>Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}</span>
          </div>
          <RefreshButton
            category="processos"
            onRefreshComplete={() => {
              loadProcessosRF();
              simpleNotificationService.addNotification({
                type: 'success',
                title: 'Processos Atualizados',
                message: 'Dados dos processos da Receita Federal foram atualizados com sucesso!',
                relatedType: 'process'
              });
            }}
            variant="default"
            className="bg-blue-600 text-white hover:bg-blue-700"
          />
          <button
            onClick={handleAcessarECAC}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Acessar e-CAC
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">Total</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Processos</h3>
          <p className="text-2xl font-bold text-gray-900">{processos.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Aprovados</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Compensações</h3>
          <p className="text-2xl font-bold text-gray-900">
            {processos.filter(p => p.status === 'APROVADO').length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">Em Análise</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Processos</h3>
          <p className="text-2xl font-bold text-gray-900">
            {processos.filter(p => p.status === 'PROCESSANDO').length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <span className="text-sm text-yellow-600 font-medium">Pendentes</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Documentos</h3>
          <p className="text-2xl font-bold text-gray-900">
            {processos.filter(p => p.status === 'ANALISE_ADICIONAL').length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            <span className="text-sm text-green-600 font-medium">R$ Milhões</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Valor Total</h3>
          <p className="text-2xl font-bold text-gray-900">
            R$ {(processos.reduce((sum, p) => sum + p.valorCompensacao, 0) / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Filtros Padronizados */}
      <StandardFilters
        filters={COMPENSATION_FILTERS}
        values={filterValues}
        onChange={setFilterValues}
        onReset={() => {
          setFilterValues({});
          setSearchTerm('');
          setStatusFilter('all');
        }}
      />

      {/* Lista de Processos */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Processos Ativos</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 mx-auto text-gray-400 animate-spin mb-4" />
            <p className="text-gray-600">Carregando processos...</p>
          </div>
        ) : filteredProcessos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p>Nenhum processo encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredProcessos.map(processo => (
              <div key={processo.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(processo.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{processo.protocolo}</h3>
                        <p className="text-sm text-gray-600">{processo.tipo}</p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(processo.status)}`}
                      >
                        {processo.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Empresa:</p>
                        <p className="font-medium text-gray-900">{processo.empresa}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Valor:</p>
                        <p className="font-medium text-gray-900">
                          R$ {processo.valorCompensacao.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Etapa:</p>
                        <p className="font-medium text-gray-900">{processo.etapaAtual}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Prazo:</p>
                        <p className="font-medium text-gray-900">{processo.prazoEstimado}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewDetails(processo)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver detalhes completos"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleConsultarStatusRF(processo.protocolo)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Consultar no e-CAC"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalhes Melhorado */}
      {showDetails && selectedProcesso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProcesso.protocolo}</h3>
                  <p className="text-gray-600">{selectedProcesso.tipo}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Status e Progresso */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(selectedProcesso.status)}
                <span
                      className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(selectedProcesso.status)}`}
                >
                  {selectedProcesso.status.replace('_', ' ')}
                </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Prazo Estimado</p>
                    <p className="font-semibold text-gray-900">{selectedProcesso.prazoEstimado}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Etapa Atual</span>
                    <span className="text-sm text-gray-600">
                      {selectedProcesso.status === 'APROVADO' ? '100%' : 
                       selectedProcesso.status === 'PROCESSANDO' ? '60%' : 
                       selectedProcesso.status === 'ANALISE_ADICIONAL' ? '40%' : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        selectedProcesso.status === 'APROVADO' ? 'bg-green-500' :
                        selectedProcesso.status === 'PROCESSANDO' ? 'bg-blue-500' :
                        selectedProcesso.status === 'ANALISE_ADICIONAL' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}
                      style={{
                        width: selectedProcesso.status === 'APROVADO' ? '100%' : 
                               selectedProcesso.status === 'PROCESSANDO' ? '60%' : 
                               selectedProcesso.status === 'ANALISE_ADICIONAL' ? '40%' : '0%'
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{selectedProcesso.etapaAtual}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Empresa</p>
                  <p className="text-gray-900">{selectedProcesso.empresa}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">CNPJ</p>
                  <p className="text-gray-900">{selectedProcesso.cnpj}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Valor</p>
                  <p className="text-gray-900">
                    R$ {selectedProcesso.valorCompensacao.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Responsável</p>
                  <p className="text-gray-900">{selectedProcesso.responsavelTecnico}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Data Envio</p>
                  <p className="text-gray-900">
                    {selectedProcesso.dataEnvio.toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Última Atualização</p>
                  <p className="text-gray-900">
                    {selectedProcesso.ultimaAtualizacao.toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {selectedProcesso.observacoes && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Observações</p>
                  <p className="text-gray-900 text-sm">{selectedProcesso.observacoes}</p>
                </div>
              )}

              {selectedProcesso.documentosPendentes &&
                selectedProcesso.documentosPendentes.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Documentos Pendentes</p>
                    <div className="space-y-1">
                      {selectedProcesso.documentosPendentes.map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-gray-900">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedProcesso.proximosPassos && selectedProcesso.proximosPassos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Próximos Passos</p>
                  <div className="space-y-1">
                    {selectedProcesso.proximosPassos.map((passo, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-900">{passo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Fechar
                </button>
                <button
                  onClick={() => handleConsultarStatusRF(selectedProcesso.protocolo)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Consultar RF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessosRecuperacaoPage;
