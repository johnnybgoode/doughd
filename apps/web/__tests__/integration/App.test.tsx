import { describe, expect } from 'vitest';
import { App } from '@/components/App';
import { defaultRecipe, makeRecipe } from '../mocks/fixtures/recipe';
import { makeGetRecipeBySlug, makeGetRecipes } from '../mocks/handlers/recipe';
import { appRender, test, waitForLoading } from '../utils/browser';
import { createMockRouter } from '../utils/createMockRouter';

describe('App', () => {
  test('displays recipe listing by default', async ({ worker }) => {
    worker.use(
      makeGetRecipes([
        makeRecipe({ id: 1, title: 'My recipe' }),
        makeRecipe({ id: 2, title: 'My second recipe' }),
        makeRecipe({ id: 3, title: 'A third recipe' }),
      ]),
    );

    const screen = await appRender(<App router={createMockRouter()} />);

    await expect
      .element(screen.getByRole('heading', { name: /dough'd/i }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole('link', { name: /my recipe/i }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole('link', { name: /my second recipe/i }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole('link', { name: /a third recipe/i }))
      .toBeInTheDocument();
  });

  test('navigates between recipe-details and listing', async ({ worker }) => {
    worker.use(
      makeGetRecipeBySlug(
        makeRecipe({
          ...defaultRecipe,
          title: 'My recipe',
          slug: 'my-recipe',
        }),
      ),
      makeGetRecipes([
        makeRecipe({ id: 1, title: 'My recipe' }),
        makeRecipe({ id: 2, title: 'My second recipe' }),
        makeRecipe({ id: 3, title: 'A third recipe' }),
      ]),
    );

    const screen = await appRender(<App router={createMockRouter()} />);
    // Detail page
    await screen.getByRole('link', { name: /my recipe/i }).click();
    await expect
      .element(screen.getByRole('heading', { name: /ingredients/i }))
      .toBeInTheDocument();
    // Back to listing
    await screen.getByRole('link', { name: /dough'd/i }).click();
    await expect
      .element(screen.getByRole('link', { name: /my second recipe/i }))
      .toBeInTheDocument();
  });

  test('displays loading ui', async ({ worker }) => {
    worker.use(
      makeGetRecipes([
        makeRecipe({ id: 1, title: 'My recipe' }),
        makeRecipe({ id: 2, title: 'My second recipe' }),
        makeRecipe({ id: 3, title: 'A third recipe' }),
      ]),
      makeGetRecipeBySlug(
        makeRecipe({
          ...defaultRecipe,
          title: 'My recipe',
          slug: 'my-recipe',
        }),
      ),
    );

    const screen = await appRender(<App router={createMockRouter()} />);

    await waitForLoading(screen);
    await screen.getByRole('link', { name: /my recipe/i }).click();
    await waitForLoading(screen);
  });
});
