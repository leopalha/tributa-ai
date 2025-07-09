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
import { Spinner } from '@/components/spinner';
import { 
  ArrowDown, 
  RefreshCw, 
  Settings, 
  Info, 
  AlertCircle,
  Repeat,
  Zap,
  Check,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatCurrency } from '@/utils/format';
import { blockchainIntegrationService } from '@/services/blockchain-integration.service';
import { useToast } from '@/components/ui/use-toast';

interface Token {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  formattedBalance: string;
  price: number;
  imageUrl?: string;
  address: string; // Endereço do contrato do token
}

interface SwapQuote {
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  priceImpact: number;
  fee: number;
  minReceived: number;
  route: string[];
  estimatedTime: number;
}

interface WalletSwapProps {
  isConnected?: boolean;
  onConnectWallet?: () => void;
  loading?: boolean;
}

export function WalletSwap({
  isConnected = false,
  onConnectWallet,
  loading = false,
}: WalletSwapProps) {
  const { toast } = useToast();
  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<string | null>(null);
  const [toToken, setToToken] = useState<string | null>(null);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isAutoRouting, setIsAutoRouting] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState<boolean>(false);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapSuccess, setSwapSuccess] = useState<boolean>(false);
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
              loadAvailableTokens();
            }
          } catch (error) {
            console.error('Erro ao conectar com blockchain:', error);
            setIsBlockchainConnected(false);
          }
        } else {
          setIsBlockchainConnected(true);
          loadAvailableTokens();
        }
      }
    };
    
    checkBlockchainConnection();
  }, [isConnected]);

  const loadAvailableTokens = async () => {
    try {
      // Em um ambiente real, isso seria uma chamada à API ou blockchain
      // para obter a lista de tokens disponíveis
      
      // Para desenvolvimento, continuamos usando dados simulados
      const mockTokens: Token[] = [
        {
          id: '1',
          symbol: 'TRIB',
          name: 'Tributa Token',
          balance: '1000000000000000000000',
          formattedBalance: '1,000',
          price: 5.0,
          imageUrl: 'https://via.placeholder.com/40',
          address: '0x1234567890123456789012345678901234567890'
        },
        {
          id: '2',
          symbol: 'ICMS',
          name: 'Crédito ICMS',
          balance: '5000000000000000000',
          formattedBalance: '5',
          price: 5000.0,
          imageUrl: 'https://via.placeholder.com/40',
          address: '0x2345678901234567890123456789012345678901'
        },
        {
          id: '3',
          symbol: 'PREC',
          name: 'Precatório Token',
          balance: '1000000000000000000',
          formattedBalance: '1',
          price: 150000.0,
          imageUrl: 'https://via.placeholder.com/40',
          address: '0x3456789012345678901234567890123456789012'
        },
        {
          id: '4',
          symbol: 'WETH',
          name: 'Wrapped Ethereum',
          balance: '500000000000000000',
          formattedBalance: '0.5',
          price: 12000.0,
          imageUrl: 'https://via.placeholder.com/40',
          address: '0x4567890123456789012345678901234567890123'
        },
        {
          id: '5',
          symbol: 'USDC',
          name: 'USD Coin',
          balance: '1000000000',
          formattedBalance: '1,000',
          price: 5.0,
          imageUrl: 'https://via.placeholder.com/40',
          address: '0x5678901234567890123456789012345678901234'
        },
      ];

      setAvailableTokens(mockTokens);
      
      // Definir tokens padrão
      if (mockTokens.length >= 2) {
        setFromToken(mockTokens[0].id);
        setToToken(mockTokens[4].id);
      }
    } catch (error) {
      console.error('Erro ao carregar tokens disponíveis:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar tokens',
        description: 'Não foi possível carregar a lista de tokens disponíveis.',
      });
    }
  };

  // Buscar cotação quando os parâmetros mudarem
  useEffect(() => {
    if (fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0 && isBlockchainConnected) {
      getSwapQuote();
    } else {
      setQuote(null);
      setToAmount('');
    }
  }, [fromToken, toToken, fromAmount, slippage, isAutoRouting, isBlockchainConnected]);

  const getSwapQuote = async () => {
    setIsLoadingQuote(true);
    setSwapError(null);

    try {
      const fromTokenObj = availableTokens.find(t => t.id === fromToken);
      const toTokenObj = availableTokens.find(t => t.id === toToken);

      if (!fromTokenObj || !toTokenObj) {
        throw new Error('Token não encontrado');
      }

      // Usar o serviço de integração blockchain para obter cotação
      const quoteResult = await blockchainIntegrationService.getSwapQuote(
        fromTokenObj.address,
        toTokenObj.address,
        fromAmount
      );
      
      setQuote(quoteResult);
      setToAmount(quoteResult.toAmount.toString());
    } catch (error: any) {
      console.error('Erro ao obter cotação:', error);
      setSwapError(error.message || 'Erro ao obter cotação');
      setToAmount('');
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir apenas números e ponto decimal
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (value === '' || regex.test(value)) {
      setFromAmount(value);
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir apenas números e ponto decimal
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (value === '' || regex.test(value)) {
      setToAmount(value);
      
      // Recalcular fromAmount baseado no toAmount
      // Isso seria mais complexo em um ambiente real
      if (quote && quote.exchangeRate > 0) {
        const calculatedFromAmount = parseFloat(value) / quote.exchangeRate;
        setFromAmount(calculatedFromAmount.toFixed(6));
      }
    }
  };

  const handleSwapTokens = () => {
    // Trocar tokens de origem e destino
    const tempFromToken = fromToken;
    setFromToken(toToken);
    setToToken(tempFromToken);
    
    // Limpar valores para forçar nova cotação
    setFromAmount('');
    setToAmount('');
    setQuote(null);
  };

  const handleSetMaxAmount = () => {
    if (!fromToken) return;
    
    const token = availableTokens.find(t => t.id === fromToken);
    if (token) {
      // Em um ambiente real, isso usaria o saldo real da blockchain
      const maxAmount = parseFloat(token.formattedBalance.replace(/,/g, ''));
      setFromAmount(maxAmount.toString());
    }
  };

  const executeSwap = async () => {
    if (!isBlockchainConnected || !fromToken || !toToken || !fromAmount || !quote) {
      return;
    }

    setIsSwapping(true);
    setSwapError(null);
    setSwapSuccess(false);

    try {
      const fromTokenObj = availableTokens.find(t => t.id === fromToken);
      const toTokenObj = availableTokens.find(t => t.id === toToken);

      if (!fromTokenObj || !toTokenObj) {
        throw new Error('Token não encontrado');
      }

      // Calcular valor mínimo a receber com base no slippage
      const minAmountOut = (quote.toAmount * (1 - slippage / 100)).toFixed(6);

      // Executar swap usando o serviço de integração blockchain
      const result = await blockchainIntegrationService.executeSwap(
        fromTokenObj.address,
        toTokenObj.address,
        fromAmount,
        minAmountOut
      );

      if (result.success) {
        setSwapSuccess(true);
        toast({
          title: 'Swap executado com sucesso',
          description: 'A troca de tokens foi realizada com sucesso.',
        });
        
        // Recarregar tokens após swap
        setTimeout(() => {
          loadAvailableTokens();
          setFromAmount('');
          setToAmount('');
          setQuote(null);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Erro ao executar swap:', error);
      setSwapError(error.message || 'Erro ao executar swap');
      toast({
        variant: 'destructive',
        title: 'Erro ao executar swap',
        description: error.message || 'Não foi possível completar a operação. Tente novamente mais tarde.',
      });
    } finally {
      setIsSwapping(false);
    }
  };

  const getTokenById = (id: string | null) => {
    if (!id) return null;
    return availableTokens.find(token => token.id === id) || null;
  };

  // Renderização do componente
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Swap de Tokens</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isBlockchainConnected && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-6 text-center">
            <Repeat className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">Conecte sua carteira</h3>
            <p className="mt-2 text-sm text-gray-500">
              Para realizar operações de swap, você precisa conectar sua carteira blockchain.
            </p>
            <Button className="mt-4" onClick={onConnectWallet}>
              Conectar Carteira
            </Button>
          </CardContent>
        </Card>
      )}

      {isBlockchainConnected && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">De</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="fromAmount">Quantidade</Label>
                    {fromToken && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={handleSetMaxAmount}
                      >
                        MAX
                      </Button>
                    )}
                  </div>
                  <Input
                    id="fromAmount"
                    value={fromAmount}
                    onChange={handleFromAmountChange}
                    placeholder="0.0"
                    className="text-lg"
                    disabled={isSwapping}
                  />
                </div>
                <div className="w-1/3">
                  <Select
                    value={fromToken || ''}
                    onValueChange={setFromToken}
                    disabled={isSwapping}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecionar token" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTokens.map((token) => (
                        <SelectItem key={token.id} value={token.id}>
                          <div className="flex items-center">
                            {token.imageUrl ? (
                              <img
                                src={token.imageUrl}
                                alt={token.symbol}
                                className="w-5 h-5 rounded-full mr-2"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-gray-100 mr-2" />
                            )}
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {fromToken && (
                <div className="mt-2 text-sm text-gray-500">
                  Saldo: {getTokenById(fromToken)?.formattedBalance || '0'} {getTokenById(fromToken)?.symbol || ''}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleSwapTokens}
              disabled={isSwapping || isLoadingQuote}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Para</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Label htmlFor="toAmount" className="mb-2">
                    Quantidade
                  </Label>
                  <Input
                    id="toAmount"
                    value={toAmount}
                    onChange={handleToAmountChange}
                    placeholder="0.0"
                    className="text-lg"
                    disabled={true}
                  />
                </div>
                <div className="w-1/3">
                  <Select
                    value={toToken || ''}
                    onValueChange={setToToken}
                    disabled={isSwapping}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecionar token" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTokens.map((token) => (
                        <SelectItem key={token.id} value={token.id}>
                          <div className="flex items-center">
                            {token.imageUrl ? (
                              <img
                                src={token.imageUrl}
                                alt={token.symbol}
                                className="w-5 h-5 rounded-full mr-2"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-gray-100 mr-2" />
                            )}
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {toToken && (
                <div className="mt-2 text-sm text-gray-500">
                  Saldo: {getTokenById(toToken)?.formattedBalance || '0'} {getTokenById(toToken)?.symbol || ''}
                </div>
              )}
            </CardContent>
          </Card>

          {showSettings && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="slippage">Slippage ({slippage}%)</Label>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setSlippage(0.1)}
                      >
                        0.1%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setSlippage(0.5)}
                      >
                        0.5%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setSlippage(1.0)}
                      >
                        1.0%
                      </Button>
                    </div>
                  </div>
                  <Slider
                    id="slippage"
                    value={[slippage]}
                    min={0.1}
                    max={5}
                    step={0.1}
                    onValueChange={(values) => setSlippage(values[0])}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-routing">Roteamento automático</Label>
                    <p className="text-sm text-gray-500">
                      Encontra automaticamente a melhor rota para o swap
                    </p>
                  </div>
                  <Switch
                    id="auto-routing"
                    checked={isAutoRouting}
                    onCheckedChange={setIsAutoRouting}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {quote && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Taxa de câmbio</span>
                  <span>
                    1 {getTokenById(fromToken)?.symbol} ≈{' '}
                    {quote.exchangeRate.toFixed(6)} {getTokenById(toToken)?.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Impacto de preço</span>
                  <span className={quote.priceImpact > 3 ? 'text-red-500' : ''}>
                    {quote.priceImpact.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Taxa</span>
                  <span>{quote.fee.toFixed(6)} {getTokenById(fromToken)?.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mínimo recebido</span>
                  <span>
                    {quote.minReceived.toFixed(6)} {getTokenById(toToken)?.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tempo estimado</span>
                  <span>{quote.estimatedTime} segundos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rota</span>
                  <span className="text-xs">
                    {quote.route.map((address, i) => {
                      // Encontrar token pelo endereço
                      const token = availableTokens.find(t => t.address === address);
                      return (
                        <span key={address}>
                          {token?.symbol || address.substring(0, 6)}
                          {i < quote.route.length - 1 && ' → '}
                        </span>
                      );
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {swapError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{swapError}</AlertDescription>
            </Alert>
          )}

          {swapSuccess && (
            <Alert variant="success" className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>Sucesso</AlertTitle>
              <AlertDescription>Swap executado com sucesso!</AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full"
            disabled={
              !fromToken ||
              !toToken ||
              !fromAmount ||
              !toAmount ||
              isSwapping ||
              isLoadingQuote ||
              !!swapError
            }
            onClick={executeSwap}
          >
            {isSwapping ? (
              <>
                <Spinner className="h-4 w-4 mr-2" />
                Processando...
              </>
            ) : isLoadingQuote ? (
              <>
                <Spinner className="h-4 w-4 mr-2" />
                Carregando cotação...
              </>
            ) : (
              <>
                <Repeat className="h-4 w-4 mr-2" />
                Executar Swap
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
} 