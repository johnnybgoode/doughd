import type {
  RecipeCreateInput,
  RecipeUpdateInput,
} from '@repo/database/models/Recipe';
import type { RecipePureType } from '@repo/database/schemas';
import httpClient from '@/lib/http';

export const getRecipes = () => httpClient.get<RecipePureType[]>('/api/recipe');
export const getOneRecipe = (id: number) =>
  httpClient.get<RecipePureType>(`/api/recipe/${id}`);
export const getOneRecipeBySlug = (slug: string) =>
  httpClient.get<RecipePureType>(`/api/recipe/by-slug/${slug}`);
export const createOneRecipe = (data: RecipeCreateInput) =>
  httpClient.post<RecipePureType>('/api/recipe', data);
export const updateOneRecipe = (data: RecipeUpdateInput) =>
  httpClient.put<RecipePureType>('/api/recipe', data);
export const deleteOneRecipe = (id: number) =>
  httpClient.delete<RecipePureType>(`/api/recipe/${id}`);
