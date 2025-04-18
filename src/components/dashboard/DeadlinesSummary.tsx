import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Building2, AlertTriangleIcon } from "lucide-react";
import { addDays, format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Deadline {
  id: string;
  title: string;
  date: Date;
  empresa: string;
  tipo: 'federal' | 'estadual' | 'municipal';
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'pendente' | 'em_andamento' | 'atrasado';
}

const mockDeadlines: Deadline[] = [
  {
    id: '1',
    title: 'DCTF',
    date: addDays(new Date(), 2),
    empresa: 'Tech Solutions LTDA',
    tipo: 'federal',
    prioridade: 'alta',
    status: 'pendente'
  },
  {
    id: '2',
    title: 'GIA-ST',
    date: addDays(new Date(), -1),
    empresa: 'Comércio Digital S.A.',
    tipo: 'estadual',
    prioridade: 'alta',
    status: 'atrasado'
  },
  {
    id: '3',
    title: 'ISS',
    date: addDays(new Date(), 5),
    empresa: 'Serviços Online LTDA',
    tipo: 'municipal',
    prioridade: 'media',
    status: 'em_andamento'
  },
  {
    id: '4',
    title: 'EFD-Reinf',
    date: addDays(new Date(), 7),
    empresa: 'Tech Solutions LTDA',
    tipo: 'federal',
    prioridade: 'media',
    status: 'pendente'
  },
  {
    id: '5',
    title: 'PGDAS-D',
    date: addDays(new Date(), 10),
    empresa: 'Micro Empresa ME',
    tipo: 'federal',
    prioridade: 'baixa',
    status: 'pendente'
  }
];

const getPrioridadeColor = (prioridade: Deadline['prioridade']) => {
  switch (prioridade) {
    case 'alta':
      return 'bg-red-100 text-red-800';
    case 'media':
      return 'bg-yellow-100 text-yellow-800';
    case 'baixa':
      return 'bg-green-100 text-green-800';
  }
};

const getStatusColor = (status: Deadline['status']) => {
  switch (status) {
    case 'pendente':
      return 'text-yellow-500';
    case 'em_andamento':
      return 'text-blue-500';
    case 'atrasado':
      return 'text-red-500';
  }
};

const getStatusIcon = (status: Deadline['status']) => {
  switch (status) {
    case 'pendente':
      return <Clock className="h-4 w-4" />;
    case 'em_andamento':
      return <Calendar className="h-4 w-4" />;
    case 'atrasado':
      return <AlertTriangleIcon className="h-4 w-4" />;
  }
};

const getTipoColor = (tipo: Deadline['tipo']) => {
  switch (tipo) {
    case 'federal':
      return 'bg-blue-100 text-blue-800';
    case 'estadual':
      return 'bg-green-100 text-green-800';
    case 'municipal':
      return 'bg-purple-100 text-purple-800';
  }
};

export function DeadlinesSummary() {
  const sortedDeadlines = [...mockDeadlines].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Próximos Vencimentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {sortedDeadlines.map((deadline) => {
              const daysUntil = differenceInDays(deadline.date, new Date());
              const isOverdue = daysUntil < 0;

              return (
                <div
                  key={deadline.id}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/5 transition-colors"
                >
                  <div className={`p-2 rounded-full ${getStatusColor(deadline.status)}`}>
                    {getStatusIcon(deadline.status)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{deadline.title}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>{deadline.empresa}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline">
                          {format(deadline.date, "dd 'de' MMMM", { locale: ptBR })}
                        </Badge>
                        <span className={`text-sm ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {isOverdue
                            ? `${Math.abs(daysUntil)} dias atrás`
                            : `em ${daysUntil} dias`}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Badge className={getTipoColor(deadline.tipo)}>
                        {deadline.tipo}
                      </Badge>
                      <Badge className={getPrioridadeColor(deadline.prioridade)}>
                        {deadline.prioridade}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 