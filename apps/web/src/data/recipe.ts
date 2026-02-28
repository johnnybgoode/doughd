import type { RecipeInputType, RecipePureType } from '@repo/database/schemas';
import { createHttpClient } from '@/lib/createHttpClient';
import { createQueryClient } from '@/lib/createQueryClient';
import {
  createSelectors,
  createStore,
  createStoreHooks,
} from '@/lib/createStore';

export const recipeClient = createHttpClient<
  RecipePureType,
  Required<RecipeInputType>,
  Partial<RecipeInputType> & { id: number }
>('/api/recipe');

export const recipeQueries = createQueryClient('recipes', recipeClient);

const recipeStore = createStore({} as RecipePureType);
export const useRecipeStore = createSelectors(recipeStore);
export const recipeHooks = createStoreHooks(recipeStore);