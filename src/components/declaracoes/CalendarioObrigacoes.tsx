import { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  parseISO,
  addDays,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangleIcon,
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { declaracaoService } from '@/services/declaracao.service';
import { ObrigacaoFiscal } from '@/types/declaracao';

const CalendarioObrigacoes = () => {
  const [obrigacoes, setObrigacoes] = useState<ObrigacaoFiscal[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroEmpresa, setFiltroEmpresa] = useState<string>('todos');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarObrigacoes();
  }, [currentDate, filtroTipo, filtroStatus, filtroEmpresa]);

  const carregarObrigacoes = async () => {
    try {
      setLoading(true);
      const inicio = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const fim = format(endOfMonth(currentDate), 'yyyy-MM-dd');

      const response = await declaracaoService.listarObrigacoes({
        periodoInicio: inicio,
        periodoFim: fim,
        ...(filtroTipo !== 'todos' && { tipo: filtroTipo as any }),
        ...(filtroStatus !== 'todos' && { status: filtroStatus as any }),
        ...(filtroEmpresa !== 'todos' && { empresaId: filtroEmpresa }),
      });

      setObrigacoes(response.items);
    } catch (error) {
      console.error('Erro ao carregar obrigações:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getObrigacoesForDate = (date: Date) => {
    return obrigacoes.filter(
      obrigacao =>
        format(parseISO(obrigacao.dataVencimento), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getDayClasses = (date: Date, obrigacoes: ObrigacaoFiscal[]) => {
    return cn(
      'min-h-[6rem] p-2 border border-gray-200 relative group hover:bg-gray-50 transition-colors cursor-pointer',
      {
        'bg-gray-50': !isSameMonth(date, currentDate),
        'bg-blue-50': isToday(date),
        'border-blue-300':
          selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'),
        'border-l-4 border-l-yellow-400': obrigacoes.some(o => o.status === 'declaracao_pendente'),
        'border-l-4 border-l-red-400': obrigacoes.some(o => o.status === 'declaracao_atrasada'),
      }
    );
  };

  const getStatusIcon = (status: ObrigacaoFiscal['status']) => {
    switch (status) {
      case 'declaracao_pendente':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'declaracao_concluida':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'declaracao_atrasada':
        return <AlertTriangleIcon className="w-4 h-4 text-red-500" />;
      case 'declaracao_cancelada':
        return <HelpCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTipoColor = (tipo: ObrigacaoFiscal['tipo']) => {
    switch (tipo) {
      case 'ICMS':
        return 'bg-blue-100 text-blue-800';
      case 'IPI':
        return 'bg-green-100 text-green-800';
      case 'PIS':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <div className="relative">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </button>
            {showHelp && (
              <div className="absolute left-0 top-full mt-2 w-72 p-3 bg-white border rounded-lg shadow-lg z-50 text-sm">
                <h4 className="font-semibold mb-2">Como usar o calendário:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Clique em um dia para ver detalhes das obrigações</li>
                  <li>• Passe o mouse sobre uma obrigação para ver mais informações</li>
                  <li>• Borda amarela indica dias com obrigações pendentes</li>
                  <li>• Borda vermelha indica dias com obrigações vencidas</li>
                  <li>• Use as setas para navegar entre os meses</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="bg-gray-50 py-2 text-center text-sm font-semibold">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {daysInMonth.map(date => {
          const dayObrigacoes = getObrigacoesForDate(date);
          return (
            <div
              key={date.toString()}
              className={getDayClasses(date, dayObrigacoes)}
              onClick={() => setSelectedDate(date)}
            >
              <span className={cn('text-sm font-medium', isToday(date) && 'text-blue-600')}>
                {format(date, 'd')}
              </span>
              <div className="mt-1 space-y-1">
                {dayObrigacoes.map(obrigacao => (
                  <div key={obrigacao.id} className="group relative">
                    <div className="flex items-center gap-1 text-xs">
                      {getStatusIcon(obrigacao.status)}
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded-full text-xs font-medium truncate max-w-[100px]',
                          getTipoColor(obrigacao.tipo)
                        )}
                      >
                        {obrigacao.titulo}
                      </span>
                    </div>

                    {/* Tooltip melhorado */}
                    <div className="absolute left-full top-0 z-10 w-72 p-3 bg-white border rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{obrigacao.titulo}</h4>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            getTipoColor(obrigacao.tipo)
                          )}
                        >
                          {obrigacao.tipo}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{obrigacao.descricao}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Valor:</span> {obrigacao.moeda}{' '}
                          {obrigacao.valor.toFixed(2)}
                        </p>
                        {obrigacao.juros && (
                          <p className="text-sm">
                            <span className="font-medium">Juros:</span> {obrigacao.moeda}{' '}
                            {obrigacao.juros.toFixed(2)}
                          </p>
                        )}
                        {obrigacao.multa && (
                          <p className="text-sm">
                            <span className="font-medium">Multa:</span> {obrigacao.moeda}{' '}
                            {obrigacao.multa.toFixed(2)}
                          </p>
                        )}
                        {obrigacao.total && (
                          <p className="text-sm">
                            <span className="font-medium">Total:</span> {obrigacao.moeda}{' '}
                            {obrigacao.total.toFixed(2)}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          {getStatusIcon(obrigacao.status)}
                          <span className="text-sm capitalize">
                            {obrigacao.status.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 text-sm border-t pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span>Pendente</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Pago</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangleIcon className="h-4 w-4 text-red-500" />
            <span>Vencido</span>
          </div>
          <div className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4 text-gray-500" />
            <span>Cancelado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarioObrigacoes;
