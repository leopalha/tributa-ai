"use client";

import React from 'react';
import { MarketplaceStats } from '@/components/marketplace/MarketplaceStats';
import { useMarketplace } from '@/hooks/useMarketplace';
import { AnunciosList } from '@/components/marketplace/AnunciosList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function MarketplacePage() {
  const { estatisticas, isLoading, error } = useMarketplace();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Anúncio
        </Button>
      </div>

      <MarketplaceStats 
        estatisticas={estatisticas!}
        isLoading={isLoading}
        error={error}
      />

      <AnunciosList />
    </div>
  );
} 