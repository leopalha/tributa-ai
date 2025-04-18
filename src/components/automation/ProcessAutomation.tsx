'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, Play, Pause, AlertTriangleIcon, CheckCircle2, Clock, RotateCw } from "lucide-react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HELP_MESSAGES } from "@/constants/help-messages";
import { CustomTooltip } from "@/components/ui/custom-tooltip";

interface AutomatedProcess {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'paused' | 'error' | 'completed' | 'scheduled';
  progress: number;
  lastRun?: Date;
  nextRun?: Date;
  type: 'import' | 'export' | 'validation' | 'processing' | 'backup';
  empresa?: string;
}

const mockProcesses: AutomatedProcess[] = [
  {
    id: '1',
    name: 'Importação de NFe',
    description: 'Importação automática de notas fiscais eletrônicas do webservice da SEFAZ',
    status: 'running',
    progress: 65,
    lastRun: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    type: 'import',
    empresa: 'Tech Solutions LTDA'
  },
  {
    id: '2',
    name: 'Validação de XMLs',
    description: 'Validação de documentos fiscais e verificação de inconsistências',
    status: 'completed',
    progress: 100,
    lastRun: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
    type: 'validation',
    empresa: 'Comércio Digital S.A.'
  },
  {
    id: '3',
    name: 'Backup de Dados',
    description: 'Backup automático dos dados fiscais para armazenamento seguro',
    status: 'scheduled',
    progress: 0,
    nextRun: new Date(Date.now() + 1000 * 60 * 60 * 2), // Em 2 horas
    type: 'backup'
  },
  {
    id: '4',
    name: 'Processamento SPED',
    description: 'Geração e validação do arquivo SPED Fiscal',
    status: 'error',
    progress: 45,
    lastRun: new Date(Date.now() - 1000 * 60 * 45), // 45 minutos atrás
    type: 'processing',
    empresa: 'Indústria ABC LTDA'
  },
  {
    id: '5',
    name: 'Exportação EFD',
    description: 'Exportação dos registros para EFD Contribuições',
    status: 'paused',
    progress: 80,
    lastRun: new Date(Date.now() - 1000 * 60 * 90), // 90 minutos atrás
    type: 'export',
    empresa: 'Serviços Online LTDA'
  }
];

const getStatusColor = (status: AutomatedProcess['status']) => {
  switch (status) {
    case 'running':
      return 'bg-blue-100 text-blue-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'scheduled':
      return 'bg-purple-100 text-purple-800';
  }
};

const getStatusIcon = (status: AutomatedProcess['status']) => {
  switch (status) {
    case 'running':
      return <Play className="h-4 w-4 text-blue-500" />;
    case 'paused':
      return <Pause className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <AlertTriangleIcon className="h-4 w-4 text-red-500" />;
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'scheduled':
      return <Clock className="h-4 w-4 text-purple-500" />;
  }
};

const getTypeColor = (type: AutomatedProcess['type']) => {
  switch (type) {
    case 'import':
      return 'bg-indigo-100 text-indigo-800';
    case 'export':
      return 'bg-pink-100 text-pink-800';
    case 'validation':
      return 'bg-teal-100 text-teal-800';
    case 'processing':
      return 'bg-orange-100 text-orange-800';
    case 'backup':
      return 'bg-gray-100 text-gray-800';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'agora';
  if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d atrás`;
};

const formatTimeUntil = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'em breve';
  if (diffInMinutes < 60) return `em ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `em ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `em ${diffInDays}d`;
};

export function ProcessAutomation() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-medium">Automação de Processos</CardTitle>
          <CustomTooltip
            title={HELP_MESSAGES.AUTOMATION.PROCESS.title}
            content={HELP_MESSAGES.AUTOMATION.PROCESS.content}
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          <span>Configurar</span>
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {mockProcesses.map((process) => (
              <div
                key={process.id}
                className="rounded-lg border bg-card p-4 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">{process.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {process.description}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(process.status)}`}
                  >
                    {process.status}
                  </Badge>
                </div>

                {process.status === 'running' && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span>{process.progress}%</span>
                    </div>
                    <Progress value={process.progress} className="h-2" />
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    {process.lastRun && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Última execução: {formatTimeAgo(process.lastRun)}</span>
                      </div>
                    )}
                    {process.nextRun && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Próxima execução: {formatTimeUntil(process.nextRun)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {process.status === 'running' ? (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
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