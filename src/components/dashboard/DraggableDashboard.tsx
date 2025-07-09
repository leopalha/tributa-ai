import { ReactNode, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, LockOpen, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StatsCard } from './stats/StatsCard';
import { AnalyticsChart } from './charts/AnalyticsChart';
import { ObrigacoesTable } from './tables/ObrigacoesTable';
import { DashboardMetrics } from './DashboardMetrics';
import { AlertsNotifications } from './AlertsNotifications';
import { PredictiveAnalysis } from './PredictiveAnalysis';
import { ProcessAutomation } from '../automation/ProcessAutomation';
import { TaxObligationsChart } from './TaxObligationsChart';
import { HELP_MESSAGES } from '@/constants/help-messages';
import { Skeleton } from '@/components/ui/skeleton';

interface DraggableDashboardProps {
  children?: ReactNode;
}

interface StatsDataItem {
  id: string;
  title: string;
  value: number | string;
  description: string;
  trend: {
    value: number;
    isPositive: boolean;
  };
  info?: string;
  previousValue?: string;
  changePercentage?: number;
  metadata?: {
    lastUpdated?: string;
    frequency?: string;
    source?: string;
  };
  helpMessage: {
    title: string;
    content: string;
  };
}

const statsData: StatsDataItem[] = [
  {
    id: 'stats1',
    title: 'Obrigações Pendentes',
    value: '12',
    description: 'Próximos 30 dias',
    trend: { value: 10, isPositive: false },
    info: 'Total de obrigações fiscais que precisam ser cumpridas nos próximos 30 dias.',
    previousValue: '8',
    changePercentage: 50,
    metadata: {
      lastUpdated: new Date().toLocaleString('pt-BR'),
      frequency: 'Atualização diária',
      source: 'Sistema de Gestão Fiscal',
    },
    helpMessage: {
      title: HELP_MESSAGES.DASHBOARD.STATS.PENDING_OBLIGATIONS.title,
      content: HELP_MESSAGES.DASHBOARD.STATS.PENDING_OBLIGATIONS.content,
    },
  },
  {
    id: 'stats2',
    title: 'Obrigações Concluídas',
    value: '45',
    description: 'Este mês',
    trend: { value: 15, isPositive: true },
    info: 'Número total de obrigações fiscais concluídas no mês atual.',
    previousValue: '38',
    changePercentage: 18.4,
    metadata: {
      lastUpdated: new Date().toLocaleString('pt-BR'),
      frequency: 'Atualização em tempo real',
      source: 'Sistema de Gestão Fiscal',
    },
    helpMessage: {
      title: HELP_MESSAGES.DASHBOARD.STATS.COMPLETED_OBLIGATIONS.title,
      content: HELP_MESSAGES.DASHBOARD.STATS.COMPLETED_OBLIGATIONS.content,
    },
  },
  {
    id: 'stats3',
    title: 'Taxa de Conformidade',
    value: '98%',
    description: 'Últimos 12 meses',
    trend: { value: 2, isPositive: true },
    info: 'Percentual de obrigações fiscais entregues dentro do prazo nos últimos 12 meses.',
    previousValue: '96%',
    changePercentage: 2.1,
    metadata: {
      lastUpdated: new Date().toLocaleString('pt-BR'),
      frequency: 'Atualização mensal',
      source: 'Análise de Conformidade',
    },
    helpMessage: {
      title: HELP_MESSAGES.DASHBOARD.STATS.COMPLIANCE_RATE.title,
      content: HELP_MESSAGES.DASHBOARD.STATS.COMPLIANCE_RATE.content,
    },
  },
  {
    id: 'stats4',
    title: 'Economia Fiscal',
    value: 'R$ 50K',
    description: 'Este ano',
    trend: { value: 8, isPositive: true },
    info: 'Valor total economizado através de planejamento tributário e otimização fiscal.',
    previousValue: 'R$ 42K',
    changePercentage: 19,
    metadata: {
      lastUpdated: new Date().toLocaleString('pt-BR'),
      frequency: 'Atualização trimestral',
      source: 'Relatório Financeiro',
    },
    helpMessage: {
      title: HELP_MESSAGES.DASHBOARD.STATS.TAX_SAVINGS.title,
      content: HELP_MESSAGES.DASHBOARD.STATS.TAX_SAVINGS.content,
    },
  },
];

export function DraggableDashboard({ children }: DraggableDashboardProps) {
  const [isCompact, setIsCompact] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState({
    metrics: false,
    charts: false,
    tables: false,
  });

  // Controle de renderização progressiva
  useEffect(() => {
    // Primeira fase: montar o componente
    setMounted(true);

    // Segunda fase: carregar componentes progressivamente
    const timer1 = setTimeout(() => {
      setComponentsLoaded(prev => ({ ...prev, metrics: true }));
    }, 100);

    const timer2 = setTimeout(() => {
      setComponentsLoaded(prev => ({ ...prev, charts: true }));
    }, 300);

    const timer3 = setTimeout(() => {
      setComponentsLoaded(prev => ({ ...prev, tables: true }));
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Renderização de componente não montado
  if (!mounted) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        <div className="dashboard-grid">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsCompact(!isCompact)}
            className="flex items-center gap-2"
          >
            {isCompact ? (
              <>
                <Lock className="h-4 w-4" />
                <span>Layout Compacto</span>
              </>
            ) : (
              <>
                <LockOpen className="h-4 w-4" />
                <span>Layout Expandido</span>
              </>
            )}
          </Button>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="w-80 p-4" side="left">
              <div className="space-y-3">
                <h3 className="font-semibold">Como usar o Dashboard</h3>
                <div className="space-y-1 text-sm">
                  <p>• Visualize todas as métricas importantes em um único lugar</p>
                  <p>• Passe o mouse sobre os ícones ? para mais informações</p>
                  <p>• Use o botão de layout para alternar entre visualizações</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        {statsData.map(stat => (
          <StatsCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            trend={stat.trend}
            info={stat.info}
            previousValue={stat.previousValue}
            changePercentage={stat.changePercentage}
            metadata={stat.metadata}
            helpMessage={stat.helpMessage}
            className="dashboard-card"
          />
        ))}
      </div>

      {/* Dashboard widgets com carregamento progressivo */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Primeira fase de carregamento */}
        <div className="dashboard-card">
          {componentsLoaded.metrics ? <DashboardMetrics /> : <Skeleton className="h-80 w-full" />}
        </div>

        {/* Segunda fase de carregamento */}
        {componentsLoaded.charts ? (
          <>
            <div className="dashboard-card">
              <AnalyticsChart />
            </div>

            <div className="dashboard-card">
              <TaxObligationsChart />
            </div>

            <div className="dashboard-card">
              <AlertsNotifications />
            </div>
          </>
        ) : (
          <>
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
          </>
        )}

        {/* Terceira fase de carregamento */}
        {componentsLoaded.tables ? (
          <>
            <div className="dashboard-card">
              <ObrigacoesTable />
            </div>

            <div className="dashboard-card">
              <ProcessAutomation />
            </div>

            <div className="dashboard-card md:col-span-2">
              <PredictiveAnalysis />
            </div>
          </>
        ) : (
          <>
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg md:col-span-2" />
          </>
        )}
      </div>
    </div>
  );
}
