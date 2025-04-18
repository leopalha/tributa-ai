'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMarketplace } from '@/hooks/useMarketplace';

export function AnunciosList() {
  const { anuncios, isLoading, error } = useMarketplace();

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
          </Card>
        ))
      ) : anuncios?.length > 0 ? (
        anuncios.map(anuncio => (
          <Card key={anuncio.id}>
            <CardHeader>
              <CardTitle>{anuncio.titulo}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{anuncio.descricao}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Nenhum anúncio encontrado</h2>
          <p className="text-gray-600">Tente novamente mais tarde</p>
        </div>
      )}
    </div>
  );
} 