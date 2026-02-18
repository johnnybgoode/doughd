import { Spinner } from '@repo/ui/components/spinner';
import { cn } from '@repo/ui/lib/utils';

type LoadingProps = {
  className?: string;
  fullscreen?: boolean;
  size?: 'sm' | 'lg';
};

export const Loading = ({ className, fullscreen, size }: LoadingProps) => {
  const iconSize = size === 'lg' ? 'size-8' : '';
  return fullscreen ? (
    <div className="min-h-[100%] place-content-center justify-items-center">
      <Spinner className={cn(className, iconSize)} />
    </div>
  ) : (
    <span>
      <Spinner className={cn(className, iconSize)} />
    </span>
  );
};
