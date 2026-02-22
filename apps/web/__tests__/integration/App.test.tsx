import { describe, type ExpectPollOptions, expect } from 'vitest';
import type { RenderResult } from 'vitest-browser-react';
import { App } from '@/components/App';
import { appRoutes } from '@/config/routes';
import { defaultRecipe, makeRecipe } from '../mocks/fixtures/recipe';
import { makeGetRecipeBySlug, makeGetRecipes } from '../mocks/handlers/recipe';
import { test } from '../mocks/setupWorker';
import { appRender } from '../utils/renderBrowser';

const waitForLoading = async (
  screen: RenderResult,
  options?: { strict?: boolean } & ExpectPollOptions,
) => {
  const { strict, ...expectOptions } = {
    strict: true,
    timeout: 1000,
    ...options,
  };
  try {
    await expect
      .element(screen.getByRole('status', { name: /loading/i }), expectOptions)
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole('status', { name: /loading/i }), expectOptions)
      .not.toBeInTheDocument();
  } catch (e: unknown) {
    if (strict) {
      throw e;
    }
  }
};

describe('App', () => {
  test('displays recipe listing by default', async ({ worker }) => {
    worker.use(
      makeGetRecipes([
        makeRecipe({ id: 1, title: 'My recipe' }),
        makeRecipe({ id: 2, title: 'My second recipe' }),
        makeRecipe({ id: 3, title: 'A third recipe' }),
      ]),
    );

    const screen = await appRender(<App routeConfig={[...appRoutes]} />, {
      mockRouter: false,
    });

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

    const screen = await appRender(<App routeConfig={[...appRoutes]} />, {
      mockRouter: false,
    });
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

    const screen = await appRender(
      <App routeConfig={[...appRoutes, { path: '/foo' }]} />,
      { mockRouter: false },
    );
    await waitForLoading(screen);
    await screen.getByRole('link', { name: /my recipe/i }).click();
    await waitForLoading(screen);
  });
});
