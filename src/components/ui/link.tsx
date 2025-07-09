import React, { forwardRef } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

export interface LinkProps extends Omit<RouterLinkProps, 'to'> {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  prefetch?: boolean;
  [x: string]: any;
}

// Componente Link UI que funciona com React Router
const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, className, prefetch, target, rel, ...props }, ref) => {
    // Se for um link externo, use uma tag <a> normal
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return (
        <a href={href} className={className} target={target} rel={rel} ref={ref} {...props}>
          {children}
        </a>
      );
    }

    // Para links internos, use React Router Link
    return (
      <RouterLink to={href} className={className} ref={ref} {...props}>
        {children}
      </RouterLink>
    );
  }
);

Link.displayName = 'Link';

export default Link;
