import  pool  from "../config/db";
import { Request, Response } from "express";

// Get recipes
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

// Get recipe by slug
export const getRecipeBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Hämta receptet
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

    // Hämta ingredienser
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

// Post recipe
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

