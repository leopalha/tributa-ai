import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CircuitBoard, Database, Clock, Server } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatusConexaoProps {
  minimal?: boolean;
}

export function StatusConexao({ minimal = false }: StatusConexaoProps) {
  const [status, setStatus] = useState({
    isConnected: false,
    lastBlock: 0,
    networkName: '',
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/blockchain/status');
        const data = await response.json();

        setStatus({
          isConnected: data.isOnline,
          lastBlock: data.latestBlock,
          networkName: data.networkName || 'Hyperledger Fabric',
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Erro ao buscar status da blockchain:', error);
        setStatus(prev => ({
          ...prev,
          isConnected: false,
          isLoading: false,
          error: 'Falha ao conectar com a API',
        }));
      }
    };

    fetchStatus();
    // Poll every 30 seconds
    const interval = setInterval(fetchStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (status.isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        {!minimal && (
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (minimal) {
    return (
      <div className="flex items-center gap-2">
        <CircuitBoard className="h-4 w-4 text-primary" />
        {status.isConnected ? (
          <Badge variant="success" className="text-xs">
            Online
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-xs">
            Offline
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <CircuitBoard className="h-5 w-5 text-primary" />
          <span className="font-semibold">Status da Blockchain:</span>
          {status.isConnected ? (
            <Badge variant="success" className="ml-2">
              Online
            </Badge>
          ) : (
            <Badge variant="destructive" className="ml-2">
              Offline
            </Badge>
          )}
        </div>
      </div>

      {status.isConnected ? (
        <div className="bg-green-50 p-4 rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm font-medium">Rede</div>
              <div className="text-sm text-gray-600">{status.networkName}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm font-medium">Último Bloco</div>
              <div className="text-sm text-gray-600">{status.lastBlock}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm font-medium">Atualizado</div>
              <div className="text-sm text-gray-600">Agora mesmo</div>
            </div>
          </div>
        </div>
      ) : (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-red-600">
                <CircuitBoard className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-red-700 mb-1">Blockchain indisponível</h4>
                <p className="text-sm text-red-600">
                  {status.error ||
                    'A conexão com a blockchain está indisponível no momento. Tente novamente mais tarde.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
