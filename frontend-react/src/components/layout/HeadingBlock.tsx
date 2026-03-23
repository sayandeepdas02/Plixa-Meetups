import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
}

export function HeadingBlock({ 
  badge, 
  title, 
  subtitle, 
  align = 'left',
  className,
  ...props 
}: HeadingBlockProps) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto'
  };

  return (
    <div 
      className={cn(
        'flex flex-col gap-4 mb-12 sm:mb-16 max-w-2xl',
        alignClasses[align],
        className
      )}
      {...props}
    >
      {badge && (
        <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-widest backdrop-blur-sm">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl tracking-tighter text-foreground font-medium">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed balance-text">
          {subtitle}
        </p>
      )}
    </div>
  );
}
