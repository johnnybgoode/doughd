import { describe, type ExpectPollOptions, expect } from 'vitest';
import type { RenderResult } from 'vitest-browser-react';
import { App } from '@/components/App';
import { makeRecipe } from '../utils/fixtures/recipe';
import { makeGetRecipeBySlug, makeGetRecipes } from '../utils/handlers/recipe';
import { renderWithProviders } from '../utils/render/renderBrowser';
import { test } from '../utils/setupWorker';

const waitForLoading = async (
  screen: RenderResult,
  options?: { strict: boolean } & ExpectPollOptions,
) => {
  const { strict, ...expectOptions } = {
    strict: true,
    timeout: 500,
    ...options,
  };
  try {
    await expect
      .element(screen.getByRole('status', { name: /loading/i }), expectOptions)
      .toBeVisible();
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
  test('renders /recipes route by default', async ({ worker }) => {
    worker.use(
      makeGetRecipes([
        makeRecipe({ id: 1, title: 'My recipe' }),
        makeRecipe({ id: 2, title: 'My second recipe' }),
        makeRecipe({ id: 3, title: 'A third recipe' }),
      ]),
    );

    const screen = await renderWithProviders(<App />);

    await waitForLoading(screen, { strict: false });

    await expect(screen.getByText(/dough'd/i)).toBeInTheDocument();
    await expect(screen.getByText(/my recipe/i)).toBeInTheDocument();
  });

  test('navigates to recipe-details', async ({ worker }) => {
    worker.use(
      makeGetRecipes([
        makeRecipe({ id: 1, title: 'My recipe' }),
        makeRecipe({ id: 2, title: 'My second recipe' }),
        makeRecipe({ id: 3, title: 'A third recipe' }),
      ]),
      makeGetRecipeBySlug(
        makeRecipe({
          id: 1,
          title: 'My recipe',
          slug: 'my-recipe',
          credit: 'Crusty Baker',
          ingredients: [
            {
              name: 'Flour',
              unit: 'g',
              value: 100,
            },
            {
              name: 'Starter',
              unit: 'g',
              value: 50,
            },
          ],
          portions: {
            unit: 'loaf',
            units: 'loaves',
            value: 1,
          },
          steps: [
            {
              title: 'Step 1',
              description: 'Do the first step',
              time: 20,
            },
          ],
        }),
        { delay: 'real' },
      ),
    );

    const screen = await renderWithProviders(<App />);

    await waitForLoading(screen, { strict: false });

    await screen.getByText(/my recipe/i).click();

    await waitForLoading(screen);

    await expect(screen.getByText(/ingredients/i)).toBeInTheDocument();
  });
});
