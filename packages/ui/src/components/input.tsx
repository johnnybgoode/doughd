import * as React from 'react';

import { cn } from '@repo/ui/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border bg-transparent px-2.5 py-1 shadow-xs transition-[color,box-shadow] file:font-medium focus-visible:ring-3 aria-invalid:ring-3 placeholder:text-muted-foreground outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      use: {
        default:
          'h-9 file:h-7 w-full min-w-0 text-base file:text-sm md:text-sm file:text-foreground ',
        transparent: '',
      },
    },
    defaultVariants: {
      use: 'default',
    },
  },
);

function Input({
  className,
  type,
  use = 'default',
  ...props
}: React.ComponentProps<'input'> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ use }), className)}
      {...props}
    />
  );
}

export { Input };
