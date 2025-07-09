import React from 'react';
import { cn } from '@/lib/utils';
import Link from '@/components/ui/custom-link';

interface LogoProps {
  className?: string;
  href?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'muted';
}

export function Logo({ className, href = '/', size = 'md', variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const variantClasses = {
    default: 'bg-gradient-to-r from-primary to-indigo-500',
    muted: 'bg-gradient-to-r from-muted-foreground to-muted-foreground/70',
  };

  const content = (
    <span
      className={cn(
        'font-heading font-bold tracking-tight bg-clip-text text-transparent',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      Tribut.AI
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
