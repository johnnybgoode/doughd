import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren, ReactElement } from 'react';
import { MemoryRouter, type RouteObject } from 'react-router';
import { type RenderOptions, render } from 'vitest-browser-react';
import { makeQueryClient } from '@/lib/queryClient';

export const mockDependencies = (
  dependencies = {
    queryClient: makeQueryClient(),
  },
) => dependencies;

type AppDependencies = {
  queryClient: QueryClient;
};
type WithProvidersOptions = {
  dependencies?: AppDependencies;
} & Omit<RenderOptions, 'wrapper'>;

export const renderWithProviders = (
  ui: ReactElement,
  options?: WithProvidersOptions,
) => {
  const { dependencies, ...renderOptions } = options || {};
  const { queryClient } = dependencies || mockDependencies();
  const AppProviders = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return render(ui, { wrapper: AppProviders, ...renderOptions });
};

type AppRenderOptions = {
  initialEntries?: string[];
  routeConfig?: RouteObject[];
} & WithProvidersOptions;
export const appRender = (ui: ReactElement, options?: AppRenderOptions) => {
  const { initialEntries, routeConfig, ...renderOptions } = options || {};
  // const routes = routeConfig || {
  //   path: '/',
  //   ui,
  // }
  // if (routeConfig && ui === null) createBrowserRouter(routeConfig)
  // elif (!routeConfig && ui) createBrowserRouter({ path: '/', ui })
  // elif (initialEntries && ui) createMemoryRouter({ path: '/', ui }, {initialEntries})
  // if (routeConfig && ui) console.warn('routeconfig and render element are mutually exclusive')

  return renderWithProviders(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>,
    renderOptions,
  );
};

// TODO move to separate `utils` module after separating mocks / utils.
export const delay = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time));
};
