import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  RefreshCw, 
  Search, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowUpRight,
  ArrowDownLeft,
  FileCode,
  Blocks,
  Wallet,
} from 'lucide-react';
import { BlockchainTransaction } from '@/types/wallet';
import { blockchainIntegrationService } from '@/services/blockchain-integration.service';
import { useToast } from '@/components/ui/use-toast';

interface WalletBlockchainTransactionsProps {
  transactions?: BlockchainTransaction[];
  loading?: boolean;
  onRefresh?: () => void;
}

export function WalletBlockchainTransactions({
  transactions: initialTransactions,
  loading: initialLoading,
  onRefresh,
}: WalletBlockchainTransactionsProps) {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>(initialTransactions || []);
  const [loading, setLoading] = useState<boolean>(initialLoading || false);
  const [isBlockchainConnected, setIsBlockchainConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<BlockchainTransaction[]>([]);

  // Verificar conexão com blockchain
  useEffect(() => {
    const checkBlockchainConnection = async () => {
      const connected = blockchainIntegrationService.isWalletConnected();
      if (!connected) {
        try {
          const success = await blockchainIntegrationService.connect();
          setIsBlockchainConnected(success);
          if (success) {
            loadBlockchainTransactions();
          }
        } catch (error) {
          console.error('Erro ao conectar com blockchain:', error);
          setIsBlockchainConnected(false);
        }
      } else {
        setIsBlockchainConnected(true);
        loadBlockchainTransactions();
      }
    };
    
    checkBlockchainConnection();
  }, []);

  // Carregar transações da blockchain
  const loadBlockchainTransactions = async () => {
    setLoading(true);
    try {
      const data = await blockchainIntegrationService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações blockchain:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar transações',
        description: 'Não foi possível carregar as transações da blockchain.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Atualizar transações
  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      loadBlockchainTransactions();
    }
  };

  // Abrir transação no explorador da blockchain
  const openInExplorer = (hash: string) => {
    // Em um ambiente real, isso abriria o explorador da blockchain correta
    // baseado na rede atual (Ethereum, Polygon, etc.)
    window.open(`https://etherscan.io/tx/${hash}`, '_blank');
  };

  // Função para copiar texto para a área de transferência
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Poderia adicionar um toast aqui
  };

  // Formatar endereço para exibição
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Formatar valor como moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Filtrar transações
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredTransactions([]);
      return;
    }

    const filtered = transactions.filter(tx => 
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredTransactions(filtered);
  };

  // Determinar ícone de status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  // Determinar ícone de tipo
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SEND':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'RECEIVE':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'CONTRACT_INTERACTION':
        return <FileCode className="h-4 w-4 text-blue-500" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-500" />;
    }
  };

  // Determinar cor do badge de status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'FAILED':
        return 'destructive';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const transactionsToDisplay = searchTerm.trim() 
    ? filteredTransactions 
    : transactions;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Transações na Blockchain</h3>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          {loading ? <Spinner className="h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Atualizar Dados
        </Button>
      </div>

      {!isBlockchainConnected ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-6 text-center">
            <Wallet className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">Carteira não conectada</h3>
            <p className="mt-2 text-sm text-gray-500">
              Conecte sua carteira blockchain para visualizar suas transações.
            </p>
            <Button className="mt-4" onClick={() => blockchainIntegrationService.connect()}>
              Conectar Carteira
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <Card>
          <CardContent className="pt-6 flex justify-center">
            <Spinner className="h-8 w-8" />
          </CardContent>
        </Card>
      ) : transactionsToDisplay.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-6 text-center">
            <RefreshCw className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">Nenhuma transação encontrada</h3>
            <p className="mt-2 text-sm text-gray-500">
              Não há transações registradas na blockchain para esta carteira.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Blocks className="mr-2 h-5 w-5 text-blue-600" />
              Transações Registradas na Blockchain
            </CardTitle>
            <CardDescription>
              Visualize todas as transações da sua carteira registradas na blockchain
            </CardDescription>
            
            <div className="flex mt-4 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por hash ou endereço..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>Buscar</Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Hash</TableHead>
                    <TableHead>De</TableHead>
                    <TableHead>Para</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Taxa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsToDisplay.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {getTypeIcon(tx.type)}
                          <span className="ml-2">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center">
                          {formatAddress(tx.hash)}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 ml-1"
                            onClick={() => copyToClipboard(tx.hash)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {formatAddress(tx.from)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {formatAddress(tx.to)}
                      </TableCell>
                      <TableCell>
                        {tx.value} ETH
                      </TableCell>
                      <TableCell>
                        {tx.fee} ETH
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(tx.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(tx.status)}
                            <span>
                              {tx.status === 'SUCCESS' ? 'Confirmado' : 
                               tx.status === 'FAILED' ? 'Falhou' : 'Pendente'}
                            </span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(tx.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openInExplorer(tx.hash)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="text-sm text-gray-500">
              Mostrando {transactionsToDisplay.length} transações
            </div>
            <Button variant="link" className="text-sm">
              Ver no Explorer <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

// Função para gerar dados de exemplo
function generateMockTransactions(): BlockchainTransaction[] {
  const types = ['SEND', 'RECEIVE', 'CONTRACT_INTERACTION'] as const;
  const statuses = ['SUCCESS', 'FAILED', 'PENDING'] as const;
  
  return Array.from({ length: 10 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const now = new Date();
    now.setHours(now.getHours() - i);
    
    return {
      id: `tx-${i}`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      blockNumber: 15000000 - i,
      timestamp: now.toISOString(),
      from: `0x${Math.random().toString(16).substring(2, 42)}`,
      to: `0x${Math.random().toString(16).substring(2, 42)}`,
      value: Math.random() * 10000,
      fee: Math.random() * 10,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type,
    };
  });
} 