import  pool  from "../config/db";
import { Request, Response } from "express";

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
