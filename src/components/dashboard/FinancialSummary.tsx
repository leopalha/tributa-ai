import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ArrowDown, ArrowUp, DollarSign, Receipt, PiggyBank, TrendingUp } from 'lucide-react';

interface FinancialMetric {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  description: string;
}

export function FinancialSummary() {
  const metrics: FinancialMetric[] = [
    {
      title: 'Impostos a Pagar',
      value: 125000.5,
      change: 8.5,
      icon: <DollarSign className="h-5 w-5 text-[hsl(var(--primary))]" />,
      description: 'Total de impostos pendentes para o próximo mês',
    },
    {
      title: 'Economia Fiscal',
      value: 45000.75,
      change: 12.3,
      icon: <PiggyBank className="h-5 w-5 text-green-500" />,
      description: 'Economia obtida através de planejamento tributário',
    },
    {
      title: 'Créditos Fiscais',
      value: 78500.25,
      change: -5.2,
      icon: <Receipt className="h-5 w-5 text-blue-500" />,
      description: 'Total de créditos fiscais disponíveis',
    },
    {
      title: 'Projeção Mensal',
      value: 180000.0,
      change: 15.7,
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
      description: 'Projeção de impostos para o próximo período',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo Financeiro</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="rounded-lg border bg-[hsl(var(--card))] p-4 hover:bg-[hsl(var(--accent))]/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                {metric.icon}
                <h3 className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                  {metric.title}
                </h3>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-bold">{formatCurrency(metric.value)}</div>
                <div className="flex items-center gap-1 mt-1">
                  <div
                    className={`flex items-center text-sm ${
                      metric.change > 0 ? 'text-success' : 'text-[hsl(var(--destructive))]'
                    }`}
                  >
                    {metric.change > 0 ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    vs. último mês
                  </span>
                </div>
              </div>

              <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
