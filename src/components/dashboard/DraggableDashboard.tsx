'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Responsive, WidthProvider, Layouts, Layout } from 'react-grid-layout';
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
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { HELP_MESSAGES } from "@/constants/help-messages";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
}

type CustomLayouts = {
  [P in keyof Layouts]: DashboardItem[];
};

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

const compactLayouts: CustomLayouts = {
  lg: [
    { i: 'stats', x: 0, y: 0, w: 12, h: 1, static: true },
    { i: 'metrics', x: 0, y: 1, w: 12, h: 2 },
    { i: 'chart', x: 0, y: 3, w: 6, h: 4 },
    { i: 'taxChart', x: 6, y: 3, w: 6, h: 4 },
    { i: 'alerts', x: 0, y: 7, w: 6, h: 4 },
    { i: 'table', x: 6, y: 7, w: 6, h: 4 },
    { i: 'automation', x: 0, y: 11, w: 6, h: 4 },
    { i: 'predictive', x: 6, y: 11, w: 6, h: 4 }
  ],
  md: [
    { i: 'stats', x: 0, y: 0, w: 6, h: 2, static: true },
    { i: 'metrics', x: 0, y: 2, w: 6, h: 2 },
    { i: 'chart', x: 0, y: 4, w: 6, h: 4 },
    { i: 'taxChart', x: 0, y: 8, w: 6, h: 4 },
    { i: 'alerts', x: 0, y: 12, w: 6, h: 4 },
    { i: 'table', x: 0, y: 16, w: 6, h: 4 },
    { i: 'automation', x: 0, y: 20, w: 6, h: 4 },
    { i: 'predictive', x: 0, y: 24, w: 6, h: 4 }
  ],
  sm: [
    { i: 'stats', x: 0, y: 0, w: 4, h: 2, static: true },
    { i: 'metrics', x: 0, y: 2, w: 4, h: 2 },
    { i: 'chart', x: 0, y: 4, w: 4, h: 4 },
    { i: 'taxChart', x: 0, y: 8, w: 4, h: 4 },
    { i: 'alerts', x: 0, y: 12, w: 4, h: 4 },
    { i: 'table', x: 0, y: 16, w: 4, h: 4 },
    { i: 'automation', x: 0, y: 20, w: 4, h: 4 },
    { i: 'predictive', x: 0, y: 24, w: 4, h: 4 }
  ]
};

const expandedLayouts: CustomLayouts = {
  lg: compactLayouts.lg.map((item) => ({ ...item, static: false })),
  md: compactLayouts.md.map((item) => ({ ...item, static: false })),
  sm: compactLayouts.sm.map((item) => ({ ...item, static: false }))
};

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
      source: 'Sistema de Gestão Fiscal'
    },
    helpMessage: {
      title: HELP_MESSAGES.DASHBOARD.STATS.PENDING_OBLIGATIONS.title,
      content: HELP_MESSAGES.DASHBOARD.STATS.PENDING_OBLIGATIONS.content
    }
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
      source: 'Sistema de Gestão Fiscal'
    },
    helpMessage: {
      title: HELP_MESSAGES.DASHBOARD.STATS.COMPLETED_OBLIGATIONS.title,
      content: HELP_MESSAGES.DASHBOARD.STATS.COMPLETED_OBLIGATIONS.content
    }
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
      source: 'Análise de Conformidade'
    },
    helpMessage: {
      title: HELP_MESSAGES.DASHBOARD.STATS.COMPLIANCE_RATE.title,
      content: HELP_MESSAGES.DASHBOARD.STATS.COMPLIANCE_RATE.content
    }
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
      source: 'Relatório Financeiro'
    },
    helpMessage: {
      title: HELP_MESSAGES.DASHBOARD.STATS.TAX_SAVINGS.title,
      content: HELP_MESSAGES.DASHBOARD.STATS.TAX_SAVINGS.content
    }
  }
];

export function DraggableDashboard({ children }: DraggableDashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [layouts, setLayouts] = useState<CustomLayouts>(compactLayouts);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg');
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLayouts = localStorage.getItem('dashboardLayouts');
    if (savedLayouts) {
      try {
        const parsed = JSON.parse(savedLayouts);
        // Ensure stats section remains static
        Object.keys(parsed).forEach(breakpoint => {
          const statsItem = parsed[breakpoint].find((item: Layout) => item.i === 'stats');
          if (statsItem) {
            statsItem.static = true;
          }
        });
        setLayouts(parsed);
      } catch (error) {
        console.error('Error loading saved layouts:', error);
        setLayouts(compactLayouts);
      }
    }
  }, []);

  const onLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    if (!isResizing) {
      const updatedLayouts = { ...allLayouts } as CustomLayouts;
      // Ensure stats section remains static across all breakpoints
      Object.keys(updatedLayouts).forEach(breakpoint => {
        const statsItem = updatedLayouts[breakpoint].find(item => item.i === 'stats');
        if (statsItem) {
          statsItem.static = true;
        }
      });
      setLayouts(updatedLayouts);
      localStorage.setItem('dashboardLayouts', JSON.stringify(updatedLayouts));
    }
  };

  const onBreakpointChange = (newBreakpoint: string) => {
    setCurrentBreakpoint(newBreakpoint);
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const onResizeStop = () => {
    setIsResizing(false);
  };

  const restoreLayout = () => {
    setLayouts(compactLayouts);
    localStorage.setItem('dashboardLayouts', JSON.stringify(compactLayouts));
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsLocked(!isLocked)}
            className="flex items-center gap-2"
          >
            {isLocked ? (
              <>
                <Lock className="h-4 w-4" />
                <span>Descongelar Layout</span>
              </>
            ) : (
              <>
                <LockOpen className="h-4 w-4" />
                <span>Congelar Layout</span>
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={restoreLayout}
            className="flex items-center gap-2"
          >
            <span>Restaurar Layout</span>
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
                  <p>• Arraste os containers para reorganizar o layout</p>
                  <p>• Use o botão de congelar/descongelar para fixar o layout</p>
                  <p>• Passe o mouse sobre os ícones ? para mais informações</p>
                  <p>• O layout é salvo automaticamente</p>
                  <p>• Use o botão restaurar para voltar ao layout padrão</p>
                </div>
                <div className="space-y-1 text-sm border-t pt-2">
                  <p className="font-medium">Dicas:</p>
                  <p>• A seção de métricas principais sempre permanece no topo</p>
                  <p>• O layout se adapta automaticamente ao tamanho da tela</p>
                  <p>• Organize os widgets mais importantes primeiro</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="relative">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          cols={{ lg: 12, md: 6, sm: 4 }}
          rowHeight={110}
          isDraggable={!isLocked}
          isResizable={!isLocked}
          onLayoutChange={onLayoutChange}
          onBreakpointChange={onBreakpointChange}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          margin={[20, 20]}
          containerPadding={[10, 10]}
          useCSSTransforms={true}
          compactType="vertical"
          verticalCompact={true}
          preventCollision={false}
        >
          {/* Stats Cards */}
          <div key="stats" className="h-full">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 h-full">
              {statsData.map((stat) => (
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
                  className="h-full"
                />
              ))}
            </div>
          </div>
          <div key="metrics" className="h-full">
            <DashboardMetrics />
          </div>
          <div key="chart" className="h-full">
            <AnalyticsChart />
          </div>
          <div key="taxChart" className="h-full">
            <TaxObligationsChart />
          </div>
          <div key="alerts" className="h-full">
            <AlertsNotifications />
          </div>
          <div key="table" className="h-full">
            <ObrigacoesTable />
          </div>
          <div key="automation" className="h-full">
            <ProcessAutomation />
          </div>
          <div key="predictive" className="h-full">
            <PredictiveAnalysis />
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  );
} 