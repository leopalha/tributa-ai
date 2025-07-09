import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Download,
  Share2,
  CheckCircle,
  Calendar,
  Clock,
  DollarSign,
  User,
  Building,
  Hash,
  Shield,
  ExternalLink,
  Printer,
  X,
  Eye,
  Coins,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProofData {
  transactionId: string;
  type: 'purchase' | 'sale' | 'payment' | 'transfer';
  title: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  buyer: {
    name: string;
    document: string;
    email: string;
  };
  seller: {
    name: string;
    document: string;
    email: string;
  };
  credit: {
    title: string;
    type: string;
    originalValue: number;
    tokenId: string;
    blockchain: string;
  };
  blockchain: {
    network: string;
    txHash: string;
    blockNumber: number;
    gasUsed: number;
    confirmations: number;
  };
  fees: {
    platformFee: number;
    blockchainFee: number;
    total: number;
  };
  documents: Array<{
    name: string;
    type: string;
    url: string;
    verified: boolean;
  }>;
  timestamps: {
    created: string;
    processed: string;
    completed: string;
  };
}

interface ProofViewerProps {
  proof: ProofData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProofViewer({ proof, isOpen, onClose }: ProofViewerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'blockchain' | 'documents'>('overview');

  if (!isOpen || !proof) return null;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      default:
        return 'Desconhecido';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'Compra';
      case 'sale':
        return 'Venda';
      case 'payment':
        return 'Pagamento';
      case 'transfer':
        return 'Transferência';
      default:
        return 'Transação';
    }
  };

  const handleDownload = () => {
    toast.success('Baixando comprovante...');
    // Simular download do PDF
  };

  const handleShare = () => {
    toast.success('Link de compartilhamento copiado!');
    // Simular compartilhamento
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewOnBlockchain = () => {
    toast.info(`Abrindo transação no explorador do ${proof.blockchain.network}`);
    // Simular abertura no explorador
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold">Comprovante de Transação</h2>
              <p className="text-sm text-gray-600">ID: {proof.transactionId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Status e Informações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Status da Transação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className={getStatusColor(proof.status)}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {getStatusText(proof.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tipo</span>
                    <span className="font-medium">{getTypeText(proof.type)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data</span>
                    <span className="font-medium">{formatDate(proof.date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Valor</span>
                    <span className="font-bold text-lg text-green-600">
                      {formatCurrency(proof.amount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Detalhes do Título
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Título</p>
                    <p className="font-medium">{proof.credit.title}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tipo</span>
                    <Badge variant="outline">{proof.credit.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Valor Original</span>
                    <span className="font-medium">
                      {formatCurrency(proof.credit.originalValue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Token ID</span>
                    <span className="font-mono text-xs">{proof.credit.tokenId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Blockchain</span>
                    <Badge variant="secondary">{proof.credit.blockchain}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Partes Envolvidas */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Partes Envolvidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Comprador
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="font-medium">{proof.buyer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Documento</p>
                      <p className="font-medium">{proof.buyer.document}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{proof.buyer.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Vendedor
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="font-medium">{proof.seller.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Documento</p>
                      <p className="font-medium">{proof.seller.document}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{proof.seller.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Blockchain */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Informações Blockchain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Rede</p>
                  <p className="font-medium">{proof.blockchain.network}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hash da Transação</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs">{proof.blockchain.txHash}</p>
                    <Button variant="ghost" size="sm" onClick={handleViewOnBlockchain}>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Número do Bloco</p>
                  <p className="font-medium">{proof.blockchain.blockNumber.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confirmações</p>
                  <p className="font-medium">{proof.blockchain.confirmations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Taxas */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Valor do Título</span>
                  <span className="font-medium">{formatCurrency(proof.amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Taxa da Plataforma</span>
                  <span className="font-medium text-orange-600">
                    {formatCurrency(proof.fees.platformFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Taxa Blockchain</span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(proof.fees.blockchainFee)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">{formatCurrency(proof.fees.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentos */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Documentos Anexados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proof.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Histórico da Transação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Transação Concluída</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(proof.timestamps.completed)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Processamento Iniciado</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(proof.timestamps.processed)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div>
                    <p className="font-medium">Transação Criada</p>
                    <p className="text-sm text-gray-600">{formatDate(proof.timestamps.created)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
