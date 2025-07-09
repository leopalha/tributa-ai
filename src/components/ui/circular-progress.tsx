import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number; // Diameter in pixels
  strokeWidth?: number; // Stroke width in pixels
  color?: string; // Tailwind color class for the progress ring
  trackColor?: string; // Tailwind color class for the track ring
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 100,
  strokeWidth = 10,
  color = 'text-primary',
  trackColor = 'text-muted',
  className,
  ...props // Coleta quaisquer outras props HTML passadas
}: CircularProgressProps) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn('transform -rotate-90', className)}
      {...props} // Espalha as props coletadas aqui
    >
      <circle
        className={cn('transition-colors', trackColor)} // Classe para a cor da trilha
        strokeWidth={strokeWidth}
        stroke="currentColor" // Usa a cor do texto definida pelas classes Tailwind
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className={cn('transition-all duration-300 ease-in-out', color)} // Classe para a cor do progresso
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor" // Usa a cor do texto definida pelas classes Tailwind
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
};

CircularProgress.displayName = 'CircularProgress';
