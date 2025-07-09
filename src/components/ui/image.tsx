import React from 'react';
import Image from '@/components/ui/custom-image';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackAlt?: string;
}

/**
 * Enhanced image component that ensures alt text is always provided
 * Fallbacks to the image filename or a default text if no alt is provided
 */
export function SafeImage({
  src,
  alt,
  fallbackAlt = 'Imagem da plataforma Tributa.AI',
  className,
  ...props
}: ImageProps) {
  // If alt is provided, use it. Otherwise use fallback
  const safeAlt = alt || fallbackAlt;

  // For local images, if no alt is provided try to extract filename
  let derivedAlt = safeAlt;
  if (!alt && typeof src === 'string' && src.startsWith('/')) {
    const filename = src.split('/').pop()?.split('.')[0];
    if (filename) {
      derivedAlt = filename.replace(/-|_/g, ' ');
    }
  }

  return <img src={src} alt={derivedAlt} className={cn(className)} {...props} />;
}

/**
 * Enhanced NextImage component that ensures alt text is always provided
 */
export function SafeNextImage({
  src,
  alt,
  fallbackAlt = 'Imagem da plataforma Tributa.AI',
  className,
  ...props
}: any) {
  // If alt is provided, use it. Otherwise use fallback
  const safeAlt = alt || fallbackAlt;

  return <Image src={src} alt={safeAlt} className={cn(className)} {...props} />;
}
