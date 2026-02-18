import type { IngredientsType, PortionsType } from '@repo/database/schemas';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@repo/ui/components/field';
import { Input } from '@repo/ui/components/input';
import { Heading } from '@repo/ui/components/typography';
import { type ChangeEvent, useId, useState } from 'react';

interface IngredientsProps {
  disabled: boolean;
  ingredients: IngredientsType;
  portions: PortionsType;
}

export function RecipeIngredients({
  disabled,
  ingredients,
  portions,
}: IngredientsProps) {
  const [currentPortion, setCurrentPortion] = useState(portions.value);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextPortion = e.currentTarget.value || 1;
    setCurrentPortion(Number(nextPortion));
  };
  const portionInputId = useId();
  const portionLabel = currentPortion === 1 ? portions.unit : portions.units;
  const portionMultiplier = currentPortion / portions.value;

  return (
    <FieldSet>
      <FieldLegend>
        <Heading className="text-center text-gray-800" level="4">
          Ingredients
        </Heading>
      </FieldLegend>
      <FieldGroup className="justify-start gap-4">
        <Field className="justify-start" orientation="horizontal">
          <FieldLabel className="!grow-0" htmlFor={portionInputId}>
            Makes
          </FieldLabel>
          <Input
            className="max-w-[45%]"
            disabled={disabled}
            id={portionInputId}
            max="13"
            min="1"
            onChange={onChange}
            type="number"
            value={currentPortion}
            width={10}
          />
          <FieldLabel className="justify-end" htmlFor={portionInputId}>
            {portionLabel}
          </FieldLabel>
        </Field>
        <FieldSeparator />
        <ul className="flex flex-col gap-1">
          {ingredients.map(ingredient => {
            return (
              <li
                className="flex justify-between text-sm"
                key={ingredient.name}
              >
                <span className="font-semibold">{ingredient.name}:</span>{' '}
                <span>
                  {ingredient.value * portionMultiplier}
                  {ingredient.unit}
                </span>
              </li>
            );
          })}
        </ul>
      </FieldGroup>
    </FieldSet>
  );
}
