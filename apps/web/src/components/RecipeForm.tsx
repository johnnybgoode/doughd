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
import { Label } from '@repo/ui/components/label';
import { Textarea } from '@repo/ui/components/textarea';
import { Heading, List } from '@repo/ui/components/typography';
import { useSuspenseQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useId, useMemo } from 'react';
import { useParams } from 'react-router';
import { recipeHooks, recipeQueries, useRecipeStore } from '@/data/recipe';
import { RecipeLayout } from './RecipeLayout';

const useHasEmptyLastItem = (items: Record<string, any>[]) => {
  return useMemo(
    () =>
      !!items.length && Object.values(items[items.length - 1]).some(v => !v),
    [items],
  );
};

const TitleInput = () => {
  const { value: title, update } = recipeHooks.useField('title');
  const inputId = useId();
  return (
    <>
      <Label className="hidden" htmlFor={inputId}>
        Title
      </Label>
      <Heading className="mb-2" level="1">
        <Input
          className="w-full text-center"
          defaultValue={title}
          id={inputId}
          name="title"
          onInput={e => update(e.currentTarget.value)}
          type="text"
          use="transparent"
        />
      </Heading>
    </>
  );
};

const CreditInput = () => {
  const { value: credit, update: updateField } = recipeHooks.useField('credit');
  const inputId = useId();
  return (
    <>
      <Label className="hidden" htmlFor={inputId}>
        Credit
      </Label>
      <Input
        className="px-4 py-1 text-center leading-2"
        defaultValue={credit || undefined}
        id={inputId}
        name="credit"
        onInput={e => updateField(e.currentTarget.value)}
        type="text"
        use="transparent"
      />
    </>
  );
};

const IngredientsInput = () => {
  const {
    value: ingredients,
    onAddItem,
    onChangeItem,
  } = recipeHooks.useMultiValueField(
    'ingredients',
    { name: '', value: 0, unit: '' },
    false,
  );
  const hasEmptyLastItem = useHasEmptyLastItem(ingredients);

  return (
    <>
      <List
        className="mt-2 mb-0 ml-2"
        items={ingredients.map((ingredient, i) => (
          <div className="flex" key={i}>
            <Input
              aria-label={`Ingredient ${i} name`}
              className="grow"
              defaultValue={ingredient.name}
              name={`name-${i}`}
              onChange={onChangeItem}
              type="text"
            />
            <Input
              aria-label={`Ingredient ${i} amount`}
              className="basis-[45%]"
              defaultValue={ingredient.value}
              name={`value-${i}`}
              onChange={onChangeItem}
              type="number"
            />
            <Input
              aria-label={`Ingredient ${i} units`}
              className="basis-[25%]"
              defaultValue={ingredient.unit}
              name={`unit-${i}`}
              onChange={onChangeItem}
              type="text"
            />
          </div>
        ))}
      />
      <div className="flex justify-center">
        <Button
          className="size-9 rounded-full"
          disabled={hasEmptyLastItem}
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
  const {
    value: steps,
    onAddItem,
    onChangeItem,
  } = recipeHooks.useMultiValueField('steps', {
    title: '',
    description: '',
    time: 0,
  });
  const hasEmptyLastItem = useHasEmptyLastItem(steps);

  return (
    <>
      {steps.map((step, idx) => (
        <FieldGroup className="gap-3" key={idx}>
          <Field orientation="horizontal">
            <FieldLabel className="flex-no-wrap">{`${idx + 1}`}</FieldLabel>
            <Input
              aria-label={`Step ${idx} name`}
              defaultValue={step.title}
              name={`title-${idx}`}
              onChange={onChangeItem}
              type="text"
            />
          </Field>
          <Field>
            <Textarea
              aria-label={`Step ${idx} description`}
              defaultValue={step.description}
              name={`description-${idx}`}
              onChange={onChangeItem}
            />
          </Field>
          <Field className="flex-wrap" orientation="horizontal">
            <FieldLabel className="basis-1">Time</FieldLabel>
            <Input
              aria-label={`Step ${idx} timer`}
              className="basis-auto"
              defaultValue={step.time}
              onChange={onChangeItem}
              type="number"
            />
            <FieldDescription className="basis-full">
              Time in minutes to wait before starting the next step. Setting a
              time here will enable the timer in baking view.
            </FieldDescription>
          </Field>
          <FieldSeparator className="py-4" />
        </FieldGroup>
      ))}
      <Field>
        <div className="flex justify-center">
          <Button
            className="size-9 rounded-full"
            disabled={hasEmptyLastItem}
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
        <TitleInput />
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
    useRecipeStore.use.setData()(recipe);
  }

  return <RecipeForm recipe={recipe} />;
};
