import './global.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/components/App';
import queryClient from '@/lib/queryClient';

const enableMocking = async () => {
  if (!(import.meta.env.DEV && import.meta.env.VITE_MOCK_SERVER === 'true')) {
    return;
  }
  const { worker } = await import('./../__tests__/utils/setupBrowserWorker');
  worker.start({
    onUnhandledRequest: 'bypass',
  });
};

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
