import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  title: string;
  tipo: 'nfe' | 'nfse' | 'cte' | 'mdfe' | 'nfce';
  status: 'processado' | 'pendente' | 'erro';
  data: Date;
  empresa: string;
  valor: number;
  numero: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Nota Fiscal Eletrônica',
    tipo: 'nfe',
    status: 'processado',
    data: new Date(),
    empresa: 'Tech Solutions LTDA',
    valor: 15750.5,
    numero: '000123456',
  },
  {
    id: '2',
    title: 'Nota Fiscal de Serviço',
    tipo: 'nfse',
    status: 'pendente',
    data: new Date(),
    empresa: 'Serviços Online LTDA',
    valor: 8500.0,
    numero: '000000789',
  },
  {
    id: '3',
    title: 'Conhecimento de Transporte',
    tipo: 'cte',
    status: 'erro',
    data: new Date(),
    empresa: 'Transportes Rápidos LTDA',
    valor: 2350.75,
    numero: '000012345',
  },
  {
    id: '4',
    title: 'Manifesto Eletrônico',
    tipo: 'mdfe',
    status: 'processado',
    data: new Date(),
    empresa: 'Logística Express S.A.',
    valor: 4500.0,
    numero: '000000456',
  },
  {
    id: '5',
    title: 'Nota Fiscal Consumidor',
    tipo: 'nfce',
    status: 'processado',
    data: new Date(),
    empresa: 'Comércio Digital S.A.',
    valor: 750.25,
    numero: '000789123',
  },
];

const getTipoColor = (tipo: Document['tipo']) => {
  switch (tipo) {
    case 'nfe':
      return 'bg-blue-100 text-blue-800';
    case 'nfse':
      return 'bg-green-100 text-green-800';
    case 'cte':
      return 'bg-purple-100 text-purple-800';
    case 'mdfe':
      return 'bg-orange-100 text-orange-800';
    case 'nfce':
      return 'bg-pink-100 text-pink-800';
  }
};

const getStatusIcon = (status: Document['status']) => {
  switch (status) {
    case 'processado':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'pendente':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'erro':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
  }
};

const formatDocumentNumber = (numero: string) => {
  return numero.padStart(9, '0').replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
};

export function DocumentsSummary() {
  const sortedDocuments = [...mockDocuments].sort((a, b) => b.data.getTime() - a.data.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documentos Fiscais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {sortedDocuments.map(doc => (
              <div
                key={doc.id}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-[hsl(var(--accent))]/5 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{doc.title}</h4>
                        {getStatusIcon(doc.status)}
                      </div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">{doc.empresa}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline">Nº {formatDocumentNumber(doc.numero)}</Badge>
                      <span className="text-sm font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(doc.valor)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge className={getTipoColor(doc.tipo)}>{doc.tipo.toUpperCase()}</Badge>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        {format(doc.data, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
