import React from 'react';
import { cn } from '@/lib/utils';

interface CustomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export const Image: React.FC<CustomImageProps> = ({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  quality,
  placeholder,
  blurDataURL,
  ...props
}) => {
  const imageStyle: React.CSSProperties = {
    width: fill ? '100%' : width,
    height: fill ? '100%' : height,
    objectFit: fill ? 'cover' : undefined,
  };

  return (
    <img
      src={src}
      alt={alt}
      style={imageStyle}
      className={cn(fill && 'absolute inset-0', className)}
      {...props}
    />
  );
};

export default Image;
