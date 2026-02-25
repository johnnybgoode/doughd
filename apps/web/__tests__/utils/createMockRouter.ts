import { createMemoryRouter, type RouteObject } from 'react-router';
import { appRoutes } from '@/config/routes';

export type RouteMatcher = (route: RouteObject) => boolean;

export type CreateMockRouterOptions = (
  | {
      route?: RouteObject;
      matcher?: never;
    }
  | {
      matcher?: RouteMatcher;
      route?: never;
    }
) & {
  initialEntries?: string[];
};

const getRoute = (matcher: RouteMatcher) =>
  appRoutes[0].children!.find(r => matcher(r));

const getRouteConfig = ({ route, matcher }: CreateMockRouterOptions) => {
  if (route) {
    return route;
  }
  if (matcher && typeof matcher === 'function') {
    const match = getRoute(matcher);
    if (!match) {
      throw new Error(
        `createMockRouter matcher ${matcher} failed to match app route`,
      );
    }
    return match;
  }
  return appRoutes;
};

export const createMockRouter = (options?: CreateMockRouterOptions) => {
  const { initialEntries, ...routeOptions } = options || {};
  const routeConfig = getRouteConfig(routeOptions);
  const routes = 'map' in routeConfig ? routeConfig : [routeConfig];

  return createMemoryRouter(routes, { initialEntries });
};
