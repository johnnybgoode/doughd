import type {
  ElementType,
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
} from 'react';
import { cn } from '@repo/ui/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

type HeadingProps = PropsWithChildren<{
  className?: string;
  level: '1' | '2' | '3' | '4';
}>;

export function Heading({ children, className, level }: HeadingProps) {
  const Tag: ElementType<HTMLAttributes<HTMLHeadingElement>> = `h${level}`;
  const classes = {
    '1': 'scroll-m-20 text-center text-4xl font-extrabold text-balance',
    '2': 'scroll-m-20 text-3xl font-semibold first:mt-0 tracking-tight',
    '3': 'scroll-m-20 text-2xl font-semibold',
    '4': 'scroll-m-20 text-xl font-semibold',
  };

  return <Tag className={cn(className, classes[level])}>{children}</Tag>;
}

export function P({ children }: PropsWithChildren) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}

export function Blockquote({ children }: PropsWithChildren) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  );
}

const listVariants = cva('my-6 ml-6 [&>li]:mt-2', {
  variants: {
    type: {
      bullet: 'list-disc',
      number: 'list-decimal',
      none: 'list-none',
    },
  },
  defaultVariants: {
    type: 'none',
  },
});

type ListProps = { className?: string; items: ReactElement[] } & VariantProps<
  typeof listVariants
>;
export function List({ className, items, type = 'none' }: ListProps) {
  return (
    <ul className={cn(listVariants({ type }), className)}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
