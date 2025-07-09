import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Download,
  FileText,
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  Clock,
  Eye,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  RefreshCw,
  Target,
  Activity,
  PieChart,
  Zap,
  Settings,
  Sparkles,
  Users,
  UserPlus,
  X,
  Info,
  Check,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import RefreshButton from '../../../components/ui/refresh-button';

interface ItemAnalise {
  id: string;
  tipo: 'CREDITO' | 'DEBITO';
  categoria: string;
  descricao: string;
  valor: number;
  periodo: string;
  status: string;
  confiabilidade: number;
  fonte: string;
  numeroProcesso?: string;
  vencimento?: string;
  podeCompensar: boolean;
  tribunalOrigem?: string;
  valorEconomia?: number;
  periodoInicio?: string;
  periodoFim?: string;
  analiseObrigacoes?: {
    id: string;
    cnpjEmpresa: string;
    razaoSocialEmpresa: string;
    nomeFantasiaEmpresa?: string;
    regimeTributario: string;
    criadoEm: string;
  };
  detalhes: {
    tributo: string;
    competencia: string;
    origem: string;
    situacao: string;
    observacoes?: string;
  };
}

export default function ResultadosAnalisePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroEmpresa, setFiltroEmpresa] = useState('todas');
  const [showFiltros, setShowFiltros] = useState(false);
  const [itensAnalise, setItensAnalise] = useState<ItemAnalise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showNewCreditsAlert, setShowNewCreditsAlert] = useState(false);
  const [showCompensacaoModal, setShowCompensacaoModal] = useState(false);
  const [showSelecaoModal, setShowSelecaoModal] = useState(false);
  const [creditoIndividual, setCreditoIndividual] = useState<ItemAnalise | null>(null);

  // Hook para buscar resultados da análise
  const carregarResultados = async () => {
    setLoading(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Carregar resultados da análise se disponível
      const resultadosAnalise = JSON.parse(localStorage.getItem('resultados_analise') || '[]');
      const creditosIdentificados = JSON.parse(localStorage.getItem('creditos_identificados') || '[]');
      
      // Dados simulados vindos da análise
      const resultados: ItemAnalise[] = [
        // CRÉDITOS
        {
          id: 'CR001',
          tipo: 'CREDITO',
          categoria: 'ICMS',
          descricao: 'ICMS - Exportação Agronegócio',
          valor: 150000,
          periodo: '2024-01-01 a 2024-12-31',
          status: 'IDENTIFICADO',
          confiabilidade: 95.5,
          fonte: 'SEFAZ-SP',
          numeroProcesso: '1234567-89.2024.8.26.0001',
          vencimento: '2025-06-30',
          podeCompensar: true,
          detalhes: {
            tributo: 'ICMS',
            competencia: 'Janeiro/2024 a Dezembro/2024',
            origem: 'Operações de Exportação',
            situacao: 'Aprovado para Compensação',
            observacoes: 'Crédito originado de exportações de produtos agropecuários'
          }
        },
        {
          id: 'CR002',
          tipo: 'CREDITO',
          categoria: 'PIS/COFINS',
          descricao: 'PIS/COFINS - Insumos Industriais',
          valor: 85000,
          periodo: '2024-01-01 a 2024-06-30',
          status: 'IDENTIFICADO',
          confiabilidade: 92.3,
          fonte: 'RFB',
          numeroProcesso: '2345678-90.2024.4.03.0001',
          vencimento: '2025-12-31',
          podeCompensar: true,
          detalhes: {
            tributo: 'PIS/COFINS',
            competencia: 'Janeiro/2024 a Junho/2024',
            origem: 'Aquisição de Insumos',
            situacao: 'Pendente Validação',
            observacoes: 'Créditos de insumos utilizados na produção industrial'
          }
        },
        {
          id: 'CR003',
          tipo: 'CREDITO',
          categoria: 'IRPJ',
          descricao: 'IRPJ - Incentivos Fiscais Região Nordeste',
          valor: 220000,
          periodo: '2023-01-01 a 2023-12-31',
          status: 'IDENTIFICADO',
          confiabilidade: 88.7,
          fonte: 'RFB',
          numeroProcesso: '3456789-01.2024.4.05.0001',
          vencimento: '2026-03-31',
          podeCompensar: true,
          detalhes: {
            tributo: 'IRPJ',
            competencia: 'Ano-calendário 2023',
            origem: 'Incentivos Fiscais SUDENE',
            situacao: 'Documentação Completa',
            observacoes: 'Incentivo para desenvolvimento regional'
          }
        },
        // DÉBITOS
        {
          id: 'DB001',
          tipo: 'DEBITO',
          categoria: 'IRPJ',
          descricao: 'IRPJ - Lucro Presumido 2024',
          valor: 45000,
          periodo: '2024-01-01 a 2024-03-31',
          status: 'EM_ABERTO',
          confiabilidade: 96.8,
          fonte: 'RFB',
          numeroProcesso: '4567890-12.2024.8.26.0100',
          vencimento: '2024-04-30',
          podeCompensar: true,
          detalhes: {
            tributo: 'IRPJ',
            competencia: '1º Trimestre/2024',
            origem: 'Apuração Lucro Presumido',
            situacao: 'Vencido',
            observacoes: 'Débito em atraso, sujeito a multa e juros'
          }
        },
        {
          id: 'DB002',
          tipo: 'DEBITO',
          categoria: 'CSLL',
          descricao: 'CSLL - Contribuição Social 2024',
          valor: 28000,
          periodo: '2024-01-01 a 2024-03-31',
          status: 'EM_ABERTO',
          confiabilidade: 94.2,
          fonte: 'RFB',
          numeroProcesso: '5678901-23.2024.8.26.0100',
          vencimento: '2024-04-30',
          podeCompensar: true,
          detalhes: {
            tributo: 'CSLL',
            competencia: '1º Trimestre/2024',
            origem: 'Apuração Base de Cálculo',
            situacao: 'Vencido',
            observacoes: 'Relacionado ao IRPJ do mesmo período'
          }
        },
        {
          id: 'DB003',
          tipo: 'DEBITO',
          categoria: 'ICMS',
          descricao: 'ICMS - Diferencial de Alíquota',
          valor: 32000,
          periodo: '2024-02-01 a 2024-02-28',
          status: 'EM_ABERTO',
          confiabilidade: 91.5,
          fonte: 'SEFAZ-SP',
          numeroProcesso: '6789012-34.2024.8.26.0200',
          vencimento: '2024-03-20',
          podeCompensar: true,
          detalhes: {
            tributo: 'ICMS',
            competencia: 'Fevereiro/2024',
            origem: 'Diferencial de Alíquota Interestadual',
            situacao: 'Vencido',
            observacoes: 'Operações interestaduais com consumidor final'
          }
        }
      ];

      // Combinar resultados da análise com créditos identificados e dados mockados
      const todosResultadosComAnalise = [...resultadosAnalise, ...creditosIdentificados, ...resultados];
      
      // Verificar se deve mostrar apenas resultados da análise atual
      const mostrarApenasAnaliseAtual = localStorage.getItem('mostrar_resultados_analise_atual') === 'true';
      
      if (mostrarApenasAnaliseAtual && (resultadosAnalise.length > 0 || creditosIdentificados.length > 0)) {
        const novosResultados = [...resultadosAnalise, ...creditosIdentificados];
        setItensAnalise(novosResultados);
        // Limpar flag após uso
        localStorage.removeItem('mostrar_resultados_analise_atual');
        localStorage.removeItem('analise_atual_id');
        
        // Mostrar notificação de sucesso
        setShowNewCreditsAlert(true);
        setTimeout(() => {
          toast.success(`🎉 ${novosResultados.length} novos resultados identificados pela análise de IA foram adicionados!`);
        }, 500);
      } else {
        setItensAnalise(todosResultadosComAnalise.length > 0 ? todosResultadosComAnalise : resultados);
      }
    } catch (err) {
      console.error('Erro ao carregar resultados:', err);
      toast.error('Erro de comunicação com o servidor');
    } finally {
      setLoading(false);
    }
  };

  // Dados simulados vindos da análise
  useEffect(() => {
    carregarResultados();
  }, []);

  // Verificar se veio da análise e carregar novos resultados
  useEffect(() => {
    if (location.state?.fromAnalysis) {
      setShowNewCreditsAlert(true);
      setTimeout(() => setShowNewCreditsAlert(false), 5000);

      // Carregar novos resultados do localStorage
      const novosResultados = localStorage.getItem('novosResultados');
      if (novosResultados) {
        try {
          const resultadosParsed = JSON.parse(novosResultados);
          carregarResultados();
          // Limpar localStorage após usar
          localStorage.removeItem('novosResultados');
          localStorage.removeItem('analiseRealizada');
        } catch (error) {
          console.error('Erro ao carregar resultados:', error);
        }
      }
    }
  }, [location]);

  // Filtros
  const itensFiltrados = itensAnalise.filter(item => {
    const matchesSearch = item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.analiseObrigacoes?.razaoSocialEmpresa || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filtroCategoria === 'todas' || item.categoria === filtroCategoria;
    const matchesStatus = filtroStatus === 'todos' || item.status === filtroStatus;
    const matchesEmpresa = filtroEmpresa === 'todas' || 
                          (item.analiseObrigacoes?.razaoSocialEmpresa || '') === filtroEmpresa;
    const matchesTab = activeTab === 'todos' || 
                      (activeTab === 'creditos' && item.tipo === 'CREDITO') ||
                      (activeTab === 'debitos' && item.tipo === 'DEBITO');

    return matchesSearch && matchesCategoria && matchesStatus && matchesEmpresa && matchesTab;
  });

  // Lista de empresas únicas
  const empresasUnicas = Array.from(new Set(
    itensAnalise
      .map(item => item.analiseObrigacoes?.razaoSocialEmpresa)
      .filter(Boolean)
  ));

  // Estatísticas
  const stats = {
    totalCreditos: itensAnalise.filter(item => item.tipo === 'CREDITO').length,
    totalDebitos: itensAnalise.filter(item => item.tipo === 'DEBITO').length,
    valorCreditos: itensAnalise.filter(item => item.tipo === 'CREDITO').reduce((sum, item) => sum + item.valor, 0),
    valorDebitos: itensAnalise.filter(item => item.tipo === 'DEBITO').reduce((sum, item) => sum + item.valor, 0),
    saldoLiquido: itensAnalise.filter(item => item.tipo === 'CREDITO').reduce((sum, item) => sum + item.valor, 0) - 
                  itensAnalise.filter(item => item.tipo === 'DEBITO').reduce((sum, item) => sum + item.valor, 0),
    compensaveis: itensAnalise.filter(item => item.podeCompensar).length,
    valorEconomia: itensAnalise.filter(item => item.tipo === 'CREDITO' && item.valorEconomia).reduce((sum, item) => sum + (item.valorEconomia || 0), 0)
  };

  const totalCreditos = itensFiltrados.filter(item => item.tipo === 'CREDITO').reduce((sum, item) => sum + item.valor, 0);
  const valorSelecionado = selectedItems.length > 0
    ? itensAnalise
        .filter(item => selectedItems.includes(item.id))
        .reduce((sum, item) => sum + item.valor, 0)
    : 0;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'IDENTIFICADO':
        return 'bg-green-100 text-green-800';
      case 'EM_ABERTO':
        return 'bg-red-100 text-red-800';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'IDENTIFICADO':
        return 'Identificado';
      case 'EM_ABERTO':
        return 'Em Aberto';
      case 'PENDENTE':
        return 'Pendente';
      default:
        return status;
    }
  };

  const handleVerDetalhes = (item: ItemAnalise) => {
    toast.info(`Visualizando detalhes de: ${item.descricao}`);
  };


  const handleGerarRelatorio = () => {
    const element = document.createElement('a');
    const relatorioTexto = `
RELATÓRIO DE ANÁLISE - TRIBUTA.AI
=====================================

RESUMO EXECUTIVO
-----------------
Total de Créditos: ${stats.totalCreditos}
Valor em Créditos: ${formatCurrency(stats.valorCreditos)}

Total de Débitos: ${stats.totalDebitos}
Valor em Débitos: ${formatCurrency(stats.valorDebitos)}

Saldo Líquido: ${formatCurrency(stats.saldoLiquido)}
Itens Compensáveis: ${stats.compensaveis}

DETALHAMENTO
-------------
${itensFiltrados.map(item => 
  `${item.tipo}: ${item.categoria} - ${item.descricao}
  Valor: ${formatCurrency(item.valor)}
  Status: ${getStatusText(item.status)}
  Confiabilidade: ${item.confiabilidade}%
  ---`
).join('\n')}

Gerado em: ${new Date().toLocaleString('pt-BR')}
    `;

    const file = new Blob([relatorioTexto], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'relatorio-analise-tributaria.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success('Relatório gerado com sucesso!');
  };

  // Função para compensar item individual
  const handleCompensarIndividual = (item: ItemAnalise) => {
    if (item.tipo === 'CREDITO') {
      setCreditoIndividual(item);
      setShowCompensacaoModal(true);
    } else {
      toast.info('Para débitos, selecione um crédito para compensação');
    }
  };

  const handleCompensar = (item: ItemAnalise) => {
    handleCompensarIndividual(item);
  };

  // Função para iniciar compensação em lote
  const handleIniciarCompensacaoLote = () => {
    const creditosSelecionados = itensAnalise.filter(item => 
      selectedItems.includes(item.id) && item.tipo === 'CREDITO'
    );
    
    if (creditosSelecionados.length === 0) {
      toast.error('Selecione pelo menos um crédito para compensação');
      return;
    }

    setShowSelecaoModal(true);
  };

  // Função para prosseguir com compensação
  const handleProsseguirCompensacao = (tipo: 'bilateral' | 'multilateral') => {
    const itensParaCompensar = creditoIndividual
      ? [creditoIndividual]
      : itensAnalise.filter(item => selectedItems.includes(item.id));

    localStorage.setItem('itensCompensacao', JSON.stringify(itensParaCompensar));

    if (tipo === 'bilateral') {
      navigate('/dashboard/recuperacao/compensacao-bilateral');
    } else {
      navigate('/dashboard/recuperacao/compensacao-multilateral');
    }
  };

  // Função para toggle seleção de item
  const toggleSelecaoItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleIniciarCompensacao = () => {
    handleIniciarCompensacaoLote();
  };

  // Funções de cor para status e categoria
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IDENTIFICADO':
        return 'bg-green-100 text-green-800';
      case 'PROCESSANDO':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPENSADO':
        return 'bg-blue-100 text-blue-800';
      case 'APROVADO':
        return 'bg-purple-100 text-purple-800';
      case 'EM_ABERTO':
        return 'bg-red-100 text-red-800';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'PIS/COFINS':
        return 'bg-green-100 text-green-800';
      case 'ICMS':
        return 'bg-blue-100 text-blue-800';
      case 'IRPJ':
      case 'IRPJ/CSLL':
        return 'bg-purple-100 text-purple-800';
      case 'CSLL':
        return 'bg-orange-100 text-orange-800';
      case 'IPI':
        return 'bg-orange-100 text-orange-800';
      case 'ISS':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Carregando resultados da análise...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-7 h-7 text-blue-600 mr-3" />
            Resultados da Análise
          </h1>
          <p className="text-gray-600">Créditos e débitos identificados na análise de obrigações</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowFiltros(!showFiltros)}>
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" onClick={handleGerarRelatorio}>
            <Download className="w-4 h-4 mr-2" />
            Relatório
          </Button>
          <Button onClick={handleIniciarCompensacao} className="bg-green-600 hover:bg-green-700">
            <Zap className="w-4 h-4 mr-2" />
            Iniciar Compensação
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Créditos</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalCreditos}</p>
                <p className="text-xs text-gray-500">{formatCurrency(stats.valorCreditos)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Débitos</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalDebitos}</p>
                <p className="text-xs text-gray-500">{formatCurrency(stats.valorDebitos)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo Líquido</p>
                <p className={`text-2xl font-bold ${stats.saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(stats.saldoLiquido)}
                </p>
                <p className="text-xs text-gray-500">
                  {stats.saldoLiquido >= 0 ? 'Favorável' : 'Desfavorável'}
                </p>
              </div>
              <PieChart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compensáveis</p>
                <p className="text-2xl font-bold text-purple-600">{stats.compensaveis}</p>
                <p className="text-xs text-gray-500">
                  {Math.round((stats.compensaveis / itensAnalise.length) * 100)}% do total
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      {showFiltros && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Buscar por descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="ICMS">ICMS</SelectItem>
                    <SelectItem value="PIS/COFINS">PIS/COFINS</SelectItem>
                    <SelectItem value="IRPJ">IRPJ</SelectItem>
                    <SelectItem value="CSLL">CSLL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="IDENTIFICADO">Identificado</SelectItem>
                    <SelectItem value="EM_ABERTO">Em Aberto</SelectItem>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFiltroCategoria('todas');
                    setFiltroStatus('todos');
                  }}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todos">Todos ({itensAnalise.length})</TabsTrigger>
          <TabsTrigger value="creditos">Créditos ({stats.totalCreditos})</TabsTrigger>
          <TabsTrigger value="debitos">Débitos ({stats.totalDebitos})</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          <div className="grid gap-4">
            {itensFiltrados.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex items-center pt-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelecaoItem(item.id)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Badge className={item.tipo === 'CREDITO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {item.tipo}
                          </Badge>
                          <Badge className={getTipoColor(item.categoria)}>{item.categoria}</Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Badge>
                          {item.podeCompensar && (
                            <Badge className="bg-blue-100 text-blue-800">Compensável</Badge>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.descricao}
                        </h3>
                        <div className="text-right mb-2">
                          <p className={`text-2xl font-bold ${item.tipo === 'CREDITO' ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(item.valor)}
                          </p>
                          {item.valorEconomia && (
                            <p className="text-sm text-gray-500">
                              Economia: {formatCurrency(item.valorEconomia)}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="text-lg font-bold text-green-600 mb-2">
                              <strong>Empresa:</strong> {item.analiseObrigacoes?.razaoSocialEmpresa || 'Não informado'}
                            </p>
                            <p>
                              <strong>CNPJ:</strong> {item.analiseObrigacoes?.cnpjEmpresa || 'Não informado'}
                            </p>
                            <p>
                              <strong>Regime:</strong> {item.analiseObrigacoes?.regimeTributario || 'Não informado'}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Período:</strong> {item.periodo}
                            </p>
                            <p>
                              <strong>Fonte:</strong> {item.fonte}
                            </p>
                            <p>
                              <strong>Processo:</strong> {item.numeroProcesso || 'Não informado'}
                            </p>
                          </div>
                        </div>

                        {/* Barra de Confiabilidade */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Nível de Confiabilidade</span>
                            <span className="text-xs font-medium text-gray-700">
                              {item.confiabilidade.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.confiabilidade >= 95
                                  ? 'bg-green-500'
                                  : item.confiabilidade >= 90
                                    ? 'bg-yellow-500'
                                    : 'bg-orange-500'
                              }`}
                              style={{ width: `${item.confiabilidade}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleVerDetalhes(item)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                      {item.podeCompensar && (
                        <Button size="sm" onClick={() => handleCompensar(item)} className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Calculator className="w-4 h-4 mr-1" />
                          Compensar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="creditos" className="space-y-4">
          <div className="grid gap-4">
            {itensFiltrados.filter(item => item.tipo === 'CREDITO').map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex items-center pt-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelecaoItem(item.id)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-green-100 text-green-800">CRÉDITO</Badge>
                          <Badge className={getTipoColor(item.categoria)}>{item.categoria}</Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Badge>
                          {item.podeCompensar && (
                            <Badge className="bg-blue-100 text-blue-800">Compensável</Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.descricao}</h3>
                        <div className="text-right mb-2">
                          <p className="text-2xl font-bold text-green-600">{formatCurrency(item.valor)}</p>
                          {item.valorEconomia && (
                            <p className="text-sm text-gray-500">
                              Economia: {formatCurrency(item.valorEconomia)}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="text-lg font-bold text-green-600 mb-2">
                              <strong>Empresa:</strong> {item.analiseObrigacoes?.razaoSocialEmpresa || 'Não informado'}
                            </p>
                            <p>
                              <strong>CNPJ:</strong> {item.analiseObrigacoes?.cnpjEmpresa || 'Não informado'}
                            </p>
                            <p>
                              <strong>Regime:</strong> {item.analiseObrigacoes?.regimeTributario || 'Não informado'}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Período:</strong> {item.periodo}
                            </p>
                            <p>
                              <strong>Fonte:</strong> {item.fonte}
                            </p>
                            <p>
                              <strong>Processo:</strong> {item.numeroProcesso || 'Não informado'}
                            </p>
                          </div>
                        </div>
                        {/* Barra de Confiabilidade */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Nível de Confiabilidade</span>
                            <span className="text-xs font-medium text-gray-700">
                              {item.confiabilidade.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.confiabilidade >= 95
                                  ? 'bg-green-500'
                                  : item.confiabilidade >= 90
                                    ? 'bg-yellow-500'
                                    : 'bg-orange-500'
                              }`}
                              style={{ width: `${item.confiabilidade}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleVerDetalhes(item)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                      <Button size="sm" onClick={() => handleCompensar(item)}>
                        <Calculator className="w-4 h-4 mr-1" />
                        Compensar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="debitos" className="space-y-4">
          <div className="grid gap-4">
            {itensFiltrados.filter(item => item.tipo === 'DEBITO').map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-red-100 text-red-800">DÉBITO</Badge>
                          <Badge variant="outline">{item.categoria}</Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Badge>
                          {item.vencimento && new Date(item.vencimento) < new Date() && (
                            <Badge className="bg-orange-100 text-orange-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Vencido
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.descricao}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Valor:</span>
                            <p className="font-semibold text-red-600">{formatCurrency(item.valor)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Vencimento:</span>
                            <p>{item.vencimento ? new Date(item.vencimento).toLocaleDateString('pt-BR') : 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Confiabilidade:</span>
                            <p className="font-semibold">{item.confiabilidade}%</p>
                          </div>
                          <div>
                            <span className="font-medium">Fonte:</span>
                            <p>{item.fonte}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleVerDetalhes(item)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-1" />
                        Negociar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {itensFiltrados.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-500">Ajuste os filtros ou execute uma nova análise</p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Seleção de Itens */}
      {showSelecaoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Selecione os Itens para Compensação
              </h2>
              <button
                onClick={() => setShowSelecaoModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {itensAnalise.filter(item => item.tipo === 'CREDITO').map(item => (
                <div
                  key={item.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedItems.includes(item.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleSelecaoItem(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelecaoItem(item.id)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.descricao}</h3>
                        <p className="text-sm text-gray-600">
                          {item.categoria} • {getStatusText(item.status)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatCurrency(item.valor)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.confiabilidade.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%
                        confiabilidade
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-900 font-medium">
                    Itens selecionados: {selectedItems.length}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(valorSelecionado)}
                  </p>
                </div>
                <Check className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowSelecaoModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowSelecaoModal(false);
                  setShowCompensacaoModal(true);
                }}
                disabled={selectedItems.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Continuar com Compensação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Tipo de Compensação */}
      {showCompensacaoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Escolha o Tipo de Compensação</h2>
              <button
                onClick={() => {
                  setShowCompensacaoModal(false);
                  setCreditoIndividual(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <p className="text-blue-900 font-medium mb-1">
                      {creditoIndividual
                        ? `Compensação individual: ${creditoIndividual.descricao}`
                        : `${selectedItems.length} itens selecionados para compensação`}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(
                        creditoIndividual
                          ? creditoIndividual.valor
                          : valorSelecionado
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Opção Bilateral */}
              <div
                onClick={() => handleProsseguirCompensacao('bilateral')}
                className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Compensação Bilateral
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Negociação direta entre duas empresas. Ideal quando você tem uma contrapartida
                      específica identificada.
                    </p>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>• Processo mais rápido (5-10 dias)</p>
                      <p>• Taxas reduzidas</p>
                      <p>• Negociação direta</p>
                      <p>• Ideal para grandes volumes</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 mt-2" />
                </div>
              </div>

              {/* Opção Multilateral */}
              <div
                onClick={() => handleProsseguirCompensacao('multilateral')}
                className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <UserPlus className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Compensação Multilateral
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Marketplace com múltiplas empresas. Sistema automatizado encontra as melhores
                      oportunidades.
                    </p>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>• Maior liquidez no mercado</p>
                      <p>• Múltiplas oportunidades</p>
                      <p>• Sistema automatizado</p>
                      <p>• Ideal para pequenos valores</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 mt-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}