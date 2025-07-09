import React from 'react';
import { Tag, Info } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PlatformFeeProps {
  value: number;
  showInfo?: boolean;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export function PlatformFee({
  value,
  showInfo = true,
  variant = 'default',
  className = '',
}: PlatformFeeProps) {
  // Taxa fixa de 2.5%
  const feePercentage = 0.025;
  const feeAmount = value * feePercentage;

  if (variant === 'compact') {
    return (
      <div className={`text-sm text-muted-foreground flex items-center gap-1 ${className}`}>
        <span>Taxa (2.5%):</span>
        <span className="font-medium">{formatCurrency(feeAmount)}</span>
        {showInfo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Taxa de 2.5% cobrada pela plataforma Tributa.AI em todas as operações.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={`text-sm text-muted-foreground ${className}`}>
        + {formatCurrency(feeAmount)} (taxa 2.5%)
        {showInfo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help inline ml-1 -mt-0.5" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Taxa de 2.5% cobrada pela plataforma Tributa.AI em todas as operações.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </span>
    );
  }

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-blue-600" />
        <span className="text-sm">Taxa da Plataforma (2.5%)</span>
        {showInfo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Taxa de 2.5% cobrada pela plataforma Tributa.AI em todas as operações.
                  Esta taxa é utilizada para manutenção da plataforma e desenvolvimento de novas funcionalidades.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <span className="text-sm font-medium">{formatCurrency(feeAmount)}</span>
    </div>
  );
} 