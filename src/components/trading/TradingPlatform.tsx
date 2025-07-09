import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  PieChart,
  Target,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { toast } from 'sonner';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TradingPlatformProps {
  className?: string;
}

export default function TradingPlatform({ className }: TradingPlatformProps) {
  // === ESTADOS ===
  const [selectedInstrument, setSelectedInstrument] = useState('ICMS-EXPORT-001');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('limit');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isLiveTrading, setIsLiveTrading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [orderBook, setOrderBook] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // === DADOS MOCK PARA INSTRUMENTOS ===
  const instruments = [
    {
      id: 'ICMS-EXPORT-001',
      symbol: 'ICMS-EXP',
      name: 'Crédito ICMS Exportação',
      type: 'TAX_TOKEN',
      currentPrice: 15750.0,
      change: 125.5,
      changePercent: 0.8,
      volume: 2500000,
      high: 15890.0,
      low: 15620.0,
      bid: 15745.0,
      ask: 15755.0,
      spread: 10.0,
      volatility: 12.5,
      marketCap: 125000000,
    },
    {
      id: 'PRECATORIO-SP-002',
      symbol: 'PREC-SP',
      name: 'Precatório TJ/SP',
      type: 'JUDICIAL_TOKEN',
      currentPrice: 8900.0,
      change: -45.2,
      changePercent: -0.51,
      volume: 1800000,
      high: 8980.0,
      low: 8850.0,
      bid: 8895.0,
      ask: 8905.0,
      spread: 10.0,
      volatility: 15.8,
      marketCap: 89000000,
    },
    {
      id: 'PIS-COFINS-003',
      symbol: 'PIS-COF',
      name: 'PIS/COFINS Indústria',
      type: 'TAX_TOKEN',
      currentPrice: 12300.0,
      change: 89.75,
      changePercent: 0.73,
      volume: 3200000,
      high: 12350.0,
      low: 12180.0,
      bid: 12295.0,
      ask: 12305.0,
      spread: 10.0,
      volatility: 11.2,
      marketCap: 156000000,
    },
    {
      id: 'CARBON-CREDIT-004',
      symbol: 'CARB-CR',
      name: 'Crédito de Carbono',
      type: 'CARBON_TOKEN',
      currentPrice: 45.8,
      change: 2.15,
      changePercent: 4.92,
      volume: 850000,
      high: 46.2,
      low: 44.5,
      bid: 45.75,
      ask: 45.85,
      spread: 0.1,
      volatility: 18.5,
      marketCap: 4580000,
    },
    {
      id: 'RURAL-CREDIT-005',
      symbol: 'RURAL-CR',
      name: 'Crédito Rural',
      type: 'RURAL_TOKEN',
      currentPrice: 25600.0,
      change: -156.8,
      changePercent: -0.61,
      volume: 1200000,
      high: 25780.0,
      low: 25450.0,
      bid: 25590.0,
      ask: 25610.0,
      spread: 20.0,
      volatility: 14.3,
      marketCap: 205000000,
    },
  ];

  // === EFEITOS ===
  useEffect(() => {
    initializeTradingData();
    const interval = setInterval(updateMarketData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedInstrument) {
      loadInstrumentData(selectedInstrument);
    }
  }, [selectedInstrument]);

  // === FUNÇÕES ===
  const initializeTradingData = () => {
    setMarketData(generateMarketData());
    setPortfolio(generatePortfolio());
    setOrderBook(generateOrderBook());
    setTrades(generateTrades());
    setPositions(generatePositions());
    setOrders(generateOrders());
  };

  const updateMarketData = useCallback(() => {
    if (isLiveTrading) {
      setMarketData(prevData => ({
        ...prevData,
        timestamp: new Date(),
        instruments: instruments.map(instrument => ({
          ...instrument,
          currentPrice:
            instrument.currentPrice + (Math.random() - 0.5) * instrument.currentPrice * 0.001,
          change: (Math.random() - 0.5) * 100,
          changePercent: (Math.random() - 0.5) * 2,
          volume: instrument.volume + Math.floor(Math.random() * 10000),
        })),
      }));
    }
  }, [isLiveTrading]);

  const loadInstrumentData = (instrumentId: string) => {
    // Carregar dados específicos do instrumento
    const instrument = instruments.find(i => i.id === instrumentId);
    if (instrument) {
      setPrice(instrument.currentPrice.toFixed(2));
      setOrderBook(generateOrderBook(instrumentId));
    }
  };

  const handlePlaceOrder = () => {
    if (!quantity || !price) {
      toast.error('Preencha quantidade e preço');
      return;
    }

    const order = {
      id: `order-${Date.now()}`,
      instrument: selectedInstrument,
      side: orderSide,
      type: orderType,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      status: 'pending',
      timestamp: new Date(),
    };

    setOrders(prev => [order, ...prev]);
    toast.success(`Ordem ${orderSide === 'buy' ? 'de compra' : 'de venda'} enviada!`);

    // Simular execução após 2-5 segundos
    setTimeout(
      () => {
        setOrders(prev => prev.map(o => (o.id === order.id ? { ...o, status: 'filled' } : o)));
        toast.success('Ordem executada!');
      },
      Math.random() * 3000 + 2000
    );
  };

  const generateMarketData = () => ({
    timestamp: new Date(),
    instruments: instruments,
    indices: [
      { name: 'ITCR Index', value: 1250.75, change: 12.5, changePercent: 1.01 },
      { name: 'PREC Index', value: 890.25, change: -5.2, changePercent: -0.58 },
      { name: 'CARB Index', value: 45.8, change: 2.15, changePercent: 4.92 },
    ],
    marketSentiment: {
      overall: 65, // 0-100
      fear: 25,
      greed: 75,
      volatility: 35,
    },
  });

  const generatePortfolio = () => ({
    totalValue: 2500000,
    cashBalance: 150000,
    investedValue: 2350000,
    dayChange: 12500,
    dayChangePercent: 0.5,
    totalReturn: 250000,
    totalReturnPercent: 11.11,
    positions: [
      { instrument: 'ICMS-EXP', quantity: 100, value: 1575000, pnl: 75000 },
      { instrument: 'PREC-SP', quantity: 50, value: 445000, pnl: -12500 },
      { instrument: 'PIS-COF', quantity: 75, value: 922500, pnl: 35000 },
    ],
  });

  const generateOrderBook = (instrumentId?: string) => ({
    instrument: instrumentId || selectedInstrument,
    bids: Array.from({ length: 10 }, (_, i) => ({
      price: 15750 - i * 5,
      quantity: Math.floor(Math.random() * 1000) + 100,
      orders: Math.floor(Math.random() * 10) + 1,
    })),
    asks: Array.from({ length: 10 }, (_, i) => ({
      price: 15755 + i * 5,
      quantity: Math.floor(Math.random() * 1000) + 100,
      orders: Math.floor(Math.random() * 10) + 1,
    })),
  });

  const generateTrades = () =>
    Array.from({ length: 20 }, (_, i) => ({
      id: `trade-${i}`,
      instrument: instruments[Math.floor(Math.random() * instruments.length)].symbol,
      price: 15000 + Math.random() * 1000,
      quantity: Math.floor(Math.random() * 500) + 10,
      side: Math.random() > 0.5 ? 'buy' : 'sell',
      timestamp: new Date(Date.now() - Math.random() * 3600000),
    }));

  const generatePositions = () => [
    { instrument: 'ICMS-EXP', quantity: 100, avgPrice: 15500, currentPrice: 15750, pnl: 25000 },
    { instrument: 'PREC-SP', quantity: 50, avgPrice: 9000, currentPrice: 8900, pnl: -5000 },
    { instrument: 'PIS-COF', quantity: 75, avgPrice: 12200, currentPrice: 12300, pnl: 7500 },
  ];

  const generateOrders = () => [
    {
      id: 'order-1',
      instrument: 'ICMS-EXP',
      side: 'buy',
      quantity: 50,
      price: 15700,
      status: 'open',
    },
    {
      id: 'order-2',
      instrument: 'PREC-SP',
      side: 'sell',
      quantity: 25,
      price: 8950,
      status: 'pending',
    },
  ];

  // === DADOS PARA GRÁFICOS ===
  const priceChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Preço',
        data: Array.from({ length: 24 }, () => 15750 + (Math.random() - 0.5) * 200),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const volumeChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Volume',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100000) + 50000),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  const portfolioChartData = {
    labels: ['ICMS-EXP', 'PREC-SP', 'PIS-COF', 'CARB-CR', 'RURAL-CR'],
    datasets: [
      {
        data: [35, 25, 20, 12, 8],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plataforma de Trading</h1>
          <p className="text-muted-foreground">Negociação de títulos tokenizados em tempo real</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={isLiveTrading ? 'default' : 'outline'}
            onClick={() => setIsLiveTrading(!isLiveTrading)}
          >
            {isLiveTrading ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isLiveTrading ? 'Pausar' : 'Iniciar'} Live
          </Button>
          <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
            {showAdvanced ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showAdvanced ? 'Ocultar' : 'Mostrar'} Avançado
          </Button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">{formatCurrency(portfolio?.totalValue || 0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">
                +{formatPercent(portfolio?.dayChangePercent || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">P&L Diário</p>
                <p className="text-2xl font-bold">{formatCurrency(portfolio?.dayChange || 0)}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">Lucro</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Posições Ativas</p>
                <p className="text-2xl font-bold">{positions.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-muted-foreground">Instrumentos</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risco</p>
                <p className="text-2xl font-bold">Médio</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-yellow-500">VaR: {formatCurrency(125000)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Painel de Trading</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="chart">Gráfico</TabsTrigger>
                <TabsTrigger value="orderbook">Book</TabsTrigger>
                <TabsTrigger value="trades">Negócios</TabsTrigger>
                <TabsTrigger value="analysis">Análise</TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {instruments.map(instrument => (
                        <SelectItem key={instrument.id} value={instrument.id}>
                          {instrument.symbol} - {instrument.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge variant="outline">
                    {formatCurrency(
                      instruments.find(i => i.id === selectedInstrument)?.currentPrice || 0
                    )}
                  </Badge>
                  <Badge
                    variant={
                      instruments.find(i => i.id === selectedInstrument)?.change >= 0
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {formatPercent(
                      instruments.find(i => i.id === selectedInstrument)?.changePercent || 0
                    )}
                  </Badge>
                </div>
                <div className="h-64">
                  <Line
                    data={priceChartData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
                <div className="h-32">
                  <Bar
                    data={volumeChartData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="orderbook" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Compra</h4>
                    <div className="space-y-1">
                      {orderBook?.bids.slice(0, 10).map((bid, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-green-600">{formatCurrency(bid.price)}</span>
                          <span>{bid.quantity}</span>
                          <span className="text-muted-foreground">{bid.orders}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Venda</h4>
                    <div className="space-y-1">
                      {orderBook?.asks.slice(0, 10).map((ask, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-red-600">{formatCurrency(ask.price)}</span>
                          <span>{ask.quantity}</span>
                          <span className="text-muted-foreground">{ask.orders}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trades" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Últimos Negócios</h4>
                  {trades.slice(0, 15).map((trade, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{trade.instrument}</span>
                      <span className={trade.side === 'buy' ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(trade.price)}
                      </span>
                      <span>{trade.quantity}</span>
                      <span className="text-muted-foreground">
                        {trade.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Análise Técnica</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>RSI (14):</span>
                          <Badge variant="outline">65.2</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>MACD:</span>
                          <Badge variant="default">Compra</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Bollinger:</span>
                          <Badge variant="outline">Neutro</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Suporte:</span>
                          <span>{formatCurrency(15600)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resistência:</span>
                          <span>{formatCurrency(15900)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sentimento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Geral:</span>
                          <Badge variant="default">Otimista</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Medo/Ganância:</span>
                          <Badge variant="outline">75/25</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Volatilidade:</span>
                          <Badge variant="outline">Média</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Volume:</span>
                          <Badge variant="default">Alto</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Order Entry */}
        <Card>
          <CardHeader>
            <CardTitle>Enviar Ordem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={orderSide === 'buy' ? 'default' : 'outline'}
                onClick={() => setOrderSide('buy')}
                className="bg-green-600 hover:bg-green-700"
              >
                Comprar
              </Button>
              <Button
                variant={orderSide === 'sell' ? 'default' : 'outline'}
                onClick={() => setOrderSide('sell')}
                className="bg-red-600 hover:bg-red-700"
              >
                Vender
              </Button>
            </div>

            <Select value={orderType} onValueChange={(value: any) => setOrderType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Mercado</SelectItem>
                <SelectItem value="limit">Limitada</SelectItem>
                <SelectItem value="stop">Stop</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantidade</label>
              <Input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="0"
              />
            </div>

            {orderType !== 'market' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Preço</label>
                <Input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Valor Total:</span>
                <span>
                  {formatCurrency((parseFloat(quantity) || 0) * (parseFloat(price) || 0))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxa:</span>
                <span>
                  {formatCurrency((parseFloat(quantity) || 0) * (parseFloat(price) || 0) * 0.0025)}
                </span>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              className="w-full"
              disabled={!quantity || (!price && orderType !== 'market')}
            >
              Enviar Ordem
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio and Positions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfólio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <Pie
                data={portfolioChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            <div className="space-y-2">
              {positions.map((position, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{position.instrument}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {position.quantity} unidades
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(position.currentPrice * position.quantity)}
                    </div>
                    <div
                      className={`text-sm ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {formatCurrency(position.pnl)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ordens Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.map((order, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-medium">{order.instrument}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.side === 'buy' ? 'Compra' : 'Venda'} • {order.quantity} unidades
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(order.price)}</div>
                    <Badge variant={order.status === 'filled' ? 'default' : 'outline'}>
                      {order.status === 'filled' ? 'Executada' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center text-muted-foreground py-8">Nenhuma ordem ativa</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
