import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ShoppingCart,
  Package,
  Calendar,
  Eye,
  Star,
  Filter,
  Search,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  RefreshCw,
  BarChart3,
  Bell,
  MessageSquare,
  Verified,
  ExternalLink,
  Coins,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ComprasPageNew() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('data_desc');

  const compras = [
    {
      id: '1',
      titulo: 'ICMS - Exportação Agronegócio Tokenizado',
      valor: 850000,
      precoCompra: 765000,
      economia: 85000,
      dataCompra: '2024-01-15',
      status: 'concluida',
      vendedor: 'AgroExport Brasil Ltda',
      categoria: 'ICMS',
      rating: 4.8,
      transactionId: 'TXN_20240115_001',
      proofUrl: '/proof/TXN_20240115_001.pdf',
      tokenId: 'ERC-721-001',
      blockchain: 'Ethereum',
      verified: true,
      documentos: ['Título Original', 'Certidões', 'Contrato'],
      liquidacao: '2024-01-16',
      comissao: 22950,
    },
    {
      id: '2',
      titulo: 'PIS/COFINS - Indústria Química Tokenizada',
      valor: 420000,
      precoCompra: 378000,
      economia: 42000,
      dataCompra: '2024-01-12',
      status: 'processando',
      vendedor: 'Química Industrial SP',
      categoria: 'PIS/COFINS',
      rating: 4.5,
      transactionId: 'TXN_20240112_002',
      proofUrl: '/proof/TXN_20240112_002.pdf',
      tokenId: 'ERC-1155-002',
      blockchain: 'Polygon',
      verified: true,
      documentos: ['Título Original', 'Certidões'],
      liquidacao: '2024-01-14',
      comissao: 11340,
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
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'processando':
        return 'bg-blue-100 text-blue-800';
      case 'pendente_docs':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'concluida':
        return 'Concluída';
      case 'processando':
        return 'Processando';
      case 'pendente_docs':
        return 'Pendente Docs';
      case 'cancelada':
        return 'Cancelada';
      default:
        return 'Desconhecido';
    }
  };

  const getBlockchainColor = (blockchain: string) => {
    switch (blockchain) {
      case 'Ethereum':
        return 'bg-blue-100 text-blue-800';
      case 'Polygon':
        return 'bg-purple-100 text-purple-800';
      case 'BSC':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: compras.length,
    valorTotal: compras.reduce((sum, c) => sum + c.precoCompra, 0),
    economiaTotal: compras.reduce((sum, c) => sum + c.economia, 0),
    ratingMedio: compras.reduce((sum, c) => sum + c.rating, 0) / compras.length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Compras</h1>
          <p className="text-gray-600">Histórico completo de títulos de crédito adquiridos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Compras</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Investido</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.valorTotal)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Economia Total</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.economiaTotal)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfação</p>
                <p className="text-2xl font-bold">{stats.ratingMedio.toFixed(1)}/5</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Compras */}
      <div className="space-y-4">
        {compras.map(compra => (
          <Card key={compra.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{compra.vendedor.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{compra.titulo}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">{compra.vendedor}</span>
                      {compra.verified && <Verified className="w-4 h-4 text-blue-500" />}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                        <span className="text-sm text-gray-600">{compra.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(compra.status)}>
                    {getStatusText(compra.status)}
                  </Badge>
                  <Badge variant="outline">{compra.categoria}</Badge>
                  <Badge className={getBlockchainColor(compra.blockchain)}>
                    <Coins className="w-3 h-3 mr-1" />
                    {compra.blockchain}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Valor Original</p>
                  <p className="font-semibold">{formatCurrency(compra.valor)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Preço Pago</p>
                  <p className="font-semibold text-blue-600">
                    {formatCurrency(compra.precoCompra)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Economia</p>
                  <p className="font-semibold text-green-600">{formatCurrency(compra.economia)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Data da Compra</p>
                  <p className="font-semibold">{formatDate(compra.dataCompra)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Token ID</p>
                  <p className="font-semibold text-xs">{compra.tokenId}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Comissão</p>
                  <p className="font-semibold text-orange-600">{formatCurrency(compra.comissao)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  Detalhes
                </Button>

                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Comprovante
                </Button>

                <Button size="sm" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Blockchain
                </Button>

                <Button size="sm" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Contatar
                </Button>

                <Button size="sm" variant="outline">
                  <Star className="w-4 h-4 mr-1" />
                  Avaliar
                </Button>

                {compra.status === 'concluida' && (
                  <Badge variant="secondary" className="ml-auto">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Transação Concluída
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
