import type { RecipeInputType, RecipePureType } from '@repo/database/schemas';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createHttpClient } from '@/lib/createHttpClient';
import { createQueryClient } from '@/lib/createQueryClient';
import { createSelectors } from '@/lib/createSelectors';

export const recipeClient = createHttpClient<
  RecipePureType,
  Required<RecipeInputType>,
  Partial<RecipeInputType> & { id: number }
>('/api/recipe');

export const recipeQueries = createQueryClient('recipes', recipeClient);

const recipeStore = create(
  immer(
    combine(
      {
        recipe: {} as RecipePureType,
      },
      (set, get) => ({
        setRecipe(recipe: RecipePureType) {
          set(state => {
            state.recipe = recipe;
          });
        },
        updateField<K extends keyof RecipeInputType>(
          name: K,
          value: RecipePureType[K],
        ) {
          set(state => {
            state.recipe[name] = value;
          });
        },
      }),
    ),
  ),
);

export const useRecipeStore = createSelectors(recipeStore);
