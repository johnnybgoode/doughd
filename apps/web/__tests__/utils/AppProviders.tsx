import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, Suspense } from 'react';
import { makeQueryClient } from '@/lib/queryClient';

export type AppDependencies = {
  queryClient: QueryClient;
};

export type AppProviderProps = PropsWithChildren<{
  dependencies?: AppDependencies;
}>;

export const mockDependencies = (
  dependencies = {
    queryClient: makeQueryClient({
      defaultOptions: {
        queries: { gcTime: Number.POSITIVE_INFINITY, retry: false },
      },
    }),
  },
): AppDependencies => dependencies;

export const AppProviders = ({
  children,
  dependencies: { queryClient } = mockDependencies(),
}: AppProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>{children}</Suspense>
    </QueryClientProvider>
  );
};
