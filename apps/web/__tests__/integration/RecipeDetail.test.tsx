import { describe, expect } from 'vitest';
import { RecipeDetail } from '@/components/RecipeDetail';
import { makeRecipe } from '../mocks/fixtures/recipe';
import { makeGetRecipeBySlug } from '../mocks/handlers/recipe';
import { renderWithRouter, test, waitForLoading } from '../utils/browser';
import { delay } from '../utils/delay';

describe('RecipeDetail', () => {
  test('renders ingredients and portions', async ({ worker }) => {
    worker.use(
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
              time: 1,
            },
            {
              title: 'Step 2',
              description: 'Do the first step',
              time: 1,
            },
          ],
        }),
      ),
    );

    const screen = await renderWithRouter(<RecipeDetail />, {
      initialEntries: ['/recipes/my-recipe'],
      path: '/recipes/:slug',
    });

    await expect
      .element(screen.getByRole('heading', { level: 1, name: /my recipe/i }))
      .toBeVisible();
    await expect.element(screen.getByText(/crusty baker/i)).toBeVisible();
    await expect.element(screen.getByText(/flour:\s?100g/i)).toBeVisible();
    await expect.element(screen.getByText(/starter:\s?50g/i)).toBeVisible();
    await expect
      .element(screen.getByRole('button', { hasText: /bake!/i }))
      .toBeVisible();
  });

  test('renders steps', async ({ worker }) => {
    worker.use(
      makeGetRecipeBySlug(
        makeRecipe({
          id: 1,
          title: 'My recipe',
          slug: 'my-recipe-steps',
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
              time: 1,
            },
            {
              title: 'Step 2',
              description: 'Do the first step',
              time: 1,
            },
          ],
        }),
      ),
    );

    const screen = await renderWithRouter(<RecipeDetail />, {
      initialEntries: ['/recipes/my-recipe-steps'],
      path: '/recipes/:slug',
    });

    await screen.getByRole('button', { name: /bake/i }).click();

    await expect.element(screen.getByText(/step 1/i)).toBeVisible();

    await screen.getByRole('button', { name: /start/i }).click();

    await delay(1000); // Wait 1 second for step 1

    await expect.element(screen.getByText(/step 2/i)).toBeVisible();
    await expect
      .element(screen.getByRole('button', { name: /start/i }))
      .toBeVisible();
  });

  test('renders data loading error', async ({ worker }) => {
    worker.use(
      makeGetRecipeBySlug(makeRecipe({ slug: 'my-recipe' }), { status: 500 }),
    );

    const screen = await renderWithRouter(<RecipeDetail />, {
      initialEntries: ['/recipes/my-recipe'],
      matcher: r => r.path === '/recipes/:slug',
    });

    await expect
      .element(screen.getByText(/there was a problem loading this recipe/i))
      .toBeVisible();
  });

  test('renders loading ui', async ({ worker }) => {
    worker.use(makeGetRecipeBySlug(makeRecipe({ slug: 'my-recipe' })));

    const screen = await renderWithRouter(<RecipeDetail />, {
      initialEntries: ['/recipes/my-recipe'],
      matcher: r => r.path === '/recipes/:slug',
    });

    await waitForLoading(screen);
  });
});
