import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getRecipes } from '@/data/recipe';
import { ErrorEmptyState } from './ErrorEmptyState';
import { Loading } from './Loading';
import { RecipeCard } from './RecipeCard';

const RecipeListingGrid = ({ className }: { className?: string }) => {
  const { data } = useSuspenseQuery({
    queryFn: getRecipes,
    queryKey: ['recipes'],
  });

  const classes = [
    'grid grid-cols-[minmax(1,384px)] gap-4 place-items-center sm:grid-cols-[repeat(2,minmax(0,384px))] lg:grid-cols-[repeat(3,minmax(0,384px))]',
    className,
  ];

  return (
    <div className={classes.join(' ')}>
      {data?.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export const RecipeListing = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorEmptyState}>
      <Suspense fallback={<Loading center={true} size="lg" />}>
        <RecipeListingGrid className="mx-auto max-w-[1280px] flex-grow-1" />
      </Suspense>
    </ErrorBoundary>
  );
};
