import type { RecipePureType } from '@repo/database/schemas';
import { Button } from '@repo/ui/components/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@repo/ui/components/field';
import { Image } from '@repo/ui/components/image';
import { Input } from '@repo/ui/components/input';
import { Textarea } from '@repo/ui/components/textarea';
import { Heading, List } from '@repo/ui/components/typography';
import { useSuspenseQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useParams } from 'react-router';
import { recipeHooks, recipeQueries, useRecipeStore } from '@/data/recipe';
import { RecipeLayout } from './RecipeLayout';

const TitleInput = () => {
  const { value: title, update } = recipeHooks.useField('title');
  return (
    <Input
      className="w-full text-center"
      defaultValue={title}
      name="title"
      onInput={e => update(e.currentTarget.value)}
      use="transparent"
    />
  );
};

const CreditInput = () => {
  const { value: credit, update: updateField } = recipeHooks.useField('credit');
  return (
    <Input
      className="px-4 py-1 text-center leading-2"
      defaultValue={credit || undefined}
      name="credit"
      onInput={e => updateField(e.currentTarget.value)}
      use="transparent"
    />
  );
};

const IngredientsInput = () => {
  const { value, onAddItem, onChangeItem } = recipeHooks.useMultiValueField(
    'ingredients',
    { name: '', value: 0, unit: '' },
  );
  const ingredients = value || [];

  const hasEmptyIngredient = useMemo(() => {
    const lastIdx = Math.max(ingredients.length - 1, 0);
    return Object.values(ingredients[lastIdx]).some(v => !v);
  }, [ingredients]);

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
              onChange={onChangeItem}
            />
            <Input
              className="basis-[45%]"
              defaultValue={ingredient.value}
              name={`value-${i}`}
              onChange={onChangeItem}
              type="number"
            />
            <Input
              className="basis-[25%]"
              defaultValue={ingredient.unit}
              name={`unit-${i}`}
              onChange={onChangeItem}
            />
          </div>
        ))}
      />
      <div className="flex justify-center">
        <Button
          className="size-9 rounded-full"
          disabled={hasEmptyIngredient}
          onClick={onAddItem}
          variant="outline-primary"
        >
          <PlusIcon className="stroke-3" />
        </Button>
      </div>
    </>
  );
};

const StepsInput = () => {
  const { value, onAddItem, onChangeItem } = recipeHooks.useMultiValueField(
    'steps',
    {
      title: '',
      description: '',
      time: 0,
    },
  );
  const steps = value || [];

  const isEmptyLastItem = useMemo(() => {
    const lastIdx = Math.max(steps.length - 1, 0);
    return Object.values(steps[lastIdx]).some(v => !v);
  }, [steps]);

  return (
    <>
      {steps.map((step, idx) => (
        <>
          <FieldGroup className="gap-3" key={idx}>
            <Field orientation="horizontal">
              <FieldLabel className="flex-no-wrap">{`${idx + 1}`}</FieldLabel>
              <Input
                defaultValue={step.title}
                name={`title-${idx}`}
                onChange={onChangeItem}
              />
            </Field>
            <Field>
              <Textarea
                defaultValue={step.description}
                name={`description-${idx}`}
                onChange={onChangeItem}
              />
            </Field>
            <Field className="flex-wrap" orientation="horizontal">
              <FieldLabel className="basis-1">Time</FieldLabel>
              <Input
                className="basis-auto"
                defaultValue={step.time}
                onChange={onChangeItem}
              />
              <FieldDescription className="basis-full">
                Time in minutes to wait before starting the next step. Setting a
                time here will enable the timer in baking view.
              </FieldDescription>
            </Field>
          </FieldGroup>
          {idx < steps.length && <FieldSeparator />}
        </>
      ))}
      <Field>
        <div className="flex justify-center">
          <Button
            className="size-9 rounded-full"
            disabled={isEmptyLastItem}
            onClick={onAddItem}
            variant="outline-primary"
          >
            <PlusIcon className="stroke-3" />
          </Button>
        </div>
      </Field>
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
      <RecipeLayout.Slot name="Steps">
        <FieldSet>
          <FieldLegend>
            <Heading className="text-center text-gray-800" level="4">
              Steps
            </Heading>
          </FieldLegend>
          <StepsInput />
        </FieldSet>
      </RecipeLayout.Slot>
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
