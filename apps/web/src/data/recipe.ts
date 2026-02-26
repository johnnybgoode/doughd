import type { RecipeInputType, RecipePureType } from '@repo/database/schemas';
import { createHttpClient } from '@/lib/createHttpClient';
import { createQueryClient } from '@/lib/createQueryClient';
import { createSelectors, createStore } from '@/lib/createStore';

export const recipeClient = createHttpClient<
  RecipePureType,
  Required<RecipeInputType>,
  Partial<RecipeInputType> & { id: number }
>('/api/recipe');

export const recipeQueries = createQueryClient('recipes', recipeClient);

export const recipeStore = createStore<RecipePureType>({} as RecipePureType);
export const useRecipeStore = createSelectors(recipeStore);
