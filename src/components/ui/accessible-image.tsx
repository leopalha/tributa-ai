import React from 'react';
import { cn } from '@/lib/utils';
import Image from '@/components/ui/custom-image';

interface AccessibleImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Componente `Image` que força o `alt` e usa `next/image` se `width` e `height` forem fornecidos.
 * Se `width` e `height` não forem fornecidos, usa `<img>` nativo (pode causar avisos no lint do Next.js).
 */
export const AccessibleImage: React.FC<AccessibleImageProps> = ({
  alt,
  src,
  width,
  height,
  className,
  ...props
}) => {
  if (width && height && src) {
    // Usar next/image se dimensões forem fornecidas
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(className)}
        {...(props as any)} // Cast para any para passar props restantes
      />
    );
  } else {
    // Fallback para img nativo se dimensões não forem fornecidas
    // Adicionar eslint-disable para evitar aviso do Next.js
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={cn(className)} {...props} />;
  }
};

AccessibleImage.displayName = 'AccessibleImage';
