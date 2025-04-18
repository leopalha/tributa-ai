"use client";

import React, { useState } from 'react';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Barcode, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Cart() {
  const { carrinho, loading, error, updateCarrinhoItem, removeFromCarrinho, clearCarrinho, createPedido } = useMarketplace();
  const [metodoPagamento, setMetodoPagamento] = useState<'cartao' | 'pix' | 'boleto'>('cartao');
  const [enderecoEntrega, setEnderecoEntrega] = useState({
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
  });

  const valorTotal = carrinho.reduce((total, item) => total + (item.item.preco * item.quantidade), 0);

  const handleUpdateQuantity = async (itemId: string, quantidade: number) => {
    try {
      await updateCarrinhoItem(itemId, quantidade);
    } catch (error) {
      // Show error toast
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCarrinho(itemId);
    } catch (error) {
      // Show error toast
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCarrinho();
    } catch (error) {
      // Show error toast
    }
  };

  const handleCheckout = async () => {
    try {
      await createPedido({
        itens: carrinho.map(item => ({
          itemId: item.item.id,
          quantidade: item.quantidade,
        })),
        enderecoEntrega,
        metodoPagamento,
      });
      // Show success toast and redirect to orders page
    } catch (error) {
      // Show error toast
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Erro</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleClearCart}>Limpar carrinho</Button>
        </CardContent>
      </Card>
    );
  }

  if (carrinho.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Carrinho vazio</CardTitle>
          <CardDescription>Adicione itens ao seu carrinho para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => window.location.href = '/marketplace'}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Ir para o marketplace
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Carrinho de compras</CardTitle>
          <CardDescription>{carrinho.length} itens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {carrinho.map(item => (
            <div key={item.item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <img
                src={item.item.imagens[0]?.url || '/placeholder.png'}
                alt={item.item.imagens[0]?.alt || item.item.nome}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.item.nome}</h3>
                <p className="text-sm text-gray-500">{item.item.categoria}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.item.id, Math.max(1, item.quantidade - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => handleUpdateQuantity(item.item.id, parseInt(e.target.value))}
                      className="w-16 text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.item.id, item.quantidade + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold">R$ {(item.item.preco * item.quantidade).toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={handleClearCart}>
            Limpar carrinho
          </Button>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">R$ {valorTotal.toFixed(2)}</p>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações de entrega</CardTitle>
          <CardDescription>Preencha os dados para entrega</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Logradouro"
              value={enderecoEntrega.logradouro}
              onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, logradouro: e.target.value })}
            />
            <Input
              placeholder="Número"
              value={enderecoEntrega.numero}
              onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, numero: e.target.value })}
            />
            <Input
              placeholder="Complemento"
              value={enderecoEntrega.complemento}
              onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, complemento: e.target.value })}
            />
            <Input
              placeholder="Bairro"
              value={enderecoEntrega.bairro}
              onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, bairro: e.target.value })}
            />
            <Input
              placeholder="Cidade"
              value={enderecoEntrega.cidade}
              onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, cidade: e.target.value })}
            />
            <Input
              placeholder="Estado"
              value={enderecoEntrega.estado}
              onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, estado: e.target.value })}
            />
            <Input
              placeholder="CEP"
              value={enderecoEntrega.cep}
              onChange={(e) => setEnderecoEntrega({ ...enderecoEntrega, cep: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Método de pagamento</CardTitle>
          <CardDescription>Escolha como deseja pagar</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={metodoPagamento} onValueChange={(value) => setMetodoPagamento(value as 'cartao' | 'pix' | 'boleto')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o método de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cartao">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Cartão de crédito
                </div>
              </SelectItem>
              <SelectItem value="pix">
                <div className="flex items-center">
                  <QrCode className="mr-2 h-4 w-4" />
                  PIX
                </div>
              </SelectItem>
              <SelectItem value="boleto">
                <div className="flex items-center">
                  <Barcode className="mr-2 h-4 w-4" />
                  Boleto bancário
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleCheckout}>
            Finalizar compra
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 