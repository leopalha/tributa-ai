import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  auctionMarketplaceService, 
  type CreditoLeilao, 
  type EstrategiaLance, 
  type LeilaoStats,
  type NotificacaoLeilao
} from '@/services/auction-marketplace.service';
import {
  Gavel,
  Timer,
  TrendingUp,
  Bot,
  Bell,
  Play,
  Pause,
  Settings,
  Plus,
  Eye,
  DollarSign,
  Users,
  Award,
  Zap,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Sparkles,
  Filter,
  Download,
  Refresh
} from 'lucide-react';

export default function LeiloesPage() {
  const [selectedTab, setSelectedTab] = useState('leiloes');
  const [leiloes, setLeiloes] = useState<CreditoLeilao[]>([]);
  const [estrategias, setEstrategias] = useState<EstrategiaLance[]>([]);
  const [stats, setStats] = useState<LeilaoStats | null>(null);
  const [notificacoes, setNotificacoes] = useState<NotificacaoLeilao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [leilaoSelecionado, setLeilaoSelecionado] = useState<CreditoLeilao | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [estrategiaSelecionada, setEstrategiaSelecionada] = useState<EstrategiaLance | null>(null);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    status: '',
    tipo: '',
    valorMin: 0,
    valorMax: 1000000
  });

  // Estados para nova estratégia
  const [novaEstrategia, setNovaEstrategia] = useState({
    nome: '',
    valorMaximo: 500000,
    descontoMaximo: 25,
    tiposCredito: ['ICMS'],
    ratingMinimoVendedor: 70,
    liquidezMinima: 60,
    incrementoLance: 2,
    freqMode: 'EQUILIBRADO' as 'AGRESSIVO' | 'CONSERVADOR' | 'EQUILIBRADO'
  });

  // Estados para novo lance
  const [lanceModal, setLanceModal] = useState<{
    aberto: boolean;
    leilaoId: string;
    valor: number;
  }>({
    aberto: false,
    leilaoId: '',
    valor: 0
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [leiloesData, estrategiasData, statsData, notificacoesData] = await Promise.all([
        auctionMarketplaceService.obterLeiloes(filtros),
        auctionMarketplaceService.obterEstrategias('user-1'),
        auctionMarketplaceService.obterEstatisticas(),
        auctionMarketplaceService.obterNotificacoes(10)
      ]);

      setLeiloes(leiloesData);
      setEstrategias(estrategiasData);
      setStats(statsData);
      setNotificacoes(notificacoesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFazerLance = async (leilaoId: string, valor: number) => {
    try {
      const success = await auctionMarketplaceService.fazerLance(leilaoId, {
        id: 'user-1',
        razaoSocial: 'Minha Empresa',
        cnpj: '12.345.678/0001-90',
        rating: 85
      }, valor);

      if (success) {
        await loadData();
        setLanceModal({ aberto: false, leilaoId: '', valor: 0 });
      }
    } catch (error) {
      console.error('Erro ao fazer lance:', error);
    }
  };

  const handleCriarEstrategia = async () => {
    try {
      await auctionMarketplaceService.criarEstrategia({
        ...novaEstrategia,
        usuario: 'user-1',
        valorMinimo: 50000,
        prazoVencimento: 365,
        garantiasObrigatorias: false,
        blacklistVendedores: [],
        whitelistTipos: novaEstrategia.tiposCredito
      });

      await loadData();
      setSelectedTab('estrategias');
    } catch (error) {
      console.error('Erro ao criar estratégia:', error);
    }
  };

  const toggleEstrategia = async (id: string, ativa: boolean) => {
    try {
      await auctionMarketplaceService.atualizarEstrategia(id, { ativa });
      await loadData();
    } catch (error) {
      console.error('Erro ao atualizar estratégia:', error);
    }
  };
  
  const handleVerDetalhes = (leilao: CreditoLeilao) => {
    setLeilaoSelecionado(leilao);
    setShowDetalhesModal(true);
  };
  
  const handleConfigurarEstrategia = (estrategia: EstrategiaLance) => {
    setEstrategiaSelecionada(estrategia);
    setShowConfigModal(true);
  };
  
  const handleExecutarAcao = (acao: any, notificacao: NotificacaoLeilao) => {
    // Implementar ações específicas baseadas no tipo
    if (acao.tipo === 'fazer_lance') {
      console.log(`Lance de ${acao.valor} executado!`);
    } else if (acao.tipo === 'ver_detalhes') {
      // Abrir modal de detalhes
      const leilao = leiloes.find(l => l.id === notificacao.leilaoId);
      if (leilao) handleVerDetalhes(leilao);
    } else if (acao.tipo === 'configurar') {
      // Abrir configurações
      console.log('Abrindo configurações...');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatTimeRemaining = (dataFim: Date) => {
    const agora = new Date();
    const diff = dataFim.getTime() - agora.getTime();
    
    if (diff <= 0) return 'Expirado';
    
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (horas > 24) {
      const dias = Math.floor(horas / 24);
      return `${dias}d ${horas % 24}h`;
    }
    
    return `${horas}h ${minutos}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO': return 'bg-green-100 text-green-800';
      case 'FINALIZADO': return 'bg-blue-100 text-blue-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
      case 'AGENDADO': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'URGENTE': return 'text-red-600';
      case 'ALTA': return 'text-orange-600';
      case 'MEDIA': return 'text-yellow-600';
      case 'BAIXA': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Gavel className="w-8 h-8 mr-3 text-blue-600" />
            Leilões de Créditos Tributários
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema automatizado de lances e negociação de créditos
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-lg">
            <Activity className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              {leiloes.filter(l => l.leilao.status === 'ATIVO').length} Leilões Ativos
            </span>
          </div>
          <Button onClick={loadData} variant="outline">
            <Refresh className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Volume Negociado</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.volumeNegociado)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leilões Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAtivos}</p>
                </div>
                <Timer className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Economia Média</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.economiaMedia.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.taxaSucesso.toFixed(1)}%</p>
                </div>
                <Award className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Participantes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.participantesAtivos}</p>
                </div>
                <Users className="w-8 h-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs Principais */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leiloes">Leilões Ativos</TabsTrigger>
          <TabsTrigger value="estrategias">Minhas Estratégias</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        {/* Tab Leilões */}
        <TabsContent value="leiloes" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtros de Leilão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select 
                    value={filtros.status}
                    onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Todos</option>
                    <option value="ATIVO">Ativo</option>
                    <option value="FINALIZADO">Finalizado</option>
                    <option value="AGENDADO">Agendado</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de Crédito</label>
                  <select 
                    value={filtros.tipo}
                    onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Todos</option>
                    <option value="ICMS">ICMS</option>
                    <option value="PIS">PIS</option>
                    <option value="COFINS">COFINS</option>
                    <option value="IPI">IPI</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Valor Mínimo: {formatCurrency(filtros.valorMin)}
                  </label>
                  <Slider
                    value={[filtros.valorMin]}
                    onValueChange={([value]) => setFiltros(prev => ({ ...prev, valorMin: value }))}
                    max={1000000}
                    step={10000}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Valor Máximo: {formatCurrency(filtros.valorMax)}
                  </label>
                  <Slider
                    value={[filtros.valorMax]}
                    onValueChange={([value]) => setFiltros(prev => ({ ...prev, valorMax: value }))}
                    max={1000000}
                    step={10000}
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={loadData}>
                  Aplicar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Leilões */}
          <div className="space-y-4">
            {leiloes.map((leilao) => (
              <Card key={leilao.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(leilao.leilao.status)}>
                        {leilao.leilao.status}
                      </Badge>
                      <Badge variant="outline">{leilao.credito.tipo}</Badge>
                      <span className="text-sm text-gray-600">
                        Rating: {leilao.vendedor.rating}/100
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatTimeRemaining(leilao.leilao.dataFim)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{leilao.vendedor.razaoSocial}</h3>
                      <p className="text-sm text-gray-600 mb-1">CNPJ: {leilao.vendedor.cnpj}</p>
                      <p className="text-sm text-gray-600 mb-1">
                        Transações: {leilao.vendedor.transacoesCompletas}
                      </p>
                      <p className="text-sm text-gray-600">
                        Liquidez: {leilao.credito.liquidez}%
                      </p>
                    </div>

                    <div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Valor do Crédito</p>
                        <p className="text-xl font-bold">{formatCurrency(leilao.credito.valor)}</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Melhor Oferta</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(leilao.metadados.melhorOferta)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Desconto: {(((leilao.credito.valor - leilao.metadados.melhorOferta) / leilao.credito.valor) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Vencimento</p>
                        <p className="text-sm">{leilao.credito.vencimento.toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                          <Eye className="w-4 h-4 inline mr-1" />
                          {leilao.metadados.visualizacoes} visualizações
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <Users className="w-4 h-4 inline mr-1" />
                          {leilao.metadados.interessados} interessados
                        </p>
                        <p className="text-sm text-gray-600">
                          <Gavel className="w-4 h-4 inline mr-1" />
                          {leilao.lances.length} lances
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setLanceModal({
                            aberto: true,
                            leilaoId: leilao.id,
                            valor: leilao.metadados.melhorOferta * 1.02
                          })}
                          disabled={leilao.leilao.status !== 'ATIVO'}
                        >
                          <Gavel className="w-4 h-4 mr-2" />
                          Fazer Lance
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleVerDetalhes(leilao)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>

                  {leilao.credito.garantias.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-1">Garantias:</p>
                      <div className="flex flex-wrap gap-1">
                        {leilao.credito.garantias.map((garantia, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {garantia}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Estratégias */}
        <TabsContent value="estrategias" className="space-y-6">
          {/* Nova Estratégia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Criar Nova Estratégia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nome da Estratégia</label>
                    <Input
                      value={novaEstrategia.nome}
                      onChange={(e) => setNovaEstrategia(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: ICMS Agressivo"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Valor Máximo: {formatCurrency(novaEstrategia.valorMaximo)}
                    </label>
                    <Slider
                      value={[novaEstrategia.valorMaximo]}
                      onValueChange={([value]) => setNovaEstrategia(prev => ({ ...prev, valorMaximo: value }))}
                      max={1000000}
                      step={10000}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Desconto Máximo: {novaEstrategia.descontoMaximo}%
                    </label>
                    <Slider
                      value={[novaEstrategia.descontoMaximo]}
                      onValueChange={([value]) => setNovaEstrategia(prev => ({ ...prev, descontoMaximo: value }))}
                      max={50}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Modo de Frequência</label>
                    <select 
                      value={novaEstrategia.freqMode}
                      onChange={(e) => setNovaEstrategia(prev => ({ 
                        ...prev, 
                        freqMode: e.target.value as any 
                      }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="CONSERVADOR">Conservador</option>
                      <option value="EQUILIBRADO">Equilibrado</option>
                      <option value="AGRESSIVO">Agressivo</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Rating Mínimo Vendedor: {novaEstrategia.ratingMinimoVendedor}
                    </label>
                    <Slider
                      value={[novaEstrategia.ratingMinimoVendedor]}
                      onValueChange={([value]) => setNovaEstrategia(prev => ({ ...prev, ratingMinimoVendedor: value }))}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Liquidez Mínima: {novaEstrategia.liquidezMinima}%
                    </label>
                    <Slider
                      value={[novaEstrategia.liquidezMinima]}
                      onValueChange={([value]) => setNovaEstrategia(prev => ({ ...prev, liquidezMinima: value }))}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Incremento de Lance: {novaEstrategia.incrementoLance}%
                    </label>
                    <Slider
                      value={[novaEstrategia.incrementoLance]}
                      onValueChange={([value]) => setNovaEstrategia(prev => ({ ...prev, incrementoLance: value }))}
                      max={10}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Tipos de Crédito</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['ICMS', 'PIS', 'COFINS', 'IPI'].map((tipo) => (
                        <button
                          key={tipo}
                          onClick={() => {
                            setNovaEstrategia(prev => ({
                              ...prev,
                              tiposCredito: prev.tiposCredito.includes(tipo)
                                ? prev.tiposCredito.filter(t => t !== tipo)
                                : [...prev.tiposCredito, tipo]
                            }));
                          }}
                          className={`px-3 py-1 rounded text-sm ${
                            novaEstrategia.tiposCredito.includes(tipo)
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-gray-100 text-gray-700 border border-gray-300'
                          }`}
                        >
                          {tipo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleCriarEstrategia}
                  disabled={!novaEstrategia.nome.trim()}
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Criar Estratégia
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Estratégias Existentes */}
          <div className="space-y-4">
            {estrategias.map((estrategia) => (
              <Card key={estrategia.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{estrategia.nome}</h3>
                      <Badge variant={estrategia.ativa ? 'default' : 'secondary'}>
                        {estrategia.ativa ? 'Ativa' : 'Inativa'}
                      </Badge>
                      <Badge variant="outline">{estrategia.parametros.freqMode}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEstrategia(estrategia.id, !estrategia.ativa)}
                      >
                        {estrategia.ativa ? (
                          <Pause className="w-4 h-4 mr-2" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        {estrategia.ativa ? 'Pausar' : 'Ativar'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleConfigurarEstrategia(estrategia)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Parâmetros</h4>
                      <div className="space-y-1 text-sm">
                        <p>Valor Máximo: {formatCurrency(estrategia.parametros.valorMaximo)}</p>
                        <p>Desconto Máximo: {estrategia.parametros.descontoMaximo}%</p>
                        <p>Incremento: {estrategia.parametros.incrementoLance}%</p>
                        <p>Rating Mínimo: {estrategia.parametros.ratingMinimoVendedor}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Tipos Alvo</h4>
                      <div className="flex flex-wrap gap-1">
                        {estrategia.parametros.tiposCredito.map((tipo) => (
                          <Badge key={tipo} variant="secondary" className="text-xs">
                            {tipo}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Performance</h4>
                      <div className="space-y-1 text-sm">
                        <p>Participações: {estrategia.historico.leiloesParticipados}</p>
                        <p>Vitórias: {estrategia.historico.leiloesVencidos}</p>
                        <p>Taxa de Sucesso: {
                          estrategia.historico.leiloesParticipados > 0
                            ? ((estrategia.historico.leiloesVencidos / estrategia.historico.leiloesParticipados) * 100).toFixed(1)
                            : 0
                        }%</p>
                        <p>Arrematado: {formatCurrency(estrategia.historico.valorTotalArrematado)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Notificações */}
        <TabsContent value="notificacoes" className="space-y-4">
          {notificacoes.map((notificacao) => (
            <Card key={notificacao.id} className={!notificacao.lida ? 'border-blue-200 bg-blue-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Bell className={`w-4 h-4 ${getPriorityColor(notificacao.prioridade)}`} />
                      <h4 className="font-medium">{notificacao.titulo}</h4>
                      <Badge variant="outline" className="text-xs">
                        {notificacao.tipo}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notificacao.mensagem}</p>
                    <p className="text-xs text-gray-500">
                      {notificacao.timestamp.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {notificacao.acoes.map((acao, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleExecutarAcao(acao, notificacao)}
                      >
                        {acao.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab Histórico */}
        <TabsContent value="historico" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leilões Finalizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Gavel className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Histórico de leilões será exibido aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Lance */}
      {lanceModal.aberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Fazer Lance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Valor do Lance</label>
                  <Input
                    type="number"
                    value={lanceModal.valor}
                    onChange={(e) => setLanceModal(prev => ({ 
                      ...prev, 
                      valor: parseFloat(e.target.value) || 0 
                    }))}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setLanceModal({ aberto: false, leilaoId: '', valor: 0 })}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => handleFazerLance(lanceModal.leilaoId, lanceModal.valor)}
                  >
                    <Gavel className="w-4 h-4 mr-2" />
                    Confirmar Lance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}