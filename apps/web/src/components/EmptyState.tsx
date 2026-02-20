import { Button } from '@repo/ui/components/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@repo/ui/components/empty';
import { type LucideIcon, OctagonAlert } from 'lucide-react';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  action?: ReactNode;
  Icon?: LucideIcon;
  header: string;
  message: ReactNode;
};

export const EmptyState = ({
  action,
  Icon,
  header,
  message,
}: EmptyStateProps) => {
  return (
    <Empty>
      <EmptyHeader>
        {Icon && (
          <div className="py-2">
            <Icon size={48} />
          </div>
        )}
        <EmptyTitle>{header}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>{action}</EmptyDescription>
      </EmptyContent>
    </Empty>
  );
};

export const ErrorEmptyState = ({
  action = <Button onClick={() => window.location.reload()}>Refresh</Button>,
  Icon = OctagonAlert,
  header = 'Something went wrong',
  message = 'There was a problem loading this page. Please try again later.',
}: Partial<EmptyStateProps>) => (
  <div className="min-h-[100%] place-content-center">
    <EmptyState action={action} header={header} Icon={Icon} message={message} />
  </div>
);
