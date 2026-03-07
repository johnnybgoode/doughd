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

    const addIngredientButton = screen.getByRole('button', {
      name: /add ingredient/i,
    });
    await expect.element(addIngredientButton).toBeDisabled();

    const ingredientNameInput = screen.getByRole('textbox', {
      name: /ingredient 1 name/i,
    });
    const ingredientAmountInput = screen.getByRole('spinbutton', {
      name: /ingredient 1 amount/i,
    });
    const ingredientUnitInput = screen.getByRole('textbox', {
      name: /ingredient 1 unit/i,
    });

    await ingredientNameInput.fill('flour');
    await ingredientAmountInput.fill('200');
    await ingredientUnitInput.fill('g');

    await expect.element(ingredientNameInput).toHaveValue('flour');
    await expect.element(ingredientAmountInput).toHaveValue(200);
    await expect.element(ingredientUnitInput).toHaveValue('g');
    await expect.element(addIngredientButton).toBeEnabled();

    const addStepButton = screen.getByRole('button', {
      name: /add step/i,
    });
    await expect.element(addStepButton).toBeDisabled();

    const stepTitleInput = screen.getByRole('textbox', {
      name: /step 1 name/i,
    });
    const stepDescriptionInput = screen.getByRole('textbox', {
      name: /step 1 description/i,
    });
    const stepTimeInput = screen.getByRole('spinbutton', {
      name: /step 1 timer/i,
    });

    await stepTitleInput.fill('Mix dough');
    await stepDescriptionInput.fill('Combine flour and water');
    await stepTimeInput.fill('1000');

    await expect.element(stepTitleInput).toHaveValue('Mix dough');
    await expect
      .element(stepDescriptionInput)
      .toHaveValue('Combine flour and water');
    await expect.element(stepTimeInput).toHaveValue(1000);
    await expect.element(addStepButton).toBeEnabled();
  });
});
