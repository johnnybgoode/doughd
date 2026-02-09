import type { Recipe } from '@repo/database';
import { prisma } from '@repo/database';
import type {
  RecipeCreateInput,
  RecipeUpdateInput,
} from '@repo/database/models/Recipe';
import {
  type RecipeInputType,
  RecipeUncheckedCreateInputObjectZodSchema,
  RecipeUncheckedUpdateInputObjectZodSchema,
} from '@repo/database/schemas';
import express, {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from 'express';
import { z } from 'zod';
import { log } from './utils/logger';
import { urlUUID } from './utils/urlUUID';

type RequestWithRecipe = Request & { recipe?: RecipeInputType };

const BASE_ROUTE = '/recipe';

const makeValidator =
  <P extends z.ZodType<RecipeCreateInput | RecipeUpdateInput>>(parser: P) =>
  (req: RequestWithRecipe, res: Response, next: NextFunction) => {
    try {
      // ID can't be changed, omit to avoid parser error.
      const { id: __, ...maybeRecipe } = req.body;

      const recipe = parser.parse(maybeRecipe);
      if (!recipe) {
        res.status(400).json({ status: 400, message: 'Invalid recipe' });
        return;
      }
      req.body = recipe;
      next();
    } catch (e: unknown) {
      log.error(e);
      res.status(400).json({ status: 400, message: 'Invalid recipe' });
    }
  };

const makeLoader =
  (
    loader: <P extends Request['params']>(params: P) => Promise<Recipe | null>,
  ) =>
  async (req: RequestWithRecipe, res: Response, next: NextFunction) => {
    try {
      const recipe = await loader(req.params);
      if (!recipe) {
        res.status(404).json({ status: 404, message: 'Recipe not found' });
        return;
      }
      req.recipe = recipe;
      next();
    } catch (e: unknown) {
      log.error(e);
      res.status(404).json({ status: 404, message: 'Recipe not found' });
    }
  };

const setDefaults = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body.title && !req.body.slug) {
    req.body.slug = req.body.title
      .replace(/[^\w]/g, ' ')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }
  next();
};

export const makeRouter = (): Router => {
  const router = express.Router();
  router.param(
    'recipe_id',
    makeLoader((params) => {
      return prisma.recipe.findFirst({
        where: {
          id: Number(params.recipe_id),
          archived: false,
        },
      });
    }),
  );
  router.param(
    'slug',
    makeLoader((params) => {
      const slug =
        typeof params.slug === 'string' ? params.slug : params.slug.pop();
      return prisma.recipe.findFirst({
        where: {
          slug,
          archived: false,
        },
      });
    }),
  );

  router
    .route(BASE_ROUTE)
    .get(async (req, res) => {
      const includeArchived = req.query.includeArchived;
      const where = includeArchived
        ? {
            OR: [{ archived: true }, { archived: false }],
          }
        : { archived: false };
      const recipes = await prisma.recipe.findMany({
        where,
      });
      return res.json(recipes);
    })
    .post(
      setDefaults,
      makeValidator(RecipeUncheckedCreateInputObjectZodSchema),
      async (req, res) => {
        try {
          const result = await prisma.recipe.create({
            data: req.body,
          });
          res.json(result);
        } catch (e: unknown) {
          log.error(e);
          res
            .status(400)
            .json({ status: 400, message: 'Failed to create recipe' });
        }
      },
    );

  router
    .route(`${BASE_ROUTE}/:recipe_id`)
    .get((req: RequestWithRecipe, res) => {
      res.json(req.recipe);
    })
    .put(
      makeValidator(RecipeUncheckedUpdateInputObjectZodSchema),
      async (req: RequestWithRecipe, res) => {
        try {
          const recipe = {
            ...req.recipe,
            ...req.body,
          };
          const result = await prisma.recipe.update({
            data: recipe,
            where: {
              id: Number(req.params.recipe_id),
            },
          });
          res.json(result);
        } catch (e: unknown) {
          log.error(e);
          res
            .status(400)
            .json({ status: 400, message: 'Failed to update recipe' });
        }
      },
    )
    .delete(async (req: RequestWithRecipe, res) => {
      try {
        const recipe = {
          ...req.recipe,
          slug: req.recipe?.slug + `//archived-${urlUUID()}`,
          archived: true,
        } as ReturnType<typeof RecipeUncheckedUpdateInputObjectZodSchema.parse>;
        const result = await prisma.recipe.update({
          data: recipe,
          where: {
            id: Number(req.params.recipe_id),
          },
        });
        res.json(result);
      } catch (e: unknown) {
        log.error(e);
        res
          .status(500)
          .json({ status: 500, message: 'Failed to delete recipe' });
      }
    });

  router
    .route(`${BASE_ROUTE}/by-slug/:slug`)
    .get(async (req: RequestWithRecipe, res) => {
      res.json(req.recipe);
    });

  return router;
};
