import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface CompensacaoBlockchainProps {
  compensacaoId: string;
}

export function CompensacaoBlockchain({ compensacaoId }: CompensacaoBlockchainProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompensacaoData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data for demonstration
        // In a real app, replace with API call:
        // const response = await api.get(`/api/blockchain/compensacao/${compensacaoId}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockData = {
          id: compensacaoId,
          status: 'COMPLETED',
          valor: 15000.0,
          dataRegistro: new Date().toISOString(),
          blocoCriacao: 12345,
          blocoAtualizacao: 12347,
          documentos: ['doc1', 'doc2'],
          transacoes: [
            {
              id: 'tx1',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              descricao: 'Registro inicial',
              status: 'CONFIRMED',
            },
            {
              id: 'tx2',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              descricao: 'Atualização de status',
              status: 'CONFIRMED',
            },
            { id: 'tx3', timestamp: new Date(), descricao: 'Finalização', status: 'CONFIRMED' },
          ],
        };

        setData(mockData);
      } catch (err) {
        console.error('Erro ao buscar dados da compensação na blockchain:', err);
        setError('Não foi possível carregar os dados da compensação na blockchain');
      } finally {
        setLoading(false);
      }
    };

    if (compensacaoId) {
      fetchCompensacaoData();
    }
  }, [compensacaoId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'PROCESSING':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'CREATED':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'FAILED':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5" />
          <strong>Erro</strong>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Selecione uma compensação para visualizar detalhes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-semibold">{`Compensação #${data.id.substring(0, 8)}`}</h3>
          <p className="text-sm text-muted-foreground">
            Registrada em: {formatDate(data.dataRegistro)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(data.status)}
          <Badge variant={data.status === 'COMPLETED' ? 'default' : 'outline'}>{data.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-md">
          <p className="text-sm font-medium mb-1">Valor da Compensação</p>
          <p className="text-xl font-bold">{formatCurrency(data.valor)}</p>
        </div>
        <div className="p-4 border rounded-md">
          <p className="text-sm font-medium mb-1">Bloco da Transação</p>
          <p className="text-xl font-mono">{data.blocoCriacao}</p>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium mb-2">Histórico na Blockchain</h4>
        <div className="space-y-2">
          {data.transacoes.map((tx: any, index: number) => (
            <div key={index} className="p-3 bg-muted rounded-md">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{tx.descricao}</span>
                <span className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</span>
              </div>
              <div className="text-xs text-muted-foreground font-mono mt-1 truncate">{tx.id}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
