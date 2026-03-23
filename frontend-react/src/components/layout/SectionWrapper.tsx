import React from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'default' | 'muted' | 'dark' | 'glass';
}

export function SectionWrapper({ 
  children, 
  variant = 'default',
  className,
  ...props 
}: SectionWrapperProps) {
  const variants = {
    default: 'bg-background text-foreground',
    muted: 'bg-muted/50 dark:bg-muted/30 text-foreground border-y border-border/40',
    dark: 'bg-[#0b0f19] text-slate-50 selection:bg-blue-900/40',
    glass: 'bg-white/40 dark:bg-card/40 backdrop-blur-3xl border-y border-white/20 dark:border-border/20 shadow-[0_0_40px_-10px_rgba(0,0,0,0.05)] text-foreground'
  };

  return (
    <section 
      className={cn(
        'py-24 lg:py-32 w-full relative z-10 overflow-hidden',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
