import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TituloCreditoUnion, StatusTC } from '@/types/titulo-credito';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/lib/router-utils';
import { formatCurrency } from '@/lib/utils';

interface TituloListProps {
  titulos: TituloCreditoUnion[];
}

const statusColors: Record<StatusTC, string> = {
  disponivel: 'bg-green-500',
  reservado: 'bg-yellow-500',
  vendido: 'bg-gray-500',
  tokenizado: 'bg-blue-500',
  compensado: 'bg-purple-500',
  vencido: 'bg-red-500',
  cancelado: 'bg-gray-400',
};

const statusLabels: Record<StatusTC, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  vendido: 'Vendido',
  tokenizado: 'Tokenizado',
  compensado: 'Compensado',
  vencido: 'Vencido',
  cancelado: 'Cancelado',
};

const tipoLabels = {
  tributario: 'Tributário',
  comercial: 'Comercial',
  financeiro: 'Financeiro',
  judicial: 'Judicial',
  rural: 'Rural',
  imobiliario: 'Imobiliário',
  ambiental: 'Ambiental',
  especial: 'Especial',
};

export function TituloList({ titulos }: TituloListProps) {
  const router = useRouter();

  // Garantir que titulos seja sempre um array
  const titulosArray = Array.isArray(titulos) ? titulos : [];

  if (titulosArray.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Nenhum título encontrado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {titulosArray.map(titulo => (
        <Card key={titulo.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-2">{titulo.nome}</h3>
                <p className="text-sm text-muted-foreground mt-1">Emissor: {titulo.emissor.nome}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {tipoLabels[titulo.tipo]}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {titulo.subtipo}
                  </Badge>
                </div>
              </div>
              <Badge className={`${statusColors[titulo.status]} text-white ml-2`}>
                {statusLabels[titulo.status]}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor Nominal</span>
                <span className="font-medium">{formatCurrency(titulo.valorNominal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor Atual</span>
                <span className="font-medium">{formatCurrency(titulo.valorAtual)}</span>
              </div>
              {titulo.taxaJuros && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Taxa de Juros</span>
                  <span className="font-medium">{titulo.taxaJuros}% a.a.</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vencimento</span>
                <span className="font-medium">
                  {format(new Date(titulo.dataVencimento), 'dd/MM/yyyy', {
                    locale: ptBR,
                  })}
                </span>
              </div>
              {titulo.validado && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                    ✓ Validado
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/marketplace/${titulo.id}`)}
                className="flex-1"
              >
                Ver Detalhes
              </Button>
              {titulo.status === 'disponivel' && <Button className="flex-1">Negociar</Button>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
