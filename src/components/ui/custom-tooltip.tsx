import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Info } from 'lucide-react';
import { ReactNode } from 'react';

interface CustomTooltipProps {
  title?: string;
  content: string | ReactNode;
  icon?: 'help' | 'info';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  iconSize?: number;
  children?: ReactNode;
}

export function CustomTooltip({
  title,
  content,
  icon = 'help',
  side = 'right',
  className = '',
  iconSize = 16,
  children,
}: CustomTooltipProps) {
  const IconComponent = icon === 'help' ? HelpCircle : Info;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children || (
            <IconComponent
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors cursor-help"
              size={iconSize}
            />
          )}
        </TooltipTrigger>
        <TooltipContent side={side} className={`max-w-[320px] p-4 space-y-2 ${className}`}>
          {title && <h4 className="font-semibold text-sm">{title}</h4>}
          <div className="text-sm text-[hsl(var(--muted-foreground))]">{content}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
