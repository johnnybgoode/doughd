import type { RouteObject } from 'react-router';
import { appRoutes } from '@/config/routes';

type RouteMatcher = (route: RouteObject) => boolean;
export const getRoute = (matcher: RouteMatcher) =>
  appRoutes[0].children!.find(r => matcher(r));
