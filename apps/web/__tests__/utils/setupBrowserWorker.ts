import { setupWorker } from 'msw/browser';
import { defaultRecipe } from './fixtures/recipe';
import {
  makeGetRecipe,
  makeGetRecipeBySlug,
  makeGetRecipes,
  makePostRecipe,
  makePutRecipe,
} from './handlers/recipe';

export const worker = setupWorker(
  makeGetRecipe(defaultRecipe, { delay: 'real' }),
  makeGetRecipeBySlug(defaultRecipe, { delay: 'real' }),
  makeGetRecipes(
    [
      defaultRecipe,
      {
        ...defaultRecipe,
        title: 'Dinner rolls',
        id: 2,
      },
      {
        ...defaultRecipe,
        id: 3,
      },
      {
        ...defaultRecipe,
        title: 'Pizza dough',
        id: 4,
      },
      {
        ...defaultRecipe,
        title: 'Dinner rolls',
        id: 5,
      },
      {
        ...defaultRecipe,
        id: 6,
      },
      {
        ...defaultRecipe,
        title: 'Pizza dough',
        id: 7,
      },
    ],
    { delay: 'real' },
  ),
  makePostRecipe(defaultRecipe, { delay: 'real' }),
  makePutRecipe(defaultRecipe, { delay: 'real' }),
);
