import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onCheckedChange, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = (node: HTMLInputElement) => {
      internalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const handleClick = () => {
      if (internalRef.current) {
        const newChecked = !internalRef.current.checked;
        if (onCheckedChange) {
          onCheckedChange(newChecked);
        }
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <div
          className={cn(
            'h-4 w-4 shrink-0 rounded-sm border border-[hsl(var(--primary))] ring-offset-[hsl(var(--background))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 relative',
            checked && 'bg-[hsl(var(--primary))] text-[hsl(var(--primary))]-foreground',
            className
          )}
          onClick={handleClick}
        >
          {checked && (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-current absolute top-0 left-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
          <input
            type="checkbox"
            ref={combinedRef}
            className="sr-only"
            checked={checked}
            onChange={e => onCheckedChange?.(e.target.checked)}
            {...props}
          />
        </div>
        {label && <label className="text-sm">{label}</label>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
