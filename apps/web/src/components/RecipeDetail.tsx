import { Button } from '@repo/ui/components/button';
import { Image } from '@repo/ui/components/image';
import { Heading } from '@repo/ui/components/typography';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';
import { getOneRecipeBySlug } from '@/data/recipe';
import { ErrorEmptyState } from './EmptyState';
import { RecipeIngredients as Ingredients } from './RecipeIngredients';
import { RecipeLayout } from './RecipeLayout';
import { RecipeSteps as Steps } from './RecipeSteps';

type RecipeDetailProps = {
  slug: string;
};
export function RecipeDetail({ slug }: RecipeDetailProps) {
  const { data: recipe } = useSuspenseQuery({
    queryFn: () => getOneRecipeBySlug(slug!),
    queryKey: [`recipe--${slug}`],
  });
  const [isStarted, setIsStarted] = useState(false);

  return (
    <RecipeLayout>
      <RecipeLayout.Slot name="Image">
        {recipe?.image && (
          <Image alt={recipe.title} src={recipe.image} width={250} />
        )}
      </RecipeLayout.Slot>
      <RecipeLayout.Slot name="Title">
        <Heading className="mb-2" level="1">
          {recipe?.title}
        </Heading>
      </RecipeLayout.Slot>
      <RecipeLayout.Slot name="Credit">{recipe?.credit}</RecipeLayout.Slot>
      <RecipeLayout.Slot name="Ingredients">
        {recipe?.ingredients && recipe?.portions && (
          <Ingredients
            disabled={isStarted}
            ingredients={recipe.ingredients}
            portions={recipe.portions}
          />
        )}
      </RecipeLayout.Slot>
      <RecipeLayout.Slot name="Steps">
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
        {isStarted && recipe?.steps && <Steps steps={recipe.steps} />}
      </RecipeLayout.Slot>
    </RecipeLayout>
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
