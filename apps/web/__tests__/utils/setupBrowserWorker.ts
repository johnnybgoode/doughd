import { setupWorker } from 'msw/browser';
import { defaultRecipe } from './fixtures/recipe';
import {
  makeGetRecipe,
  makeGetRecipes,
  makePostRecipe,
  makePutRecipe,
} from './handlers/recipe';

export const worker = setupWorker(
  makeGetRecipe(defaultRecipe),
  makeGetRecipes([
    defaultRecipe,
    {
      ...defaultRecipe,
      id: 2,
    },
  ]),
  makePostRecipe(),
  makePutRecipe(),
);
