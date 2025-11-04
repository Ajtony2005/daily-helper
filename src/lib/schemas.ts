import { z } from "zod";

export const MealItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  calories: z.number().int().nonnegative().optional(),
  notes: z.string().optional(),
  photo: z.string().optional(),
  date: z.string().optional(),
});

export type MealItem = z.infer<typeof MealItemSchema>;

export const RecipeIngredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().optional(),
});

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  ingredients: z.array(RecipeIngredientSchema).optional(),
  steps: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  timeMinutes: z.number().int().nonnegative().optional(),
  image: z.string().url().optional(),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export const InventoryItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  unit: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;

export const TransactionSchema = z.object({
  id: z.string(),
  accountId: z.string().optional(),
  amount: z.number(),
  category: z.string().optional(),
  date: z.string(),
  description: z.string().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
