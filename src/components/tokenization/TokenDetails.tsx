import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Building,
  User,
  DollarSign,
  Star,
  Shield,
  Clock,
  Eye,
  Copy
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface TokenDetailsProps {
  token: {
    id: string;
    nome: string;
    tipo: string;
    subtipo: string;
    valor: number;
    dataEmissao: Date;
    dataVencimento: Date;
    status: string;
    transactionHash: string;
    emissor: string;
    detentor: string;
    documentos: number;
    desconto: number;
    rendimento: number;
    rating: string;
    blockchain: {
      rede: string;
      contrato: string;
      tokenId: string;
      confirmacoes: number;
    };
    marketplace: {
      listado: boolean;
      preco: number;
      visualizacoes: number;
      interessados: number;
      ofertasRecebidas: number;
    };
  };
}

export const TokenDetails: React.FC<TokenDetailsProps> = ({ token }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{token.nome}</h1>
          <p className="text-gray-600">Token ID: {token.id}</p>
        </div>
        <Badge className="text-lg px-4 py-2">
          {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Informações do Token
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo</p>
                <p className="text-lg font-semibold capitalize">{token.tipo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Subtipo</p>
                <p className="text-lg font-semibold">{token.subtipo.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Valor</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(token.valor)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Rating</p>
                <p className="text-lg font-bold text-blue-600">{token.rating}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Data de Emissão</p>
                  <p className="font-semibold">{formatDate(token.dataEmissao)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Data de Vencimento</p>
                  <p className="font-semibold">{formatDate(token.dataVencimento)}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Emissor</p>
                  <p className="font-semibold">{token.emissor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Detentor</p>
                  <p className="font-semibold">{token.detentor}</p>
                </div>
              </div>
            </div>

            {(token.desconto > 0 || token.rendimento > 0) && (
              <>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  {token.desconto > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Desconto</p>
                      <p className="text-lg font-semibold text-orange-600">{token.desconto}%</p>
                    </div>
                  )}
                  {token.rendimento > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rendimento</p>
                      <p className="text-lg font-semibold text-green-600">{token.rendimento}%</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Baixar Certificado
              </Button>
              
              {token.status === 'ativo' && !token.marketplace.listado && (
                <Button variant="outline" className="w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Listar no Marketplace
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver na Blockchain
              </Button>
              
              <Button variant="ghost" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Documentos ({token.documentos})
              </Button>
            </CardContent>
          </Card>

          {/* Marketplace Info */}
          {token.marketplace.listado && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Marketplace
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Preço de Venda</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(token.marketplace.preco)}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Visualizações</p>
                    <p className="font-semibold">{token.marketplace.visualizacoes}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Interessados</p>
                    <p className="font-semibold">{token.marketplace.interessados}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Ofertas Recebidas</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {token.marketplace.ofertasRecebidas}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Blockchain Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Informações da Blockchain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Rede</p>
              <p className="font-semibold">{token.blockchain.rede}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Contrato</p>
              <p className="font-semibold">{token.blockchain.contrato}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Token ID</p>
              <div className="flex items-center gap-2">
                <p className="font-semibold truncate">{token.blockchain.tokenId}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(token.blockchain.tokenId)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Confirmações</p>
              <p className="font-semibold text-green-600">{token.blockchain.confirmacoes}</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Transaction Hash</p>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <code className="text-sm font-mono flex-1 truncate">{token.transactionHash}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(token.transactionHash)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 