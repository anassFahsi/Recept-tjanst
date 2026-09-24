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

export interface MembershipLevel {
  id: number;
  name: string;
  slug: string;
  tier: number;
  priceOre: number;
  maxSavedRecipes: number | null;
  description: string;
}