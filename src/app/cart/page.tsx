"use client";

import React from 'react';
import { Cart } from '@/components/marketplace/Cart';

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrinho de compras</h1>
      <Cart />
    </div>
  );
} 