import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight, Clock, DollarSign, Percent } from 'lucide-react';
import { useRouter } from '@/lib/router-utils';

interface TituloCardProps {
  titulo: {
    id: string;
    nome: string;
    valor: number;
    taxaJuros: number;
    dataVencimento: string;
    status: 'disponivel' | 'reservado' | 'vendido';
    tokenId: string;
    emissor: {
      id: string;
      nome: string;
      rating: string;
    };
  };
}

export function TituloCard({ titulo }: TituloCardProps) {
  const router = useRouter();

  const statusColors = {
    disponivel: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
    reservado: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-200',
    vendido: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  };

  const statusLabels = {
    disponivel: 'Disponível',
    reservado: 'Reservado',
    vendido: 'Vendido',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{titulo.nome}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Emitido por {titulo.emissor.nome}</p>
          </div>
          <Badge variant="secondary" className={statusColors[titulo.status]}>
            {statusLabels[titulo.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-1" />
                Valor
              </div>
              <p className="font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(titulo.valor)}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Percent className="h-4 w-4 mr-1" />
                Taxa de Juros
              </div>
              <p className="font-medium">{titulo.taxaJuros.toFixed(2)}% a.a.</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Vencimento
            </div>
            <p className="font-medium">
              {format(new Date(titulo.dataVencimento), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </p>
          </div>

          <div className="pt-4">
            <Button className="w-full" onClick={() => router.push(`/marketplace/${titulo.id}`)}>
              Ver Detalhes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
