import { cn } from '@repo/ui/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { recipeQueries } from '@/data/recipe';
import { RecipeCard } from './RecipeCard';

export const RecipeListing = () => {
  const { data } = useSuspenseQuery(recipeQueries.getAllQuery());

  const classes = [
    'mx-auto max-w-[1280px] flex-grow-1',
    'grid grid-cols-[minmax(1,384px)] gap-4 place-items-center sm:grid-cols-[repeat(2,minmax(0,384px))] lg:grid-cols-[repeat(3,minmax(0,384px))]',
  ];

  return (
    <div className={cn(classes)}>
      {data?.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};
