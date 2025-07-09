import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface BlockchainMetricProps {
  title: string;
  value: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  isLoading?: boolean;
  className?: string;
}

export function BlockchainMetric({
  title,
  value,
  icon,
  trend,
  trendValue,
  isLoading = false,
  className,
}: BlockchainMetricProps) {
  return (
    <Card className={cn('border-0 shadow-none', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon}
        </div>
        <div className="mt-1">
          {isLoading ? (
            <Skeleton className="h-7 w-24" />
          ) : (
            <div className="flex items-baseline">
              <h3 className="text-2xl font-semibold">{value}</h3>
              {trend && trendValue && (
                <span
                  className={cn(
                    'ml-2 text-xs font-medium',
                    trend === 'up' && 'text-emerald-500',
                    trend === 'down' && 'text-red-500',
                    trend === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  <span className="flex items-center">
                    {trend === 'up' ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : trend === 'down' ? (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    ) : null}
                    {trendValue}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
