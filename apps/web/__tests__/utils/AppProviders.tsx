import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, Suspense } from 'react';
import { MemoryRouter } from 'react-router';
import { makeQueryClient } from '@/lib/queryClient';

export type AppDependencies = {
  queryClient: QueryClient;
};

export type AppProviderProps = PropsWithChildren<{
  mockRouter?: boolean;
  initialEntries?: string[];
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

const TestRouter = ({
  children,
  initialEntries,
  mockRouter,
}: Omit<AppProviderProps, 'dependencies'>) => {
  if (mockRouter) {
    return (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    );
  }
  return children;
};

export const AppProviders = ({
  children,
  mockRouter,
  initialEntries,
  dependencies: { queryClient } = mockDependencies(),
}: AppProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TestRouter
        initialEntries={initialEntries}
        mockRouter={mockRouter !== false}
      >
        <Suspense>{children}</Suspense>
      </TestRouter>
    </QueryClientProvider>
  );
};
