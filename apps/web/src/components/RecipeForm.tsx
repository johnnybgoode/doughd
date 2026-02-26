import type { RecipePureType } from '@repo/database/schemas';
import { Button } from '@repo/ui/components/button';
import { FieldGroup, FieldLegend, FieldSet } from '@repo/ui/components/field';
import { Image } from '@repo/ui/components/image';
import { Input } from '@repo/ui/components/input';
import { Heading, List } from '@repo/ui/components/typography';
import { useSuspenseQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { type ChangeEvent, useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { recipeQueries, useRecipeStore } from '@/data/recipe';
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

const getUpdatePath = (path: string) => {
  const [index, key] = path.split('-').reverse();
  return [Number(index), key] as const;
};

const IngredientsInput = () => {
  const ingredients = useRecipeStore(state => state.ingredients) || [];
  const updateField = useRecipeStore.use.updateField();

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const [index, key] = getUpdatePath(e.currentTarget.name);
      const nextValue =
        key === 'value' ? Number(e.currentTarget.value) : e.currentTarget.value;

      updateField('ingredients', prev => {
        if (typeof prev === 'undefined') {
          return [{ name: '', value: 0, unit: '' }];
        }
        return prev.map((item, i) =>
          i === Number(index)
            ? {
                ...item,
                [key]: nextValue,
              }
            : item,
        );
      });
    },
    [updateField],
  );

  const onClickAdd = useCallback(() => {
    updateField('ingredients', prev => [
      ...(prev || []),
      { name: '', value: 0, unit: '' },
    ]);
  }, [updateField]);

  const hasEmptyIngredient = useMemo(
    () => Object.values(ingredients[ingredients.length - 1]).some(v => !v),
    [ingredients],
  );

  return (
    <>
      <List
        className="mt-2 mb-0 ml-2"
        items={ingredients.map((ingredient, i) => (
          <div className="flex" key={i}>
            <Input
              className="grow-1"
              defaultValue={ingredient.name}
              name={`name-${i}`}
              onChange={onChange}
            />
            <Input
              className="basis-[45%]"
              defaultValue={ingredient.value}
              name={`value-${i}`}
              onChange={onChange}
              type="number"
            />
            <Input
              className="basis-[25%]"
              defaultValue={ingredient.unit}
              name={`unit-${i}`}
              onChange={onChange}
            />
          </div>
        ))}
      />
      <div className="flex justify-center">
        <Button
          className="size-9 rounded-full"
          disabled={hasEmptyIngredient}
          onClick={onClickAdd}
          variant="outline-primary"
        >
          <PlusIcon className="stroke-3" />
        </Button>
      </div>
    </>
  );
};

const RecipeForm = ({ recipe }: { recipe: RecipePureType | null }) => {
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
        <FieldSet>
          <FieldLegend>
            <Heading className="text-center text-gray-800" level="4">
              Ingredients
            </Heading>
          </FieldLegend>
          <FieldGroup className="justify-start gap-4">
            <IngredientsInput />
          </FieldGroup>
        </FieldSet>
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

  return <RecipeForm recipe={recipe} />;
};
