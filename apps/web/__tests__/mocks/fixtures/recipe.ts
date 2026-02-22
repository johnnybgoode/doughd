import type { RecipeInputType, RecipePureType } from '@repo/database/schemas';

export const defaultRecipe: RecipePureType = {
  id: 1,
  title: 'Best sourdough',
  slug: 'best-sourdough',
  image: '/images/loaf.avif',
  credit: 'The Crusty Baker',
  portions: { value: 1, unit: 'loaf', units: 'loaves' },
  ingredients: [
    { name: 'Starter', value: 100, unit: 'g' },
    { name: 'Flour', value: 200, unit: 'g' },
    { name: 'Water', value: 200, unit: 'g' },
    { name: 'Salt', value: 15, unit: 'g' },
  ],
  steps: [
    {
      title: 'Feed starter',
      description:
        'Mix parts water and flour with 1 part starter (2:2:1)\nCover and let rest for 3-4 hours',
      time: 10 * 1,
    },
    {
      title: 'Mix dough',
      description:
        'Thoroughly mix flour, water and starter\nCover and let rest for 30 miuntes',
      time: 10 * 1,
    },
  ],
  archived: false,
};

export const makeRecipe = <T extends Partial<RecipeInputType & { id: number }>>(
  recipe?: T,
) =>
  ({
    id: 1,
    title: 'My recipe',
    slug: 'my-recipe',
    credit: '',
    portions: {},
    ingredients: [],
    steps: [],
    archived: false,
    ...recipe,
  }) as RecipePureType;
