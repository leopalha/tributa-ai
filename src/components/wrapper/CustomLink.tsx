import Link from '@/components/ui/custom-link';
import React from 'react';

// Este componente encapsula o Link do Next.js e adiciona o legacyBehavior
// para compatibilidade com ambas as estruturas (pages e app)
const CustomLink = ({ href, children, className, ...props }) => {
  if (typeof children === 'string' || React.isValidElement(children) || Array.isArray(children)) {
    return (
      <Link href={href} {...props} legacyBehavior>
        <a className={className}>{children}</a>
      </Link>
    );
  }

  // Se o children não for string ou elemento React, apenas passa diretamente
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
};

export default CustomLink;
