import { Navigate, type RouteObject } from 'react-router';
import { AppHeader } from '@/components/AppHeader';
import { ErrorEmptyState } from '@/components/EmptyState';
import { Loading } from '@/components/Loading';
import { Page } from '@/components/Page';
import { recipeQueries } from '@/data/recipe';
import queryClient from '@/lib/queryClient';

export const appRoutes: RouteObject[] = [
  {
    element: <Page header={<AppHeader />} />,
    children: [
      {
        path: '/recipes/:slug',
        lazy: () =>
          import('@/components/RecipeDetail').then(m => ({
            Component: m.RecipeDetail,
          })),
        loader: async ({ params }) => {
          const query = recipeQueries.getOneBySlugQuery(params.slug!);
          const data = await queryClient.ensureQueryData(query);
          if (data && data.id) {
            queryClient.setQueryData([query.queryKey[0], data.id], data);
          }
          return data;
        },
        hydrateFallbackElement: <Loading fullscreen={true} size="lg" />,
        errorElement: (
          <ErrorEmptyState message="There was a problem loading this recipe. Please refresh to try again." />
        ),
      },
      {
        path: '/recipes/:id/edit',
        hydrateFallbackElement: <Loading fullscreen={true} size="lg" />,
        lazy: () =>
          import('@/components/RecipeForm').then(m => ({
            Component: m.RecipeEdit,
          })),
        loader: async ({ params }) => {
          const query = recipeQueries.getOneBySlugQuery(params.id!);
          const data = await queryClient.ensureQueryData(query);
          if (data && data.id) {
            queryClient.setQueryData([query.queryKey[0], data.slug], data);
          }
          return data;
        },
      },
      {
        path: '/recipes',
        lazy: async () =>
          import('@/components/RecipeListing').then(m => ({
            Component: m.RecipeListing,
          })),
        loader: async () => {
          return queryClient.ensureQueryData(recipeQueries.getAllQuery());
        },
        hydrateFallbackElement: <Loading fullscreen={true} size="lg" />,
        errorElement: (
          <ErrorEmptyState message="There was a problem loading your recipes. Please refresh to try again." />
        ),
      },
      {
        path: '*',
        element: <Navigate to="/recipes" />,
      },
    ],
  },
] as const;
