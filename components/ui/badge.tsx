import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm px-2 py-0.5 type-tiny font-medium uppercase tracking-wider transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'border border-zinc-200 bg-zinc-100 text-zinc-800',
        secondary: 'border border-transparent bg-zinc-800 text-zinc-100',
        success: 'border border-emerald-200 bg-emerald-50 text-emerald-800',
        warning: 'border border-amber-200 bg-amber-50 text-amber-900',
        destructive: 'border border-rose-200 bg-rose-50 text-rose-800',
        info: 'border border-sky-200 bg-sky-50 text-sky-800',
        outline: 'border border-zinc-300 text-zinc-700 bg-transparent',
        tech: 'border border-zinc-700 bg-zinc-900 text-zinc-200 font-mono tracking-wide',
      },
      size: {
        sm: 'px-1.5 py-0.2',
        md: 'px-2 py-0.5',
        lg: 'px-2.5 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dotColor?: string;
}

export function Badge({ className, variant, size, dotColor, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dotColor && (
        <span
          className={cn('mr-1.5 h-1.5 w-1.5 rounded-full shrink-0', dotColor)}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}
