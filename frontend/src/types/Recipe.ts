import type { Ingredient } from './Ingredient';

export interface Recipe {
  id: number;
  title: string;
  slug: string;
  image_url: string | null;
  intro: string;
  cook_time_min: number | null;
  category_id: number | null;
  required_level_id: number;
  is_published: boolean;
}

/** Svaret från GET /api/recipes/public/:slug */
export interface RecipeDetail extends Recipe {
  locked: boolean;
  required_tier: number;
  required_level_name: string;
  instructions?: string[];
  ingredients?: Ingredient[];
  ingredient_count?: number;
}