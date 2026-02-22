export const enableMocking = async () => {
  if (!(import.meta.env.DEV && import.meta.env.VITE_MOCK_SERVER === 'true')) {
    return;
  }
  const { worker } = await import('./setupBrowserWorker');
  worker.start({
    onUnhandledRequest: 'bypass',
  });
};
