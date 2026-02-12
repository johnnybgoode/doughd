import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router';
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

export const withProviders = (ui: ReactElement) => {
  const { queryClient } = mockDependencies();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    </BrowserRouter>
  );
};
