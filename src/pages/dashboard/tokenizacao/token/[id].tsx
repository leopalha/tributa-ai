import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
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
  Copy,
  History,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Share2
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { tokenService, TokenData } from '@/services/token.service';
import { toast } from 'sonner';

export default function TokenDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [token, setToken] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadTokenData(id);
    }
  }, [id]);

  const loadTokenData = async (tokenId: string) => {
    try {
      setLoading(true);
      const [tokenData, tokenDocuments, tokenHistory] = await Promise.all([
        tokenService.getTokenById(tokenId),
        tokenService.getTokenDocuments(tokenId),
        tokenService.getTokenHistory(tokenId)
      ]);
      
      setToken(tokenData);
      setDocuments(tokenDocuments);
      setHistory(tokenHistory);
    } catch (error) {
      console.error('Erro ao carregar dados do token:', error);
      toast.error('Erro ao carregar dados do token');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!token) return;
    
    try {
      toast.loading('Gerando certificado...', { id: 'download-cert' });
      const blob = await tokenService.downloadCertificate(token.id);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificado-${token.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Certificado baixado com sucesso!', { id: 'download-cert' });
    } catch (error) {
      toast.error('Erro ao baixar certificado', { id: 'download-cert' });
    }
  };

  const handleDownloadDocument = async (documentId: string, fileName: string) => {
    if (!token) return;
    
    try {
      const blob = await tokenService.downloadDocument(token.id, documentId);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Documento baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao baixar documento');
    }
  };

  const handleListOnMarketplace = () => {
    if (!token) return;
    router.push(`/dashboard/tokenizacao/listar/${token.id}`);
  };

  const handleViewOnBlockchain = () => {
    if (!token) return;
    window.open(`https://explorer.hyperledger.com/tx/${token.transactionHash}`, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'listado': return 'bg-blue-100 text-blue-800';
      case 'vendido': return 'bg-purple-100 text-purple-800';
      case 'liquidado': return 'bg-gray-100 text-gray-800';
      case 'expirado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating: string) => {
    if (rating.startsWith('AAA') || rating.startsWith('AA')) return 'text-green-600';
    if (rating.startsWith('A') || rating.startsWith('BBB')) return 'text-blue-600';
    if (rating.startsWith('BB') || rating.startsWith('B')) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Token não encontrado</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{token.nome}</h1>
            <p className="text-gray-600">Token ID: {token.id}</p>
          </div>
        </div>
        <Badge className={`text-lg px-4 py-2 ${getStatusColor(token.status)}`}>
          {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
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
                  <p className={`text-lg font-bold ${getRatingColor(token.rating)}`}>{token.rating}</p>
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

          {/* Blockchain Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Informações da Blockchain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={handleDownloadCertificate}>
                <Download className="w-4 h-4 mr-2" />
                Baixar Certificado
              </Button>
              
              {token.status === 'ativo' && !token.marketplace.listado && (
                <Button variant="outline" className="w-full" onClick={handleListOnMarketplace}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Listar no Marketplace
                </Button>
              )}
              
              <Button variant="outline" className="w-full" onClick={handleViewOnBlockchain}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver na Blockchain
              </Button>
              
              <Button variant="ghost" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
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

      {/* Tabs */}
      <Tabs defaultValue="documents" className="mt-8">
        <TabsList>
          <TabsTrigger value="documents">Documentos ({documents.length})</TabsTrigger>
          <TabsTrigger value="history">Histórico ({history.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos do Token</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum documento encontrado</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{doc.nome}</p>
                          <p className="text-sm text-gray-500">{doc.tipo} • {doc.tamanho}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadDocument(doc.id, doc.nome)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico do Token</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum histórico encontrado</p>
              ) : (
                <div className="space-y-4">
                  {history.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 p-3 border-l-2 border-blue-200">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <History className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{entry.acao}</p>
                        <p className="text-sm text-gray-600">{entry.descricao}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {entry.timestamp.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 