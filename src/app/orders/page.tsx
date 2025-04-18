"use client";

import React from 'react';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, CreditCard, Barcode, QrCode, Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  const { pedidos, loading, error, fetchPedidos } = useMarketplace();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meus pedidos</h1>
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-32" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meus pedidos</h1>
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

  if (pedidos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meus pedidos</h1>
        <Card>
          <CardHeader>
            <CardTitle>Nenhum pedido encontrado</CardTitle>
            <CardDescription>Você ainda não fez nenhum pedido</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/marketplace'}>
              Ir para o marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Meus pedidos</h1>
      <div className="grid gap-6">
        {pedidos.map(pedido => (
          <Card key={pedido.id}>
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
            <CardFooter>
              <Button variant="outline" className="w-full">
                Detalhes do pedido
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 