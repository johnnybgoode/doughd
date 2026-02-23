import type { RecipeInputType, RecipePureType } from '@repo/database/schemas';
import { createHttpClient } from '@/lib/createHttpClient';
import { createQueryClient } from '@/lib/createQueryClient';

export const recipeClient = createHttpClient<
  RecipePureType,
  Required<RecipeInputType>,
  Partial<RecipeInputType> & { id: number }
>('/api/recipe');

export const recipeQueries = createQueryClient('recipes', recipeClient);
