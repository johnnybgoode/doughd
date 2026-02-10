import type {
  RecipeCreateInput,
  UserCreateInput,
} from '../generated/prisma/models';
import { prisma } from './client';

const DEFAULT_USERS = [
  {
    name: 'Johnny Appleseed',
    email: 'john@apple.com',
  },
] as Array<Partial<UserCreateInput>>;

const DEFAULT_RECIPES = [
  {
    title: 'Sourdough',
    slug: 'sourdough',
  },
] as Array<RecipeCreateInput>;

(async () => {
  try {
    await Promise.all([
      DEFAULT_USERS.map((user) =>
        prisma.user.upsert({
          where: {
            email: user.email!,
          },
          update: {
            ...user,
          },
          create: {
            ...user,
          },
        }),
      ),
      DEFAULT_RECIPES.map((recipe) =>
        prisma.recipe.upsert({
          where: {
            slug: recipe.slug,
          },
          update: {
            ...recipe,
          },
          create: {
            ...recipe,
          },
        }),
      ),
    ]);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
