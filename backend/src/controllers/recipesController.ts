import  pool  from "../config/db";
import { Request, Response } from "express";

// Fetch recipes
export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, title, slug, image_url, intro, cook_time_min, category_id, required_level_id
      FROM recipes
      WHERE is_published = TRUE
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch recipe by slug
export const getRecipeBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const recipeResult = await pool.query(
      `SELECT *
       FROM recipes
       WHERE slug = $1`,
      [slug]
    );

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const recipe = recipeResult.rows[0];

    const ingredientsResult = await pool.query(
      `SELECT id, name, amount, unit, sort_order
       FROM recipe_ingredients
       WHERE recipe_id = $1
       ORDER BY sort_order ASC`,
      [recipe.id]
    );

    res.json({
      ...recipe,
      ingredients: ingredientsResult.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create recipe
export const createRecipe = async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      intro,
      instructions,
      image_url,
      cook_time_min,
      category_id,
      required_level_id
    } = req.body;

    const result = await pool.query(
      `INSERT INTO recipes 
        (title, slug, intro, instructions, image_url, cook_time_min, category_id, required_level_id, is_published)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
       RETURNING *`,
      [
        title,
        slug,
        intro,
        instructions,
        image_url,
        cook_time_min,
        category_id,
        required_level_id
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
 
// Create ingredients
export const addIngredientToRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, amount, unit, sort_order } = req.body;

    const result = await pool.query(
      `INSERT INTO recipe_ingredients 
        (recipe_id, name, amount, unit, sort_order)
       VALUES 
        ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, name, amount, unit, sort_order]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

 // Update recipe
 export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      intro,
      instructions,
      image_url,
      cook_time_min,
      category_id,
      required_level_id,
      is_published
    } = req.body;

    const result = await pool.query(
      `UPDATE recipes
       SET 
         title = $1,
         slug = $2,
         intro = $3,
         instructions = $4,
         image_url = $5,
         cook_time_min = $6,
         category_id = $7,
         required_level_id = $8,
         is_published = $9
       WHERE id = $10
       RETURNING *`,
      [
        title,
        slug,
        intro,
        instructions,
        image_url,
        cook_time_min,
        category_id,
        required_level_id,
        is_published,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
