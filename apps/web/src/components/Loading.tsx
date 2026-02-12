import { Spinner } from '@repo/ui/components/spinner';
import { cn } from '@repo/ui/lib/utils';

type LoadingProps = {
  center?: boolean;
  size?: 'sm' | 'lg';
};
export const Loading = ({ center, size }: LoadingProps) => {
  const className = center ? 'place-content-center' : '';
  const iconSize = size === 'lg' ? 'size-8' : '';
  return (
    <span className={cn('flex', className)}>
      <Spinner className={iconSize} />
    </span>
  );
};
