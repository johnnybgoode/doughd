import type { RecipeInputType, RecipePureType } from '@repo/database/schemas';
import {
  type DefaultBodyType,
  delay as delayFn,
  HttpResponse,
  http,
  type PathParams,
} from 'msw';
import { makeRecipe } from '../fixtures/recipe';

const defaultHandlerOptions = {
  headers: {
    contentType: 'application/json',
  },
  status: 200,
  delay: 0,
};

type HttpResponseOptions = Parameters<typeof HttpResponse.json>[1] & {
  delay?: Parameters<typeof delayFn>[0];
};

export const makeGetRecipes = (
  recipes?: RecipeInputType[],
  { delay, ...options }: HttpResponseOptions = defaultHandlerOptions,
) =>
  http.get('/api/recipe', async () => {
    await delayFn(delay);
    return HttpResponse.json(recipes?.map(makeRecipe), options);
  });

export const makeGetRecipe = (
  { id, ...rest }: Partial<RecipeInputType> & { id: number },
  { delay, ...options }: HttpResponseOptions = defaultHandlerOptions,
) =>
  http.get<PathParams, DefaultBodyType, RecipePureType>(
    `/api/recipe/${id}`,
    async () => {
      await delayFn(delay);
      return HttpResponse.json(makeRecipe({ id, ...rest }), options);
    },
  );

export const makeGetRecipeBySlug = (
  { slug, ...rest }: Partial<RecipeInputType> & { slug: string },
  { delay, ...options }: HttpResponseOptions = defaultHandlerOptions,
) =>
  http.get<PathParams, DefaultBodyType, RecipePureType>(
    `/api/recipe/by-slug/${slug}`,
    async () => {
      await delayFn(delay);
      return HttpResponse.json(makeRecipe({ slug, ...rest }), options);
    },
  );

export const makePostRecipe = (
  recipe?: RecipeInputType,

  { delay, ...options }: HttpResponseOptions = defaultHandlerOptions,
) =>
  http.post<PathParams, RecipeInputType>('/api/recipe', async ({ request }) => {
    const data = await request.json();
    await delayFn(delay);
    return HttpResponse.json(makeRecipe({ ...recipe, ...data }), options);
  });

export const makePutRecipe = (
  recipe?: RecipeInputType,
  { delay, ...options }: HttpResponseOptions = defaultHandlerOptions,
) =>
  http.put<PathParams, RecipeInputType>('/api/recipe', async ({ request }) => {
    const data = await request.json();
    await delayFn(delay);
    return HttpResponse.json(
      makeRecipe({
        ...recipe,
        ...data,
      }),
      options,
    );
  });

export const makeDeleteRecipe = (
  { id, ...rest }: Partial<RecipeInputType> & { id: number },
  { delay, ...options }: HttpResponseOptions = defaultHandlerOptions,
) =>
  http.delete(`/api/recipe/${id}`, async () => {
    await delayFn(delay);
    return HttpResponse.json({ id, ...rest }, options);
  });
