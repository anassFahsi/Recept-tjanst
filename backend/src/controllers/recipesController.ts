import pool from "../db/pool";
import { Request, Response } from "express";

// Fetch published recipes
export const getPublishedRecipes = async (req: Request, res: Response) => {
  try {
    const userTier = req.user?.tier ?? 0;

    const result = await pool.query(
      `SELECT r.id, r.title, r.slug, r.image_url, r.intro, r.cook_time_min,
              r.category_id, r.required_level_id,
              ml.tier AS required_tier, ml.name AS required_level_name,
              (ml.tier > $1) AS locked
       FROM recipes r
       JOIN membership_levels ml ON ml.id = r.required_level_id
       WHERE r.is_published = TRUE
       ORDER BY ml.tier ASC, r.created_at DESC`,
      [userTier],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch all recipes
export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, title, slug, image_url, intro, cook_time_min, category_id, required_level_id,is_published
      FROM recipes
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
      [slug],
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
      [recipe.id],
    );

    res.json({
      ...recipe,
      ingredients: ingredientsResult.rows,
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
      required_level_id,
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
        required_level_id,
      ],
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

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Ingrediensen måste ha ett namn" });
    }

    const parsedAmount =
      amount === null || amount === undefined || amount === ""
        ? null
        : Number(amount);

    if (parsedAmount !== null && !Number.isFinite(parsedAmount)) {
      return res.status(400).json({
        error: `"${amount}" är inte ett tal. Skriv till exempel 2 eller 0.5, eller lämna tomt.`,
      });
    }

    if (parsedAmount !== null && parsedAmount < 0) {
      return res.status(400).json({ error: "Mängd kan inte vara negativ" });
    }

    const result = await pool.query(
      `INSERT INTO recipe_ingredients 
        (recipe_id, name, amount, unit, sort_order)
       VALUES 
        ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, name.trim(), parsedAmount, unit?.trim() || null, sort_order ?? 0],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if ((err as { code?: string }).code === "23503") {
      return res.status(404).json({ error: "Receptet finns inte" });
    }
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
      is_published,
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
        id,
      ],
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

// Delete recipe

export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM recipes
       WHERE id = $1
       RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted", recipe: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update ingredients

export const updateIngredient = async (req: Request, res: Response) => {
  try {
    const { id, ingredientId } = req.params;
    const { name, amount, unit, sort_order } = req.body;

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Ingrediensen måste ha ett namn" });
    }

    const parsedAmount =
      amount === null || amount === undefined || amount === ""
        ? null
        : Number(amount);

    if (parsedAmount !== null && !Number.isFinite(parsedAmount)) {
      return res.status(400).json({
        error: `"${amount}" är inte ett tal. Skriv till exempel 2 eller 0.5, eller lämna tomt.`,
      });
    }

    const result = await pool.query(
      `UPDATE recipe_ingredients
       SET 
         name = $1,
         amount = $2,
         unit = $3,
         sort_order = $4
       WHERE id = $5 AND recipe_id = $6
       RETURNING *`,
      [
        name.trim(),
        parsedAmount,
        unit?.trim() || null,
        sort_order ?? 0,
        ingredientId,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch ingredients

export const getIngredientsForRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const recipeCheck = await pool.query(
      `SELECT id FROM recipes WHERE id = $1`,
      [id],
    );

    if (recipeCheck.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const result = await pool.query(
      `SELECT *
       FROM recipe_ingredients
       WHERE recipe_id = $1
       ORDER BY sort_order ASC`,
      [id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
// Delete ingredient
export const deleteIngredient = async (req: Request, res: Response) => {
  try {
    const { id, ingredientId } = req.params;

    const result = await pool.query(
      `DELETE FROM recipe_ingredients
       WHERE id = $1 AND recipe_id = $2
       RETURNING *`,
      [ingredientId, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    res.json({ message: "Ingredient deleted", ingredient: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Search and filter
export const searchRecipes = async (req: Request, res: Response) => {
  try {
    const { q, category } = req.query;

    let query = `
      SELECT *
      FROM recipes r
      WHERE 1=1
    `;
    const params: any[] = [];

    // Sök på titel eller intro
    if (q) {
      query += ` AND (r.title ILIKE $${params.length + 1} OR r.intro ILIKE $${params.length + 2})`;
      params.push(`%${q}%`, `%${q}%`);
    }

    // Filtrera på kategori
    if (category) {
      query += ` AND r.category_id = $${params.length + 1}`;
      params.push(category);
    }

    query += ` ORDER BY r.title ASC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch public recipe by slug, med nivåkontroll
export const getPublicRecipeBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const recipeResult = await pool.query(
      `SELECT r.*, ml.tier AS required_tier, ml.name AS required_level_name
       FROM recipes r
       JOIN membership_levels ml ON ml.id = r.required_level_id
       WHERE r.is_published = TRUE AND r.slug = $1`,
      [slug],
    );

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const recipe = recipeResult.rows[0];
    const userTier = req.user?.tier ?? 0;
    const locked = recipe.required_tier > userTier;

    const base = {
      id: recipe.id,
      title: recipe.title,
      slug: recipe.slug,
      intro: recipe.intro,
      image_url: recipe.image_url,
      cook_time_min: recipe.cook_time_min,
      category_id: recipe.category_id,
      required_level_id: recipe.required_level_id,
      required_tier: recipe.required_tier,
      required_level_name: recipe.required_level_name,
      locked,
    };

    if (locked) {
      const countResult = await pool.query(
        "SELECT COUNT(*)::int AS n FROM recipe_ingredients WHERE recipe_id = $1",
        [recipe.id],
      );
      return res.json({ ...base, ingredient_count: countResult.rows[0].n });
    }

    const ingredientsResult = await pool.query(
      `SELECT id, name, amount, unit, sort_order
       FROM recipe_ingredients
       WHERE recipe_id = $1
       ORDER BY sort_order ASC`,
      [recipe.id],
    );

    res.json({
      ...base,
      instructions: recipe.instructions,
      ingredients: ingredientsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
