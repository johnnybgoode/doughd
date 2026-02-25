import {
  type RenderOptions,
  type RenderResult,
  render,
} from '@testing-library/react';
import type { ReactElement } from 'react';
import { RouterProvider } from 'react-router';
import { type AppProviderProps, AppProviders } from '../AppProviders';
import { createMockRouter } from '../createMockRouter';

type Queries = typeof import('@testing-library/dom/types/queries');

type AppRenderOptions = Omit<AppProviderProps, 'children'> &
  Omit<RenderOptions, 'wrapper'>;
export const appRender = (
  ui: ReactElement,
  options?: AppRenderOptions,
): RenderResult<Queries, HTMLElement> => {
  const { dependencies, ...renderOptions } = options || {};

  return render(
    <AppProviders dependencies={dependencies}>{ui}</AppProviders>,
    renderOptions,
  );
};

type RenderWithRouterOptions = {
  initialEntries?: string[];
  path: string;
} & Omit<RenderOptions, 'wrapper'>;

export const renderWithRouter = (
  element: ReactElement,
  options?: RenderWithRouterOptions,
) => {
  const { initialEntries, path, ...renderOptions } = options || {};

  const router = createMockRouter({
    route: {
      element,
      path: path || '/',
    },
    initialEntries,
  });
  return appRender(<RouterProvider router={router} />, renderOptions);
};
