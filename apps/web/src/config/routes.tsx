import { Navigate, type RouteObject } from 'react-router';
import { AppHeader } from '@/components/AppHeader';
import { Loading } from '@/components/Loading';
import { Page } from '@/components/Page';

export const appRoutes: RouteObject[] = [
  {
    element: <Page header={<AppHeader />} />,
    children: [
      {
        path: '/recipes/:slug',
        hydrateFallbackElement: <Loading fullscreen={true} size="lg" />,
        lazy: () =>
          import('@/components/RecipeDetail').then(m => ({
            Component: m.RecipeDetailView,
          })),
      },
      {
        path: '/recipes',
        hydrateFallbackElement: <Loading fullscreen={true} size="lg" />,
        lazy: async () =>
          import('@/components/RecipeListing').then(m => ({
            Component: m.RecipeListing,
          })),
      },
      {
        path: '*',
        element: <Navigate to="/recipes" />,
      },
    ],
  },
];
