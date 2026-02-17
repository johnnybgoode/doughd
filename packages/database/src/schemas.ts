// export * from '../generated/prisma/zod/schemas'
import z from 'zod';
import {
  NullableJsonNullValueInputSchema,
  type RecipeInputType as RecipeInputZodType,
  type RecipePureType as RecipePureZodType,
  RecipeUncheckedCreateInputObjectZodSchema as RecipeUncheckedCreateInputObject,
  RecipeUncheckedUpdateInputObjectZodSchema as RecipeUncheckedUpdateInputObject,
} from '../generated/prisma/zod/schemas';

export const IngredientSchema = z.object({
  name: z.string(),
  unit: z.string(),
  value: z.number(),
});
export const IngredientsSchema = z.array(IngredientSchema);
export type IngredientsType = z.infer<typeof IngredientsSchema>;

export const PortionsSchema = z.object({
  unit: z.string(),
  units: z.string(),
  value: z.number(),
});
export type PortionsType = z.infer<typeof PortionsSchema>;

const Step = z.object({
  title: z.string(),
  description: z.string(),
  time: z.optional(z.number()),
});
export const StepsSchema = z.array(Step);
export type StepsType = z.infer<typeof StepsSchema>;

const jsonFieldSchemas = {
  ingredients: z
    .union([NullableJsonNullValueInputSchema, IngredientsSchema])
    .optional(),
  portions: z
    .union([NullableJsonNullValueInputSchema, PortionsSchema])
    .optional(),
  steps: z.union([NullableJsonNullValueInputSchema, StepsSchema]).optional(),
};

export const RecipeUncheckedCreateInputObjectZodSchema =
  RecipeUncheckedCreateInputObject.extend({ ...jsonFieldSchemas });

export const RecipeUncheckedUpdateInputObjectZodSchema =
  RecipeUncheckedUpdateInputObject.extend({
    ...jsonFieldSchemas,
  });

type RecipeJsonFields = {
  ingredients?: IngredientsType;
  portions?: PortionsType;
  steps?: StepsType;
};

export type RecipePureType = Omit<RecipePureZodType, keyof RecipeJsonFields> &
  RecipeJsonFields;

export type RecipeInputType = Omit<RecipeInputZodType, keyof RecipeJsonFields> &
  RecipeJsonFields;
