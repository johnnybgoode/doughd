import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { makeQueryClient } from '@/lib/queryClient';

const mockDependencies = () => {
  const queryClient = makeQueryClient({
    defaultOptions: {
      queries: { gcTime: Number.POSITIVE_INFINITY, retry: false },
    },
  });
  return {
    queryClient,
  } as const;
};

export type ProviderProps = {
  initialEntries?: string[];
};

export const withProviders = (
  ui: ReactElement,
  { initialEntries }: ProviderProps = {},
) => {
  const { queryClient } = mockDependencies();

  return (
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    </MemoryRouter>
  );
};
