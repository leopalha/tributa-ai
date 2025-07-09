import { ArrowDown, ArrowUp, Building2, FileText, Users } from 'lucide-react';

interface Metric {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

export function DashboardMetrics() {
  const metrics: Metric[] = [
    {
      title: 'Empresas Ativas',
      value: '48',
      change: 12,
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      title: 'Declarações Pendentes',
      value: '7',
      change: -3,
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: 'Total de Funcionários',
      value: '1,234',
      change: 8,
      icon: <Users className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="rounded-lg border bg-[hsl(var(--card))] text-card-foreground shadow-sm p-6"
        >
          <div className="flex items-center justify-between space-y-0">
            <h3 className="tracking-tight text-sm font-medium">{metric.title}</h3>
            {metric.icon}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-2xl font-bold">{metric.value}</div>
            <div
              className={`flex items-center space-x-1 text-sm ${
                metric.change > 0 ? 'text-success' : 'text-error'
              }`}
            >
              {metric.change > 0 ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span>{Math.abs(metric.change)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
