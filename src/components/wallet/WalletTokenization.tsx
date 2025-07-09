import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/spinner';
import { 
  Coins, 
  ArrowRight, 
  Check, 
  Clock, 
  AlertCircle, 
  RefreshCw,
  Wallet,
  FileText,
  Plus,
  Zap,
  Shield,
  DollarSign,
  BarChart3
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/format';
import { blockchainIntegrationService } from '@/services/blockchain-integration.service';
import { useToast } from '@/components/ui/use-toast';

interface Token {
  id: string;
  name: string;
  symbol: string;
  tokenType: 'ERC20' | 'ERC721' | 'ERC1155';
  contractAddress: string;
  balance: string;
  formattedBalance: string;
  value: number;
  priceUsd: number;
  change24h: number;
  imageUrl?: string;
  isVerified: boolean;
  network: string;
  lastUpdated: string;
}

interface TokenizationRequest {
  id: string;
  assetType: 'CREDITO_FISCAL' | 'PRECATORIO' | 'TITULO' | 'OUTRO';
  assetValue: number;
  assetDescription: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  completedAt?: string;
  tokenId?: string;
  tokenAddress?: string;
  transactionHash?: string;
  progress: number;
}

interface WalletTokenizationProps {
  walletAddress?: string;
  isConnected?: boolean;
  onConnectWallet?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function WalletTokenization({
  walletAddress,
  isConnected = false,
  onConnectWallet,
  onRefresh,
  loading = false,
}: WalletTokenizationProps) {
  const { toast } = useToast();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenizationRequests, setTokenizationRequests] = useState<TokenizationRequest[]>([]);
  const [activeTab, setActiveTab] = useState<string>('tokens');
  const [showNewTokenizationDialog, setShowNewTokenizationDialog] = useState(false);
  const [newTokenizationForm, setNewTokenizationForm] = useState({
    assetType: 'CREDITO_FISCAL',
    assetValue: '',
    assetDescription: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlockchainConnected, setIsBlockchainConnected] = useState(false);

  // Verificar conexão com blockchain
  useEffect(() => {
    const checkBlockchainConnection = async () => {
      if (isConnected) {
        const connected = blockchainIntegrationService.isWalletConnected();
        if (!connected) {
          try {
            const success = await blockchainIntegrationService.connect();
            setIsBlockchainConnected(success);
            if (success) {
              loadTokens();
              loadTokenizationRequests();
            }
          } catch (error) {
            console.error('Erro ao conectar com blockchain:', error);
            setIsBlockchainConnected(false);
          }
        } else {
          setIsBlockchainConnected(true);
          loadTokens();
          loadTokenizationRequests();
        }
      }
    };
    
    checkBlockchainConnection();
  }, [isConnected]);

  const loadTokens = async () => {
    try {
      // Em um ambiente real, isso seria uma chamada à API que retornaria
      // tokens baseados nos contratos de tokenização
      
      // Para desenvolvimento, continuamos usando dados simulados
      // mas em uma implementação real, isso viria da blockchain
      const mockTokens: Token[] = [
        {
          id: '1',
          name: 'Tributa Token',
          symbol: 'TRIB',
          tokenType: 'ERC20',
          contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
          balance: '1000000000000000000000',
          formattedBalance: '1,000',
          value: 5000,
          priceUsd: 5,
          change24h: 2.5,
          imageUrl: 'https://via.placeholder.com/40',
          isVerified: true,
          network: 'Ethereum',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Crédito ICMS',
          symbol: 'ICMS',
          tokenType: 'ERC1155',
          contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
          balance: '5',
          formattedBalance: '5',
          value: 25000,
          priceUsd: 5000,
          change24h: -1.2,
          isVerified: true,
          network: 'Polygon',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Precatório #123',
          symbol: 'PREC',
          tokenType: 'ERC721',
          contractAddress: '0x7890abcdef1234567890abcdef1234567890abcd',
          balance: '1',
          formattedBalance: '1',
          value: 150000,
          priceUsd: 150000,
          change24h: 0,
          isVerified: false,
          network: 'Ethereum',
          lastUpdated: new Date().toISOString(),
        },
      ];

      setTokens(mockTokens);
    } catch (error) {
      console.error('Erro ao carregar tokens:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar tokens',
        description: 'Não foi possível carregar seus tokens. Tente novamente mais tarde.',
      });
    }
  };

  const loadTokenizationRequests = async () => {
    try {
      // Em um ambiente real, isso seria uma chamada à API
      // Simulando dados para desenvolvimento
      const mockRequests: TokenizationRequest[] = [
        {
          id: '1',
          assetType: 'CREDITO_FISCAL',
          assetValue: 75000,
          assetDescription: 'Crédito ICMS Exportação',
          status: 'COMPLETED',
          createdAt: '2024-01-15T10:30:00Z',
          completedAt: '2024-01-15T11:45:00Z',
          tokenId: '2',
          tokenAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
          transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          progress: 100,
        },
        {
          id: '2',
          assetType: 'PRECATORIO',
          assetValue: 150000,
          assetDescription: 'Precatório Federal #123456',
          status: 'COMPLETED',
          createdAt: '2024-01-10T14:20:00Z',
          completedAt: '2024-01-10T15:30:00Z',
          tokenId: '3',
          tokenAddress: '0x7890abcdef1234567890abcdef1234567890abcd',
          transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          progress: 100,
        },
      ];

      setTokenizationRequests(mockRequests);
    } catch (error) {
      console.error('Erro ao carregar solicitações de tokenização:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar solicitações',
        description: 'Não foi possível carregar suas solicitações de tokenização.',
      });
    }
  };

  const handleSubmitTokenization = async () => {
    if (!isBlockchainConnected) {
      toast({
        variant: 'destructive',
        title: 'Carteira não conectada',
        description: 'Por favor, conecte sua carteira blockchain para continuar.',
      });
      return;
    }

    if (!newTokenizationForm.assetValue || !newTokenizationForm.assetDescription) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Usar o serviço de integração blockchain para tokenizar o ativo
      const request = await blockchainIntegrationService.tokenizeAsset(
        newTokenizationForm.assetType,
        parseFloat(newTokenizationForm.assetValue),
        newTokenizationForm.assetDescription
      );

      // Adicionar à lista de solicitações
      setTokenizationRequests(prev => [request, ...prev]);
      
      // Fechar diálogo e limpar formulário
      setShowNewTokenizationDialog(false);
      setNewTokenizationForm({
        assetType: 'CREDITO_FISCAL',
        assetValue: '',
        assetDescription: '',
      });
      
      toast({
        title: 'Tokenização iniciada',
        description: 'Sua solicitação de tokenização foi iniciada com sucesso.',
      });
      
      // Recarregar tokens após um tempo
      setTimeout(() => {
        loadTokens();
      }, 5000);
    } catch (error) {
      console.error('Erro ao enviar solicitação de tokenização:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na tokenização',
        description: 'Não foi possível processar sua solicitação. Tente novamente mais tarde.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAssetType = (type: string) => {
    switch (type) {
      case 'CREDITO_FISCAL':
        return 'Crédito Fiscal';
      case 'PRECATORIO':
        return 'Precatório';
      case 'TITULO':
        return 'Título';
      case 'OUTRO':
        return 'Outro';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'PROCESSING':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Processando
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Falhou
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validação específica para o campo de valor
    if (name === 'assetValue') {
      // Permitir apenas números e ponto decimal
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (value === '' || regex.test(value)) {
        setNewTokenizationForm(prev => ({
          ...prev,
          [name]: value
        }));
      }
      return;
    }
    
    // Para outros campos, atualizar normalmente
    setNewTokenizationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTokenizationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tokenização de Ativos</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? <Spinner className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button
            onClick={() => setShowNewTokenizationDialog(true)}
            disabled={!isBlockchainConnected}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Tokenização
          </Button>
        </div>
      </div>

      {!isBlockchainConnected && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-6 text-center">
            <Wallet className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">Conecte sua carteira</h3>
            <p className="mt-2 text-sm text-gray-500">
              Para tokenizar ativos e visualizar seus tokens, você precisa conectar sua carteira blockchain.
            </p>
            <Button className="mt-4" onClick={onConnectWallet}>
              Conectar Carteira
            </Button>
          </CardContent>
        </Card>
      )}

      {isBlockchainConnected && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="tokens">Meus Tokens</TabsTrigger>
            <TabsTrigger value="requests">Solicitações</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-4">
            {tokens.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="pt-6 text-center">
                  <Coins className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">Nenhum token encontrado</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Você ainda não possui tokens. Tokenize seus ativos para começar.
                  </p>
                  <Button className="mt-4" onClick={() => setShowNewTokenizationDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Tokenização
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tokens.map(token => (
                  <Card key={token.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {token.imageUrl ? (
                            <img
                              src={token.imageUrl}
                              alt={token.symbol}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                              <Coins className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              {token.name}
                              {token.isVerified && (
                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verificado
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>
                              {token.symbol} • {token.network} • {token.tokenType}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatCurrency(token.value)}
                          </div>
                          <div className={`text-sm ${token.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Quantidade</p>
                          <p className="font-medium">{token.formattedBalance} {token.symbol}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Preço Unitário</p>
                          <p className="font-medium">{formatCurrency(token.priceUsd)}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Detalhes
                      </Button>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Análise
                        </Button>
                        <Button variant="default" size="sm">
                          <Zap className="h-4 w-4 mr-2" />
                          Negociar
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {tokenizationRequests.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="pt-6 text-center">
                  <Clock className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">Nenhuma solicitação encontrada</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Você ainda não fez nenhuma solicitação de tokenização.
                  </p>
                  <Button className="mt-4" onClick={() => setShowNewTokenizationDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Tokenização
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de Ativo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Progresso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokenizationRequests.map(request => (
                    <TableRow key={request.id}>
                      <TableCell>{formatAssetType(request.assetType)}</TableCell>
                      <TableCell>{request.assetDescription}</TableCell>
                      <TableCell>{formatCurrency(request.assetValue)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Progress value={request.progress} className="h-2 w-20 mr-2" />
                          <span className="text-xs text-gray-500">{request.progress}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={showNewTokenizationDialog} onOpenChange={setShowNewTokenizationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Tokenização</DialogTitle>
            <DialogDescription>
              Tokenize seus ativos para negociá-los no marketplace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="assetType">Tipo de Ativo</Label>
              <Select
                value={newTokenizationForm.assetType}
                onValueChange={(value) => handleSelectChange('assetType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de ativo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREDITO_FISCAL">Crédito Fiscal</SelectItem>
                  <SelectItem value="PRECATORIO">Precatório</SelectItem>
                  <SelectItem value="TITULO">Título</SelectItem>
                  <SelectItem value="OUTRO">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetValue">Valor do Ativo (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="assetValue"
                  name="assetValue"
                  placeholder="0.00"
                  className="pl-10"
                  value={newTokenizationForm.assetValue}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetDescription">Descrição do Ativo</Label>
              <Input
                id="assetDescription"
                name="assetDescription"
                placeholder="Ex: Crédito ICMS de exportação"
                value={newTokenizationForm.assetDescription}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewTokenizationDialog(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitTokenization}
              disabled={isSubmitting || !newTokenizationForm.assetValue || !newTokenizationForm.assetDescription}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Tokenizar Ativo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 