import { describe, expect } from 'vitest';
import { RecipeListing } from '@/components/RecipeListing';
import { makeRecipe } from '../utils/fixtures/recipe';
import { makeGetRecipes } from '../utils/handlers/recipe';
import { appRender, waitForLoading } from '../utils/render/renderBrowser';
import { test } from '../utils/setupWorker';

describe('RecipeListing', () => {
  test('renders recipe cards', async ({ worker }) => {
    worker.use(
      makeGetRecipes([
        makeRecipe({ id: 1, title: 'My recipe' }),
        makeRecipe({ id: 2, title: 'My second recipe' }),
        makeRecipe({ id: 3, title: 'A third recipe' }),
      ]),
    );

    const screen = await appRender(<RecipeListing />);

    await waitForLoading(screen);

    await expect.element(screen.getByText(/my recipe/i)).toBeVisible();
    await expect.element(screen.getByText(/a third recipe/i)).toBeVisible();
    expect(screen.getByRole('button', { hasText: /bake it/i }).length).toBe(3);
  });

  test('renders error on fetch failure', async ({ worker }) => {
    worker.use(makeGetRecipes(undefined, { status: 500 }));

    const screen = await appRender(<RecipeListing />);

    await waitForLoading(screen);

    await expect
      .element(screen.getByText(/there was a problem loading your recipes/i))
      .toBeVisible();
  });

  test('renders loading UI', async ({ worker }) => {
    worker.use(
      makeGetRecipes(
        [
          makeRecipe({ id: 1, title: 'My recipe' }),
          makeRecipe({ id: 2, title: 'My second recipe' }),
          makeRecipe({ id: 3, title: 'A third recipe' }),
        ],
        { delay: 'real' },
      ),
    );

    const screen = await appRender(<RecipeListing />);
    await waitForLoading(screen);
  });
});
