import { describe, expect } from 'vitest';
import { RecipeListing } from '@/components/RecipeListing';
import { makeRecipe } from '../mocks/fixtures/recipe';
import { makeGetRecipes } from '../mocks/handlers/recipe';
import { renderWithRouter, test, waitForLoading } from '../utils/browser';

describe('RecipeListing', () => {
  test('renders recipe cards', async ({ worker }) => {
    worker.use(
      makeGetRecipes([
        makeRecipe({ id: 1, title: 'My recipe' }),
        makeRecipe({ id: 2, title: 'My second recipe' }),
        makeRecipe({ id: 3, title: 'A third recipe' }),
      ]),
    );

    const screen = await renderWithRouter(<RecipeListing />, {
      matcher: r => r.path === '/recipes',
      initialEntries: ['/recipes'],
    });

    await waitForLoading(screen, { strict: false });
    await expect.element(screen.getByText(/my recipe/i)).toBeVisible();
    await expect.element(screen.getByText(/a third recipe/i)).toBeVisible();
    expect(screen.getByRole('button', { hasText: /bake it/i }).length).toBe(3);
  });

  test('renders error on fetch failure', async ({ worker }) => {
    worker.use(makeGetRecipes([], { status: 500 }));

    const screen = await renderWithRouter(<RecipeListing />, {
      matcher: r => r.path === '/recipes',
      initialEntries: ['/recipes'],
    });

    await waitForLoading(screen, { strict: false });

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

    const screen = await renderWithRouter(<RecipeListing />, {
      matcher: r => r.path === '/recipes',
      initialEntries: ['/recipes'],
    });

    await waitForLoading(screen);
  });
});
