import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { AnuncioDaLista } from './AnunciosList'; // Reutilizar tipo?
import Link from '@/components/ui/custom-link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SimilarAnuncio extends Omit<AnuncioDaLista, 'distance'> {
  // Omitir 'distance' do tipo base se existir
  distance: number; // Adicionar distância retornada pela API
}

interface AnunciosSimilaresProps {
  anuncioId: string;
  limit?: number;
}

export function AnunciosSimilares({ anuncioId, limit = 3 }: AnunciosSimilaresProps) {
  const [similares, setSimilares] = useState<SimilarAnuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!anuncioId) return;
    setLoading(true);
    setError(null);

    api
      .get<SimilarAnuncio[]>(`/api/search/similar?anuncioId=${anuncioId}&limit=${limit}`)
      .then(data => setSimilares(data))
      .catch(err => {
        console.error('Erro ao buscar anúncios similares:', err);
        setError('Falha ao carregar anúncios similares.');
      })
      .finally(() => setLoading(false));
  }, [anuncioId, limit]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <Loader2 className="h-5 w-5 animate-spin inline-block" /> Carregando similares...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive text-sm py-4">
        <AlertCircle className="inline h-4 w-4 mr-1" /> {error}
      </div>
    );
  }

  if (similares.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Nenhum anúncio similar encontrado.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {similares.map(anuncio => (
        <Link key={anuncio.id} href={`/marketplace/anuncios/${anuncio.id}`} className="block group">
          <Card className="hover:border-primary/50 transition-colors duration-200 bg-muted/20">
            <CardContent className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm truncate group-hover:text-primary">
                  {anuncio.description || `Anúncio ${anuncio.id}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Preço: {formatCurrency(anuncio.askingPrice || 0)}
                  <Badge variant="outline" className="ml-2 text-xs">
                    Distância: {anuncio.distance.toFixed(4)}
                  </Badge>
                </p>
              </div>
              {/* Poderia adicionar imagem do TC aqui se tivesse */}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
