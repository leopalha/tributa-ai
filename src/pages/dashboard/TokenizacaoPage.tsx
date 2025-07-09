import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Coins,
  TrendingUp,
  Shield,
  Zap,
  DollarSign,
  Users,
  BarChart3,
  Lock,
  Plus,
  CreditCard,
  ExternalLink,
  Share2,
  Star,
  Award,
  Database,
} from 'lucide-react';
import RefreshButton from '../../components/ui/refresh-button';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserToken {
  id: string;
  tokenId: string;
  titulo: string;
  valor: number;
  tipo: string;
  categoria: string;
  empresa: string;
  blockchain: string;
  padrao: string;
  hash: string;
  dataCreacao: string;
  status: 'ativo' | 'pausado' | 'vendido';
  transferivel: boolean;
  fracionavel: boolean;
}

export default function TokenizacaoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [userTokens, setUserTokens] = useState<UserToken[]>([]);

  // Verificar se deve navegar para uma aba específica
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Carregar tokens do usuário
  useEffect(() => {
    const loadUserTokens = () => {
      try {
        const savedTokens = localStorage.getItem('userTokens');
        if (savedTokens) {
          setUserTokens(JSON.parse(savedTokens));
        }
      } catch (error) {
        console.error('Erro ao carregar tokens:', error);
      }
    };

    loadUserTokens();
    
    // Atualizar quando a aba estiver ativa
    if (activeTab === 'tokens') {
      loadUserTokens();
    }
  }, [activeTab]);

  const tokens = [
    {
      id: '1',
      nome: 'ICMS Token',
      simbolo: 'ICMS',
      valor: 150000,
      supply: 1000,
      preco: 150,
      variacao: 5.2,
      status: 'ativo',
    },
    {
      id: '2',
      nome: 'PIS/COFINS Token',
      simbolo: 'PISCOF',
      valor: 85000,
      supply: 850,
      preco: 100,
      variacao: -2.1,
      status: 'ativo',
    },
  ];

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'pausado':
        return 'bg-yellow-100 text-yellow-800';
      case 'vendido':
        return 'bg-blue-100 text-blue-800';
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
      case 'vendido':
        return 'Vendido';
      default:
        return 'Desconhecido';
    }
  };

  const anunciarToken = (token: UserToken) => {
    // Salvar token selecionado para anúncio
    localStorage.setItem('tokenParaAnuncio', JSON.stringify(token));
    toast.success(`🎯 Token ${token.tokenId} selecionado para anúncio!`);
    navigate('/dashboard/marketplace/anuncios');
  };

  const copyTokenId = (tokenId: string) => {
    navigator.clipboard.writeText(tokenId);
    toast.success('📋 Token ID copiado!');
  };

  const totalValueUserTokens = userTokens.reduce((sum, token) => sum + token.valor, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
      <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-blue-600" />
            Tokenização de Créditos
          </h1>
          <p className="text-base text-gray-600">Transforme seus créditos tributários em tokens digitais</p>
        </div>
        <div className="flex items-center space-x-3">
          <RefreshButton
            category="tokenizacao"
            onRefreshComplete={() => {
              toast.success('🤖 Dados de tokenização atualizados!');
            }}
            variant="outline"
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          />
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/tokenizacao/meus-tokens')}
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <Coins className="w-4 h-4 mr-2" />
            Meus Tokens
          </Button>
          <Button
            onClick={() => navigate('/dashboard/tokenizacao/criar')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Token
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tokenizado</p>
                <p className="text-2xl font-bold">{formatCurrency(totalValueUserTokens || 235000)}</p>
              </div>
              <Coins className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tokens Criados</p>
                <p className="text-2xl font-bold">{userTokens.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Liquidez</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Holders</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tokens">Meus Tokens</TabsTrigger>
          <TabsTrigger value="mercado">Mercado</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5" />
                  Performance dos Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokens.map(token => (
                    <div
                      key={token.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {token.simbolo.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-base">{token.nome}</p>
                          <p className="text-sm text-gray-600">{token.simbolo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-base">{formatCurrency(token.preco)}</p>
                        <p
                          className={
                            token.variacao > 0 ? 'text-green-600 text-sm' : 'text-red-600 text-sm'
                          }
                        >
                          {token.variacao > 0 ? '+' : ''}
                          {token.variacao}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5" />
                  Segurança & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Auditoria Smart Contract</span>
                    <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Compliance RFB</span>
                    <Badge className="bg-green-100 text-green-800">Conforme</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Certificação Blockchain</span>
                    <Badge className="bg-blue-100 text-blue-800">Hyperledger</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Backup Descentralizado</span>
                    <Badge className="bg-purple-100 text-purple-800">Ativo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5" />
                Meus Tokens Criados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userTokens.length > 0 ? (
              <div className="space-y-4">
                  {userTokens.map(token => (
                    <Card key={token.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {token.tipo.substring(0, 2)}
                        </div>
                        <div>
                              <h3 className="font-bold text-base">{token.titulo}</h3>
                              <p className="text-sm text-gray-600">{token.empresa}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(token.status)}>
                              {getStatusText(token.status)}
                            </Badge>
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                              {token.tipo}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 font-medium">Valor Tokenizado</p>
                            <p className="font-bold text-green-700 text-lg">{formatCurrency(token.valor)}</p>
                      </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 font-medium">Token ID</p>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-sm font-bold text-blue-700">{token.tokenId}</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyTokenId(token.tokenId)}
                                className="h-6 w-6 p-0"
                              >
                                📋
                              </Button>
                            </div>
                    </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 font-medium">Blockchain</p>
                            <div className="flex items-center gap-1">
                              <Database className="w-4 h-4 text-purple-600" />
                              <p className="font-medium text-purple-700">{token.blockchain}</p>
                      </div>
                      </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 font-medium">Criado em</p>
                            <p className="font-medium text-gray-700 text-sm">{formatDate(token.dataCreacao)}</p>
                      </div>
                    </div>

                        <div className="flex gap-3">
                          <Button 
                            size="sm" 
                            onClick={() => anunciarToken(token)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Anunciar no Marketplace
                          </Button>
                      <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ver na Blockchain
                      </Button>
                      <Button size="sm" variant="outline">
                        <Lock className="w-4 h-4 mr-2" />
                        Transferir
                      </Button>
              </div>
            </CardContent>
          </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum token criado ainda</h3>
                  <p className="text-gray-600 mb-4">
                    Crie seu primeiro token para começar a tokenizar seus créditos tributários.
                  </p>
                  <Button
                    onClick={() => navigate('/dashboard/tokenizacao/criar')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Token
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mercado" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mercado de Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-base">Mercado de tokens em desenvolvimento</p>
                  <p className="text-sm text-gray-500">
                    Em breve você poderá negociar tokens de outros usuários
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
