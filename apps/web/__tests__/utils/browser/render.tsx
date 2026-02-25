import { type ReactElement } from 'react';
import { RouterProvider } from 'react-router/dom';
import { type RenderOptions, render } from 'vitest-browser-react';
import { type AppProviderProps, AppProviders } from '../AppProviders';
import { createMockRouter, type RouteMatcher } from '../createMockRouter';

type AppRenderOptions = Omit<AppProviderProps, 'children'> &
  Omit<RenderOptions, 'wrapper'>;
export const appRender = (ui: ReactElement, options?: AppRenderOptions) => {
  const { dependencies, ...renderOptions } = options || {};

  return render(
    <AppProviders {...dependencies}>{ui}</AppProviders>,
    renderOptions,
  );
};

type RenderWithRouterOptions = (
  | {
      path?: string;
      matcher?: never;
    }
  | {
      matcher?: RouteMatcher;
      path?: never;
    }
) & { initialEntries?: string[] };

export const renderWithRouter = (
  element: ReactElement,
  options?: RenderWithRouterOptions & Omit<RenderOptions, 'wrapper'>,
) => {
  const { initialEntries, path, matcher, ...renderOptions } = options || {};
  const routeConfig = matcher
    ? { matcher }
    : {
        element,
        path: path || '/',
      };
  const router = createMockRouter({ initialEntries, ...routeConfig });
  return appRender(<RouterProvider router={router} />, renderOptions);
};
