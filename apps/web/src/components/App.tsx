import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider, type RouterProviderProps } from 'react-router';
import { ErrorEmptyState } from './EmptyState';

type AppProps = {
  router: RouterProviderProps['router'];
};
export const App = ({ router }: AppProps) => {
  return (
    <ErrorBoundary fallback={<ErrorEmptyState action={null} />}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};
