import './global.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { App } from '@/components/App';
import { appRoutes } from '@/config/routes';
import queryClient from '@/lib/queryClient';
import { enableMocking } from '../__tests__/mocks/enableBrowserMocking';

enableMocking()
  .then(async () => {
    const appRouter = createBrowserRouter(appRoutes);
    createRoot(document.getElementById('app')!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App router={appRouter} />
        </QueryClientProvider>
      </StrictMode>,
    );
  })
  .catch((e: unknown) => console.error(e));
