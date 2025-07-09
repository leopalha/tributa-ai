import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  LinkIcon,
  ChevronRight,
  ExternalLink,
  Copy,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface WalletConnectProps {
  className?: string;
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  isConnected?: boolean;
  walletAddress?: string;
}

export function WalletConnect({
  className,
  onConnect,
  onDisconnect,
  isConnected = false,
  walletAddress = '',
}: WalletConnectProps) {
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  // In a real implementation this would connect to a wallet like MetaMask
  const handleConnect = async () => {
    if (isConnected) return;

    setConnecting(true);
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate a mock wallet address
      const mockAddress =
        '0x' +
        Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      if (onConnect) onConnect(mockAddress);
      toast.success('Carteira conectada com sucesso!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Falha ao conectar carteira');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!isConnected) return;

    setDisconnecting(true);
    try {
      // Simulate wallet disconnection
      await new Promise(resolve => setTimeout(resolve, 800));

      if (onDisconnect) onDisconnect();
      toast.success('Carteira desconectada');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Falha ao desconectar carteira');
    } finally {
      setDisconnecting(false);
    }
  };

  const copyToClipboard = () => {
    if (!walletAddress) return;

    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Endereço copiado para área de transferência');
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Wallet className="mr-2 h-5 w-5" />
          Carteira Blockchain
        </CardTitle>
        <CardDescription>
          {isConnected
            ? 'Sua carteira está conectada'
            : 'Conecte sua carteira para interagir com a blockchain'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-muted-foreground">Endereço da Carteira</span>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-muted px-3 py-2 rounded-md text-sm font-mono">
                  {formatAddress(walletAddress)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  disabled={!walletAddress}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={`https://polygonscan.com/address/${walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 px-4 bg-muted rounded-lg">
              <div>
                <div className="text-sm font-medium">Rede</div>
                <div className="text-xs text-muted-foreground">Polygon zkEVM</div>
              </div>
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Conectado</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="bg-muted inline-flex p-3 rounded-full mb-4">
              <LinkIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Carteira Não Conectada</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Conecte sua carteira para visualizar saldos, enviar e receber tokens, e interagir com
              contratos inteligentes.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <div className="flex flex-col w-full space-y-2">
            <Button variant="default" className="w-full" asChild>
              <a href="/dashboard/blockchain/tokens">
                Gerenciar Tokens
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDisconnect}
                disabled={disconnecting}
              >
                {disconnecting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Desconectando...
                  </>
                ) : (
                  'Desconectar'
                )}
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="/dashboard/blockchain/perfil">
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="default"
            className="w-full"
            onClick={handleConnect}
            disabled={connecting}
          >
            {connecting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Conectar Carteira
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
