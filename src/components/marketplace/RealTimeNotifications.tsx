import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Gavel,
  ShoppingCart,
  MessageSquare,
  FileText,
  X,
  Eye,
  Download,
  ExternalLink,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface RealTimeNotification {
  id: string;
  type: 'purchase' | 'sale' | 'bid' | 'offer' | 'message' | 'system' | 'payment' | 'proof';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  data: {
    creditId?: string;
    creditTitle?: string;
    amount?: number;
    buyerName?: string;
    sellerName?: string;
    transactionId?: string;
    proofUrl?: string;
    proofType?: 'receipt' | 'contract' | 'certificate' | 'blockchain';
    status?: string;
    blockchainTx?: string;
    tokenId?: string;
  };
  actions?: {
    label: string;
    action: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
}

interface RealTimeNotificationsProps {
  onNotificationClick?: (notification: RealTimeNotification) => void;
}

export function RealTimeNotifications({ onNotificationClick }: RealTimeNotificationsProps) {
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Simular notificações em tempo real
    const generateNotification = () => {
      const notificationTypes = [
        {
          type: 'purchase' as const,
          title: 'Compra Concluída',
          description: 'Você adquiriu ICMS - Exportação Agronegócio por R$ 765.000',
          priority: 'high' as const,
          data: {
            creditId: 'credit_1',
            creditTitle: 'ICMS - Exportação Agronegócio Tokenizado',
            amount: 765000,
            sellerName: 'AgroExport Brasil Ltda',
            transactionId: 'TXN_20240115_001',
            proofUrl: '/proof/TXN_20240115_001.pdf',
            proofType: 'receipt' as const,
            status: 'completed',
            blockchainTx: '0x1234567890abcdef',
            tokenId: 'ERC-721-001',
          },
        },
        {
          type: 'sale' as const,
          title: 'Venda Realizada',
          description: 'Seu título Precatório foi vendido por R$ 960.000',
          priority: 'high' as const,
          data: {
            creditId: 'credit_2',
            creditTitle: 'Precatório Judicial Tokenizado TJSP',
            amount: 960000,
            buyerName: 'Investimentos Premium SA',
            transactionId: 'SALE_20240115_002',
            proofUrl: '/proof/SALE_20240115_002.pdf',
            proofType: 'contract' as const,
            status: 'completed',
            blockchainTx: '0xabcdef1234567890',
            tokenId: 'ERC-721-002',
          },
        },
        {
          type: 'bid' as const,
          title: 'Novo Lance Recebido',
          description: 'Você recebeu um lance de R$ 380.000 no leilão PIS/COFINS',
          priority: 'medium' as const,
          data: {
            creditId: 'credit_3',
            creditTitle: 'PIS/COFINS - Indústria Química Tokenizada',
            amount: 380000,
            buyerName: 'Química Industrial SP',
            transactionId: 'BID_20240115_003',
          },
        },
        {
          type: 'proof' as const,
          title: 'Comprovante Disponível',
          description: 'Comprovante de transação gerado e disponível para download',
          priority: 'medium' as const,
          data: {
            creditId: 'credit_4',
            creditTitle: 'IPI - Manufatura Eletrônicos Tokenizado',
            amount: 288000,
            transactionId: 'TXN_20240115_004',
            proofUrl: '/proof/TXN_20240115_004.pdf',
            proofType: 'certificate' as const,
            status: 'ready',
          },
        },
      ];

      const randomNotification =
        notificationTypes[Math.floor(Math.random() * notificationTypes.length)];

      const newNotification: RealTimeNotification = {
        id: `notification_${Date.now()}`,
        ...randomNotification,
        timestamp: new Date(),
        read: false,
        actions: [
          {
            label: 'Ver Detalhes',
            action: () => handleViewDetails(randomNotification.data.transactionId || ''),
          },
          ...(randomNotification.data.proofUrl
            ? [
                {
                  label: 'Baixar Comprovante',
                  action: () => handleDownloadProof(randomNotification.data.proofUrl || ''),
                  variant: 'outline' as const,
                },
              ]
            : []),
          ...(randomNotification.data.blockchainTx
            ? [
                {
                  label: 'Ver na Blockchain',
                  action: () => handleViewBlockchain(randomNotification.data.blockchainTx || ''),
                  variant: 'outline' as const,
                },
              ]
            : []),
        ],
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);

      // Mostrar toast
      toast.success(newNotification.title, {
        description: newNotification.description,
        action: {
          label: 'Ver',
          onClick: () => setShowNotifications(true),
        },
      });
    };

    // Gerar notificação inicial
    generateNotification();

    // Simular notificações periódicas
    const interval = setInterval(generateNotification, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart className="w-5 h-5 text-green-600" />;
      case 'sale':
        return <DollarSign className="w-5 h-5 text-blue-600" />;
      case 'bid':
        return <Gavel className="w-5 h-5 text-purple-600" />;
      case 'offer':
        return <MessageSquare className="w-5 h-5 text-orange-600" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
      case 'system':
        return <Bell className="w-5 h-5 text-indigo-600" />;
      case 'payment':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'proof':
        return <FileText className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getProofTypeIcon = (proofType: string) => {
    switch (proofType) {
      case 'receipt':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'contract':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'certificate':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'blockchain':
        return <ExternalLink className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleViewDetails = (transactionId: string) => {
    toast.info(`Visualizando detalhes da transação: ${transactionId}`);
  };

  const handleDownloadProof = (proofUrl: string) => {
    // Simular download do comprovante
    const link = document.createElement('a');
    link.href = proofUrl;
    link.download = `comprovante_${Date.now()}.pdf`;
    link.click();
    toast.success('Comprovante baixado com sucesso!');
  };

  const handleViewBlockchain = (txHash: string) => {
    // Abrir explorador da blockchain
    window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
    toast.info('Abrindo explorador da blockchain...');
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  };

  const handleNotificationClick = (notification: RealTimeNotification) => {
    handleMarkAsRead(notification.id);
    onNotificationClick?.(notification);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Botão de notificações */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Painel de notificações */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-96 max-h-96 overflow-y-auto bg-white border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notificações</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Nenhuma notificação</div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-l-4 cursor-pointer hover:bg-gray-50 ${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.description}</p>

                      {/* Informações adicionais */}
                      {notification.data.amount && (
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(notification.data.amount)}
                          </span>
                        </div>
                      )}

                      {notification.data.proofType && (
                        <div className="flex items-center gap-2 mb-2">
                          {getProofTypeIcon(notification.data.proofType)}
                          <span className="text-xs text-gray-500">Comprovante disponível</span>
                        </div>
                      )}

                      {notification.data.tokenId && (
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-gray-500">
                            Token: {notification.data.tokenId}
                          </span>
                        </div>
                      )}

                      {/* Ações */}
                      {notification.actions && notification.actions.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {notification.actions.map((action, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant={action.variant || 'default'}
                              onClick={e => {
                                e.stopPropagation();
                                action.action();
                              }}
                              className="text-xs"
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
