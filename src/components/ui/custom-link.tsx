import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CustomLinkProps extends Omit<RouterLinkProps, 'to'> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const Link: React.FC<CustomLinkProps> = ({ href, children, className, ...props }) => {
  return (
    <RouterLink to={href} className={cn(className)} {...props}>
      {children}
    </RouterLink>
  );
};

export default Link;
