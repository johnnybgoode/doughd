import { Button } from '@repo/ui/components/button';
import { Image } from '@repo/ui/components/image';
import { Heading } from '@repo/ui/components/typography';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router';
import { recipeQueries } from '@/data/recipe';
import { RecipeIngredients as Ingredients } from './RecipeIngredients';
import { RecipeLayout } from './RecipeLayout';
import { RecipeSteps as Steps } from './RecipeSteps';

export function RecipeDetail() {
  const { slug } = useParams();
  const { data: recipe } = useSuspenseQuery(
    recipeQueries.getOneBySlugQuery(slug!),
  );
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
