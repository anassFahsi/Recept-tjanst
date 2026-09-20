export type Recipe = {
  id: number;
  title: string;
  intro: string;
  instructions: string[];
  image_url: string;
  cook_time_min: number;
  category_id: number;
  required_level_id: number;
  is_published: boolean;
  slug: string;
};
