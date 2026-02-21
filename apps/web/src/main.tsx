import './global.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/components/App';
import queryClient from '@/lib/queryClient';
import { enableMocking } from '../__tests__/mocks/enableBrowserMocking';

enableMocking()
  .then(() => {
    createRoot(document.getElementById('app')!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StrictMode>,
    );
  })
  .catch((e: unknown) => console.error(e));
