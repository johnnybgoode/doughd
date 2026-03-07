import { describe, expect } from 'vitest';
import { RecipeEdit } from '@/components/RecipeForm';
import { makeRecipe } from '../mocks/fixtures/recipe';
import { makeGetRecipe } from '../mocks/handlers/recipe';
import { renderWithRouter, test, waitForLoading } from '../utils/browser';

// import { delay } from '../utils/delay';

describe('RecipeEdit', () => {
  test('edits basic details', async ({ worker }) => {
    worker.use(
      makeGetRecipe(
        makeRecipe({
          id: 1,
        }),
      ),
    );
    const screen = await renderWithRouter(<RecipeEdit />, {
      initialEntries: ['/recipes/1/edit'],
      path: '/recipes/:id/edit',
    });

    await waitForLoading(screen, { strict: false });

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    await titleInput.fill('A tasty recipe');
    await expect.element(titleInput).toHaveValue('A tasty recipe');

    const creditInput = screen.getByRole('textbox', { name: /credit/i });
    await creditInput.fill('Crusty Baker');
    await expect.element(creditInput).toHaveValue('Crusty Baker');
  });
});
