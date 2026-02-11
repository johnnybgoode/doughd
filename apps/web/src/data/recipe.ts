import type { Recipe } from '@repo/database';
import type {
  RecipeCreateInput,
  RecipeUpdateInput,
} from '@repo/database/models/Recipe';
import httpClient from '@/lib/http';

export const getRecipes = () => httpClient.get<Recipe[]>('/api/recipe');
export const getOneRecipe = (id: number) =>
  httpClient.get<Recipe>(`/api/recipe/${id}`);
export const createOneRecipe = (data: RecipeCreateInput) =>
  httpClient.post<Recipe>('/api/recipe', data);
export const updateOneRecipe = (data: RecipeUpdateInput) =>
  httpClient.put<Recipe>('/api/recipe', data);
export const deleteOneRecipe = (id: number) =>
  httpClient.delete<Recipe>(`/api/recipe/${id}`);
