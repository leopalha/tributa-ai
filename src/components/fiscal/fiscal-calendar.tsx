import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  DollarSign,
  Filter,
  Download,
  Plus,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  isBefore,
  isAfter,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FiscalObligation {
  id: string;
  title: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  dueDate: Date;
  taxName?: string;
  description?: string;
}

interface FiscalCalendarProps {
  obligations: FiscalObligation[];
}

interface CalendarEvent {
  id: string;
  title: string;
  type: 'obligation' | 'deadline' | 'reminder' | 'holiday';
  status: 'pending' | 'completed' | 'overdue' | 'upcoming';
  date: Date;
  amount?: number;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export function FiscalCalendar({ obligations }: FiscalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Converter obrigações em eventos de calendário
  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    const events: CalendarEvent[] = [];

    obligations.forEach(obligation => {
      const dueDate = new Date(obligation.dueDate);
      const now = new Date();

      let status: CalendarEvent['status'] = 'pending';
      let priority: CalendarEvent['priority'] = 'medium';

      if (obligation.status === 'PAID') {
        status = 'completed';
      } else if (isBefore(dueDate, now)) {
        status = 'overdue';
        priority = 'critical';
      } else if (isBefore(dueDate, new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000))) {
        status = 'upcoming';
        priority = 'high';
      }

      events.push({
        id: obligation.id,
        title: obligation.title,
        type: 'obligation',
        status,
        date: dueDate,
        amount: obligation.amount,
        description: obligation.description,
        priority,
      });
    });

    // Adicionar feriados fiscais importantes
    const currentYear = currentDate.getFullYear();
    const fiscalHolidays = [
      { date: new Date(currentYear, 3, 30), title: 'Prazo IRPF', type: 'deadline' as const },
      { date: new Date(currentYear, 4, 31), title: 'DCTF Mensal', type: 'deadline' as const },
      { date: new Date(currentYear, 6, 31), title: 'DEFIS', type: 'deadline' as const },
      {
        date: new Date(currentYear, 11, 31),
        title: 'Fim do Ano Fiscal',
        type: 'deadline' as const,
      },
    ];

    fiscalHolidays.forEach((holiday, index) => {
      events.push({
        id: `holiday-${index}`,
        title: holiday.title,
        type: holiday.type,
        status: 'upcoming',
        date: holiday.date,
        priority: 'medium',
      });
    });

    return events;
  }, [obligations, currentDate]);

  // Filtrar eventos
  const filteredEvents = useMemo(() => {
    return calendarEvents.filter(event => {
      if (filterStatus !== 'all' && event.status !== filterStatus) return false;
      if (filterType !== 'all' && event.type !== filterType) return false;
      return true;
    });
  }, [calendarEvents, filterStatus, filterType]);

  // Obter eventos para uma data específica
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => isSameDay(event.date, date));
  };

  // Obter dias do mês atual
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Navegação do calendário
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Obter cor do evento baseado no status
  const getEventColor = (event: CalendarEvent) => {
    switch (event.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Obter ícone do evento
  const getEventIcon = (event: CalendarEvent) => {
    switch (event.type) {
      case 'obligation':
        return <FileText className="h-3 w-3" />;
      case 'deadline':
        return <Clock className="h-3 w-3" />;
      case 'reminder':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <CalendarIcon className="h-3 w-3" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            Calendário Fiscal
          </h2>
          <p className="text-muted-foreground">
            Visualize prazos e obrigações fiscais organizados por data
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>

          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Obrigação
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="overdue">Vencido</SelectItem>
                <SelectItem value="upcoming">Próximo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="obligation">Obrigações</SelectItem>
                <SelectItem value="deadline">Prazos</SelectItem>
                <SelectItem value="reminder">Lembretes</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={goToToday}>
              Hoje
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-xl font-semibold">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </h3>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1" />
                {filteredEvents.filter(e => e.status === 'completed').length} Concluídas
              </Badge>
              <Badge variant="outline" className="bg-yellow-50">
                <Clock className="h-3 w-3 mr-1" />
                {filteredEvents.filter(e => e.status === 'upcoming').length} Próximas
              </Badge>
              <Badge variant="outline" className="bg-red-50">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {filteredEvents.filter(e => e.status === 'overdue').length} Vencidas
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {viewMode === 'month' && (
            <div className="grid grid-cols-7 gap-1">
              {/* Header dos dias da semana */}
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}

              {/* Dias do mês */}
              {monthDays.map(day => {
                const dayEvents = getEventsForDate(day);
                const isCurrentDay = isToday(day);

                return (
                  <Dialog key={day.toISOString()}>
                    <DialogTrigger asChild>
                      <div
                        className={`
                          min-h-[100px] p-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors
                          ${isCurrentDay ? 'bg-primary/10 border-primary' : 'border-border'}
                          ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                        `}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span
                            className={`text-sm font-medium ${isCurrentDay ? 'text-primary' : ''}`}
                          >
                            {format(day, 'd')}
                          </span>
                          {dayEvents.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {dayEvents.length}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded border ${getEventColor(event)}`}
                            >
                              <div className="flex items-center gap-1">
                                {getEventIcon(event)}
                                <span className="truncate">{event.title}</span>
                              </div>
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents.length - 2} mais
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogTrigger>

                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          {format(day, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </DialogTitle>
                        <DialogDescription>
                          {dayEvents.length} evento(s) nesta data
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-3">
                        {dayEvents.length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">
                            Nenhum evento nesta data
                          </p>
                        ) : (
                          dayEvents.map(event => (
                            <div key={event.id} className="p-3 border rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {getEventIcon(event)}
                                  <h4 className="font-medium">{event.title}</h4>
                                </div>
                                <Badge
                                  variant={event.status === 'overdue' ? 'destructive' : 'secondary'}
                                >
                                  {event.status}
                                </Badge>
                              </div>

                              {event.description && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {event.description}
                                </p>
                              )}

                              {event.amount && (
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="h-3 w-3" />
                                  <span className="font-medium">
                                    {formatCurrency(event.amount)}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          )}

          {viewMode === 'agenda' && (
            <div className="space-y-4">
              {filteredEvents
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map(event => (
                  <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex flex-col items-center text-center min-w-[60px]">
                      <span className="text-lg font-bold">{format(event.date, 'd')}</span>
                      <span className="text-xs text-muted-foreground uppercase">
                        {format(event.date, 'MMM', { locale: ptBR })}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getEventIcon(event)}
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant={event.status === 'overdue' ? 'destructive' : 'secondary'}>
                          {event.status}
                        </Badge>
                      </div>

                      {event.description && (
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                    </div>

                    {event.amount && (
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(event.amount)}</div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
