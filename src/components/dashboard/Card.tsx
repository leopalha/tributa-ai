import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';

const cardVariants = cva('rounded-lg border p-4 flex items-start gap-4', {
  variants: {
    variant: {
      default: 'bg-[hsl(var(--card))]',
      success: 'bg-green-50 border-green-100',
      destructive: 'bg-red-50 border-red-100',
      warning: 'bg-yellow-50 border-yellow-100',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface CardProps extends VariantProps<typeof cardVariants> {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  className?: string;
}

export function Card({ title, value, description, icon: Icon, variant, className }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)}>
      <div className="p-2 rounded-md bg-white/50">
        <Icon className="w-4 h-4" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p className="text-xs text-[hsl(var(--muted-foreground))]">{description}</p>
        )}
      </div>
    </div>
  );
}
