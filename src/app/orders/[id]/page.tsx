"use client";

import React from 'react';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, CreditCard, Barcode, QrCode, Calendar, MapPin, ArrowLeft, Truck, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { pedidos, loading, error, fetchPedidos } = useMarketplace();
  const pedido = pedidos.find(p => p.id === id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="ml-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Erro</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchPedidos}>Tentar novamente</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Pedido não encontrado</CardTitle>
            <CardDescription>O pedido solicitado não existe ou não está disponível</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/orders'}>
              Voltar para meus pedidos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Pedido #{pedido.id.slice(0, 8)}</CardTitle>
                <CardDescription>
                  <div className="flex items-center mt-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(pedido.createdAt).toLocaleDateString()}
                  </div>
                </CardDescription>
              </div>
              <Badge
                className={cn(
                  "ml-2",
                  pedido.status === 'pendente' && "bg-yellow-500",
                  pedido.status === 'pago' && "bg-blue-500",
                  pedido.status === 'entregue' && "bg-green-500",
                  pedido.status === 'cancelado' && "bg-red-500"
                )}
              >
                {pedido.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                <span>{pedido.itens.length} itens</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>
                  {pedido.enderecoEntrega?.logradouro}, {pedido.enderecoEntrega?.numero}
                  {pedido.enderecoEntrega?.complemento && ` - ${pedido.enderecoEntrega.complemento}`}
                  <br />
                  {pedido.enderecoEntrega?.bairro}, {pedido.enderecoEntrega?.cidade} - {pedido.enderecoEntrega?.estado}
                  <br />
                  CEP: {pedido.enderecoEntrega?.cep}
                </span>
              </div>
              <div className="flex items-center">
                {pedido.metodoPagamento === 'cartao' && <CreditCard className="h-4 w-4 mr-2" />}
                {pedido.metodoPagamento === 'pix' && <QrCode className="h-4 w-4 mr-2" />}
                {pedido.metodoPagamento === 'boleto' && <Barcode className="h-4 w-4 mr-2" />}
                <span className="capitalize">{pedido.metodoPagamento}</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold">R$ {pedido.valorTotal.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Itens do pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pedido.itens.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                    {item.item.imagens?.[0] ? (
                      <img
                        src={item.item.imagens[0]}
                        alt={item.item.nome}
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-medium">{item.item.nome}</p>
                    <p className="text-sm text-gray-500">Quantidade: {item.quantidade}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {(item.item.preco * item.quantidade).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">R$ {item.item.preco.toFixed(2)} cada</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div className="ml-4">
                  <p className="font-medium">Pedido realizado</p>
                  <p className="text-sm text-gray-500">
                    {new Date(pedido.createdAt).toLocaleDateString()} às {new Date(pedido.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {pedido.status === 'pago' && (
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Pagamento confirmado</p>
                    <p className="text-sm text-gray-500">Aguardando envio</p>
                  </div>
                </div>
              )}

              {pedido.status === 'entregue' && (
                <>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Pedido enviado</p>
                      <p className="text-sm text-gray-500">Em trânsito</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Pedido entregue</p>
                      <p className="text-sm text-gray-500">Entrega concluída</p>
                    </div>
                  </div>
                </>
              )}

              {pedido.status === 'cancelado' && (
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                    <XCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Pedido cancelado</p>
                    <p className="text-sm text-gray-500">Cancelamento realizado</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 