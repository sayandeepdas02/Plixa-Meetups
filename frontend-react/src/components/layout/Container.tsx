import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  width?: 'default' | 'narrow' | 'wide' | 'full';
}

export function Container({ 
  children, 
  width = 'default',
  className,
  ...props 
}: ContainerProps) {
  const widths = {
    default: 'max-w-6xl',
    narrow: 'max-w-4xl',
    wide: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div 
      className={cn(
        'mx-auto px-6 md:px-8 w-full',
        widths[width],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
