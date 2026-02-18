import type { PropsWithChildren, ReactNode } from 'react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation } from 'react-router';
import { ErrorEmptyState } from './EmptyState';
import { Loading } from './Loading';

type PageProps = PropsWithChildren<{ header: ReactNode }>;

export const Page = ({ children, header }: PageProps) => {
  const location = useLocation();
  return (
    <div className="position-relative min-h-screen overflow-hidden">
      <div className="flex h-screen flex-col">
        {header && <div className="p-6">{header}</div>}
        <div className="flex-1 overflow-y-scroll bg-gray-50 p-4">
          <ErrorBoundary fallback={<ErrorEmptyState action={null} />}>
            <Suspense
              fallback={<Loading fullscreen={true} size="lg" />}
              key={location.key}
            >
              {children}
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
