import { Image } from '@repo/ui/components/image';
import { Input } from '@repo/ui/components/input';
import { Heading } from '@repo/ui/components/typography';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { recipeQueries, useRecipeStore } from '@/data/recipe';
import { defaultRecipe } from '../../__tests__/mocks/fixtures/recipe';
import { RecipeIngredients as Ingredients } from './RecipeIngredients';
import { RecipeLayout } from './RecipeLayout';

const TitleInput = () => {
  const title = useRecipeStore(useShallow(state => state.title));
  const updateField = useRecipeStore.use.updateField();
  return (
    <Input
      className="w-full text-center"
      defaultValue={title}
      name="title"
      onInput={e => {
        updateField('title', e.currentTarget.value);
      }}
      use="transparent"
    />
  );
};

const CreditInput = () => {
  const credit = useRecipeStore(useShallow(state => state.credit));
  const updateField = useRecipeStore.use.updateField();
  return (
    <Input
      className="px-4 py-1 text-center leading-2"
      defaultValue={credit || undefined}
      name="credit"
      onInput={e => {
        updateField('credit', e.currentTarget.value);
      }}
      use="transparent"
    />
  );
};

const RecipeForm = () => {
  const recipe = defaultRecipe;
  return (
    <RecipeLayout>
      <RecipeLayout.Slot name="Image">
        {recipe?.image && (
          <Image alt={recipe.title} src={recipe.image} width={250} />
        )}
      </RecipeLayout.Slot>
      <RecipeLayout.Slot name="Title">
        <Heading className="mb-2" level="1">
          <TitleInput />
        </Heading>
      </RecipeLayout.Slot>
      <RecipeLayout.Slot name="Credit">
        <CreditInput />
      </RecipeLayout.Slot>
      <RecipeLayout.Slot name="Ingredients">
        {recipe?.ingredients && recipe?.portions && (
          <Ingredients
            disabled={false}
            ingredients={recipe.ingredients}
            portions={recipe.portions}
          />
        )}
      </RecipeLayout.Slot>
      <RecipeLayout.Slot name="Steps"></RecipeLayout.Slot>
    </RecipeLayout>
  );
};

export const RecipeEdit = () => {
  const { id } = useParams();
  const { data: recipe } = useSuspenseQuery(
    recipeQueries.getOneQuery(Number(id!)),
  );
  if (recipe !== null) {
    useRecipeStore.use.setState()(recipe);
  }

  return <RecipeForm />;
};
