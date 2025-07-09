import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/spinner';
import { Wallet, Link as LinkIcon, Unlink, Copy } from 'lucide-react'; // Ícones
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface WalletSetupProps {
  userId: string;
  // Endereço da wallet atual (ou null)
  // Viria dos dados do usuário
  initialWalletAddress: string | null;
}

// Função simulada para conectar wallet (substituir por web3 library)
async function connectWalletSimulated(): Promise<string> {
  console.log('Simulando conexão com MetaMask/WalletConnect...');
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Retorna um endereço Ethereum de exemplo
  const mockAddress =
    '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  console.log('Wallet simulada conectada:', mockAddress);
  return mockAddress;
}

export function WalletSetup({ userId, initialWalletAddress }: WalletSetupProps) {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState<string | null>(initialWalletAddress);
  const [isLoadingConnect, setIsLoadingConnect] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const handleConnect = async () => {
    setIsLoadingConnect(true);
    try {
      const address = await connectWalletSimulated(); // Chamar a função real da lib web3 aqui
      setWalletAddress(address);
      // Chamar API para salvar o endereço no backend após conectar
      await handleSaveAddress(address);
    } catch (error: any) {
      // Capturar erros da conexão da wallet
      console.error('Erro ao conectar wallet:', error);
      toast({
        variant: 'destructive',
        title: 'Erro de Conexão',
        description: error.message || 'Não foi possível conectar à carteira.',
      });
      setWalletAddress(null); // Garante que o endereço antigo não persista se a conexão falhar
    } finally {
      setIsLoadingConnect(false);
    }
  };

  // Função para chamar a API e salvar o endereço
  const handleSaveAddress = async (address: string | null) => {
    if (!address) return; // Não salva se o endereço for nulo
    setIsLoadingSave(true);
    try {
      const response = await fetch('/api/users/wallet/set-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Falha ao salvar endereço da carteira.');
      }
      toast({ title: 'Sucesso', description: 'Endereço da carteira salvo.' });
    } catch (error: any) {
      console.error('Erro ao salvar endereço:', error);
      toast({ variant: 'destructive', title: 'Erro ao Salvar', description: error.message });
      // Reverter o estado local se a API falhar?
      // setWalletAddress(initialWalletAddress);
    } finally {
      setIsLoadingSave(false);
    }
  };

  // Função para desconectar (simulada)
  const handleDisconnect = async () => {
    console.log('Simulando desconexão da wallet...');
    // TODO: Chamar função de desconexão da lib web3, se necessário
    setWalletAddress(null);
    // Chamar API para remover/limpar endereço no backend
    await handleSaveAddress(null); // Enviar null para limpar
    toast({ description: 'Carteira desconectada.' });
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard
        .writeText(walletAddress)
        .then(() => toast({ description: 'Endereço copiado!' }))
        .catch(() => toast({ variant: 'destructive', description: 'Falha ao copiar.' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="mr-2 h-5 w-5" /> Carteira Blockchain
        </CardTitle>
        <CardDescription>
          Conecte sua carteira digital (ex: MetaMask) para interagir com os Títulos de Crédito
          tokenizados na plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="warning">
          <LinkIcon className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Certifique-se de que está conectando a carteira correta. As transações na blockchain são
            irreversíveis.
          </AlertDescription>
        </Alert>

        {walletAddress ? (
          <div className="space-y-3">
            <Label>Carteira Conectada</Label>
            <div className="flex items-center space-x-2">
              <Input
                readOnly
                value={walletAddress}
                className="font-mono text-sm flex-grow truncate"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyAddress}
                title="Copiar Endereço"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDisconnect}
                title="Desconectar Carteira"
              >
                <Unlink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Esta carteira será usada para receber e negociar TCs.
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleConnect}
              disabled={isLoadingConnect || isLoadingSave}
              className="flex-grow"
            >
              {(isLoadingConnect || isLoadingSave) && <Spinner className="mr-2 h-4 w-4" />}
              {isLoadingConnect
                ? 'Conectando...'
                : isLoadingSave
                  ? 'Salvando...'
                  : 'Conectar Carteira Existente'}
            </Button>
            {/* 
            // Botão para criar wallet (adiado)
            <Button variant="secondary" disabled={isLoadingConnect || isLoadingSave}>
                Criar Nova Carteira (Custodiada)
            </Button> 
            */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
