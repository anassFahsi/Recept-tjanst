import { Router } from "express";
import { getAllRecipes } from "../controllers/recipesController";
import { getRecipeBySlug } from "../controllers/recipesController";

const router = Router();

router.get("/", getAllRecipes);
router.get("/:slug",getRecipeBySlug);





export default router;
