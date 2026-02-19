import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  createBrowserRouter,
  type RouteObject,
  RouterProvider,
} from 'react-router';
import { appRoutes } from '@/config/routes';
import { ErrorEmptyState } from './EmptyState';

type AppProps = {
  routeConfig?: RouteObject[];
};
export const App = ({ routeConfig }: AppProps) => {
  const routes = routeConfig || appRoutes;
  const appRouter = useMemo(() => createBrowserRouter(routes), [routes]);

  return (
    <ErrorBoundary fallback={<ErrorEmptyState action={null} />}>
      <RouterProvider router={appRouter} />
    </ErrorBoundary>
  );
};
