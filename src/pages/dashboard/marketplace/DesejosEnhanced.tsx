import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Heart,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Eye,
  Settings,
  Target,
  Zap,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DesejosEnhanced() {
  const [activeTab, setActiveTab] = useState('meus-desejos');
  const [searchTerm, setSearchTerm] = useState('');

  const desejos = [
    {
      id: '1',
      titulo: 'ICMS - Exportação Agronegócio',
      categoria: 'ICMS',
      precoDesejado: 700000,
      precoAtual: 765000,
      status: 'ativo',
      alertas: true,
      dataAdicionado: '2024-01-20',
      notificacoes: 3,
      disponivel: true,
      descricao: 'Crédito ICMS de exportação do agronegócio com valor mínimo de R$ 700.000',
      risco: 'baixo',
      liquidez: 95,
    },
    {
      id: '2',
      titulo: 'Precatório Judicial TJSP',
      categoria: 'Precatório',
      precoDesejado: 900000,
      precoAtual: 960000,
      status: 'ativo',
      alertas: true,
      dataAdicionado: '2024-01-18',
      notificacoes: 1,
      disponivel: true,
      descricao: 'Precatório judicial do TJSP com desconto mínimo de 25%',
      risco: 'baixo',
      liquidez: 88,
    },
    {
      id: '3',
      titulo: 'PIS/COFINS - Indústria Química',
      categoria: 'PIS/COFINS',
      precoDesejado: 350000,
      precoAtual: 378000,
      status: 'pausado',
      alertas: false,
      dataAdicionado: '2024-01-15',
      notificacoes: 0,
      disponivel: false,
      descricao: 'Crédito PIS/COFINS de indústria química com certificação ISO',
      risco: 'médio',
      liquidez: 75,
    },
    {
      id: '4',
      titulo: 'Crédito Rural Tokenizado',
      categoria: 'Rural',
      precoDesejado: 800000,
      precoAtual: 855000,
      status: 'atendido',
      alertas: false,
      dataAdicionado: '2024-01-12',
      notificacoes: 5,
      disponivel: true,
      descricao: 'Crédito rural tokenizado com garantia real',
      risco: 'baixo',
      liquidez: 92,
    },
  ];

  const alertasPreco = [
    {
      id: '1',
      titulo: 'ICMS - Exportação Agronegócio',
      precoAlerta: 700000,
      precoAtual: 765000,
      diferenca: -65000,
      ativo: true,
      dataAlerta: '2024-01-20',
      condicao: 'menor_igual',
    },
    {
      id: '2',
      titulo: 'Precatório Judicial TJSP',
      precoAlerta: 900000,
      precoAtual: 960000,
      diferenca: -60000,
      ativo: true,
      dataAlerta: '2024-01-18',
      condicao: 'menor_igual',
    },
  ];

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'pausado':
        return 'bg-yellow-100 text-yellow-800';
      case 'atendido':
        return 'bg-blue-100 text-blue-800';
      case 'expirado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'pausado':
        return 'Pausado';
      case 'atendido':
        return 'Atendido';
      case 'expirado':
        return 'Expirado';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Activity className="w-4 h-4" />;
      case 'pausado':
        return <Clock className="w-4 h-4" />;
      case 'atendido':
        return <CheckCircle className="w-4 h-4" />;
      case 'expirado':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getRiskColor = (risco: string) => {
    switch (risco) {
      case 'baixo':
        return 'text-green-600';
      case 'médio':
        return 'text-yellow-600';
      case 'alto':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleToggleAlert = (desejoId: string) => {
    toast.success('Alerta de preço atualizado!');
  };

  const handleEditDesejo = (desejo: any) => {
    toast.info(`Editando desejo: ${desejo.titulo}`);
  };

  const handleDeleteDesejo = (desejo: any) => {
    toast.success(`Desejo removido: ${desejo.titulo}`);
  };

  const handleViewDetails = (desejo: any) => {
    toast.info(`Visualizando detalhes: ${desejo.titulo}`);
  };

  const handleAddDesejo = () => {
    toast.info('Abrindo formulário para novo desejo');
  };

  const handleBuyNow = (desejo: any) => {
    toast.success(`Iniciando compra: ${desejo.titulo}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lista de Desejos</h1>
          <p className="text-gray-600">
            Gerencie seus interesses e receba notificações automáticas
          </p>
        </div>
        <Button onClick={handleAddDesejo}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Desejo
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meus-desejos">Meus Desejos</TabsTrigger>
          <TabsTrigger value="alertas">Alertas de Preço</TabsTrigger>
          <TabsTrigger value="atendidos">Atendidos</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="meus-desejos" className="space-y-6">
          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Desejos</p>
                    <p className="text-2xl font-bold">{desejos.length}</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Desejos Ativos</p>
                    <p className="text-2xl font-bold">
                      {desejos.filter(d => d.status === 'ativo').length}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Alertas Ativos</p>
                    <p className="text-2xl font-bold">{desejos.filter(d => d.alertas).length}</p>
                  </div>
                  <Bell className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Atendidos</p>
                    <p className="text-2xl font-bold">
                      {desejos.filter(d => d.status === 'atendido').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Buscar desejos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          {/* Lista de Desejos */}
          <div className="space-y-4">
            {desejos.map(desejo => (
              <Card key={desejo.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Heart
                        className={`w-5 h-5 ${desejo.status === 'ativo' ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                      />
                      <div>
                        <CardTitle className="text-lg">{desejo.titulo}</CardTitle>
                        <p className="text-sm text-gray-600">{desejo.descricao}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(desejo.status)}>
                        {getStatusIcon(desejo.status)}
                        {getStatusText(desejo.status)}
                      </Badge>
                      {desejo.alertas && (
                        <Badge variant="outline" className="text-blue-600">
                          <Bell className="w-3 h-3 mr-1" />
                          Alerta
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Preço Desejado</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(desejo.precoDesejado)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Preço Atual</p>
                      <p className="font-semibold">{formatCurrency(desejo.precoAtual)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Diferença</p>
                      <p
                        className={`font-semibold ${desejo.precoAtual > desejo.precoDesejado ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {formatCurrency(desejo.precoAtual - desejo.precoDesejado)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Risco</p>
                      <p className={`font-semibold ${getRiskColor(desejo.risco)}`}>
                        {desejo.risco.charAt(0).toUpperCase() + desejo.risco.slice(1)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Liquidez</p>
                      <p className="font-semibold">{desejo.liquidez}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{desejo.categoria}</Badge>
                      <span className="text-sm text-gray-600">
                        Adicionado em {formatDate(desejo.dataAdicionado)}
                      </span>
                      {desejo.notificacoes > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {desejo.notificacoes} notificações
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Alertas:</span>
                        <Switch
                          checked={desejo.alertas}
                          onCheckedChange={() => handleToggleAlert(desejo.id)}
                        />
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(desejo)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditDesejo(desejo)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      {desejo.disponivel && desejo.precoAtual <= desejo.precoDesejado && (
                        <Button size="sm" onClick={() => handleBuyNow(desejo)}>
                          <Zap className="w-4 h-4 mr-1" />
                          Comprar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteDesejo(desejo)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Preço Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertasPreco.map(alerta => (
                  <div
                    key={alerta.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-500" />
                      <div>
                        <h4 className="font-semibold">{alerta.titulo}</h4>
                        <p className="text-sm text-gray-600">
                          Alertar quando preço for ≤ {formatCurrency(alerta.precoAlerta)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(alerta.precoAtual)}</p>
                      <p
                        className={`text-sm ${alerta.diferenca < 0 ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {alerta.diferenca < 0 ? '' : '+'}
                        {formatCurrency(alerta.diferenca)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atendidos" className="space-y-6">
          <div className="space-y-4">
            {desejos
              .filter(d => d.status === 'atendido')
              .map(desejo => (
                <Card key={desejo.id} className="border-green-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <CardTitle className="text-lg">{desejo.titulo}</CardTitle>
                          <p className="text-sm text-gray-600">Desejo atendido!</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Atendido
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Preço Desejado</p>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(desejo.precoDesejado)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Preço Atual</p>
                        <p className="font-semibold">{formatCurrency(desejo.precoAtual)}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Economia</p>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(desejo.precoDesejado - desejo.precoAtual)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Alertas por Email</h4>
                  <p className="text-sm text-gray-600">
                    Receber notificações por email quando preços atingirem o valor desejado
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Alertas Push</h4>
                  <p className="text-sm text-gray-600">Receber notificações push no navegador</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Resumo Semanal</h4>
                  <p className="text-sm text-gray-600">Receber resumo semanal dos seus desejos</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
