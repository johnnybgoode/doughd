import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@repo/ui/components/empty';
import { Icon, type IconName } from '@repo/ui/components/icon';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  action?: ReactNode;
  icon?: IconName;
  header: string;
  message: ReactNode;
};

export const EmptyState = ({ action, icon, header, message }: EmptyStateProps) => {
  return (
    <Empty>
      <EmptyHeader>
        {icon && (
          <div className="py-2">
            <Icon name={icon} size="48" />
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
