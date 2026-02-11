import type { RecipeModel } from '@repo/database/models/Recipe';
import type { RecipeInputType } from '@repo/database/schemas';
import { type DefaultBodyType, HttpResponse, http, type PathParams } from 'msw';
import { makeRecipe } from '../fixtures/recipe';

export const makeGetRecipes = (recipes?: RecipeInputType[]) =>
  http.get('/api/recipe', () => HttpResponse.json(recipes?.map(makeRecipe)));

export const makeGetRecipe = ({
  id,
  ...rest
}: Partial<RecipeInputType> & { id: number }) =>
  http.get<PathParams, DefaultBodyType, RecipeModel>(`/api/recipe/${id}`, () =>
    HttpResponse.json(makeRecipe({ id, ...rest })),
  );

export const makePostRecipe = (recipe?: RecipeInputType) =>
  http.post<PathParams, RecipeInputType>('/api/recipe', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(makeRecipe({ ...recipe, ...data }));
  });

export const makePutRecipe = (recipe?: RecipeInputType) =>
  http.put<PathParams, RecipeInputType>('/api/recipe', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(
      makeRecipe({
        ...recipe,
        ...data,
      }),
    );
  });

export const makeDeleteRecipe = ({
  id,
  ...rest
}: Partial<RecipeInputType> & { id: number }) =>
  http.delete(`/api/recipe/${id}`, () => HttpResponse.json({ id, ...rest }));
