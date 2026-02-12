import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router';
import { render } from 'vitest-browser-react';
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

const appRender = (ui: ReactElement) => {
  const { queryClient } = mockDependencies();

  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    </BrowserRouter>,
  );
};

export { appRender };
