import { Button } from '@repo/ui/components/button';
import { Image } from '@repo/ui/components/image';
import { Separator } from '@repo/ui/components/separator';
import { Heading } from '@repo/ui/components/typography';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';
import { getOneRecipeBySlug } from '@/data/recipe';
import { ErrorEmptyState } from './EmptyState';
import { RecipeIngredients as Ingredients } from './RecipeIngredients';
import { RecipeSteps as Steps } from './RecipeSteps';

type RecipeDetailProps = {
  slug: string;
};
export function RecipeDetail({ slug }: RecipeDetailProps) {
  const { data: recipe, isLoading } = useSuspenseQuery({
    queryFn: () => getOneRecipeBySlug(slug!),
    queryKey: [`recipe--${slug}`],
  });

  const [isStarted, setIsStarted] = useState(false);

  if (isLoading) {
    return null;
  }
  if (recipe === null) {
    throw new Error('Recipe not found.');
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col items-center px-10">
      <div className="my-8 flex min-w-full">
        {recipe.image && (
          <Image alt={recipe.title} src={recipe.image} width={250} />
        )}
        <div className="ml-10 flex-grow-1 place-content-center text-center">
          <Heading className="mb-2" level="1">
            {recipe.title}
          </Heading>
          <em>{recipe.credit}</em>
        </div>
      </div>
      <div className="mb-4 flex w-full justify-start gap-10">
        {recipe.ingredients && recipe.portions && (
          <div className="min-w-60">
            <Ingredients
              disabled={isStarted}
              ingredients={recipe.ingredients}
              portions={recipe.portions}
            />
          </div>
        )}
        <div className="mx-0 flex-grow-1">
          <Separator />
          {!isStarted && (
            <div className="mt-4 flex justify-center">
              <Button
                className="cursor-pointer px-4"
                disabled={isStarted}
                onClick={() => setIsStarted(true)}
                size="lg"
              >
                Bake!
              </Button>
            </div>
          )}
          {isStarted && recipe.steps && <Steps steps={recipe.steps} />}
        </div>
      </div>
    </div>
  );
}

export const RecipeDetailView = () => {
  const { slug } = useParams();
  if (!slug) {
    throw new Error('Missing recipe slug');
  }

  return (
    <ErrorBoundary
      fallback={
        <ErrorEmptyState message="There was a problem loading this recipe. Please refresh to try again." />
      }
    >
      <RecipeDetail slug={slug} />
    </ErrorBoundary>
  );
};
