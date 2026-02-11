import { Heading } from '@repo/ui/components/typography';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getRecipes } from '@/data/recipe';
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
    <>
      <div className="p-8 p-x-4">
        <Heading level="1">Recipes</Heading>
      </div>
      <div className="bg-gray-50 p-4">
        <Suspense>
          <RecipeListingGrid className="mx-auto max-w-[1280px]" />
        </Suspense>
      </div>
    </>
  );
};
