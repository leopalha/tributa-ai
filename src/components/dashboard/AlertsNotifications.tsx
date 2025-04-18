'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangleIcon, CheckCircle2, Clock, Info, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'error' | 'info' | 'success';
  priority: 'alta' | 'media' | 'baixa';
  status: 'novo' | 'visto' | 'resolvido';
  date: Date;
  dueDate?: Date;
  empresa?: string;
  actions?: string[];
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Prazo DCTF se aproximando',
    description: 'A declaração DCTF da empresa Tech Solutions LTDA vence em 3 dias',
    type: 'warning',
    priority: 'alta',
    status: 'novo',
    date: new Date(),
    dueDate: addDays(new Date(), 3),
    empresa: 'Tech Solutions LTDA',
    actions: [
      'Verificar documentação pendente',
      'Validar informações',
      'Preparar envio'
    ]
  },
  {
    id: '2',
    title: 'Inconsistência em NFe',
    description: 'Detectada divergência entre valores declarados e documentos fiscais',
    type: 'error',
    priority: 'alta',
    status: 'novo',
    date: subDays(new Date(), 1),
    empresa: 'Comércio Digital S.A.',
    actions: [
      'Analisar divergências',
      'Corrigir registros',
      'Reprocessar declaração'
    ]
  },
  {
    id: '3',
    title: 'Nova Legislação Publicada',
    description: 'Atualização na legislação do ICMS afeta operações interestaduais',
    type: 'info',
    priority: 'media',
    status: 'visto',
    date: subDays(new Date(), 2),
    actions: [
      'Revisar procedimentos',
      'Atualizar documentação',
      'Treinar equipe'
    ]
  },
  {
    id: '4',
    title: 'Certificado Digital',
    description: 'Certificado digital da empresa Serviços Online LTDA expira em 15 dias',
    type: 'warning',
    priority: 'media',
    status: 'novo',
    date: subDays(new Date(), 3),
    dueDate: addDays(new Date(), 15),
    empresa: 'Serviços Online LTDA',
    actions: [
      'Solicitar renovação',
      'Verificar documentação necessária',
      'Agendar validação presencial'
    ]
  },
  {
    id: '5',
    title: 'Processamento Concluído',
    description: 'EFD Contribuições processada e validada com sucesso',
    type: 'success',
    priority: 'baixa',
    status: 'resolvido',
    date: subDays(new Date(), 4),
    empresa: 'Tech Solutions LTDA'
  }
];

const getTypeIcon = (type: Alert['type']) => {
  switch (type) {
    case 'warning':
      return <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <AlertTriangleIcon className="h-4 w-4 text-red-500" />;
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'success':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  }
};

const getTypeColor = (type: Alert['type']) => {
  switch (type) {
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    case 'info':
      return 'bg-blue-100 text-blue-800';
    case 'success':
      return 'bg-green-100 text-green-800';
  }
};

const getPriorityColor = (priority: Alert['priority']) => {
  switch (priority) {
    case 'alta':
      return 'bg-red-100 text-red-800';
    case 'media':
      return 'bg-yellow-100 text-yellow-800';
    case 'baixa':
      return 'bg-green-100 text-green-800';
  }
};

const getStatusColor = (status: Alert['status']) => {
  switch (status) {
    case 'novo':
      return 'bg-blue-100 text-blue-800';
    case 'visto':
      return 'bg-yellow-100 text-yellow-800';
    case 'resolvido':
      return 'bg-green-100 text-green-800';
  }
};

export function AlertsNotifications() {
  const sortedAlerts = [...mockAlerts].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alertas e Notificações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {sortedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg border p-4 hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(alert.type)}
                      <h4 className="font-medium">{alert.title}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getTypeColor(alert.type)}>
                        {alert.type}
                      </Badge>
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority}
                      </Badge>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(alert.date, "dd 'de' MMMM", { locale: ptBR })}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {alert.description}
                </p>

                {alert.empresa && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span className="font-medium">Empresa:</span>
                    <span>{alert.empresa}</span>
                  </div>
                )}

                {alert.dueDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>Vencimento: {format(alert.dueDate, "dd 'de' MMMM", { locale: ptBR })}</span>
                  </div>
                )}

                {alert.actions && (
                  <div className="mt-3 space-y-2">
                    <h5 className="text-sm font-medium">Ações Recomendadas:</h5>
                    <div className="grid gap-2">
                      {alert.actions.map((action, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Clock className="h-4 w-4" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 