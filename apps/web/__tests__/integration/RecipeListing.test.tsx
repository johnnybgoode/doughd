import { waitForElementToBeRemoved } from '@testing-library/react';
import { describe, expect } from 'vitest';
import { RecipeListing } from '@/components/RecipeListing';
import { makeRecipe } from '../utils/fixtures/recipe';
import { makeGetRecipes } from '../utils/handlers/recipe';
import { appRender } from '../utils/render/renderBrowser';
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

    try {
      await waitForElementToBeRemoved(() => screen.getByLabelText('Loading'));
    } catch (__e) {
      // Loading UI already removed
    }

    await expect(screen.getByText(/my recipe/i)).toBeInTheDocument();
    await expect(screen.getByText(/a third recipe/i)).toBeInTheDocument();
    await expect(
      screen.getByRole('button', { hasText: /bake it/i }).length,
    ).toBe(3);
  });

  test('renders error on fetch failure', async ({ worker }) => {
    worker.use(makeGetRecipes(undefined, { status: 500 }));

    const screen = await appRender(<RecipeListing />);

    try {
      await waitForElementToBeRemoved(() => screen.getByLabelText('Loading'));
    } catch (__e) {
      // Loading UI already removed
    }

    await expect(
      screen.getByText(/there was a problem loading your recipes/i),
    ).toBeInTheDocument();
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

    await expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
});
