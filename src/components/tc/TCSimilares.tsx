import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { CreditTitle } from '@prisma/client'; // Usar tipo Prisma
import Link from '@/components/ui/custom-link';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SimilarTC
  extends Pick<CreditTitle, 'id' | 'title' | 'category' | 'subtype' | 'status' | 'value'> {
  distance: number;
}

interface TCSimilaresProps {
  tcId: string;
  limit?: number;
}

export function TCSimilares({ tcId, limit = 3 }: TCSimilaresProps) {
  const [similares, setSimilares] = useState<SimilarTC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tcId) return;
    setLoading(true);
    setError(null);

    api
      .get<SimilarTC[]>(`/api/search/similar?tcId=${tcId}&limit=${limit}`)
      .then(data => setSimilares(data))
      .catch(err => {
        console.error('Erro ao buscar TCs similares:', err);
        setError('Falha ao carregar TCs similares.');
      })
      .finally(() => setLoading(false));
  }, [tcId, limit]);

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
        Nenhum TC similar encontrado.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {similares.map(tc => (
        <Link key={tc.id} href={`/tc/${tc.id}`} className="block group">
          <Card className="hover:border-primary/50 transition-colors duration-200 bg-muted/20">
            <CardContent className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm truncate group-hover:text-primary">
                  {tc.title || `TC ${tc.id}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tc.category} / {tc.subtype} - {formatCurrency(tc.value || 0)}
                  <Badge variant="outline" className="ml-2 text-xs">
                    Distância: {tc.distance.toFixed(4)}
                  </Badge>
                </p>
              </div>
              {/* Status? */}
              <Badge
                variant={tc.status === 'VALIDATED' ? 'success' : 'secondary'}
                className="text-xs"
              >
                {tc.status}
              </Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
