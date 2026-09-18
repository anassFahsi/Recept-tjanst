import { Router } from "express";
import pool from "../db/pool";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        slug,
        tier,
        price_ore AS "priceOre",
        max_saved_recipes AS "maxSavedRecipes",
        description
      FROM membership_levels
      ORDER BY tier
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch membership levels:", error);

    res.status(500).json({
      message: "Failed to fetch membership levels",
    });
  }
});

export default router;